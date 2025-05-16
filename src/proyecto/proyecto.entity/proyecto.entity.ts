/* eslint-disable prettier/prettier */
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProyectoEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
  mentor: ProfesorEntity;
}
