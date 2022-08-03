import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserLogin } from './models/auth-login';
import { AuthService } from './services/auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async auth(@Body() loginUser: UserLogin, @Res() res: Response) {
    const verifyuser = await this.authService.findUser(loginUser.username);

    if (verifyuser == undefined || verifyuser == null) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ errorMessage: 'User or password invalid' })
        .send();

      return;
    }

    const passwordIsEquals = await bcrypt.compare(
      loginUser.password,
      verifyuser.password,
    );

    if (!passwordIsEquals) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ errorMessage: 'User or password invalid' })
        .send();

      return;
    }

    const response = this.authService.authenticateUser(loginUser);

    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createUser(@Body() loginUser: UserLogin, @Res() res: Response) {
    const verifyuser = await this.authService.findUser(loginUser.username);

    if (verifyuser != undefined) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ errorMessage: 'Username is already in use' })
        .send();

      return;
    }

    const saltOrRounds = 10;
    const password = loginUser.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const response = await this.authService.createUser({
      username: loginUser.username,
      password: hash,
    });

    res.status(HttpStatus.CREATED).json(response).send();
  }

  @Patch()
  updatePass(@Body() updateUser: UserLogin, @Res() res: Response) {
    //const response = this.authService.updatePassword(loginUser);

    res.status(HttpStatus.CREATED).json([]);
  }
}
