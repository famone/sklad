import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @Post()
  uploadFile(
    @Req() req: Request & { user: User },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /\/(jpg|jpeg|png|webp|gif|mp4)$/i,
          }),
          new MaxFileSizeValidator({
            maxSize: 2.5 * 1024 * 1024, // 2.5 MB
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(req.user.id);
    return this.fileService.uploadFile(req.user, file);
  }
}
