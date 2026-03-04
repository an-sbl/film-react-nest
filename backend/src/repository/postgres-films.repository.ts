import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film as FilmEntity } from '../films/entities/film.entity';
import { Schedule as ScheduleEntity } from '../films/entities/schedule.entity';
import {
  FilmRepository,
  FilmEntityInterface,
  ScheduleEntityInterface,
} from './films-repository.interface';

@Injectable()
export class PostgresFilmsRepository implements FilmRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAll(): Promise<FilmEntityInterface[]> {
    const films = await this.filmRepository.find({
      relations: ['schedule'],
    });
    return films.map((film) => this.mapToFilmInterface(film));
  }

  async findOne(id: string): Promise<FilmEntityInterface | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film ? this.mapToFilmInterface(film) : null;
  }

  async getSchedule(id: string): Promise<ScheduleEntityInterface[] | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film.schedule.map((schedule) =>
      this.mapToScheduleInterface(schedule),
    );
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

  private mapToFilmInterface(film: FilmEntity): FilmEntityInterface {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule
        ? film.schedule.map((s) => this.mapToScheduleInterface(s))
        : [],
    };
  }

  private mapToScheduleInterface(
    schedule: ScheduleEntity,
  ): ScheduleEntityInterface {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken ? schedule.taken.split(',').filter((s) => s) : [],
      filmId: schedule.filmId,
    };
  }
}
