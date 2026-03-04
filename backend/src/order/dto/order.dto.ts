import {
  IsString,
  IsNumber,
  IsUUID,
  Min,
  IsDateString,
  IsEmail,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTiketDto {
  @IsString()
  @IsUUID()
  film: string;

  @IsString()
  @IsUUID()
  session: string;

  @IsString()
  @IsDateString()
  daytime: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  row: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  seat: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTiketDto)
  tickets: CreateTiketDto[];
}

export class OrderItemResponseDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
  id: string;
}
