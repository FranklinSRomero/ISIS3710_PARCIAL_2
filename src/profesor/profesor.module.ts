import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProfesorService } from './profesor/profesor.service';
import { ProfesorController } from './profesor.controller';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity/evaluacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfesorEntity, EvaluacionEntity])],
  providers: [ProfesorService],
  controllers: [ProfesorController]
})
export class ProfesorModule {}
