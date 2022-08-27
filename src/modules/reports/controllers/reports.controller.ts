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
      createdAt: {
        $gte: new Date(timeLimits.firstDay),
        $lte: new Date(timeLimits.lastDay),
      },
    };

    const orderFilter: FilterQuery<OrderDocument> = {
      createdAt: { $gte: timeLimits.firstDay, $lte: timeLimits.lastDay },
    };

    const quotes = await this.reportService.getQuoteReport(quoteFilter);
    const orders = await this.reportService.getOrderReport(orderFilter);

    const money = this.getMoney(orders.data);

    response.status(HttpStatus.OK).json({
      money: {
        received: money,
        spend: 0,
      },
      quotes: {
        openedQuotes: {
          length: quotes.data.filter((x) => x.status == 'Aberto').length || 0,
          data: quotes.data.filter((x) => x.status == 'Aberto'),
        },
        closedQuotes: {
          length:
            quotes.data.filter((x) => x.status == 'Pedido Realizado').length ||
            0,
          data: quotes.data.filter((x) => x.status == 'Pedido Realizado'),
        },
        cancelledQuotes: {
          length:
            quotes.data.filter((x) => x.status == 'Cancelado').length || 0,
          data: quotes.data.filter((x) => x.status == 'Cancelado'),
        },
      },
      orders: {
        openedOrders: {
          length:
            orders.data.filter((x) => x.status == 'Pedido Aprovado').length ||
            0,
          data: orders.data.find((x) => x.status == 'Pedido Aprovado'),
        },
        inExecution: {
          length:
            orders.data.filter((x) => x.status == 'Em Execução').length || 0,
          data: orders.data.find((x) => x.status == 'em Execução'),
        },
        toDelivery: {
          length: orders.data.filter((x) => x.status == 'Produção Finalizada')
            ?.length,
          data: orders.data.filter((x) => x.status == 'Produção Finalizada'),
        },
        finished: {
          length: orders.data.filter((x) => x.status == 'Entregue')?.length,
          data: orders.data.filter((x) => x.status == 'Entregue'),
        },
      },
    });
  }

  getCurrentMonthLimits(): any {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 23, 59, 59);
    return { firstDay: firstDay, lastDay: lastDay };
  }

  getMoney(orders: OrderDocument[]): number {
    let result = 0;
    orders?.forEach((x) => {
      result +=
        x.paymentWay?.payment?.reduce((total, a) => total + a?.value, 0) || 0;
    });
    return result;
  }
}
