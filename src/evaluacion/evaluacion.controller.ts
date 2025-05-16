/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EvaluacionService } from './evaluacion/evaluacion.service';
import { EvaluacionDto } from './evaluacion.dto/evaluacion.dto';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Controller('evaluaciones')
@UseInterceptors(BusinessErrorsInterceptor)
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Get()
  async findAll() {
    return await this.evaluacionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.evaluacionService.findOne(id);
  }

  @Post()
  async create(@Body() evaluacionDto: EvaluacionDto) {
    const evaluacion: EvaluacionEntity = plainToInstance(EvaluacionEntity, evaluacionDto);
    return await this.evaluacionService.create(evaluacion);
  }
}
