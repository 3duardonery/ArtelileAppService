import { Quote } from '../../quotes/schemas/quote-schema';

export class OrderRequest {
  constructor(quoteId: string, quote: Quote) {
    this.quoteId = quoteId;
    this.quote = quote;
  }
  quoteId: string;
  quote: Quote;
  paymentWay: PaymentWay;
}

export class PaymentWay {
  total: string;
  payment: Payment[];
  isFullValue: boolean;
}

export class Payment {
  value: number;
  paidAt: Date = new Date();
  provider: string;
}
