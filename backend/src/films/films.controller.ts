import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { ScheduleItemResponseDto, FilmItemResponseDto } from './dto/films.dto';
import { ScheduleEntityInterface } from '../repository/films-repository.interface';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get('')
  async findAll(): Promise<{ total: number; items: FilmItemResponseDto[] }> {
    const films = await this.filmsService.findAll();
    return {
      total: films.length,
      items: films.map((film) => this.transformFilm(film)),
    };
  }

  @Get(':id/schedule')
  async getSchedule(
    @Param('id') id: string,
  ): Promise<{ total: number; items: ScheduleItemResponseDto[] }> {
    const schedule = await this.filmsService.getSchedule(id);
    return {
      total: schedule.length,
      items: schedule.map((item) => this.transformSchedule(item)),
    };
  }

  private transformFilm(film: any) {
    const { tags, ...rest } = film;

    return {
      ...rest,
      tags: Array.isArray(tags)
        ? tags
        : tags
          ? tags.split(',').map((t) => t.trim())
          : [],
    };
  }

  private transformSchedule(
    schedule: ScheduleEntityInterface,
  ): ScheduleItemResponseDto {
    const { taken, hall, ...rest } = schedule;

    return {
      ...rest,
      hall: String(hall),
      taken: Array.isArray(taken) ? taken : taken ? taken.split(',') : [],
    };
  }
}
