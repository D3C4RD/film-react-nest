import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule } from "@nestjs/config";
import { join } from 'path';
import { configProvider } from "./app.config.provider";
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    // Используем process.env напрямую
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/prac'),
    FilmsModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/content/afisha/',
    }),
  ],
  providers: [configProvider],
})
export class AppModule {}