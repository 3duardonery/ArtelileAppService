import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchasesController } from './controllers/purchases.controller';
import { Purchase, PurchaseSchema } from './schemas/purchase';
import { PurchasesService } from './services/purchases.service';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService],
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
    ]),
  ],
})
export class PurchasesModule {}
