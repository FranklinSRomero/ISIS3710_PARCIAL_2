/* eslint-disable prettier/prettier */
import { ProyectoEntity } from 'src/proyecto/proyecto.entity/proyecto.entity';
import { Entity, Long, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EvaluacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Long;

  @ManyToOne(() => ProyectoEntity, (proyecto) => proyecto.evaluaciones)
  proyecto: ProyectoEntity;
}
