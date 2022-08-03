import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    QuotesModule,
    OrdersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.CONNECTION}/${process.env.DATABASE}`),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
