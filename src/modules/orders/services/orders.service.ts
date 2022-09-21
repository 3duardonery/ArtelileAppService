import { Injectable } from '@nestjs/common';
import { OrderRequest, PaymentWay } from '../models/order-request';
import { Order, OrderDocument } from '../schemas/order-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote, QuoteDocument } from 'src/modules/quotes/schemas/quote-schema';
import { Payment, PaymentDocument } from '../schemas/payment-schema';
import { PaymentRequest } from '../models/payment-request';
import { OrderResponse } from '../models/order-response';
import { OrderStatus } from '../utils/order-status';

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
  }

  async findOrderById(orderId: string): Promise<OrderDocument> {
    return await this.model.findById(orderId).exec();
  }

  async updateStatus(orderId: string, status: string): Promise<OrderDocument> {
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
  }

  async finishOrder(
    orderId: string,
    paymentWay: PaymentWay,
    lastPayment: PaymentRequest,
  ): Promise<OrderDocument> {
    const updateObject = {
      status: OrderStatus.DELIVERIED,
      deliveredAt: new Date(),
      paymentWay: paymentWay,
    };

    if (lastPayment && !lastPayment.isFullValue) {
      await new this.payment({ ...lastPayment }).save();
    }

    return await this.model.findByIdAndUpdate(orderId, updateObject).exec();
  }

  async getOrders(limit: number, page: number): Promise<OrderResponse> {
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
  }

  async getOrderById(orderId: string): Promise<OrderDocument> {
    return await this.model.findById(orderId).exec();
  }
}
