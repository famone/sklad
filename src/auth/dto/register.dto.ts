import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не может быть пустым' })
  @MaxLength(50, { message: 'Имя не больше 50 символов' })
  name: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат почты' })
  email: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не может быть пустым' })
  @MinLength(6, { message: 'Пароль не менее 6 символов' })
  @MaxLength(120, { message: 'Пароль не больше 120 символов' })
  password: string;
}
