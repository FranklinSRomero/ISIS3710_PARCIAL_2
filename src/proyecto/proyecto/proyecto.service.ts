/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from '../proyecto.entity/proyecto.entity';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../shared/errors/business-errors';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async findOne(id: number): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: ["estudiante", "mentor", "evaluaciones"]
    });
    if (!proyecto)
      throw new BusinessLogicException(
        'El proyecto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return proyecto;
  }

  async findAll(): Promise<ProyectoEntity[]> {
    return await this.proyectoRepository.find({ 
      relations: ["estudiante", "mentor", "evaluaciones"] 
    });
  }

  async create(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto <= 0) {
      throw new BusinessLogicException(
        'El presupuesto debe ser mayor a 0',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    if (proyecto.titulo.length <= 15) {
      throw new BusinessLogicException(
        'El título debe tener más de 15 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.proyectoRepository.save(proyecto);
  }

  async avanzarProyecto(id: number): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new BusinessLogicException(
        'El proyecto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    if (proyecto.estado >= 4) {
      throw new BusinessLogicException(
        'El proyecto ya está en su máximo estado',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    proyecto.estado += 1;
    return await this.proyectoRepository.save(proyecto);
  }

  async findAllEstudiantes(id: number): Promise<EstudianteEntity> {
    const proyecto = await this.proyectoRepository.findOne({ 
      where: { id },
      relations: ["estudiante"]
    });
    if (!proyecto) {
      throw new BusinessLogicException(
        'El proyecto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    if (!proyecto.estudiante) {
      throw new BusinessLogicException(
        'El proyecto no tiene estudiante asignado',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return proyecto.estudiante;
  }
}
