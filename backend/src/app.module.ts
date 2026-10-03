import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { FilmEntity } from './films/entities/film.entity';
import { ScheduleEntity } from './films/entities/schedule.entity';
import { AppConfigModule } from './app.config.module';
import { AppConfig } from './app.config.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: ['CONFIG'],
      useFactory: (config: AppConfig) => ({
        type: config.database.driver,
        url: config.database.url,
        username: config.database.username,
        password: config.database.password,
        entities: [FilmEntity, ScheduleEntity],
        synchronize: false,
      }),
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
