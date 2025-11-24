"use client";

/**
 * Context del Carrito de Compras
 * Ahora usa el hook centralizado useCart para toda la lógica
 * - Estado global del carrito
 * - Provider para toda la aplicación
 * - Sincronización entre tabs del navegador
 * - Integración con microservicio de carrito
 * - Tracking de abandono de carrito
 */

import { useAuthContext } from "@/features/auth/context";
import { CartProduct, BundleInfo, useCart } from "@/hooks/useCart";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { apiClient } from "@/lib/api";
import { apiPost } from "@/lib/api-client";
import React, { createContext, useCallback, useContext } from "react";

/**
 * CartContextType
 * Define la interfaz del contexto global del carrito.
 */
type CartContextType = {
  /** Array de productos en el carrito */
  cart: CartProduct[];
  /** Añade un producto al carrito (o suma cantidad si ya existe) */
  addProduct: (product: CartProduct) => Promise<void>;
  /** Elimina un producto por id */
  removeProduct: (id: string) => void;
  /** Actualiza la cantidad de un producto */
  updateQuantity: (id: string, cantidad: number) => void;
  /** Vacía el carrito */
  clearCart: () => void;
  /** Devuelve todos los productos */
  getProducts: () => CartProduct[];
  /** Obtiene la cantidad en carrito de un SKU específico */
  getQuantityBySku: (sku: string) => number;
  /** Cantidad total de productos (para el badge del navbar) */
  itemCount: number;
  /** Si el carrito está vacío */
  isEmpty: boolean;
  /** Formatear precios */
  formatPrice: (price: number) => string;
  /** Puntos Q acumulados en el carrito (valor global reactivo) */
  pointsQ: number;

  // Métodos de Bundle
  /** Añade todos los productos de un bundle al carrito */
  addBundleToCart: (
    items: Omit<CartProduct, "quantity">[],
    bundleInfo: BundleInfo
  ) => Promise<void>;
  /** Actualiza la cantidad de todos los productos de un bundle */
  updateBundleQuantity: (
    codCampana: string,
    productSku: string,
    quantity: number
  ) => Promise<void>;
  /** Elimina un producto de un bundle */
  removeBundleProduct: (sku: string, keepOtherProducts: boolean) => Promise<void>;
};

/**
 * CartContext
 * Contexto global para el carrito de compras.
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * useCartContext
 * Hook para acceder al contexto del carrito.
 * @throws Error si se usa fuera del CartProvider
 */
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
};

/**
 * CartProvider
 * Proveedor global del carrito. Ahora usa el hook centralizado useCart.
 */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Obtener el usuario autenticado
  const { user } = useAuthContext();

  // Hook de analytics para tracking con datos de usuario
  const { trackAddToCart } = useAnalyticsWithUser();

  // Usar el hook centralizado useCart
  const {
    products,
    calculations,
    addProduct: addToCart,
    removeProduct,
    updateQuantity: updateQty,
    clearCart,
    isEmpty,
    formatPrice,
    // Métodos de Bundle
    addBundleToCart: addBundleToCartHook,
    updateBundleQuantity: updateBundleQuantityHook,
    removeBundleProduct: removeBundleProductHook,
  } = useCart();

  // Calcular puntos Q globales (reactivo)
  const pointsQ = products.reduce(
    (acc, p) => acc + Number(p.puntos_q || 0) * Number(p.quantity || 1),
    0
  );

  // Memoizar funciones para evitar que cambien en cada render
  const addProduct = useCallback(
    async (product: CartProduct) => {
      // Extraer quantity del producto y pasarlo por separado para evitar problemas de tipo
      const { quantity, ...productWithoutQuantity } = product;
      await addToCart(productWithoutQuantity, quantity || 1, user?.id);

      apiPost("/api/cart/add", {
        item: product,
      });

      // Track del evento add_to_cart para analytics
      trackAddToCart({
        item_id: product.sku || product.id,
        item_name: product.name,
        item_brand: "Samsung",
        price: Number(product.price),
        quantity: quantity || 1,
        currency: "COP",
      });
    },
    [addToCart, user?.id, trackAddToCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      apiClient.put(
        `/api/cart/items/${productId}`,
        {
          quantity,
        }
      );
      updateQty(productId, quantity);
    },
    [updateQty, user?.id]
  );

  const getProducts = useCallback(() => products, [products]);

  // ==================== MÉTODOS DE BUNDLE ====================

  const addBundleToCart = useCallback(
    async (items: Omit<CartProduct, "quantity">[], bundleInfo: BundleInfo) => {
      await addBundleToCartHook(items, bundleInfo, user?.id);

      // Track del evento para analytics (bundle completo)
      for (const item of items) {
        trackAddToCart({
          item_id: item.sku || item.id,
          item_name: item.name,
          item_brand: "Samsung",
          price: Number(item.price),
          quantity: 1,
          currency: "COP",
        });
      }
    },
    [addBundleToCartHook, user?.id, trackAddToCart]
  );

  const updateBundleQuantity = useCallback(
    async (codCampana: string, productSku: string, quantity: number) => {
      await updateBundleQuantityHook(codCampana, productSku, quantity);
    },
    [updateBundleQuantityHook]
  );

  const removeBundleProduct = useCallback(
    async (sku: string, keepOtherProducts: boolean) => {
      await removeBundleProductHook(sku, keepOtherProducts);
    },
    [removeBundleProductHook]
  );

  const getQuantityBySku = useCallback(
    (sku: string): number => {
      const product = products.find((p) => p.sku === sku);
      return product ? product.quantity : 0;
    },
    [products]
  );

  // Memoizar el value para evitar renders innecesarios y cumplir con las reglas de React Context
  const value = React.useMemo(
    () => ({
      cart: products,
      addProduct,
      removeProduct,
      updateQuantity,
      clearCart,
      getProducts,
      getQuantityBySku,
      itemCount: calculations.productCount,
      isEmpty,
      formatPrice,
      pointsQ,
      // Métodos de Bundle
      addBundleToCart,
      updateBundleQuantity,
      removeBundleProduct,
    }),
    [
      products,
      addProduct,
      removeProduct,
      updateQuantity,
      clearCart,
      getProducts,
      getQuantityBySku,
      calculations.productCount,
      isEmpty,
      formatPrice,
      pointsQ,
      addBundleToCart,
      updateBundleQuantity,
      removeBundleProduct,
    ]
  );

  /**
   * Renderiza el proveedor global del carrito.
   */
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
