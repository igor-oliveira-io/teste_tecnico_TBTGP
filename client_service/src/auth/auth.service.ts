import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: { username: string; password: string }) {
    const { username, password } = loginDto;

    // Validação simplificada (substitua por lógica real)
    if (username !== 'admin' || password !== 'password') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Gerar o token JWT
    const payload = { username }; // Payload com o nome de usuário
    return {
      access_token: this.jwtService.sign(payload), // Token gerado
    };
  }
}
