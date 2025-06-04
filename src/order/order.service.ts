import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { EnumOrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    page: string = '1',
    per_page: string = '10',
    search: string = '',
    status?: EnumOrderStatus,
    date_from?: string,
    date_to?: string,
  ) {
    const whereClause: Prisma.OrderWhereInput = {
      ...(search && {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(status && {
        status,
      }),
      ...(date_from || date_to
        ? {
            createdAt: {
              ...(date_from && { gte: new Date(date_from) }),
              ...(date_to && { lte: new Date(date_to) }),
            },
          }
        : {}),
    };

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        skip: (+page - 1) * +per_page,
        take: +per_page,
        orderBy: {
          createdAt: 'desc',
        },
        where: whereClause,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prismaService.order.count({
        where: whereClause,
      }),
    ]);

    return {
      total,
      page,
      per_page,
      orders,
    };
  }

  async createOrder(dto: OrderDto) {
    const orderItems = dto.items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      product: {
        connect: {
          id: item.productId,
        },
      },
    }));

    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const order = await this.prismaService.order.create({
      data: {
        name: dto.name,
        status: dto.status,
        items: {
          create: orderItems,
        },
        total,
      },
    });

    return order;
  }

  async chnangeStatus(id: string, dto: UpdateOrderStatusDto) {
    const { status } = dto;
    const order = await this.prismaService.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) throw new NotFoundException('Продукт не найден');

    return this.prismaService.order.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async getStatistics() {
    const success = await this.prismaService.order.findMany({
      where: {
        status: EnumOrderStatus.PAYED,
      },
      select: {
        total: true,
      },
    });

    const pending = await this.prismaService.order.findMany({
      where: {
        status: EnumOrderStatus.PENDING,
      },
      select: {
        total: true,
      },
    });

    const amount = success.length;
    const total = success.reduce((acc, order) => acc + order.total, 0);
    const pending_amount = pending.length;
    const pending_total = pending.reduce((acc, order) => acc + order.total, 0);

    return {
      amount,
      total,
      pending_amount,
      pending_total,
    };
  }
}
