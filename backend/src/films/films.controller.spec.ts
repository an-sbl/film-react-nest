import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const mockFilmsService = {
    findAll: jest.fn(),
    getSchedule: jest.fn(),
  };

  const mockFilms = [
    {
      id: '1',
      rating: 9.5,
      director: 'Оливер Беннет',
      tags: ['Рекомендуемые'],
      image: '/bg4s.jpg',
      cover: '/bg4c.jpg',
      title: 'Парадокс Нексуса',
      about:
        'В фильме исследуются последствия новаторского эксперимента по соединению человеческих умов. По мере развития проекта участники сталкиваются с вопросами неприкосновенности частной жизни, идентичности и самой природы человеческого сознания.',
      description:
        'В фильме исследуются последствия новаторского эксперимента по соединению человеческих умов. По мере развития проекта участники сталкиваются с вопросами неприкосновенности частной жизни, идентичности и самой природы человеческого сознания.',
    },
    {
      id: '2',
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      title: 'Архитекторы общества',
      about:
        'Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.',
      description:
        'Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.',
    },
  ];

  const mockSchedules = [
    {
      id: '1',
      filmId: '1',
      daytime: '2024-06-28T10:00:53+03:00',
      hall: '1',
      price: 350,
      rows: 5,
      seats: 10,
      taken: ['3:3', '2:1'],
    },
    {
      id: '2',
      filmId: '1',
      daytime: '2024-06-28T14:00:53+03:00',
      hall: '2',
      price: 350,
      rows: 5,
      seats: 10,
      taken: ['5:5', '3:4'],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('Должен возвращать список фильмов в формате объекта с total и items', async () => {
      mockFilmsService.findAll.mockResolvedValue(mockFilms);

      const result = await controller.findAll();

      expect(result).toEqual({
        total: 2,
        items: mockFilms,
      });
      expect(mockFilmsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('Должен возвращать пустой список, если фильмов нет', async () => {
      mockFilmsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('getSchedule', () => {
    it('Должен возвращать расписание фильма в формате объекта с total и items', async () => {
      mockFilmsService.getSchedule.mockResolvedValue(mockSchedules);

      const result = await controller.getSchedule('1');

      expect(result).toEqual({
        total: 2,
        items: mockSchedules,
      });
      expect(mockFilmsService.getSchedule).toHaveBeenCalledWith('1');
    });
  });
});
