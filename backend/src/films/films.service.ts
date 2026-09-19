import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsMongoDBRepository } from '../repository/films.repository/filmsMongoDB.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsMongoDBRepository) {}

  async getAllFilms() {
    return this.filmsRepository.findAllFilms();
  }

  async getScheduleFilm(id: string) {
    const film = await this.filmsRepository.findFilmById(id);

    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    const filmObject = film.toObject();

    return {
      total: filmObject.schedule?.length || 0,
      items: filmObject.schedule || [],
    };
  }
}
