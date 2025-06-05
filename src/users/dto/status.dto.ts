import { EnumRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class StatusDto {
  @IsEnum(EnumRole, { message: 'Некорректная роль' })
  role: EnumRole;
}
