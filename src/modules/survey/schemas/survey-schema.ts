/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuestionResponse } from '../models/question-response';

export type SurveyDocument = Survey & Document;

@Schema()
export class Survey {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  finishAt: Date;

  @Prop()
  isFinishedOrDue: boolean;

  @Prop()
  dueAt: Date;

  @Prop()
  questions: QuestionResponse[];

  @Prop()
  feedback: string;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
