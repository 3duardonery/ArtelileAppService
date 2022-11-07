import { Injectable } from '@nestjs/common';
import { OrderRequest, PaymentWay } from '../models/order-request';
import { Order, OrderDocument } from '../schemas/order-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
import { Quote, QuoteDocument } from 'src/modules/quotes/schemas/quote-schema';
import { Payment, PaymentDocument } from '../schemas/payment-schema';
import { PaymentRequest } from '../models/payment-request';
import { OrderResponse } from '../models/order-response';
import { OrderStatus } from '../utils/order-status';
import * as Sentry from '@sentry/node';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<OrderDocument>,
    @InjectModel(Quote.name) private readonly quote: Model<QuoteDocument>,
    @InjectModel(Payment.name) private readonly payment: Model<PaymentDocument>,
  ) {}

  async createOrder(
    order: OrderRequest,
    payment: PaymentRequest,
  ): Promise<OrderDocument> {
    try {
      await this.quote
        .findByIdAndUpdate(order.quoteId, {
          status: OrderStatus.ORDER_MADE,
        })
        .exec();

      const orderResponse = await new this.model({
        ...order,
        deliveredAt: null,
      }).save();

      payment.orderId = orderResponse._id;

      await new this.payment({ ...payment }).save();

      return orderResponse;
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  async findOrderById(orderId: string): Promise<OrderDocument> {
    try {
      return await this.model.findById(orderId).exec();
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  async updateStatus(orderId: string, status: string): Promise<OrderDocument> {
    try {
      let updateObject = {};

      if (status == OrderStatus.IN_EXECUTION) {
        updateObject = {
          status: status,
          startedAt: new Date(),
        };
      } else if (status == OrderStatus.PRODUCTION_FINISHED) {
        updateObject = {
          status: status,
          finishedAt: new Date(),
        };
      } else if (status == OrderStatus.DELIVERIED) {
        updateObject = {
          status: status,
          deliveredAt: new Date(),
        };
      } else {
        updateObject = {
          status: status,
          finishedAt: new Date(),
        };
      }

      return await this.model.findByIdAndUpdate(orderId, updateObject).exec();
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  async finishOrder(
    orderId: string,
    paymentWay: PaymentWay,
    lastPayment: PaymentRequest,
  ): Promise<OrderDocument> {
    try {
      const updateObject = {
        status: OrderStatus.DELIVERIED,
        deliveredAt: new Date(),
        paymentWay: paymentWay,
      };

      if (lastPayment && !lastPayment.isFullValue) {
        await new this.payment({ ...lastPayment }).save();
      }

      return await this.model.findByIdAndUpdate(orderId, updateObject).exec();
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  async getOrders(limit: number, page: number): Promise<OrderResponse> {
    try {
      const total = (await this.model.find()).length;

      const quotes = await this.model
        .find()
        .limit(limit)
        .skip(limit * page)
        .sort({
          orderedAt: -1,
        })
        .exec();

      const response: OrderResponse = {
        length: total,
        pages: Math.ceil(total / limit),
        data: quotes,
      };

      return response;
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  async getOrdersByQuery(
    orderStatus: string,
    orderName: string,
    customerName: string,
    limit: number,
    page: number,
  ): Promise<OrderResponse> {
    try {
      const total = (
        await this.model.find(
          this.getOrderFilter(orderName, orderStatus, customerName),
        )
      ).length;

      const orders = await this.model
        .find(this.getOrderFilter(orderName, orderStatus, customerName))
        .limit(limit)
        .skip(limit * page)
        .sort({
          orderedAt: -1,
        })
        .exec();

      const response: OrderResponse = {
        length: total,
        pages: Math.ceil(total / limit),
        data: orders,
      };

      return response;
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  async getOrderById(orderId: string): Promise<OrderDocument> {
    try {
      return await this.model.findById(orderId).exec();
    } catch (e) {
      Sentry.captureException(e);
      return null;
    }
  }

  private getOrderFilter(
    orderName: string,
    orderStatus: string,
    customerName: string,
  ): any {
    return {
      status:
        orderStatus != undefined && orderStatus != 'Todos'
          ? orderStatus
          : { $ne: null },
      'quote.name':
        orderName != undefined
          ? { $regex: orderName, $options: 'i' }
          : { $ne: null },
      'quote.customer.name':
        customerName != undefined
          ? { $regex: customerName, $options: 'i' }
          : { $ne: null },
    };
  }
}
