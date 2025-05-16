/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';

export class EvaluacionDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  readonly calificacion: number;

  @IsNotEmpty()
  readonly proyecto: ProyectoEntity;

  @IsNotEmpty()
  readonly evaluador: ProfesorEntity;
}
