import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from '../services/quotes.service';
import { Response } from 'express';
import { QuoteRequest } from '../models/quote';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Post()
  async createQuote(@Body() quote: QuoteRequest, @Res() res: Response) {
    const response = await this.quotesService.createQuote(quote);

    if (response) {
      res.status(HttpStatus.CREATED).json(response).send();
    } else {
      res.status(HttpStatus.NOT_ACCEPTABLE).json().send();
    }
  }

  @Get()
  async getQuotes(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ) {
    const response = await this.quotesService.getQuotes(limit, page);

    return res.status(HttpStatus.OK).json(response);
  }

  @Get('id')
  async getQuotesById(@Query('quoteId') quoteId: string, @Res() res: Response) {
    const response = await this.quotesService.getQuoteById(quoteId);

    return res.status(HttpStatus.OK).json(response);
  }

  @Put()
  async updateQuote(@Body() quote: QuoteRequest, @Res() res: Response) {
    const response = await this.quotesService.updateQuote(quote);

    return res.status(HttpStatus.OK).json(response);
  }

  @Delete()
  async cancelQuote(@Query('quoteId') quoteId: string, @Res() res: Response) {
    const response = await this.quotesService.cancelQuote(quoteId);

    if (response) {
      res.status(HttpStatus.NO_CONTENT).json();
    }
  }
}
