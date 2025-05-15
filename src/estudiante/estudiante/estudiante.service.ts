/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EstudianteEntity } from '../estudiante.entity/estudiante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class EstudianteService {
  //crearEstudiante() – Solo permitir si el promedio es mayor a 3.2 y semestre ≥ 4
  //eliminarEstudiante(id), No se puede eliminar si tiene proyectos activo

  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    return await this.estudianteRepository.save(estudiante);
  }

  async delete(id: string) {
    const estudiante: EstudianteEntity =
      await this.estudianteRepository.findOne({ where: { id } });
    if (!estudiante)
      throw new BusinessLogicException(
        'The museum with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.estudianteRepository.remove(estudiante);
  }
}
