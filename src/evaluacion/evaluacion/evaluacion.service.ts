/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionEntity } from '../evaluacion.entity/evaluacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  //crearEvaluación() - Validar que evaluador ≠ mentor, calificación entre 0 y 5

  async create(evaluacion: EvaluacionEntity): Promise<EvaluacionEntity> {
    return await this.evaluacionRepository.save(evaluacion);
  }
}
