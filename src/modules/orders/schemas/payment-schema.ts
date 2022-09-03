/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop()
  orderId: string;

  @Prop({ default: false })
  isPaymentFinished: boolean;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  provider: string;

  @Prop({ default: new Date() })
  paidAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
