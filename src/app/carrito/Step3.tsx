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
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const { products, appliedDiscount, calculations } = useCart();
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
    refreshStores,
    addressLoading,
    availableCities,
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
    
    // SEGUNDO: Forzar cambio a "domicilio" DESPUÉS de eliminar el trade-in
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
    
    // Resetear los flags después de un delay MÁS LARGO para asegurar que todo se procese
    setTimeout(() => {
      justRemovedTradeInRef.current = false;
      if (globalThis.window) {
        globalThis.window.dispatchEvent(
          new CustomEvent("removing-trade-in", { detail: { removing: false } })
        );
      }
    }, 3000); // AUMENTADO a 3 segundos para asegurar que todo se procese
  };

  // IMPORTANTE: Si hay trade-in activo, solo permitir recoger en tienda
  const hasActiveTradeIn = tradeInData?.completed === true;

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

  // Verificar indRetoma para cada producto único en segundo plano (sin mostrar nada en UI)
  React.useEffect(() => {
    if (products.length === 0) return;

    const verifyTradeIn = async () => {
      // Obtener SKUs únicos (sin duplicados)
      const uniqueSkus = Array.from(
        new Set(products.map((p) => p.sku))
      );

      // Filtrar productos que necesitan verificación (solo si no tienen indRetoma definido Y no fueron verificados antes)
      // PROTECCIÓN: NO verificar SKUs que ya fallaron anteriormente
      const productsToVerify = uniqueSkus.filter((sku) => {
        const product = products.find((p) => p.sku === sku);
        const needsVerification = product && product.indRetoma === undefined;
        const notVerifiedYet = !verifiedSkusRef.current.has(sku);
        const notFailedBefore = !failedSkusRef.current.has(sku); // PROTECCIÓN: no reintentar fallos
        return needsVerification && notVerifiedYet && notFailedBefore;
      });

      if (productsToVerify.length === 0) return;

      // Verificar cada SKU único en segundo plano
      for (let i = 0; i < productsToVerify.length; i++) {
        const sku = productsToVerify[i];

        // PROTECCIÓN: Verificar si este SKU ya falló antes (ANTES del delay y try)
        if (failedSkusRef.current.has(sku)) {
          console.error(`🚫 SKU ${sku} ya falló anteriormente. NO se reintentará para evitar sobrecargar la base de datos.`);
          verifiedSkusRef.current.add(sku); // Marcar como verificado para no intentar de nuevo
          continue; // Saltar este SKU
        }

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        try {
          const response = await tradeInEndpoints.checkSkuForTradeIn({ sku });
          if (!response.success || !response.data) {
            // Si falla la petición, marcar como fallido
            failedSkusRef.current.add(sku);
            console.error(`🚫 Petición falló para SKU ${sku}. NO se reintentará automáticamente para proteger la base de datos.`);
            verifiedSkusRef.current.add(sku);
            continue;
          }
          const result = response.data;
          const indRetoma = result.indRetoma ?? (result.aplica ? 1 : 0);

          // Marcar SKU como verificado ANTES de actualizar localStorage (evita loop)
          verifiedSkusRef.current.add(sku);
          // Limpiar de fallos si existía
          failedSkusRef.current.delete(sku);

          // Actualizar localStorage con el resultado
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
          window.dispatchEvent(customEvent);
          window.dispatchEvent(new Event("storage"));
        } catch (error) {
          // Si hay un error en el catch, también marcar como fallido
          failedSkusRef.current.add(sku);
          console.error(
            `🚫 Error al verificar trade-in para SKU ${sku} - Petición bloqueada para evitar sobrecargar BD:`,
            error
          );
          console.error(`🚫 SKU ${sku} NO se reintentará automáticamente.`);
          // También marcar como verificado en caso de error para no reintentar infinitamente
          verifiedSkusRef.current.add(sku);
        }
      }
    };

    verifyTradeIn();
  }, [products]);

  // Estado para controlar el loading manual cuando se espera canPickUp
  const [isWaitingForCanPickUp, setIsWaitingForCanPickUp] = React.useState(false);

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
      if (typeof window !== "undefined") {
        const currentMethod = localStorage.getItem("checkout-delivery-method");
        if (!currentMethod || currentMethod !== deliveryMethod) {
          localStorage.setItem("checkout-delivery-method", deliveryMethod);
          window.dispatchEvent(new CustomEvent("delivery-method-changed", { detail: { method: deliveryMethod } }));
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
    if (!validation.isValid && validation.errorMessage && validation.errorMessage.includes("Te removimos")) {
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
    if (typeof window !== "undefined") {
      const currentMethod = localStorage.getItem("checkout-delivery-method");
      // Si no existe o es diferente al método actual, guardarlo
      if (!currentMethod || currentMethod !== deliveryMethod) {
        localStorage.setItem("checkout-delivery-method", deliveryMethod);
        // Disparar evento para notificar el cambio
        window.dispatchEvent(new CustomEvent("delivery-method-changed", { detail: { method: deliveryMethod } }));
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
                disableStorePickup={!canPickUp && !hasActiveTradeIn}
                disableStorePickupReason={!canPickUp && !hasActiveTradeIn ? "Este producto no está disponible para recoger en tienda" : undefined}
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
              <div className="mt-6">
                <StorePickupSelector
                  deliveryMethod={deliveryMethod}
                  onMethodChange={handleDeliveryMethodChange}
                  disabled={!canPickUp && !hasActiveTradeIn}
                />
              </div>

              {/* Mostrar selector de tiendas solo si:
                  - El método es "tienda" Y canPickUp global es true
                  - O hay trade-in activo (siempre permitir recoger en tienda) */}
              {deliveryMethod === "tienda" && (canPickUp || hasActiveTradeIn) && (
                <div className="mt-6">
                  <StoreSelector
                    storeQuery={storeQuery}
                    filteredStores={filteredStores}
                    selectedStore={selectedStore}
                    onQueryChange={setStoreQuery}
                    onStoreSelect={selectedStoreChanged}
                    storesLoading={storesLoading}
                    canPickUp={canPickUp}
                    allStores={stores}
                    onAddressAdded={addAddress}
                    onRefreshStores={refreshStores}
                    availableCities={availableCities}
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
              deliveryMethod={
                deliveryMethod === "tienda"
                  ? "pickup"
                  : deliveryMethod === "domicilio"
                  ? "delivery"
                  : deliveryMethod === "delivery" || deliveryMethod === "pickup"
                  ? deliveryMethod
                  : undefined
              }
            />

            {/* Banner de Trade-In - Debajo del resumen (baja con el scroll) */}
            {tradeInData?.completed && (
              <TradeInCompletedSummary
                deviceName={tradeInData.deviceName}
                tradeInValue={tradeInData.value}
                onEdit={handleRemoveTradeIn}
                validationError={!tradeInValidation.isValid ? getTradeInValidationMessage(tradeInValidation) : undefined}
                showStorePickupMessage={deliveryMethod === "tienda" || hasActiveTradeIn}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
