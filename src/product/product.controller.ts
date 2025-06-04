import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Post()
  async create(@Body() dto: ProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  async editProduct(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.editProduct(id, dto);
  }
}
