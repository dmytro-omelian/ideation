// src/auth/auth.service.ts
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) public userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(user: {
    email: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const newUser = await this.userService.create(user);
    const payload = { email: newUser.email, sub: newUser.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
