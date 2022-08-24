import { Injectable } from '@nestjs/common';
import { OrderRequest } from '../models/order-request';
import { Order, OrderDocument } from '../schemas/order-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote, QuoteDocument } from 'src/modules/quotes/schemas/quote-schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<OrderDocument>,
    @InjectModel(Quote.name) private readonly quote: Model<QuoteDocument>,
  ) {}

  async createOrder(order: OrderRequest): Promise<OrderDocument> {
    await this.quote
      .findByIdAndUpdate(order.quoteId, {
        status: 'Pedido Realizado',
      })
      .exec();

    return await new this.model({
      ...order,
    }).save();
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
}
