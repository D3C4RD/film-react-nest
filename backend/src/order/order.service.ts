import {
  BadRequestException,
  ConflictException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { FilmsPostgreSQLRepository } from '../repository/films.repository/filmPostgreSQL.repository';
import { OrderDataDTO, TicketDTO } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: FilmsPostgreSQLRepository,
  ) {}

  async createOrder(
    orderData: OrderDataDTO,
  ): Promise<{ items: TicketDTO[]; total: number }> {
    const tickets = orderData.tickets;
    for (const ticket of tickets) {
      const film = await this.filmsRepository.findFilmById(ticket.film);
      const scheduleIndex = await this.filmsRepository.findFilmSchedule(
        ticket.film,
        ticket.session,
      );
      const place = `${ticket.row}:${ticket.seat}`;
      if (film.schedule[scheduleIndex].taken.includes(place)) {
        throw new BadRequestException(
          `К сожалению данное место ${place} уже забронировано другим посетителем`,
        );
      }
      await this.updateSeats(ticket.film, scheduleIndex, place);
    }
    return { items: tickets, total: tickets.length };
  }

  async updateSeats(
    filmId: string,
    scheduleIndex: number,
    place: string,
  ): Promise<void> {
    const film = await this.filmsRepository.findFilmById(filmId);
    film.schedule[scheduleIndex].taken =
      film.schedule[scheduleIndex].taken + `,${place}`;
    try {
      await this.filmsRepository.updateFilm(film);
    } catch (error) {
      throw new ConflictException(
        'Возникла ошибка при обновлении данных в таблице',
      );
    }
  }
}
