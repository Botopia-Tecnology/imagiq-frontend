"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export interface CartProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
  ean: string;
  /**
   * Puntos Q acumulables por producto (valor fijo por ahora)
   * Si no se especifica, se asume 4 por defecto.
   */
  puntos_q?: number;
  /** Stock disponible del producto (desde backend) */
  stock?: number;
  /** Precio original sin descuento */
  originalPrice?: number;
  /** Ubicación de envío (ej: "Bogotá") */
  shippingFrom?: string;
}

interface CartCalculations {
  productCount: number;
  subtotal: number;
  shipping: number;
  taxes: number;
  discount: number;
  total: number;
}

interface UseCartReturn {
  // Estado
  products: CartProduct[];
  appliedDiscount: number;
  isLoading: boolean;

  // Cálculos
  calculations: CartCalculations;

  // Acciones
  addProduct: (
    product: Omit<CartProduct, "quantity">,
    quantity?: number
  ) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (discount: number) => void;

  // Utilidades
  isEmpty: boolean;
  formatPrice: (price: number) => string;
}

const STORAGE_KEYS = {
  CART_ITEMS: "cart-items",
  APPLIED_DISCOUNT: "applied-discount",
} as const;

// Real shipping used in calculations is 0 (envío gratuito). Keep original value for marketing display.
export const ORIGINAL_SHIPPING_COST = 20000;
const SHIPPING_COST = 0;
const TAX_RATE = 0.09;

// Función para normalizar productos del localStorage
function normalizeCartProducts(rawProducts: unknown[]): CartProduct[] {
  if (!Array.isArray(rawProducts)) return [];

  return rawProducts
    .filter(
      (p): p is Record<string, unknown> => typeof p === "object" && p !== null
    )
    .map((p) => {
      // id
      let id = "";
      if (typeof p.id === "string") id = p.id;
      else if (typeof p.id === "number") id = String(p.id);
      else if (p.id !== null && p.id !== undefined) {
        // Solo convertir si es primitivo, evitar objetos
        const idValue = p.id;
        if (typeof idValue === "boolean" || typeof idValue === "bigint") {
          id = String(idValue);
        }
      }
      // name
      let name = "Producto";
      if (typeof p.nombre === "string") name = p.nombre;
      else if (typeof p.name === "string") name = p.name;
      // image
      let image = "/img/logo_imagiq.png";
      if (typeof p.imagen === "string") image = p.imagen;
      else if (typeof p.image === "string") image = p.image;
      // sku
      let sku = "";
      if (typeof p.sku === "string") sku = p.sku;
      else
        sku = `SKU-${
          typeof p.id === "string"
            ? p.id
            : Math.random().toString(36).slice(2, 10)
        }`;
      let ean = "";
      if (typeof p.ean === "string") ean = p.ean;
      else
        ean = `EAN-${
          typeof p.id === "string"
            ? p.id
            : Math.random().toString(36).slice(2, 10)
        }`;
      // puntos_q - valor por defecto 4 como especificado
      const puntos_q = typeof p.puntos_q === "number" ? p.puntos_q : 4;
      // price
      const price = Number(p.precio || p.price || 0);
      // quantity
      const quantity = Number(p.cantidad || p.quantity || 1);
      // stock - del backend
      const stock = typeof p.stock === "number" ? p.stock : undefined;
      // originalPrice - del backend
      const originalPrice = typeof p.originalPrice === "number" ? p.originalPrice : undefined;
      // shippingFrom
      const shippingFrom = typeof p.shippingFrom === "string" ? p.shippingFrom : undefined;

      return { id, name, image, price, quantity, sku, ean, puntos_q, stock, originalPrice, shippingFrom };
    })
    .filter((p) => p.id && p.price > 0); // Filtrar productos inválidos
}

// Función para obtener productos del localStorage
function getStoredProducts(): CartProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return normalizeCartProducts(parsed);
  } catch (error) {
    console.warn("Error parsing cart items from localStorage:", error);
    return [];
  }
}

// Función para obtener descuento aplicado
function getStoredDiscount(): number {
  if (typeof window === "undefined") return 0;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APPLIED_DISCOUNT);
    return stored ? Number(stored) : 0;
  } catch (error) {
    console.warn("Error parsing discount from localStorage:", error);
    return 0;
  }
}

// Función para formatear precios en COP
export const formatPrice = (price: number): string => {
  if (!isFinite(price) || isNaN(price)) return "$0";
  return price.toLocaleString("es-CO", { style: "currency", currency: "COP" });
};

