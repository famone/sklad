import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { User } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(private readonly authService: AuthService) {}

  uploadFile(user: User, file: Express.Multer.File) {
    if (!file || !file.originalname || !file.buffer) {
      throw new BadRequestException('Некорректный файл');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadDir, file.originalname);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);

    return this.authService.changeAvartar(`uploads/${file.originalname}`, user);
  }
}
