import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision', nullable: true })
  rating: number;

  @Column({ type: 'varchar', nullable: true })
  director: string;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: true })
  cover: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  about: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film, {
    cascade: true,
    eager: false,
  })
  schedule: Schedule[];
}
