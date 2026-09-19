import { Module } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [FilmsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrderModule {}