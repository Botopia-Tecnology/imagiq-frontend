"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import {
  CreditCard,
  MapPin,
  FileText,
  Truck,
  Store,
  Edit2,
  User as UserIcon,
} from "lucide-react";
import { useAuthContext } from "@/features/auth/context";
import { profileService } from "@/services/profile.service";
import { toast } from "sonner";
import { DBCard, DecryptedCardData } from "@/features/profile/types";
import { encryptionService } from "@/lib/encryption";
import CardBrandLogo from "@/components/ui/CardBrandLogo";
import { payWithAddi, payWithCard, payWithPse, fetchBanks } from "./utils";
import { useCart } from "@/hooks/useCart";
import {
  validateTradeInProducts,
  getTradeInValidationMessage,
} from "./utils/validateTradeIn";
import { CheckZeroInterestResponse, BeneficiosDTO } from "./types";
import { apiPost } from "@/lib/api-client";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { productEndpoints, deliveryEndpoints } from "@/lib/api";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";
import RegisterGuestPasswordModal from "./components/RegisterGuestPasswordModal";

declare global {
  interface Window {
    validate3ds: (data: unknown) => void;
  }
}

interface Step7Props {
  readonly onBack?: () => void;
}

interface StoreValidationResponse {
  codBodega?: string;
  nearest?: {
    codBodega?: string;
  };
}

type StoreValidationData = StoreValidationResponse | StoreValidationResponse[];

interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  brand?: string;
  cardType?: string;
  bank?: string;
}

interface PaymentData {
  method: string;
  cardData?: CardData;
  savedCard?: DBCard;
  bank?: string;
  bankName?: string;
  installments?: number;
}

interface ShippingData {
  type: "delivery" | "pickup";
  address?: string;
  city?: string;
  store?: {
    name: string;
    address?: string;
    city?: string;
    schedule?: string;
  };
}

interface ShippingVerification {
  envio_imagiq: boolean;
  todos_productos_im_it: boolean;
  en_zona_cobertura: boolean;
}

interface BillingData {
  type: "natural" | "juridica";
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
  direccion: {
    id: string;
    codigo_dane: string;
    pais: string;
    usuario_id: string;
    linea_uno: string;
    ciudad: string;
  };
  // Campos de persona jurídica
  razonSocial?: string;
  nit?: string;
  nombreRepresentante?: string;
  tipoDocumento: string;
}

