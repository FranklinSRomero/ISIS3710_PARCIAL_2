/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorEntity } from '../profesor.entity/profesor.entity';

@Injectable()
export class ProfesorService {
  //crearProfesor() – Validar extensión con exactamente 5 dígitos,
  //- asignarEvaluacion() - Solo si el profesor tiene menos de 3 evaluaciones activas

  constructor(
      @InjectRepository(ProfesorEntity)
      private readonly profesorRepository: Repository<ProfesorEntity>,
    ) {}

  async create(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    return await this.profesorRepository.save(profesor);
  }

  async update


  async update(id: string, museum: MuseumEntity): Promise<MuseumEntity> {
    const persistedMuseum: MuseumEntity = await this.museumRepository.findOne({where:{id}});
    if (!persistedMuseum)
      throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
    
    return await this.museumRepository.save({...persistedMuseum, ...museum});
}

}
