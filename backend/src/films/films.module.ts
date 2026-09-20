import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { FilmsPostgreSQLRepository } from '../repository/films.repository/filmPostgreSQL.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    FilmsPostgreSQLRepository,
    {
      provide: 'FILMS_REPOSITORY',
      useExisting: FilmsPostgreSQLRepository,
    },
  ],
  exports: ['FILMS_REPOSITORY'],
})
export class FilmsModule {}
