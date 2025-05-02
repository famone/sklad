import { EnumOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEnum(EnumOrderStatus, { message: 'статус обязателен' })
  status: EnumOrderStatus;

  @IsArray({ message: 'В заказе нет товаров' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  productId: string;
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(EnumOrderStatus, { message: 'статус обязателен' })
  status: EnumOrderStatus;
}
