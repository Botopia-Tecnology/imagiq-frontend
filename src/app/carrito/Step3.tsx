"use client";
import React from "react";
import { useCart } from "@/hooks/useCart";
import { useDelivery } from "./hooks/useDelivery";
import {
  DeliveryMethodSelector,
  StorePickupSelector,
  AddressSelector,
  StoreSelector,
} from "./components";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import { Direccion } from "@/types/user";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { tradeInEndpoints } from "@/lib/api";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";
import { toast } from "sonner";
import { useCardsCache } from "./hooks/useCardsCache";
import { useAuthContext } from "@/features/auth/context";
import { syncAddress, direccionToAddress } from "@/lib/addressSync";

export default function Step3({
  onBack,
  onContinue,
}: {
  readonly onBack?: () => void;
  readonly onContinue?: () => void;
}) {
  const { products, calculations } = useCart();
  const { trackAddPaymentInfo } = useAnalyticsWithUser();
  const { user, login } = useAuthContext();
  const {
    address,
    setAddress,
    addressEdit,
    setAddressEdit,
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
  } = useDelivery();

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

  // Trade-In state management
  const [tradeInData, setTradeInData] = React.useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // Ref para evitar múltiples ejecuciones del useEffect (previene loop infinito)
  const tradeInLoadedRef = React.useRef(false);
  
  // Ref para rastrear si acabamos de eliminar el trade-in (evita que useEffect revierta el cambio)
  const justRemovedTradeInRef = React.useRef(false);

  // Load Trade-In data from localStorage y forzar método a "tienda" si hay trade-in
  React.useEffect(() => {
    // Solo ejecutar una vez
    if (tradeInLoadedRef.current) return;

    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const parsed = JSON.parse(storedTradeIn);
        if (parsed.completed) {
          setTradeInData(parsed);
          // IMPORTANTE: Si hay trade-in, forzar método a "tienda" inmediatamente
          // setDeliveryMethod ya guarda automáticamente en localStorage
          setDeliveryMethod("tienda");
          tradeInLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error parsing Trade-In data:", error);
      }
    } else {
      // Marcar como cargado incluso si no hay trade-in
      tradeInLoadedRef.current = true;
    }
  }, [setDeliveryMethod]);

  // Handle Trade-In removal
  const handleRemoveTradeIn = () => {
    // Marcar que acabamos de eliminar el trade-in (evitar que useEffect revierta el cambio)
    justRemovedTradeInRef.current = true;
    
    // Marcar en useDelivery que estamos eliminando trade-in (previene fetchCandidateStores)
    // HACERLO INMEDIATAMENTE antes de cualquier otra cosa
    if (globalThis.window) {
      // Usar un evento personalizado para notificar a useDelivery
      globalThis.window.dispatchEvent(
        new CustomEvent("removing-trade-in", { detail: { removing: true } })
      );
    }
    
    // PRIMERO: Eliminar el trade-in para que hasActiveTradeIn sea false inmediatamente
    localStorage.removeItem("imagiq_trade_in");
    setTradeInData(null);
    
    // SEGUNDO: Forzar cambio a "domicilio" tras eliminar el trade-in
    // Verificar el método actual desde localStorage y estado
    const currentMethodFromStorage = globalThis.window?.localStorage.getItem("checkout-delivery-method");
    const currentMethod = currentMethodFromStorage || deliveryMethod;
    
    // SIEMPRE cambiar a domicilio si está en tienda (sin importar autenticación)
    if (currentMethod === "tienda" || deliveryMethod === "tienda") {
      // 1. Forzar directamente en localStorage PRIMERO (fuente de verdad)
      if (globalThis.window) {
        globalThis.window.localStorage.setItem("checkout-delivery-method", "domicilio");
      }
      
      // 2. Cambiar usando el hook (actualiza el estado del componente)
      setDeliveryMethod("domicilio");
      
      // 3. Disparar eventos para sincronizar con otros componentes (pero NO storage para evitar loops)
      if (globalThis.window) {
        globalThis.window.dispatchEvent(
          new CustomEvent("delivery-method-changed", { detail: { method: "domicilio", skipFetch: true } })
        );
        // NO disparar evento storage aquí para evitar que handleAddressChange se ejecute
      }
    }
    
    // Resetear los flags con un delay de 3 segundos para permitir que todas las operaciones se completen
    setTimeout(() => {
      justRemovedTradeInRef.current = false;
      if (globalThis.window) {
        globalThis.window.dispatchEvent(
          new CustomEvent("removing-trade-in", { detail: { removing: false } })
        );
      }
    }, 3000);
  };

  // IMPORTANTE: Si hay trade-in activo, solo permitir recoger en tienda
  const hasActiveTradeIn = tradeInData?.completed === true;

  // Estado para recibir canPickUp global desde Step4OrderSummary (fuente de verdad)
  const [globalCanPickUpFromSummary, setGlobalCanPickUpFromSummary] = React.useState<boolean | null>(null);
  
  // Estado para rastrear si canPickUp está cargando
  const [isLoadingCanPickUp, setIsLoadingCanPickUp] = React.useState(true);
  
  // Ref para rastrear si ya se cargó el pickup por primera vez
  const hasLoadedPickupOnceRef = React.useRef(false);
  
  // Ref para rastrear el último valor de canPickUp para el que ya se forzó la recarga
  const lastCanPickUpForcedRef = React.useRef<boolean | null>(null);
  
  // Ref para rastrear la última dirección para detectar cambios
  const lastAddressIdRef = React.useRef<string | null>(null);
  
  // Estado para forzar mostrar skeleton cuando cambia la dirección
  const [isRecalculatingPickup, setIsRecalculatingPickup] = React.useState(false);
  
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
  React.useEffect(() => {
    if (!hasActiveTradeIn && hasProductWithoutPickup && deliveryMethod === "tienda") {
      // setDeliveryMethod ya guarda automáticamente en localStorage
      setDeliveryMethod("domicilio");
    }
  }, [hasActiveTradeIn, hasProductWithoutPickup, deliveryMethod, setDeliveryMethod]);

  // Forzar método de entrega a "tienda" si hay trade-in activo (ejecutar inmediatamente)
  // IMPORTANTE: NO ejecutar si acabamos de eliminar el trade-in (evitar revertir el cambio)
  React.useEffect(() => {
    // Si acabamos de eliminar el trade-in, NO hacer nada
    if (justRemovedTradeInRef.current) {
      return;
    }
    
    // Solo forzar a "tienda" si hay trade-in activo
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
    }
  }, [hasActiveTradeIn, deliveryMethod, setDeliveryMethod]);
  
  // Ref para rastrear SKUs que ya fueron verificados (evita loops infinitos)
  const verifiedSkusRef = React.useRef<Set<string>>(new Set());
  // Ref para rastrear SKUs que fallaron (evita reintentos de peticiones fallidas)
  const failedSkusRef = React.useRef<Set<string>>(new Set());

  // Función auxiliar para verificar si un SKU necesita verificación
  const shouldVerifySku = React.useCallback((sku: string, productList: typeof products): boolean => {
    const product = productList.find((p) => p.sku === sku);
    const needsVerification = product?.indRetoma === undefined;
    const notVerifiedYet = !verifiedSkusRef.current.has(sku);
    const notFailedBefore = !failedSkusRef.current.has(sku);
    return needsVerification && notVerifiedYet && notFailedBefore;
  }, []);

  // Función auxiliar para actualizar localStorage con el resultado de trade-in
  const updateProductIndRetoma = React.useCallback((sku: string, indRetoma: number) => {
    const storedProducts = JSON.parse(
      localStorage.getItem("cart-items") || "[]"
    ) as Array<Record<string, unknown>>;
    const updatedProducts = storedProducts.map((p) => {
      if (p.sku === sku) {
        return { ...p, indRetoma };
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
  }, []);

  // Función auxiliar para procesar un SKU individual
  const processSkuVerification = React.useCallback(async (sku: string) => {
    // PROTECCIÓN: Verificar si este SKU ya falló antes
    if (failedSkusRef.current.has(sku)) {
      console.error(`🚫 SKU ${sku} ya falló anteriormente. NO se reintentará para evitar sobrecargar la base de datos.`);
      verifiedSkusRef.current.add(sku);
      return;
    }

    try {
      const response = await tradeInEndpoints.checkSkuForTradeIn({ sku });
      if (!response.success || !response.data) {
        failedSkusRef.current.add(sku);
        console.error(`🚫 Petición falló para SKU ${sku}. NO se reintentará automáticamente para proteger la base de datos.`);
        verifiedSkusRef.current.add(sku);
        return;
      }

      const result = response.data;
      const indRetoma = result.indRetoma ?? (result.aplica ? 1 : 0);

      // Marcar SKU como verificado ANTES de actualizar localStorage (evita loop)
      verifiedSkusRef.current.add(sku);
      failedSkusRef.current.delete(sku);

      updateProductIndRetoma(sku, indRetoma);
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
      // Obtener SKUs únicos (sin duplicados)
      const uniqueSkus = Array.from(
        new Set(products.map((p) => p.sku))
      );

      // Filtrar productos que necesitan verificación
      const productsToVerify = uniqueSkus.filter((sku) => shouldVerifySku(sku, products));

      if (productsToVerify.length === 0) return;

      // Verificar cada SKU único en segundo plano
      for (let i = 0; i < productsToVerify.length; i++) {
        const sku = productsToVerify[i];

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        await processSkuVerification(sku);
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
          ) as Direccion;
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
          // Convertir Address a Direccion si es necesario
          const direccionFormat: Direccion = {
            id: addressFromEvent.id,
            usuario_id: addressFromEvent.usuarioId || '',
            email: '',
            linea_uno: addressFromEvent.direccionFormateada || '',
            codigo_dane: addressFromEvent.codigo_dane || '',
            ciudad: addressFromEvent.ciudad || '',
            pais: addressFromEvent.pais || 'Colombia',
            esPredeterminada: addressFromEvent.esPredeterminada || false,
          };
          setAddress(direccionFormat);
        }
      } else {
        // Si no viene del header, leer de localStorage
        try {
          const saved = JSON.parse(
            globalThis.window.localStorage.getItem("checkout-address") || "{}"
          ) as Direccion;
          
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
    // PROTECCIÓN: No cargar si hay un cambio de dirección en proceso desde el navbar
    const globalProcessing = typeof globalThis.window !== 'undefined' 
      ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
      : null;
    
    if (globalProcessing) {
      // Si hay un cambio de dirección en proceso, useDelivery ya está manejando la carga
      // No interferir con ese proceso
      return;
    }
    
    // Si canPickUp es true, SIEMPRE asegurar que las tiendas estén cargadas
    // porque vienen del mismo endpoint
    if (hasCanPickUpValue && effectiveCanPickUp === true) {
      // Solo cargar si:
      // 1. No está cargando actualmente
      // 2. No hay tiendas cargadas O estamos recalculando (cambio de dirección)
      // 3. El valor de canPickUp cambió (nuevo cálculo)
      const canPickUpChanged = lastCanPickUpForcedRef.current !== effectiveCanPickUp;
      const shouldLoad = !storesLoading && 
                        canPickUpChanged &&
                        (storesLengthRef.current === 0 || isRecalculatingPickup) &&
                        availableStoresWhenCanPickUpFalseLengthRef.current === 0;
      
      if (shouldLoad) {
        lastCanPickUpForcedRef.current = effectiveCanPickUp;
        // Usar forceRefreshStores para cargar las tiendas del mismo endpoint
        forceRefreshStores();
      } else if (canPickUpChanged) {
        // Actualizar el ref cuando canPickUp cambia
        lastCanPickUpForcedRef.current = effectiveCanPickUp;
      }
    } else if (hasCanPickUpValue && effectiveCanPickUp !== null) {
      // Actualizar el ref cuando canPickUp cambia (incluso si es false)
      lastCanPickUpForcedRef.current = effectiveCanPickUp;
    }
  }, [hasCanPickUpValue, effectiveCanPickUp, storesLoading, isRecalculatingPickup, forceRefreshStores]);
  // IMPORTANTE: NO incluir stores.length ni availableStoresWhenCanPickUpFalse.length en dependencias
  // para evitar que se ejecute múltiples veces cuando las tiendas se cargan
  // Usamos refs (storesLengthRef, availableStoresWhenCanPickUpFalseLengthRef) para leer valores actuales

  // IMPORTANTE: Precargar tiendas en segundo plano cuando hay Trade In activo
  // Esto asegura que las tiendas estén listas cuando el usuario seleccione "Recoger en tienda"
  React.useEffect(() => {
    // PROTECCIÓN: No cargar si hay un cambio de dirección en proceso desde el navbar
    const globalProcessing = typeof globalThis.window !== 'undefined' 
      ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
      : null;
    
    if (globalProcessing) {
      // Si hay un cambio de dirección en proceso, useDelivery ya está manejando la carga
      return;
    }
    
    // Si hay Trade In activo y no hay tiendas cargadas, FORZAR recarga
    const shouldLoadStores = hasActiveTradeIn && 
                             stores.length === 0 && 
                             availableStoresWhenCanPickUpFalse.length === 0 &&
                             !storesLoading;
    
    if (shouldLoadStores) {
      // Usar forceRefreshStores para ignorar protecciones y forzar la carga
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

  // También forzar recarga cuando el usuario selecciona "Recoger en tienda" y (canPickUp es true O hay Trade In activo)
  React.useEffect(() => {
    // PROTECCIÓN: No cargar si hay un cambio de dirección en proceso desde el navbar
    const globalProcessing = typeof globalThis.window !== 'undefined' 
      ? (globalThis.window as unknown as { __imagiqAddressProcessing?: string }).__imagiqAddressProcessing
      : null;
    
    if (globalProcessing) {
      // Si hay un cambio de dirección en proceso, useDelivery ya está manejando la carga
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
  React.useEffect(() => {
    // Solo cambiar si NO hay trade-in activo
    if (hasActiveTradeIn) {
      return; // Con trade-in, siempre debe ser tienda
    }

    // Si canPickUp es false O si terminó de cargar y no hay tiendas disponibles
    // Verificar: canPickUp es false, o terminó de cargar sin tiendas
    const canPickUpIsFalse = effectiveCanPickUp === false;
    const finishedLoadingNoStores = !storesLoading && stores.length === 0 && effectiveCanPickUp !== true;
    const noStoresAvailable = canPickUpIsFalse || finishedLoadingNoStores;

    // Si no hay tiendas disponibles y el método actual es "tienda", cambiar a "domicilio"
    if (noStoresAvailable && deliveryMethod === "tienda") {
      setDeliveryMethod("domicilio");
    }
  }, [hasActiveTradeIn, effectiveCanPickUp, stores.length, storesLoading, deliveryMethod, setDeliveryMethod]);

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
      setTradeInData(null);
      
      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description: "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    }
  }, [products]);

  const handleContinue = () => {
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
  const handleAddressChange = async (newAddress: Direccion) => {
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
        // Convertir Direccion a Address para usar la utility centralizada
        const addressFormat = direccionToAddress(newAddress);

        // Usar utility centralizada para sincronizar dirección
        await syncAddress({
          address: addressFormat,
          userEmail: user?.email || newAddress.email,
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
    // Si hay trade-in activo, no permitir cambiar a domicilio
    if (hasActiveTradeIn && method === "domicilio") {
      return; // No hacer nada, mantener en tienda
    }
    // setDeliveryMethod ya guarda automáticamente en localStorage
    setDeliveryMethod(method);
  };

  const selectedStoreChanged = (store: typeof selectedStore) => {
    setSelectedStore(store);
    localStorage.setItem("checkout-store", JSON.stringify(store));
    // Guardar también la dirección actual para verificar si cambió después
    if (address?.id && globalThis.window) {
      globalThis.window.localStorage.setItem("checkout-store-address-id", address.id);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forma de entrega */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-6">
              <DeliveryMethodSelector
                deliveryMethod={deliveryMethod}
                onMethodChange={handleDeliveryMethodChange}
                canContinue={canContinue}
                disableHomeDelivery={hasActiveTradeIn}
                disableReason={hasActiveTradeIn ? "Para aplicar el beneficio Estreno y Entrego solo puedes recoger en tienda" : undefined}
                disableStorePickup={!effectiveCanPickUp && !hasActiveTradeIn}
                disableStorePickupReason={!effectiveCanPickUp && !hasActiveTradeIn ? "Este producto no está disponible para recoger en tienda" : undefined}
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
                />
              </div>

              {/* Mostrar skeleton cuando:
                  1. Está cargando canPickUp (isLoadingCanPickUp es true)
                  2. O está cargando tiendas (storesLoading es true)
                  3. O cuando estamos recalculando el pickup después de cambiar la dirección
                  4. O cuando canPickUp es true pero aún no tenemos el valor (hasCanPickUpValue es false) */}
              {/* PRIORIDAD: El skeleton se muestra mientras carga canPickUp, tiendas, o mientras recalcula después de cambio de dirección */}
              {/* IMPORTANTE: El skeleton se mantiene hasta que canPickUp esté calculado Y las tiendas terminen de cargar */}
              {(isLoadingCanPickUp || 
                storesLoading || 
                isRecalculatingPickup ||
                (effectiveCanPickUp === true && !hasCanPickUpValue)) && (
                <div className="mt-6">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              )}

              {/* Mostrar selector de tiendas si:
                  - El método es "tienda" 
                  - Y (canPickUp global es true O hay trade-in activo O hay tiendas disponibles cuando canPickUp es false)
                  - Solo se muestra cuando NO está cargando y NO está recalculando
                  - IMPORTANTE: Siempre mostrar si hay tiendas disponibles, independientemente de canPickUp */}
              {deliveryMethod === "tienda" && 
               !storesLoading && 
               !isRecalculatingPickup && 
               (effectiveCanPickUp || hasActiveTradeIn || availableStoresWhenCanPickUpFalse.length > 0) && (
                <div className="mt-6">
                  <StoreSelector
                    storeQuery={storeQuery}
                    filteredStores={effectiveCanPickUp ? filteredStores : availableStoresWhenCanPickUpFalse}
                    selectedStore={selectedStore}
                    onQueryChange={setStoreQuery}
                    onStoreSelect={selectedStoreChanged}
                    storesLoading={storesLoading}
                    canPickUp={effectiveCanPickUp}
                    allStores={effectiveCanPickUp ? stores : availableStoresWhenCanPickUpFalse}
                    onAddressAdded={addAddress}
                    onRefreshStores={forceRefreshStores}
                    availableCities={availableCities}
                    hasActiveTradeIn={hasActiveTradeIn}
                    availableStoresWhenCanPickUpFalse={availableStoresWhenCanPickUpFalse}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Resumen de compra y Trade-In */}
          <aside className="lg:col-span-1 space-y-4">
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
              onCanPickUpReady={(canPickUpValue, isLoading) => {
                // Recibir el estado de canPickUp desde Step4OrderSummary
                // canPickUpValue es el valor real de canPickUp global
                // isLoading indica si todavía está cargando
                // Actualizar siempre que tengamos un valor válido (boolean)
                // Esto asegura que Step3 use el canPickUp global correcto
                setIsLoadingCanPickUp(isLoading);
                if (typeof canPickUpValue === 'boolean') {
                  setGlobalCanPickUpFromSummary(canPickUpValue);
                }
              }}
            />

            {/* Banner de Trade-In - Debajo del resumen (baja con el scroll) */}
            {tradeInData?.completed && (
              <TradeInCompletedSummary
                deviceName={tradeInData.deviceName}
                tradeInValue={tradeInData.value}
                onEdit={handleRemoveTradeIn}
                validationError={tradeInValidation.isValid === false ? getTradeInValidationMessage(tradeInValidation) : undefined}
                showStorePickupMessage={deliveryMethod === "tienda" || hasActiveTradeIn}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
