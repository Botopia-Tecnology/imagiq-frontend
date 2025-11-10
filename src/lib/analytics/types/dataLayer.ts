/**
 * Tipos para window.dataLayer (GTM)
 */

import type { DlAny } from './events';

// Tipo unificado para dataLayer que acepta tanto DlAny como Record genérico
export type DataLayerObject = Record<string, unknown> | DlAny;

declare global {
  interface Window {
    dataLayer?: DataLayerObject[];
    gtag?: (...args: unknown[]) => void;
    fbq?: {
      (command: 'track', eventName: string, parameters?: Record<string, unknown>, options?: Record<string, unknown>): void;
      (command: 'trackCustom', eventName: string, parameters?: Record<string, unknown>, options?: Record<string, unknown>): void;
      (command: 'init', pixelId: string, options?: Record<string, unknown>): void;
      (command: 'consent', action: 'grant' | 'revoke'): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window['fbq'];
    ttq?: {
      track: (eventName: string, data?: Record<string, unknown>, options?: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}
