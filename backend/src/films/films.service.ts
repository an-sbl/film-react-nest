import { Injectable, Inject } from '@nestjs/common';
import { Film, ScheduleItem } from './schemas/film.schema';
import { FilmRepository } from '../repository/films-repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY') private readonly filmRepository: FilmRepository,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.findAll();
  }

  async findOne(id: string): Promise<Film> {
    return this.filmRepository.findOne(id);
  }

  async getSchedule(id: string): Promise<ScheduleItem[] | null> {
    return this.filmRepository.getSchedule(id);
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    seats: Array<{ row: number; seat: number }>,
  ): Promise<void> {
    return this.filmRepository.updateTakenSeats(filmId, sessionId, seats);
  }
}
