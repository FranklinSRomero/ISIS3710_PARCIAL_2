import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { EvaluacionService } from './evaluacion/evaluacion.service';
import { EvaluacionController } from './evaluacion.controller';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluacionEntity, ProyectoEntity])],
  providers: [EvaluacionService],
  controllers: [EvaluacionController]
})
export class EvaluacionModule {}
