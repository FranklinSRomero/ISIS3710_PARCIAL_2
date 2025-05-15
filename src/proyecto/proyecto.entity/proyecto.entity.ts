/* eslint-disable prettier/prettier */
import { EstudianteEntity } from 'src/estudiante/estudiante.entity/estudiante.entity';
import { EvaluacionEntity } from 'src/evaluacion/evaluacion.entity/evaluacion.entity';
import { ProfesorEntity } from 'src/profesor/profesor.entity/profesor.entity';
import {
  Column,
  Entity,
  Long,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProyectoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Long;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  notaFinal: number;

  @Column()
  estado: number;

  @Column()
  fechaInicio: string;

  @Column()
  fechaFin: string;

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.proyecto)
  evaluaciones: EvaluacionEntity[];

  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.proyectos)
  estudiante: EstudianteEntity;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.proyectos)
  profesor: ProfesorEntity;
}
