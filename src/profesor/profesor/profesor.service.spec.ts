/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorService } from './profesor.service';
import { ProfesorEntity } from '../profesor.entity/profesor.entity';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../../shared/errors/business-errors';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let profesorRepository: Repository<ProfesorEntity>;
  let evaluacionRepository: Repository<EvaluacionEntity>;
  let profesoresList: ProfesorEntity[];
  let evaluacionesList: EvaluacionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorService],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    profesorRepository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );
    evaluacionRepository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await profesorRepository.clear();
    await evaluacionRepository.clear();
    
    profesoresList = [];
    evaluacionesList = [];

    for(let i = 0; i < 5; i++){
      const profesor: ProfesorEntity = await profesorRepository.save({
        cedula: parseInt(faker.string.numeric(8)),
        nombre: faker.person.fullName(),
        departamento: faker.person.jobArea(),
        extension: parseInt(faker.string.numeric(5)),
        esParEvaluador: faker.datatype.boolean(),
        proyectos: [],
        evaluaciones: []
      });
      profesoresList.push(profesor);
    }

    for(let i = 0; i < 5; i++){
      const evaluacionPartial = {
        calificacion: faker.number.float({ min: 0, max: 5 }),
        proyecto: null,
        evaluador: null
      } as unknown as Partial<EvaluacionEntity>;
      const evaluacion: EvaluacionEntity = await evaluacionRepository.save(evaluacionPartial);
      evaluacionesList.push(evaluacion);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new profesor', async () => {
    const profesor: ProfesorEntity = {
      id: 0,
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      departamento: faker.person.jobArea(),
      extension: 12345,
      esParEvaluador: true,
      proyectos: [],
      evaluaciones: []
    };

    const newProfesor: ProfesorEntity = await service.create(profesor);
    expect(newProfesor).not.toBeNull();

    const storedProfesor: ProfesorEntity | null = await profesorRepository.findOne({ where: { id: newProfesor.id } });
    expect(storedProfesor).not.toBeNull();
    expect(storedProfesor!.cedula).toEqual(profesor.cedula);
    expect(storedProfesor!.nombre).toEqual(profesor.nombre);
    expect(storedProfesor!.departamento).toEqual(profesor.departamento);
    expect(storedProfesor!.extension).toEqual(profesor.extension);
    expect(storedProfesor!.esParEvaluador).toEqual(profesor.esParEvaluador);
  });

  it('create should throw an exception for an profesor with extension diferente de 5 dígitos', async () => {
    const profesor: ProfesorEntity = {
      id: 0,
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      departamento: faker.person.jobArea(),
      extension: 123,
      esParEvaluador: true,
      proyectos: [],
      evaluaciones: []
    };

    await expect(service.create(profesor)).rejects.toThrow(BusinessLogicException);
  });

  it('asignarEvaluador should assign an evaluacion to a profesor', async () => {
    const profesor: ProfesorEntity = profesoresList[0];
    const evaluacion: EvaluacionEntity = evaluacionesList[0];

    const updatedProfesor = await service.asignarEvaluador(profesor.id, evaluacion.id);
    
    // Verificar que el profesor tenga la evaluación asignada
    expect(updatedProfesor.evaluaciones.length).toBeGreaterThan(0);
    
    // Verificar que la evaluación tenga asignado al profesor
    const storedEvaluacion = await evaluacionRepository.findOne({
      where: { id: evaluacion.id },
      relations: ['evaluador']
    });
    expect(storedEvaluacion).not.toBeNull();
    expect(storedEvaluacion!.evaluador).not.toBeNull();
    expect(storedEvaluacion!.evaluador.id).toEqual(profesor.id);
  });

  it('asignarEvaluador should throw an exception when profesor already has 3 evaluaciones', async () => {
    const profesor = profesoresList[0];
    
    // Asignar 3 evaluaciones al profesor
    for(let i = 0; i < 3; i++) {
      const evaluacion = evaluacionesList[i];
      evaluacion.evaluador = profesor;
      await evaluacionRepository.save(evaluacion);
    }
    
    // Actualizar el profesor con las evaluaciones
    profesor.evaluaciones = evaluacionesList.slice(0, 3);
    await profesorRepository.save(profesor);
    
    // Intentar asignar otra evaluación
    await expect(service.asignarEvaluador(profesor.id, evaluacionesList[3].id))
      .rejects.toThrow(BusinessLogicException);
  });

  it('findAll should return all profesores', async () => {
    const profesores: ProfesorEntity[] = await service.findAll();
    expect(profesores).not.toBeNull();
    expect(profesores.length).toEqual(profesoresList.length);
  });

  it('findOne should return a profesor by id', async () => {
    const storedProfesor: ProfesorEntity = profesoresList[0];
    const profesor: ProfesorEntity = await service.findOne(storedProfesor.id);
    expect(profesor).not.toBeNull();
    expect(profesor.id).toEqual(storedProfesor.id);
    expect(profesor.nombre).toEqual(storedProfesor.nombre);
    expect(profesor.cedula).toEqual(storedProfesor.cedula);
    expect(profesor.departamento).toEqual(storedProfesor.departamento);
    expect(profesor.extension).toEqual(storedProfesor.extension);
    expect(profesor.esParEvaluador).toEqual(storedProfesor.esParEvaluador);
  });

  it('findOne should throw an exception for an invalid profesor', async () => {
    await expect(service.findOne(0)).rejects.toThrow(BusinessLogicException);
  });

  it('update should modify a profesor', async () => {
    const profesor = profesoresList[0];
    profesor.nombre = "Nuevo Nombre";
    profesor.departamento = "Nuevo Departamento";
    
    const updatedProfesor = await service.update(profesor.id, profesor);
    expect(updatedProfesor).not.toBeNull();
    
    const storedProfesor = await profesorRepository.findOne({ where: { id: profesor.id } });
    expect(storedProfesor).not.toBeNull();
    expect(storedProfesor!.nombre).toEqual("Nuevo Nombre");
    expect(storedProfesor!.departamento).toEqual("Nuevo Departamento");
  });

  it('update should throw an exception for an invalid profesor', async () => {
    const profesor = profesoresList[0];
    profesor.nombre = "Nuevo Nombre";
    await expect(service.update(0, profesor)).rejects.toThrow(BusinessLogicException);
  });

  it('update should throw an exception for a profesor with invalid extension', async () => {
    const profesor = profesoresList[0];
    profesor.extension = 123; // Extensión con menos de 5 dígitos
    
    await expect(service.update(profesor.id, profesor)).rejects.toThrow(BusinessLogicException);
  });

  it('delete should remove a profesor', async () => {
    // Usaremos un profesor sin relaciones para evitar errores de validación
    const newProfesor = {
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      departamento: faker.person.jobArea(),
      extension: parseInt(faker.string.numeric(5)),
      esParEvaluador: faker.datatype.boolean(),
      proyectos: [],
      evaluaciones: []
    };
    
    const createdProfesor = await profesorRepository.save(newProfesor);
    
    await service.delete(createdProfesor.id);
    
    const deletedProfesor = await profesorRepository.findOne({ where: { id: createdProfesor.id } });
    expect(deletedProfesor).toBeNull();
  });

  it('delete should throw an exception for an invalid profesor', async () => {
    await expect(service.delete(0)).rejects.toThrow(BusinessLogicException);
  });

  it('delete should throw an exception for a profesor with proyectos', async () => {
    // Crear un nuevo proyecto y asignarlo al profesor
    const profesor = profesoresList[0];
    
    // Crear un proyectoRepository para manejar las operaciones con proyectos
    const proyectoRepository = profesorRepository.manager.getRepository(ProyectoEntity);
    
    // Usar el profesor para crear un proyecto
    const nuevoProyecto = proyectoRepository.create({
      titulo: "Este es un título suficientemente largo para la validación", // Más de 15 caracteres
      area: faker.person.jobArea(),
      presupuesto: faker.number.int({ min: 1000, max: 10000 }), // Positivo
      notaFinal: faker.number.float({ min: 0, max: 5 }),
      fechaInicio: faker.date.recent().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      estado: faker.number.int({ min: 0, max: 4 }),
      mentor: profesor,
      estudiante: undefined,
      evaluaciones: []
    });
    
    // Guardar el proyecto y actualizar la lista de proyectos del profesor
    const proyectoGuardado = await proyectoRepository.save(nuevoProyecto);
    profesor.proyectos = [proyectoGuardado];
    await profesorRepository.save(profesor);
    
    // Intentar eliminar el profesor
    await expect(service.delete(profesor.id)).rejects.toThrow(BusinessLogicException);
  });

  it('delete should throw an exception for a profesor with evaluaciones', async () => {
    // Crear un nuevo profesor sin proyectos pero con evaluaciones
    const profesor = profesoresList[1];
    
    // Asignar una evaluación al profesor
    const evaluacion = evaluacionesList[0];
    evaluacion.evaluador = profesor;
    await evaluacionRepository.save(evaluacion);
    
    // Buscar el profesor actualizado con sus relaciones
    const updatedProfesor = await profesorRepository.findOne({
      where: { id: profesor.id },
      relations: ['evaluaciones']
    });
    
    // Verificar que las evaluaciones estén correctamente asignadas
    expect(updatedProfesor).not.toBeNull();
    expect(updatedProfesor!.evaluaciones.length).toBeGreaterThan(0);
    
    // Intentar eliminar el profesor
    await expect(service.delete(profesor.id)).rejects.toThrow(BusinessLogicException);
  });
});
