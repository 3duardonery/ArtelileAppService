/* eslint-disable prettier/prettier */
import { OrderDocument } from '../schemas/order-schema';

export class OrderResponse {
  length: number;
  pages: number;
  data: OrderDocument[];
}
