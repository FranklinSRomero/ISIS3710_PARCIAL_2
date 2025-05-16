/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from '../estudiante.entity/estudiante.entity';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../../shared/errors/business-errors';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<EstudianteEntity>;
  let estudiantesList: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    estudiantesList = [];
    for(let i = 0; i < 5; i++){
      const estudiante: EstudianteEntity = await repository.save({
        cedula: parseInt(faker.string.numeric(8)),
        nombre: faker.person.fullName(),
        semestre: faker.number.int({ min: 4, max: 10 }),
        programa: faker.person.jobArea(),
        promedio: faker.number.float({ min: 3.3, max: 5.0, fractionDigits: 1 }),
        proyectos: []
      });
      estudiantesList.push(estudiante);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new estudiante', async () => {
    const estudiante: EstudianteEntity = {
      id: 0,
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      semestre: 5,
      programa: faker.person.jobArea(),
      promedio: 4.0,
      proyectos: []
    };

    const newEstudiante: EstudianteEntity = await service.create(estudiante);
    expect(newEstudiante).not.toBeNull();

    const storedEstudiante: EstudianteEntity | null = await repository.findOne({ where: { id: newEstudiante.id } });
    expect(storedEstudiante).not.toBeNull();
    expect(storedEstudiante!.cedula).toEqual(estudiante.cedula);
    expect(storedEstudiante!.nombre).toEqual(estudiante.nombre);
    expect(storedEstudiante!.semestre).toEqual(estudiante.semestre);
    expect(storedEstudiante!.programa).toEqual(estudiante.programa);
    expect(storedEstudiante!.promedio).toEqual(estudiante.promedio);
  });

  it('create should throw an exception for an estudiante with promedio < 3.2', async () => {
    const estudiante: EstudianteEntity = {
      id: 0,
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      semestre: 5,
      programa: faker.person.jobArea(),
      promedio: 3.0,
      proyectos: []
    };

    await expect(service.create(estudiante)).rejects.toThrow(BusinessLogicException);
  });

  it('create should throw an exception for an estudiante with semestre < 4', async () => {
    const estudiante: EstudianteEntity = {
      id: 0,
      cedula: parseInt(faker.string.numeric(8)),
      nombre: faker.person.fullName(),
      semestre: 3,
      programa: faker.person.jobArea(),
      promedio: 4.0,
      proyectos: []
    };

    await expect(service.create(estudiante)).rejects.toThrow(BusinessLogicException);
  });

  it('delete should remove an estudiante', async () => {
    const estudiante: EstudianteEntity = estudiantesList[0];
    await service.delete(estudiante.id);
    const deletedEstudiante: EstudianteEntity | null = await repository.findOne({ where: { id: estudiante.id } });
    expect(deletedEstudiante).toBeNull();
  });

  it('delete should throw an exception for an invalid estudiante', async () => {
    await expect(service.delete(0)).rejects.toThrow(BusinessLogicException);
  });

  it('delete should throw an exception for an estudiante with active proyectos', async () => {
    // Crear un repositorio temporal para proyectos
    const proyectoRepository = repository.manager.getRepository(ProyectoEntity);
    
    // Obtener un estudiante de la lista
    const estudiante = estudiantesList[0];
    
    // Crear un proyecto activo (estado < 4) y asignarlo al estudiante
    const proyecto = await proyectoRepository.create({
      titulo: "Este es un título suficientemente largo para la validación",
      area: faker.person.jobArea(),
      presupuesto: faker.number.int({ min: 1000, max: 10000 }),
      notaFinal: faker.number.float({ min: 0, max: 5 }),
      fechaInicio: faker.date.recent().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      estado: faker.number.int({ min: 0, max: 3 }), // Proyecto activo (estado < 4)
      estudiante: estudiante,
      mentor: undefined,
      evaluaciones: []
    });
    
    // Guardar el proyecto
    await proyectoRepository.save(proyecto);
    
    // Actualizar el estudiante en la base de datos para reflejar la relación
    const updatedEstudiante = await repository.findOne({
      where: { id: estudiante.id },
      relations: ['proyectos']
    });
    
    // Verificar que el estudiante tiene proyectos activos
    expect(updatedEstudiante!.proyectos.length).toBeGreaterThan(0);
    
    // Intentar eliminar el estudiante debería lanzar una excepción
    await expect(service.delete(estudiante.id)).rejects.toThrow(BusinessLogicException);
  });
});
