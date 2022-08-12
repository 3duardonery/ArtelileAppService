/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Question } from '../models/question';

export type SurveyDocument = Survey & Document;

@Schema()
export class Survey {
  @Prop({ required: true })
  order_id: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  finishAt: Date;

  @Prop()
  dueAt: Date;

  @Prop()
  questions: Question[];

  @Prop()
  feedback: string;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
