import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get('')
  async findAll() {
    const films = await this.filmsService.findAll();
    return {
      total: films.length,
      items: films.map((film) => this.transformFilm(film)),
    };
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string) {
    const schedule = await this.filmsService.getSchedule(id);
    return {
      total: schedule.length,
      items: schedule,
    };
  }
  private transformFilm(film: any) {
    const { ...rest } = film.toObject ? film.toObject() : film;
    return rest;
  }
}
