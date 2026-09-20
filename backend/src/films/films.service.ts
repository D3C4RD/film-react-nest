import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { FilmsPostgreSQLRepository } from '../repository/films.repository/filmPostgreSQL.repository';
import { GetFilmDTO, GetScheduleDTO, toFilmDTO, toScheduleDTO } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: FilmsPostgreSQLRepository,
  ) {}

  async getAllFilms(): Promise<{ total: number; items: GetFilmDTO[] }> {
    const { total, items } = await this.filmsRepository.findAllFilms();

    return { total, items: items.map(toFilmDTO) };
  }

  async getScheduleFilm(
    id: string,
  ): Promise<{ total: number; items: GetScheduleDTO[] }> {
    const film = await this.filmsRepository.findFilmById(id);

    if (!film) {
      throw new NotFoundException(`Фильм с таким Id ${id} не найден`);
    }

    const items = (film.schedule ?? []).map(toScheduleDTO);

    return { total: items.length, items };
  }
}