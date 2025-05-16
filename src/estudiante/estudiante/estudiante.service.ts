/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EstudianteEntity } from '../estudiante.entity/estudiante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import {
  BusinessError,
  BusinessLogicException,
} from '../../shared/errors/business-errors';

@Injectable()
export class EstudianteService {
  //crearEstudiante() – Solo permitir si el promedio es mayor a 3.2 y semestre ≥ 4
  //eliminarEstudiante(id), No se puede eliminar si tiene proyectos activos

  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async findOne(id: number): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ["proyectos"]
    });
    if (!estudiante)
      throw new BusinessLogicException(
        'El estudiante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return estudiante;
  }

  async findAll(): Promise<EstudianteEntity[]> {
    return await this.estudianteRepository.find({ relations: ["proyectos"] });
  }

  async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    if (estudiante.promedio <= 3.2) {
      throw new BusinessLogicException(
        'El promedio debe ser mayor a 3.2',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    if (estudiante.semestre < 4) {
      throw new BusinessLogicException(
        'El semestre debe ser mayor o igual a 4',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.estudianteRepository.save(estudiante);
  }

  async delete(id: number) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ["proyectos"]
    });
    if (!estudiante)
      throw new BusinessLogicException(
        'El estudiante con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    
    // Verificar si tiene proyectos activos (estado menor a 4)
    const proyectosActivos = estudiante.proyectos.filter(p => p.estado < 4);
    if (proyectosActivos.length > 0) {
      throw new BusinessLogicException(
        'No se puede eliminar un estudiante con proyectos activos',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    await this.estudianteRepository.remove(estudiante);
  }
}
