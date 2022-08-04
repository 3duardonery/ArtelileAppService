import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { model, Model } from 'mongoose';
import { Filter } from '../models/filter';
import { QuoteRequest } from '../models/quote';
import { Quote, QuoteDocument } from '../schemas/quote-schema';

@Injectable()
export class QuotesService {
  constructor(
    @InjectModel(Quote.name) private readonly model: Model<QuoteDocument>,
  ) {}

  async createQuote(quote: QuoteRequest): Promise<QuoteDocument> {
    try {
      const response = await new this.model({
        ...quote,
      }).save();
      return response;
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.BAD_REQUEST);
    }
  }

  async getQuotes(limit: number, page: number): Promise<any> {
    const total = (await this.model.find()).length;

    const quotes = await this.model
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
      data: quotes,
    };
  }
}
