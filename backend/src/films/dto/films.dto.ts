import { FilmEntity } from '../entities/film.entity';
import { ScheduleEntity } from '../entities/schedule.entity';

export class GetScheduleDTO {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class GetFilmDTO {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: GetScheduleDTO[];
}

export const toScheduleDTO = (schedule: ScheduleEntity): GetScheduleDTO => ({
  id: schedule.id,
  daytime: schedule.daytime,
  hall: schedule.hall,
  rows: schedule.rows,
  seats: schedule.seats,
  price: schedule.price,
  taken: schedule.taken,
});

export const toFilmDTO = (film: FilmEntity): GetFilmDTO => ({
  id: film.id,
  rating: film.rating,
  director: film.director,
  tags: film.tags,
  image: film.image,
  cover: film.cover,
  title: film.title,
  about: film.about,
  description: film.description,
  schedule: (film.schedule ?? []).map(toScheduleDTO),
});