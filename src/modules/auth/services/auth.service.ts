/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as Sentry from '@sentry/node';
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
    const payload = { email: user.email };
    const response = this.jwtService.sign(payload);
    return {
      token: response,
      email: user.email,
    } as AuthLoginResponse;
  }

  async createUser(newUser: UserLogin): Promise<UserDocument> {
    try {
      const response = await new this.model({
        ...newUser,
        cratedAt: new Date(),
      }).save();

      return response;
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  async findUser(email: string): Promise<UserDocument> {
    try {
      return await this.model.findOne({ email: email }).exec();
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  async updatePassword(
    userId: string,
    hashedPass: string,
  ): Promise<UserDocument> {
    try {
      return await this.model
        .findByIdAndUpdate(userId, {
          password: hashedPass,
          updatedAt: new Date(),
        })
        .exec();
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }
}
