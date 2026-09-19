import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { FilmEntity } from './films/entities/film.entity';
import { ScheduleEntity } from './films/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'prac',
      password: process.env.DB_PASSWORD ?? 'prac',
      database: process.env.DB_NAME ?? 'prac',
      entities: [FilmEntity, ScheduleEntity],
      synchronize: false,
    }),
    FilmsModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      renderPath: '/content/afisha/',
    }),
  ],
})
export class AppModule {}
