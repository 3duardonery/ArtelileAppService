import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotesController } from './controllers/quotes.controller';
import { Quote, QuoteSchema } from './schemas/quote-schema';

import { QuotesService } from './services/quotes.service';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService],
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
  ],
})
export class QuotesModule {}
