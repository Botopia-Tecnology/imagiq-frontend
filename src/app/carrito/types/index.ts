export interface AddiPaymentData {
  totalAmount: string;
  shippingAmount: string;
  currency: string;
  items: Item[];
  userInfo: UserInfo;
  metodo_envio: number;
}

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

export type PaymentMethod = "addi" | "tarjeta" | "pse";
