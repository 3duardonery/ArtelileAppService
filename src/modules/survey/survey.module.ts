/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../orders/schemas/order-schema';
import { SurveyController } from './controllers/survey.controller';
import { Question, QuestionSchema } from './schemas/question-schemas';
import { Survey, SurveySchema } from './schemas/survey-schema';
import { SurveyService } from './services/survey.service';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService],
  imports: [
    MongooseModule.forFeature([{ name: Survey.name, schema: SurveySchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
})
export class SurveyModule {}
