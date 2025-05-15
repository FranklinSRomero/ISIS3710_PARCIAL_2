import { Module } from '@nestjs/common';
import { EvaluacionService } from './evaluacion/evaluacion.service';
import { EvaluacionController } from './evaluacion.controller';

@Module({
  providers: [EvaluacionService],
  controllers: [EvaluacionController]
})
export class EvaluacionModule {}
