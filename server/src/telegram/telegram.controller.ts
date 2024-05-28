// src/telegram/telegram.controller.ts

import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TelegramService } from './telegram.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('send-image')
  @UseInterceptors(FileInterceptor('image'))
  async sendImage(
    @Body('caption') caption: string,
    @Body('tags') tags: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.telegramService.sendImage(
      file.buffer,
      file.originalname,
      caption,
      tags,
    );
    return result;
  }
}
