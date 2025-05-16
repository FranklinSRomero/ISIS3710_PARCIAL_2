/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from '../proyecto.entity/proyecto.entity';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../../shared/errors/business-errors';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let repository: Repository<ProyectoEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let proyectosList: ProyectoEntity[];
  let estudiante: EstudianteEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProyectoService],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    repository = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    estudianteRepository.clear();
    
    proyectosList = [];
    
    estudiante = await estudianteRepository.save({
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      semestre: faker.number.int({ min: 4, max: 10 }),
      programa: faker.person.jobArea(),
      promedio: faker.number.float({ min: 3.3, max: 5.0, fractionDigits: 1 }),
      proyectos: []
    });

    for(let i = 0; i < 5; i++){
      const proyecto: ProyectoEntity = await repository.save({
        id: undefined,
        titulo: faker.lorem.sentence(8),
        area: faker.person.jobArea(),
        presupuesto: faker.number.int({ min: 1000, max: 100000 }),
        notaFinal: faker.number.int({ min: 0, max: 5 }),
        estado: faker.number.int({ min: 0, max: 3 }),
        fechaInicio: faker.date.past().toISOString(),
        fechaFin: faker.date.future().toISOString(),
        estudiante: i === 0 ? estudiante : undefined,
        evaluaciones: [],
        mentor: undefined
      } as unknown as ProyectoEntity);
      proyectosList.push(proyecto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new proyecto', async () => {
    const proyecto = {
      id: 0,
      titulo: faker.lorem.sentence(8), // Asegurar más de 15 caracteres
      area: faker.person.jobArea(),
      presupuesto: 5000,
      notaFinal: 0,
      estado: 0,
      fechaInicio: faker.date.past().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      estudiante: null,
      evaluaciones: [],
      mentor: null
    } as unknown as ProyectoEntity;

    const newProyecto: ProyectoEntity = await service.create(proyecto);
    expect(newProyecto).not.toBeNull();

    const storedProyecto = await repository.findOne({ where: { id: newProyecto.id } });
    expect(storedProyecto).not.toBeNull();
    expect(storedProyecto!.titulo).toEqual(proyecto.titulo);
    expect(storedProyecto!.area).toEqual(proyecto.area);
    expect(storedProyecto!.presupuesto).toEqual(proyecto.presupuesto);
  });

  it('create should throw an exception for a proyecto with presupuesto <= 0', async () => {
    const proyecto = {
      id: 0,
      titulo: faker.lorem.sentence(8),
      area: faker.person.jobArea(),
      presupuesto: 0,
      notaFinal: 0,
      estado: 0,
      fechaInicio: faker.date.past().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      estudiante: null,
      evaluaciones: [],
      mentor: null
    } as unknown as ProyectoEntity;

    await expect(service.create(proyecto)).rejects.toThrow(BusinessLogicException);
  });

  it('create should throw an exception for a proyecto with titulo length <= 15', async () => {
    const proyecto = {
      id: 0,
      titulo: "Corto",
      area: faker.person.jobArea(),
      presupuesto: 5000,
      notaFinal: 0,
      estado: 0,
      fechaInicio: faker.date.past().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      estudiante: null,
      evaluaciones: [],
      mentor: null
    } as unknown as ProyectoEntity;

    await expect(service.create(proyecto)).rejects.toThrow(BusinessLogicException);
  });

  it('avanzarProyecto should increase project state', async () => {
    const proyecto = proyectosList[0];
    const initialState = proyecto.estado;

    const updatedProyecto = await service.avanzarProyecto(proyecto.id);
    
    expect(updatedProyecto).not.toBeNull();
    expect(updatedProyecto.estado).toEqual(initialState + 1);
  });

  it('avanzarProyecto should throw an exception for a project in maximum state', async () => {
    const proyecto = proyectosList[0];
    proyecto.estado = 4;
    await repository.save(proyecto);

    await expect(service.avanzarProyecto(proyecto.id)).rejects.toThrow(BusinessLogicException);
  });

  it('findAllEstudiantes should return the student related to the project', async () => {
    const proyecto = proyectosList[0]; // Este proyecto tiene estudiante según seedDatabase
    
    const foundEstudiante = await service.findAllEstudiantes(proyecto.id);
    
    expect(foundEstudiante).not.toBeNull();
    expect(foundEstudiante.id).toEqual(estudiante.id);
  });

  it('findAllEstudiantes should throw an exception for a project without student', async () => {
    const proyecto = proyectosList[1]; // Este proyecto no tiene estudiante según seedDatabase
    
    await expect(service.findAllEstudiantes(proyecto.id)).rejects.toThrow(BusinessLogicException);
  });
});
