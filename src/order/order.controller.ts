import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { EnumOrderStatus } from 'generated/prisma';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { EnumRole } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('per_page') per_page: string,
    @Query('search') search: string,
    @Query('status') status?: EnumOrderStatus,
    @Query('date_from') date_from?: string,
    @Query('date_to') date_to?: string,
  ) {
    return this.orderService.findAll(
      page,
      per_page,
      search,
      status,
      date_from,
      date_to,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrder(@Body() dto: OrderDto) {
    return this.orderService.createOrder(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async chnangeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.chnangeStatus(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.MANAGER)
  @Get('statistics')
  async getStatistics() {
    return this.orderService.getStatistics();
  }
}
