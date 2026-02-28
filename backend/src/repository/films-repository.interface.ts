export interface FilmEntity {
  id: string;
  rating: number;
  director: string;
  tags: string[] | string;
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleItemEntity[];
}

export interface ScheduleItemEntity {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[] | string;
  filmId?: string;
}

export interface FilmRepository<T = FilmEntity, S = ScheduleItemEntity> {
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
  getSchedule(id: string): Promise<S[] | null>;
  updateTakenSeats(
    filmId: string,
    sessionId: string,
    seats: Array<{ row: number; seat: number }>,
  ): Promise<void>;
}
