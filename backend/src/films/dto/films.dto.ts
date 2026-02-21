export class TakenSeatDTO {
  row: number;
  seat: number;
}

export class ScheduleDTO {
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: TakenSeatDTO[];
}

export class FilmDto {
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleDTO[];
}
