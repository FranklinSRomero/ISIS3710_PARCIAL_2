import { Module } from '@nestjs/common';
import { EvaluacionService } from './evaluacion/evaluacion.service';

@Module({
  providers: [EvaluacionService]
})
export class EvaluacionModule {}
