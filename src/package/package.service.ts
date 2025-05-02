import { Injectable } from '@nestjs/common';
import { Package } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PackageDto } from './dto/package.dto';

@Injectable()
export class PackageService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Package[]> {
    const packages = await this.prismaService.package.findMany();
    return packages;
  }

  async create(dto: PackageDto): Promise<Package> {
    const packageItem = await this.prismaService.package.create({
      data: {
        name: dto.name,
      },
    });

    return packageItem;
  }
}
