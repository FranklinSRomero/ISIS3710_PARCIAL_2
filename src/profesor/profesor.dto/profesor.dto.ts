/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsBoolean, Length } from 'class-validator';

export class ProfesorDto {
  @IsNumber()
  @IsNotEmpty()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly departamento: string;

  @IsNumber()
  @IsNotEmpty()
  readonly extension: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly esParEvaluador: boolean;
}
