import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './order.controller';

import { OrdersService } from './order.service';
import { OrderDataDTO } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    })
      .overrideProvider(OrdersService)
      .useValue({
        createOrder: jest.fn().mockResolvedValue({
          items: [
            {
              id: "1",
              film: 'filmId',
              session: 'sessionId',
              daytime: '2025-01-01',
              day: 'Wednesday',
              time: '18:00',
              row: 1,
              seat: 1,
              price: 100,
            },
          ],
          total: 1,
        }),
      })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('.createOrder() should be call OrderService.createOrder and return the result', async () => {
    const orderData: OrderDataDTO = {
      tickets: [
        {
          id: "1",
          film: 'filmId',
          session: 'sessionId',
          daytime: '2025-01-01',
          day: 'Wednesday',
          time: '18:00',
          row: 1,
          seat: 1,
          price: 100,
        },
      ],
      email: 'test@example.com',
      phone: '+79001234567',
    };
    const orderComplete = await controller.createOrder(orderData);
    const result = {
      items: orderData.tickets,
      total: orderData.tickets.length,
    };
    expect(orderComplete).toEqual(result);
    expect(service.createOrder).toHaveBeenCalledWith(orderData);
  });
});