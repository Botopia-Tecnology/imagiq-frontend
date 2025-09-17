export interface BasicPaymentData {
  totalAmount: string;
  shippingAmount: string;
  currency: string;
  items: Item[];
  userInfo: UserInfo;
  metodo_envio: number;
}

export type AddiPaymentData = BasicPaymentData;
export interface Item {
  sku: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

export interface UserInfo {
  userId: string;
  direccionId: string;
}
export interface CardPaymentData extends BasicPaymentData {
  cardExpYear: string;
  cardExpMonth: string;
  cardNumber: string;
  cardCvc: string;
  dues: string;
}

export interface PsePaymentData extends BasicPaymentData {
  bank: string;
  description: string;
}
export type PaymentMethod = "addi" | "tarjeta" | "pse";
