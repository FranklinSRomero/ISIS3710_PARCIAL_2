/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [EstudianteEntity, ProfesorEntity, ProyectoEntity, EvaluacionEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([EstudianteEntity, ProfesorEntity, ProyectoEntity, EvaluacionEntity]),
];
