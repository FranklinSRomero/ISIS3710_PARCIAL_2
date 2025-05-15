/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { ProfesorModule } from './profesor/profesor.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante/estudiante.entity/estudiante.entity';
import { ProfesorEntity } from './profesor/profesor.entity/profesor.entity';
import { ProyectoEntity } from './proyecto/proyecto.entity/proyecto.entity';
import { EvaluacionEntity } from './evaluacion/evaluacion.entity/evaluacion.entity';

@Module({
  imports: [
    EstudianteModule,
    ProyectoModule,
    ProfesorModule,
    EvaluacionModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      //host: 'localhost',
      //port: 5432,
      //username: 'postgres',
      //password: 'postgres',
      //database: 'museum',
      entities: [
        EstudianteEntity,
        ProfesorEntity,
        ProyectoEntity,
        EvaluacionEntity,
      ],
      dropSchema: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      EstudianteEntity,
      ProfesorEntity,
      ProyectoEntity,
      EvaluacionEntity,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
