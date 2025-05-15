import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto/proyecto.service';

@Module({
  providers: [ProyectoService]
})
export class ProyectoModule {}
