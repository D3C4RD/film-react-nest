import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsString, IsNumber, IsArray } from 'class-validator';
import { FilmEntity } from './film.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  daytime: string;

  @Column()
  @IsNumber()
  hall: number;

  @Column()
  @IsNumber()
  rows: number;

  @Column()
  @IsNumber()
  seats: number;

  @Column()
  @IsNumber()
  price: number;

  @Column('text', { array: true })
  @IsArray()
  taken: string[];

  @Column('uuid')
  @IsString()
  filmId: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedule)
  film: FilmEntity;
}
