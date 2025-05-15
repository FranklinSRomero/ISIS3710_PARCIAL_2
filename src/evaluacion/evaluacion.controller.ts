/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { EvaluacionService } from './evaluacion/evaluacion.service';

@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  async create(@Body() museumDto: MuseumDto) {
    const museum: MuseumEntity = plainToInstance(MuseumEntity, museumDto);
    return await this.museumService.create(museum);
  }
}
