import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { ProyectoService } from './proyecto/proyecto.service';
import { ProyectoController } from './proyecto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoEntity])],
  providers: [ProyectoService],
  controllers: [ProyectoController]
})
export class ProyectoModule {}
