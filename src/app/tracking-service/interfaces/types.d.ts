export interface EnvioEvento {
  evento: string;
  time_stamp: string; // o Date, según cómo lo conviertas en tu backend
}

export interface ProductoDetalle {
  id: string;
  nombre: string;
  imagen?: string;
  cantidad: number;
  precio?: number;
}

export interface TiendaInfo {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  horario: string;
}

export interface DetalleEnvio {
  orden_id: string;
  numero_guia: string;
  fecha_creacion: string; // o Date si lo manejas como objeto Date
  tiempo_entrega_estimado: string;
  costo_envio_base: number;
  url_seguimiento: string;
  pdf_base64: string;
  eventos: EnvioEvento[];
  metodo_envio?: string;
  hora_recogida_autorizada?: string | null;
  token?: string;
}

export interface DetalleRecogida {
  orden_id: string;
  usuario_id: string;
  total_amount: number;
  fecha_creacion: string; // o Date si lo manejas como objeto Date
  currency: string;
  shipping_amount: number;
  codbodega: string | null;
  validado: boolean;
  entregado: boolean;
  hora_recogida_autorizada: string | null; // "HH:mm:ss" o 'Pendiente por asignar'
  metodo_envio: string;
}

// Interfaz unificada para el componente de tracking
export interface OrderDetails
  extends Partial<DetalleEnvio>,
    Partial<DetalleRecogida> {
  // Propiedades comunes
  orden_id: string;
  fecha_creacion: string;

  // Array de envíos (la respuesta del backend puede tener múltiples envíos)
  envios?: DetalleEnvio[];

  // Propiedades específicas que pueden existir en ambos tipos
  metodo_envio?: string;
  medio_pago?: number; // ID del método de envío: 1=Coordinadora, 2=Pickup, 3=Imagiq
  hora_recogida_autorizada?: string | null;
  token?: string;
  numero_guia?: string;
  eventos?: EnvioEvento[];
  pdf_base64?: string;
  tiempo_entrega_estimado?: string;
  total_amount?: number;
  validado?: boolean;
  entregado?: boolean;

  // Nuevas propiedades para vista mejorada
  productos?: ProductoDetalle[];
  tienda?: TiendaInfo;
  direccion_entrega?: string;
  ciudad_entrega?: string;
  nombre_destinatario?: string;
  telefono_destinatario?: string;
}
