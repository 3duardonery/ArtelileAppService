/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Customer, DeliveryDetails, QuoteItem } from '../models/quote';

export type QuoteDocument = Quote & Document;

@Schema()
export class Quote {
  @Prop({ required: true })
  name: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  dueAt: Date;

  @Prop({ required: true })
  status: string;

  @Prop()
  observations: string;

  @Prop({ required: true })
  customer: Customer;

  @Prop()
  deliveryType: string;

  @Prop()
  items?: QuoteItem[];

  @Prop()
  deliveryDetails?: DeliveryDetails;

  @Prop()
  totalValue?: number;

  @Prop()
  itemsValue?: number;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
