/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from '../proyecto.entity/proyecto.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';

@Injectable()
export class ProyectoService {
  //crearProyecto () - Valide que el presupuesto > 0, |titulo| > 15.
  //- avanzarProyecto(id), - Un proyecto puede tener un estado entre 0 y 4, se debe
  // sumar 1 en cada llamado y manejar el caso si un proyecto ya esta en su máximo estado.
  // - findAllEstudiantes() – Retorna el listado de todos los estudiantes relacionados al proyecto

  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async create(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto <= 0) {
      throw new Error('El presupuesto debe ser mayor a 0');
    }
    if (proyecto.titulo.length <= 15) {
      throw new Error('El título debe tener más de 15 caracteres');
    }
    return await this.proyectoRepository.save(proyecto);
  }

  async avanzarProyecto(id: string): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new Error('El proyecto no existe');
    }
    if (proyecto.estado >= 4) {
      throw new Error('El proyecto ya está en su máximo estado');
    }
    proyecto.estado += 1;
    return await this.proyectoRepository.save(proyecto);
  }

  async findAllEstudiantes(id: string): Promise<EstudianteEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new Error('El proyecto no existe');
    }
    if (!proyecto.estudiante) {
      throw new Error('El proyecto no tiene estudiante asignado');
    }
    return proyecto.estudiante;
  }
}
