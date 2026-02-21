import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/schemas/film.schema';
import { MongoFilmsRepository } from './mongo-films-repository';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [
    {
      provide: 'FILMS_REPOSITORY',
      useClass: MongoFilmsRepository,
    },
  ],
  exports: ['FILMS_REPOSITORY'],
})
export class RepositoryModule {}
