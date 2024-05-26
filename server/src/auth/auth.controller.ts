import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() registerDto: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    const user = await this.authService.userService.findOneByEmail(
      registerDto.email,
    );
    if (user) {
      throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
    }
    return this.authService.register(registerDto);
  }
}
