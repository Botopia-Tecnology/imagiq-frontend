/**
 * Tipos de eventos del DataLayer para tracking de e-commerce
 * Cumple con estándares de GA4 Enhanced Ecommerce
 */

/** Evento base con timestamp */
export interface DlEventBase {
  event: string;
  ts: number; // epoch ms
}

/** Item de e-commerce (producto) */
export interface DlItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  currency?: string;
}

/** Evento: Ver producto (PDP) */
export interface DlViewItem extends DlEventBase {
  event: 'view_item';
  ecommerce: {
    items: DlItem[];
  };
}

/** Evento: Añadir al carrito */
export interface DlAddToCart extends DlEventBase {
  event: 'add_to_cart';
  ecommerce: {
    items: DlItem[];
    value?: number;
    currency?: string;
  };
}

/** Evento: Compra completada */
export interface DlPurchase extends DlEventBase {
  event: 'purchase';
  ecommerce: {
    transaction_id: string;
    value: number;
    currency: string;
    coupon?: string;
    items: DlItem[];
  };
}

/** Evento: Búsqueda interna */
export interface DlSearch extends DlEventBase {
  event: 'search';
  search_term: string;
  results?: number;
}

/** Evento: Progreso en checkout */
export interface DlCheckoutProgress extends DlEventBase {
  event: 'begin_checkout' | 'add_payment_info';
  step: number;
  ecommerce: {
    value?: number;
    currency?: string;
    items: DlItem[];
  };
}

/** Evento: Clic en categoría desde topbar */
export interface DlCategoryClick extends DlEventBase {
  event: 'category_click';
  nav: {
    category_id: string;
    category_name: string;
    position?: number;
  };
}

/** Tipo discriminado con todos los eventos posibles */
export type DlAny =
  | DlViewItem
  | DlAddToCart
  | DlPurchase
  | DlSearch
  | DlCheckoutProgress
  | DlCategoryClick;
