"use client";
import { TradeInCompletedSummary } from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";
import TradeInModal from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInModal";
import { useCart, type CartProduct, type BundleInfo } from "@/hooks/useCart";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { tradeInEndpoints, type ProductApiData } from "@/lib/api";
import { apiDelete, apiPut } from "@/lib/api-client";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import Step4OrderSummary from "./components/Step4OrderSummary";
import ProductCard from "./ProductCard";
import Sugerencias from "./Sugerencias";
import {
  getTradeInValidationMessage,
  validateTradeInProducts,
} from "./utils/validateTradeIn";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { CartBundleGroup } from "./components/CartBundleGroup";
import { useTradeInPrefetch } from "@/hooks/useTradeInPrefetch";
import { useDelivery } from "./hooks/useDelivery";

/**
 * Paso 1 del carrito de compras
 * - Muestra productos guardados en localStorage
 * - Resumen de compra
 * - Código limpio, escalable y fiel al diseño Samsung
 */
/**
 * Paso 1 del carrito de compras
 * Recibe onContinue para avanzar al paso 2
 */
export default function Step1({
  onContinue,
}: {
  readonly onContinue: () => void;
}) {
  // IMPORTANTE: En Step1, useDelivery hace la llamada inicial a candidate-stores
  // Esto llena el caché para que los demás steps solo lean de él
  useDelivery({
    canFetchFromEndpoint: true,  // Permitir llamadas en Step1
    onlyReadCache: false,         // NO solo lectura, debe hacer llamada inicial
  });

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const { trackBeginCheckout } = useAnalyticsWithUser();

  // Estado para Trade-In
  // Estado para Trade-In (Mapa de SKU -> Datos)
  const [tradeInData, setTradeInData] = useState<Record<string, {
    deviceName: string;
    value: number;
    completed: boolean;
    detalles?: unknown; // Detalles opcionales del Trade-In (se preservan en localStorage)
  }>>({});

  // Estado para controlar el modal de Trade-In
  const [isTradeInModalOpen, setIsTradeInModalOpen] = useState(false);

  // Estado para rastrear el SKU del producto para el cual se está completando el trade-in
  const [currentTradeInSku, setCurrentTradeInSku] = useState<string | null>(null);

  // Usar el hook centralizado useCart
  const {
    products: cartProducts,
    updateQuantity,
    removeProduct,
    addProduct,
    calculations,
    loadingShippingInfo,
    formatPrice,
    // Métodos de Bundle
    updateBundleQuantity,
    removeBundleProduct,
  } = useCart();

  // Agrupar productos por bundle
  const { bundleGroups, nonBundleProducts } = useMemo(() => {
    const groups = new Map<string, { bundleInfo: BundleInfo; items: CartProduct[] }>();
    const standalone: CartProduct[] = [];

    for (const product of cartProducts) {
      if (product.bundleInfo) {
        const key = `${product.bundleInfo.codCampana}-${product.bundleInfo.productSku}`;
        if (!groups.has(key)) {
          groups.set(key, { bundleInfo: product.bundleInfo, items: [] });
        }
        groups.get(key)!.items.push(product);
      } else {
        standalone.push(product);
      }
    }

    return {
      bundleGroups: Array.from(groups.values()),
      nonBundleProducts: standalone,
    };
  }, [cartProducts]);

  // Estado para rastrear qué productos están cargando indRetoma
  const [loadingIndRetoma, setLoadingIndRetoma] = useState<Set<string>>(
    new Set()
  );

  // Estado para rastrear cambios de dirección
  const [lastAddressChange, setLastAddressChange] = useState<number>(0);

  // Escuchar cambios de dirección desde el header
  useEffect(() => {
    const handleAddressChange = () => {
      console.log("🔄 Step1: Detectado cambio de dirección, re-verificando trade-in...");
      setLastAddressChange(Date.now());

      // Limpiar caches de verificación para forzar nueva verificación
      verifiedSkusRef.current.clear();
      failedSkusRef.current.clear();

      // Mostrar skeleton inmediatamente para todos los productos
      if (cartProducts.length > 0) {
        setLoadingIndRetoma(new Set(cartProducts.map(p => p.sku)));
      }
    };

    window.addEventListener('address-changed', handleAddressChange);
    return () => {
      window.removeEventListener('address-changed', handleAddressChange);
    };
  }, [cartProducts]);

  // ✅ Escuchar cuando se elimina un trade-in (cuando se elimina un producto)
  useEffect(() => {
    const handleTradeInRemoved = (event: CustomEvent<{ sku: string }>) => {
      const removedSku = event.detail.sku;
      //console.log("🔄 Step1: Trade-in eliminado para SKU:", removedSku);
      
      // Actualizar el estado del trade-in eliminando el SKU
      setTradeInData(prev => {
        const newState = { ...prev };
        delete newState[removedSku];
        return newState;
      });
    };

    window.addEventListener('trade-in-removed', handleTradeInRemoved as EventListener);
    return () => {
      window.removeEventListener('trade-in-removed', handleTradeInRemoved as EventListener);
    };
  }, []);

  // 🚀 Prefetch automático de datos de Trade-In
  useTradeInPrefetch();

  // Función para cargar Trade-Ins desde localStorage
  const loadTradeInFromStorage = useCallback(() => {
    try {
      const storedTradeIn = localStorage.getItem("imagiq_trade_in");
      if (!storedTradeIn) {
        setTradeInData({});
        return;
      }

      const parsed = JSON.parse(storedTradeIn);
      
      // Verificar si es el formato nuevo (objeto de objetos) o antiguo
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Si tiene deviceName directamente, es el formato antiguo
        if ('deviceName' in parsed) {
          // Formato antiguo: convertir al nuevo formato cuando haya productos
          if (cartProducts.length > 0) {
            const newTradeInData: Record<string, typeof parsed> = {};
            
            // Buscar el primer producto o bundle
            for (const product of cartProducts) {
              if (product.bundleInfo?.productSku) {
                // Es un bundle, usar productSku
                newTradeInData[product.bundleInfo.productSku] = parsed;
                break;
              } else if (product.sku) {
                // Es un producto individual, usar sku
                newTradeInData[product.sku] = parsed;
                break;
              }
            }
            
            if (Object.keys(newTradeInData).length > 0) {
              // Guardar en el formato nuevo
              const tradeInString = JSON.stringify(newTradeInData);
              localStorage.setItem("imagiq_trade_in", tradeInString);
              setTradeInData(newTradeInData);
              console.log("✅ Trade-In convertido del formato antiguo al nuevo");
            }
          }
        } else {
          // Formato nuevo: cargar directamente
          setTradeInData(parsed);
          console.log("✅ Trade-Ins cargados desde localStorage (formato nuevo):", Object.keys(parsed));
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar datos de Trade-In:", error);
      setTradeInData({});
    }
  }, [cartProducts]);

  // Cargar datos de Trade-In desde localStorage INMEDIATAMENTE al montar (sin esperar productos)
  // IMPORTANTE: Esto asegura que el Trade-In se cargue antes de cualquier validación
  useEffect(() => {
    // Cargar inmediatamente al montar, incluso si no hay productos aún
    try {
      const storedTradeIn = localStorage.getItem("imagiq_trade_in");
      if (storedTradeIn) {
        const parsed = JSON.parse(storedTradeIn);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          if (!('deviceName' in parsed)) {
            // Formato nuevo: cargar directamente
            setTradeInData(parsed);
            console.log("✅ Trade-Ins cargados inmediatamente desde localStorage:", Object.keys(parsed));
          }
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar Trade-In al montar:", error);
    }
  }, []); // Solo ejecutar una vez al montar

  // Sincronizar Trade-Ins con productos cuando estén disponibles
  useEffect(() => {
    if (cartProducts.length > 0) {
      // Cargar cuando hay productos disponibles para asegurar que se asocien correctamente
      loadTradeInFromStorage();
    }
  }, [cartProducts.length, loadTradeInFromStorage]); // Ejecutar cuando cambie el número de productos

  // Escuchar cambios en localStorage para sincronizar cuando se recarga la página
  useEffect(() => {
    const handleStorageChange = () => {
      // Recargar Trade-Ins cuando cambia localStorage (entre tabs o recargas)
      if (cartProducts.length > 0) {
        loadTradeInFromStorage();
      }
    };

    // Escuchar eventos de storage (entre tabs y recargas)
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleStorageChange);
    };
  }, [cartProducts.length, loadTradeInFromStorage]);

  // Sincronizar Trade-Ins con los productos del carrito cuando cambian
  // IMPORTANTE: Esto asegura que los Trade-Ins se mantengan cuando se recarga la página
  useEffect(() => {
    if (cartProducts.length === 0) {
      // Si no hay productos, no limpiar Trade-Ins automáticamente (pueden estar cargándose)
      return;
    }

    // Verificar que los Trade-Ins guardados correspondan a productos en el carrito
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (!storedTradeIn) {
      // Si no hay Trade-In guardado, no hacer nada
      return;
    }

    try {
      const parsed = JSON.parse(storedTradeIn);
      
      // Solo validar si es formato nuevo (objeto de objetos)
      if (parsed && typeof parsed === 'object' && !('deviceName' in parsed) && !Array.isArray(parsed)) {
        const validTradeIns: Record<string, {
          deviceName: string;
          value: number;
          completed: boolean;
          detalles?: unknown;
        }> = {};
        const allSkus = new Set<string>();
        
        // Obtener todos los SKUs válidos (productos individuales y bundles)
        cartProducts.forEach(product => {
          if (product.bundleInfo?.productSku) {
            // Para bundles, usar productSku
            allSkus.add(product.bundleInfo.productSku);
          } else {
            // Para productos individuales, usar sku
            allSkus.add(product.sku);
          }
        });
        
        // Filtrar Trade-Ins que correspondan a productos en el carrito
        Object.entries(parsed).forEach(([sku, tradeInData]) => {
          if (allSkus.has(sku)) {
            // Validar que el tradeInData tenga la estructura correcta
            const tradeIn = tradeInData as {
              deviceName?: string;
              value?: number;
              completed?: boolean;
              detalles?: unknown;
            };
            
            if (tradeIn && typeof tradeIn === 'object' && 
                tradeIn.deviceName && 
                typeof tradeIn.value === 'number' && 
                typeof tradeIn.completed === 'boolean') {
              validTradeIns[sku] = {
                deviceName: tradeIn.deviceName,
                value: tradeIn.value,
                completed: tradeIn.completed,
                ...(tradeIn.detalles !== undefined && { detalles: tradeIn.detalles }),
              };
            }
          }
        });
        
        // Actualizar estado si hay cambios o si el estado está vacío pero hay Trade-Ins válidos
        const currentTradeInsString = JSON.stringify(tradeInData);
        const validTradeInsString = JSON.stringify(validTradeIns);
        
        if (currentTradeInsString !== validTradeInsString) {
          if (Object.keys(validTradeIns).length > 0) {
            setTradeInData(validTradeIns);
            // Guardar de nuevo para asegurar que esté sincronizado y persistente
            const tradeInString = JSON.stringify(validTradeIns);
            localStorage.setItem("imagiq_trade_in", tradeInString);
            
            // Verificar que se guardó correctamente
            const verifySave = localStorage.getItem("imagiq_trade_in");
            if (!verifySave || verifySave !== tradeInString) {
              console.error("❌ ERROR: Trade-In NO se guardó correctamente al sincronizar");
              // Reintentar
              localStorage.setItem("imagiq_trade_in", tradeInString);
            } else {
              console.log("✅ Trade-Ins sincronizados y guardados correctamente:", Object.keys(validTradeIns));
            }
            
            // Disparar eventos de storage
            try {
              globalThis.dispatchEvent(new CustomEvent("localStorageChange", {
                detail: { key: "imagiq_trade_in" },
              }));
              globalThis.dispatchEvent(new Event("storage"));
            } catch (eventError) {
              console.error("Error disparando eventos de storage:", eventError);
            }
          } else {
            // No hay Trade-Ins válidos, pero no los eliminamos automáticamente
            console.log("⚠️ No se encontraron Trade-Ins válidos para los productos actuales, pero se mantienen en localStorage");
          }
        }
      }
    } catch (error) {
      console.error("❌ Error al sincronizar Trade-Ins:", error);
    }
  }, [cartProducts]); // Ejecutar cuando cambian los productos

  // Abrir modal automáticamente si viene desde el botón "Entrego y Estreno"
  useEffect(() => {
    // Verificar el flag inmediatamente y también después de un delay
    const checkAndOpenModal = () => {
      const targetSku = localStorage.getItem("open_trade_in_modal_sku");
      if (targetSku && cartProducts.length > 0) {
        // Buscar producto individual o producto perteneciente a un bundle con ese productSku
        const targetProduct =
          cartProducts.find((p) => p.sku === targetSku) ||
          cartProducts.find((p) => p.bundleInfo?.productSku === targetSku);

        const bundleApplies =
          targetProduct?.bundleInfo?.productSku === targetSku &&
          targetProduct?.bundleInfo?.ind_entre_estre === 1;
        const productApplies =
          targetProduct?.bundleInfo === undefined &&
          targetProduct?.indRetoma === 1;

        // Verificar que el producto/bundle existe y aplica para Trade-In
        if (targetProduct && (bundleApplies || productApplies)) {
          // Limpiar el flag
          localStorage.removeItem("open_trade_in_modal_sku");
          // Guardar el SKU del producto o bundle para el cual se abre el modal
          setCurrentTradeInSku(targetSku);
          // Abrir el modal para este producto específico
          setIsTradeInModalOpen(true);
          return true; // Indicar que se abrió
        } else {
          // Si no aplica o no existe, limpiar el flag de todas formas
          localStorage.removeItem("open_trade_in_modal_sku");
        }
      }
      return false;
    };

    // Intentar abrir inmediatamente si los productos ya están cargados
    if (cartProducts.length > 0) {
      const opened = checkAndOpenModal();
      // Si no se pudo abrir, intentar después de un delay
      if (!opened) {
        const timer = setTimeout(() => {
          checkAndOpenModal();
        }, 500);
        return () => clearTimeout(timer);
      }
    } else {
      // Si no hay productos aún, esperar a que se carguen
      const timer = setTimeout(() => {
        checkAndOpenModal();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [cartProducts]);

  // El canPickUp global se calcula en Step4OrderSummary con todos los productos del carrito

  // Ref para rastrear SKUs que ya fueron verificados (evita loops infinitos)
  const verifiedSkusRef = useRef<Set<string>>(new Set());
  // Ref para rastrear SKUs que fallaron (evita reintentos de peticiones fallidas)
  const failedSkusRef = useRef<Set<string>>(new Set());

  // Verificar indRetoma para cada producto único en el carrito Y para bundles
  useEffect(() => {
    if (cartProducts.length === 0) return;

    const verifyTradeIn = async () => {
      // Obtener SKUs únicos de productos individuales (sin duplicados)
      const uniqueSkus = Array.from(new Set(cartProducts.map((p) => p.sku)));

      // Obtener productSku únicos de bundles (sin duplicados)
      const uniqueBundleSkus = Array.from(
        new Set(
          cartProducts
            .filter((p) => p.bundleInfo?.productSku)
            .map((p) => p.bundleInfo!.productSku)
        )
      );

      // Filtrar productos individuales que necesitan verificación
      const productsToVerify = uniqueSkus.filter((sku) => {
        const product = cartProducts.find((p) => p.sku === sku);
        const needsVerification = product && product.indRetoma === undefined;
        const notVerifiedYet = !verifiedSkusRef.current.has(sku);
        const notFailedBefore = !failedSkusRef.current.has(sku);
        return needsVerification && notVerifiedYet && notFailedBefore;
      });

      // Filtrar bundles que necesitan verificación (usando productSku)
      const bundlesToVerify = uniqueBundleSkus.filter((productSku) => {
        // Verificar si el bundle tiene ind_entre_estre definido
        const bundleProduct = cartProducts.find(
          (p) => p.bundleInfo?.productSku === productSku
        );
        const needsVerification =
          bundleProduct &&
          bundleProduct.bundleInfo?.ind_entre_estre === undefined;
        const notVerifiedYet = !verifiedSkusRef.current.has(productSku);
        const notFailedBefore = !failedSkusRef.current.has(productSku);
        return needsVerification && notVerifiedYet && notFailedBefore;
      });

      // Combinar todos los SKUs a verificar (productos individuales + bundles)
      const allSkusToVerify = [...productsToVerify, ...bundlesToVerify];

      if (allSkusToVerify.length === 0) return;

      // Marcar productos como cargando
      setLoadingIndRetoma(new Set(allSkusToVerify));

      // Verificar cada SKU único (productos individuales y bundles)
      const results: Array<{
        sku: string;
        indRetoma: number;
        isBundle?: boolean; // Indicar si es un bundle
      } | null> = [];

      for (let i = 0; i < allSkusToVerify.length; i++) {
        const sku = allSkusToVerify[i];
        const isBundle = bundlesToVerify.includes(sku);

        // PROTECCIÓN: Verificar si este SKU ya falló antes (ANTES del delay y try)
        if (failedSkusRef.current.has(sku)) {
          console.error(
            `🚫 SKU ${sku} ya falló anteriormente. NO se reintentará para evitar sobrecargar la base de datos.`
          );
          results.push(null);
          verifiedSkusRef.current.add(sku); // Marcar como verificado para no intentar de nuevo
          setLoadingIndRetoma((prev) => {
            const newSet = new Set(prev);
            newSet.delete(sku);
            return newSet;
          });
          continue; // Saltar este SKU
        }

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        try {
          const response = await tradeInEndpoints.checkSkuForTradeIn({ sku });
          if (response.success && response.data) {
            const result = response.data;
            const indRetoma = result.indRetoma ?? (result.aplica ? 1 : 0);
            results.push({
              sku,
              indRetoma,
              isBundle,
            });

            // Si es un bundle, actualizar el bundleInfo con ind_entre_estre
            if (isBundle) {
              const storedProducts = JSON.parse(
                localStorage.getItem("cart-items") || "[]"
              ) as Array<Record<string, unknown>>;
              const updatedProducts = storedProducts.map((p) => {
                if (p.bundleInfo && (p.bundleInfo as BundleInfo).productSku === sku) {
                  return {
                    ...p,
                    bundleInfo: {
                      ...(p.bundleInfo as BundleInfo),
                      ind_entre_estre: indRetoma,
                    },
                  };
                }
                return p;
              });
              localStorage.setItem("cart-items", JSON.stringify(updatedProducts));
            }

            // Marcar SKU como verificado cuando tiene éxito
            verifiedSkusRef.current.add(sku);
            // Limpiar de fallos si existía
            failedSkusRef.current.delete(sku);
          } else {
            // Si falla la petición, marcar como fallido
            failedSkusRef.current.add(sku);
            console.error(
              `🚫 Petición falló para SKU ${sku}. NO se reintentará automáticamente para proteger la base de datos.`
            );
            results.push(null);
            // También marcar como verificado en caso de error para no reintentar infinitamente
            verifiedSkusRef.current.add(sku);
          }
        } catch (error) {
          // Si hay un error en el catch, también marcar como fallido
          failedSkusRef.current.add(sku);
          console.error(
            `🚫 Error al verificar trade-in para SKU ${sku} - Petición bloqueada para evitar sobrecargar BD:`,
            error
          );
          console.error(`🚫 SKU ${sku} NO se reintentará automáticamente.`);
          results.push(null);
          // También marcar como verificado en caso de error para no reintentar infinitamente
          verifiedSkusRef.current.add(sku);
        } finally {
          // Remover de loading cuando termine
          setLoadingIndRetoma((prev) => {
            const newSet = new Set(prev);
            newSet.delete(sku);
            return newSet;
          });
        }
      }

      // Actualizar localStorage con los resultados (solo para productos individuales, bundles ya se actualizaron arriba)
      const storedProducts = JSON.parse(
        localStorage.getItem("cart-items") || "[]"
      ) as Array<Record<string, unknown>>;
      const updatedProducts = storedProducts.map((p) => {
        // Actualizar productos individuales
        const result = results.find((r) => r && r.sku === p.sku && !r.isBundle);
        if (result) {
          return {
            ...p,
            indRetoma: result.indRetoma,
          };
        }
        return p;
      });
      localStorage.setItem("cart-items", JSON.stringify(updatedProducts));

      // Disparar evento storage para sincronizar
      const customEvent = new CustomEvent("localStorageChange", {
        detail: { key: "cart-items" },
      });
      globalThis.dispatchEvent(customEvent);
      globalThis.dispatchEvent(new Event("storage"));

      // Limpiar todos los loading después de actualizar
      setLoadingIndRetoma(new Set());
    };

    verifyTradeIn();
  }, [cartProducts, lastAddressChange]);

  // Usar cálculos del hook centralizado
  const total = calculations.total;

  // Cambiar cantidad de producto usando el hook
  const handleQuantityChange = (idx: number, cantidad: number) => {
    const product = cartProducts[idx];
    if (product) {
      // Actualizar cantidad usando el hook
      // El canPickUp global se recalculará automáticamente en Step4OrderSummary
      updateQuantity(product.sku, cantidad);

      apiPut(`/api/cart/items/${product.sku}`, {
        quantity: cantidad,
      });
    }
  };

  // Eliminar producto usando el hook
  // Esto evita el problema de actualizar el estado durante el renderizado
  const handleRemove = (idx: number) => {
    const product = cartProducts[idx];
    const productId = product?.sku;
    if (product) {
      apiDelete(`/api/cart/items/${productId}`);
      setTimeout(() => {
        removeProduct(product.sku);
      }, 0);
    }
  };

  // ...existing code...

  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = React.useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof cartProducts;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Estado para mostrar skeleton del mensaje de error inicialmente
  const [showErrorSkeleton, setShowErrorSkeleton] = React.useState(false);

  // Validar Trade-In cuando cambian los productos o el trade-in
  React.useEffect(() => {
    const validation = validateTradeInProducts(cartProducts);
    setTradeInValidation(validation);

    // Si el producto ya no aplica (indRetoma === 0), quitar banner inmediatamente y mostrar notificación
    if (
      validation.isValid === false &&
      validation.errorMessage !== undefined &&
      validation.errorMessage.includes("Te removimos")
    ) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");

      // Quitar el banner inmediatamente
      setTradeInData({});

      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description:
          "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    } else {
      setShowErrorSkeleton(false);
    }
  }, [cartProducts, tradeInData]);

  // Estado para saber si canPickUp global está cargando
  const [isLoadingCanPickUpGlobal, setIsLoadingCanPickUpGlobal] =
    React.useState(false);

  // Callback para recibir el estado de canPickUp desde Step4OrderSummary
  // Solo actualiza el estado, el avance automático se maneja en Step4OrderSummary
  const handleCanPickUpReady = React.useCallback(
    (isReady: boolean, isLoading: boolean) => {
      setIsLoadingCanPickUpGlobal(isLoading);
      // El avance automático ahora se maneja en Step4OrderSummary con userClickedWhileLoading
    },
    []
  );

  // Función para manejar el click en continuar pago
  const handleContinue = async () => {
    if (cartProducts.length === 0) {
      return;
    }

    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(cartProducts);
    if (!validation.isValid) {
      const message = getTradeInValidationMessage(validation);
      alert(message);
      return;
    }

    // IMPORTANTE: Si canPickUp global está cargando, la nueva lógica en Step4OrderSummary
    // se encargará de avanzar automáticamente cuando termine (usando userClickedWhileLoading)
    // Solo necesitamos esperar si ya terminó de cargar
    if (isLoadingCanPickUpGlobal) {
      // No hacer nada aquí, dejar que Step4OrderSummary maneje el avance automático
      return;
    }

    // Si ya se calculó o no está cargando, continuar normalmente
    trackBeginCheckout(
      cartProducts.map((p) => ({
        item_id: p.sku,
        item_name: p.name,
        price: Number(p.price),
        quantity: p.quantity,
      })),
      total
    );

    onContinue();
  };

  // UX: feedback visual al agregar sugerencia usando el hook centralizado
  const handleAddSugerencia = async (producto: ProductApiData) => {
    try {
      // Mapear ProductApiData a CartProduct
      const cartProduct = {
        id: producto.codigoMarketBase,
        name: producto.desDetallada[0] || producto.nombreMarket?.[0] || "",
        image: getCloudinaryUrl(producto.imagePreviewUrl[0], "catalog"),
        price: producto.precioeccommerce[0] || producto.precioNormal[0],
        sku: producto.sku[0] || "",
        ean: producto.ean[0] || "",
        desDetallada:
          producto.desDetallada[0] || producto.nombreMarket?.[0] || "",
        modelo: producto.modelo?.[0] || "",
        categoria: producto.categoria || "",
      };

      // Agregar al carrito
      await addProduct(cartProduct, 1);
    } catch (error) {
      console.error("Error al agregar producto sugerido:", error);
    }
  };

  // Handler para remover plan de Trade-In (usado en el banner mobile)
  // Handler para remover plan de Trade-In (usado en el banner mobile)
  const handleRemoveTradeIn = (skuToRemove: string) => {
    setTradeInData(prev => {
      const newState = { ...prev };
      delete newState[skuToRemove];
      return newState;
    });

    // Actualizar localStorage
    try {
      const stored = localStorage.getItem("imagiq_trade_in");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          const newStored = { ...parsed };
          delete newStored[skuToRemove];
          if (Object.keys(newStored).length === 0) {
            localStorage.removeItem("imagiq_trade_in");
          } else {
            localStorage.setItem("imagiq_trade_in", JSON.stringify(newStored));
          }
        }
      }
    } catch (e) {
      console.error("Error removing trade-in from storage", e);
    }

    // FORZAR cambio a "domicilio" si el método está en "tienda" (sin importar si está autenticado o no)
    if (typeof globalThis.window !== "undefined") {
      const currentMethod = globalThis.window.localStorage.getItem(
        "checkout-delivery-method"
      );
      if (currentMethod === "tienda") {
        // Forzar cambio inmediatamente
        globalThis.window.localStorage.setItem(
          "checkout-delivery-method",
          "domicilio"
        );
        globalThis.window.dispatchEvent(
          new CustomEvent("delivery-method-changed", {
            detail: { method: "domicilio" },
          })
        );
        globalThis.window.dispatchEvent(new Event("storage"));
        console.log(
          "✅ Método de entrega cambiado a 'domicilio' después de eliminar trade-in"
        );
      }
    }

    // Si el producto aplica (indRetoma === 1), mostrar el banner guía SIEMPRE
    // Sin importar canPickUp o si el usuario está logueado
    // Limpiar caches de verificación para este SKU para forzar un chequeo fresco
    verifiedSkusRef.current.delete(skuToRemove);
    failedSkusRef.current.delete(skuToRemove);

    // Si el SKU eliminado es el que se estaba editando, limpiarlo
    if (currentTradeInSku === skuToRemove) {
      setCurrentTradeInSku(null);
    }

    // Forzar re-verificación actualizando el timestamp
    setLastAddressChange(Date.now());

    // Si el producto aplica (indRetoma === 1), mostrar el banner guía SIEMPRE
    // Sin importar canPickUp o si el usuario está logueado
    const product = cartProducts.find(p => p.sku === skuToRemove);
    if (product && product.indRetoma === 1) {
      // Mostrar banner siempre si el producto tiene indRetoma === 1
      setTradeInData(prev => ({
        ...prev,
        [skuToRemove]: {
          deviceName: product.name,
          value: 0,
          completed: false, // No está completado, solo es una guía
        }
      }));
    }
  };

  // Handler para abrir el modal de Trade-In
  const handleOpenTradeInModal = () => {
    setIsTradeInModalOpen(true);
  };

  // Handler para cuando se completa el Trade-In
  const handleCompleteTradeIn = (deviceName: string, value: number) => {
    // IMPORTANTE: Guardar el trade-in asociado al SKU específico
    if (!currentTradeInSku) {
      console.error("❌ No hay SKU seleccionado para guardar el trade-in");
      return;
    }

    try {
      // Cargar trade-ins existentes
      const raw = localStorage.getItem("imagiq_trade_in");
      let tradeIns: Record<string, { deviceName: string; value: number; completed: boolean; detalles?: unknown }> = {};

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          // Si es el formato antiguo (objeto único), convertirlo al nuevo formato
          if (parsed?.deviceName && typeof parsed === 'object' && !Array.isArray(parsed)) {
            // Formato antiguo detectado, no hacer nada por ahora
            tradeIns = {};
          } else if (typeof parsed === 'object') {
            // Formato nuevo (objeto con SKUs como claves)
            tradeIns = parsed as Record<string, { deviceName: string; value: number; completed: boolean; detalles?: unknown }>;
          }
        } catch (parseError) {
          console.error("❌ Error al parsear trade-ins:", parseError);
        }
      }

      // Agregar/actualizar el trade-in para este SKU
      tradeIns[currentTradeInSku] = {
        deviceName,
        value,
        completed: true,
      };

      // FORZAR guardado en localStorage como respaldo (el modal también guarda, pero esto asegura persistencia)
      // IMPORTANTE: El modal guarda con 'detalles', así que intentamos preservar esos detalles
      try {
        const existingRaw = localStorage.getItem("imagiq_trade_in");
        if (existingRaw) {
          try {
            const existing = JSON.parse(existingRaw);
            // Si ya existe un trade-in para este SKU con detalles, preservarlos
            if (existing[currentTradeInSku] && existing[currentTradeInSku].detalles) {
              tradeIns[currentTradeInSku] = {
                ...tradeIns[currentTradeInSku],
                detalles: existing[currentTradeInSku].detalles as unknown,
              };
            }
          } catch {
            // Ignorar errores de parseo
          }
        }
        
        const tradeInString = JSON.stringify(tradeIns);
        localStorage.setItem("imagiq_trade_in", tradeInString);
        
        // Verificar que se guardó correctamente
        const verifySave = localStorage.getItem("imagiq_trade_in");
        if (!verifySave || verifySave !== tradeInString) {
          console.error("❌ ERROR: Trade-In NO se guardó correctamente en Step1");
          // Reintentar
          localStorage.setItem("imagiq_trade_in", tradeInString);
        } else {
          console.log("✅ Trade-In guardado correctamente en Step1 para SKU:", currentTradeInSku);
        }
        
        // Disparar eventos de storage para sincronizar
        try {
          globalThis.dispatchEvent(new CustomEvent("localStorageChange", {
            detail: { key: "imagiq_trade_in" },
          }));
          globalThis.dispatchEvent(new Event("storage"));
        } catch (eventError) {
          console.error("Error disparando eventos de storage:", eventError);
        }
      } catch (backupError) {
        console.error("❌ Error en guardado de respaldo en Step1:", backupError);
      }

      // Actualizar el estado
      setTradeInData(prev => ({
        ...prev,
        [currentTradeInSku]: {
          deviceName,
          value,
          completed: true,
        }
      }));
    } catch (error) {
      console.error("❌ Error al guardar trade-in:", error);
    }
    setIsTradeInModalOpen(false);
  };

  // Handler para cancelar sin completar
  const handleCancelWithoutCompletion = () => {
    setIsTradeInModalOpen(false);
  };

  // Verificar si el usuario está logueado (se recalcula en cada render para estar actualizado)
  const user = safeGetLocalStorage<{
    id?: string;
    user_id?: string;
    email?: string;
  }>("imagiq_user", {});
  const isUserLoggedIn = !!(user?.id || user?.user_id || user?.email);



  return (
    <main className="min-h-screen py-2 md:py-8 px-2 md:px-0 pb-40 md:pb-8">
      {/* Grid principal: productos y resumen de compra */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Productos */}
        <section id="carrito-productos" className="p-0">

          {cartProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-16 text-lg">
              No hay productos en el carrito.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bundles agrupados */}
              {bundleGroups.map((group) => {
                // Obtener datos de Trade-In para el bundle usando el productSku
                const bundleTradeInData = tradeInData[group.bundleInfo.productSku] || null;
                // Obtener shippingCity del primer producto del bundle
                const bundleShippingCity = group.items[0]?.shippingCity;
                // Verificar canPickUp del primer producto
                const bundleCanPickUp = group.items[0]?.canPickUp;
                const showCanPickUpMessage = isUserLoggedIn && bundleCanPickUp === false;

                return (
                  <CartBundleGroup
                    key={`${group.bundleInfo.codCampana}-${group.bundleInfo.productSku}`}
                    bundleInfo={group.bundleInfo}
                    items={group.items}
                    onUpdateQuantity={updateBundleQuantity}
                    onRemoveProduct={removeBundleProduct}
                    formatPrice={formatPrice}
                    tradeInData={bundleTradeInData}
                    onOpenTradeInModal={() => {
                      setCurrentTradeInSku(group.bundleInfo.productSku);
                      handleOpenTradeInModal();
                    }}
                    onRemoveTradeIn={() => handleRemoveTradeIn(group.bundleInfo.productSku)}
                    shippingCity={bundleShippingCity}
                    showCanPickUpMessage={showCanPickUpMessage}
                  />
                );
              })}

              {/* Productos individuales (sin bundle) */}
              {nonBundleProducts.length > 0 && (
                <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200 divide-y divide-gray-200">
                  {nonBundleProducts.map((product) => {
                    const idx = cartProducts.findIndex((p) => p.sku === product.sku);
                    // Obtener datos de Trade-In para este producto específico
                    const productTradeInData = tradeInData[product.sku] || null;

                    return (
                      <ProductCard
                        key={product.sku}
                        nombre={product.name}
                        imagen={product.image}
                        precio={product.price}
                        precioOriginal={product.originalPrice}
                        cantidad={product.quantity}
                        stock={product.stock}
                        shippingCity={product.shippingCity}
                        shippingStore={product.shippingStore}
                        color={product.color}
                        colorName={product.colorName}
                        capacity={product.capacity}
                        ram={product.ram}
                        desDetallada={product.desDetallada}
                        isLoadingShippingInfo={
                          loadingShippingInfo[product.sku] || false
                        }
                        isLoadingIndRetoma={loadingIndRetoma.has(product.sku)}
                        indRetoma={product.indRetoma}
                        onQuantityChange={(cantidad) =>
                          handleQuantityChange(idx, cantidad)
                        }
                        onRemove={() => handleRemove(idx)}
                        onOpenTradeInModal={() => {
                          setCurrentTradeInSku(product.sku);
                          handleOpenTradeInModal();
                        }}
                        onRemoveTradeIn={() => handleRemoveTradeIn(product.sku)}
                        tradeInData={productTradeInData}
                      />
                    );
                  })}
                </div>
              )}


            </div>
          )}
        </section>
        {/* Resumen de compra - Solo Desktop */}
        <aside className="hidden md:block space-y-4">
          <Step4OrderSummary
            onFinishPayment={() => {
              // Validar Trade-In antes de continuar
              const validation = validateTradeInProducts(cartProducts);
              if (!validation.isValid) {
                const message = getTradeInValidationMessage(validation);
                alert(message);
                return;
              }

              // Track del evento begin_checkout para analytics
              trackBeginCheckout(
                cartProducts.map((p) => ({
                  item_id: p.sku,
                  item_name: p.name,
                  price: Number(p.price),
                  quantity: p.quantity,
                })),
                total
              );

              onContinue();
            }}
            buttonText="Continuar pago"
            disabled={cartProducts.length === 0 || !tradeInValidation.isValid}
            isSticky={false}
            isStep1={true}
            onCanPickUpReady={handleCanPickUpReady}
            shouldCalculateCanPickUp={true}
            products={cartProducts}
            calculations={calculations}
          />
        </aside>
      </div>
      {/* Sugerencias: fila completa debajo del grid principal */}
      <div className="max-w-6xl mx-auto mt-4 mb-4 md:mb-0">
        <Sugerencias onAdd={handleAddSugerencia} cartProducts={cartProducts} />
      </div>

      {/* Sticky Bottom Bar - Solo Mobile */}
      {cartProducts.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="p-4">
            {/* Resumen compacto */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">
                  Total ({cartProducts.reduce((acc, p) => acc + p.quantity, 0)}{" "}
                  productos)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  $ {Number(total).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setShowCouponModal(true)}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium underline cursor-pointer"
              >
                Cupón
              </button>
            </div>

            {/* Botón continuar */}
            <button
              className={`w-full font-bold py-3 rounded-lg text-base transition text-white ${!tradeInValidation.isValid || isLoadingCanPickUpGlobal
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-[#222] hover:bg-[#333] cursor-pointer"
                }`}
              onClick={handleContinue}
              disabled={!tradeInValidation.isValid || isLoadingCanPickUpGlobal}
            >
              {isLoadingCanPickUpGlobal ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Verificando...
                </span>
              ) : (
                "Continuar pago"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Trade-In */}
      {isTradeInModalOpen && (
        <TradeInModal
          isOpen={isTradeInModalOpen}
          onClose={() => setIsTradeInModalOpen(false)}
          onContinue={() => setIsTradeInModalOpen(false)}
          onCancelWithoutCompletion={handleCancelWithoutCompletion}
          onCompleteTradeIn={handleCompleteTradeIn}
          productSku={currentTradeInSku}
        />
      )}

      {/* Modal de Cupón */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-md md:rounded-lg rounded-t-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold">Agregar cupón</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <input
                type="text"
                placeholder="Código de cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => {
                  // Aquí iría la lógica para aplicar el cupón
                  alert(`Cupón "${couponCode}" aplicado`);
                  setShowCouponModal(false);
                  setCouponCode("");
                }}
                className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg transition cursor-pointer"
              >
                Aplicar cupón
              </button>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}
