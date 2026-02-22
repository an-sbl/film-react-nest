import { Injectable, Inject } from '@nestjs/common';
import { Film, ScheduleItem } from './schemas/film.schema';
import { FilmRepository } from '../repository/films-repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY') private readonly filmRepository: FilmRepository,
  ) {}

  async findAll(): Promise<Film[]> {
    const films = this.filmRepository.findAll();
    return films as unknown as Film[];
  }

  async findOne(id: string): Promise<Film | null> {
    const film = await this.filmRepository.findOne(id);
    return film as unknown as Film | null;
  }

  async getSchedule(id: string): Promise<ScheduleItem[] | null> {
    const schedule = this.filmRepository.getSchedule(id);
    return schedule as unknown as ScheduleItem[] | null;
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    seats: Array<{ row: number; seat: number }>,
  ): Promise<void> {
    return this.filmRepository.updateTakenSeats(filmId, sessionId, seats);
  }
}
