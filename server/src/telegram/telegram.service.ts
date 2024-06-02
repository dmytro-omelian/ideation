import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TelegramService {
  private readonly botToken: string = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId: string = process.env.TELEGRAM_CHAT_ID;

  async sendImage(
    imageBuffer: Buffer,
    imageName: string,
    caption: string,
    tags: string,
  ): Promise<any> {
    const combinedCaptionWithTags = this.combineCaptionWithTags(caption, tags);

    const formData = new FormData();
    formData.append('chat_id', this.chatId);
    formData.append('photo', imageBuffer, { filename: imageName });
    formData.append('caption', combinedCaptionWithTags);

    const headers = formData.getHeaders();

    const response = await axios.post(
      `https://api.telegram.org/bot${this.botToken}/sendPhoto`,
      formData,
      { headers },
    );

    return response.data;
  }

  private combineCaptionWithTags(caption: string, tags: string): string {
    const formattedTags = tags
      .split(',')
      .map((tag) => (tag.trim().length > 0 ? `#${tag.trim()}` : ''))
      .join(' ');

    return `${caption}\n\n${formattedTags}`;
  }
}