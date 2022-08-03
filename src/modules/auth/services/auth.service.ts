/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLogin } from '../models/auth-login';
import { AuthLoginResponse } from '../models/auth_login_response';
import { User, UserDocument } from '../schemas/user-schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  authenticateUser(user: UserLogin): AuthLoginResponse {
    const payload = { username: user.username };
    const response = this.jwtService.sign(payload);
    return {
      access_token: response,
      user: user.username,
    } as AuthLoginResponse;
  }

  async createUser(newUser: UserLogin): Promise<UserDocument> {
    const response = await new this.model({
      ...newUser,
      cratedAt: new Date(),
    }).save();

    return response;
  }

  async findUser(username: string): Promise<UserDocument> {
    return await this.model.findOne({ username: username }).exec();
  }

  async updatePassword(
    userId: string,
    hashedPass: string,
  ): Promise<UserDocument> {
    return await this.model
      .findByIdAndUpdate(userId, {
        password: hashedPass,
        updatedAt: new Date(),
      })
      .exec();
  }
}
