"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { productEndpoints } from "@/lib/api";

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
  /** Ubicación de envío (ej: "Bogotá")*/
  shippingFrom?: string;
  /** Ciudad de envío (ej: "BOGOTÁ") */
  shippingCity?: string;
  /** Nombre de la tienda (ej: "Ses Bogotá C.C. Andino") */
  shippingStore?: string;
  /** Color del producto (código hexadecimal) */
  color?: string;
  /** Nombre del color del producto */
  colorName?: string;
  /** Capacidad del producto (ej: "128GB", "256GB") */
  capacity?: string;
  /** Memoria RAM del producto (ej: "8GB", "12GB") */
  ram?: string;
  skuPostback?: string;
  desDetallada?:string;
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
  loadingShippingInfo: Record<string, boolean>;

  // Cálculos
  calculations: CartCalculations;

  // Acciones
  addProduct: (
    product: Omit<CartProduct, "quantity">,
    quantity?: number,
    userId?: string
  ) => Promise<void>;
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
        // skuPostback
      let skuPostback = "";
      if (typeof p.skuPostback === "string") skuPostback = p.skuPostback;
      else
        skuPostback = `SKU-${
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
      // shippingCity y shippingStore
      const shippingCity = typeof p.shippingCity === "string" ? p.shippingCity : undefined;
      const shippingStore = typeof p.shippingStore === "string" ? p.shippingStore : undefined;
      // color
      const color = typeof p.color === "string" ? p.color : undefined;
      // colorName
      const colorName = typeof p.colorName === "string" ? p.colorName : undefined;
      // capacity
      const capacity = typeof p.capacity === "string" ? p.capacity : undefined;
      // ram
      const ram = typeof p.ram === "string" ? p.ram : undefined;

      return { id, name, image, price, quantity, sku, ean, puntos_q, stock, originalPrice, shippingFrom, shippingCity, shippingStore, color,colorName,  capacity, ram, skuPostback  };

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
  const [loadingShippingInfo, setLoadingShippingInfo] = useState<Record<string, boolean>>({});

  // Ref para prevenir múltiples clics del mismo producto en un corto período
  const addProductTimeoutRef = useRef<Record<string, number>>({});
  // Ref para evitar duplicidad de alertas (toast)
  const toastActiveRef = useRef<Record<string, boolean>>({});

  // Función helper para obtener userId
  const getUserId = useCallback((): string | undefined => {
    try {
      const userStr = localStorage.getItem("imagiq_user");
      if (!userStr) return undefined;
      const user = JSON.parse(userStr);
      return user?.id || user?.user_id;
    } catch {
      return undefined;
    }
  }, []);

  // Función para cargar información de envío de un producto
  const loadShippingInfoForProduct = useCallback(async (sku: string, userId: string) => {
    setLoadingShippingInfo((prev) => ({ ...prev, [sku]: true }));

    try {
      const response = await productEndpoints.getCandidateStores({
        skus: [sku],
        user_id: userId,
      });

      if (response.success && response.data) {
        const { stores, default_direction } = response.data;

        let shippingCity = "BOGOTÁ"; // default_direction.ciudad || 
        let shippingStore = "";

        const storeEntries = Object.entries(stores);
        if (storeEntries.length > 0) {
          const [firstCity, firstCityStores] = storeEntries[0];
          shippingCity = firstCity;
          if (firstCityStores.length > 0) {
            shippingStore = firstCityStores[0].nombre_tienda.trim();
          }
        }

        setProducts((currentProducts) => {
          const updatedProducts = currentProducts.map(p =>
            p.sku === sku ? { ...p, shippingCity, shippingStore } : p
          );

          try {
            localStorage.setItem(
              STORAGE_KEYS.CART_ITEMS,
              JSON.stringify(updatedProducts)
            );
          } catch (error) {
            console.error("Error saving updated shipping location:", error);
          }

          return updatedProducts;
        });
      }
    } catch (error) {
      console.error('Error al obtener tienda candidata:', error);
    } finally {
      setLoadingShippingInfo((prev) => {
        const newState = { ...prev };
        delete newState[sku];
        return newState;
      });
    }
  }, []);

  // Inicializar datos del carrito
  useEffect(() => {
    setProducts(getStoredProducts());
    setAppliedDiscount(getStoredDiscount());
    setIsLoading(false);
  }, []);

  // Cargar información de envío para productos sin ella al montar
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const storedProducts = getStoredProducts();
    const productsWithoutShipping = storedProducts.filter(p => !p.shippingCity);

    if (productsWithoutShipping.length > 0) {
      // Cargar shipping info para cada producto que no la tenga
      productsWithoutShipping.forEach(product => {
        loadShippingInfoForProduct(product.sku, userId);
      });
    }
  }, [getUserId, loadShippingInfoForProduct]);

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
   * Si se proporciona userId, obtiene la ubicación de envío del backend en segundo plano.
   */
  const addProduct = useCallback(
    async (product: Omit<CartProduct, "quantity">, quantity: number = 1, userId?: string) => {
      const now = Date.now();
      const productId = product.id;
      // Prevenir múltiples clics del mismo producto en 300ms
      const lastAddTime = addProductTimeoutRef.current[productId] || 0;
      if (now - lastAddTime < 300) {
        return;
      }
      addProductTimeoutRef.current[productId] = now;

      // Obtener userId automáticamente si no se proporciona
      const effectiveUserId = userId || getUserId();

      // Agregar producto inmediatamente sin bloquear
      setProducts((currentProducts) => {
        const existingIndex = currentProducts.findIndex(
          (p) => p.sku === product.sku
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
          newProducts = [...currentProducts, { ...product, quantity, shippingFrom: product.shippingFrom , }];
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

      // Obtener ubicación de envío en segundo plano si tenemos userId
      if (effectiveUserId) {
        // Marcar este SKU específico como cargando
        setLoadingShippingInfo((prev) => ({ ...prev, [product.sku]: true }));

        setTimeout(async () => {
          try {
            const response = await productEndpoints.getCandidateStores({
              skus: [product.sku],
              user_id: effectiveUserId,
            });

            if (response.success && response.data) {
              const { stores, default_direction } = response.data;

              // Obtener la primera ciudad y tienda disponible
              let shippingCity = "BOGOTÁ"; // default_direction.ciudad || 
              let shippingStore = "";

              // Si stores no está vacío, obtener la primera ciudad y su primera tienda
              const storeEntries = Object.entries(stores);
              if (storeEntries.length > 0) {
                const [firstCity, firstCityStores] = storeEntries[0];
                shippingCity = firstCity;
                if (firstCityStores.length > 0) {
                  shippingStore = firstCityStores[0].nombre_tienda.trim();
                }
              }

              // Actualizar el producto con ciudad y tienda por separado
              setProducts((currentProducts) => {
                const updatedProducts = currentProducts.map(p =>
                  p.sku === product.sku ? { ...p, shippingCity, shippingStore } : p
                );

                // Guardar en localStorage
                try {
                  localStorage.setItem(
                    STORAGE_KEYS.CART_ITEMS,
                    JSON.stringify(updatedProducts)
                  );
                } catch (error) {
                  console.error("Error saving updated shipping location:", error);
                }

                return updatedProducts;
              });
            }
          } catch (error) {
            console.error('Error al obtener tienda candidata:', error);
            // No hacer nada si falla, el producto ya está en el carrito
          } finally {
            // Marcar este SKU como ya no cargando
            setLoadingShippingInfo((prev) => {
              const newState = { ...prev };
              delete newState[product.sku];
              return newState;
            });
          }
        }, 0);
      }

      // Limpiar el timeout después de 500ms
      setTimeout(() => {
        if (addProductTimeoutRef.current[productId] === now) {
          delete addProductTimeoutRef.current[productId];
        }
      }, 500);
    },
    [getUserId, loadShippingInfoForProduct]
  );

  /**
   * Elimina un producto del carrito y muestra alerta única.
   * Implementación optimizada para evitar notificaciones duplicadas.
   */
  const removeProduct = useCallback(
    (productId: string) => {
      // Prevenir múltiples eliminaciones del mismo producto
      const productToRemove = products.find((p) => p.sku === productId);
      if (!productToRemove) return; // Producto ya no existe

      // Usar una flag temporal para evitar notificaciones duplicadas
      const removeKey = `remove_${productId}`;
      if (toastActiveRef.current[removeKey]) return; // Ya se está procesando
      toastActiveRef.current[removeKey] = true;

      const productName = productToRemove.name;

      // Actualizar productos localmente
      const newProducts = products.filter((p) => p.sku !== productId);

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
        p.sku === productId ? { ...p, quantity } : p
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
    loadingShippingInfo,

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