export default function Step7({ onBack }: Step7Props) {
  const router = useRouter();
  const authContext = useAuthContext();
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref para rastrear peticiones fallidas a getCandidateStores (evita reintentos)
  const failedCandidateStoresRef = React.useRef<string | null>(null);

  // Estados para datos de resumen
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [recipientData, setRecipientData] = useState<{
    receivedByClient: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null>(null);
  const [zeroInterestData, setZeroInterestData] =
    useState<CheckZeroInterestResponse | null>(null);
  const [shippingVerification, setShippingVerification] =
    useState<ShippingVerification | null>(null);
  const { products, calculations } = useCart();
  const [error, setError] = useState<string | string[] | null>(null);
  const [isLoadingShippingMethod, setIsLoadingShippingMethod] = useState(false);
  // NUEVO: Estado separado para skeleton (solo espera canPickUp) y botón (espera cálculo de envío)
  const [isLoadingCanPickUp, setIsLoadingCanPickUp] = useState(false);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  // Estado para guardar el código de bodega de candidate-stores
  const [candidateWarehouseCode, setCandidateWarehouseCode] = useState<string | undefined>();
  // Ref para leer el valor actual de isCalculatingShipping en callbacks
  const isCalculatingShippingRef = React.useRef(false);

  // Actualizar ref cuando cambie el estado
  React.useEffect(() => {
    isCalculatingShippingRef.current = isCalculatingShipping;
  }, [isCalculatingShipping]);
  const [loggedUser] = useSecureStorage<User | null>(
    "imagiq_user",
    null
  );
  
  // Estado para el modal de registro de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(false); // Para saber si debemos proceder con la orden después del registro
  
  // Debug: Monitorear cambios en showPasswordModal
  React.useEffect(() => {
    console.log("🔍 [STEP7] showPasswordModal cambió a:", showPasswordModal);
  }, [showPasswordModal]);
  
  // CRÍTICO: Leer dirección desde localStorage normal, NO desde useSecureStorage
  // porque se guarda en localStorage.setItem("checkout-address") en Step3
  const [checkoutAddress, setCheckoutAddress] = useState<{
    "id": string,
    "usuario_id": string,
    "email": string,
    "linea_uno": string,
    "codigo_dane": string,
    "ciudad": string,
    "pais": string,
    "esPredeterminada": boolean
  } | null>(null);

  // Cargar dirección desde localStorage al montar el componente
  useEffect(() => {
    try {
      const addressStr = localStorage.getItem('checkout-address');
      if (addressStr) {
        const parsed = JSON.parse(addressStr);
        console.log("📍 [Step7 - Init] Dirección cargada desde localStorage:", parsed);
        console.log("📍 [Step7 - Init] UUID de dirección:", parsed.id);
        setCheckoutAddress(parsed);
      } else {
        console.warn("⚠️ [Step7 - Init] No se encontró checkout-address en localStorage");
      }
    } catch (error) {
      console.error("❌ [Step7 - Init] Error al cargar checkout-address:", error);
    }
  }, []);

  // Store/Warehouse validation state
  const [isCentroDistribucion, setIsCentroDistribucion] = useState<boolean | null>(null);
  const [isLoadingStoreValidation, setIsLoadingStoreValidation] = useState(false);

  // 3DS Modal state - Not used anymore, kept for backward compatibility
  // const [show3DSModal, setShow3DSModal] = useState(false);
  // const [challengeData, setChallengeData] = useState<{
  //   acsURL: string;
  //   encodedCReq: string;
  //   threeDSServerTransID?: string;
  //   acsTransID?: string;
  // } | null>(null);
  // const [currentOrderId, setCurrentOrderId] = useState<string>("");

  // Trade-In state management
  const [tradeInData, setTradeInData] = useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // Cargar datos de localStorage
  useEffect(() => {
    const loadPaymentData = async () => {
      // Cargar método de pago
      const paymentMethod = localStorage.getItem("checkout-payment-method");
      const savedCardId = localStorage.getItem("checkout-saved-card-id");
      const cardDataStr = localStorage.getItem("checkout-card-data");
      const selectedBank = localStorage.getItem("checkout-selected-bank");
      const installments = localStorage.getItem("checkout-installments");

      if (paymentMethod) {
        let cardData: CardData | undefined;
        let savedCard: DBCard | undefined;

        // Si usó una tarjeta guardada, cargar sus datos completos
        // Usar authContext o loggedUser (para usuarios sin sesión activa pero con cuenta creada en Step2)
        const userId = authContext.user?.id || loggedUser?.id;
        if (savedCardId && userId) {
          try {
            const encryptedCards =
              await profileService.getUserPaymentMethodsEncrypted(userId);

            const decryptedCards: DBCard[] = encryptedCards
              .map((encCard) => {
                const decrypted =
                  encryptionService.decryptJSON<DecryptedCardData>(
                    encCard.encryptedData
                  );
                if (!decrypted) return null;

                return {
                  id: decrypted.cardId as unknown as string,
                  ultimos_dijitos: decrypted.last4Digits,
                  marca: decrypted.brand?.toLowerCase() || undefined,
                  banco: decrypted.banco || undefined,
                  tipo_tarjeta: decrypted.tipo || undefined,
                  es_predeterminada: false,
                  activa: true,
                  nombre_titular: decrypted.cardHolderName || undefined,
                } as DBCard;
              })
              .filter((card): card is DBCard => card !== null);

            savedCard = decryptedCards.find(
              (card) => String(card.id) === savedCardId
            );
          } catch (error) {
            console.error("Error loading saved card:", error);
          }
        }
        // Si hay datos de tarjeta nueva ingresados
        else if (cardDataStr) {
          try {
            cardData = JSON.parse(cardDataStr);
          } catch (error) {
            console.error("Error parsing card data:", error);
          }
        }

        // selectedBank can be a JSON string { code, name } or a plain code string
        let bankCode: string | undefined = undefined;
        let bankName: string | undefined = undefined;
        if (selectedBank) {
          try {
            const parsed = JSON.parse(selectedBank);
            if (parsed && typeof parsed === "object" && "code" in parsed) {
              bankCode = parsed.code || undefined;
              bankName = parsed.name || undefined;
            } else {
              bankCode = String(selectedBank);
            }
          } catch {
            bankCode = selectedBank;
          }
          // If we have a code but no name, try to resolve the name from the banks API
          if (bankCode && !bankName) {
            try {
              const banks = await fetchBanks();
              const found = banks.find(
                (b) => String(b.bankCode) === String(bankCode)
              );
              if (found) bankName = found.bankName;
            } catch {
              // ignore failure to fetch banks
            }
          }
        }

        setPaymentData({
          method: paymentMethod,
          cardData,
          savedCard,
          bank: bankCode,
          bankName,
          installments: installments
            ? Number.parseInt(installments)
            : undefined,
        });
      }
    };

    loadPaymentData();

    // Cargar datos de cuotas sin interés
    try {
      const stored = localStorage.getItem("checkout-zero-interest");
      if (stored) {
        const parsed = JSON.parse(stored) as CheckZeroInterestResponse;
        setZeroInterestData(parsed);
      }
    } catch (error) {
      console.error("Error loading zero interest data:", error);
    }

    // Cargar dirección de envío
    // Determinar método de entrega seleccionado
    const deliveryMethod =
      localStorage.getItem("checkout-delivery-method") || "domicilio";

    if (deliveryMethod === "tienda") {
      const storeStr = localStorage.getItem("checkout-store");
      if (storeStr) {
        try {
          const parsedStore = JSON.parse(storeStr);
          setShippingData({
            type: "pickup",
            store: {
              name:
                parsedStore.descripcion ||
                parsedStore.nombre ||
                "Tienda seleccionada",
              address: parsedStore.direccion,
              city: parsedStore.ciudad || parsedStore.departamento,
              schedule: parsedStore.horario,
            },
          });
        } catch (error) {
          console.error("Error parsing checkout-store:", error);
          setShippingData({
            type: "pickup",
          });
        }
      } else {
        setShippingData({
          type: "pickup",
        });
      }
    } else {
      const shippingAddress = localStorage.getItem("checkout-address");
      if (shippingAddress) {
        try {
          const parsed = JSON.parse(shippingAddress);
          console.log("📍 [Step7 - useEffect] Dirección de envío cargada desde localStorage:", parsed);
          console.log("📍 [Step7 - useEffect] UUID de dirección:", parsed.id);
          console.log("📍 [Step7 - useEffect] Usuario ID (de dirección):", parsed.usuario_id);
          console.log("📍 [Step7 - useEffect] Línea uno:", parsed.linea_uno);
          console.log("📍 [Step7 - useEffect] Ciudad:", parsed.ciudad);
          console.log("📍 [Step7 - useEffect] Código DANE:", parsed.codigo_dane);
          setShippingData({
            type: "delivery",
            address: parsed.linea_uno,
            city: parsed.ciudad,
          });
        } catch (error) {
          console.error("Error parsing shipping address:", error);
        }
      } else {
        console.warn("⚠️ [Step7 - useEffect] No se encontró dirección en localStorage (checkout-address)");
      }
    }

    // Cargar datos de facturación
    const billingDataStr = localStorage.getItem("checkout-billing-data");
    if (billingDataStr) {
      try {
        const parsed = JSON.parse(billingDataStr);
        setBillingData(parsed);
      } catch (error) {
        console.error("Error parsing billing data:", error);
      }
    }

    // Cargar datos del receptor
    try {
      const receivedByClientStr = localStorage.getItem("checkout-received-by-client");
      const recipientDataStr = localStorage.getItem("checkout-recipient-data");
      // Leemos también billing data para tener los datos del cliente si él recibe
      const billingDataStr = localStorage.getItem("checkout-billing-data");
      const userStr = localStorage.getItem("imagiq_user");

      const receivedByClient = receivedByClientStr ? JSON.parse(receivedByClientStr) : true;

      if (!receivedByClient && recipientDataStr) {
        const parsed = JSON.parse(recipientDataStr);
        setRecipientData({
          receivedByClient: false,
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          email: parsed.email,
          phone: parsed.phone,
        });
      } else {
        // Si recibe el cliente, intentamos poblar con sus datos de facturación o usuario
        let clientFirstName = "";
        let clientLastName = "";
        let clientEmail = "";
        let clientPhone = "";

        if (billingDataStr) {
          try {
            const billing = JSON.parse(billingDataStr);
            // Intentar separar nombre y apellido si vienen juntos
            const nameParts = (billing.nombre || "").trim().split(" ");
            if (nameParts.length > 0) {
              clientFirstName = nameParts[0];
              clientLastName = nameParts.slice(1).join(" ");
            }
            clientEmail = billing.email || "";
            clientPhone = billing.telefono || "";
          } catch (e) { console.error("Error parsing billing for recipient", e); }
        } else if (userStr) {
          try {
            const user = JSON.parse(userStr);
            clientFirstName = user.nombre || "";
            clientLastName = user.apellido || "";
            clientEmail = user.email || "";
            clientPhone = user.telefono || user.celular || "";
          } catch (e) { console.error("Error parsing user for recipient", e); }
        }

        setRecipientData({
          receivedByClient: true,
          firstName: clientFirstName,
          lastName: clientLastName,
          email: clientEmail,
          phone: clientPhone,
        });
      }
    } catch (error) {
      console.error("Error parsing recipient data:", error);
      setRecipientData({ receivedByClient: true });
    }

    // Load Trade-In data
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const parsed = JSON.parse(storedTradeIn);
        if (parsed.completed) {
          setTradeInData(parsed);
        }
      } catch (error) {
        console.error("Error parsing Trade-In data:", error);
      }
    }
  }, [authContext.user?.id, loggedUser?.id]);

  // Handle Trade-In removal
  const handleRemoveTradeIn = () => {
    localStorage.removeItem("imagiq_trade_in");
    setTradeInData(null);

    // Si se elimina el trade-in y el método está en "tienda", cambiar a "domicilio"
    if (typeof globalThis.window !== "undefined") {
      const currentMethod = globalThis.window.localStorage.getItem("checkout-delivery-method");
      if (currentMethod === "tienda") {
        globalThis.window.localStorage.setItem("checkout-delivery-method", "domicilio");
        globalThis.window.dispatchEvent(
          new CustomEvent("delivery-method-changed", { detail: { method: "domicilio" } })
        );
        globalThis.window.dispatchEvent(new Event("storage"));
      }
    }
  };

  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof products;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Validar Trade-In cuando cambian los productos
  useEffect(() => {
    const validation = validateTradeInProducts(products);
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
      setTradeInData(null);

      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description:
          "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    }
  }, [products]);

  // Redirigir a Step3 si la dirección cambia desde el header
  useEffect(() => {
    const handleAddressChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const fromHeader = customEvent.detail?.fromHeader;

      if (fromHeader) {
        console.log(
          "🔄 Dirección cambiada desde header en Step7, redirigiendo a Step3..."
        );
        router.push("/carrito/step3");
      } else {
        // Si cambia la dirección (pero no desde header), actualizar el estado
        try {
          const addressStr = localStorage.getItem('checkout-address');
          if (addressStr) {
            const parsed = JSON.parse(addressStr);
            console.log("🔄 [Step7] Dirección actualizada desde evento:", parsed);
            setCheckoutAddress(parsed);
          }
        } catch (error) {
          console.error("❌ [Step7] Error al actualizar dirección:", error);
        }
      }
    };

    // Escuchar cambios en localStorage también
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'checkout-address' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          console.log("🔄 [Step7] Dirección actualizada desde storage event:", parsed);
          setCheckoutAddress(parsed);
        } catch (error) {
          console.error("❌ [Step7] Error al parsear dirección de storage:", error);
        }
      }
    };

    globalThis.window.addEventListener(
      "address-changed",
      handleAddressChange as EventListener
    );
    globalThis.window.addEventListener("storage", handleStorageChange);

    return () => {
      globalThis.window.removeEventListener(
        "address-changed",
        handleAddressChange as EventListener
      );
      globalThis.window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  // Verificar cobertura cuando los productos estén cargados
  useEffect(() => {
    const verifyWhenProductsReady = async () => {
      // Solo ejecutar si hay productos
      if (products.length === 0) {
        setIsLoadingShippingMethod(false);
        return;
      }

      // CRÍTICO: Iniciar loading
      // - isLoadingCanPickUp: Para el skeleton (espera solo canPickUp)
      // - isCalculatingShipping: Para el botón (espera cálculo de envío completo)
      setIsLoadingCanPickUp(true);
      setIsLoadingShippingMethod(true);
      setIsLoadingStoreValidation(true);

      // Bandera para saber si es pickup (solo verificar canPickUp, no calcular envío)
      const isPickupMethod = shippingData?.type === "pickup";

      // Si NO es pickup, también activar el cálculo de envío
      if (!isPickupMethod) {
        setIsCalculatingShipping(true);
      }

      // PASO 1: Obtener canPickUp global del endpoint candidate-stores
      try {
        const user = safeGetLocalStorage<{ id?: string; user_id?: string }>(
          "imagiq_user",
          {}
        );
        const userId = user?.id || user?.user_id;

        if (!userId) {
          const verification = {
            envio_imagiq: false,
            todos_productos_im_it: false,
            en_zona_cobertura: true,
          };
          setShippingVerification(verification);
          // Guardar en localStorage como respaldo
          localStorage.setItem("checkout-envio-imagiq", "false");
          setIsLoadingCanPickUp(false);
          setIsLoadingShippingMethod(false);
          setIsCalculatingShipping(false);
          return;
        }

        // Preparar TODOS los productos del carrito para una sola petición
        const productsToCheck = products.map((p) => ({
          sku: p.sku,
          quantity: p.quantity,
        }));

        // Crear hash único de la petición (productos + userId)
        const requestHash = JSON.stringify({
          products: productsToCheck,
          userId,
        });

        // PROTECCIÓN CRÍTICA: Si esta misma petición ya falló antes, NO reintentar
        if (failedCandidateStoresRef.current === requestHash) {
          console.error("🚫 Esta petición a candidate-stores ya falló anteriormente. NO se reintentará para evitar sobrecargar la base de datos.");
          // Usar Coordinadora por defecto
          setShippingVerification({
            envio_imagiq: false,
            todos_productos_im_it: false,
            en_zona_cobertura: true,
          });
          setIsLoadingCanPickUp(false);
          setIsLoadingShippingMethod(false);
          setIsCalculatingShipping(false);
          return;
        }

        // Llamar al endpoint con TODOS los productos agrupados
        const requestBody = {
          products: productsToCheck,
          user_id: userId,
        };
        console.log("📤 [Step7] Llamando getCandidateStores con TODO el carrito, body:", JSON.stringify(requestBody, null, 2));

        // Llamar SOLO a candidate-stores (que analiza TODO el carrito completo)
        const response = await productEndpoints.getCandidateStores(requestBody);

        console.log("📥 [Step7] Respuesta de getCandidateStores:", JSON.stringify(response.data, null, 2));

        if (response.success && response.data) {
          // Si la petición fue exitosa, limpiar el hash de fallo si existía
          if (failedCandidateStoresRef.current === requestHash) {
            failedCandidateStoresRef.current = null;
          }

          const responseData = response.data as {
            canPickUp?: boolean;
            canPickup?: boolean;
            codeBodega?: string;
            nearest?: {
              codBodega?: string;
            };
          };

          console.log("📥 [Step7] Respuesta de getCandidateStores:", JSON.stringify(responseData, null, 2));

          // Obtener codBodega de candidate-stores (analiza TODO el carrito)
          console.log("🔍 [Step7] responseData completo:", responseData);

          let warehouseCode: string | undefined;

          // candidate-stores devuelve la estructura con nearest que contiene la bodega más cercana
          // que puede surtir TODO el pedido completo
          if (responseData.nearest?.codBodega) {
            warehouseCode = responseData.nearest.codBodega;
            console.log("🔍 [Step7] codBodega tomado de responseData.nearest:", warehouseCode);
          } else if (responseData.codeBodega) {
            warehouseCode = responseData.codeBodega;
            console.log("🔍 [Step7] codBodega tomado de responseData.codeBodega:", warehouseCode);
          }

          console.log("🏭 [Step7] codBodega final (de candidate-stores):", warehouseCode);

          // Guardar en estado para usar al crear la orden
          setCandidateWarehouseCode(warehouseCode);

          // Obtener canPickUp global de la respuesta
          const globalCanPickUp =
            responseData.canPickUp ?? responseData.canPickup ?? false;

          console.log(`🔍 [Step7] canPickUp global: ${globalCanPickUp}, isPickupMethod: ${isPickupMethod}`);

          // Actualizar caché global para que Step4OrderSummary lo muestre
          try {
            const { buildGlobalCanPickUpKey, setGlobalCanPickUpCache } = await import('@/app/carrito/utils/globalCanPickUpCache');
            
            // Obtener dirección actual para la clave del caché
            let currentAddressId = null;
            const savedAddress = localStorage.getItem("checkout-address");
            if (savedAddress) {
              const parsed = JSON.parse(savedAddress);
              currentAddressId = parsed.id || null;
            }

            const cacheKey = buildGlobalCanPickUpKey({
              userId,
              products: productsToCheck,
              addressId: currentAddressId,
            });

            // Guardar en caché y notificar
            // casting a any porque responseData tiene una estructura compatible pero no idéntica a CandidateStoresResponse
            setGlobalCanPickUpCache(cacheKey, globalCanPickUp, responseData as any, currentAddressId);
            console.log("💾 [Step7] Caché global actualizado con respuesta de candidate-stores");
          } catch (cacheError) {
            console.error("❌ [Step7] Error actualizando caché global:", cacheError);
          }

          // CRÍTICO: Ya tenemos canPickUp, ocultar skeleton INMEDIATAMENTE
          setIsLoadingCanPickUp(false);
          setIsLoadingShippingMethod(false);
          console.log("✅ [Step7] canPickUp obtenido - Ocultando skeleton");

          // IMPORTANTE: Si es método pickup, solo validamos canPickUp y terminamos (no calcular cobertura)
          if (isPickupMethod) {
            console.log("🏪 [Step7] Método pickup - Solo verificación de canPickUp, no calcular cobertura");
            setIsCentroDistribucion(false);
            setIsLoadingStoreValidation(false);
            // No establecer shippingVerification porque no es necesario para pickup
            return;
          }

          // Si llegamos aquí, es método "delivery" → Continuar calculando cobertura en segundo plano
          console.log("📦 [Step7] Método delivery - Calculando cobertura en segundo plano");
          // El skeleton ya está oculto, pero el botón seguirá en loading hasta terminar

          // ---------------------------------------------------------------------------
          // NUEVO: Cotización Multi-Origen (Solo para Domicilio)
          try {
            // 1. Obtener ciudades de origen únicas de candidate-stores response
            const originCities = new Set<string>();

            // Interfaz auxiliar para evitar el uso de any
            interface StoreDataLike {
              ciudad?: string;
              city?: string;
              nearest?: { ciudad?: string; city?: string };
              stores?: StoreDataLike[];
            }

            // candidate-stores devuelve response.data que es CandidateStoresResponse
            // Intentar obtener ciudad desde la respuesta
            if (response.data) {
              // response.data es CandidateStoresResponse, por lo que tiene la propiedad stores
              // pero necesitamos asegurarnos de que TypeScript lo sepa
              const storesMap = (response.data as unknown as { stores: Record<string, StoreDataLike[]> }).stores;
              if (storesMap) {
                Object.values(storesMap).forEach((storesList) => {
                  if (Array.isArray(storesList)) {
                    storesList.forEach((s) => {
                      if (s.ciudad) originCities.add(s.ciudad);
                    });
                  }
                });
              }
            }

            console.log("🏙️ [Step7] Ciudades de origen encontradas:", Array.from(originCities));

            // 2. Obtener ciudad de destino
            const destinationCity = shippingData?.city ||
              (checkoutAddress?.codigo_dane || checkoutAddress?.ciudad);

            // 3. Llamar al endpoint si tenemos datos suficientes
            if (originCities.size > 0 && destinationCity) {
              console.log("🚚 [Step7] Iniciando cotización multi-origen...");

              // Preparar detalle de productos (asumiendo 1kg por unidad como solicitado)
              const quoteDetails = products.map(p => ({
                ubl: 0, // Valor por defecto
                alto: 10, // Valor por defecto
                ancho: 10, // Valor por defecto
                largo: 10, // Valor por defecto
                peso: p.quantity, // 1kg por unidad * cantidad
                unidades: p.quantity
              }));

              const quotePayload = {
                ciudades_origen: Array.from(originCities),
                ciudad_destino: destinationCity,
                cuenta: "1", // Valor por defecto
                producto: "0", // Valor por defecto
                valoracion: String(calculations.total || 100000), // Valor del carrito o default
                nivel_servicio: [1], // Valor por defecto
                detalle: quoteDetails
              };

              // Llamada asíncrona (no bloquea el flujo principal)
              deliveryEndpoints.quoteNationalMultiOrigin(quotePayload)
                .then(quoteResponse => {
                  if (quoteResponse.success) {
                    console.log("✅ [Step7] Cotización Multi-Origen Exitosa:", quoteResponse.data);
                    // Aquí se podría guardar en estado si se necesitara mostrar en UI
                    // setMultiOriginQuote(quoteResponse.data);
                  } else {
                    console.warn("⚠️ [Step7] Falló cotización multi-origen:", quoteResponse.message);
                  }
                })
                .catch(err => {
                  console.error("❌ [Step7] Error en cotización multi-origen:", err);
                });
            } else {
              console.log("⚠️ [Step7] No se pudo cotizar multi-origen: Faltan ciudades origen o destino", { originCities: Array.from(originCities), destinationCity });
            }
          } catch (quoteError) {
            console.error("❌ [Step7] Error inesperado en lógica de cotización:", quoteError);
          }
          // ---------------------------------------------------------------------------

          // PASO 2: Verificar si es Centro de Distribución
          const esCentroDistribucion = warehouseCode === "001";
          setIsCentroDistribucion(esCentroDistribucion);
          setIsLoadingStoreValidation(false);

          // Si NO es pickup y NO es Centro de Distribución, pre-configurar Coordinadora como fallback
          // pero dejar que continúe al PASO 3 para verificar cobertura real
          if (!globalCanPickUp && !esCentroDistribucion) {
            console.log("🏪 [Step7] NO es Centro de Distribución - Configurando Coordinadora como base pero verificando cobertura");
            // Configuración inicial (se sobrescribirá si el endpoint dice otra cosa)
            const verification = {
              envio_imagiq: false,
              todos_productos_im_it: false,
              en_zona_cobertura: true,
            };
            setShippingVerification(verification);
            localStorage.setItem("checkout-envio-imagiq", "false");
            // NO hacer return, continuar a la verificación
          }

          // PASO 3: SIEMPRE verificar cobertura Imagiq (incluso si canPickUp es false)
          // Esto asegura que siempre tengamos la información completa de verificación
          console.log("🔍 [Step7] Verificando cobertura Imagiq (canPickUp:", globalCanPickUp, ", esCentroDistribucion:", esCentroDistribucion, ")");
          const shippingAddress = localStorage.getItem("checkout-address");
          if (!shippingAddress) {
            const verification = {
              envio_imagiq: false,
              todos_productos_im_it: false,
              en_zona_cobertura: true,
            };
            setShippingVerification(verification);
            // Guardar en localStorage como respaldo
            localStorage.setItem("checkout-envio-imagiq", "false");
            setIsLoadingShippingMethod(false);
            return;
          }

          const parsed = JSON.parse(shippingAddress);
          const requestBody = {
            direccion_id: parsed.id,
            skus: products.map((p) => p.sku),
          };

          const data = await apiPost<ShippingVerification>(
            "/api/addresses/zonas-cobertura/verificar-por-id",
            requestBody
          );

          const verification = {
            envio_imagiq: data.envio_imagiq || false,
            todos_productos_im_it: data.todos_productos_im_it || false,
            en_zona_cobertura: data.en_zona_cobertura || false,
          };
          setShippingVerification(verification);
          // Guardar en localStorage como respaldo para asegurar que esté disponible al crear la orden
          localStorage.setItem("checkout-envio-imagiq", String(verification.envio_imagiq));
          setIsCalculatingShipping(false);
          console.log("✅ [Step7] Cálculo de envío completado - Habilitando botón");
        } else {
          // Si falla la petición, marcar este hash como fallido
          failedCandidateStoresRef.current = requestHash;
          console.error(`🚫 Petición a candidate-stores falló. Hash bloqueado: ${requestHash.substring(0, 50)}...`);
          console.error("🚫 Esta petición NO se reintentará automáticamente para proteger la base de datos.");
          // Si falla la petición de candidate-stores, usar Coordinadora
          console.log("🚛 Error en candidate-stores, usando Coordinadora");
          const verification = {
            envio_imagiq: false,
            todos_productos_im_it: false,
            en_zona_cobertura: true,
          };
          setShippingVerification(verification);
          // Guardar en localStorage como respaldo
          localStorage.setItem("checkout-envio-imagiq", "false");
          setIsLoadingCanPickUp(false);
          setIsLoadingShippingMethod(false);
          setIsCalculatingShipping(false);
        }
      } catch (error) {
        // Si hay un error en el catch, también marcar como fallido
        const productsToCheck = products.map((p) => ({
          sku: p.sku,
          quantity: p.quantity,
        }));
        const user = safeGetLocalStorage<{ id?: string; user_id?: string }>(
          "imagiq_user",
          {}
        );
        const userId = user?.id || user?.user_id;
        const requestHash = JSON.stringify({
          products: productsToCheck,
          userId,
        });

        failedCandidateStoresRef.current = requestHash;
        console.error(
          "🚫 Error verifying shipping coverage - Petición bloqueada para evitar sobrecargar BD:",
          error
        );
        console.error(`🚫 Hash bloqueado: ${requestHash.substring(0, 50)}...`);
        console.error("🚫 Esta petición NO se reintentará automáticamente.");
        // En caso de error, usar Coordinadora por defecto
        const verification = {
          envio_imagiq: false,
          todos_productos_im_it: false,
          en_zona_cobertura: true,
        };
        setShippingVerification(verification);
        // Guardar en localStorage como respaldo
        localStorage.setItem("checkout-envio-imagiq", "false");
        setIsLoadingStoreValidation(false);
        setIsLoadingCanPickUp(false);
        setIsLoadingShippingMethod(false);
        setIsCalculatingShipping(false);
      }
    };

    verifyWhenProductsReady();
  }, [products, shippingData]);

  // Calcular si la compra aplica para 0% interés y guardarlo en localStorage
  useEffect(() => {
    try {
      const computeAndStore = () => {
        // Leer objeto existente en localStorage (si existe)
        const storedStr = localStorage.getItem("checkout-zero-interest");
        let storedObj: Record<string, unknown> | null = null;
        if (storedStr) {
          try {
            storedObj = JSON.parse(storedStr);
          } catch {
            storedObj = null;
          }
        }

        // Determinar valor global 'aplica' (preferir datos ya cargados en zeroInterestData)
        const globalAplica =
          zeroInterestData?.aplica !== undefined
            ? zeroInterestData.aplica
            : storedObj?.aplica ?? false;

        // Obtener id de tarjeta seleccionada (preferir paymentData.savedCard)
        const savedCardId =
          paymentData?.savedCard?.id ??
          (localStorage.getItem("checkout-saved-card-id") || null);

        // Obtener cuotas seleccionadas
        const installmentsFromState = paymentData?.installments;
        const installmentsFromStorage = localStorage.getItem(
          "checkout-installments"
        );
        const installments = (() => {
          if (installmentsFromState !== null && installmentsFromState !== undefined) return Number(installmentsFromState);
          if (installmentsFromStorage) return Number.parseInt(installmentsFromStorage, 10);
          return undefined;
        })();

        let aplica_zero_interes = false;

        if (globalAplica && savedCardId && zeroInterestData?.cards) {
          const matched = zeroInterestData.cards.find(
            (c) => String(c.id) === String(savedCardId)
          );
          if (
            matched &&
            matched.eligibleForZeroInterest &&
            installments !== undefined &&
            matched.availableInstallments.includes(installments)
          ) {
            aplica_zero_interes = true;
          }
        }

        // Actualizar el objeto en localStorage sin eliminar otras propiedades
        const updatedObj = {
          ...(storedObj || (zeroInterestData ? { ...zeroInterestData } : {})),
          aplica_zero_interes,
        };

        try {
          localStorage.setItem(
            "checkout-zero-interest",
            JSON.stringify(updatedObj)
          );
        } catch (err) {
          console.error(
            "Error saving checkout-zero-interest to localStorage",
            err
          );
        }
      };

      computeAndStore();
    } catch (err) {
      console.error("Error computing aplica_zero_interes:", err);
    }
  }, [paymentData, zeroInterestData]);

  // Escuchar eventos de validación 3DS
  useEffect(() => {
    const handle3DSMessage = (event: MessageEvent) => {
      console.log("📨 [Step7] ========== MENSAJE RECIBIDO ==========");
      console.log("📨 [Step7] Origen:", event.origin);
      console.log("📨 [Step7] Datos completos:", JSON.stringify(event.data, null, 2));
      console.log("📨 [Step7] Tipo de datos:", typeof event.data);

      // Verificar que el evento tenga los datos esperados
      if (event.data && (event.data.success !== undefined || event.data.message)) {
        console.log("✅ [Step7] Mensaje 3DS válido detectado");
        console.log("🔐 [Step7] event.data.success:", event.data.success);
        console.log("🔐 [Step7] event.data.message:", event.data.message);
        console.log("🔐 [Step7] Proceso 3DS finalizado:", event.data);

        // Obtener orderId guardado
        const orderId = localStorage.getItem('pending_order_id');
        console.log("🔐 [Step7] OrderId desde localStorage:", orderId);

        if (event.data.success && orderId) {
          console.log("✅ [Step7] 3DS exitoso, redirigiendo a verificación:", orderId);
          // toast.success("Autenticación 3DS exitosa. Verificando pago...");
          // Redirigir a página de verificación
          router.push(`/verify-purchase/${orderId}`);
        } else if (!orderId) {
          console.error("❌ [Step7] No se encontró orderId en localStorage");
          // toast.error("Error: No se pudo verificar el pago");
          setIsProcessing(false);
        } else if (event.data.success === false) {
          console.error("❌ [Step7] 3DS rechazado explícitamente");
          toast.error("La autenticación 3DS falló o fue cancelada.");
          setIsProcessing(false);
        } else {
          console.warn("⚠️ [Step7] 3DS completado pero sin éxito claro:", event.data);
          toast.error("La autenticación 3DS falló o fue cancelada.");
          setIsProcessing(false);
        }
      } else {
        console.log("ℹ️ [Step7] Mensaje ignorado (no es de 3DS o no tiene estructura esperada)");
      }
      console.log("📨 [Step7] ========================================");
    };

    console.log("👂 [Step7] Listener de mensajes 3DS registrado");
    window.addEventListener("message", handle3DSMessage);
    return () => {
      console.log("🔇 [Step7] Listener de mensajes 3DS removido");
      window.removeEventListener("message", handle3DSMessage);
    };
  }, [router]);

  // Función que realmente procesa la orden (llamada después del modal o directamente)
  const processOrder = async () => {
    // Validar Trade-In antes de confirmar
    const validation = validateTradeInProducts(products);
    if (!validation.isValid) {
      alert(getTradeInValidationMessage(validation));
      return;
    }

    if (!billingData) {
      console.error("No billing data available");
      return;
    }

    // CRÍTICO: Si todavía está calculando el envío, esperar
    if (isCalculatingShippingRef.current) {
      console.log("⏳ [Step7] Usuario hizo clic pero todavía calculando envío - Esperando...");
      // El botón ya muestra "Calculando envío..." por el estado isCalculatingShipping
      // Esperar en un loop hasta que termine
      await new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          // Verificar el valor actual de la ref
          if (!isCalculatingShippingRef.current) {
            clearInterval(checkInterval);
            console.log("✅ [Step7] Cálculo de envío completado - Procediendo con la orden");
            resolve();
          }
        }, 100); // Verificar cada 100ms
      });
    }

    setIsProcessing(true);

    // Preparar información de facturación de forma segura
    const informacion_facturacion = {
      direccion_id: billingData.direccion?.id ?? "",
      email: billingData.email ?? "",
      nombre_completo: billingData.nombre ?? "",
      numero_documento: billingData.documento ?? "",
      tipo_documento: billingData.tipoDocumento ?? "",
      telefono: billingData.telefono ?? "",
      type: billingData.type ?? "",
      nit: billingData.nit,
      razon_social: billingData.razonSocial,
      representante_legal:
        billingData.nombreRepresentante || billingData.razonSocial,
    };

    try {
      // Helper to build beneficios array
      const buildBeneficios = (): BeneficiosDTO[] => {
        const beneficios: BeneficiosDTO[] = [];
        try {
          // Trade-In (entrego_y_estreno)
          const tradeStr = localStorage.getItem("imagiq_trade_in");
          if (tradeStr) {
            const parsedTrade = JSON.parse(tradeStr);
            if (parsedTrade?.completed) {
              beneficios.push({
                type: "entrego_y_estreno",
                dispositivo_a_recibir: parsedTrade.deviceName,
                valor_retoma: parsedTrade.value,
                detalles_dispositivo_a_recibir: parsedTrade.detalles,
              });
            }
          }

          // 0% interes
          const zeroStr = localStorage.getItem("checkout-zero-interest");
          if (zeroStr) {
            const parsedZero = JSON.parse(zeroStr);
            const aplicaZero =
              parsedZero?.aplica_zero_interes || parsedZero?.aplica;
            if (aplicaZero && paymentData?.method === "tarjeta") {
              const cardId =
                paymentData?.savedCard?.id ||
                localStorage.getItem("checkout-saved-card-id");
              const installments =
                paymentData?.installments ??
                Number.parseInt(
                  localStorage.getItem("checkout-installments") || "0"
                );
              const matched = parsedZero?.cards?.find(
                (c: {
                  id: string;
                  eligibleForZeroInterest: boolean;
                  availableInstallments: number[];
                }) => String(c.id) === String(cardId)
              );
              if (
                matched?.eligibleForZeroInterest &&
                matched.availableInstallments?.includes(Number(installments))
              ) {
                beneficios.push({ type: "0%_interes" });
              }
            }
          }
        } catch {
          // ignore
        }
        if (beneficios.length === 0) return [{ type: "sin_beneficios" }];
        return beneficios;
      };
      // Determinar método de envío y código de bodega
      const deliveryMethod = (
        localStorage.getItem("checkout-delivery-method") || "domicilio"
      ).toLowerCase();

      // Determinar metodo_envio: 1=Coordinadora, 2=Pickup, 3=Imagiq
      let metodo_envio = 1; // Por defecto Coordinadora

      if (deliveryMethod === "tienda") {
        metodo_envio = 2; // Pickup en tienda
      } else if (deliveryMethod === "domicilio") {
        // Verificar si es envío Imagiq desde shippingVerification o localStorage
        const envioImagiq =
          shippingVerification?.envio_imagiq === true ||
          localStorage.getItem("checkout-envio-imagiq") === "true";

        if (envioImagiq) {
          metodo_envio = 3; // Envío Imagiq
        } else {
          metodo_envio = 1; // Coordinadora
        }
      }

      // Log para debug - asegurar que el método de envío se está pasando correctamente
      console.log("📦 [Step7] Método de envío determinado:", {
        deliveryMethod,
        metodo_envio,
        envio_imagiq: shippingVerification?.envio_imagiq,
        shippingVerification: shippingVerification
      });

      // Validar que tenemos la dirección de envío
      console.log("� [Step7 - Validación] ========== VALIDACIÓN DE DIRECCIÓN ==========");
      console.log("🔍 [Step7 - Validación] checkoutAddress completo:", checkoutAddress);
      console.log("🔍 [Step7 - Validación] checkoutAddress?.id:", checkoutAddress?.id);
      console.log("🔍 [Step7 - Validación] Tipo de checkoutAddress?.id:", typeof checkoutAddress?.id);
      console.log("🔍 [Step7 - Validación] ¿Es undefined?:", checkoutAddress?.id === undefined);
      console.log("🔍 [Step7 - Validación] ¿Es null?:", checkoutAddress?.id === null);
      console.log("🔍 [Step7 - Validación] ¿Es string vacío?:", checkoutAddress?.id === "");
      console.log("🔍 [Step7 - Validación] Dirección de envío:", {
        direccionId: checkoutAddress?.id,
        linea_uno: checkoutAddress?.linea_uno,
        ciudad: checkoutAddress?.ciudad,
        codigo_dane: checkoutAddress?.codigo_dane
      });
      console.log("🔍 [Step7 - Validación] ============================================");

      if (!checkoutAddress?.id) {
        console.error("❌ [Step7 - Validación] ERROR: No se encontró el ID de la dirección");
        throw new Error("No se encontró la dirección de envío. Por favor, agrega una dirección antes de continuar.");
      }

      console.log("✅ [Step7 - Validación] Dirección válida con ID:", checkoutAddress.id);

      let codigo_bodega: string | undefined = undefined;
      if (deliveryMethod === "tienda") {
        // Para pickup: usar la tienda seleccionada
        try {
          const storeStr = localStorage.getItem("checkout-store");
          if (storeStr) {
            const parsedStore = JSON.parse(storeStr);
            codigo_bodega =
              parsedStore?.codBodega || parsedStore?.codigo || undefined;
          }
        } catch {
          // ignore
        }
      } else {
        // Para delivery: usar la bodega de candidate-stores
        // Esta bodega puede surtir TODO el pedido completo
        codigo_bodega = candidateWarehouseCode;
        console.log("🏭 [Step7] Usando bodega de candidate-stores para delivery:", codigo_bodega);
      }

      // Log final antes de enviar al backend
      console.log("📤 [Step7] Datos que se enviarán al backend:", {
        direccionId: checkoutAddress?.id,
        userId: authContext.user?.id || String(loggedUser?.id),
        codigo_bodega,
        metodo_envio,
        totalAmount: calculations.total,
        shippingAmount: calculations.shipping
      });

      // ========================================
      // 🔍 LOGS DETALLADOS DE DIRECCIÓN
      // ========================================
      console.log("🏠 [Step7] ========== INFORMACIÓN DE DIRECCIÓN ==========");
      console.log("🏠 [Step7] Dirección completa desde checkoutAddress:", checkoutAddress);
      console.log("🏠 [Step7] UUID de dirección (userInfo.direccionId):", checkoutAddress?.id);
      console.log("🏠 [Step7] UUID de dirección (informacion_facturacion.direccion_id):", informacion_facturacion.direccion_id);
      console.log("🏠 [Step7] Línea uno:", checkoutAddress?.linea_uno);
      console.log("🏠 [Step7] Ciudad:", checkoutAddress?.ciudad);
      console.log("🏠 [Step7] Código DANE:", checkoutAddress?.codigo_dane);
      console.log("🏠 [Step7] País:", checkoutAddress?.pais);
      console.log("🏠 [Step7] Usuario ID (de la dirección):", checkoutAddress?.usuario_id);
      console.log("🏠 [Step7] Usuario ID (del contexto):", authContext.user?.id || loggedUser?.id);
      console.log("🏠 [Step7] =============================================");

      switch (paymentData?.method) {
        case "tarjeta": {
          console.log("💳 [Step7] ========== PAGO CON TARJETA ==========");
          console.log("💳 [Step7] userInfo.direccionId enviado:", checkoutAddress?.id || "");
          console.log("💳 [Step7] userInfo.userId enviado:", authContext.user?.id || String(loggedUser?.id));
          console.log("💳 [Step7] informacion_facturacion.direccion_id enviado:", informacion_facturacion.direccion_id);
          console.log("💳 [Step7] metodo_envio:", metodo_envio);
          console.log("💳 [Step7] codigo_bodega:", codigo_bodega);
          console.log("💳 [Step7] ==========================================");

          const res = await payWithCard({
            currency: "COP",
            dues: String(paymentData.installments || "1"),
            items: products.map((p) => ({
              id: String(p.id),
              sku: String(p.sku),
              name: String(p.name),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: p.skuPostback || p.sku || "",
              desDetallada: p.desDetallada || p.name || "",
              ean: p.ean && p.ean !== "" ? String(p.ean) : String(p.sku),
              ...(p.bundleInfo && {
                bundleInfo: {
                  codCampana: p.bundleInfo.codCampana,
                  productSku: p.bundleInfo.productSku,
                  skusBundle: p.bundleInfo.skusBundle,
                  bundlePrice: p.bundleInfo.bundlePrice,
                  bundleDiscount: p.bundleInfo.bundleDiscount,
                  fechaFinal: p.bundleInfo.fechaFinal,
                },
              }),
            })),
            totalAmount: String(calculations.total),
            metodo_envio,
            codigo_bodega,
            shippingAmount: String(calculations.shipping),
            userInfo: {
              direccionId: checkoutAddress?.id || "",
              userId:
                authContext.user?.id ||
                String(loggedUser?.id),
            },
            cardTokenId: paymentData.savedCard?.id || "",
            informacion_facturacion,
            beneficios: buildBeneficios(),
          });

          if ("error" in res) {
            setError(res.message);
            throw new Error(res.message);
          }

          // Verificar si requiere 3DS
          if (res.requires3DS && res.data3DS) {
            console.log("🔐 [Step7] Requiere validación 3DS");
            console.log("🔐 [Step7] Respuesta completa del backend:", JSON.stringify(res, null, 2));
            console.log("🔐 [Step7] data3DS recibido:", JSON.stringify(res.data3DS, null, 2));

            const data3DS = res.data3DS as { resultCode?: string; ref_payco?: number; franquicia?: string; '3DS'?: unknown };
            console.log("🔐 [Step7] Result Code:", data3DS.resultCode);
            console.log("🔐 [Step7] Franquicia:", data3DS.franquicia);
            console.log("🔐 [Step7] ref_payco:", data3DS.ref_payco);
            console.log("🔐 [Step7] Objeto 3DS:", data3DS['3DS']);

            // Guardar orderId para verificación posterior
            const orderId = res.orderId || "";
            if (orderId) {
              localStorage.setItem('pending_order_id', orderId);
              console.log("🔐 [Step7] OrderId guardado:", orderId);
            }

            // Ejecutar validación 3DS con el script de ePayco
            // Esto maneja tanto IdentifyShopper como ChallengeShopper automáticamente
            if (typeof window !== 'undefined' && window.validate3ds) {
              console.log("✅ [Step7] Script validate3ds encontrado en window");
              console.log("🔐 [Step7] Ejecutando window.validate3ds() con el siguiente objeto:");
              console.log(JSON.stringify(res.data3DS, null, 2));

              try {
                window.validate3ds(res.data3DS);
                console.log("✅ [Step7] validate3ds() ejecutado exitosamente");
                console.log("⏳ [Step7] Esperando respuesta del banco via postMessage...");
                // No redirigir, el script de ePayco manejará el flujo
                return;
              } catch (error) {
                console.error("❌ [Step7] Error ejecutando validate3ds:", error);
                setError(`Error ejecutando validación 3DS: ${error}`);
                setIsProcessing(false);
                return;
              }
            } else {
              console.error("❌ [Step7] Script de ePayco no cargado");
              console.log("🔍 [Step7] window.validate3ds:", typeof window !== 'undefined' ? window.validate3ds : 'window is undefined');
              setError("Error: Script de validación 3DS no disponible. Por favor recarga la página.");
              setIsProcessing(false);
              return;
            }
          }

          router.push(res.redirectionUrl);
          break;
        }
        case "pse": {
          console.log("🏦 [Step7] ========== PAGO CON PSE ==========");
          console.log("🏦 [Step7] userInfo.direccionId enviado:", checkoutAddress?.id || "");
          console.log("🏦 [Step7] userInfo.userId enviado:", authContext.user?.id || String(loggedUser?.id));
          console.log("🏦 [Step7] informacion_facturacion.direccion_id enviado:", informacion_facturacion.direccion_id);
          console.log("🏦 [Step7] metodo_envio:", metodo_envio);
          console.log("🏦 [Step7] codigo_bodega:", codigo_bodega);
          console.log("🏦 [Step7] Banco seleccionado:", paymentData.bank, "-", paymentData.bankName);
          console.log("🏦 [Step7] ==========================================");

          const res = await payWithPse({
            totalAmount: String(calculations.total),
            shippingAmount: String(calculations.shipping),
            currency: "COP",
            items: products.map((p) => ({
              id: String(p.id),
              sku: String(p.sku),
              name: String(p.name),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: p.skuPostback || p.sku || "",
              desDetallada: p.desDetallada || p.name || "",
              ean: p.ean && p.ean !== "" ? String(p.ean) : String(p.sku),
              ...(p.bundleInfo && {
                bundleInfo: {
                  codCampana: p.bundleInfo.codCampana,
                  productSku: p.bundleInfo.productSku,
                  skusBundle: p.bundleInfo.skusBundle,
                  bundlePrice: p.bundleInfo.bundlePrice,
                  bundleDiscount: p.bundleInfo.bundleDiscount,
                  fechaFinal: p.bundleInfo.fechaFinal,
                },
              }),
            })),
            bank: paymentData.bank || "",
            description: "Pago de pedido en Imagiq",
            metodo_envio,
            codigo_bodega,
            userInfo: {
              direccionId: checkoutAddress?.id || "",
              userId:
                authContext.user?.id ||
                String(loggedUser?.id),
            },
            informacion_facturacion,
            beneficios: buildBeneficios(),
            bankName: paymentData.bankName || "",
          });
          if ("error" in res) {
            setError(res.message);
            throw new Error(res.message);
          }
          router.push(res.redirectUrl);
          break;
        }
        case "addi": {
          console.log("💰 [Step7] ========== PAGO CON ADDI ==========");
          console.log("💰 [Step7] userInfo.direccionId enviado:", checkoutAddress?.id || "");
          console.log("💰 [Step7] userInfo.userId enviado:", authContext.user?.id || String(loggedUser?.id));
          console.log("💰 [Step7] informacion_facturacion.direccion_id enviado:", informacion_facturacion.direccion_id);
          console.log("💰 [Step7] metodo_envio:", metodo_envio);
          console.log("💰 [Step7] codigo_bodega:", codigo_bodega);
          console.log("💰 [Step7] ==========================================");

          const res = await payWithAddi({
            totalAmount: String(calculations.total),
            shippingAmount: String(calculations.shipping),
            currency: "COP",
            items: products.map((p) => ({
              id: String(p.id),
              sku: String(p.sku),
              name: String(p.name),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: p.skuPostback || p.sku || "",
              desDetallada: p.desDetallada || p.name || "",
              ean: p.ean && p.ean !== "" ? String(p.ean) : String(p.sku),
              ...(p.bundleInfo && {
                bundleInfo: {
                  codCampana: p.bundleInfo.codCampana,
                  productSku: p.bundleInfo.productSku,
                  skusBundle: p.bundleInfo.skusBundle,
                  bundlePrice: p.bundleInfo.bundlePrice,
                  bundleDiscount: p.bundleInfo.bundleDiscount,
                  fechaFinal: p.bundleInfo.fechaFinal,
                },
              }),
            })),
            metodo_envio,
            codigo_bodega,
            userInfo: {
              direccionId: checkoutAddress?.id || "",
              userId:
                authContext.user?.id ||
                String(loggedUser?.id),
            },
            informacion_facturacion,
            beneficios: buildBeneficios(),
          });
          if ("error" in res) {
            setError(res.message);
            throw new Error(res.message);
          }
          router.push(res.redirectUrl);
          break;
        }
        default:
          throw new Error("Método de pago no soportado");
      }
      // Redirigir a página de éxito
    } catch (error) {
      console.error("Error processing payment:", error);
      setIsProcessing(false);
    }
  };

  // Función que verifica si es usuario invitado y muestra el modal
  const handleConfirmOrder = async () => {
    try {
      console.log("🔍 [STEP7] ========== handleConfirmOrder INICIADO ==========");
      
      // 1. Confiar PRINCIPALMENTE en loggedUser que viene de useSecureStorage (ya desencriptado)
      let userRole: number | undefined;
      
      // Castear loggedUser a any para acceder a 'rol' (backend) o 'role' (frontend)
      const user = loggedUser as any;
      
      if (user) {
         userRole = user.rol ?? user.role;
         console.log("🔍 [STEP7] Usuario detectado (loggedUser):", {
             // keys: Object.keys(user),
             id: user.id,
             email: user.email,
             rol: user.rol,
             role: user.role,
             finalRole: userRole
         });
      } else {
         console.warn("⚠️ [STEP7] loggedUser es null o undefined");
      }

      console.log("🔍 [STEP7] Verificando usuario para modal:", {
        rol: userRole,
        esInvitado: userRole === 3,
        showPasswordModal: showPasswordModal
      });

      // Si es usuario invitado (rol 3), mostrar modal de registro
      if (userRole === 3) {
        console.log("✅ [STEP7] ========== USUARIO INVITADO DETECTADO ==========");
        console.log("✅ [STEP7] Activando modal de registro...");
        setShowPasswordModal(true);
        setPendingOrder(true);
        console.log("✅ [STEP7] Estados actualizados:");
        console.log("  - showPasswordModal: true");
        console.log("  - pendingOrder: true");
        console.log("✅ [STEP7] ================================================");
        return;
      }

      // Si no es invitado, procesar la orden directamente
      console.log("✅ [STEP7] Usuario regular (rol:", userRole, "), procesando orden directamente");
      await processOrder();
    } catch (error) {
      console.error("❌ [STEP7] ERROR en handleConfirmOrder:", error);
      // Si hay un error, intentar procesar la orden de todas formas
      await processOrder();
    }
  };

  // Callback cuando el usuario se registra exitosamente
  const handleRegisterSuccess = () => {
    setShowPasswordModal(false);
    setPendingOrder(false);
    // Procesar la orden después de registrarse
    processOrder();
  };

  // Callback cuando el usuario cancela el modal
  const handleModalClose = () => {
    setShowPasswordModal(false);
    if (pendingOrder) {
      // Si había una orden pendiente, procesarla como invitado
      setPendingOrder(false);
      processOrder();
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "tarjeta":
        return "Tarjeta de crédito/débito";
      case "pse":
        return "PSE - Pago Seguro en Línea";
      case "addi":
        return "Paga a cuotas con Addi";
      default:
        return method;
    }
  };

  // Verificar si las cuotas seleccionadas son elegibles para cero interés
  const isInstallmentEligibleForZeroInterest = (
    installments: number,
    cardId: string
  ): boolean => {
    if (!zeroInterestData?.cards) return false;

    const cardInfo = zeroInterestData.cards.find((c) => c.id === cardId);
    if (!cardInfo?.eligibleForZeroInterest) return false;

    return cardInfo.availableInstallments.includes(installments);
  };

  return (
    <div className="min-h-screen w-full pb-40 md:pb-0">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          {isLoadingCanPickUp ? (
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-96 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 inline">
                Confirma tu pedido
              </h1>
              <p className="text-gray-600 inline ml-2">
                Revisa todos los detalles antes de confirmar tu compra
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sección de resumen */}
          <div className="lg:col-span-2 space-y-4">
            {isLoadingCanPickUp ? (
              /* Skeleton de toda la sección mientras carga */
              <>
                {/* Skeleton Método de pago */}
                <div className="bg-white rounded-lg p-4 border border-gray-300 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                  </div>
                </div>

                {/* Skeleton Método de entrega */}
                <div className="bg-white rounded-lg p-4 border border-gray-300 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                </div>

                {/* Skeleton Información del receptor */}
                <div className="bg-white rounded-lg p-4 border border-gray-300 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-40 bg-gray-200 rounded"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Skeleton Datos de facturación */}
                <div className="bg-white rounded-lg p-4 border border-gray-300 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Fila 1: Método de pago e Información del receptor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Método de pago */}
                  {paymentData && (
                    <div className="bg-white rounded-lg p-4 border border-gray-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            Método de pago
                          </h2>
                          <p className="text-sm text-gray-600">
                            {getPaymentMethodLabel(paymentData.method)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/carrito/step4")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                    </div>

                    <div className="space-y-3">
                      {paymentData.method === "tarjeta" && (
                        <>
                          {/* Mostrar detalles de tarjeta guardada */}
                          {paymentData.savedCard && (
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex flex-col items-start gap-1 min-w-[60px]">
                                <CardBrandLogo
                                  brand={paymentData.savedCard.marca}
                                  size="md"
                                />
                                {paymentData.savedCard.nombre_titular && (
                                  <span className="text-[10px] text-gray-500 uppercase leading-tight">
                                    {paymentData.savedCard.nombre_titular}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-1">
                                  <span className="font-semibold text-gray-900 tracking-wider">
                                    •••• {paymentData.savedCard.ultimos_dijitos}
                                  </span>
                                  {paymentData.savedCard.tipo_tarjeta && (
                                    <span className="text-xs text-gray-500 uppercase">
                                      {paymentData.savedCard.tipo_tarjeta
                                        .toUpperCase()
                                        .includes("CREDIT")
                                        ? "Crédito"
                                        : "Débito"}
                                    </span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-600 w-full">
                                  {paymentData.savedCard.banco ? (
                                    <span>{paymentData.savedCard.banco}</span>
                                  ) : <span></span>}
                                  
                                  {paymentData.installments && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-500">Cuotas:</span>
                                      <span className="font-medium text-gray-900">
                                        {paymentData.installments}x
                                        {paymentData.savedCard &&
                                          isInstallmentEligibleForZeroInterest(
                                            paymentData.installments,
                                            String(paymentData.savedCard.id)
                                          ) && (
                                            <span className="ml-1 text-green-600 font-semibold">
                                              (0%)
                                            </span>
                                          )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Mostrar detalles de tarjeta nueva */}
                          {paymentData.cardData && (
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex flex-col items-start gap-1 min-w-[60px]">
                                {paymentData.cardData.brand && (
                                  <CardBrandLogo
                                    brand={paymentData.cardData.brand}
                                    size="md"
                                  />
                                )}
                                {paymentData.cardData.cardHolder && (
                                  <span className="text-[10px] text-gray-500 uppercase leading-tight">
                                    {paymentData.cardData.cardHolder}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-1">
                                  <span className="font-semibold text-gray-900 tracking-wider">
                                    ••••{" "}
                                    {paymentData.cardData.cardNumber.slice(-4)}
                                  </span>
                                  {paymentData.cardData.cardType && (
                                    <span className="text-xs text-gray-500 uppercase">
                                      {paymentData.cardData.cardType
                                        .toUpperCase()
                                        .includes("CREDIT")
                                        ? "Crédito"
                                        : "Débito"}
                                    </span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-600 w-full">
                                  {paymentData.cardData.bank ? (
                                    <span>{paymentData.cardData.bank}</span>
                                  ) : <span></span>}
                                  
                                  {paymentData.installments && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-500">Cuotas:</span>
                                      <span className="font-medium text-gray-900">
                                        {paymentData.installments}x
                                        {(() => {
                                          // Para tarjetas nuevas, intentar obtener el ID de localStorage
                                          const savedCardId = localStorage.getItem(
                                            "checkout-saved-card-id"
                                          );
                                          return (
                                            savedCardId &&
                                            isInstallmentEligibleForZeroInterest(
                                              paymentData.installments,
                                              savedCardId
                                            ) && (
                                              <span className="ml-1 text-green-600 font-semibold">
                                                (0%)
                                              </span>
                                            )
                                          );
                                        })()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {paymentData.method === "pse" && paymentData.bank && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Banco:</span>
                          <span className="font-medium text-gray-900">
                            {paymentData.bankName || paymentData.bank}
                          </span>
                        </div>
                      )}
                    </div>
                    </div>
                  )}

                  {/* Información del receptor */}
                  {recipientData && (
                    <div className="bg-white rounded-lg p-4 border border-gray-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-gray-900">
                              Información del receptor
                            </h2>
                            <p className="text-sm text-gray-600">
                              {recipientData.receivedByClient
                                ? "Será recibido por el cliente"
                                : "Será recibido por otra persona"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => router.push("/carrito/step3")}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Nombre</p>
                          <p className="text-sm font-medium text-gray-900">
                            {recipientData.firstName || "-"}
                          </p>
                        </div>

                        {/* Apellido */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Apellido</p>
                          <p className="text-sm font-medium text-gray-900">
                            {recipientData.lastName || "-"}
                          </p>
                        </div>

                        {/* Email */}
                        <div className="overflow-hidden">
                          <p className="text-xs text-gray-500 mb-1">
                            Correo electrónico
                          </p>
                          <p 
                            className="text-sm font-medium text-gray-900 truncate"
                            title={recipientData.email || ""}
                          >
                            {recipientData.email || "-"}
                          </p>
                        </div>

                        {/* Teléfono */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Número de celular
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {recipientData.phone || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Método de entrega */}
                {shippingData && (
                  <div className="bg-white rounded-lg p-4 border border-gray-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {shippingData.type === "delivery" ? (
                            <Truck className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Store className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          {/* Columna Izquierda: Título */}
                          <div>
                            <h2 className="text-lg font-bold text-gray-900">
                              Método de entrega
                            </h2>
                            <p className="text-sm text-gray-600">
                              {shippingData.type === "delivery"
                                ? "Envío a domicilio"
                                : "Recogida en tienda"}
                            </p>
                          </div>

                          {/* Columna Derecha: Detalles */}
                          <div className="text-sm">
                            {shippingData.type === "delivery" ? (
                              <div className="flex flex-col text-gray-700">
                                <span className="font-medium text-gray-900 break-words">
                                  {shippingData.address}
                                </span>
                                <div className="flex flex-col text-xs text-gray-600 mt-1">
                                  {shippingData.city && (
                                    <span>{shippingData.city}</span>
                                  )}
                                  {checkoutAddress?.pais && (
                                    <span>{checkoutAddress.pais}</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col text-gray-700">
                                <span className="font-medium text-gray-900">
                                  {shippingData.store?.name || "Recoger en tienda"}
                                </span>
                                {shippingData.store?.address && (
                                  <span className="text-xs text-gray-600 mt-1">{shippingData.store.address}</span>
                                )}
                                {shippingData.store?.city && (
                                  <span className="text-xs text-gray-500">{shippingData.store.city}</span>
                                )}
                                {shippingData.store?.schedule && (
                                  <span className="text-xs text-gray-500 mt-1">
                                    Horario: {shippingData.store.schedule}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => router.push("/carrito/step3")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 ml-4 flex-shrink-0"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                    </div>
                  </div>
                )}

                {/* Datos de facturación */}
                {billingData && (
                  <div className="bg-white rounded-lg p-4 border border-gray-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            Datos de facturación
                          </h2>
                          <p className="text-sm text-gray-600">
                            {billingData.type === "natural"
                              ? "Persona Natural"
                              : "Persona Jurídica"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/carrito/step6")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Razón Social (solo para jurídica) - ocupa todo el ancho */}
                      {billingData.type === "juridica" &&
                        billingData.razonSocial && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Razón Social
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {billingData.razonSocial}
                            </p>
                          </div>
                        )}

                      {/* Grid de 2 columnas para los demás campos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* NIT (solo para jurídica) */}
                        {billingData.type === "juridica" && billingData.nit && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">NIT</p>
                            <p className="text-sm font-medium text-gray-900">
                              {billingData.nit}
                            </p>
                          </div>
                        )}

                        {/* Nombre */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Nombre</p>
                          <p className="text-sm font-medium text-gray-900">
                            {billingData.nombre}
                          </p>
                        </div>

                        {/* Documento */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Documento</p>
                          <p className="text-sm font-medium text-gray-900">
                            {billingData.documento}
                          </p>
                        </div>

                        {/* Email */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm font-medium text-gray-900">
                            {billingData.email}
                          </p>
                        </div>

                        {/* Teléfono */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                          <p className="text-sm font-medium text-gray-900">
                            {billingData.telefono}
                          </p>
                        </div>
                      </div>

                      {/* Dirección de facturación - ocupa todo el ancho */}
                      {billingData.direccion && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Dirección de facturación
                          </p>
                          <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {billingData.direccion.linea_uno}
                              </p>
                              {billingData.direccion.ciudad && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {billingData.direccion.ciudad}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Resumen de compra y Trade-In - Hidden en mobile */}
          <aside className="hidden md:block lg:col-span-1 space-y-4">
            {isLoadingCanPickUp ? (
              /* Skeleton del resumen mientras carga */
              <div className="bg-white rounded-2xl p-4 shadow border border-[#E5E5E5] animate-pulse">
                <div className="space-y-4">
                  {/* Título */}
                  <div className="h-6 w-40 bg-gray-200 rounded"></div>

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
                    <div className="flex justify-between">
                      <div className="h-4 w-36 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4">
                    <div className="flex justify-between mb-4">
                      <div className="h-5 w-16 bg-gray-300 rounded"></div>
                      <div className="h-5 w-28 bg-gray-300 rounded"></div>
                    </div>
                  </div>

                  {/* Mensaje T&C */}
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                  </div>

                  {/* Botones */}
                  <div className="h-12 w-full bg-gray-300 rounded-lg"></div>

                  {/* Términos centrados */}
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-5/6 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-3 w-4/6 bg-gray-200 rounded mx-auto"></div>
                  </div>

                  {/* Información de financiamiento y envío */}
                  <div className="mt-6 space-y-4">
                    {/* Financiamiento */}
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-gray-200 rounded"></div>
                        <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                        <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
                      </div>
                    </div>

                    {/* Envío */}
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-gray-200 rounded"></div>
                        <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                        <div className="h-3 w-3/6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Step4OrderSummary
                isProcessing={isProcessing}
                onFinishPayment={handleConfirmOrder}
                onBack={onBack}
                buttonText="Confirmar y pagar"
                disabled={isProcessing || !tradeInValidation.isValid}
                isSticky={false}
                shippingVerification={shippingVerification}
                deliveryMethod={shippingData?.type}
                error={error}
                shouldCalculateCanPickUp={false}
              />
            )}
            {/* Información del método de envío - Solo se muestra cuando NEXT_PUBLIC_SHOW_PRODUCT_CODES es true */}
            {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                {isLoadingCanPickUp ? (
                  /* Skeleton mientras carga - incluye título */
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 w-40 bg-blue-200 rounded mb-3"></div>
                    <div className="flex items-start gap-4">
                      <div className="h-4 w-16 bg-blue-200 rounded"></div>
                      <div className="h-4 w-32 bg-blue-200 rounded"></div>
                    </div>
                    <div className="p-4 bg-white/50 rounded border border-blue-200">
                      <div className="h-3 w-40 bg-blue-200 rounded mb-2"></div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-full bg-blue-200 rounded"></div>
                        <div className="h-3 w-full bg-blue-200 rounded"></div>
                        <div className="h-3 w-full bg-blue-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-bold text-blue-900 mb-3">
                      📦 Método de envío
                    </p>
                    <div className="space-y-2 text-sm text-blue-800">
                      {shippingData?.type === "pickup" ? (
                        <>
                          <div className="flex items-start gap-4">
                            <span className="font-semibold">Método:</span>
                            <span className="text-green-700 font-bold">
                              🏪 Recoge en tienda
                            </span>
                          </div>
                          {shippingData.store?.name && (
                            <div className="flex items-start gap-4">
                              <span className="font-semibold">Tienda:</span>
                              <span>{shippingData.store.name}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-start gap-4">
                            <span className="font-semibold">Método:</span>
                            {shippingVerification?.envio_imagiq === true ? (
                              <span className="text-green-700 font-bold">
                                🚚 Envío Imagiq
                              </span>
                            ) : (
                              <span className="text-orange-700 font-bold">
                                🚛 Envío Coordinadora
                              </span>
                            )}
                          </div>
                          <div className="mt-2 p-4 bg-white/50 rounded border border-blue-200">
                            <p className="text-xs font-semibold mb-1">
                              Detalles de verificación:
                            </p>
                            <div className="text-xs space-y-1">
                              <p>
                                • envio_imagiq:{" "}
                                {shippingVerification?.envio_imagiq ? (
                                  <span className="text-green-600 font-bold">
                                    true
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-bold">
                                    false
                                  </span>
                                )}
                              </p>
                              <p>
                                • todos_productos_im_it:{" "}
                                {shippingVerification?.todos_productos_im_it ? (
                                  <span className="text-green-600 font-bold">
                                    true
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-bold">
                                    false
                                  </span>
                                )}
                              </p>
                              <p>
                                • en_zona_cobertura:{" "}
                                {shippingVerification?.en_zona_cobertura ? (
                                  <span className="text-green-600 font-bold">
                                    true
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-bold">
                                    false
                                  </span>
                                )}
                              </p>
                              <p>
                                • es_centro_distribucion:{" "}
                                {isLoadingStoreValidation ? (
                                  <span className="text-yellow-600 italic">
                                    verificando...
                                  </span>
                                ) : isCentroDistribucion === null ? (
                                  <span className="text-gray-600 italic">
                                    no verificado
                                  </span>
                                ) : isCentroDistribucion ? (
                                  <span className="text-green-600 font-bold">
                                    true
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-bold">
                                    false
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Banner de Trade-In - Debajo del resumen (baja con el scroll) */}
            {tradeInData?.completed && (
              <TradeInCompletedSummary
                deviceName={tradeInData.deviceName}
                tradeInValue={tradeInData.value}
                onEdit={handleRemoveTradeIn}
                validationError={
                  tradeInValidation.isValid === false
                    ? getTradeInValidationMessage(tradeInValidation)
                    : undefined
                }
              />
            )}
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Bar - Solo Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
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

          {/* Botón confirmar */}
          <button
            className={`w-full font-bold py-3 rounded-lg text-base transition text-white flex items-center justify-center gap-4 ${isProcessing || !tradeInValidation.isValid
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "bg-[#222] hover:bg-[#333] cursor-pointer"
              }`}
            onClick={handleConfirmOrder}
            disabled={isProcessing || !tradeInValidation.isValid}
          >
            {(isProcessing || isCalculatingShipping) && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>Confirmar y pagar</span>
          </button>
        </div>
      </div>

      {/* Modal para registrar contraseña de usuario invitado */}
      <RegisterGuestPasswordModal
        isOpen={showPasswordModal}
        onClose={handleModalClose}
        onSuccess={handleRegisterSuccess}
        userEmail={
          loggedUser?.email || 
          billingData?.email || 
          recipientData?.email || 
          (() => {
            try {
              const userInfo = localStorage.getItem("imagiq_user");
              if (userInfo) {
                const parsed = JSON.parse(userInfo);
                return parsed?.email || "";
              }
            } catch {
              return "";
            }
            return "";
          })()
        }
      />
    </div>
  );
}
