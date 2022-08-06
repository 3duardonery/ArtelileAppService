/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ default: new Date() })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
