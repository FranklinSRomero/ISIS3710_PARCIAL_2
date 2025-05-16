/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProyectoService } from './proyecto/proyecto.service';
import { ProyectoDto } from './proyecto.dto/proyecto.dto';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';

@Controller('proyectos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Get()
  async findAll() {
    return await this.proyectoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.proyectoService.findOne(id);
  }

  @Get(':id/estudiantes')
  async findAllEstudiantes(@Param('id') id: number) {
    return await this.proyectoService.findAllEstudiantes(id);
  }

  @Post()
  async create(@Body() proyectoDto: ProyectoDto) {
    const proyecto: ProyectoEntity = plainToInstance(ProyectoEntity, proyectoDto);
    return await this.proyectoService.create(proyecto);
  }

  @Put(':id/avanzar')
  async avanzarProyecto(@Param('id') id: number) {
    return await this.proyectoService.avanzarProyecto(id);
  }
}
