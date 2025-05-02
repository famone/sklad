import { Body, Controller, Get, Post } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageDto } from './dto/package.dto';

@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @Post()
  create(@Body() dto: PackageDto) {
    return this.packageService.create(dto);
  }
}
