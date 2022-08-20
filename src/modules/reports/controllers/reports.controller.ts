import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Response } from 'express';
import { FilterQuery } from 'mongoose';
import { QuoteDocument } from 'src/modules/quotes/schemas/quote-schema';
import { OrderDocument } from 'src/modules/orders/schemas/order-schema';

@UseGuards(JwtAuthGuard)
@Controller('api/reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get('orders')
  async getMonthlyReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('status') status: string,
    @Res() response: Response,
  ) {
    const filter: FilterQuery<OrderDocument> = {
      orderedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: status,
    };

    const result = await this.reportService.getOrderReport(filter);

    response.status(HttpStatus.OK).json(result).json();
  }

  @Get('quotes')
  async getQuoteReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('status') status: string,
    @Res() response: Response,
  ) {
    const filter: FilterQuery<QuoteDocument> = {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: status,
    };
    const result = await this.reportService.getQuoteReport(filter);

    response.status(HttpStatus.OK).json(result).json();
  }

  @Get('dashboard')
  async getDashboardInfo(@Res() response) {
    const timeLimits = this.getCurrentMonthLimits();

    const quoteFilter: FilterQuery<QuoteDocument> = {
      status: 'Aberto',
      createdAt: {
        $gte: new Date(timeLimits.firstDay),
        $lte: new Date(timeLimits.lastDay),
      },
    };

    const orderFilter: FilterQuery<OrderDocument> = {
      $or: [{ status: 'Pedido Aprovado' }, { status: 'Em Execução' }],
      createdAt: { $gte: timeLimits.firstDay, $lte: timeLimits.lastDay },
    };

    const quotes = await this.reportService.getQuoteReport(quoteFilter);
    const orders = await this.reportService.getOrderReport(orderFilter);

    response.status(HttpStatus.OK).json({
      openQuotes: { length: quotes.data.length, data: quotes.data },
      openOrders: { length: orders.data.length, data: orders.data },
    });
  }

  getCurrentMonthLimits(): any {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 23, 59, 59);
    return { firstDay: firstDay, lastDay: lastDay };
  }
}
