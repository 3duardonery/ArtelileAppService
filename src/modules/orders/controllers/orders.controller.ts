import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { QuotesService } from '../../quotes/services/quotes.service';
import { OrderRequest } from '../models/order-request';
import { OrdersService } from '../services/orders.service';

@Controller('api/orders')
export class OrdersController {
  status: any[] = [
    {
      index: 0,
      status: 'Pedido Aprovado',
    },
    {
      index: 1,
      status: 'Em Execução',
    },
    {
      index: 2,
      status: 'Produção Finalizada',
    },
    {
      index: 3,
      status: 'Entregue',
    },
    {
      index: -1,
      status: 'Cancelada',
    },
  ];
  constructor(private orderService: OrdersService) {}

  @Post()
  async startNewOrder(
    @Body() orderRequest: OrderRequest,
    @Res() response: Response,
  ) {
    const result = await this.orderService.createOrder(orderRequest);

    return response.status(HttpStatus.CREATED).json(result).send();
  }

  @Patch('status')
  async updateOrderStatusForNextStep(
    @Query('orderId') orderId: string,
    @Res() response: Response,
  ) {
    const order = await this.orderService.findOrderById(orderId);

    if (!order) {
      response.status(HttpStatus.NOT_FOUND).json().send();
      return;
    }

    const nextStepIndex = this.status.find(
      (x) => x.status == order.status,
    )?.index;
    const nextStepValue = this.status.find(
      (x) => x.index == nextStepIndex + 1,
    ).status;

    const result = await this.orderService.updateStatus(
      order.id,
      nextStepValue,
    );

    if (!result) {
      response.status(HttpStatus.BAD_REQUEST).json().send();
      return;
    }

    response.status(HttpStatus.OK).json().send();
  }
}
