import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { OrderRequest, PaymentWay } from '../models/order-request';
import { OrdersService } from '../services/orders.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
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

  @Post('status/:orderId')
  async updateOrderStatusForNextStep(
    @Param('orderId') orderId: string,
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

    if (nextStepIndex == 3) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Order is already delivered' })
        .send();
      return;
    }

    const nextStepValue =
      this.status.find((x) => x.index == nextStepIndex + 1).status || '';

    const result = await this.orderService.updateStatus(
      order.id,
      nextStepValue,
    );

    if (!result) {
      response.status(HttpStatus.BAD_REQUEST).json().send();
      return;
    }

    response.status(HttpStatus.OK).json(result);
  }

  @Post('finish/:orderId')
  async finishOrder(
    @Body() paymentWay: PaymentWay,
    @Param('orderId') orderId: string,
    @Res() response: Response,
  ) {
    const order = await this.orderService.finishOrder(orderId, paymentWay);

    response.status(HttpStatus.OK).json(order);
  }

  @Get()
  async getPaginatedOrders(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() response: Response,
  ) {
    const orders = await this.orderService.getOrders(limit, page);

    response.status(HttpStatus.OK).json(orders);
  }

  @Get(':orderId')
  async getOrderById(
    @Param('orderId') orderId: string,
    @Res() response: Response,
  ) {
    const orders = await this.orderService.getOrderById(orderId);

    response.status(HttpStatus.OK).json(orders);
  }
}