export function useCart(): UseCartReturn {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Ref para prevenir múltiples clics del mismo producto en un corto período
  const addProductTimeoutRef = useRef<Record<string, number>>({});
  // Ref para evitar duplicidad de alertas (toast)
  const toastActiveRef = useRef<Record<string, boolean>>({});

  // Inicializar datos del carrito
  useEffect(() => {
    setProducts(getStoredProducts());
    setAppliedDiscount(getStoredDiscount());
    setIsLoading(false);
  }, []);

  // Sincronizar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(getStoredProducts());
      setAppliedDiscount(getStoredDiscount());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Función para guardar productos en localStorage
  const saveProducts = useCallback(
    (newProducts: CartProduct[], skipStorageEvent = false) => {
      try {
        // Si el carrito está vacío, mejor eliminar el ítem completamente
        if (newProducts.length === 0) {
          localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
        } else {
          localStorage.setItem(
            STORAGE_KEYS.CART_ITEMS,
            JSON.stringify(newProducts)
          );
        }

        // Solo actualizar el estado si no está siendo llamado desde removeProduct
        if (!skipStorageEvent) {
          // Actualizar el estado local (de manera asincrónica para evitar problemas de renderizado)
          // Esto evita el error "Cannot update a component while rendering a different component"
          setTimeout(() => {
            setProducts(newProducts);

            // Disparar evento storage para otros tabs/componentes después de actualizar el estado
            // Esto asegura que otros componentes se actualicen incluso dentro de la misma tab
            try {
              window.dispatchEvent(new Event("storage"));
            } catch (error) {
              // Fallback para navegadores antiguos
              console.debug(
                "Manual storage event dispatch failed, relying on natural events",
                error
              );
            }
          }, 0);
        }
      } catch (error) {
        console.error("Error saving products to localStorage:", error);
      }
    },
    []
  );

  // Función para guardar descuento en localStorage
  const saveDiscount = useCallback((discount: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLIED_DISCOUNT, String(discount));
      setAppliedDiscount(discount);
    } catch (error) {
      console.error("Error saving discount to localStorage:", error);
    }
  }, []);

  /**
   * Agrega un producto al carrito y muestra una alerta única por acción.
   * Evita duplicidad de toasts usando un flag temporal por producto.
   */
  const addProduct = useCallback(
    (product: Omit<CartProduct, "quantity">, quantity: number = 1) => {
      const now = Date.now();
      const productId = product.id;
      // Prevenir múltiples clics del mismo producto en 300ms
      const lastAddTime = addProductTimeoutRef.current[productId] || 0;
      if (now - lastAddTime < 300) {
        return;
      }
      addProductTimeoutRef.current[productId] = now;
      setProducts((currentProducts) => {
        const existingIndex = currentProducts.findIndex(
          (p) => p.id === product.id
        );
        let newProducts: CartProduct[];
        let wasUpdated = false;
        let finalQuantity = quantity;
        if (existingIndex >= 0) {
          newProducts = [...currentProducts];
          const currentQuantity = newProducts[existingIndex].quantity;
          finalQuantity = currentQuantity + quantity;
          newProducts[existingIndex] = {
            ...newProducts[existingIndex],
            quantity: finalQuantity,
          };
          wasUpdated = true;
        } else {
          newProducts = [...currentProducts, { ...product, quantity }];
          finalQuantity = quantity;
        }
        // Guardar productos en localStorage
        try {
          localStorage.setItem(
            STORAGE_KEYS.CART_ITEMS,
            JSON.stringify(newProducts)
          );
        } catch (error) {
          console.error("Error saving products to localStorage:", error);
        }
        // Mostrar alerta solo si no está activa para este producto
        if (!toastActiveRef.current[productId]) {
          toastActiveRef.current[productId] = true;
          toast.success(
            wasUpdated ? `Cantidad actualizada` : `Producto añadido al carrito`,
            {
              description: `${product.name} - Cantidad: ${finalQuantity}`,
              duration: 3000,
              className: "toast-success",
              onAutoClose: () => {
                toastActiveRef.current[productId] = false;
              },
              onDismiss: () => {
                toastActiveRef.current[productId] = false;
              },
            }
          );
        }
        return newProducts;
      });
      // Limpiar el timeout después de 500ms
      setTimeout(() => {
        if (addProductTimeoutRef.current[productId] === now) {
          delete addProductTimeoutRef.current[productId];
        }
      }, 500);
    },
    []
  );

  /**
   * Elimina un producto del carrito y muestra alerta única.
   * Implementación optimizada para evitar notificaciones duplicadas.
   */
  const removeProduct = useCallback(
    (productId: string) => {
      // Prevenir múltiples eliminaciones del mismo producto
      const productToRemove = products.find((p) => p.id === productId);
      if (!productToRemove) return; // Producto ya no existe

      // Usar una flag temporal para evitar notificaciones duplicadas
      const removeKey = `remove_${productId}`;
      if (toastActiveRef.current[removeKey]) return; // Ya se está procesando
      toastActiveRef.current[removeKey] = true;

      const productName = productToRemove.name;

      // Actualizar productos localmente
      const newProducts = products.filter((p) => p.id !== productId);

      // Actualizar estado inmediatamente para UI responsiva
      setProducts(newProducts);

      // Guardar en localStorage de manera asíncrona
      setTimeout(() => {
        try {
          if (newProducts.length === 0) {
            localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
          } else {
            localStorage.setItem(
              STORAGE_KEYS.CART_ITEMS,
              JSON.stringify(newProducts)
            );
          }

          // Disparar evento de storage para sincronizar entre pestañas
          try {
            window.dispatchEvent(new Event("storage"));
          } catch (error) {
            console.debug("Error dispatching storage event", error);
          }

          // Mostrar notificación única después de guardar
          if (productName) {
            toast.info(`Producto eliminado`, {
              description: `${productName} se quitó del carrito`,
              duration: 2500,
              className: "toast-info",
              onAutoClose: () => {
                toastActiveRef.current[removeKey] = false;
              },
              onDismiss: () => {
                toastActiveRef.current[removeKey] = false;
              },
            });
          }

          // Limpiar flag después de mostrar toast
          setTimeout(() => {
            toastActiveRef.current[removeKey] = false;
          }, 100);
        } catch (error) {
          console.error("Error removing product from localStorage:", error);
          toastActiveRef.current[removeKey] = false;
        }
      }, 0);
    },
    [products]
  );

  /**
   * Actualiza la cantidad de un producto en el carrito.
   */
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeProduct(productId);
        return;
      }

      // Actualizar productos localmente
      const newProducts = products.map((p) =>
        p.id === productId ? { ...p, quantity } : p
      );

      // Actualizar estado inmediatamente
      setProducts(newProducts);

      // Guardar en localStorage de manera asíncrona
      setTimeout(() => {
        try {
          localStorage.setItem(
            STORAGE_KEYS.CART_ITEMS,
            JSON.stringify(newProducts)
          );

          // Disparar evento de storage para sincronizar entre pestañas
          try {
            window.dispatchEvent(new Event("storage"));
          } catch (error) {
            console.debug("Error dispatching storage event", error);
          }
        } catch (error) {
          console.error(
            "Error updating product quantity in localStorage:",
            error
          );
        }
      }, 0);
    },
    [products, removeProduct]
  );

  /**
   * Vacía el carrito y reinicia el contador global en tiempo real.
   * Muestra alerta única de carrito vacío.
   */
  const clearCart = useCallback(() => {
    try {
      // Prevenir múltiples notificaciones de limpiar carrito
      const clearKey = "clear_cart";
      if (toastActiveRef.current[clearKey]) return;
      toastActiveRef.current[clearKey] = true;

      // Actualizar estado local inmediatamente
      setProducts([]);

      // Guardar en localStorage sin disparar eventos storage
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);

        // Disparar evento de storage para sincronizar entre pestañas
        try {
          window.dispatchEvent(new Event("storage"));
        } catch (error) {
          console.debug("Error dispatching storage event", error);
        }

        // Notificar al usuario
        toast.info("Carrito vacío", {
          description: "Todos los productos fueron eliminados",
          duration: 2500,
          className: "toast-info",
          onAutoClose: () => {
            toastActiveRef.current[clearKey] = false;
          },
          onDismiss: () => {
            toastActiveRef.current[clearKey] = false;
          },
        });

        // Limpiar flag después de mostrar toast
        setTimeout(() => {
          toastActiveRef.current[clearKey] = false;
        }, 100);
      }, 0);
    } catch (error) {
      console.error("Error clearing cart:", error);
      toastActiveRef.current["clear_cart"] = false;
    }
  }, []);

  /**
   * Aplica descuento al carrito.
   */
  const applyDiscount = useCallback(
    (discount: number) => {
      const validDiscount = Math.max(0, discount);
      saveDiscount(validDiscount);
    },
    [saveDiscount]
  );

  // Cálculos derivados
  const calculations: CartCalculations = {
    productCount: products.reduce((acc, p) => {
      const qty = Number(p.quantity);
      return acc + (isNaN(qty) ? 0 : qty);
    }, 0),
    subtotal: products.reduce((acc, p) => {
      const price = Number(p.price);
      const quantity = Number(p.quantity);
      const safePrice = isNaN(price) ? 0 : price;
      const safeQuantity = isNaN(quantity) ? 0 : quantity;
      return acc + safePrice * safeQuantity;
    }, 0),
    shipping: SHIPPING_COST,
    discount: Math.max(0, appliedDiscount),
    get taxes() {
      return Math.round(this.subtotal * TAX_RATE);
    },
    get total() {
      return Math.max(0, this.subtotal - this.discount + this.shipping);
    },
  };

  const isEmpty = products.length === 0;

  return {
    // Estado
    products,
    appliedDiscount,
    isLoading,

    // Cálculos
    calculations,

    // Acciones
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    applyDiscount,

    // Utilidades
    isEmpty,
    formatPrice,
  };
}
