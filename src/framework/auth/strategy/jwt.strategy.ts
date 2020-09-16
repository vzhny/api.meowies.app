import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as config from 'config';
import { JwtPayload } from '@framework/auth/models/jwt-payload.interface';
import { User } from '@framework/auth/models/entities/user.entity';
import { UserRepository } from '@framework/auth/models/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(UserRepository) private userRepo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepo.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    } else {
      return user;
    }
  }
}
