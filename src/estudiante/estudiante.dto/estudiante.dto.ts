/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class EstudianteDto {
  @IsNumber()
  @IsNotEmpty()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(4)
  readonly semestre: number;

  @IsString()
  @IsNotEmpty()
  readonly programa: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(3.2)
  readonly promedio: number;
}
