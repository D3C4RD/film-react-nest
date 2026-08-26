import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetFilmDto } from '../../films/dto/films.dto';
import { Film, FilmDocument } from '../../films/schemas/films.schema';

@Injectable()
export class FilmsMongoDBRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findFilmById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id });
  }

  async findAllFilms(): Promise<FilmDocument[]> {
    return this.filmModel.find({});
  }

  async findFilmSchedule(filmId: string, session: string): Promise<number | null> {
    const film = await this.findFilmById(filmId);
    if (!film) return null;
    
    const index = film.schedule.findIndex(s => s.id === session);
    return index !== -1 ? index : null;
  }
}
