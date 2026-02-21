import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FilmsService } from 'src/films/films.service';
import { CreateOrderDto } from './dto/order.dto';
import { randomUUID } from 'crypto';

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

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(`Сеанс не найден`);
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      if (session.taken?.includes(seatKey)) {
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
