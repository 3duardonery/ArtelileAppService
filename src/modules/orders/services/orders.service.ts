import { Injectable } from '@nestjs/common';
import { OrderRequest } from '../models/order-request';
import { Order, OrderDocument } from '../schemas/order-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<OrderDocument>,
  ) {}

  async createOrder(order: OrderRequest): Promise<OrderDocument> {
    return await new this.model({ ...order }).save();
  }

  async findOrderById(orderId: string): Promise<OrderDocument> {
    return await this.model.findById(orderId).exec();
  }

  async updateStatus(orderId: string, status: string): Promise<OrderDocument> {
    return await this.model
      .findByIdAndUpdate(orderId, {
        status: status,
      })
      .exec();
  }
}
