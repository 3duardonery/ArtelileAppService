import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthLogin } from './models/auth-login';
import { AuthService } from './services/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  auth(@Body() loginUser: AuthLogin, @Res() res: Response) {
    const response = this.authService.authenticateUser(loginUser);

    res.status(HttpStatus.OK).json(response);
  }

  @Post('create')
  createUser(@Body() loginUser: AuthLogin, @Res() res: Response) {
    const response = this.authService.createUser(loginUser);

    res.status(HttpStatus.CREATED).json(response);
  }
}
