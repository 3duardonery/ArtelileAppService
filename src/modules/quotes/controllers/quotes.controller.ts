import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { QuotesService } from '../services/quotes.service';
import { Response } from 'express';
import { QuoteRequest } from '../models/quote';

@Controller('api/quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuote(@Body() quote: QuoteRequest, @Res() res: Response) {
    const response = await this.quotesService.createQuote(quote);

    if (response) {
      res.status(HttpStatus.CREATED).json(response).send();
    } else {
      res.status(HttpStatus.NOT_ACCEPTABLE).json().send();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getQuotes(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ) {
    const response = await this.quotesService.getQuotes(limit, page);

    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('id')
  async getQuotesById(@Query('quoteId') quoteId: string, @Res() res: Response) {
    const response = await this.quotesService.getQuoteById(quoteId);

    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async cancelQuote(@Query('quoteId') quoteId: string, @Res() res: Response) {
    const response = await this.quotesService.cancelQuote(quoteId);

    if (response) {
      res.status(HttpStatus.NO_CONTENT).json().send();
    }
  }
}
