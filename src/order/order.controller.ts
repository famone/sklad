import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('per_page') per_page: string,
  ) {
    return this.orderService.findAll(page, per_page);
  }

  @Post()
  async createOrder(@Body() dto: OrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Patch(':id')
  async chnangeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.chnangeStatus(id, dto);
  }

  @Get('statistics')
  async getStatistics() {
    return this.orderService.getStatistics();
  }
}
