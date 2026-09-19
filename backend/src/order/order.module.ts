import { Module } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { FilmsMongoDBRepository } from '../repository/films.repository/filmsMongoDB.repository';
import { Film, FilmSchema } from '../films/schemas/films.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, FilmsMongoDBRepository],
})
export class OrderModule {}
