import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsPostgreSQLRepository } from '../repository/films.repository/filmPostgreSQL.repository';
import { OrderDataDTO, TicketDTO } from './dto/order.dto';
import { ScheduleEntity } from '../films/entities/schedule.entity';
import { randomUUID } from 'crypto';

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

    // 1. Проверка: собираем сеансы и проверяем места, ничего не пишем.
    const toUpdate = new Map<
      string,
      { schedule: ScheduleEntity; places: string[] }
    >();

    for (const ticket of tickets) {
      const schedule = await this.filmsRepository.findFilmSchedule(
        ticket.film,
        ticket.session,
      );

      if (!schedule) {
        throw new NotFoundException(
          `Сеанс ${ticket.session} для фильма ${ticket.film} не найден`,
        );
      }

      // Время сеанса совпадает с расписанием?
      if (ticket.daytime !== schedule.daytime) {
        throw new BadRequestException(
          `На указанное время сеанса этого фильма нет`,
        );
      }

      // Место вообще существует в этом зале?
      if (
        ticket.row < 1 ||
        ticket.row > schedule.rows ||
        ticket.seat < 1 ||
        ticket.seat > schedule.seats
      ) {
        throw new BadRequestException(
          `Места с таким рядом и местом не существует в зале`,
        );
      }

      if (ticket.price !== schedule.price) {
        throw new BadRequestException(
          'Цена не соответсвует действительности'
        );
      }

      const place = `${ticket.row}:${ticket.seat}`;

      // Уже занято в БД?
      if (schedule.taken.includes(place)) {
        throw new BadRequestException(
          `К сожалению данное место ${place} уже забронировано другим посетителем`,
        );
      }

      // Уже выбрано в этом же заказе на этот же сеанс?
      const entry = toUpdate.get(schedule.id);
      if (entry) {
        if (entry.places.includes(place)) {
          throw new BadRequestException(
            `Место ${place} указано в заказе несколько раз`,
          );
        }
        entry.places.push(place);
      } else {
        toUpdate.set(schedule.id, { schedule, places: [place] });
      }
    }

    // 2. Запись: все проверки прошли — обновляем.
    for (const { schedule, places } of toUpdate.values()) {
      const affected = await this.filmsRepository.updateScheduleTaken(
        schedule.id,
        [...schedule.taken, ...places],
      );

      if (affected === 0) {
        throw new ConflictException(
          'Возникла ошибка при обновлении данных в таблице',
        );
      }
    }

    const items: TicketDTO[] = tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return { items, total: tickets.length };
  }
}
