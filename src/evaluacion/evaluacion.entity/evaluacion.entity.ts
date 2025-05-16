/* eslint-disable prettier/prettier */
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EvaluacionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  calificacion: number;

  @ManyToOne(() => ProyectoEntity, (proyecto) => proyecto.evaluaciones)
  proyecto: ProyectoEntity;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.evaluaciones)
  evaluador: ProfesorEntity;
}
