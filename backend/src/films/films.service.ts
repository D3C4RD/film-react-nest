import { Injectable, Inject } from '@nestjs/common';
import { FilmsPostgreSQLRepository } from '../repository/films.repository/filmPostgreSQL.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: FilmsPostgreSQLRepository,
  ) {}

  async getAllFilms() {
    return this.filmsRepository.findAllFilms();
  }

  async getScheduleFilm(id: string) {
    const film = await this.filmsRepository.findFilmById(id);
    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}