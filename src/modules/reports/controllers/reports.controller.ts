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
import * as Sentry from '@sentry/node';

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
    const result = await this.reportService.getOrderReport(
      startDate,
      endDate,
      status,
    );

    response.status(HttpStatus.OK).json(result).json();
  }

  @Get('quotes')
  async getQuoteReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('status') status: string,
    @Res() response: Response,
  ) {
    const result = await this.reportService.getQuoteReport(
      startDate,
      endDate,
      status,
    );

    response.status(HttpStatus.OK).json(result).json();
  }
}
