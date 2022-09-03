/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Quote } from '../../quotes/schemas/quote-schema';
import { PaymentWay } from '../models/order-request';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  quoteId: string;
  @Prop({ required: true })
  quote: Quote;
  @Prop({ default: new Date() })
  orderedAt: Date;
  @Prop()
  startedAt: Date;
  @Prop()
  deliveredAt: Date;
  @Prop()
  finishedAt: Date;
  @Prop()
  paymentWay: PaymentWay;
  @Prop({ default: 'Pedido Aprovado' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
