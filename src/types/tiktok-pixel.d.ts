/**
 * TypeScript definitions for TikTok Pixel
 * @see https://ads.tiktok.com/marketing_api/docs?id=1739585700402178
 */

declare global {
  interface Window {
    /**
     * TikTok Pixel global object
     */
    ttq?: {
      /**
       * Track an event to TikTok Pixel
       * @param eventName - Name of the event (e.g., 'ViewContent', 'AddToCart', 'CompletePayment')
       * @param data - Event data containing contents, value, currency, etc.
       * @param options - Additional options including event_id for deduplication and user data for Advanced Matching
       */
      track: (
        eventName: string,
        data?: Record<string, unknown>,
        options?: Record<string, unknown>
      ) => void;

      /**
       * Identify a user with Advanced Matching data
       * @param userData - User data including hashed email, phone, etc.
       */
      identify: (userData: Record<string, string>) => void;

      /**
       * Page view tracking
       */
      page: () => void;

      /**
       * Internal queue for events
       */
      queue?: unknown[];

      /**
       * Indicates if the pixel has loaded
       */
      loaded?: boolean;

      /**
       * TikTok Pixel version
       */
      version?: string;
    };
  }
}

/**
 * TikTok Pixel Standard Events
 * @see https://ads.tiktok.com/marketing_api/docs?id=1741601162187777
 */
export type TikTokPixelStandardEvent =
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'CompletePayment'
  | 'PlaceAnOrder'
  | 'Search'
  | 'ClickButton'
  | 'AddToWishlist'
  | 'CompleteRegistration'
  | 'Subscribe'
  | 'SubmitForm'
  | 'Contact'
  | 'Download';

/**
 * TikTok Pixel Event Data
 */
export interface TikTokPixelEventData {
  contents?: Array<{
    content_id: string;
    quantity: number;
    price?: number;
  }>;
  content_type?: 'product' | 'product_group';
  value?: number;
  currency?: string;
  description?: string;
  query?: string;
  [key: string]: unknown;
}

/**
 * TikTok Pixel Advanced Matching User Data
 */
export interface TikTokPixelUserData {
  /** SHA-256 hashed email */
  email?: string;
  /** SHA-256 hashed phone number (with country code) */
  phone_number?: string;
  /** External user ID */
  external_id?: string;
}

export {};
