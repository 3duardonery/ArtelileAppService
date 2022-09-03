import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order-schema';
import { Quote, QuoteSchema } from '../quotes/schemas/quote-schema';
import { Payment, PaymentSchema } from './schemas/payment-schema';

@Module({
  controllers: [OrdersController],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  providers: [OrdersService],
})
export class OrdersModule {}
