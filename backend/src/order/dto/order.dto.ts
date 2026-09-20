import {
  IsArray,
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  filmId: string;
  userId: string;
  seats: string;
}

export class TicketDTO {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsString()
  daytime: string;

  @IsString()
  day: string;

  @IsString()
  time: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  id: string;
}

export class OrderDataDTO {
  @IsEmail()
  email: string;
  @IsMobilePhone()
  phone: string;
  @IsArray()
  tickets: TicketDTO[];
}
