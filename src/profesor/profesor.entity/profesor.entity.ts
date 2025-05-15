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
export class ProfesorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Long;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  departamento: string;

  @Column()
  extension: number;

  @Column()
  esparevaluador: boolean;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.profesor)
  proyectos: ProyectoEntity[];
}
