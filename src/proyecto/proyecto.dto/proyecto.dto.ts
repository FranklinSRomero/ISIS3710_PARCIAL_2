/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, Min, Length } from 'class-validator';

export class ProyectoDto {
  @IsString()
  @IsNotEmpty()
  @Length(16)
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly area: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly presupuesto: number;

  @IsNumber()
  readonly notaFinal: number;

  @IsNumber()
  readonly estado: number;

  @IsString()
  @IsNotEmpty()
  readonly fechaInicio: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaFin: string;
}
