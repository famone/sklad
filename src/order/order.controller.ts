import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { EnumOrderStatus } from 'generated/prisma';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { EnumRole, User } from '@prisma/client';
import { type Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { user: User },
    @Query('page') page: string,
    @Query('per_page') per_page: string,
    @Query('search') search: string,
    @Query('status') status?: EnumOrderStatus,
    @Query('date_from') date_from?: string,
    @Query('date_to') date_to?: string,
  ) {
    return this.orderService.findAll(
      req.user,
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
  async createOrder(
    @Body() dto: OrderDto,
    @Req() req: Request & { user: User },
  ) {
    return this.orderService.createOrder(dto, req.user);
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
  async getStatistics(@Req() req: Request & { user: User }) {
    return this.orderService.getStatistics(req.user);
  }
}
