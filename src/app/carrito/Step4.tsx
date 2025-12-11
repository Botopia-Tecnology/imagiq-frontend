"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Direccion } from "@/types/user";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import { useAuthContext } from "@/features/auth/context";
import { addressesService } from "@/services/addresses.service";
import type { Address } from "@/types/address";
import Modal from "@/components/ui/Modal";
import AddNewAddressForm from "./components/AddNewAddressForm";
import { MapPin, Plus, Check } from "lucide-react";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { useCart } from "@/hooks/useCart";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";
import { toast } from "sonner";

interface Step6Props {
  readonly onBack?: () => void;
  readonly onContinue?: () => void;
}

type BillingType = "natural" | "juridica";

interface BillingData {
  type: BillingType;
  // Campos comunes
  nombre: string;
  documento: string;
  tipoDocumento?: string;
  email: string;
  telefono: string;
  direccion: Direccion | null;

  // Campos específicos de persona jurídica
  razonSocial?: string;
  nit?: string;
  nombreRepresentante?: string;
}

export default function Step6({ onBack, onContinue }: Step6Props) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { products } = useCart();

  const [billingType, setBillingType] = useState<BillingType>("natural");
  const [useShippingData, setUseShippingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estados para direcciones
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const [billingData, setBillingData] = useState<BillingData>({
    type: "natural",
    nombre: "",
    documento: "",
    tipoDocumento: "C.C.", // Valor por defecto
    email: "",
    telefono: "",
    direccion: null,
  });

  // Trade-In state management
  const [tradeInData, setTradeInData] = useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

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

  // Redirigir a Step3 si la dirección cambia desde el header
  useEffect(() => {
    const handleAddressChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const fromHeader = customEvent.detail?.fromHeader;

      if (fromHeader) {
        console.log('🔄 Dirección cambiada desde header en Step6, redirigiendo a Step3...');
        router.push('/carrito/step3');
      }
    };

    window.addEventListener('address-changed', handleAddressChange as EventListener);

    return () => {
      window.removeEventListener('address-changed', handleAddressChange as EventListener);
    };
  }, [router]);

  // Convertir Address a Direccion
  const addressToDireccion = (address: Address): Direccion => {
    return {
      id: address.id,
      usuario_id: address.usuarioId,
      email: user?.email || "",
      linea_uno: address.direccionFormateada,
      codigo_dane: "",
      ciudad: address.ciudad || "",
      pais: address.pais,
      esPredeterminada: address.esPredeterminada,
    };
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id);
    const direccion = addressToDireccion(address);
    setBillingData((prev) => ({
      ...prev,
      direccion,
    }));
  };

  // Cargar direcciones del usuario
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return;

      setIsLoadingAddresses(true);
      try {
        const user = safeGetLocalStorage<{ id?: string }>("imagiq_user", {});
        const userAddresses = await addressesService.getUserAddressesByType(
          "FACTURACION",
          user?.id || ""
        );
        setAddresses(userAddresses);

        // Auto-seleccionar dirección predeterminada
        const defaultAddress = userAddresses.find(
          (addr) => addr.esPredeterminada
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          handleAddressSelect(defaultAddress);
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cargar datos del usuario autenticado o de localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("checkout-billing-data");

    if (savedData) {
      // Si hay datos guardados en localStorage, usarlos
      try {
        const parsed = JSON.parse(savedData);
        setBillingData({
          ...parsed,
          // Asegurar que tipoDocumento siempre tenga un valor por defecto
          tipoDocumento: parsed.tipoDocumento || "C.C.",
        });
        setBillingType(parsed.type || "natural");

        // Si hay una dirección guardada, intentar seleccionarla
        if (parsed.direccion?.id) {
          setSelectedAddressId(parsed.direccion.id);
        }
      } catch (error) {
        console.error("Error parsing billing data:", error);
      }
    } else if (user) {
      // Si no hay datos guardados, auto-completar con datos del usuario
      setBillingData({
        type: "natural",
        nombre: `${user.nombre} ${user.apellido}`.trim(),
        documento: user.numero_documento || "",
        tipoDocumento: "C.C.", // Valor por defecto
        email: user.email || "",
        telefono: user.telefono || "",
        direccion: null,
      });
    }
  }, [user]);

  // Cargar dirección de envío si el usuario marca el checkbox
  useEffect(() => {
    if (useShippingData) {
      const shippingAddress = localStorage.getItem("checkout-address");
      if (shippingAddress) {
        try {
          const parsed = JSON.parse(shippingAddress);
          setBillingData((prev) => ({
            ...prev,
            direccion: parsed,
          }));
        } catch (error) {
          console.error("Error parsing shipping address:", error);
        }
      }
    }
  }, [useShippingData]);

  // Load Trade-In data from localStorage
  useEffect(() => {
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

  const handleTypeChange = (type: BillingType) => {
    setBillingType(type);
    setBillingData((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleInputChange = (field: keyof BillingData, value: string) => {
    setBillingData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleOpenAddAddressModal = () => {
    setIsAddAddressModalOpen(true);
  };

  const handleCloseAddAddressModal = () => {
    setIsAddAddressModalOpen(false);
  };

  const handleAddressAdded = async (newAddress: Address) => {
    // Recargar direcciones
    try {
      const user = safeGetLocalStorage<{ id?: string }>("imagiq_user", {});
      const userAddresses = await addressesService.getUserAddressesByType(
        "FACTURACION",
        user?.id || ""
      );
      setAddresses(userAddresses);

      // Seleccionar la nueva dirección
      handleAddressSelect(newAddress);
      handleCloseAddAddressModal();
    } catch (error) {
      console.error("Error reloading addresses:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validaciones comunes
    if (!billingData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!billingData.documento.trim()) {
      newErrors.documento = "El documento es requerido";
    }
    if (!billingData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(billingData.email)) {
      newErrors.email = "El email no es válido";
    }
    if (!billingData.tipoDocumento?.trim()) {
      newErrors.tipoDocumento = "El tipo de documento es requerido";
    }
    if (!billingData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    }
    if (!billingData.direccion) {
      newErrors.direccion = "La dirección es requerida";
    }

    // Validaciones específicas de persona jurídica
    if (billingType === "juridica") {
      if (!billingData.razonSocial?.trim()) {
        newErrors.razonSocial = "La razón social es requerida";
      }
      if (!billingData.nit?.trim()) {
        newErrors.nit = "El NIT es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(products);
    if (!validation.isValid) {
      alert(getTradeInValidationMessage(validation));
      return;
    }

    // Siempre validar el formulario para mostrar errores
    if (!validateForm()) {
      // Hacer scroll al primer error
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Preparar datos a guardar; si se usa la dirección de envío, asegurar que guardamos su `id`
    let billingToSave: BillingData = { ...billingData };
    if (useShippingData) {
      const shippingAddressStr = localStorage.getItem("checkout-address");
      if (shippingAddressStr) {
        try {
          const parsed = JSON.parse(shippingAddressStr);
          if (parsed && typeof parsed === "object") {
            // Asegurar que la dirección en el billing incluye el id del checkout-address
            billingToSave = {
              ...billingToSave,
              direccion: {
                ...(billingToSave.direccion || {}),
                ...parsed,
              },
            };
          }
        } catch (err) {
          // Si falla el parseo, no interrumpir el guardado; seguimos con billingData actual
          console.error("Error parsing checkout-address for billing id:", err);
        }
      }
    }

    // Guardar datos en localStorage
    localStorage.setItem(
      "checkout-billing-data",
      JSON.stringify(billingToSave)
    );

    if (onContinue) {
      onContinue();
    }
  };


  // Ordenador para direcciones: predeterminadas primero
  const sortAddressesByDefault = (a: Address, b: Address) => {
    if (a.esPredeterminada === b.esPredeterminada) return 0;
    return a.esPredeterminada ? -1 : 1;
  };

  // Renderiza la sección de direcciones (evita ternarios anidados en JSX)
  const renderAddressSection = () => {
    if (useShippingData) {
      return (
        billingData.direccion && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              {billingData.direccion.linea_uno}
            </p>
            {billingData.direccion.ciudad && (
              <p className="text-sm text-gray-600 mt-1">
                {billingData.direccion.ciudad}
              </p>
            )}
          </div>
        )
      );
    }

    if (isLoadingAddresses) {
      return (
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
      );
    }

    if (addresses.length > 0) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              Selecciona una dirección de facturación
            </p>
            <button
              type="button"
              onClick={handleOpenAddAddressModal}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Nueva dirección
            </button>
          </div>

          {addresses.toSorted(sortAddressesByDefault).map((address) => (
            <button
              key={address.id}
              type="button"
              onClick={() => handleAddressSelect(address)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAddressId === address.id
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-500 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
                    selectedAddressId === address.id
                      ? "border-black bg-black"
                      : "border-gray-500 bg-white"
                  }`}
                >
                  {selectedAddressId === address.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>

                <div className="flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">
                      {address.nombreDireccion}
                    </p>
                    {address.esPredeterminada && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {address.direccionFormateada}
                  </p>
                  {address.ciudad && (
                    <p className="text-xs text-gray-500 mt-1">
                      {address.ciudad}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-500 rounded-xl p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 text-sm mb-4">
          No tienes direcciones de facturación guardadas
        </p>
        <button
          type="button"
          onClick={handleOpenAddAddressModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar dirección
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full pb-40 md:pb-0">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de facturación */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-6">
              {/* Header con título y selector de tipo de persona */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-[22px] font-bold">
                  Datos de facturación
                </h2>

                {/* Checkbox: Compra empresa */}
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-colors bg-white">
                  <input
                    type="checkbox"
                    checked={billingType === "juridica"}
                    onChange={(e) => handleTypeChange(e.target.checked ? "juridica" : "natural")}
                    className="w-5 h-5 accent-black cursor-pointer"
                  />
                  <span className="text-base font-semibold text-gray-900">
                    Compra empresa
                  </span>
                </label>
              </div>

              {/* Checkbox: Usar mismos datos de envío */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useShippingData}
                    onChange={(e) => setUseShippingData(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-sm text-gray-700">
                    Usar los mismos datos de envío
                  </span>
                </label>
              </div>

              {/* Formulario según tipo de persona */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${billingType === "juridica" ? "opacity-100" : "opacity-0 hidden"}`}>
                {billingType === "juridica" && (
                  <>
                    {/* Razón Social y NIT en la misma fila */}
                    <div>
                      <label
                        htmlFor="razonSocial"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Razón Social <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="razonSocial"
                        type="text"
                        value={billingData.razonSocial || ""}
                        onChange={(e) =>
                          handleInputChange("razonSocial", e.target.value)
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors ${
                          errors.razonSocial
                            ? "border-red-500"
                            : "border-gray-500"
                        }`}
                        placeholder="Empresa S.A.S."
                      />
                      {errors.razonSocial && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.razonSocial}
                        </p>
                      )}
                    </div>

                    {/* NIT */}
                    <div>
                      <label
                        htmlFor="nit"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        NIT <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="nit"
                        type="text"
                        value={billingData.nit || ""}
                        onChange={(e) =>
                          handleInputChange("nit", e.target.value)
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors ${
                          errors.nit ? "border-red-500" : "border-gray-500"
                        }`}
                        placeholder="900123456-7"
                      />
                      {errors.nit && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.nit}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Formulario de persona natural o campos comunes */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${billingType === "natural" ? "opacity-100" : "opacity-100"}`}>

                {/* Nombre (o nombre del contacto para jurídica) */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {billingType === "juridica"
                      ? "Nombre de contacto"
                      : "Nombre completo"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={billingData.nombre}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.nombre ? "border-red-500" : "border-gray-500"
                    }`}
                    placeholder="Juan Pérez"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                  )}
                </div>

                {/* Tipo de documento */}
                <div className="md:col-span-1">
                  <label
                    htmlFor="tipoDocumento"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo de documento <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tipoDocumento"
                    name="tipoDocumento"
                    value={billingData.tipoDocumento || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "tipoDocumento" as keyof BillingData,
                        e.target.value
                      )
                    }
                    aria-invalid={Boolean(errors.tipoDocumento)}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.tipoDocumento
                        ? "border-red-500"
                        : "border-gray-500"
                    }`}
                  >
                    <option value="">Selecciona el tipo de documento</option>
                    <option value="C.C.">C.C.</option>
                    <option value="C.E.">C.E.</option>
                    <option value="NIT">NIT</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                  {errors.tipoDocumento && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tipoDocumento}
                    </p>
                  )}
                </div>

                {/* Documento */}
                <div className="md:col-span-1">
                  <label
                    htmlFor="documento"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {billingType === "juridica"
                      ? "Cédula del contacto"
                      : "Documento de identidad"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="documento"
                    name="documento"
                    type="text"
                    value={billingData.documento}
                    onChange={(e) =>
                      handleInputChange("documento", e.target.value)
                    }
                    aria-invalid={Boolean(errors.documento)}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.documento ? "border-red-500" : "border-gray-500"
                    }`}
                    placeholder="1234567890"
                  />
                  {errors.documento && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.documento}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={billingData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.email ? "border-red-500" : "border-gray-500"
                    }`}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    value={billingData.telefono}
                    onChange={(e) =>
                      handleInputChange("telefono", e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.telefono ? "border-red-500" : "border-gray-500"
                    }`}
                    placeholder="3001234567"
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.telefono}
                    </p>
                  )}
                </div>
              </div>

              {/* Dirección de facturación */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dirección de facturación
                </h3>

                <Modal
                  isOpen={isAddAddressModalOpen}
                  onClose={handleCloseAddAddressModal}
                  size="lg"
                  showCloseButton={false}
                >
                  <AddNewAddressForm
                    onAddressAdded={handleAddressAdded}
                    onCancel={handleCloseAddAddressModal}
                    withContainer={false}
                  />
                </Modal>

                {renderAddressSection()}

                {errors.direccion && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.direccion}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Resumen de compra y Trade-In - Hidden en mobile */}
          <aside className="hidden md:block lg:col-span-1 space-y-4">
            <Step4OrderSummary
              onFinishPayment={handleContinue}
              onBack={onBack}
              buttonText="Continuar"
              disabled={!tradeInValidation.isValid}
              isSticky={false}
              shouldCalculateCanPickUp={false}
              deliveryMethod={
                typeof window !== "undefined"
                  ? (() => {
                      const method = localStorage.getItem("checkout-delivery-method");
                      if (method === "tienda") return "pickup";
                      if (method === "domicilio") return "delivery";
                      if (method === "delivery" || method === "pickup") return method;
                      return undefined;
                    })()
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
              />
            )}
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
                $ {Number(products.reduce((acc, p) => acc + p.price * p.quantity, 0)).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Botón continuar */}
          <button
            className={`w-full font-bold py-3 rounded-lg text-base transition text-white ${
              !tradeInValidation.isValid
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-[#222] hover:bg-[#333] cursor-pointer"
            }`}
            onClick={handleContinue}
            disabled={!tradeInValidation.isValid}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
