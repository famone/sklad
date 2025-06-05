import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { StatusDto } from './dto/status.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { EnumRole } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(EnumRole.ADMIN)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(EnumRole.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(EnumRole.ADMIN)
  @Patch(':id')
  async changeStatus(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.usersService.changeStatus(+id, dto.role);
  }
}
