/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProfesorService } from './profesor/profesor.service';
import { ProfesorDto } from './profesor.dto/profesor.dto';
import { ProfesorEntity } from './profesor.entity/profesor.entity';

@Controller('profesores')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Get()
  async findAll() {
    return await this.profesorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.profesorService.findOne(id);
  }

  @Post()
  async create(@Body() profesorDto: ProfesorDto) {
    const profesor: ProfesorEntity = plainToInstance(ProfesorEntity, profesorDto);
    return await this.profesorService.create(profesor);
  }

  @Put(':profesorId/evaluaciones/:evaluacionId')
  async asignarEvaluador(
    @Param('profesorId') profesorId: number,
    @Param('evaluacionId') evaluacionId: number,
  ) {
    return await this.profesorService.asignarEvaluador(profesorId, evaluacionId);
  }
}
