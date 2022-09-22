import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { Order, OrderDocument } from 'src/modules/orders/schemas/order-schema';
import { OrderStatus } from 'src/modules/orders/utils/order-status';
import { QuestionRequest } from '../models/question-create-request';
import { SurveyFinishRequest } from '../models/survey-finish-request';
import { Question, QuestionDocument } from '../schemas/question-schemas';
import { Survey, SurveyDocument } from '../schemas/survey-schema';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveys: Model<SurveyDocument>,
    @InjectModel(Order.name) private readonly orders: Model<OrderDocument>,
    @InjectModel(Question.name)
    private readonly questions: Model<QuestionDocument>,
  ) {}

  async getAllSurveys(limit: number, page: number): Promise<any> {
    const total = (await this.surveys.find()).length;

    const surveys = await this.surveys
      .find()
      .limit(limit)
      .skip(limit * page)
      .sort({
        createdAt: -1,
      })
      .exec();

    return {
      length: total,
      pages: Math.ceil(total / limit),
      data: surveys,
    };
  }

  async createQuestion(question: QuestionRequest): Promise<QuestionDocument> {
    const response = await new this.questions({
      ...question,
    }).save();

    return response;
  }

  async startSurvey(orderId: string): Promise<any> {
    try {
      if (!isValidObjectId(orderId)) {
        return null;
      }

      const orderIsFinished = await this.orders.findById(orderId).exec();

      if (orderIsFinished.status != OrderStatus.DELIVERIED) {
        return null;
      }

      const questions = await this.getQuestions();
      const survey = {
        questions: questions,
        orderId: orderId,
        url: `http://localhost:4200/surveys/${orderId}`,
        createdAt: new Date(),
        finishAt: undefined,
        isFinishedOrDue: false,
        dueAt: undefined,
        feedback: undefined,
      };

      return new this.surveys({ ...survey }).save();
    } catch (error) {
      console.log(error);
    }
  }

  async finishSurvey(survey: SurveyFinishRequest): Promise<any> {
    return await this.surveys
      .findByIdAndUpdate(survey._id, {
        isFinishedOrDue: true,
        finishedAt: new Date(),
        questions: survey.questions,
        feedback: survey.feedback,
      })
      .exec();
  }

  async getQuestions(): Promise<QuestionDocument[]> {
    return await this.questions.find();
  }
}
