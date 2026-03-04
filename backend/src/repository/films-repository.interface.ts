export interface FilmEntityInterface {
  id: string;
  rating: number;
  director: string;
  tags: string[] | string;
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleEntityInterface[];
}

export interface ScheduleEntityInterface {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[] | string;
  filmId?: string;
}

export interface FilmRepository {
  findAll(): Promise<FilmEntityInterface[]>;
  findOne(id: string): Promise<FilmEntityInterface | null>;
  getSchedule(id: string): Promise<ScheduleEntityInterface[] | null>;
  updateTakenSeats(
    filmId: string,
    sessionId: string,
    seats: Array<{ row: number; seat: number }>,
  ): Promise<void>;
}
