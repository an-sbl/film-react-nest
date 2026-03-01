import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FilmsService } from '../films/films.service';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}
  async createOrder(createOrderDto: CreateOrderDto) {
    const { tickets } = createOrderDto;
    for (const ticket of tickets) {
      const film = await this.filmsService.findOne(ticket.film);
      if (!film) {
        throw new NotFoundException(`Фильм не найден`);
      }

      const session = film.schedule?.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(`Сеанс не найден`);
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;

      const takenArray = Array.isArray(session.taken)
        ? session.taken
        : session.taken
          ? session.taken.split(',')
          : [];

      if (takenArray?.includes(seatKey)) {
        throw new ConflictException(
          `Место ${ticket.row}:${ticket.seat} уже занято`,
        );
      }
    }
    for (const ticket of tickets) {
      await this.filmsService.updateTakenSeats(ticket.film, ticket.session, [
        { row: ticket.row, seat: ticket.seat },
      ]);
    }
    return tickets.map((ticket) => ({
      film: ticket.film,
      session: ticket.session,
      daytime: ticket.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price,
      id: randomUUID(),
    }));
  }
}
