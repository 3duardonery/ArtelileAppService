import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Quote, QuoteSchema } from '../quotes/schemas/quote-schema';
import { Order, OrderSchema } from '../orders/schemas/order-schema';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
})
export class ReportsModule {}
