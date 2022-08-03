import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthLogin } from '../models/auth-login';
import { AuthLoginResponse } from '../models/auth_login_response';
import { User, UserDocument } from '../schemas/user-schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  authenticateUser(user: AuthLogin): AuthLoginResponse {
    const payload = { username: user.username };
    const response = this.jwtService.sign(payload);
    return {
      access_token: response,
      user: user.username,
    } as AuthLoginResponse;
  }

  async createUser(newUser: AuthLogin): Promise<UserDocument> {
    const response = await new this.model({
      ...newUser,
    }).save();

    return response;
  }
}
