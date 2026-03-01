import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    // Пример из Postman - успешный ответ
    const createOrder = [
      {
        film: '1',
        session: '2',
        daytime: '2023-05-29T10:30:00.001Z',
        row: 2,
        seat: 5,
        price: 350,
      },
    ];

    const сreatedOrder = [
      {
        film: '1',
        session: '2',
        daytime: '2023-05-29T10:30:00.001Z',
        row: 2,
        seat: 5,
        price: 350,
        id: '3',
      },
    ];

    it('Должен создавать заказ и возвращать формат { total, items }', async () => {
      mockOrderService.createOrder.mockResolvedValue(сreatedOrder);

      const result = await controller.create(createOrder as any);

      expect(result).toEqual({
        total: 1,
        items: сreatedOrder,
      });
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(createOrder);
    });

    it('должен обрабатывать несколько билетов в заказе', async () => {
      const multipleTicketsDto = [
        {
          film: '1',
          session: '2',
          daytime: '2023-05-29T10:30:00.001Z',
          row: 2,
          seat: 5,
          price: 350,
        },
        {
          film: '1',
          session: '2',
          daytime: '2023-05-29T10:30:00.001Z',
          row: 2,
          seat: 6,
          price: 350,
        },
      ];

      const mockMultipleOrder = [
        {
          film: '1',
          session: '2',
          daytime: '2023-05-29T10:30:00.001Z',
          row: 2,
          seat: 5,
          price: 350,
          id: '3',
        },
        {
          film: '1',
          session: '2',
          daytime: '2023-05-29T10:30:00.001Z',
          row: 2,
          seat: 6,
          price: 350,
          id: '4',
        },
      ];

      mockOrderService.createOrder.mockResolvedValue(mockMultipleOrder);

      const result = await controller.create(multipleTicketsDto as any);

      expect(result).toEqual({
        total: 2,
        items: mockMultipleOrder,
      });
    });
  });
});
