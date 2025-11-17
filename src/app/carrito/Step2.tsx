"use client";
/**
 * Paso 2 del carrito de compras: Datos de envío y pago
 * Layout profesional, estilo Samsung, código limpio y escalable
 */
import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import AddressAutocomplete from "@/components/forms/AddressAutocomplete";
import AddressMap3D from "@/components/AddressMap3D";
import { PlaceDetails } from "@/types/places.types";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { apiPost } from "@/lib/api-client";
import { tradeInEndpoints } from "@/lib/api";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";
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
  onBack?: () => void;
  onContinue?: () => void;
}) {
  // Usar el hook centralizado useCart
  const { products: cartProducts } = useCart();
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
    direccion_linea_uno: "",
    direccion_ciudad: "",
  });

  // Estado para la dirección seleccionada con Google Places
  const [selectedAddress, setSelectedAddress] = useState<PlaceDetails | null>(
    null
  );

  // Handler para cuando se selecciona una dirección
  const handleAddressSelect = (place: PlaceDetails) => {
    console.log("🏠 Dirección seleccionada en checkout:", place);
    setSelectedAddress(place);

    // Actualizar los campos del formulario automáticamente
    setGuestForm((prev) => ({
      ...prev,
      direccion_linea_uno: place.formattedAddress,
      direccion_ciudad: place.city || "",
    }));

    // Limpiar errores de dirección ya que se seleccionó una válida
    setFieldErrors((prev) => ({
      ...prev,
      direccion_linea_uno: "",
      direccion_ciudad: "",
    }));
  };

  // Estado para validación y UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // Estado para errores por campo
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    nombre: "",
    apellido: "",
    cedula: "",
    celular: "",
    direccion_linea_uno: "",
    direccion_ciudad: "",
  });

  // Trade-In state management
  const [tradeInData, setTradeInData] = useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // --- Validación simplificada y centralizada ---
  // Filtros de seguridad por campo
  const filters = {
    cedula: (v: string) => v.replace(/[^0-9]/g, ""),
    celular: (v: string) => v.replace(/[^0-9]/g, ""),
    nombre: (v: string) => v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
    apellido: (v: string) => v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
    email: (v: string) => v.replace(/\s/g, ""),
    direccion_linea_uno: (v: string) => v.replace(/[^a-zA-Z0-9#\-\.\s]/g, ""),
    direccion_ciudad: (v: string) => v.replace(/[^0-9]/g, ""),
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
      if (!/^([1-9][0-9]{5,9})$/.test(v))
        return "La cédula debe empezar con un número diferente de cero.";
      return "";
    },
    celular: (v: string) => {
      if (!v) return "Por favor escribe tu número de celular.";
      if (v.length !== 10)
        return "El celular debe tener exactamente 10 números.";
      if (!/^3[0-9]{9}$/.test(v))
        return "El celular colombiano debe empezar con '3' y tener 10 dígitos.";
      return "";
    },
    direccion_linea_uno: (v: string) => {
      if (!v)
        return "Por favor ingresa la dirección (línea uno). Ejemplo: Calle 91c #84-97 int. 301";
      if (v.length < 8) return "La dirección es demasiado corta.";
      return "";
    },
    direccion_ciudad: (v: string) => {
      if (!v) return "Por favor ingresa la ciudad.";
      if (v.length < 3) return "La ciudad es demasiado corta.";
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
      direccion_linea_uno: "",
      direccion_ciudad: "",
    };
    Object.keys(errors).forEach((key) => {
      // @ts-expect-error Type mismatch due to dynamic key access; all keys are validated and safe here
      errors[key] = validators[key](form[key].trim());
    });
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
  const isGuestFormValid = Object.values(validateFields(guestForm)).every(
    (err) => !err
  );

  /**
   * Maneja el envío del formulario de invitado.
   * Valida los campos, guarda la información en localStorage y muestra feedback UX.
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
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "checkout-address",
        guestForm.direccion_linea_uno + ", " + guestForm.direccion_ciudad
      );
      localStorage.setItem("checkout-document", guestForm.cedula);
    }

    // Guardar en localStorage bajo la clave 'guest-payment-info'
    try {
      const data = await apiPost<GuestUserResponse>("/api/users/guest/new", {
        guestInfo: {
          nombre: guestForm.nombre,
          apellido: guestForm.apellido,
          email: guestForm.email,
          numero_documento: guestForm.cedula,
          telefono: guestForm.celular,
        },
        addressInfo: {
          linea_uno: guestForm.direccion_linea_uno,
          ciudad: guestForm.direccion_ciudad,
        },
      });
      localStorage.setItem("checkout-address", JSON.stringify(data.address));
      localStorage.setItem("imagiq_user", JSON.stringify(data.user));
    } catch {
      setError(
        "No se pudo guardar la información localmente. Intenta de nuevo."
      );
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (typeof onContinue === "function") {
          onContinue();
        }
      }, 800);
    }, 1200);
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
    if (!validation.isValid && validation.errorMessage && validation.errorMessage.includes("Te removimos")) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");
      
      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description: "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
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

    if (!isGuestFormValid) {
      setError("Por favor completa todos los campos obligatorios.");
      const newFieldErrors: typeof fieldErrors = {
        email: guestForm.email.trim() ? "" : "Este campo es obligatorio",
        nombre: guestForm.nombre.trim() ? "" : "Este campo es obligatorio",
        apellido: guestForm.apellido.trim() ? "" : "Este campo es obligatorio",
        cedula: guestForm.cedula.trim() ? "" : "Este campo es obligatorio",
        celular: guestForm.celular.trim() ? "" : "Este campo es obligatorio",
        direccion_linea_uno: guestForm.direccion_linea_uno.trim()
          ? ""
          : "Este campo es obligatorio",
        direccion_ciudad: guestForm.direccion_ciudad.trim()
          ? ""
          : "Este campo es obligatorio",
      };
      setFieldErrors(newFieldErrors);
      return;
    }
    await handleGuestSubmit();
  };
  useEffect(() => {
    const haveAccount = safeGetLocalStorage<{ email?: string }>(
      "imagiq_user",
      {}
    );
    console.log(haveAccount);
    if (haveAccount.email) {
      router.push("/carrito/step3");
    }

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
  }, [router]);

  // Handle Trade-In removal
  const handleRemoveTradeIn = () => {
    localStorage.removeItem("imagiq_trade_in");
    setTradeInData(null);
  };

  // Verificar indRetoma para cada producto único en segundo plano (sin mostrar nada en UI)
  useEffect(() => {
    if (cartProducts.length === 0) return;

    const verifyTradeIn = async () => {
      // Obtener SKUs únicos (sin duplicados)
      const uniqueSkus = Array.from(
        new Set(cartProducts.map((p) => p.sku))
      );

      // Filtrar productos que necesitan verificación (solo si no tienen indRetoma definido)
      const productsToVerify = uniqueSkus.filter((sku) => {
        const product = cartProducts.find((p) => p.sku === sku);
        return product && product.indRetoma === undefined;
      });

      if (productsToVerify.length === 0) return;

      // Verificar cada SKU único en segundo plano
      for (let i = 0; i < productsToVerify.length; i++) {
        const sku = productsToVerify[i];

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        try {
          const response = await tradeInEndpoints.checkSkuForTradeIn({ sku });
          if (!response.success || !response.data) {
            throw new Error('Error al verificar trade-in');
          }
          const result = response.data;
          const indRetoma = result.indRetoma ?? (result.aplica ? 1 : 0);

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
          // Silenciar errores, solo log en consola
          console.error(
            `❌ Error al verificar trade-in para SKU ${sku}:`,
            error
          );
        }
      }
    };

    verifyTradeIn();
  }, [cartProducts]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-0 relative z-10">
      {/* Fondo blanco sólido para cubrir cualquier animación de fondo */}
      <div className="fixed inset-0 bg-white -z-10" />
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Login y invitado */}
        <div className="col-span-2 flex flex-col gap-8">
          {/* Login */}
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
              <a
                href="/login/create-account"
                className="text-[#0074E8] font-semibold underline"
              >
                Regístrate aquí
              </a>
            </div>
          </div>
          {/* Invitado */}
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
                  disabled={loading || success}
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
                    disabled={loading || success}
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
                    disabled={loading || success}
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
              {/* Dirección con autocompletado inteligente */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Dirección de Envío *
                </label>
                <AddressAutocomplete
                  addressType="shipping"
                  placeholder="Busca tu dirección (ej: Calle 80 # 15-25, Bogotá)"
                  onPlaceSelect={handleAddressSelect}
                  disabled={loading || success}
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Solo entregas en zonas de cobertura • ✨ Autocompletado con
                  Google Places
                </p>
                {(fieldErrors.direccion_linea_uno ||
                  fieldErrors.direccion_ciudad) && (
                  <span
                    className="text-red-500 text-xs"
                    style={{ marginTop: 2 }}
                  >
                    {fieldErrors.direccion_linea_uno ||
                      fieldErrors.direccion_ciudad}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <select
                  id="ciudad"
                  name="direccion_ciudad"
                  className={`input-samsung ${
                    fieldErrors.direccion_ciudad ? "border-red-500" : ""
                  }`}
                  value={guestForm.direccion_ciudad}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || success}
                  autoComplete="address-level2"
                >
                  <option value="">-- Elige una ciudad --</option>
                  <option value="50006000">ACACIAS</option>
                  <option value="41006000">ACEVEDO</option>
                  <option value="20011000">AGUACHICA</option>
                  <option value="25001000">AGUA DE DIOS</option>
                  <option value="85010000">AGUAZUL</option>
                  <option value="20013000">AGUSTIN CODAZZI</option>
                  <option value="41016000">AIPE</option>
                  <option value="25035000">ANAPOIMA</option>
                  <option value="76036000">ANDALUCIA</option>
                  <option value="17042000">ANSERMA</option>
                  <option value="05045000">APARTADO</option>
                  <option value="66045000">APIA</option>
                  <option value="68051000">ARATOCA</option>
                  <option value="81001000">ARAUCA</option>
                  <option value="25053000">ARBELAEZ</option>
                  <option value="05055000">ARGELIA</option>
                  <option value="63001000">ARMENIA</option>
                  <option value="68077000">BARBOSA</option>
                  <option value="68079000">BARICHARA</option>
                  <option value="68081000">BARRANCABERMEJA</option>
                  <option value="44078000">BARRANCAS</option>
                  <option value="08001000">BARRANQUILLA</option>
                  <option value="18094000">BELEN DE LOS ANDAQUIES</option>
                  <option value="66088000">BELEN DE UMBRIA</option>
                  <option value="05088000">BELLO</option>
                  <option value="11001000">Bogota</option>
                  <option value="25099000">BOJACA</option>
                  <option value="76100000">BOLIVAR</option>
                  <option value="20060000">BOSCONIA</option>
                  <option value="68001000">Bucaramanga</option>
                  <option value="76109000">BUENAVENTURA</option>
                  <option value="76113000">BUGALAGRANDE</option>
                  <option value="76122000">CAICEDONIA</option>
                  <option value="73124000">CAJAMARCA</option>
                  <option value="25126000">CAJICA</option>
                  <option value="63130000">CALARCA</option>
                  <option value="05129000">CALDAS</option>
                  <option value="76001000">Cali</option>
                  <option value="41132000">CAMPOALEGRE</option>
                  <option value="76130000">CANDELARIA</option>
                  <option value="25148000">CAPARRAPI</option>
                  <option value="25151000">CAQUEZA</option>
                  <option value="73148000">CARMEN DE APICALA</option>
                  <option value="25154000">CARMEN DE CARUPA</option>
                  <option value="13001000">CARTAGENA</option>
                  <option value="18150000">CARTAGENA DEL CHAIRA</option>
                  <option value="76147000">CARTAGO</option>
                  <option value="50150000">CASTILLA LA NUEVA</option>
                  <option value="05154000">CAUCASIA</option>
                  <option value="23162000">CERETE</option>
                  <option value="68167000">CHARALA</option>
                  <option value="25175000">CHIA</option>
                  <option value="05172000">CHIGORODO</option>
                  <option value="23168000">CHIMA</option>
                  <option value="54172000">CHINACOTA</option>
                  <option value="17174000">CHINCHINA</option>
                  <option value="25178000">CHIPAQUE</option>
                  <option value="15176000">CHIQUINQUIRA</option>
                  <option value="20178000">CHIRIGUANA</option>
                  <option value="47189000">CIENAGA</option>
                  <option value="23189000">CIENAGA DE ORO</option>
                  <option value="63190000">CIRCASIA</option>
                  <option value="76233004">CISNEROS</option>
                  <option value="05101000">CIUDAD BOLIVAR</option>
                  <option value="25200000">COGUA</option>
                  <option value="05209000">CONCORDIA</option>
                  <option value="05212000">COPACABANA</option>
                  <option value="63212000">CORDOBA</option>
                  <option value="19212000">CORINTO</option>
                  <option value="70215000">COROZAL</option>
                  <option value="15215000">CORRALES</option>
                  <option value="25214000">COTA</option>
                  <option value="50223000">CUBARRAL</option>
                  <option value="25224000">CUCUNUBA</option>
                  <option value="54001000">CUCUTA</option>
                  <option value="54223000">CUCUTILLA</option>
                  <option value="05237000">DON MATIAS</option>
                  <option value="05591004">Doradal</option>
                  <option value="66170000">DOSQUEBRADAS</option>
                  <option value="15238000">DUITAMA</option>
                  <option value="47245000">EL BANCO</option>
                  <option value="76246000">EL CAIRO</option>
                  <option value="13244000">EL CARMEN DE</option>
                  <option value="05148000">EL CARMEN DE VIBORAL</option>
                  <option value="76248000">EL CERRITO</option>
                  <option value="25245000">EL COLEGIO</option>
                  <option value="18247000">EL DONCELLO</option>
                  <option value="20250000">EL PASO</option>
                  <option value="25260000">EL ROSAL</option>
                  <option value="52256000">EL ROSARIO</option>
                  <option value="05266000">ENVIGADO</option>
                  <option value="73268000">ESPINAL</option>
                  <option value="25269000">FACATATIVA</option>
                  <option value="63272000">FILANDIA</option>
                  <option value="73275000">FLANDES</option>
                  <option value="18001000">FLORENCIA</option>
                  <option value="76275000">FLORIDA</option>
                  <option value="68276000">FLORIDABLANCA</option>
                  <option value="44279000">FONSECA</option>
                  <option value="19532008">FREDONIA</option>
                  <option value="47288000">FUNDACION</option>
                  <option value="25286000">FUNZA</option>
                  <option value="25290000">FUSAGASUGA</option>
                  <option value="25293000">GACHALA</option>
                  <option value="25295000">GACHANCIPA</option>
                  <option value="08296000">GALAPA</option>
                  <option value="20295000">GAMARRA</option>
                  <option value="15299000">GARAGOA</option>
                  <option value="41298000">GARZON</option>
                  <option value="41306000">GIGANTE</option>
                  <option value="25307000">GIRARDOT</option>
                  <option value="05308000">GIRARDOTA</option>
                  <option value="68307000">GIRON</option>
                  <option value="50313000">GRANADA</option>
                  <option value="76318000">GUACARI</option>
                  <option value="25317000">GUACHETA</option>
                  <option value="76111000">GUADALAJARA DE BUGA</option>
                  <option value="25320000">GUADUAS</option>
                  <option value="50318000">GUAMAL</option>
                  <option value="70265000">GUARANDA</option>
                  <option value="05318000">GUARNE</option>
                  <option value="25322000">GUASCA</option>
                  <option value="25326000">GUATAVITA</option>
                  <option value="15322000">GUATEQUE</option>
                  <option value="66318000">GUATICA</option>
                  <option value="25328000">GUAYABAL DE SIQUIMA</option>
                  <option value="85125000">HATO COROZAL</option>
                  <option value="05353000">HISPANIA</option>
                  <option value="73001000">Ibague</option>
                  <option value="94001000">INIRIDA</option>
                  <option value="52356000">IPIALES</option>
                  <option value="41357000">IQUIRA</option>
                  <option value="27361000">ISTMINA</option>
                  <option value="05360000">ITAGUI</option>
                  <option value="76364000">JAMUNDI</option>
                  <option value="05364000">JARDIN</option>
                  <option value="05368000">JERICO</option>
                  <option value="08372000">JUAN DE ACOSTA</option>
                  <option value="25377000">LA CALERA</option>
                  <option value="05376000">LA CEJA</option>
                  <option value="76377000">LA CUMBRE</option>
                  <option value="17380000">LA DORADA</option>
                  <option value="05380000">LA ESTRELLA</option>
                  <option value="86865000">La hormiga</option>
                  <option value="25386000">LA MESA</option>
                  <option value="41396000">LA PLATA</option>
                  <option value="52399000">LA UNION</option>
                  <option value="25402000">LA VEGA</option>
                  <option value="76403000">LA VICTORIA</option>
                  <option value="66400000">LA VIRGINIA</option>
                  <option value="68406000">LEBRIJA</option>
                  <option value="73408000">LERIDA</option>
                  <option value="91001000">LETICIA</option>
                  <option value="73411000">LIBANO</option>
                  <option value="23417000">LORICA</option>
                  <option value="70418000">LOS PALMITOS</option>
                  <option value="54405000">LOS PATIOS</option>
                  <option value="05425000">MACEO</option>
                  <option value="25426000">MACHETA</option>
                  <option value="25430000">MADRID</option>
                  <option value="13430000">MAGANGUE</option>
                  <option value="44430000">MAICAO</option>
                  <option value="68432000">MALAGA</option>
                  <option value="08433000">MALAMBO</option>
                  <option value="85139000">MANI</option>
                  <option value="17001000">MANIZALES</option>
                  <option value="17433000">MANZANARES</option>
                  <option value="05440000">MARINILLA</option>
                  <option value="73443000">MARIQUITA</option>
                  <option value="05001000">MEDELLIN</option>
                  <option value="25438000">MEDINA</option>
                  <option value="73449000">MELGAR</option>
                  <option value="15455000">MIRAFLORES</option>
                  <option value="19455000">MIRANDA</option>
                  <option value="66456000">MISTRATO</option>
                  <option value="97001000">MITU</option>
                  <option value="86001000">MOCOA</option>
                  <option value="68464000">MOGOTES</option>
                  <option value="13468000">MOMPOS</option>
                  <option value="15469000">MONIQUIRA</option>
                  <option value="23466000">MONTELIBANO</option>
                  <option value="23001000">Monteria</option>
                  <option value="85162000">MONTERREY</option>
                  <option value="70473000">MORROA</option>
                  <option value="25473000">MOSQUERA</option>
                  <option value="25483000">NARIÑO</option>
                  <option value="05490000">NECOCLI</option>
                  <option value="17486000">NEIRA</option>
                  <option value="41001000">NEIVA</option>
                  <option value="15491000">NOBSA</option>
                  <option value="54498000">OCANA</option>
                  <option value="68500000">OIBA</option>
                  <option value="15507000">OTANCHE</option>
                  <option value="25513000">PACHO</option>
                  <option value="17513000">PACORA</option>
                  <option value="20517000">PAILITAS</option>
                  <option value="15516000">PAIPA</option>
                  <option value="08001000">PALMAR DE VARELA</option>
                  <option value="76520000">PALMIRA</option>
                  <option value="73520000">PALOCABILDO</option>
                  <option value="54518000">PAMPLONA</option>
                  <option value="25530000">PARATEBUENO</option>
                  <option value="52001000">PASTO</option>
                  <option value="85250000">PAZ DE ARIPORO</option>
                  <option value="66001000">PEREIRA</option>
                  <option value="15542000">PESCA</option>
                  <option value="68547000">PIEDECUESTA</option>
                  <option value="19548000">PIENDAMO</option>
                  <option value="41548000">PITAL</option>
                  <option value="41551000">PITALITO</option>
                  <option value="73555000">PLANADAS</option>
                  <option value="47555000">PLATO</option>
                  <option value="19001000">POPAYAN</option>
                  <option value="23570000">PUEBLO NUEVO</option>
                  <option value="86568000">PUERTO ASIS</option>
                  <option value="05579000">PUERTO BERRIO</option>
                  <option value="15572000">PUERTO BOYACA</option>
                  <option value="08638000">PUERTO COLOMBIA</option>
                  <option value="50450000">PUERTO CONCORDIA</option>
                  <option value="50568000">PUERTO GAITAN</option>
                  <option value="50573000">PUERTO LOPEZ</option>
                  <option value="05658000">PUERTO RICO</option>
                  <option value="19573000">PUERTO TEJADA</option>
                  <option value="05591000">PUERTO TRIUNFO</option>
                  <option value="25594000">QUETAME</option>
                  <option value="27001000">QUIBDO</option>
                  <option value="63594000">QUIMBAYA</option>
                  <option value="05604000">REMEDIOS</option>
                  <option value="50606000">RESTREPO</option>
                  <option value="05607000">RETIRO</option>
                  <option value="25612000">RICAURTE</option>
                  <option value="44001000">RIOHACHA</option>
                  <option value="05615000">RIONEGRO</option>
                  <option value="63594000">RIOSUCIO</option>
                  <option value="41615000">RIVERA</option>
                  <option value="76622000">ROLDANILLO</option>
                  <option value="08638000">SABANALARGA</option>
                  <option value="05631000">SABANETA</option>
                  <option value="23660000">SAHAGUN</option>
                  <option value="73671000">SALDANA</option>
                  <option value="15646000">SAMACA</option>
                  <option value="41668000">SAN AGUSTIN</option>
                  <option value="20710000">SAN ALBERTO</option>
                  <option value="23672000">SAN ANTERO</option>
                  <option value="25645000">SAN ANTONIO DEL TEQUENDAMA</option>
                  <option value="25658000">SAN FRANCISCO</option>
                  <option value="68679000">SAN GIL</option>
                  <option value="13654000">SAN JACINTO</option>
                  <option value="95001000">SAN JOSE DEL GUAVIARE</option>
                  <option value="44650000">SAN JUAN DEL CESAR</option>
                  <option value="25662000">SAN JUAN DE RIO SECO</option>
                  <option value="52687000">SAN LORENZO</option>
                  <option value="05660000">SAN LUIS</option>
                  <option value="50689000">SAN MARTIN</option>
                  <option value="13670000">SAN PABLO</option>
                  <option value="70717000">SAN PEDRO</option>
                  <option value="47001000">SANTA MARTA</option>
                  <option value="15686000">SANTANA</option>
                  <option value="19698000">SANTANDER DE QUILICHAO</option>
                  <option value="66682000">SANTA ROSA DE CABAL</option>
                  <option value="05686000">SANTA ROSA DE OSOS</option>
                  <option value="15693000">SANTA ROSA DE VITERBO</option>
                  <option value="08685000">SANTO TOMAS</option>
                  <option value="68689000">SAN VICENTE DE CHUCURI</option>
                  <option value="18753000">SAN VICENTE DEL CAGUAN</option>
                  <option value="81736000">SARAVENA</option>
                  <option value="05736000">SEGOVIA</option>
                  <option value="76736000">SEVILLA</option>
                  <option value="25740000">SIBATE</option>
                  <option value="54743000">SILOS</option>
                  <option value="19743000">SILVIA</option>
                  <option value="70001000">SINCELEJO</option>
                  <option value="25754000">SOACHA</option>
                  <option value="68755000">SOCORRO</option>
                  <option value="15759000">SOGAMOSO</option>
                  <option value="08758000">SOLEDAD</option>
                  <option value="15761000">SOMONDOCO</option>
                  <option value="05756000">SONSON</option>
                  <option value="25758000">SOPO</option>
                  <option value="68770000">SUAITA</option>
                  <option value="25769000">SUBACHOQUE</option>
                  <option value="25772000">SUESCA</option>
                  <option value="17777000">SUPIA</option>
                  <option value="25785000">TABIO</option>
                  <option value="81794000">TAME</option>
                  <option value="41791000">TARQUI</option>
                  <option value="05792000">TARSO</option>
                  <option value="85410000">TAURAMENA</option>
                  <option value="41799000">TELLO</option>
                  <option value="25799000">TENJO</option>
                  <option value="15804000">TIBANA</option>
                  <option value="54810000">TIBU</option>
                  <option value="23807000">TIERRALTA</option>
                  <option value="41807000">TIMANA</option>
                  <option value="19807000">TIMBIO</option>
                  <option value="15808000">TINJACA</option>
                  <option value="25817000">TOCANCIPA</option>
                  <option value="70823000">TOLU VIEJO</option>
                  <option value="76823000">TORO</option>
                  <option value="76834000">TULUA</option>
                  <option value="52835000">TUMACO</option>
                  <option value="15001000">TUNJA</option>
                  <option value="52838000">TUQUERRES</option>
                  <option value="13836000">TURBACO</option>
                  <option value="05837000">TURBO</option>
                  <option value="15835000">TURMEQUE</option>
                  <option value="25841000">UBAQUE</option>
                  <option value="05847000">URRAO</option>
                  <option value="68855000">VALLE DE SAN JOSE</option>
                  <option value="20001000">VALLEDUPAR</option>
                  <option value="68861000">VELEZ</option>
                  <option value="73861000">VENADILLO</option>
                  <option value="05861000">VENECIA</option>
                  <option value="25862000">VERGARA</option>
                  <option value="05679004">VERSALLES</option>
                  <option value="15407000">VILLA DE LEYVA</option>
                  <option value="54874000">VILLA DEL ROSARIO</option>
                  <option value="25843000">VILLA DE SAN DIEGO DE UBATE</option>
                  <option value="73870000">VILLAHERMOSA</option>
                  <option value="17873000">VILLAMARIA</option>
                  <option value="85440000">VILLANUEVA</option>
                  <option value="19845000">VILLA RICA</option>
                  <option value="50001000">Villavicencio</option>
                  <option value="25875000">VILLETA</option>
                  <option value="25878000">VIOTA</option>
                  <option value="17877000">VITERBO</option>
                  <option value="05887000">YARUMAL</option>
                  <option value="85001000">YOPAL</option>
                  <option value="76892000">YUMBO</option>
                  <option value="05895000">ZARAGOZA</option>
                  <option value="76895000">ZARZAL</option>
                  <option value="15897000">ZETAQUIRA</option>
                  <option value="25899000">ZIPAQUIRA</option>
                </select>
                {fieldErrors.direccion_ciudad && (
                  <span
                    className="text-red-500 text-xs"
                    style={{ marginTop: 2 }}
                  >
                    {fieldErrors.direccion_ciudad}
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
                    disabled={loading || success}
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
                      disabled={loading || success}
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
        </div>
        {/* Resumen de compra con Step4OrderSummary */}
        <div className="flex flex-col gap-4">
          <Step4OrderSummary
            onFinishPayment={handleContinue}
            onBack={onBack}
            buttonText={loading ? "Procesando..." : "Continuar pago"}
            disabled={loading || success || !isGuestFormValid || !tradeInValidation.isValid}
            isProcessing={loading}
          />

          {/* Banner de Trade-In - Debajo del resumen */}
          {tradeInData?.completed && (
            <TradeInCompletedSummary
              deviceName={tradeInData.deviceName}
              tradeInValue={tradeInData.value}
              onEdit={handleRemoveTradeIn}
              validationError={!tradeInValidation.isValid ? getTradeInValidationMessage(tradeInValidation) : undefined}
            />
          )}

          {/* Mapa 3D de la dirección seleccionada */}
          {selectedAddress && (
            <div className="bg-white rounded-2xl p-6 shadow border border-[#E5E5E5]">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                📍 Ubicación de Entrega Confirmada
              </h4>
              <AddressMap3D
                address={selectedAddress}
                height="200px"
                enable3D={true}
                showControls={false}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                ✅ Tu pedido será enviado a esta dirección • Verifica que sea
                correcta
              </p>
            </div>
          )}

          {/* Mensajes de error/success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ¡Compra realizada como invitado!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
