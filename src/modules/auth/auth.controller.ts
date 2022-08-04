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
import { UpdateLogin } from './models/update-login';

@Controller('api/auth')
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

    const hash = await this.createHash(loginUser.password);

    const response = await this.authService.createUser({
      username: loginUser.username,
      password: hash,
    });

    res.status(HttpStatus.CREATED).json(response).send();
  }

  @Patch()
  async updatePass(@Body() updateUser: UpdateLogin, @Res() res: Response) {
    const user = await this.authService.findUser(updateUser.username);

    if (user == undefined) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ errorMessage: 'User does not exists' })
        .send();

      return;
    }

    const hash = await this.createHash(updateUser.password);

    const response = this.authService.updatePassword(user.id, hash);

    if (response == undefined) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ errorMessage: 'Error on update' })
        .send();

      return;
    }

    res.status(HttpStatus.CREATED).json(response);
  }

  async createHash(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
  }
}
