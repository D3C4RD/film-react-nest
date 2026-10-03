import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmEntity } from 'src/films/entities/film.entity';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';

@Injectable()
export class FilmsPostgreSQLRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAllFilms(): Promise<{ total: number; items: FilmEntity[] }> {
    const [total, items] = await Promise.all([
      this.filmRepository.count(),
      this.filmRepository.find({ relations: { schedule: true } }),
    ]);

    return { total, items };
  }

  async findFilmById(id: string): Promise<FilmEntity | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });
  }

  async findFilmSchedule(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleEntity | null> {
    return this.scheduleRepository.findOne({
      where: { id: sessionId, filmId },
    });
  }

  async updateFilm(film: FilmEntity): Promise<FilmEntity> {
    return this.filmRepository.save(film);
  }

  async updateScheduleTaken(
    scheduleId: string,
    taken: string[],
  ): Promise<number> {
    const result = await this.scheduleRepository
      .createQueryBuilder()
      .update(ScheduleEntity)
      .set({ taken })
      .where('id = :id', { id: scheduleId })
      .execute();

    return result.affected ?? 0;
  }
}
