import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany({
      include: {
        package: true,
      },
    });
    return products;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        package: true,
      },
    });

    if (!product) throw new NotFoundException('Продукт не найден');

    return product;
  }

  async create(dto: ProductDto): Promise<Product> {
    const product = await this.prismaService.product.create({
      data: {
        ...dto,
      },
    });
    return product;
  }

  // async create(dto: PackageDto): Promise<Package> {
  //   const packageItem = await this.prismaService.package.create({
  //     data: {
  //       name: dto.name,
  //     },
  //   });

  //   return packageItem;
  // }
}
