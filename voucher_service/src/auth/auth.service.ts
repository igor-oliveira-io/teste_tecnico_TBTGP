import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: { username: string; password: string }) {
    const { username, password } = loginDto;
    if (username !== 'admin' || password !== 'password') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
