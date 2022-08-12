import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { SurveyService } from '../services/survey.service';

@Controller('survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async createQuote(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ) {
    const response = await this.surveyService.getAllSurveys(limit, page);

    res.status(HttpStatus.OK).json(response).send();
  }
}
