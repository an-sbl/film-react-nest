import { Film, ScheduleItem } from '../films/schemas/film.schema';

export interface FilmRepository {
  findAll(): Promise<Film[]>;
  findOne(id: string): Promise<Film | null>;
  getSchedule(id: string): Promise<ScheduleItem[] | null>;
  updateTakenSeats(
    filmId: string,
    sessionId: string,
    seats: Array<{ row: number; seat: number }>,
  ): Promise<void>;
}
