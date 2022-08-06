import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../../orders/schemas/order-schema';
import { Model } from 'mongoose';
import * as Sentry from '@sentry/node';
import { Quote, QuoteDocument } from '../../quotes/schemas/quote-schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private readonly order: Model<OrderDocument>,
    @InjectModel(Quote.name) private readonly quote: Model<QuoteDocument>,
  ) {}

  async getOrderReport(
    startDate: string,
    endDate: string,
    status: string,
  ): Promise<any> {
    try {
      const response = await this.order.find({
        orderedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: status,
      });

      const t = response.reduce(
        (total, order) => total + order.quote.totalValue,
        0,
      );

      return {
        length: response.length,
        sold: t,
        data: response,
      };
    } catch (e) {
      Sentry.captureException(e.message);
      return [];
    }
  }

  async getQuoteReport(
    startDate: string,
    endDate: string,
    status: string,
  ): Promise<any> {
    try {
      const response = await this.quote.find({
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: status,
      });

      const t = response.reduce((total, order) => total + order.totalValue, 0);

      return {
        length: response.length,
        sold: t,
        data: response,
      };
    } catch (e) {
      Sentry.captureException(e.message);
      return [];
    }
  }
}
