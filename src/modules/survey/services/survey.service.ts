import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey, SurveyDocument } from '../schemas/survey-schema';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly survey: Model<SurveyDocument>,
  ) {}

  async getAllSurveys(limit: number, page: number): Promise<any> {
    const total = (await this.survey.find()).length;

    const surveys = await this.survey
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
}
