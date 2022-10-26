/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
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

  async getSurveyByOrderId(orderId: string): Promise<any> {
    const order = await this.orders.findById(orderId).exec();
    const survey = await this.surveys.findOne({ orderId: orderId }).exec();

    return {
      order: order,
      survey: survey,
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
        throw new HttpException('OrderId is invalid', HttpStatus.BAD_REQUEST);
      }

      const orderIsFinished = await this.orders.findById(orderId).exec();

      if (orderIsFinished.status != OrderStatus.DELIVERIED) {
        throw new HttpException(
          'The survey cannot be started',
          HttpStatus.BAD_REQUEST,
        );
      }

      const surveyForOrderIsExists = await this.surveys
        .findOne({ orderId: orderId })
        .exec();

      if (surveyForOrderIsExists) {
        throw new HttpException(
          'Survey already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const questions = await this.getQuestions();
      const survey = {
        questions: questions,
        orderId: orderId,
        url: `${process.env.SURVEY_PREFIX_URL}/survey/${orderId}`,
        createdAt: new Date(),
        finishAt: undefined,
        isFinishedOrDue: false,
        dueAt: undefined,
        feedback: undefined,
      };

      return new this.surveys({ ...survey }).save();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async finishSurvey(survey: SurveyFinishRequest): Promise<any> {
    try {
      if (!isValidObjectId(survey._id) || !isValidObjectId(survey.orderId)) {
        throw new HttpException(
          'Order key or Survey key invalid',
          HttpStatus.BAD_REQUEST,
        );
      }

      const exixtingSurvey = await this.surveys.findById(survey._id).exec();

      if (!exixtingSurvey) {
        throw new HttpException(
          'There is no survey for this order',
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.surveys
        .findByIdAndUpdate(survey._id, {
          isFinishedOrDue: true,
          finishedAt: new Date(),
          questions: survey.questions,
          feedback: survey.feedback,
        })
        .exec();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getQuestions(): Promise<QuestionDocument[]> {
    return await this.questions.find();
  }

  async validateOrder(orderId: string): Promise<SurveyDocument> {
    try {
      if (!isValidObjectId(orderId)) {
        throw new HttpException('Order key is invalid', HttpStatus.NOT_FOUND);
      }

      const order = await this.orders.findById(orderId).exec();

      if (order && order.status != OrderStatus.DELIVERIED) {
        throw new HttpException(
          'You are not allowed to be here',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const survey = await this.surveys.findOne({ orderId: orderId }).exec();

      if (!survey) {
        throw new HttpException(
          'There is no surveys for this order',
          HttpStatus.NO_CONTENT,
        );
      }

      if (survey && survey.isFinishedOrDue) {
        throw new HttpException(
          'Survey is already finished',
          HttpStatus.BAD_REQUEST,
        );
      }

      return survey;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
