/* eslint-disable prettier/prettier */
export class QuoteRequest {
  name?: string;
  createdAt?: Date;
  dueAt?: Date;
  status?: string;
  observations?: string;
  customer?: Customer;
  deliveryType?: string;
  items?: QuoteItem[];
  deliveryDetails?: DeliveryDetails;
  totalValue?: number;
  itemsValue?: number;
}

export class Customer {
  name: string;
  phone: string;
}

export class QuoteItem {
  id: string;
  description: string;
  quantityOfItems: number;
  unitValue: number;
  totalValue: number;
}

export class DeliveryDetails {
  streetName: string;
  complement: string;
  number: string;
  district: string;
  city: string;
  state: string;
  deliveryTaxDetails: Tax;
}

export class Tax {
  provider: string;
  price: number;
}
