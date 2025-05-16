/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EstudianteService } from './estudiante/estudiante.service';
import { EstudianteDto } from './estudiante.dto/estudiante.dto';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';

@Controller('estudiantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get()
  async findAll() {
    return await this.estudianteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.estudianteService.findOne(id);
  }

  @Post()
  async create(@Body() estudianteDto: EstudianteDto) {
    const estudiante: EstudianteEntity = plainToInstance(EstudianteEntity, estudianteDto);
    return await this.estudianteService.create(estudiante);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.estudianteService.delete(id);
  }
}
