export interface BasicPaymentData {
  totalAmount: string;
  shippingAmount: string;
  currency: string;
  items: Item[];
  userInfo: UserInfo;
  metodo_envio: number;
  informacion_facturacion: InformacionFacturacion;
}
export interface InformacionFacturacion {
  type: string;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  email: string;
  telefono: string;
  razon_social?: string;
  nit?: string;
  representante_legal?: string;
  direccion_id: string | null; // nullable por si no siempre se envía
}

export type AddiPaymentData = BasicPaymentData;
export interface Item {
  sku: string;
  name: string;
  quantity: string;
  unitPrice: string;
  skupostback: string;
  desDetallada: string;
  ean: string;
}

export interface UserInfo {
  userId: string;
  direccionId: string;
}
export interface CardPaymentData extends BasicPaymentData {
  cardExpYear?: string;
  cardExpMonth?: string;
  cardNumber?: string;
  cardCvc?: string;
  cardTokenId?: string;
  dues: string;
}

export interface PsePaymentData extends BasicPaymentData {
  bank: string;
  description: string;
}
export type PaymentMethod = "addi" | "tarjeta" | "pse";
