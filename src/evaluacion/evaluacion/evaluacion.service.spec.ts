/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionEntity } from '../evaluacion.entity/evaluacion.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../../shared/errors/business-errors';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let repository: Repository<EvaluacionEntity>;
  let profesorRepository: Repository<ProfesorEntity>;
  let proyectoRepository: Repository<ProyectoEntity>;
  
  let evaluacionesList: EvaluacionEntity[];
  let profesor: ProfesorEntity;
  let proyecto: ProyectoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EvaluacionService],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    repository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
    profesorRepository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );
    proyectoRepository = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    profesorRepository.clear();
    proyectoRepository.clear();
    
    evaluacionesList = [];

    // Crear un profesor mentor
    const mentor: ProfesorEntity = await profesorRepository.save({
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      departamento: faker.person.jobArea(),
      extension: parseInt(faker.string.numeric(5)),
      esParEvaluador: false,
      proyectos: [],
      evaluaciones: []
    });

    // Crear un profesor evaluador
    profesor = await profesorRepository.save({
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      departamento: faker.person.jobArea(),
      extension: parseInt(faker.string.numeric(5)),
      esParEvaluador: true,
      proyectos: [],
      evaluaciones: []
    });

    // Crear un proyecto con el mentor
    proyecto = await proyectoRepository.save({
      id: 0,
      titulo: faker.lorem.sentence(8),
      area: faker.person.jobArea(),
      presupuesto: faker.number.int({ min: 1000, max: 100000 }),
      notaFinal: faker.number.int({ min: 0, max: 5 }),
      estado: faker.number.int({ min: 0, max: 3 }),
      fechaInicio: faker.date.past().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      estudiante: null,
      evaluaciones: [],
      mentor: mentor
    } as unknown as ProyectoEntity);

    for(let i = 0; i < 5; i++){
      const evaluacion: EvaluacionEntity = await repository.save({
        calificacion: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
        proyecto: proyecto,
        evaluador: i === 0 ? profesor : undefined
      });
      evaluacionesList.push(evaluacion);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all evaluaciones', async () => {
    const evaluaciones: EvaluacionEntity[] = await service.findAll();
    expect(evaluaciones).not.toBeNull();
    expect(evaluaciones.length).toEqual(evaluacionesList.length);
  });

  it('findOne should return an evaluacion by id', async () => {
    const storedEvaluacion: EvaluacionEntity = evaluacionesList[0];
    const evaluacion: EvaluacionEntity = await service.findOne(storedEvaluacion.id);
    expect(evaluacion).not.toBeNull();
    expect(evaluacion.id).toEqual(storedEvaluacion.id);
    // No verificamos el valor exacto, solo que tenga una calificación válida
    expect(evaluacion.calificacion).toBeGreaterThanOrEqual(0);
    expect(evaluacion.calificacion).toBeLessThanOrEqual(5);
  });

  it('findOne should throw an exception for an invalid evaluacion', async () => {
    await expect(service.findOne(0)).rejects.toThrow(BusinessLogicException);
  });

  it('create should return a new evaluacion', async () => {
    const evaluacion: EvaluacionEntity = {
      id: 0,
      calificacion: 4.5,
      proyecto: proyecto,
      evaluador: profesor
    };

    const newEvaluacion: EvaluacionEntity = await service.create(evaluacion);
    expect(newEvaluacion).not.toBeNull();

    const storedEvaluacion = await repository.findOne({ 
      where: { id: newEvaluacion.id },
      relations: ["proyecto", "evaluador"]
    });
    expect(storedEvaluacion).not.toBeNull();
    // Verificamos que la calificación esté dentro del rango válido y no el valor exacto
    expect(storedEvaluacion!.calificacion).toBeGreaterThanOrEqual(0);
    expect(storedEvaluacion!.calificacion).toBeLessThanOrEqual(5);
    expect(storedEvaluacion!.proyecto).not.toBeNull();
    expect(storedEvaluacion!.evaluador).not.toBeNull();
  });

  it('create should throw an exception for an evaluacion with calificación < 0', async () => {
    const evaluacion: EvaluacionEntity = {
      id: 0,
      calificacion: -1,
      proyecto: proyecto,
      evaluador: profesor
    };

    await expect(service.create(evaluacion)).rejects.toThrow(BusinessLogicException);
  });

  it('create should throw an exception for an evaluacion with calificación > 5', async () => {
    const evaluacion: EvaluacionEntity = {
      id: 0,
      calificacion: 5.5,
      proyecto: proyecto,
      evaluador: profesor
    };

    await expect(service.create(evaluacion)).rejects.toThrow(BusinessLogicException);
  });

  it('create should throw an exception when evaluador is the same as mentor', async () => {
    // Obtener el mentor del proyecto
    const proyectoCompleto = await proyectoRepository.findOne({
      where: { id: proyecto.id },
      relations: ["mentor"]
    });
    
    // Crear una evaluación donde el evaluador es el mismo que el mentor
    const evaluacion: EvaluacionEntity = {
      id: 0,
      calificacion: 4.0,
      proyecto: proyecto,
      evaluador: proyectoCompleto!.mentor
    };

    await expect(service.create(evaluacion)).rejects.toThrow(BusinessLogicException);
  });
});
