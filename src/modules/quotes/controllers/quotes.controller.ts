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
    console.log(response);

    if (response) {
      res.status(HttpStatus.ACCEPTED).json(response).send();
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

    if (response) {
      res.status(HttpStatus.OK).json(response).send();
    }
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
