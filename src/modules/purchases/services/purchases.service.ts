import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PurchaseRequest } from '../models/purchase-request';
import { Purchase, PurchaseDocument } from '../schemas/purchase';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name)
    private readonly repository: Model<PurchaseDocument>,
  ) {}

  async create(purchase: PurchaseRequest): Promise<PurchaseDocument> {
    return await new this.repository({ ...purchase }).save();
  }

  async getPurchases(limit: number, page: number): Promise<any> {
    const total = (await this.repository.find()).length;

    const purchases = await this.repository
      .find()
      .limit(limit)
      .skip(limit * page)
      .sort({
        purchasedAt: -1,
      })
      .exec();

    return {
      length: total,
      pages: Math.ceil(total / limit),
      data: purchases,
    };
  }
}
