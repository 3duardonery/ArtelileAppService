import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const total = (await this.model.find({ status: { $ne: 'Cancelado' } }))
      .length;

    const quotes = await this.model
      .find({ status: { $ne: 'Cancelado' } })
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

  async getQuotesByQuery(
    quoteStatus: string,
    quoteName: string,
    customerName: string,
    limit: number,
    page: number,
  ): Promise<any> {
    const total = (
      await this.model.find(
        this.getQuoteFilter(quoteName, quoteStatus, customerName),
      )
    ).length;

    const quotes = await this.model
      .find(this.getQuoteFilter(quoteName, quoteStatus, customerName))
      .limit(limit)
      .skip(limit * page)
      .sort({
        createdAt: -1,
      })
      .exec();

    const response = {
      length: total,
      pages: Math.ceil(total / limit),
      data: quotes,
    };

    return response;
  }

  async cancelQuote(quoteId: string): Promise<any> {
    return await this.model
      .findByIdAndUpdate(quoteId, {
        status: 'Cancelado',
      })
      .exec();
  }

  async updateQuote(quote: QuoteRequest): Promise<any> {
    return await this.model.findByIdAndUpdate(quote._id, quote).exec();
  }

  async getQuoteById(quoteId: string): Promise<any> {
    return await this.model.findById(quoteId).exec();
  }

  async findById(quoteId: string): Promise<QuoteDocument> {
    return await this.model.findById(quoteId).exec();
  }

  private getQuoteFilter(
    quoteName: string,
    quoteStatus: string,
    customerName: string,
  ): any {
    return {
      status:
        quoteStatus != undefined && quoteStatus != 'Todos'
          ? quoteStatus
          : { $ne: null },
      name:
        quoteName != undefined
          ? { $regex: quoteName, $options: 'i' }
          : { $ne: null },
      'customer.name':
        customerName != undefined
          ? { $regex: customerName, $options: 'i' }
          : { $ne: null },
    };
  }
}
