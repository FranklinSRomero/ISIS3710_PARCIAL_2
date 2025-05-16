/* eslint-disable prettier/prettier */
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProfesorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  departamento: string;

  @Column()
  extension: number;

  @Column()
  esParEvaluador: boolean;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.mentor)
  proyectos: ProyectoEntity[];

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.evaluador)
  evaluaciones: EvaluacionEntity[];
}
