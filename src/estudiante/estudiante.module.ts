import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante/estudiante.service';

@Module({
  providers: [EstudianteService]
})
export class EstudianteModule {}
