import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from '@framework/auth/models/dto/auth-credentials.dto';
import { AuthService } from '@framework/auth/service/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/login')
  logIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
    return this.authService.logIn(authCredentialsDto);
  }
}
