/**
 * Sistema de Analytics para Samsung Colombia E-commerce
 *
 * @module analytics
 *
 * **Características**:
 * - Tracking de eventos de e-commerce (GA4, Meta Pixel, TikTok Pixel)
 * - Deduplicación de eventos client/server con event_id
 * - Hashing de PII (SHA-256) para cumplimiento GDPR
 * - Verificación de consentimiento antes de enviar
 * - Lógica de abandono de carrito y checkout
 *
 * **Uso básico**:
 * ```typescript
 * import { processAnalyticsEvent, initAnalytics } from '@/lib/analytics';
 *
 * // Inicializar al cargar la app
 * initAnalytics();
 *
 * // Enviar evento
 * const event: DlViewItem = {
 *   event: 'view_item',
 *   ts: Date.now(),
 *   ecommerce: { items: [{ item_id: 'SKU123', item_name: 'Product', price: 100 }] }
 * };
 *
 * await processAnalyticsEvent(event);
 * ```
 */

// Controlador principal
export {
  processAnalyticsEvent,
  initAnalytics,
  pushToDataLayer,
} from "./controller";
export type { AnalyticsUserData } from "./controller";

// Lógica de abandono (exponer para uso avanzado)
export {
  markCartIntent,
  markCheckoutIntent,
  clearAbandonIntents,
  resolveCartAbandon,
  resolveCheckoutAbandon,
} from "./abandon";

// Tipos (para TypeScript)
export type {
  DlAny,
  DlEventBase,
  DlItem,
  DlViewItem,
  DlAddToCart,
  DlPurchase,
  DlSearch,
  DlCheckoutProgress,
  DlCategoryClick,
} from "./types";

// Utilidades (para uso avanzado)
export { generateEventId, hashEmail, hashPhone, hashUserData } from "./utils";

// Mapeadores (para uso avanzado o testing)
export { toGa4Event, toMetaEvent, toTiktokEvent } from "./mappers";
export type { GA4Event, MetaEvent, TikTokEvent } from "./mappers";

// Emisores (para uso avanzado)
export { sendGa4, sendMeta, sendTiktok } from "./emitters";
export { identifyTiktokUser } from "./emitters/emit.tiktok";
export type { TikTokUserData } from "./emitters/emit.tiktok";
export type { GA4UserData } from "./emitters/emit.ga4";

// Hooks de React para uso en componentes
export { useAnalytics } from "./hooks/useAnalytics";
export { useAnalyticsWithUser } from "./hooks/useAnalyticsWithUser";

// Clarity - Identificación de usuarios
export {
  identifyUserInClarity,
  reidentifyUserOnNavigation,
  identifyUserWithPageId,
} from "./clarity-identify";

// Clarity - Debug utilities (solo para desarrollo)
export {
  getClarityDebugInfo,
  logClarityStatus,
  isClarityReady,
  waitForClarity,
  enableDebugMode,
} from "./clarity-debug";
