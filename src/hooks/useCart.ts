"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { productEndpoints, type CandidateStoresResponse, type CandidateStore } from "@/lib/api";
import { apiDelete, apiPost, apiPut } from "@/lib/api-client";

// Interfaz para información del bundle
export interface BundleInfo {
  /** Código de la campaña del bundle */
  codCampana: string;
  /** SKU del producto principal del bundle */
  productSku: string;
  /** Array con todos los SKUs que componen el bundle */
  skusBundle: string[];
  /** Precio original del bundle (sin descuento) */
  bundlePrice: number;
  /** Precio con descuento del bundle */
  bundleDiscount: number;
  /** Fecha de expiración del bundle */
  fechaFinal: Date;
}

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
  /** Modelo del producto (ej: "Galaxy S24", "Galaxy Watch") - usado para sugerencias relacionadas */
  modelo?: string;
  /** Indica si el producto puede ser recogido en tienda (canPickUp) */
  canPickUp?: boolean;
  /** Indica si el producto aplica para retoma (indRetoma: 1 = aplica, 0 = no aplica) */
  indRetoma?: number;
  /** Información del bundle al que pertenece este producto (si aplica) */
  bundleInfo?: BundleInfo;
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

  // Acciones de Bundle
  addBundleToCart: (
    items: Omit<CartProduct, "quantity">[],
    bundleInfo: BundleInfo,
    userId?: string
  ) => Promise<void>;
  updateBundleQuantity: (
    codCampana: string,
    productSku: string,
    quantity: number
  ) => Promise<void>;
  removeBundleProduct: (
    sku: string,
    keepOtherProducts: boolean
  ) => Promise<void>;

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

  const randId = () => Math.random().toString(36).slice(2, 10);

  const toId = (val: unknown): string => {
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (val !== null && val !== undefined) {
      if (typeof val === "boolean" || typeof val === "bigint") return String(val);
    }
    return "";
  };

  const asString = (val: unknown, fallback = undefined as string | undefined) =>
    typeof val === "string" ? val : fallback;

  const asNumber = (val: unknown, fallback = 0) =>
    Number(val ?? fallback);

  const parseProduct = (p: Record<string, unknown>): CartProduct => {
    const id = toId(p.id);
    const name = asString(p.nombre, asString(p.name, "Producto")) || "Producto";
    const image = asString(p.imagen, asString(p.image, "/img/logo_imagiq.png")) || "/img/logo_imagiq.png";

    const sku =
      typeof p.sku === "string"
        ? p.sku
        : `SKU-${typeof p.id === "string" ? p.id : randId()}`;

    const ean =
      typeof p.ean === "string"
        ? p.ean
        : `EAN-${typeof p.id === "string" ? p.id : randId()}`;

    const skuPostback =
      typeof p.skuPostback === "string" && p.skuPostback.trim() !== ""
        ? p.skuPostback
        : undefined;

    const puntos_q = typeof p.puntos_q === "number" ? p.puntos_q : 4;
    const price = asNumber(p.precio ?? p.price ?? 0, 0);
    const quantity = Number(p.cantidad ?? p.quantity ?? 1);

    const stock = typeof p.stock === "number" ? p.stock : undefined;
    const originalPrice = typeof p.originalPrice === "number" ? p.originalPrice : undefined;
    const shippingFrom = asString(p.shippingFrom);
    const shippingCity = asString(p.shippingCity);
    const shippingStore = asString(p.shippingStore);
    const color = asString(p.color);
    const colorName = asString(p.colorName);
    const capacity = asString(p.capacity);
    const ram = asString(p.ram);
    const desDetallada = asString(p.desDetallada);
    const modelo = asString(p.modelo);
    const canPickUp = typeof p.canPickUp === "boolean" ? p.canPickUp : undefined;
    const indRetoma = typeof p.indRetoma === "number" ? p.indRetoma : undefined;

    // Parsear bundleInfo si existe
    let bundleInfo: BundleInfo | undefined = undefined;
    if (p.bundleInfo && typeof p.bundleInfo === "object") {
      const bi = p.bundleInfo as Record<string, unknown>;
      if (bi.codCampana && bi.productSku && Array.isArray(bi.skusBundle)) {
        bundleInfo = {
          codCampana: String(bi.codCampana),
          productSku: String(bi.productSku),
          skusBundle: bi.skusBundle.map((s: unknown) => String(s)),
          bundlePrice: Number(bi.bundlePrice) || 0,
          bundleDiscount: Number(bi.bundleDiscount) || 0,
          fechaFinal: new Date(bi.fechaFinal as string | number | Date),
        };
      }
    }

    return {
      id,
      name,
      image,
      price,
      quantity,
      sku,
      ean,
      puntos_q,
      stock,
      originalPrice,
      shippingFrom,
      shippingCity,
      shippingStore,
      color,
      colorName,
      capacity,
      ram,
      skuPostback,
      desDetallada,
      modelo,
      canPickUp,
      indRetoma,
      bundleInfo,
    };
  };

  return rawProducts
    .filter(
      (p): p is Record<string, unknown> => typeof p === "object" && p !== null
    )
    .map(parseProduct)
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
  const loadShippingInfoForProduct = useCallback(async (sku: string, userId: string, quantity: number) => {
    setLoadingShippingInfo((prev) => ({ ...prev, [sku]: true }));
 
    try {
      const response = await productEndpoints.getCandidateStores({
        products: [{ sku, quantity }],
        user_id: userId,
      });

      if (response.success && response.data) {
        const { stores, default_direction, canPickUp } = response.data;

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
            p.sku === sku ? { ...p, shippingCity, shippingStore, canPickUp } : p
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
        loadShippingInfoForProduct(product.sku, userId, product.quantity);
      });
    }
  }, [getUserId, loadShippingInfoForProduct]);

  // Sincronizar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(getStoredProducts());
      setAppliedDiscount(getStoredDiscount());
    };
    // Escuchar tanto el evento 'storage' nativo (entre tabs) como el evento personalizado (mismo tab)
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleStorageChange);
    };
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

      // Variable para capturar la cantidad final que quedará en el carrito
      let totalQuantityInCart = quantity;

      // Agregar producto inmediatamente sin bloquear
      setProducts((currentProducts) => {
        // Solo buscar productos individuales (sin bundleInfo) para evitar mezclar con bundles
        const existingIndex = currentProducts.findIndex(
          (p) => p.sku === product.sku && !p.bundleInfo
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

        // Capturar la cantidad final para usarla fuera del setProducts
        totalQuantityInCart = finalQuantity;

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
              products: [{ sku: product.sku, quantity: totalQuantityInCart }],
              user_id: effectiveUserId,
            });

            if (response.success && response.data) {
              const responseData = response.data as CandidateStoresResponse & { canPickup?: boolean };
              const { stores } = responseData;
              // Manejar ambos casos: canPickUp (mayúscula) y canPickup (minúscula)
              const canPickUp = responseData.canPickUp ?? 
                                responseData.canPickup ?? 
                                false;

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
                  p.sku === product.sku ? { ...p, shippingCity, shippingStore, canPickUp } : p
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
            apiDelete(`/api/cart/items/${productId}`);
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

      // Obtener userId para actualizar información de envío
      const userId = getUserId();

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

          // Recargar información de envío con la nueva cantidad si tenemos userId
          if (userId) {
            loadShippingInfoForProduct(productId, userId, quantity);
          }
        } catch (error) {
          console.error(
            "Error updating product quantity in localStorage:",
            error
          );
        }
      }, 0);
    },
    [products, removeProduct, getUserId, loadShippingInfoForProduct]
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
        apiDelete(`/api/cart/items/clear`);
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

  // ==================== MÉTODOS DE BUNDLE ====================

  /**
   * Añade todos los productos de un bundle al carrito.
   * Cada producto se marca con bundleInfo para identificar que pertenece al bundle.
   */
  const addBundleToCart = useCallback(
    async (
      items: Omit<CartProduct, "quantity">[],
      bundleInfo: BundleInfo,
      userId?: string
    ) => {
      const effectiveUserId = userId || getUserId();

      // Preparar items con bundleInfo y quantity = 1
      console.log("Adding bundle to cart:", items, bundleInfo);
      const itemsWithBundle: CartProduct[] = items.map((item) => ({
        ...item,
        quantity: 1,
        bundleInfo,
      }));

      // Actualizar estado local
      setProducts((currentProducts) => {
        const newProducts = [...currentProducts];

        for (const item of itemsWithBundle) {
          // Solo buscar productos que pertenezcan al MISMO bundle (mismo codCampana y productSku)
          // Esto evita mezclar productos individuales con productos de bundle
          const existingIndex = newProducts.findIndex(
            (p) =>
              p.sku === item.sku &&
              p.bundleInfo?.codCampana === bundleInfo.codCampana &&
              p.bundleInfo?.productSku === bundleInfo.productSku
          );

          if (existingIndex >= 0) {
            console.log("Product already in bundle, updating quantity:", item.sku);
            // Si el producto ya existe en el mismo bundle, actualizar cantidad
            newProducts[existingIndex] = {
              ...newProducts[existingIndex],
              quantity: newProducts[existingIndex].quantity + 1,
            };
          } else {
            // Si no existe o es un producto individual/de otro bundle, agregar como nuevo
            newProducts.push(item);
          }
        }

        // Guardar en localStorage
        try {
          localStorage.setItem(
            STORAGE_KEYS.CART_ITEMS,
            JSON.stringify(newProducts)
          );
        } catch (error) {
          console.error("Error saving bundle to localStorage:", error);
        }

        return newProducts;
      });

      // Mostrar toast
      toast.success("Bundle añadido al carrito", {
        description: `${items.length} productos del bundle añadidos`,
        duration: 3000,
      });

      // Llamar al backend
      try {
        await apiPost("/api/cart/bundle/add", {
          items: itemsWithBundle,
          bundleInfo,
        });
      } catch (error) {
        console.error("Error adding bundle to cart:", error);
      }

      // Disparar evento de storage
      setTimeout(() => {
        window.dispatchEvent(new Event("storage"));
      }, 0);
    },
    [getUserId]
  );

  /**
   * Actualiza la cantidad de todos los productos de un bundle.
   */
  const updateBundleQuantity = useCallback(
    async (codCampana: string, productSku: string, quantity: number) => {
      if (quantity <= 0) {
        // Eliminar todo el bundle
        setProducts((currentProducts) => {
          const newProducts = currentProducts.filter(
            (p) =>
              !(
                p.bundleInfo?.codCampana === codCampana &&
                p.bundleInfo?.productSku === productSku
              )
          );

          try {
            if (newProducts.length === 0) {
              localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
            } else {
              localStorage.setItem(
                STORAGE_KEYS.CART_ITEMS,
                JSON.stringify(newProducts)
              );
            }
          } catch (error) {
            console.error("Error removing bundle from localStorage:", error);
          }

          return newProducts;
        });

        toast.info("Bundle eliminado del carrito", {
          duration: 2500,
        });
      } else {
        // Actualizar cantidad de todos los productos del bundle
        setProducts((currentProducts) => {
          const newProducts = currentProducts.map((p) => {
            if (
              p.bundleInfo?.codCampana === codCampana &&
              p.bundleInfo?.productSku === productSku
            ) {
              return { ...p, quantity };
            }
            return p;
          });

          try {
            localStorage.setItem(
              STORAGE_KEYS.CART_ITEMS,
              JSON.stringify(newProducts)
            );
          } catch (error) {
            console.error("Error updating bundle quantity:", error);
          }

          return newProducts;
        });
      }

      // Llamar al backend
      try {
        await apiPut("/api/cart/bundle/quantity", {
          codCampana,
          productSku,
          quantity,
        });
      } catch (error) {
        console.error("Error updating bundle quantity:", error);
      }

      // Disparar evento de storage
      setTimeout(() => {
        window.dispatchEvent(new Event("storage"));
      }, 0);
    },
    []
  );

  /**
   * Elimina un producto de un bundle.
   * Si keepOtherProducts es true, los demás productos pierden el bundleInfo y vuelven a precio original.
   * Si keepOtherProducts es false, se eliminan todos los productos del bundle.
   */
  const removeBundleProduct = useCallback(
    async (sku: string, keepOtherProducts: boolean) => {
      setProducts((currentProducts) => {
        const productToRemove = currentProducts.find((p) => p.sku === sku);

        if (!productToRemove?.bundleInfo) {
          // No tiene bundleInfo, eliminar normalmente
          return currentProducts.filter((p) => p.sku !== sku);
        }

        const { codCampana, productSku } = productToRemove.bundleInfo;

        let newProducts: CartProduct[];

        if (keepOtherProducts) {
          // Eliminar el producto y quitar bundleInfo de los demás
          newProducts = currentProducts
            .filter((p) => p.sku !== sku)
            .map((p) => {
              if (
                p.bundleInfo?.codCampana === codCampana &&
                p.bundleInfo?.productSku === productSku
              ) {
                // Volver al precio original y quitar bundleInfo
                return {
                  ...p,
                  price: p.originalPrice ?? p.price,
                  bundleInfo: undefined,
                };
              }
              return p;
            });

          toast.warning("Descuento de bundle perdido", {
            description:
              "Al eliminar un producto del bundle, los demás productos vuelven a su precio original.",
            duration: 4000,
          });
        } else {
          // Eliminar todos los productos del bundle
          newProducts = currentProducts.filter(
            (p) =>
              !(
                p.bundleInfo?.codCampana === codCampana &&
                p.bundleInfo?.productSku === productSku
              )
          );

          toast.info("Bundle eliminado del carrito", {
            duration: 2500,
          });
        }

        try {
          if (newProducts.length === 0) {
            localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
          } else {
            localStorage.setItem(
              STORAGE_KEYS.CART_ITEMS,
              JSON.stringify(newProducts)
            );
          }
        } catch (error) {
          console.error("Error removing bundle product:", error);
        }

        return newProducts;
      });

      // Llamar al backend
      try {
        await apiDelete(`/api/cart/bundle/product?sku=${encodeURIComponent(sku)}&keepOtherProducts=${keepOtherProducts}`);
      } catch (error) {
        console.error("Error removing bundle product:", error);
      }

      // Disparar evento de storage
      setTimeout(() => {
        window.dispatchEvent(new Event("storage"));
      }, 0);
    },
    []
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

    // Acciones de Bundle
    addBundleToCart,
    updateBundleQuantity,
    removeBundleProduct,

    // Utilidades
    isEmpty,
    formatPrice,
  };
}
