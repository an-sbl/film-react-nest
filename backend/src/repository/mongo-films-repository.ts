import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, ScheduleItem } from '../films/schemas/film.schema';
import { FilmRepository } from './films-repository.interface';

@Injectable()
export class MongoFilmsRepository
  implements FilmRepository<Film, ScheduleItem>
{
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findOne(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id: id }).exec();
  }

  async getSchedule(id: string): Promise<ScheduleItem[] | null> {
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
}
