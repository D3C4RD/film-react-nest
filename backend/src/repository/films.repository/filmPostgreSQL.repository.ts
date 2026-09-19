import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmEntity } from 'src/films/entities/film.entity';

@Injectable()
export class FilmsPostgreSQLRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
  ) {}

  /**
   * Преобразует taken из строки "1:1,1:2" в массив ["1:1", "1:2"].
   * Пустые значения (ведущая запятая и т.п.) отбрасываются.
   */
  private normalizeFilm(film: FilmEntity): FilmEntity {
    if (!film) return film;
    return {
      ...film,
      schedule: (film.schedule ?? []).map((s) => ({
        ...s,
        taken: s.taken
          ? s.taken.split(',').filter((p) => p.length > 0)
          : [],
      })) as any,
    };
  }

  async findAllFilms(): Promise<{ total: number; items: FilmEntity[] }> {
    const [total, items] = await Promise.all([
      this.filmRepository.count(),
      this.filmRepository.find({ relations: { schedule: true } }),
    ]);

    return {
      total,
      items: items.map((film) => this.normalizeFilm(film)),
    };
  }

  async findFilmById(id: string): Promise<FilmEntity> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!film) {
      throw new NotFoundException(`Фильм с таким Id ${id} не найден`);
    }

    return this.normalizeFilm(film);
  }

  async findFilmSchedule(filmId: string, session: string): Promise<number> {
    const film = await this.findFilmById(filmId);
    const scheduleIndex = film.schedule.findIndex((s) => s.id === session);

    if (scheduleIndex === -1) {
      throw new NotFoundException(
        `Такого расписания нет для фильма '${film.title}'`,
      );
    }

    return scheduleIndex;
  }

  async updateFilm(film: FilmEntity): Promise<void> {
    // taken в БД — text, поэтому массив склеиваем обратно в строку.
    const toSave: FilmEntity = {
      ...film,
      schedule: (film.schedule ?? []).map((s) => ({
        ...s,
        taken: Array.isArray(s.taken) ? s.taken.join(',') : s.taken,
      })) as any,
    };

    try {
      await this.filmRepository.save(toSave);
    } catch (error) {
      throw new BadRequestException(
        `Не удалось обновить фильм ${film.title}`,
      );
    }
  }
}