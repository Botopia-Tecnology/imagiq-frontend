/**
 * Tipos TypeScript para Meta Conversions API (CAPI) y TikTok Events API
 *
 * Estos tipos definen la estructura de datos que se envía al backend
 * para tracking server-side.
 *
 * @module analytics/types/capi
 */

/**
 * Datos de usuario para Meta CAPI
 *
 * Todos los campos de PII deben estar hasheados con SHA-256
 * según especificación de Meta: https://developers.facebook.com/docs/marketing-api/conversions-api
 */
export interface MetaCapiUserData {
  /** Email hasheado SHA-256 */
  em?: string;
  /** Teléfono hasheado SHA-256 */
  ph?: string;
  /** Nombre hasheado SHA-256 */
  fn?: string;
  /** Apellido hasheado SHA-256 */
  ln?: string;
  /** Ciudad hasheada SHA-256 */
  ct?: string;
  /** Estado/Provincia hasheada SHA-256 */
  st?: string;
  /** Código postal hasheado SHA-256 */
  zp?: string;
  /** Código de país ISO 3166-1 alpha-2 (NO hasheado) */
  country?: string;
  /** Dirección IP del cliente */
  client_ip_address?: string;
  /** User-Agent del navegador */
  client_user_agent?: string;
  /** Facebook Browser ID (_fbp cookie) */
  fbp?: string;
  /** Facebook Click ID (_fbc cookie) */
  fbc?: string;
  /** ID externo del usuario en tu sistema */
  external_id?: string;
}

/**
 * Datos personalizados del evento para Meta CAPI
 */
export interface MetaCapiCustomData {
  /** Valor monetario del evento */
  value?: number;
  /** Código de moneda ISO 4217 */
  currency?: string;
  /** Tipo de contenido ('product' | 'product_group') */
  content_type?: string;
  /** IDs de contenido/productos */
  content_ids?: string[];
  /** Nombre del contenido */
  content_name?: string;
  /** Categoría del contenido */
  content_category?: string;
  /** Número de items */
  num_items?: number;
  /** Estado del pedido */
  status?: string;
  /** Término de búsqueda */
  search_string?: string;
  /** Detalles de contenidos */
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
}

/**
 * Evento completo para Meta CAPI
 */
export interface MetaCapiEvent {
  /** Nombre del evento estándar de Meta */
  event_name: string;
  /** ID único del evento para deduplicación */
  event_id: string;
  /** Timestamp Unix del evento */
  event_time: number;
  /** URL donde ocurrió el evento */
  event_source_url: string;
  /** Fuente del evento (siempre 'website' para web) */
  action_source: "website";
  /** Datos del usuario */
  user_data: MetaCapiUserData;
  /** Datos personalizados del evento */
  custom_data?: MetaCapiCustomData;
}

/**
 * Datos de usuario para TikTok Events API
 */
export interface TikTokEventsUserData {
  /** Email (NO hasheado, TikTok lo hashea server-side) */
  email?: string;
  /** Teléfono (NO hasheado, TikTok lo hashea server-side) */
  phone?: string;
}

/**
 * Propiedades del evento para TikTok Events API
 */
export interface TikTokEventsProperties {
  /** Valor monetario del evento */
  value?: number;
  /** Código de moneda ISO 4217 */
  currency?: string;
  /** IDs de contenido/productos */
  content_ids?: string[];
  /** Tipo de contenido */
  content_type?: string;
  /** Número de items */
  num_items?: number;
  /** Término de búsqueda */
  search_string?: string;
  /** Detalles de contenidos */
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
}

/**
 * Evento completo para TikTok Events API
 */
export interface TikTokEventsApiEvent {
  /** Nombre del evento */
  event: string;
  /** ID único del evento para deduplicación */
  event_id: string;
  /** Timestamp Unix del evento */
  timestamp: number;
  /** URL donde ocurrió el evento */
  event_source_url: string;
  /** Datos del usuario */
  user?: TikTokEventsUserData;
  /** Propiedades del evento */
  properties?: TikTokEventsProperties;
}

/**
 * Respuesta de TikTok Events API
 */
export interface TikTokApiResponse {
  code: number;
  message: string;
  request_id?: string;
  data?: Record<string, unknown>;
}

/**
 * Respuesta de Meta Conversions API
 */
export interface MetaApiResponse {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
}

/**
 * Respuesta del backend para envío de CAPI
 */
export interface CapiResponse {
  /** Indica si el envío fue exitoso */
  success: boolean;
  /** Mensaje de error si falló */
  error?: string;
  /** Respuesta de Meta/TikTok */
  platform_response?: TikTokApiResponse | MetaApiResponse;
}
