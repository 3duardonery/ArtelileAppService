import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from './modules/reports/reports.module';
import { SurveyModule } from './modules/survey/survey.module';
import { PurchasesController } from './modules/purchases/controllers/purchases.controller';
import { PurchasesModule } from './modules/purchases/purchases.module';

@Module({
  imports: [
    AuthModule,
    QuotesModule,
    OrdersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.CONNECTION}/${process.env.DATABASE}`),
    ReportsModule,
    SurveyModule,
    PurchasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
