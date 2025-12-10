"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartProduct, type BundleInfo } from "@/hooks/useCart";
import { useDelivery } from "./hooks/useDelivery";
import {
  DeliveryMethodSelector,
  StorePickupSelector,
  AddressSelector,
  StoreSelector,
} from "./components";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import type { Address } from "@/types/address";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { tradeInEndpoints } from "@/lib/api";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";
import { toast } from "sonner";
import { useCardsCache } from "./hooks/useCardsCache";
import { useAuthContext } from "@/features/auth/context";
import { syncAddress } from "@/lib/addressSync";
import { safeGetLocalStorage } from "@/lib/localStorage";

export default function Step3({
  onBack,
  onContinue,
}: {
  readonly onBack?: () => void;
  readonly onContinue?: () => void;
}) {
  const router = useRouter();
  const { products, calculations } = useCart();
  const { trackAddPaymentInfo } = useAnalyticsWithUser();
  const { user, login } = useAuthContext();
  // OPTIMIZACIÓN: Step3 SOLO lee del caché por defecto
  // Si viene de Step1 o Step2, usa el caché ya calculado
  // Solo recalcula candidate stores si cambia la dirección
  const {
    address,
    setAddress,
    addressEdit,
    setAddressEdit,
    storeEdit,
    setStoreEdit,
    storeQuery,
    setStoreQuery,
    filteredStores,
    selectedStore,
    setSelectedStore,
    addresses,
    addAddress,
    deliveryMethod,
    setDeliveryMethod,
    canContinue,
    storesLoading,
    canPickUp,
    stores,
    forceRefreshStores,
    addressLoading,
    availableCities,
    availableStoresWhenCanPickUpFalse,
    lastResponse,
  } = useDelivery({
    canFetchFromEndpoint: true, // Permitir llamadas cuando cambia dirección
    onlyReadCache: true, // Por defecto solo leer del caché (si viene de paso anterior)
  });

  // Hook para precarga de tarjetas y zero interest
  const { preloadCards, preloadZeroInterest } = useCardsCache();

  // Precargar tarjetas y zero interest en segundo plano al entrar al Step3
  React.useEffect(() => {
    const preloadData = async () => {
      // Primero precargar las tarjetas
      await preloadCards();

      // Luego precargar zero interest si hay productos en el carrito
      if (products.length > 0) {
        // Obtener las tarjetas del caché para usarlas en la precarga
        const storedUser = localStorage.getItem("imagiq_user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user?.id) {
              // Hacer la petición de tarjetas para obtener los IDs
              const { profileService } = await import("@/services/profile.service");
              const { encryptionService } = await import("@/lib/encryption");
              const encryptedCards = await profileService.getUserPaymentMethodsEncrypted(user.id);

              const cardIds = encryptedCards
                .map((encCard) => {
                  const decrypted = encryptionService.decryptJSON<{ cardId: string }>(encCard.encryptedData);
                  return decrypted?.cardId;
                })
                .filter((id): id is string => id !== undefined);

              if (cardIds.length > 0) {
                await preloadZeroInterest(
                  cardIds,
                  products.map((p) => p.sku),
                  calculations.total
                );
              }
            }
          } catch (error) {
            console.error("Error en precarga de zero interest:", error);
          }
        }
      }
    };

    preloadData();
  }, [preloadCards, preloadZeroInterest, products, calculations.total]);

  // Trade-In state management - ahora soporta múltiples productos
  // Inicialización perezosa para evitar parpadeos y asegurar estado correcto desde el inicio
  const [tradeInDataMap, setTradeInDataMap] = React.useState<Record<string, {
    completed: boolean;
    deviceName: string;
    value: number;
  }>>(() => {
    if (typeof window === 'undefined') return {};

    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const parsed = JSON.parse(storedTradeIn);
        // Verificar si es formato nuevo (map) o antiguo (objeto único)
        if (typeof parsed === 'object' && !parsed.deviceName) {
          return parsed;
        } else if (parsed.completed) {
          // Formato antiguo: intentar mapear al primer producto (limitación conocida pero segura)
          // En este punto products podría estar vacío, pero es mejor tener algo que nada
          return { "legacy_tradein": parsed };
        }
      } catch (error) {
        console.error("Error parsing Trade-In data:", error);
      }
    }
    return {};
  });

  // Helpers para obtener el trade-in asociado a un producto (considera bundles)
  const getTradeInKey = React.useCallback((product: CartProduct) => {
    return product.bundleInfo?.productSku ?? product.sku;
  }, []);

  const getTradeInEntry = React.useCallback(
    (product: CartProduct) => {
      if (!product) return null;
      const key = getTradeInKey(product);
      if (!key) return null;
      const tradeIn = tradeInDataMap[key];
      return tradeIn ? { key, tradeIn } : null;
    },
    [tradeInDataMap, getTradeInKey]
  );

  const getTradeInForProduct = React.useCallback(
    (product: CartProduct) => getTradeInEntry(product)?.tradeIn,
    [getTradeInEntry]
  );

  // Ref para rastrear si acabamos de eliminar el trade-in (evita que useEffect revierta el cambio)
  const justRemovedTradeInRef = React.useRef(false);

  // Efecto para corregir el formato legacy una vez que los productos estén cargados
  React.useEffect(() => {
    if (products.length > 0 && tradeInDataMap["legacy_tradein"]) {
      const legacyData = tradeInDataMap["legacy_tradein"];
      const firstProductSku = products[0].sku;
      const newMap = { [firstProductSku]: legacyData };
      setTradeInDataMap(newMap);
      // Actualizar localStorage con el formato correcto
      const tradeInString = JSON.stringify(newMap);
      localStorage.setItem("imagiq_trade_in", tradeInString);
      
      // Verificar que se guardó correctamente
      const verifySave = localStorage.getItem("imagiq_trade_in");
      if (!verifySave || verifySave !== tradeInString) {
        console.error("❌ ERROR: Trade-In NO se guardó correctamente en Step3 (conversión formato)");
        localStorage.setItem("imagiq_trade_in", tradeInString);
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
    }
  }, [products, tradeInDataMap]);

  // Ref para rastrear si ya se hizo la carga inicial (para bloquear otros useEffects)
  const hasCompletedInitialLoadRef = React.useRef(false);

  // Marcar como completado después de un breve delay para permitir que useDelivery haga su trabajo
  React.useEffect(() => {
    const timer = setTimeout(() => {
      hasCompletedInitialLoadRef.current = true;
    }, 1000); // 1 segundo es suficiente para que useDelivery complete la carga inicial

    return () => clearTimeout(timer);
  }, []);

  // IMPORTANTE: Validar que haya dirección al cargar Step3, si no hay, redirigir a Step2
  React.useEffect(() => {
    // Esperar un momento para que useDelivery cargue la dirección
    const checkAddress = setTimeout(() => {
      // Verificar si hay dirección en localStorage
      const savedAddress = safeGetLocalStorage<Address | null>(
        "checkout-address",
        null
      );
      
      // Si no hay dirección guardada y el método de entrega es domicilio, redirigir a Step2
      if (!savedAddress && deliveryMethod === "domicilio") {
        console.log("⚠️ No hay dirección seleccionada, redirigiendo a Step2");
        toast.error("Por favor selecciona una dirección para continuar");
        router.push("/carrito/step2");
        return;
      }
      
      // También verificar el estado de address del hook useDelivery
      // Si después de cargar no hay dirección y el método es domicilio, redirigir
      if (!address && deliveryMethod === "domicilio" && hasCompletedInitialLoadRef.current) {
        console.log("⚠️ No hay dirección en useDelivery, redirigiendo a Step2");
        toast.error("Por favor selecciona una dirección para continuar");
        router.push("/carrito/step2");
      }
    }, 1500); // Esperar 1.5 segundos para que useDelivery complete la carga

    return () => clearTimeout(checkAddress);
  }, [address, deliveryMethod, router]);


  // Handle Trade-In removal (ahora soporta eliminar por SKU)
  const handleRemoveTradeIn = (skuToRemove?: string) => {
    // Marcar que acabamos de eliminar el trade-in (evitar que useEffect revierta el cambio)
    justRemovedTradeInRef.current = true;

    // IMPORTANTE: Desactivar skeleton inmediatamente al eliminar trade-in
    // No debe mostrarse skeleton cuando solo se elimina trade-in
    setIsInitialTradeInLoading(false);

    // Marcar en useDelivery que estamos eliminando trade-in (previene fetchCandidateStores)
    if (globalThis.window) {
      globalThis.window.dispatchEvent(
        new CustomEvent("removing-trade-in", { detail: { removing: true } })
      );
    }

    // PRIMERO: Eliminar el trade-in del map
    if (skuToRemove) {
      // Eliminar solo el SKU específico
      const updatedMap = { ...tradeInDataMap };
      delete updatedMap[skuToRemove];
      setTradeInDataMap(updatedMap);

      // Actualizar localStorage
      if (Object.keys(updatedMap).length > 0) {
        const tradeInString = JSON.stringify(updatedMap);
        localStorage.setItem("imagiq_trade_in", tradeInString);
        
        // Verificar que se guardó correctamente
        const verifySave = localStorage.getItem("imagiq_trade_in");
        if (!verifySave || verifySave !== tradeInString) {
          console.error("❌ ERROR: Trade-In NO se guardó correctamente en Step3 (remove)");
          localStorage.setItem("imagiq_trade_in", tradeInString);
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
        localStorage.removeItem("imagiq_trade_in");
        
        // Disparar eventos de storage
        try {
          globalThis.dispatchEvent(new CustomEvent("localStorageChange", {
            detail: { key: "imagiq_trade_in" },
          }));
          globalThis.dispatchEvent(new Event("storage"));
        } catch (eventError) {
          console.error("Error disparando eventos de storage:", eventError);
        }
      }
    } else {
      // Eliminar todos los trade-ins
      localStorage.removeItem("imagiq_trade_in");
      setTradeInDataMap({});
    }

    // SEGUNDO: Forzar cambio a "domicilio" solo si NO quedan trade-ins activos
    const remainingTradeIns = skuToRemove
      ? Object.keys(tradeInDataMap).filter(k => k !== skuToRemove).length
      : 0;

    if (remainingTradeIns === 0) {
      const currentMethodFromStorage = globalThis.window?.localStorage.getItem("checkout-delivery-method");
      const currentMethod = currentMethodFromStorage || deliveryMethod;

      if (currentMethod === "tienda" || deliveryMethod === "tienda") {
        if (globalThis.window) {
          globalThis.window.localStorage.setItem("checkout-delivery-method", "domicilio");
        }
        setDeliveryMethod("domicilio");

        if (globalThis.window) {
          globalThis.window.dispatchEvent(
            new CustomEvent("delivery-method-changed", { detail: { method: "domicilio", skipFetch: true } })
          );
        }
      }
    }

    // Resetear los flags
    setTimeout(() => {
      justRemovedTradeInRef.current = false;
      if (globalThis.window) {
        globalThis.window.dispatchEvent(
          new CustomEvent("removing-trade-in", { detail: { removing: false } })
        );
      }
    }, 3000);
  };

  // IMPORTANTE: Detectar productos con trade-in activo
  const productsWithTradeIn = React.useMemo(() => {
    const seenKeys = new Set<string>();
    return products.filter((p) => {
      const entry = getTradeInEntry(p);
      if (!entry?.tradeIn?.completed) return false;
      if (seenKeys.has(entry.key)) return false;
      seenKeys.add(entry.key);
      return true;
    });
  }, [products, getTradeInEntry]);

  const hasActiveTradeIn = productsWithTradeIn.length > 0;

  // DEBUG: Log para verificar el estado de hasActiveTradeIn
  React.useEffect(() => {
    console.log('🔍 DEBUG hasActiveTradeIn:', {
      hasActiveTradeIn,
      productsWithTradeInCount: productsWithTradeIn.length,
      productsWithTradeIn: productsWithTradeIn.map(p => p.sku),
      totalProducts: products.length,
    });
  }, [hasActiveTradeIn, productsWithTradeIn, products]);


  // Verificar si TODOS los productos con trade-in pueden ser recogidos en tienda
  const canAllTradeInProductsPickUp = React.useMemo(() => {
    if (productsWithTradeIn.length === 0) return true;

    return productsWithTradeIn.every(p => p.canPickUp !== false);
  }, [productsWithTradeIn]);

  // Estado para recibir canPickUp global desde Step4OrderSummary (fuente de verdad)
  const [globalCanPickUpFromSummary, setGlobalCanPickUpFromSummary] = React.useState<boolean | null>(null);

  // Estado para rastrear si canPickUp está cargando
  const [isLoadingCanPickUp, setIsLoadingCanPickUp] = React.useState(true);

  // Ref para rastrear si ya se cargó el pickup por primera vez
  const hasLoadedPickupOnceRef = React.useRef(false);

  // Ref para rastrear el último valor de canPickUp para el que ya se forzó la recarga
  const lastCanPickUpForcedRef = React.useRef<boolean | undefined | null>(null);

  // Ref para rastrear la última dirección para detectar cambios
  const lastAddressIdRef = React.useRef<string | null>(null);

  // Estado para forzar mostrar skeleton cuando cambia la dirección
  const [isRecalculatingPickup, setIsRecalculatingPickup] = React.useState(false);

  // Estado para mostrar skeleton en la primera carga con trade-in
  // Inicializar en true si hay trade-in activo para evitar flash de contenido
  const [isInitialTradeInLoading, setIsInitialTradeInLoading] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    // Verificar si hay trade-in en localStorage directamente
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    return !!storedTradeIn;
  });

  // Refs para leer valores actuales sin incluirlos en dependencias
  const storesLengthRef = React.useRef(0);
  const availableStoresWhenCanPickUpFalseLengthRef = React.useRef(0);

  // Actualizar refs cuando cambian los valores
  React.useEffect(() => {
    storesLengthRef.current = stores.length;
  }, [stores.length]);

  React.useEffect(() => {
    availableStoresWhenCanPickUpFalseLengthRef.current = availableStoresWhenCanPickUpFalse.length;
  }, [availableStoresWhenCanPickUpFalse.length]);

  // Usar canPickUp global de Step4OrderSummary si está disponible, sino usar el de useDelivery
  // El globalCanPickUpFromSummary es la fuente de verdad (es el que se muestra en el debug)
  const effectiveCanPickUp = globalCanPickUpFromSummary ?? canPickUp;

  // Verificar si tenemos el valor de canPickUp (no es null)
  const hasCanPickUpValue = globalCanPickUpFromSummary !== null || canPickUp !== null;

  // Verificar si algún producto tiene canPickUp: false
  // PERO solo aplicar esta lógica si NO hay trade-in activo
  const hasProductWithoutPickup = !hasActiveTradeIn && products.some(
    (product) => product.canPickUp === false
  );

  // Si hay productos sin pickup y el método está en tienda, cambiar a domicilio
  // SOLO si NO hay trade-in activo
  // IMPORTANTE: NO forzar cambio si effectiveCanPickUp global es true
  React.useEffect(() => {
    // Si effectiveCanPickUp global es true, SIEMPRE permitir seleccionar tienda
    // El canPickUp global tiene prioridad sobre el canPickUp individual de cada producto
    if (effectiveCanPickUp === true) {
      console.log('✅ canPickUp global es true - permitir tienda independientemente de productos individuales');
      return;
    }

    if (!hasActiveTradeIn && hasProductWithoutPickup && deliveryMethod === "tienda") {
      console.log('⚠️ Hay productos sin pickup y método es tienda - cambiando a domicilio');
      // setDeliveryMethod ya guarda automáticamente en localStorage
      setDeliveryMethod("domicilio");
    }
  }, [hasActiveTradeIn, hasProductWithoutPickup, deliveryMethod, setDeliveryMethod, effectiveCanPickUp]);

  // Ref para rastrear si ya cargamos tiendas para el trade-in actual (evita loops)
  const tradeInStoresLoadedRef = React.useRef(false);

  // Resetear el ref cuando se elimina el trade-in
  React.useEffect(() => {
    if (!hasActiveTradeIn) {
      tradeInStoresLoadedRef.current = false;
    }
  }, [hasActiveTradeIn]);

  // Forzar método de entrega a "tienda" si hay trade-in activo
  // IMPORTANTE: NO ejecutar si acabamos de eliminar el trade-in (evitar revertir el cambio)
  React.useEffect(() => {
    // BLOQUEAR durante carga inicial - solo el primer useEffect debe llamar al endpoint
    if (!hasCompletedInitialLoadRef.current) {
      return;
    }

    // Si acabamos de eliminar el trade-in, NO hacer nada
    if (justRemovedTradeInRef.current) {
      return;
    }

    // Si hay trade-in activo, SIEMPRE forzar "tienda" (sin importar disponibilidad)
    if (hasActiveTradeIn) {
      // Forzar cambio a tienda si está en domicilio
      if (deliveryMethod === "domicilio") {
        setDeliveryMethod("tienda");
      }
      // También prevenir que se cambie a domicilio desde localStorage
      const savedMethod = globalThis.window?.localStorage.getItem("checkout-delivery-method");
      if (savedMethod === "domicilio") {
        setDeliveryMethod("tienda");
      }

      // Cargar tiendas si es necesario (después de la carga inicial)
      // IMPORTANTE: forceRefreshStores ahora lee del caché primero, así que no activamos skeleton aquí
      // Solo se activará skeleton si realmente no hay datos en caché
      const hasStoresLoaded = stores.length > 0 || availableStoresWhenCanPickUpFalse.length > 0;

      if ((deliveryMethod === "tienda" || savedMethod === "tienda") &&
        !storesLoading &&
        !isInitialTradeInLoading &&
        !tradeInStoresLoadedRef.current &&
        !hasStoresLoaded) {

        console.log('🔄 Trade-in activo: verificando caché antes de cargar tiendas');
        tradeInStoresLoadedRef.current = true;
        // NO activar isInitialTradeInLoading aquí - forceRefreshStores lo manejará si es necesario
        // Si hay datos en caché, forceRefreshStores los usará inmediatamente sin skeleton
        forceRefreshStores();
      }
    }
  }, [hasActiveTradeIn, deliveryMethod, setDeliveryMethod, storesLoading, forceRefreshStores, isInitialTradeInLoading, stores.length, availableStoresWhenCanPickUpFalse.length]);

  // Ref para rastrear SKUs que ya fueron verificados (evita loops infinitos)
  const verifiedSkusRef = React.useRef<Set<string>>(new Set());
  // Ref para rastrear SKUs que fallaron (evita reintentos de peticiones fallidas)
  const failedSkusRef = React.useRef<Set<string>>(new Set());

  // Función auxiliar para verificar si un SKU necesita verificación (solo productos individuales)
  const shouldVerifySku = React.useCallback((sku: string, productList: typeof products): boolean => {
    const product = productList.find((p) => p.sku === sku);
    // Solo productos sin bundleInfo y sin indRetoma definido
    const needsVerification = Boolean(
      product && 
      !product.bundleInfo && 
      product.indRetoma === undefined
    );
    const notVerifiedYet = !verifiedSkusRef.current.has(sku);
    const notFailedBefore = !failedSkusRef.current.has(sku);
    return needsVerification && notVerifiedYet && notFailedBefore;
  }, []);

  // Función auxiliar para actualizar localStorage con el resultado de trade-in
  const updateProductIndRetoma = React.useCallback((sku: string, indRetoma: number, isBundle: boolean = false) => {
    const storedProducts = JSON.parse(
      localStorage.getItem("cart-items") || "[]"
    ) as Array<Record<string, unknown>>;

    if (isBundle) {
      // Si es bundle, actualizar bundleInfo.ind_entre_estre
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
    } else {
      // Si es producto normal, actualizar indRetoma
      const updatedProducts = storedProducts.map((p) => {
        if (p.sku === sku) {
          return { ...p, indRetoma };
        }
        return p;
      });
      localStorage.setItem("cart-items", JSON.stringify(updatedProducts));
    }

    // Disparar evento storage para sincronizar
    const customEvent = new CustomEvent("localStorageChange", {
      detail: { key: "cart-items" },
    });
    globalThis.dispatchEvent(customEvent);
    globalThis.dispatchEvent(new Event("storage"));
  }, []);

  // Función auxiliar para procesar un SKU individual
  const processSkuVerification = React.useCallback(async (sku: string, isBundle: boolean = false) => {
    // PROTECCIÓN: Verificar si este SKU ya falló antes
    if (failedSkusRef.current.has(sku)) {
      console.error(`🚫 SKU ${sku} ya falló anteriormente. NO se reintentará para evitar sobrecargar la base de datos.`);
      verifiedSkusRef.current.add(sku);
      return;
    }

    try {
      // Para bundles, usar productSku; para productos normales, usar sku
      const skuToCheck = isBundle ? sku : sku; // sku ya es productSku si es bundle
      const response = await tradeInEndpoints.checkSkuForTradeIn({ sku: skuToCheck });
      if (!response.success || !response.data) {
        failedSkusRef.current.add(sku);
        console.error(`🚫 Petición falló para SKU ${skuToCheck}. NO se reintentará automáticamente para proteger la base de datos.`);
        verifiedSkusRef.current.add(sku);
        return;
      }

      const result = response.data;
      const indRetoma = result.indRetoma ?? (result.aplica ? 1 : 0);

      // Marcar SKU como verificado ANTES de actualizar localStorage (evita loop)
      verifiedSkusRef.current.add(sku);
      failedSkusRef.current.delete(sku);

      updateProductIndRetoma(sku, indRetoma, isBundle);
    } catch (error) {
      failedSkusRef.current.add(sku);
      console.error(
        `🚫 Error al verificar trade-in para SKU ${sku} - Petición bloqueada para evitar sobrecargar BD:`,
        error
      );
      console.error(`🚫 SKU ${sku} NO se reintentará automáticamente.`);
      verifiedSkusRef.current.add(sku);
    }
  }, [updateProductIndRetoma]);

  // Verificar indRetoma para cada producto único en segundo plano (sin mostrar nada en UI)
  React.useEffect(() => {
    if (products.length === 0) return;

    const verifyTradeIn = async () => {
      // Obtener SKUs únicos de productos individuales (sin duplicados)
      const uniqueSkus = Array.from(
        new Set(products.map((p) => p.sku))
      );

      // Obtener productSku únicos de bundles (sin duplicados)
      const uniqueBundleSkus = Array.from(
        new Set(
          products
            .filter((p) => p.bundleInfo?.productSku)
            .map((p) => p.bundleInfo!.productSku)
        )
      );

      // Filtrar productos individuales que necesitan verificación
      const productsToVerify = uniqueSkus.filter((sku) => shouldVerifySku(sku, products));

      // Filtrar bundles que necesitan verificación (usando productSku)
      const bundlesToVerify = uniqueBundleSkus.filter((productSku) => {
        const bundleProduct = products.find(
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
      const allSkusToVerify = [
        ...productsToVerify.map((sku) => ({ sku, isBundle: false })),
        ...bundlesToVerify.map((sku) => ({ sku, isBundle: true })),
      ];

      if (allSkusToVerify.length === 0) return;

      // Verificar cada SKU único en segundo plano
      for (let i = 0; i < allSkusToVerify.length; i++) {
        const { sku, isBundle } = allSkusToVerify[i];

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        await processSkuVerification(sku, isBundle);
      }
    };

    verifyTradeIn();
  }, [products, shouldVerifySku, processSkuVerification]);

  // Estado para controlar el loading manual cuando se espera canPickUp
  const [isWaitingForCanPickUp, setIsWaitingForCanPickUp] = React.useState(false);

  // IMPORTANTE: Al entrar a Step3, recalcular canPickUp
  // Step4OrderSummary se encarga de calcular canPickUp global, pero necesitamos asegurarnos
  // de que se ejecute al montar. El skeleton solo se mostrará después de tener el valor.
  // No forzamos la carga de tiendas aquí, solo esperamos a que canPickUp se calcule.

  // IMPORTANTE: Escuchar cambios de dirección desde el header/navbar o desde otros componentes
  // Cuando cambia la dirección, mostrar skeleton INMEDIATAMENTE hasta que termine de recalcular
  // NOTA: Este listener solo actualiza la UI, NO dispara fetchCandidateStores (eso lo hace useDelivery)
  React.useEffect(() => {
    const handleAddressChange = (event: Event) => {
      // Verificar flag global para evitar procesar el mismo cambio múltiples veces
      const customEvent = event as CustomEvent;
      const addressFromEvent = customEvent.detail?.address;
      let newAddressId: string | null = null;

      if (addressFromEvent?.id) {
        newAddressId = addressFromEvent.id;
      } else {
        // Intentar obtener el ID desde localStorage
        try {
          const saved = JSON.parse(
            globalThis.window.localStorage.getItem("checkout-address") || "{}"
          ) as Address;
          newAddressId = saved?.id || null;
        } catch {
          return;
        }
      }

      // PROTECCIÓN: Verificar flag global compartido
      const globalProcessing = typeof globalThis.window !== 'undefined'
        ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
        : null;

      // Si ya se está procesando este cambio o es el mismo ID, ignorar
      if (globalProcessing === newAddressId || lastAddressIdRef.current === newAddressId) {
        return;
      }

      const fromHeader = customEvent.detail?.fromHeader;

      // IMPORTANTE: Si viene del header, activar skeleton INMEDIATAMENTE
      if (fromHeader) {
        // Activar skeleton ANTES de leer localStorage
        setIsRecalculatingPickup(true);

        // IMPORTANTE: Resetear el ref de canPickUp para permitir recarga cuando cambie
        lastCanPickUpForcedRef.current = null;

        // Si el evento trae la dirección, usarla directamente
        if (addressFromEvent?.id) {
          lastAddressIdRef.current = addressFromEvent.id;
          setAddress(addressFromEvent);
        }
      } else {
        // Si no viene del header, leer de localStorage
        try {
          const saved = JSON.parse(
            globalThis.window.localStorage.getItem("checkout-address") || "{}"
          ) as Address;

          if (saved?.id && saved.id !== lastAddressIdRef.current) {
            setIsRecalculatingPickup(true);
            lastAddressIdRef.current = saved.id;
            // IMPORTANTE: Resetear el ref de canPickUp para permitir recarga cuando cambie
            lastCanPickUpForcedRef.current = null;
            // Actualizar la dirección en el estado
            setAddress(saved);
          }
        } catch (error) {
          console.error('❌ Error al leer dirección de localStorage:', error);
        }
      }
    };

    // Escuchar eventos personalizados desde header/navbar
    globalThis.window.addEventListener('address-changed', handleAddressChange as EventListener);

    // Escuchar eventos personalizados desde checkout
    globalThis.window.addEventListener('checkout-address-changed', handleAddressChange as EventListener);

    // También escuchar cambios en localStorage (para cambios entre tabs)
    // IMPORTANTE: Solo procesar eventos storage REALES (entre tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'checkout-address' || e.key === 'imagiq_default_address') {
        // Solo procesar si es un evento storage REAL (tiene newValue y oldValue)
        // Los eventos storage disparados manualmente no tienen estas propiedades
        if (e.newValue !== undefined && e.oldValue !== undefined) {
          handleAddressChange(e);
        }
      }
    };
    globalThis.window.addEventListener('storage', handleStorageChange);

    return () => {
      globalThis.window.removeEventListener('address-changed', handleAddressChange as EventListener);
      globalThis.window.removeEventListener('checkout-address-changed', handleAddressChange as EventListener);
      globalThis.window.removeEventListener('storage', handleStorageChange);
    };
  }, [setAddress]);

  // IMPORTANTE: Cuando tenemos el valor de canPickUp y es true, cargar tiendas automáticamente
  // Si canPickUp es true, las tiendas vienen del mismo endpoint, así que deben mostrarse automáticamente
  // Esto se ejecuta cuando canPickUp tiene un valor (no es null) y es true
  React.useEffect(() => {
    // BLOQUEAR durante carga inicial - solo el primer useEffect debe llamar al endpoint
    if (!hasCompletedInitialLoadRef.current) {
      return;
    }

    // PROTECCIÓN: No cargar si hay un cambio de dirección en proceso desde el navbar
    const globalProcessing = typeof globalThis.window !== 'undefined'
      ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
      : null;

    if (globalProcessing) {
      return;
    }

    // Si canPickUp es true, SIEMPRE asegurar que las tiendas estén cargadas
    if (hasCanPickUpValue && effectiveCanPickUp === true) {
      const canPickUpChanged = lastCanPickUpForcedRef.current !== effectiveCanPickUp;
      const shouldLoad = !storesLoading &&
        canPickUpChanged &&
        (storesLengthRef.current === 0 || isRecalculatingPickup) &&
        availableStoresWhenCanPickUpFalseLengthRef.current === 0;

      if (shouldLoad) {
        lastCanPickUpForcedRef.current = effectiveCanPickUp;
        forceRefreshStores();
      } else if (canPickUpChanged) {
        lastCanPickUpForcedRef.current = effectiveCanPickUp;
      }
    } else if (hasCanPickUpValue && effectiveCanPickUp !== null) {
      lastCanPickUpForcedRef.current = effectiveCanPickUp;
    }
  }, [hasCanPickUpValue, effectiveCanPickUp, storesLoading, isRecalculatingPickup, forceRefreshStores]);
  // IMPORTANTE: NO incluir stores.length ni availableStoresWhenCanPickUpFalse.length en dependencias
  // para evitar que se ejecute múltiples veces cuando las tiendas se cargan
  // Usamos refs (storesLengthRef, availableStoresWhenCanPickUpFalseLengthRef) para leer valores actuales

  // IMPORTANTE: Precargar tiendas en segundo plano cuando hay Trade In activo
  // Esto asegura que las tiendas estén listas cuando el usuario seleccione "Recoger en tienda"
  React.useEffect(() => {
    // BLOQUEAR durante carga inicial - solo el primer useEffect debe llamar al endpoint
    if (!hasCompletedInitialLoadRef.current) {
      return;
    }

    // PROTECCIÓN: No cargar si hay un cambio de dirección en proceso desde el navbar
    const globalProcessing = typeof globalThis.window !== 'undefined'
      ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
      : null;

    if (globalProcessing) {
      return;
    }

    // Si hay Trade In activo y no hay tiendas cargadas, FORZAR recarga
    const shouldLoadStores = hasActiveTradeIn &&
      stores.length === 0 &&
      availableStoresWhenCanPickUpFalse.length === 0 &&
      !storesLoading;

    if (shouldLoadStores) {
      forceRefreshStores();
    }
  }, [hasActiveTradeIn, stores.length, availableStoresWhenCanPickUpFalse.length, storesLoading, forceRefreshStores]);

  // Marcar que ya se cargó el pickup por primera vez cuando termine de cargar
  // IMPORTANTE: Solo marcar como cargado cuando realmente termine (storesLoading es false)
  // y haya pasado un pequeño delay para asegurar que la UI se actualizó
  React.useEffect(() => {
    if (!storesLoading && !hasLoadedPickupOnceRef.current) {
      // Pequeño delay para asegurar que el skeleton se muestre antes de ocultarlo
      const timer = setTimeout(() => {
        hasLoadedPickupOnceRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [storesLoading]);

  // IMPORTANTE: Cuando termine de cargar después de cambiar dirección, ocultar skeleton de recálculo
  // Esperar a que termine de cargar canPickUp Y las tiendas antes de ocultar el skeleton
  // Agregar un delay para que las tiendas se carguen completamente antes de ocultar
  React.useEffect(() => {
    // Solo ocultar el skeleton cuando:
    // 1. Ya no está cargando canPickUp (isLoadingCanPickUp es false)
    // 2. Ya no está cargando tiendas (storesLoading es false)
    // 3. Ya tenemos el valor de canPickUp (hasCanPickUpValue es true)
    // 4. Si canPickUp es true, asegurar que las tiendas se hayan procesado (stores.length > 0 o al menos un intento de carga)
    const shouldHideSkeleton = isRecalculatingPickup &&
      !isLoadingCanPickUp &&
      !storesLoading &&
      hasCanPickUpValue;

    if (shouldHideSkeleton) {
      // Si canPickUp es true, esperar un poco más para asegurar que las tiendas se rendericen completamente
      // Si canPickUp es false, ocultar después de un pequeño delay
      // El delay más largo cuando canPickUp es true asegura que no se muestre "No se encontraron tiendas" prematuramente
      const delay = effectiveCanPickUp === true ? 600 : 200;
      const timer = setTimeout(() => {
        setIsRecalculatingPickup(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isRecalculatingPickup, isLoadingCanPickUp, storesLoading, hasCanPickUpValue, effectiveCanPickUp, stores.length]);

  // IMPORTANTE: Ocultar skeleton de carga inicial de trade-in cuando terminen de cargar las tiendas
  React.useEffect(() => {
    // Si estábamos cargando por trade-in y ya no está cargando, ocultar skeleton
    if (isInitialTradeInLoading && !storesLoading) {
      // IMPORTANTE: Si terminó de cargar (!storesLoading), SIEMPRE ocultar el skeleton
      // incluso si el resultado es vacío (endpoint retornó array vacío)
      // Esto evita el skeleton infinito cuando no hay tiendas disponibles
      const hasFinishedLoading = !isLoadingCanPickUp;

      // CRÍTICO: Si hay trade-in, asegurar que realmente recibimos respuesta del endpoint
      // Si lastResponse es null, significa que el endpoint aún no ha respondido (o falló silenciosamente)
      const hasResponse = lastResponse !== null;

      if (hasFinishedLoading && hasResponse) {
        // Pequeño delay para que la UI se actualice
        const timer = setTimeout(() => {
          setIsInitialTradeInLoading(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isInitialTradeInLoading, storesLoading, isLoadingCanPickUp, lastResponse]);

  // PROTECCIÓN: Timeout de seguridad para evitar skeleton infinito
  React.useEffect(() => {
    if (isInitialTradeInLoading) {
      // Timeout de seguridad de 10 segundos
      const safetyTimer = setTimeout(() => {
        setIsInitialTradeInLoading(false);
      }, 10000);

      return () => clearTimeout(safetyTimer);
    }
  }, [isInitialTradeInLoading]);

  // También forzar recarga cuando el usuario selecciona "Recoger en tienda" y (canPickUp es true O hay Trade In activo)
  // IMPORTANTE: Solo cargar cuando se CAMBIA A tienda, NO cuando se cambia DE tienda a domicilio
  React.useEffect(() => {
    // BLOQUEAR durante carga inicial - solo el primer useEffect debe llamar al endpoint
    if (!hasCompletedInitialLoadRef.current) {
      return;
    }

    // PROTECCIÓN: No cargar si hay un cambio de dirección en proceso desde el navbar
    const globalProcessing = typeof globalThis.window !== 'undefined'
      ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
      : null;

    if (globalProcessing) {
      return;
    }

    // CRÍTICO: Solo cargar tiendas cuando deliveryMethod es "tienda"
    // Si es "domicilio", NO hacer nada (evita llamadas innecesarias al cambiar de tienda a domicilio)
    if (deliveryMethod !== "tienda") {
      return;
    }

    const shouldLoadStores = deliveryMethod === "tienda" &&
      (effectiveCanPickUp || hasActiveTradeIn) &&
      stores.length === 0 &&
      availableStoresWhenCanPickUpFalse.length === 0;

    if (shouldLoadStores) {
      forceRefreshStores();
    }
  }, [deliveryMethod, effectiveCanPickUp, hasActiveTradeIn, stores.length, availableStoresWhenCanPickUpFalse.length, forceRefreshStores]);

  // IMPORTANTE: Si no hay tiendas disponibles, cambiar automáticamente a "Envío a domicilio"
  // Esto solo se aplica si NO hay trade-in activo (con trade-in siempre debe ser tienda)
  // PERO NO debe ejecutarse si el usuario está cambiando manualmente el método
  React.useEffect(() => {
    // CRÍTICO: NO cambiar mientras esté cargando - esperar a que termine de cargar
    if (storesLoading || isLoadingCanPickUp) {
      console.log('⏸️ Esperando a que termine de cargar antes de decidir método de entrega');
      return;
    }

    // Solo cambiar si NO hay trade-in activo
    if (hasActiveTradeIn) {
      return; // Con trade-in, siempre debe ser tienda
    }

    // IMPORTANTE: Si canPickUp es true, NO cambiar automáticamente a domicilio
    // aunque las tiendas aún no se hayan cargado (pueden estar cargando)
    // PERMITIR que el usuario seleccione "tienda" manualmente
    if (effectiveCanPickUp === true) {
      console.log('✅ canPickUp es true - permitir seleccionar tienda');
      return; // canPickUp es true, permitir seleccionar tienda
    }

    // CRÍTICO: Si canPickUp es false PERO hay tiendas disponibles en availableStoresWhenCanPickUpFalse,
    // NO cambiar a domicilio. El usuario debe poder ver esas tiendas.
    if (effectiveCanPickUp === false && availableStoresWhenCanPickUpFalse.length > 0) {
      console.log('✅ canPickUp es false pero hay tiendas disponibles - NO cambiar a domicilio');
      return; // Hay tiendas disponibles, mantener en tienda
    }

    // Si canPickUp es false Y no hay tiendas disponibles Y ya terminó de cargar
    const canPickUpIsFalse = effectiveCanPickUp === false;
    const finishedLoadingNoStores = stores.length === 0 && availableStoresWhenCanPickUpFalse.length === 0;
    const noStoresAvailable = canPickUpIsFalse && finishedLoadingNoStores;

    // Si no hay tiendas disponibles y el método actual es "tienda", cambiar a "domicilio"
    if (noStoresAvailable && deliveryMethod === "tienda") {
      console.log('❌ No hay tiendas disponibles (después de cargar) - cambiando a domicilio');
      setDeliveryMethod("domicilio");
    }
  }, [hasActiveTradeIn, effectiveCanPickUp, stores.length, availableStoresWhenCanPickUpFalse.length, storesLoading, isLoadingCanPickUp, deliveryMethod, setDeliveryMethod]);

  // Escuchar cuando storesLoading cambia para avanzar automáticamente
  React.useEffect(() => {
    // Si estábamos esperando y terminó de cargar, avanzar automáticamente
    if (isWaitingForCanPickUp && !storesLoading) {
      setIsWaitingForCanPickUp(false);

      // Validar Trade-In antes de continuar
      const validation = validateTradeInProducts(products);
      if (!validation.isValid) {
        alert(getTradeInValidationMessage(validation));
        return;
      }

      // IMPORTANTE: Verificar y guardar el método de entrega en localStorage antes de continuar
      if (globalThis.window !== undefined) {
        const currentMethod = globalThis.window.localStorage.getItem("checkout-delivery-method");
        if (!currentMethod || currentMethod !== deliveryMethod) {
          globalThis.window.localStorage.setItem("checkout-delivery-method", deliveryMethod);
          globalThis.dispatchEvent(new CustomEvent("delivery-method-changed", { detail: { method: deliveryMethod } }));
        }
      }

      // Track del evento add_payment_info para analytics
      trackAddPaymentInfo(
        products.map((p) => ({
          item_id: p.sku,
          item_name: p.name,
          price: Number(p.price),
          quantity: p.quantity,
        })),
        calculations.subtotal
      );

      if (typeof onContinue === "function") {
        onContinue();
      }
    }
  }, [isWaitingForCanPickUp, storesLoading, products, deliveryMethod, calculations.subtotal, onContinue, trackAddPaymentInfo]);

  // UX: Navegación al siguiente paso
  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = React.useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof products;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Validar Trade-In cuando cambian los productos
  React.useEffect(() => {
    const validation = validateTradeInProducts(products);
    setTradeInValidation(validation);

    // Si el producto ya no aplica (indRetoma === 0), quitar banner inmediatamente y mostrar notificación
    if (validation.isValid === false && validation.errorMessage?.includes("Te removimos")) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");

      // Quitar el banner inmediatamente
      setTradeInDataMap({});

      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description: "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    }
  }, [products]);

  const handleContinue = () => {
    // IMPORTANTE: Validar que haya dirección antes de continuar
    if (deliveryMethod === "domicilio" && !address) {
      toast.error("Por favor selecciona una dirección para continuar");
      router.push("/carrito/step2");
      return;
    }

    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(products);
    if (!validation.isValid) {
      alert(getTradeInValidationMessage(validation));
      return;
    }

    // IMPORTANTE: Si está cargando canPickUp y el método es tienda, esperar
    if (storesLoading && deliveryMethod === "tienda") {
      setIsWaitingForCanPickUp(true);

      // El useEffect se encargará de avanzar cuando termine storesLoading
      // También esperamos con timeout por seguridad
      const maxWait = 10000;
      const startTime = Date.now();

      const checkLoading = setInterval(() => {
        if (!storesLoading || (Date.now() - startTime) >= maxWait) {
          clearInterval(checkLoading);
          if (storesLoading) {
            console.error('❌ Timeout esperando canPickUp en Step3');
            setIsWaitingForCanPickUp(false);
          }
          // Si terminó de cargar, el useEffect se encargará de avanzar
        }
      }, 100);

      return;
    }

    // IMPORTANTE: Verificar y guardar el método de entrega en localStorage antes de continuar
    if (globalThis.window !== undefined) {
      const currentMethod = globalThis.window.localStorage.getItem("checkout-delivery-method");
      // Si no existe o es diferente al método actual, guardarlo
      if (!currentMethod || currentMethod !== deliveryMethod) {
        globalThis.window.localStorage.setItem("checkout-delivery-method", deliveryMethod);
        // Disparar evento para notificar el cambio
        globalThis.dispatchEvent(new CustomEvent("delivery-method-changed", { detail: { method: deliveryMethod } }));
      }
    }

    // Track del evento add_payment_info para analytics
    trackAddPaymentInfo(
      products.map((p) => ({
        item_id: p.sku,
        item_name: p.name,
        price: Number(p.price),
        quantity: p.quantity,
      })),
      calculations.subtotal
    );

    if (typeof onContinue === "function") {
      onContinue();
    }
  };
  const handleAddressChange = async (newAddress: Address) => {
    // IMPORTANTE: Si cambió la dirección, marcar que estamos recalculando INMEDIATAMENTE
    // Esto asegura que el skeleton se muestre antes de que se oculte el contenido anterior
    if (newAddress.id && newAddress.id !== lastAddressIdRef.current) {
      // Activar el skeleton ANTES de cualquier otra operación
      setIsRecalculatingPickup(true);
      lastAddressIdRef.current = newAddress.id;
      // IMPORTANTE: Resetear el ref de canPickUp para permitir recarga cuando cambie
      lastCanPickUpForcedRef.current = null;
    }

    // Actualizar estado local inmediatamente para mejor UX
    setAddress(newAddress);

    // Si la dirección tiene id, sincronizar con el backend y otros componentes
    if (newAddress.id) {
      try {
        // Usar utility centralizada para sincronizar dirección
        await syncAddress({
          address: newAddress,
          userEmail: user?.email,
          user,
          loginFn: login,
          fromHeader: false, // Viene del checkout
        });
      } catch (error) {
        console.error('⚠️ Error al sincronizar dirección predeterminada:', error);
        // No bloquear el flujo si falla la sincronización
        // Guardar al menos en localStorage
        localStorage.setItem("checkout-address", JSON.stringify(newAddress));
      }
    } else {
      // Si no tiene id, solo guardar en localStorage (nueva dirección no guardada)
      localStorage.setItem("checkout-address", JSON.stringify(newAddress));
    }
  };
  const handleDeliveryMethodChange = (method: string) => {
    console.log('🔄 handleDeliveryMethodChange llamado con método:', method);

    // Si hay trade-in activo, no permitir cambiar a domicilio
    if (hasActiveTradeIn && method === "domicilio") {
      return; // No hacer nada, mantener en tienda
    }

    // setDeliveryMethod ya guarda automáticamente en localStorage
    setDeliveryMethod(method);

    // IMPORTANTE: Si se selecciona "tienda", abrir el selector automáticamente
    if (method === "tienda") {
      setStoreEdit(true); // Abrir el selector de tiendas

      console.log('🏪 Usuario seleccionó "tienda" - verificando caché antes de cargar');
      console.log('   Estado actual:', {
        storesLength: stores.length,
        availableStoresWhenCanPickUpFalseLength: availableStoresWhenCanPickUpFalse.length,
        storesLoading,
        isInitialTradeInLoading
      });

      // Si no hay tiendas cargadas Y no está cargando, intentar cargar desde caché
      // forceRefreshStores ahora lee del caché primero, así que no activamos skeleton aquí
      // El skeleton solo se mostrará si realmente no hay datos en caché
      if (stores.length === 0 && availableStoresWhenCanPickUpFalse.length === 0 && !storesLoading && !isInitialTradeInLoading) {
        // NO activar isInitialTradeInLoading aquí - forceRefreshStores lo manejará si es necesario
        // Si hay datos en caché, forceRefreshStores los usará inmediatamente sin skeleton
        setTimeout(() => {
          console.log('✅ Llamando forceRefreshStores después de seleccionar tienda (leerá del caché primero)');
          forceRefreshStores();
        }, 100);
      }
    } else {
      // Si cambia a domicilio, cerrar el selector de tiendas
      setStoreEdit(false);
    }
  };

  const selectedStoreChanged = (store: typeof selectedStore) => {
    setSelectedStore(store);
    localStorage.setItem("checkout-store", JSON.stringify(store));
    // Guardar también la dirección actual para verificar si cambió después
    if (address?.id && globalThis.window) {
      globalThis.window.localStorage.setItem("checkout-store-address-id", address.id);
    }
  };

  // Define loading state for the whole section
  // IMPORTANTE: NO quitar el skeleton hasta que:
  // 1. storesLoading sea false (endpoint terminó completamente)
  // 2. canPickUp tenga un valor (no null) - hasCanPickUpValue
  // 3. Si estamos recalculando, esperar a que termine
  // Cuando el endpoint termina, SIEMPRE procesa la información (aunque no haya tiendas), así que NO esperamos tiendas
  // CRÍTICO: NO mostrar skeleton cuando solo se cambia el método de entrega (tienda <-> domicilio)
  // CRÍTICO: NO mostrar skeleton cuando solo se elimina trade-in
  // Solo mostrar skeleton cuando realmente se está recalculando canPickUp (cambio de dirección)
  // isInitialTradeInLoading solo se usa para la primera carga con trade-in, pero si hay datos en caché no debe mostrar skeleton
  const shouldShowSkeleton = (isLoadingCanPickUp && !hasCanPickUpValue) ||
    (storesLoading && !hasCanPickUpValue && isRecalculatingPickup) || // Solo mostrar skeleton si está recalculando (cambio de dirección)
    isRecalculatingPickup ||
    (!hasCanPickUpValue && isInitialTradeInLoading && storesLoading); // Solo mostrar skeleton si realmente está cargando Y no hay datos en caché

  // Callback estable para recibir el estado de canPickUp desde Step4OrderSummary
  const handleCanPickUpReady = React.useCallback((canPickUpValue: boolean, isLoading: boolean) => {
    setIsLoadingCanPickUp(isLoading);
    if (typeof canPickUpValue === 'boolean') {
      setGlobalCanPickUpFromSummary(canPickUpValue);
    }
  }, []);

  return (
    <div className="min-h-screen w-full pb-40 md:pb-0">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forma de entrega */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-6">
              {shouldShowSkeleton ? (
                <div className="animate-pulse space-y-6">
                  {/* Título */}
                  <div className="h-7 bg-gray-200 rounded w-48 mb-6"></div>

                  {/* Opciones de entrega */}
                  <div className="space-y-4">
                    {/* Opción 1: Domicilio */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-40"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>

                    {/* Opción 2: Tienda */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-40"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección adicional (dirección o tiendas) */}
                  <div className="mt-6 p-4 border-2 border-gray-100 rounded-lg">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                      <div className="h-24 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <DeliveryMethodSelector
                    deliveryMethod={deliveryMethod}
                    onMethodChange={handleDeliveryMethodChange}
                    canContinue={canContinue}
                    disableHomeDelivery={hasActiveTradeIn}
                    disableReason={
                      hasActiveTradeIn && !canAllTradeInProductsPickUp
                        ? "El beneficio Entrego y Estreno solo aplica para recoger en tienda."
                        : hasActiveTradeIn
                          ? "Para aplicar el beneficio Estreno y Entrego solo puedes recoger en tienda"
                          : undefined
                    }
                    disableStorePickup={!effectiveCanPickUp && !hasActiveTradeIn}
                    disableStorePickupReason={!effectiveCanPickUp && !hasActiveTradeIn ? "Este producto no está disponible para recoger en tienda" : undefined}
                    address={address}
                    onEditToggle={setAddressEdit}
                    addressLoading={addressLoading}
                    addressEdit={addressEdit}
                  />

                  {deliveryMethod === "domicilio" && !hasActiveTradeIn && (
                    <div className="mt-6">
                      <AddressSelector
                        address={address}
                        addresses={addresses}
                        addressEdit={addressEdit}
                        onAddressChange={handleAddressChange}
                        onEditToggle={setAddressEdit}
                        onAddressAdded={addAddress}
                        addressLoading={addressLoading}
                      />
                    </div>
                  )}

                  {/* Mostrar opción de recoger en tienda siempre, pero deshabilitada si canPickUp es false y no hay trade-in */}
                  {/* IMPORTANTE: Habilitar recoger en tienda si canPickUp global es true O si hay trade-in activo */}
                  {/* Mostrar estado de carga cuando se está verificando disponibilidad (cambio de dirección o carga inicial) */}
                  <div className="mt-6">
                    <StorePickupSelector
                      deliveryMethod={deliveryMethod}
                      onMethodChange={handleDeliveryMethodChange}
                      disabled={!effectiveCanPickUp && !hasActiveTradeIn}
                      isLoading={storesLoading || addressLoading}
                      availableStoresWhenCanPickUpFalse={availableStoresWhenCanPickUpFalse}
                      hasActiveTradeIn={hasActiveTradeIn}
                      canPickUp={effectiveCanPickUp}
                      onStoreEditToggle={setStoreEdit}
                      storeEdit={storeEdit}
                      selectedStore={selectedStore}
                    />
                  </div>

                  {/* Mostrar selector de tiendas cuando está seleccionado recoger en tienda Y storeEdit es true */}
                  {/* El StoreSelector manejará internamente si mostrar el mensaje (canPickUp=false) o el selector (canPickUp=true) */}
                  {deliveryMethod === "tienda" && storeEdit && (() => {
                    // DEBUG: Log para ver qué se está pasando a StoreSelector
                    console.log('📍 Step3 - Pasando props a StoreSelector:', {
                      effectiveCanPickUp,
                      storesLength: stores.length,
                      availableStoresWhenCanPickUpFalseLength: availableStoresWhenCanPickUpFalse.length,
                      availableCitiesLength: availableCities.length,
                      hasActiveTradeIn,
                      storesLoading,
                      availableStoresWhenCanPickUpFalseData: availableStoresWhenCanPickUpFalse.map(s => ({ nombre: s.descripcion, ciudad: s.ciudad })),
                    });

                    return (
                      <div className="mt-6">
                        <StoreSelector
                          storeQuery={storeQuery}
                          filteredStores={filteredStores}
                          selectedStore={selectedStore}
                          onQueryChange={setStoreQuery}
                          onStoreSelect={selectedStoreChanged}
                          storesLoading={storesLoading}
                          canPickUp={effectiveCanPickUp}
                          allStores={stores}
                          onAddressAdded={addAddress}
                          onRefreshStores={forceRefreshStores}
                          availableCities={availableCities}
                          hasActiveTradeIn={hasActiveTradeIn}
                          availableStoresWhenCanPickUpFalse={availableStoresWhenCanPickUpFalse}
                          onAddressChange={handleAddressChange}
                          storeEdit={storeEdit}
                          onEditToggle={setStoreEdit}
                        />
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </div>

          {/* Resumen de compra y Trade-In - Hidden en mobile */}
          <aside className="hidden md:block lg:col-span-1 space-y-4">
            {shouldShowSkeleton && (
              <div className="bg-white rounded-2xl p-6 shadow border border-[#E5E5E5] animate-pulse">
                <div className="space-y-4">
                  {/* Líneas de precios */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between mb-4">
                      <div className="h-5 w-16 bg-gray-300 rounded"></div>
                      <div className="h-5 w-28 bg-gray-300 rounded"></div>
                    </div>
                  </div>

                  {/* Botón */}
                  <div className="h-12 w-full bg-gray-300 rounded-lg"></div>

                  {/* Términos */}
                  <div className="space-y-2 mt-4">
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            )}

            <div className={shouldShowSkeleton ? "hidden" : ""}>
              <Step4OrderSummary
                onFinishPayment={handleContinue}
                buttonText="Continuar"
                onBack={onBack}
                disabled={!canContinue || !tradeInValidation.isValid}
                isProcessing={isWaitingForCanPickUp}
                isSticky={false}
                deliveryMethod={(() => {
                  if (deliveryMethod === "tienda") return "pickup";
                  if (deliveryMethod === "domicilio") return "delivery";
                  if (deliveryMethod === "delivery" || deliveryMethod === "pickup") return deliveryMethod;
                  return undefined;
                })()}
                onCanPickUpReady={handleCanPickUpReady}
                debugStoresInfo={{
                  availableStoresWhenCanPickUpFalse: availableStoresWhenCanPickUpFalse.length,
                  stores: stores.length,
                  filteredStores: filteredStores.length,
                  availableCities: availableCities.length,
                }}
              />

              {/* Banner de Trade-In - Mostrar para cada producto con trade-in */}
              {productsWithTradeIn.map((product) => {
                const entry = getTradeInEntry(product);
                if (!entry?.tradeIn?.completed) return null;

                return (
                  <TradeInCompletedSummary
                    key={product.sku}
                    deviceName={entry.tradeIn.deviceName}
                    tradeInValue={entry.tradeIn.value}
                    onEdit={() => handleRemoveTradeIn(entry.key)}
                    validationError={tradeInValidation.isValid === false ? getTradeInValidationMessage(tradeInValidation) : undefined}
                    showStorePickupMessage={deliveryMethod === "tienda" || hasActiveTradeIn}
                  />
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Bar - Solo Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="p-4">
          {/* Resumen compacto */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">
                Total ({products.reduce((acc, p) => acc + p.quantity, 0)}{" "}
                productos)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                $ {Number(calculations.total).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Botón continuar */}
          <button
            className={`w-full font-bold py-3 rounded-lg text-base transition text-white ${!canContinue || !tradeInValidation.isValid || isWaitingForCanPickUp
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "bg-[#222] hover:bg-[#333] cursor-pointer"
              }`}
            onClick={handleContinue}
            disabled={!canContinue || !tradeInValidation.isValid || isWaitingForCanPickUp}
          >
            {isWaitingForCanPickUp ? "Verificando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
