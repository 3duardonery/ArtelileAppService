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
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { PurchaseRequest } from '../models/purchase-request';
import { PurchasesService } from '../services/purchases.service';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('api/purchases')
export class PurchasesController {
  constructor(private purchaseService: PurchasesService) {}

  @Post()
  async createNewPurchase(
    @Body() purchaseRequest: PurchaseRequest,
    @Res() response: Response,
  ) {
    const purchaseResponse = await this.purchaseService.create(purchaseRequest);
    return response.status(HttpStatus.CREATED).json(purchaseResponse).send();
  }

  @Get()
  async getPurchases(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() response: Response,
  ) {
    const purchases = await this.purchaseService.getPurchases(limit, page);

    response.status(HttpStatus.OK).json(purchases);
  }
}
