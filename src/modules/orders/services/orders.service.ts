import { Injectable } from '@nestjs/common';
import { OrderRequest, PaymentWay } from '../models/order-request';
import { Order, OrderDocument } from '../schemas/order-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote, QuoteDocument } from 'src/modules/quotes/schemas/quote-schema';
import { Payment, PaymentDocument } from '../schemas/payment-schema';
import { PaymentRequest } from '../models/payment-request';

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
        status: 'Pedido Realizado',
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

    if (status == 'Em Execução') {
      updateObject = {
        status: status,
        startedAt: new Date(),
      };
    } else if (status == 'Produção Finalizada') {
      updateObject = {
        status: status,
        finishedAt: new Date(),
      };
    } else if (status == 'Entregue') {
      console.log(status);

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
      status: 'Entregue',
      deliveredAt: new Date(),
      paymentWay: paymentWay,
    };

    if (lastPayment && !lastPayment.isFullValue) {
      await new this.payment({ ...lastPayment }).save();
    }

    return await this.model.findByIdAndUpdate(orderId, updateObject).exec();
  }

  async getOrders(limit: number, page: number): Promise<any> {
    const total = (await this.model.find()).length;

    const quotes = await this.model
      .find()
      .limit(limit)
      .skip(limit * page)
      .sort({
        orderedAt: -1,
      })
      .exec();

    return {
      length: total,
      pages: Math.ceil(total / limit),
      data: quotes,
    };
  }

  async getOrderById(orderId: string): Promise<any> {
    return await this.model.findById(orderId).exec();
  }
}
