'use client';

import { useCallback } from 'react';
import { processAnalyticsEvent } from '../controller';
import type {
  DlViewItem,
  DlAddToCart,
  DlPurchase,
  DlSearch,
  DlCheckoutProgress,
  DlCategoryClick,
} from '../types';

/**
 * Hook personalizado para enviar eventos de analytics
 *
 * Provee métodos tipados para cada tipo de evento
 *
 * @example
 * ```typescript
 * const { trackViewItem, trackAddToCart } = useAnalytics();
 *
 * // En tu componente de producto
 * useEffect(() => {
 *   trackViewItem({
 *     item_id: product.sku,
 *     item_name: product.name,
 *     price: product.price,
 *   });
 * }, [product.sku]);
 * ```
 */
export function useAnalytics() {
  /**
   * Track cuando un usuario ve un producto
   */
  const trackViewItem = useCallback(
    async (item: {
      item_id: string;
      item_name: string;
      item_brand?: string;
      item_category?: string;
      price: number;
      currency?: string;
    }) => {
      const event: DlViewItem = {
        event: 'view_item',
        ts: Date.now(),
        ecommerce: {
          items: [
            {
              ...item,
              item_brand: item.item_brand || 'Samsung',
              currency: item.currency || 'COP',
            },
          ],
        },
      };

      await processAnalyticsEvent(event);
    },
    []
  );

  /**
   * Track cuando un usuario añade un producto al carrito
   */
  const trackAddToCart = useCallback(
    async (item: {
      item_id: string;
      item_name: string;
      item_brand?: string;
      price: number;
      quantity: number;
      currency?: string;
    }) => {
      const totalValue = item.price * item.quantity;
      const event: DlAddToCart = {
        event: 'add_to_cart',
        ts: Date.now(),
        ecommerce: {
          items: [
            {
              ...item,
              item_brand: item.item_brand || 'Samsung',
              currency: item.currency || 'COP',
            },
          ],
          value: totalValue,
          currency: item.currency || 'COP',
        },
      };

      await processAnalyticsEvent(event);
    },
    []
  );

  /**
   * Track cuando un usuario hace una búsqueda
   */
  const trackSearch = useCallback(async (searchTerm: string, resultsCount?: number) => {
    const event: DlSearch = {
      event: 'search',
      ts: Date.now(),
      search_term: searchTerm,
      results: resultsCount,
    };

    await processAnalyticsEvent(event);
  }, []);

  /**
   * Track cuando un usuario inicia el checkout
   */
  const trackBeginCheckout = useCallback(
    async (items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }>, totalValue: number) => {
      const event: DlCheckoutProgress = {
        event: 'begin_checkout',
        ts: Date.now(),
        step: 1,
        ecommerce: {
          items: items.map((item) => ({
            ...item,
            currency: 'COP',
          })),
          value: totalValue,
          currency: 'COP',
        },
      };

      await processAnalyticsEvent(event);
    },
    []
  );

  /**
   * Track cuando un usuario añade información de pago
   */
  const trackAddPaymentInfo = useCallback(
    async (items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }>, totalValue: number) => {
      const event: DlCheckoutProgress = {
        event: 'add_payment_info',
        ts: Date.now(),
        step: 2,
        ecommerce: {
          items: items.map((item) => ({
            ...item,
            currency: 'COP',
          })),
          value: totalValue,
          currency: 'COP',
        },
      };

      await processAnalyticsEvent(event);
    },
    []
  );

  /**
   * Track cuando un usuario completa una compra
   */
  const trackPurchase = useCallback(
    async (
      transactionId: string,
      items: Array<{
        item_id: string;
        item_name: string;
        item_brand?: string;
        price: number;
        quantity: number;
      }>,
      totalValue: number,
      couponCode?: string
    ) => {
      const event: DlPurchase = {
        event: 'purchase',
        ts: Date.now(),
        ecommerce: {
          transaction_id: transactionId,
          value: totalValue,
          currency: 'COP',
          coupon: couponCode,
          items: items.map((item) => ({
            ...item,
            item_brand: item.item_brand || 'Samsung',
            currency: 'COP',
          })),
        },
      };

      await processAnalyticsEvent(event);
    },
    []
  );

  /**
   * Track cuando un usuario hace clic en una categoría
   */
  const trackCategoryClick = useCallback(
    async (categoryId: string, categoryName: string, position?: number) => {
      const event: DlCategoryClick = {
        event: 'category_click',
        ts: Date.now(),
        nav: {
          category_id: categoryId,
          category_name: categoryName,
          position,
        },
      };

      await processAnalyticsEvent(event);
    },
    []
  );

  return {
    trackViewItem,
    trackAddToCart,
    trackSearch,
    trackBeginCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackCategoryClick,
  };
}
