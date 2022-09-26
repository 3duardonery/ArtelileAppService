/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  question: string;
  @Prop()
  value: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
