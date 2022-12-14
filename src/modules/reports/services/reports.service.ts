import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../../orders/schemas/order-schema';
import { FilterQuery, Model } from 'mongoose';
import * as Sentry from '@sentry/node';
import { Quote, QuoteDocument } from '../../quotes/schemas/quote-schema';
import {
  Payment,
  PaymentDocument,
} from 'src/modules/orders/schemas/payment-schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private readonly order: Model<OrderDocument>,
    @InjectModel(Quote.name) private readonly quote: Model<QuoteDocument>,
    @InjectModel(Payment.name)
    private readonly payments: Model<PaymentDocument>,
  ) {}

  async getOrderReport(filter: FilterQuery<OrderDocument>): Promise<any> {
    try {
      const response = await this.order.find(filter);

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

  async getQuoteReport(filter: FilterQuery<QuoteDocument>): Promise<any> {
    try {
      const response = await this.quote.find(filter);

      const totalSold = response.reduce(
        (total, order) => total + order.totalValue,
        0,
      );

      return {
        length: response.length,
        sold: totalSold,
        data: response,
      };
    } catch (e) {
      Sentry.captureException(e.message);
      return [];
    }
  }

  async getMoneyReportMonth(
    filter: FilterQuery<PaymentDocument>,
  ): Promise<any> {
    try {
      const response = await this.payments.find(filter);

      const totalSold = response.reduce(
        (total, payment) => total + payment.value,
        0,
      );

      return {
        length: response.length,
        sold: totalSold,
        data: response,
      };
    } catch (e) {
      Sentry.captureException(e.message);
      return [];
    }
  }
}
