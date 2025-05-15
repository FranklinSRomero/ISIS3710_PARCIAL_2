/* eslint-disable prettier/prettier */
import { ProyectoEntity } from 'src/proyecto/proyecto.entity/proyecto.entity';
import {
  Column,
  Entity,
  Long,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Long;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  semestre: number;

  @Column()
  programa: string;

  @Column()
  promedio: number;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.estudiante)
  proyectos: ProyectoEntity[];
}
