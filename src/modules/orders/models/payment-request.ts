/* eslint-disable prettier/prettier */
export class PaymentRequest {
  orderId: string;
  isPaymentFinished: boolean;
  isFullValue: boolean;
  value: number;
  provider: string;
}
