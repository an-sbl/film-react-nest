import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  daytime: string;

  @Column({ type: 'integer', nullable: true })
  hall: number;

  @Column({ type: 'integer', nullable: true })
  rows: number;

  @Column({ type: 'integer', nullable: true })
  seats: number;

  @Column({ type: 'double precision', nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  taken: string;

  @Column({ name: 'filmId', type: 'uuid', nullable: true })
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
