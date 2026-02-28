import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/schemas/film.schema';
import { MongoFilmsRepository } from './mongo-films-repository';
import { getModelToken } from '@nestjs/mongoose';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Film as PgFilm } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { PostgresFilmsRepository } from './postgres-films.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    ConfigModule,
    ...(process.env.DATABASE_DRIVER === 'mongodb'
      ? [MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])]
      : []),
    ...(process.env.DATABASE_DRIVER === 'postgres'
      ? [TypeOrmModule.forFeature([PgFilm, Schedule])]
      : []),
  ],
  providers: [
    {
      provide: 'FILMS_REPOSITORY',
      useFactory: (
        configService: ConfigService,
        mongoModel?: any,
        pgFilmRepo?: any,
        pgScheduleRepo?: any,
      ) => {
        const driver = configService.get('DATABASE_DRIVER');

        if (driver === 'postgres') {
          return new PostgresFilmsRepository(pgFilmRepo, pgScheduleRepo);
        } else {
          return new MongoFilmsRepository(mongoModel);
        }
      },
      inject: [
        ConfigService,
        { token: getModelToken(Film.name), optional: true },
        { token: getRepositoryToken(PgFilm), optional: true },
        { token: getRepositoryToken(Schedule), optional: true },
      ],
    },
  ],
  exports: ['FILMS_REPOSITORY'],
})
export class RepositoryModule {}
