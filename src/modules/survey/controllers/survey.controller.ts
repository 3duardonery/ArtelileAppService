/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt.guard';
import { QuestionRequest } from '../models/question-create-request';
import { SurveyFinishRequest } from '../models/survey-finish-request';
import { SurveyService } from '../services/survey.service';

@Controller('api/surveys')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('start')
  async startSurveyByOrderId(
    @Query('orderId') orderId: string,
    @Res() res: Response,
  ) {
    const response = await this.surveyService.startSurvey(orderId);

    if (response == null) {
      res.status(HttpStatus.BAD_REQUEST).json();
      return;
    }

    res.status(HttpStatus.OK).json(response).send();
  }

  @Get('validate')
  async validateOrder(@Query('orderId') orderId: string, @Res() res: Response) {
    const response = await this.surveyService.validateOrder(orderId);

    return res.status(HttpStatus.OK).json(response).send();
  }

  @UseGuards(JwtAuthGuard)
  @Post('finish')
  async finishSurveyByOrderId(
    @Body() surveyFinishRequest: SurveyFinishRequest,
    @Res() res: Response,
  ) {
    const response = await this.surveyService.finishSurvey(surveyFinishRequest);

    if (response == null) {
      res.status(HttpStatus.BAD_REQUEST).json();
      return;
    }

    res.status(HttpStatus.OK).json(response).send();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuestion(@Body() request: QuestionRequest, @Res() res: Response) {
    const response = await this.surveyService.createQuestion(request);

    res.status(HttpStatus.OK).json(response).send();
  }

  @UseGuards(JwtAuthGuard)
  @Get('questions')
  async getQuestions(@Res() res: Response) {
    const response = await this.surveyService.getQuestions();

    res.status(HttpStatus.OK).json(response).send();
  }
}
