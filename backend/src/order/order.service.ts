import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FilmsMongoDBRepository } from '../repository/films.repository/filmsMongoDB.repository';
import { OrderDataDto, TicketDTO } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly filmsRepository: FilmsMongoDBRepository,
  ) {}

  async createOrder(
    orderData: OrderDataDto,
  ): Promise<{ items: TicketDTO[]; total: number }> {
    const tickets = orderData.tickets;
    console.log('начало заказа');
    for (const ticket of tickets) {
      const film = (
        await this.filmsRepository.findFilmById(ticket.film)
      ).toObject();
      const scheduleIndex = await this.filmsRepository.findFilmSchedule(
        ticket.film,
        ticket.session,
      );
      const place = `${ticket.row}:${ticket.seat}`;

      if (film.schedule[scheduleIndex].taken.includes(place)) {
        throw new BadRequestException(`Место уже занято`);
      }
      this.updateSeats(ticket.film, scheduleIndex, place);
    }
    return { items: tickets, total: tickets.length };
  }

  async updateSeats(filmId: string, scheduleIndex: number, place: string) {
    const film = await this.filmsRepository.findFilmById(filmId);
    const scheduleTakenPlace = `schedule.${scheduleIndex.toString()}.taken`;
    try {
      await film.updateOne({ $push: { [scheduleTakenPlace]: place } });
    } catch {
      new ConflictException('Возникла ошибка при обновлении данных');
    }
  }
}