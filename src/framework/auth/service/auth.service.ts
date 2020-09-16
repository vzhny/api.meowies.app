import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@framework/auth/models/repositories/user.repository';
import { AuthCredentialsDto } from '@framework/auth/models/dto/auth-credentials.dto';
import { JwtPayload } from '@framework/auth/models/jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(@InjectRepository(UserRepository) private userRepo: UserRepository, private jwtService: JwtService) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepo.signUp(authCredentialsDto);
  }

  async logIn(authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
    const username = await this.userRepo.validateUserPassword(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload: JwtPayload = { username };
    const token = await this.jwtService.sign(payload);

    this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`);

    return { token };
  }
}
