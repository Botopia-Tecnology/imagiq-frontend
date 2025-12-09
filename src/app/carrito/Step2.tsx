"use client";
/**
 * Paso 2 del carrito de compras: Datos de envío y pago
 * Layout profesional, estilo Samsung, código limpio y escalable
 */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, type BundleInfo } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { apiPost } from "@/lib/api-client";
import { tradeInEndpoints } from "@/lib/api";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import TradeInModal from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInModal";
import AddNewAddressForm from "./components/AddNewAddressForm";
import type { Address } from "@/types/address";
import {
  validateTradeInProducts,
  getTradeInValidationMessage,
} from "./utils/validateTradeIn";
import { toast } from "sonner";

interface GuestUserResponse {
  address: {
    id?: string;
    linea_uno: string;
    ciudad: string;
  };
  user: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    numero_documento: string;
    telefono: string;
  };
}

/**
 * Paso 2 del carrito: recibe onBack para volver al paso anterior
 */
export default function Step2({
  onBack,
  onContinue,
}: {
  readonly onBack?: () => void;
  readonly onContinue?: () => void;
}) {
  // Usar el hook centralizado useCart
  const { products: cartProducts, calculations } = useCart();
  const router = useRouter();
  // Recibe onContinue para avanzar al siguiente paso
  // onBack ya existe
  // onContinue?: () => void
  // Estado para formulario de invitado
  // Formulario de invitado: incluye dirección línea uno y ciudad
  const [guestForm, setGuestForm] = useState({
    email: "",
    nombre: "",
    apellido: "",
    cedula: "",
    celular: "",
    tipo_documento: "",
  });

  // Estado para validación y UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Estado para errores por campo
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    nombre: "",
    apellido: "",
    cedula: "",
    celular: "",
    tipo_documento: "",
  });

  // Trade-In state management
  const [tradeInData, setTradeInData] = useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // Estado para controlar el modal de Trade-In
  const [isTradeInModalOpen, setIsTradeInModalOpen] = useState(false);

  // Estado para verificar si el usuario ya tiene dirección agregada
  const [hasAddedAddress, setHasAddedAddress] = useState(false);

  // Estado para verificar si ya se registró como invitado
  const [isRegisteredAsGuest, setIsRegisteredAsGuest] = useState(false);

  // Estado para verificar si el formulario de dirección está completo y válido
  const [isAddressFormValid, setIsAddressFormValid] = useState(false);

  // Estado para rastrear cuando se está guardando la dirección
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Ref para poder hacer submit del formulario de dirección desde el botón del sidebar
  const addressFormSubmitRef = React.useRef<(() => void) | null>(null);

  // --- Validación simplificada y centralizada ---
  // Filtros de seguridad por campo
  const filters = {
    cedula: (v: string) => v.replaceAll(/\D/g, ""),
    celular: (v: string) => v.replaceAll(/\D/g, ""),
    nombre: (v: string) => v.replaceAll(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
    apellido: (v: string) => v.replaceAll(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
    email: (v: string) => v.replaceAll(/\s/g, ""),
    tipo_documento: (v: string) => v, // No filter needed for select
  };

  // Validadores por campo
  const validators = {
    email: (v: string) => {
      if (!v) return "Por favor escribe tu correo electrónico.";
      if (!/^([\w-.]+)@([\w-]+\.)+[\w-]{2,4}$/.test(v))
        return "El formato del correo electrónico no es válido. Ejemplo: usuario@dominio.com.";
      return "";
    },
    nombre: (v: string) => {
      if (!v) return "Por favor escribe tu nombre.";
      if (v.length < 2) return "El nombre debe tener al menos 2 letras.";
      return "";
    },
    apellido: (v: string) => {
      if (!v) return "Por favor escribe tu apellido.";
      if (v.length < 2) return "El apellido debe tener al menos 2 letras.";
      return "";
    },
    cedula: (v: string) => {
      if (!v) return "Por favor escribe tu número de cédula.";
      if (v.length < 6 || v.length > 10)
        return "La cédula debe tener entre 6 y 10 números.";
      if (!/^([1-9]\d{5,9})$/.test(v))
        return "La cédula debe empezar con un número diferente de cero.";
      return "";
    },
    celular: (v: string) => {
      if (!v) return "Por favor escribe tu número de celular.";
      if (v.length !== 10)
        return "El celular debe tener exactamente 10 números.";
      if (!/^3\d{9}$/.test(v))
        return "El celular colombiano debe empezar con '3' y tener 10 dígitos.";
      return "";
    },
    tipo_documento: (v: string) => {
      if (!v) return "Por favor selecciona el tipo de documento.";
      if (!["CC", "CE", "NIT", "PP"].includes(v))
        return "Tipo de documento inválido.";
      return "";
    },
  };

  // Validar todos los campos y devolver errores
  function validateFields(form: typeof guestForm) {
    const errors: typeof fieldErrors = {
      email: "",
      nombre: "",
      apellido: "",
      cedula: "",
      celular: "",
      tipo_documento: "",
    };
    for (const key of Object.keys(errors)) {
      // @ts-expect-error Type mismatch due to dynamic key access; all keys are validated and safe here
      errors[key] = validators[key](form[key].trim());
    }
    return errors;
  }

  // Manejar cambios en el formulario invitado
  const handleGuestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const filter = filters[name as keyof typeof filters];
    const newValue = filter ? filter(value) : value;
    const newForm = { ...guestForm, [name]: newValue };
    setGuestForm(newForm);
    setFieldErrors(validateFields(newForm));
  };

  // Aplicar descuento si el código es válido
  // (Eliminado: handleDiscountApply no se usa)

  // Validar formulario invitado
  const isGuestFormValid = !Object.values(validateFields(guestForm)).some(
    Boolean
  );

  /**
   * Maneja el envío del formulario de invitado.
   * Valida los campos, guarda la información en localStorage y abre el modal para agregar dirección.
   */
  const handleGuestSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError("");
    const errors = validateFields(guestForm);
    setFieldErrors(errors);
    if (Object.values(errors).some((err) => err)) {
      setError(
        "Por favor completa todos los campos obligatorios correctamente."
      );
      return;
    }

    // Guardar dirección y cédula en localStorage para autocompletar en Step3 y Step4
    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.setItem(
        "checkout-document",
        guestForm.cedula
      );
    }

    // Guardar en localStorage bajo la clave 'guest-payment-info'
    setLoading(true);
    try {
      const data = await apiPost<GuestUserResponse>("/api/users/guest/new", {
        guestInfo: {
          nombre: guestForm.nombre,
          apellido: guestForm.apellido,
          email: guestForm.email,
          numero_documento: guestForm.cedula,
          telefono: guestForm.celular,
          tipo_documento: guestForm.tipo_documento,
        },
      });
      // IMPORTANTE: Preservar el carrito antes de guardar el usuario
      const currentCart = localStorage.getItem("cart-items");
      
      // IMPORTANTE: NO guardar checkout-address aquí cuando se registra como invitado
      // Solo guardar cuando el usuario agregue una dirección completa en el formulario
      // Esto evita que se calcule candidate stores antes de tiempo
      // localStorage.setItem("checkout-address", JSON.stringify(data.address));
      localStorage.setItem("imagiq_user", JSON.stringify(data.user));

      // IMPORTANTE: Restaurar el carrito después de guardar el usuario (por si el backend lo limpió)
      if (currentCart) {
        try {
          const cartData = JSON.parse(currentCart);
          if (Array.isArray(cartData) && cartData.length > 0) {
            localStorage.setItem("cart-items", currentCart);
            // Disparar evento para sincronizar el carrito
            if (globalThis.window) {
              globalThis.window.dispatchEvent(new Event("storage"));
              globalThis.window.dispatchEvent(
                new CustomEvent("localStorageChange", {
                  detail: { key: "cart-items" },
                })
              );
            }
          }
        } catch (error) {
          console.error("Error restaurando carrito:", error);
        }
      }

      // Marcar como registrado - el formulario de dirección aparecerá automáticamente
      setIsRegisteredAsGuest(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Intentar extraer el mensaje de error del response
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        // Intentar obtener el mensaje del objeto de error
        const errorObj = error as {
          message?: string;
          data?: { message?: string };
        };
        errorMessage =
          errorObj.message || errorObj.data?.message || String(error);
      } else {
        errorMessage = String(error);
      }

      // Verificar si el error es porque el correo ya está asociado a una cuenta
      const lowerErrorMessage = errorMessage.toLowerCase();
      if (
        lowerErrorMessage.includes("internal server error") ||
        lowerErrorMessage.includes("ya existe") ||
        lowerErrorMessage.includes("ya está registrado") ||
        lowerErrorMessage.includes("already exists") ||
        (lowerErrorMessage.includes("email") &&
          (lowerErrorMessage.includes("registered") ||
            lowerErrorMessage.includes("existe"))) ||
        lowerErrorMessage.includes("usuario ya existe") ||
        lowerErrorMessage.includes("correo ya existe") ||
        lowerErrorMessage.includes("duplicate") ||
        lowerErrorMessage.includes("conflict")
      ) {
        setError(
          `El correo ${guestForm.email} ya está asociado a una cuenta. Por favor, inicia sesión para continuar.`
        );
        setFieldErrors((prev) => ({
          ...prev,
          email:
            "Este correo ya está registrado. Inicia sesión para continuar.",
        }));
        return;
      }

      // Para otros errores, mostrar el mensaje del backend o un mensaje genérico más útil
      if (
        errorMessage &&
        errorMessage !== "Request failed" &&
        !errorMessage.toLowerCase().includes("internal server error")
      ) {
        setError(errorMessage);
      } else {
        setError(
          "Ocurrió un error al procesar tu información. Por favor, verifica los datos e intenta de nuevo."
        );
      }
      return;
    }
  };

  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = React.useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof cartProducts;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Validar Trade-In cuando cambian los productos
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

      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description:
          "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    }
  }, [cartProducts]);

  // Wrapper function to handle both form validation and continue action
  const handleContinue = async () => {
    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(cartProducts);
    if (!validation.isValid) {
      setError(getTradeInValidationMessage(validation));
      return;
    }

    // Si no está registrado como invitado, hacer el registro
    if (!isRegisteredAsGuest) {
      if (!isGuestFormValid) {
        setError("Por favor completa todos los campos obligatorios.");
        const newFieldErrors: typeof fieldErrors = {
          email: guestForm.email.trim() ? "" : "Este campo es obligatorio",
          nombre: guestForm.nombre.trim() ? "" : "Este campo es obligatorio",
          apellido: guestForm.apellido.trim() ? "" : "Este campo es obligatorio",
          cedula: guestForm.cedula.trim() ? "" : "Este campo es obligatorio",
          celular: guestForm.celular.trim() ? "" : "Este campo es obligatorio",
          tipo_documento: guestForm.tipo_documento.trim()
            ? ""
            : "Este campo es obligatorio",
        };
        setFieldErrors(newFieldErrors);
        return;
      }
      await handleGuestSubmit();
      return;
    }

    // Si ya está registrado pero no tiene dirección, el formulario ya está visible
    // No hacer nada, el usuario debe completar el formulario de dirección
    if (isRegisteredAsGuest && !hasAddedAddress) {
      toast.error("Por favor agrega una dirección de envío para continuar");
      return;
    }

    // Si ya tiene dirección, continuar al siguiente paso
    if (isRegisteredAsGuest && hasAddedAddress && typeof onContinue === "function") {
      onContinue();
    }
  };
  // IMPORTANTE: Cargar datos del usuario invitado desde localStorage al montar
  useEffect(() => {
    // Cargar datos del usuario guardado
    const savedUser = safeGetLocalStorage<{
      email?: string;
      nombre?: string;
      apellido?: string;
      numero_documento?: string;
      telefono?: string;
      tipo_documento?: string;
    } | null>("imagiq_user", null);

    if (savedUser && savedUser.email) {
      // Si hay usuario guardado, restaurar los datos del formulario
      setGuestForm({
        email: savedUser.email || "",
        nombre: savedUser.nombre || "",
        apellido: savedUser.apellido || "",
        cedula: savedUser.numero_documento || "",
        celular: savedUser.telefono || "",
        tipo_documento: savedUser.tipo_documento || "",
      });

      // Marcar como registrado como invitado
      setIsRegisteredAsGuest(true);

      // IMPORTANTE: Verificar si ya tiene dirección agregada
      // Si tiene dirección con ID, significa que ya fue guardada en el backend
      const savedAddress = safeGetLocalStorage<Address | null>(
        "checkout-address",
        null
      );
      if (savedAddress) {
        // Si tiene dirección guardada (con o sin ID), marcar como agregada
        // Esto mantiene el estado correcto al refrescar la página
        if (savedAddress.id) {
          setHasAddedAddress(true);
        } else {
          // Si tiene dirección pero sin ID, significa que está en proceso
          // Mantener el formulario de dirección visible
          setHasAddedAddress(false);
        }
      } else {
        // Si no hay dirección, mantener el formulario de dirección visible
        setHasAddedAddress(false);
      }
    }
  }, []);

  useEffect(() => {
    // IMPORTANTE: NO redirigir automáticamente a Step3
    // El usuario debe hacer clic en "Continuar pago" para avanzar
    // Esto evita bucles y da control al usuario sobre el flujo

    // Load Trade-In data from localStorage
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
  }, []);

  // Handler para abrir el modal de Trade-In (para cambiar producto)
  const handleOpenTradeInModal = () => {
    setIsTradeInModalOpen(true);
  };

  // Handler para cuando se completa el Trade-In
  const handleCompleteTradeIn = (deviceName: string, value: number) => {
    // Cargar datos desde localStorage (ya guardados por handleFinalContinue)
    try {
      const raw = localStorage.getItem("imagiq_trade_in");
      if (raw) {
        const stored = JSON.parse(raw) as {
          deviceName?: string;
          value?: number;
          completed?: boolean;
        };
        const newTradeInData = {
          deviceName: stored.deviceName || deviceName,
          value: stored.value || value,
          completed: true,
        };
        setTradeInData(newTradeInData);
      } else {
        // Fallback: guardar en localStorage si no existe (importante para usuarios NO logueados)
        const tradeInDataToSave = {
          deviceName,
          value,
          completed: true,
        };
        try {
          const tradeInString = JSON.stringify(tradeInDataToSave);
          localStorage.setItem("imagiq_trade_in", tradeInString);
          
          // Verificar que se guardó correctamente
          const verifySave = localStorage.getItem("imagiq_trade_in");
          if (!verifySave || verifySave !== tradeInString) {
            console.error("❌ ERROR: Trade-In NO se guardó correctamente en Step2");
            // Reintentar
            localStorage.setItem("imagiq_trade_in", tradeInString);
          } else {
            console.log("✅ Trade-In guardado correctamente en Step2");
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
        } catch (error) {
          console.error(
            "❌ Error al guardar trade-in en localStorage (respaldo):",
            error
          );
        }
        setTradeInData(tradeInDataToSave);
      }
    } catch (error) {
      // Fallback simple: guardar en localStorage como último recurso
      console.error("❌ Error al cargar trade-in desde localStorage:", error);
      const newTradeInData = {
        deviceName,
        value,
        completed: true,
      };
      try {
        const tradeInString = JSON.stringify(newTradeInData);
        localStorage.setItem("imagiq_trade_in", tradeInString);
        
        // Verificar que se guardó correctamente
        const verifySave = localStorage.getItem("imagiq_trade_in");
        if (!verifySave || verifySave !== tradeInString) {
          console.error("❌ ERROR: Trade-In NO se guardó correctamente en Step2 (fallback)");
          // Reintentar
          localStorage.setItem("imagiq_trade_in", tradeInString);
        } else {
          console.log("✅ Trade-In guardado correctamente en Step2 (fallback)");
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
      } catch (storageError) {
        console.error(
          "❌ Error al guardar trade-in en localStorage (fallback):",
          storageError
        );
      }
      setTradeInData(newTradeInData);
    }
    setIsTradeInModalOpen(false);
  };

  // Handler para cancelar sin completar
  const handleCancelWithoutCompletion = () => {
    setIsTradeInModalOpen(false);
  };

  // Ref para guardar el timeout de auto-avance
  const autoContinueTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Handler para cuando se agrega una dirección exitosamente
  const handleAddressAdded = async (address: Address) => {
    console.log("✅ Dirección agregada exitosamente:", address);

    // Activar estado de loading
    setIsSavingAddress(true);

    // NO mostrar toast ni avanzar automáticamente
    // El formulario mantiene el loading hasta que termine la consulta de candidate stores

    // Limpiar timeout anterior si existe
    if (autoContinueTimeoutRef.current) {
      clearTimeout(autoContinueTimeoutRef.current);
    }

    // NO disparar evento checkout-address-changed porque ya vamos a llamar
    // directamente al endpoint de candidate stores aquí
    // Esto evita recálculos duplicados en useDelivery

    // Llamar al endpoint de candidate stores y esperar la respuesta
    try {
      console.log('🔄 Consultando candidate stores...');
      const { productEndpoints } = await import('@/lib/api');

      // Obtener el user_id del localStorage
      const savedUser = safeGetLocalStorage<{ id?: string } | null>("imagiq_user", null);
      const userId = savedUser?.id;

      if (!userId) {
        console.error('❌ No se encontró user_id para consultar candidate stores');
        setIsSavingAddress(false);
        return;
      }

      // Preparar los productos en el formato esperado
      const products = cartProducts.map(p => ({
        sku: p.sku,
        quantity: p.quantity || 1,
      }));

      // Llamar al endpoint de candidate stores y procesar la respuesta
      const response = await productEndpoints.getCandidateStores({
        products,
        user_id: userId,
      });

      console.log('✅ Candidate stores consultados exitosamente, procesando respuesta...');

      // IMPORTANTE: Procesar y guardar la respuesta en el caché
      // Esto es crucial para que Step3 pueda leer los datos del caché
      if (response?.data) {
        // Importar las funciones de caché
        const { buildGlobalCanPickUpKey, setGlobalCanPickUpCache } = await import('@/app/carrito/utils/globalCanPickUpCache');
        
        // Obtener la dirección actual para el caché
        const savedAddress = safeGetLocalStorage<{ id?: string } | null>("checkout-address", null);
        const addressId = savedAddress?.id || null;
        
        // Construir la clave de caché
        const cacheKey = buildGlobalCanPickUpKey({
          userId,
          products,
          addressId,
        });
        
        // Guardar en caché con la respuesta completa
        setGlobalCanPickUpCache(cacheKey, response.data.canPickUp, response.data, addressId);
        console.log('✅ Respuesta guardada en caché con clave:', cacheKey);
      } else {
        console.warn('⚠️ La respuesta del endpoint no contiene datos para guardar en caché');
      }
    } catch (error) {
      console.error('❌ Error consultando candidate stores:', error);
      setIsSavingAddress(false);
      return;
    }

    // Avanzar automáticamente al Step3 después de consultar candidate stores
    // NO poner setHasAddedAddress(true) porque vamos a cambiar de paso inmediatamente
    if (typeof onContinue === "function") {
      console.log("✅ Candidate stores calculados, avanzando automáticamente a Step3");
      setIsSavingAddress(false);
      onContinue();
    }
  };

  // Cleanup del timeout al desmontar
  React.useEffect(() => {
    return () => {
      if (autoContinueTimeoutRef.current) {
        clearTimeout(autoContinueTimeoutRef.current);
      }
    };
  }, []);

  // Handle Trade-In removal (ahora abre el modal para cambiar producto)
  const handleRemoveTradeIn = () => {
    // Abrir modal para cambiar producto en lugar de remover directamente
    handleOpenTradeInModal();
  };

  // Ref para rastrear SKUs que ya fueron verificados (evita loops infinitos)
  const verifiedSkusRef = React.useRef<Set<string>>(new Set());
  // Ref para rastrear SKUs que fallaron (evita reintentos de peticiones fallidas)
  const failedSkusRef = React.useRef<Set<string>>(new Set());

  // Verificar indRetoma para cada producto único en segundo plano (sin mostrar nada en UI)
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
        // Solo productos sin bundleInfo y sin indRetoma definido
        const needsVerification = 
          product && 
          !product.bundleInfo && 
          product.indRetoma === undefined;
        const notVerifiedYet = !verifiedSkusRef.current.has(sku);
        const notFailedBefore = !failedSkusRef.current.has(sku);
        return needsVerification && notVerifiedYet && notFailedBefore;
      });

      // Filtrar bundles que necesitan verificación (usando productSku)
      const bundlesToVerify = uniqueBundleSkus.filter((productSku) => {
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

      // Verificar cada SKU único (productos individuales y bundles)
      for (let i = 0; i < allSkusToVerify.length; i++) {
        const sku = allSkusToVerify[i];
        const isBundle = bundlesToVerify.includes(sku);

        // PROTECCIÓN: Verificar si este SKU ya falló antes (ANTES del delay y try)
        if (failedSkusRef.current.has(sku)) {
          console.error(
            `🚫 SKU ${sku} ya falló anteriormente. NO se reintentará para evitar sobrecargar la base de datos.`
          );
          verifiedSkusRef.current.add(sku); // Marcar como verificado para no intentar de nuevo
          continue; // Saltar este SKU
        }

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        try {
          // Para bundles, usar productSku; para productos normales, usar sku
          const skuToCheck = isBundle ? sku : sku; // sku ya es productSku si es bundle
          const response = await tradeInEndpoints.checkSkuForTradeIn({ sku: skuToCheck });
          if (!response.success || !response.data) {
            // Si falla la petición, marcar como fallido
            failedSkusRef.current.add(sku);
            console.error(
              `🚫 Petición falló para SKU ${skuToCheck}. NO se reintentará automáticamente para proteger la base de datos.`
            );
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
  }, [cartProducts]);

  return (
    <div className="w-full bg-white flex flex-col items-center py-8 px-2 md:px-0 pb-40 md:pb-16 relative">
      {/* Fondo blanco sólido para cubrir cualquier animación de fondo */}
      <div className="fixed inset-0 bg-white -z-10 pointer-events-none" />
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Login y invitado */}
        <div className="col-span-2 flex flex-col gap-8">
          {/* Login - Solo mostrar si no está registrado como invitado */}
          {!isRegisteredAsGuest && (
            <div className="bg-[#F3F3F3] rounded-xl p-8 shadow flex flex-col gap-4">
              <h2 className="text-xl font-bold mb-2">Continua con Log-in</h2>
              <p className="text-gray-700 mb-4">
                Inicia sesión para tener envío gratis, acumular puntos y más
                beneficios
              </p>
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => router.push("/login")}
                  className="bg-[#333] text-white font-bold py-3 px-8 rounded-lg text-base hover:bg-[#222] transition cursor-pointer"
                >
                  Iniciar sesión
                </button>
                <span className="text-gray-600">No tienes cuenta aún?</span>
                <Link
                  href="/login/create-account"
                  className="text-[#0074E8] font-semibold underline"
                >
                  Regístrate aquí
                </Link>
              </div>
            </div>
          )}

          {/* Invitado - Solo mostrar si no está registrado */}
          {!isRegisteredAsGuest && (
            <div className="bg-[#ECE9E6] rounded-xl p-8 flex flex-col gap-4 border border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-2">Continua como invitado</h2>
            <p className="text-gray-700 mb-4">
              ¿Estás usando el proceso de compra como invitado? Podrías estar
              perdiendo Puntos beneficios exclusivos
            </p>
            <form
              className="flex flex-col gap-4"
              autoComplete="off"
              onSubmit={handleGuestSubmit}
            >
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico (ejemplo: usuario@dominio.com)"
                  className={`input-samsung ${
                    fieldErrors.email ? "border-red-500" : ""
                  }`}
                  value={guestForm.email}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || isRegisteredAsGuest}
                  autoFocus
                  inputMode="email"
                  autoComplete="email"
                  pattern="^[\w-.]+@[\w-]+\.[\w-]{2,4}$"
                />
                {fieldErrors.email && (
                  <span
                    className="text-red-500 text-xs"
                    style={{ marginTop: 2 }}
                  >
                    {fieldErrors.email}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre (solo letras)"
                    className={`input-samsung ${
                      fieldErrors.nombre ? "border-red-500" : ""
                    }`}
                    value={guestForm.nombre}
                    onChange={handleGuestChange}
                    required
                    disabled={loading || isRegisteredAsGuest}
                    inputMode="text"
                    autoComplete="given-name"
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  />
                  {fieldErrors.nombre && (
                    <span
                      className="text-red-500 text-xs"
                      style={{ marginTop: 2 }}
                    >
                      {fieldErrors.nombre}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido (solo letras)"
                    className={`input-samsung ${
                      fieldErrors.apellido ? "border-red-500" : ""
                    }`}
                    value={guestForm.apellido}
                    onChange={handleGuestChange}
                    required
                    disabled={loading || isRegisteredAsGuest}
                    inputMode="text"
                    autoComplete="family-name"
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  />
                  {fieldErrors.apellido && (
                    <span
                      className="text-red-500 text-xs"
                      style={{ marginTop: 2 }}
                    >
                      {fieldErrors.apellido}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Tipo de Documento *
                </label>
                <select
                  id="tipo_documento"
                  name="tipo_documento"
                  className={`input-samsung ${
                    fieldErrors.tipo_documento ? "border-red-500" : ""
                  }`}
                  value={guestForm.tipo_documento}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || isRegisteredAsGuest}
                  autoComplete="off"
                >
                  <option value="">-- Selecciona --</option>
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="NIT">NIT</option>
                  <option value="PP">Pasaporte (PP)</option>
                </select>
                {fieldErrors.tipo_documento && (
                  <span
                    className="text-red-500 text-xs"
                    style={{ marginTop: 2 }}
                  >
                    {fieldErrors.tipo_documento}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6,10}"
                    name="cedula"
                    placeholder="No. de Cédula (6 a 10 números, sin puntos ni espacios)"
                    className={`input-samsung ${
                      fieldErrors.cedula ? "border-red-500" : ""
                    }`}
                    value={guestForm.cedula}
                    onChange={handleGuestChange}
                    required
                    disabled={loading || isRegisteredAsGuest}
                    maxLength={10}
                    autoComplete="off"
                  />
                  {fieldErrors.cedula && (
                    <span
                      className="text-red-500 text-xs"
                      style={{ marginTop: 2 }}
                    >
                      {fieldErrors.cedula}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="3[0-9]{9}"
                      name="celular"
                      placeholder="Celular colombiano (10 números, empieza con 3)"
                      className={`input-samsung ${
                        fieldErrors.celular ? "border-red-500" : ""
                      }`}
                      value={guestForm.celular}
                      onChange={handleGuestChange}
                      required
                      disabled={loading || isRegisteredAsGuest}
                      style={{ minWidth: 120 }}
                      maxLength={10}
                      autoComplete="tel"
                    />
                  </div>
                  {fieldErrors.celular && (
                    <span
                      className="text-red-500 text-xs"
                      style={{ marginTop: 2 }}
                    >
                      {fieldErrors.celular}
                    </span>
                  )}
                </div>
              </div>
              {/* Mensaje de error general debajo del botón principal */}
              {error && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {error}
                </div>
              )}
              <style jsx>{`
                .input-samsung {
                  background: #fff;
                  border-radius: 0.75rem;
                  border: 1px solid #d1d5db;
                  padding: 0.85rem 1.1rem;
                  font-size: 1rem;
                  color: #222;
                  font-family: inherit;
                  outline: none;
                  transition: border 0.2s;
                  box-shadow: none;
                }
                .input-samsung:focus {
                  border-color: #0074e8;
                }
                .border-red-500 {
                  border-color: #ef4444 !important;
                }
              `}</style>
            </form>
          </div>
          )}

          {/* Formulario de dirección - Mostrar siempre cuando está registrado como invitado */}
          {isRegisteredAsGuest && (
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Agregar dirección de envío
              </h2>
              <p className="text-gray-600 mb-6">
                Para continuar con tu compra, necesitamos que agregues una dirección de envío
              </p>
              <AddNewAddressForm
                onAddressAdded={handleAddressAdded}
                onCancel={() => setIsRegisteredAsGuest(false)}
                withContainer={false}
                onSubmitRef={addressFormSubmitRef}
                onFormValidChange={setIsAddressFormValid}
                disabled={hasAddedAddress}
              />
            </div>
          )}
        </div>
        {/* Resumen de compra con Step4OrderSummary - Hidden en mobile */}
        <aside className="hidden md:flex flex-col gap-4">
          <div className="w-full">
            <Step4OrderSummary
              onFinishPayment={
                // Si está registrado como invitado y no tiene dirección, hacer submit del formulario
                isRegisteredAsGuest && !hasAddedAddress
                  ? () => {
                      if (addressFormSubmitRef.current) {
                        addressFormSubmitRef.current();
                      }
                    }
                  : handleContinue
              }
              onBack={onBack}
              buttonText={
                loading
                  ? "Procesando..."
                  : isSavingAddress
                  ? "Guardando"
                  : !isRegisteredAsGuest
                  ? "Registrarse como invitado"
                  : !hasAddedAddress
                  ? "Agregar dirección"
                  : "Continuar pago"
              }
              disabled={
                loading ||
                isSavingAddress ||
                (!isRegisteredAsGuest && !isGuestFormValid) ||
                (isRegisteredAsGuest && !hasAddedAddress && !isAddressFormValid) ||
                !tradeInValidation.isValid
              }
              isProcessing={loading || isSavingAddress}
              isSticky={false}
              deliveryMethod={
                globalThis.window !== undefined
                  ? (() => {
                      const method = globalThis.window.localStorage.getItem(
                        "checkout-delivery-method"
                      );
                      if (method === "tienda") return "pickup";
                      if (method === "domicilio") return "delivery";
                      if (method === "delivery" || method === "pickup")
                        return method;
                      return undefined;
                    })()
                  : undefined
              }
            />
            {/* Estilo personalizado para el botón "Registrarse como invitado" - más alto y texto en dos líneas */}
            <style jsx global>{`
              aside.hidden.md\\:flex button[data-testid="checkout-finish-btn"][data-button-text="Registrarse como invitado"] {
                min-height: 4.5rem !important;
                padding: 1rem 0.75rem !important;
                white-space: normal !important;
                word-wrap: break-word !important;
                word-break: break-word !important;
                line-height: 1.3 !important;
                text-align: center !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                justify-content: center !important;
              }
              aside.hidden.md\\:flex button[data-testid="checkout-finish-btn"][data-button-text="Registrarse como invitado"] span {
                white-space: normal !important;
                word-wrap: break-word !important;
                word-break: break-word !important;
                text-align: center !important;
                line-height: 1.3 !important;
              }
            `}</style>
          </div>

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

      {/* Sticky Bottom Bar - Solo Mobile */}
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
                $ {Number(calculations.total).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Botón continuar */}
          <button
            className={`w-full font-bold py-3 rounded-lg text-base transition text-white ${
              loading ||
              isSavingAddress ||
              (!isRegisteredAsGuest && !isGuestFormValid) ||
              (isRegisteredAsGuest && !hasAddedAddress) ||
              !tradeInValidation.isValid
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-[#222] hover:bg-[#333] cursor-pointer"
            }`}
            onClick={handleContinue}
            disabled={
              loading ||
              isSavingAddress ||
              (!isRegisteredAsGuest && !isGuestFormValid) ||
              (isRegisteredAsGuest && !hasAddedAddress) ||
              !tradeInValidation.isValid
            }
          >
            {loading
              ? "Procesando..."
              : isSavingAddress
              ? "Guardando"
              : !isRegisteredAsGuest
              ? "Registrarse como invitado"
              : !hasAddedAddress
              ? "Agregar dirección"
              : "Continuar pago"}
          </button>
        </div>
      </div>

      {/* Modal de Trade-In para cambiar producto */}
      <TradeInModal
        isOpen={isTradeInModalOpen}
        onClose={() => setIsTradeInModalOpen(false)}
        onCompleteTradeIn={handleCompleteTradeIn}
        onCancelWithoutCompletion={handleCancelWithoutCompletion}
      />
    </div>
  );
}
