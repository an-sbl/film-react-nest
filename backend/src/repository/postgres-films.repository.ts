import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film as FilmEntity } from '../films/entities/film.entity';
import { Schedule as ScheduleEntity } from '../films/entities/schedule.entity';
import { FilmRepository } from './films-repository.interface';

@Injectable()
export class PostgresFilmsRepository
  implements FilmRepository<FilmEntity, ScheduleEntity>
{
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    return this.filmRepository.find({
      relations: ['schedule'],
    });
  }

  async findOne(id: string): Promise<FilmEntity | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
  }

  async getSchedule(id: string): Promise<ScheduleEntity[] | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });

    return film?.schedule || null;
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    seats: Array<{ row: number; seat: number }>,
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, filmId },
    });

    if (!schedule) return;

    const seatsToAdd = seats.map((seat) => `${seat.row}:${seat.seat}`);
    const currentTaken = schedule.taken
      ? schedule.taken.split(',').filter((s) => s)
      : [];
    const updatedTaken = [...new Set([...currentTaken, ...seatsToAdd])];

    await this.scheduleRepository.update(
      { id: sessionId, filmId },
      { taken: updatedTaken.join(',') },
    );
  }
}
