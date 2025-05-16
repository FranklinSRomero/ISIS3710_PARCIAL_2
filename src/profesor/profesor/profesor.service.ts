/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEntity } from '../profesor.entity/profesor.entity';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../shared/errors/business-errors';

@Injectable()
export class ProfesorService {
  //crearProfesor() – Validar extensión con exactamente 5 dígitos,
  //- asignarEvaluador() - Solo si el profesor tiene menos de 3 evaluaciones activas

  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async findOne(id: number): Promise<ProfesorEntity> {
    const profesor = await this.profesorRepository.findOne({
      where: { id },
      relations: ["evaluaciones", "proyectos"]
    });
    if (!profesor)
      throw new BusinessLogicException(
        'El profesor con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return profesor;
  }

  async findAll(): Promise<ProfesorEntity[]> {
    return await this.profesorRepository.find({ relations: ["evaluaciones", "proyectos"] });
  }

  async create(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    // Validar extensión con exactamente 5 dígitos
    if (profesor.extension.toString().length !== 5) {
      throw new BusinessLogicException(
        'La extensión debe tener exactamente 5 dígitos',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.profesorRepository.save(profesor);
  }

  async asignarEvaluador(profesorId: number, evaluacionId: number): Promise<ProfesorEntity> {
    const profesor = await this.profesorRepository.findOne({
      where: { id: profesorId },
      relations: ["evaluaciones"]
    });
    
    if (!profesor)
      throw new BusinessLogicException(
        'El profesor con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    // Verificar si el profesor tiene menos de 3 evaluaciones activas
    if (profesor.evaluaciones && profesor.evaluaciones.length >= 3) {
      throw new BusinessLogicException(
        'El profesor ya tiene 3 o más evaluaciones activas',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const evaluacion = await this.evaluacionRepository.findOne({
      where: { id: evaluacionId },
      relations: ["proyecto"]
    });

    if (!evaluacion)
      throw new BusinessLogicException(
        'La evaluación con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    
    // Asignamos el profesor como evaluador
    evaluacion.evaluador = profesor;
    await this.evaluacionRepository.save(evaluacion);
    
    const updatedProfesor = await this.profesorRepository.findOne({
      where: { id: profesorId },
      relations: ["evaluaciones"]
    });

    if (!updatedProfesor) {
      throw new BusinessLogicException(
        'El profesor con el id dado no fue encontrado después de asignar la evaluación',
        BusinessError.NOT_FOUND,
      );
    }
    return updatedProfesor;
  }

  async update(id: number, profesor: ProfesorEntity): Promise<ProfesorEntity> {
    const persistedProfesor = await this.profesorRepository.findOne({
      where: { id },
      relations: ["evaluaciones", "proyectos"]
    });
    
    if (!persistedProfesor)
      throw new BusinessLogicException(
        'El profesor con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    
    // Validar extensión con exactamente 5 dígitos si se está actualizando
    if (profesor.extension !== undefined && profesor.extension.toString().length !== 5) {
      throw new BusinessLogicException(
        'La extensión debe tener exactamente 5 dígitos',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    
    return await this.profesorRepository.save({
      ...persistedProfesor,
      ...profesor,
      id: persistedProfesor.id  // Aseguramos que no se cambie el ID
    });
  }

  async delete(id: number): Promise<void> {
    const profesor = await this.profesorRepository.findOne({
      where: { id },
      relations: ["evaluaciones", "proyectos"]
    });
    
    if (!profesor)
      throw new BusinessLogicException(
        'El profesor con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
      
    // Verificar si el profesor tiene proyectos o evaluaciones asignadas
    if ((profesor.proyectos && profesor.proyectos.length > 0) || 
        (profesor.evaluaciones && profesor.evaluaciones.length > 0)) {
      throw new BusinessLogicException(
        'No se puede eliminar un profesor con proyectos o evaluaciones asignadas',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    
    await this.profesorRepository.remove(profesor);
  }

}
