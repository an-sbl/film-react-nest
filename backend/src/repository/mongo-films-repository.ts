import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, ScheduleItem } from '../films/schemas/film.schema';
import {
  FilmRepository,
  FilmEntityInterface,
  ScheduleEntityInterface,
} from './films-repository.interface';

@Injectable()
export class MongoFilmsRepository implements FilmRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<FilmEntityInterface[]> {
    const films = await this.filmModel.find().exec();
    return films.map((film) => this.mapToFilmInterface(film));
  }

  async findOne(id: string): Promise<FilmEntityInterface | null> {
    const film = await this.filmModel.findOne({ id: id }).exec();
    return film ? this.mapToFilmInterface(film) : null;
  }

  async getSchedule(id: string): Promise<ScheduleEntityInterface[] | null> {
    const film = await this.findOne(id);
    return film?.schedule || null;
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    seats: Array<{ row: number; seat: number }>,
  ): Promise<void> {
    const film = await this.filmModel.findOne({ id: filmId });
    if (!film) return;

    const sessionIndex = film.schedule.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) return;

    const seatsToAdd = seats.map((seat) => `${seat.row}:${seat.seat}`);
    const currentTaken = film.schedule[sessionIndex].taken || [];
    const updatedTaken = [...new Set([...currentTaken, ...seatsToAdd])];

    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $set: { 'schedule.$.taken': updatedTaken } },
      )
      .exec();
  }

  private mapToFilmInterface(film: Film): FilmEntityInterface {
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
    schedule: ScheduleItem,
  ): ScheduleEntityInterface {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
      filmId: undefined,
    };
  }
}
