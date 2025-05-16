/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionEntity } from '../evaluacion.entity/evaluacion.entity';
import { Repository } from 'typeorm';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../shared/errors/business-errors';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async findAll(): Promise<EvaluacionEntity[]> {
    return await this.evaluacionRepository.find({ 
      relations: ["proyecto", "evaluador"] 
    });
  }

  async findOne(id: number): Promise<EvaluacionEntity> {
    const evaluacion = await this.evaluacionRepository.findOne({
      where: { id },
      relations: ["proyecto", "evaluador"]
    });
    if (!evaluacion)
      throw new BusinessLogicException(
        'La evaluación con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return evaluacion;
  }

  async create(evaluacion: EvaluacionEntity): Promise<EvaluacionEntity> {
    // Validar calificación entre 0 y 5
    if (evaluacion.calificacion < 0 || evaluacion.calificacion > 5) {
      throw new BusinessLogicException(
        'La calificación debe estar entre 0 y 5',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Obtener proyecto con su mentor
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: evaluacion.proyecto.id },
      relations: ["mentor"]
    });

    if (!proyecto) {
      throw new BusinessLogicException(
        'El proyecto no existe',
        BusinessError.NOT_FOUND,
      );
    }

    // Validar que evaluador ≠ mentor
    if (proyecto.mentor && evaluacion.evaluador && 
        proyecto.mentor.id === evaluacion.evaluador.id) {
      throw new BusinessLogicException(
        'El evaluador no puede ser el mismo que el mentor del proyecto',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.evaluacionRepository.save(evaluacion);
  }
}
