import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { QuotesService } from '../services/quotes.service';
import { Response } from 'express';
import { QuoteRequest } from '../models/quote';
import { Filter } from '../models/filter';

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
}
