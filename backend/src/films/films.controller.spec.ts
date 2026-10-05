import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { GetFilmDTO, GetScheduleDTO } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockSchedule: GetScheduleDTO = {
    id: 'schedule-id',
    daytime: '2026-05-10T10:00:00Z',
    hall: 1,
    rows: 5,
    seats: 100,
    price: 777,
    taken: [],
  };

  const mockFilm: GetFilmDTO = {
    id: 'film-id',
    rating: 8.5,
    director: 'Харрисон Рид',
    tags: ['Рекомендуемые'],
    image: 'http://example.com/image.jpg',
    cover: 'http://example.com/cover.jpg',
    title: 'Film Title',
    about: 'About the film',
    description: 'Description of the film',
    schedule: [mockSchedule],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        getAllFilms: jest.fn().mockResolvedValue([mockFilm]),
        getScheduleFilm: jest.fn().mockResolvedValue(mockSchedule),
        getNewFilm: jest.fn(),
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  describe('.getFilms()', () => {
    it('should be return all films', async () => {
      const result = await controller.getAllFilms();
      expect(result).toEqual([mockFilm]);
      expect(service.getAllFilms).toHaveBeenCalled();
    });
  });

  describe('.getSchedule()', () => {
    it('should be return schedule for a film', async () => {
      const result = await controller.getFilmSchedule('film-id');
      expect(result).toEqual(mockSchedule);
      expect(service.getScheduleFilm).toHaveBeenCalledWith('film-id');
    });
  });
});