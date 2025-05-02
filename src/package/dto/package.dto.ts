import { IsNotEmpty, IsString } from 'class-validator';

export class PackageDto {
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString({ message: 'Не строка' })
  name: string;
}
