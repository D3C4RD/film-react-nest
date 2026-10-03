import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrderDataDTO } from './dto/order.dto';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() orderDataDto: OrderDataDTO) {
    return this.ordersService.createOrder(orderDataDto);
  }
}
