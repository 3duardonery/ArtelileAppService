/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PurchaseDocument = Purchase & Document;

@Schema()
export class Purchase {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: number;

  @Prop({ default: new Date() })
  purchasedAt: Date;

  @Prop()
  provider: string;

  @Prop()
  paymentWay: string;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
