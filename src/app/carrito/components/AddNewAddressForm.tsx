"use client";
import React, { useState, useMemo, useEffect } from "react";
import AddressAutocomplete from "@/components/forms/AddressAutocomplete";
import AddressMap3D from "@/components/AddressMap3D";
import { PlaceDetails } from "@/types/places.types";
import {
  addressesService,
  CreateAddressRequest,
} from "@/services/addresses.service";
import type { Address } from "@/types/address";
import { useAuthContext } from "@/features/auth/context";
import { syncAddress } from "@/lib/addressSync";
import { locationsService, Department, City } from "@/services/locations.service";
import { COLOMBIA_STREET_TYPES } from "@/data/colombia-street-types";

// Tipo extendido para manejar diferentes estructuras de PlaceDetails
type ExtendedPlaceDetails = PlaceDetails & {
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

interface AddNewAddressFormProps {
  onAddressAdded?: (address: Address) => void | Promise<void>;
  onCancel?: () => void;
  withContainer?: boolean; // Si debe mostrar el contenedor con padding y border
  onSubmitRef?: React.MutableRefObject<(() => void) | null>; // Ref para exponer la función de submit
  onFormValidChange?: (isValid: boolean) => void; // Callback para notificar cuando el formulario es válido
  disabled?: boolean; // Si los campos deben estar deshabilitados
  geoLocationData?: {
    departamento?: string;
    ciudad?: string;
    tipo_via?: string;
    numero_principal?: string;
    numero_secundario?: string;
    numero_complementario?: string;
    barrio?: string;
  } | null; // Datos de geolocalización automática
  isRequestingLocation?: boolean; // Si está en proceso de obtener la ubicación
  enableAutoSelect?: boolean; // Habilitar selección automática de la primera predicción
  hideBackButton?: boolean; // Ocultar el botón "Atrás" en el paso 2
}

export default function AddNewAddressForm({
  onAddressAdded,
  onCancel,
  withContainer = true,
  onSubmitRef,
  onFormValidChange,
  disabled = false,
  geoLocationData,
  isRequestingLocation = false,
  enableAutoSelect = false,
  hideBackButton = false,
}: AddNewAddressFormProps) {
  const { user, login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<ExtendedPlaceDetails | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<ExtendedPlaceDetails | null>(null);
  const [formData, setFormData] = useState({
    nombreDireccion: "",
    tipoDireccion: "casa" as "casa" | "apartamento" | "oficina" | "otro",
    usarMismaParaFacturacion: true,
    // Campos de dirección de envío
    departamento: "",
    ciudad: "",
    nombreCalle: "",
    numeroPrincipal: "",
    numeroSecundario: "", // Antes "complemento"
    numeroComplementario: "", // Nuevo campo para completar dirección (ej: -25 en Calle 80 #15-25)
    barrio: "",
    setsReferencia: "", // Antes "puntoReferencia"
    instruccionesEntrega: "",
    // Campos de dirección de facturación
    nombreDireccionFacturacion: "",
    tipoDireccionFacturacion: "casa" as
      | "casa"
      | "apartamento"
      | "oficina"
      | "otro",
    departamentoFacturacion: "",
    nombreCalleFacturacion: "",
    numeroPrincipalFacturacion: "",
    numeroSecundarioFacturacion: "",
    numeroComplementarioFacturacion: "", // Nuevo campo para facturación
    barrioFacturacion: "",
    setsReferenciaFacturacion: "",
    instruccionesEntregaFacturacion: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCityAutoCompleted, setIsCityAutoCompleted] = useState(false);
  const [suggestedAddress, setSuggestedAddress] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2>(1); // Control de pasos del formulario
  const [showTooltip, setShowTooltip] = useState(false);

  // Verificar si el formulario completo (paso 2) es válido
  const isFormComplete = React.useMemo(() => {
    // Solo validar si estamos en el paso 2
    if (currentStep !== 2) return false;
    
    return !!(
      selectedAddress &&
      formData.nombreDireccion.trim() &&
      formData.instruccionesEntrega.trim() &&
      formData.departamento.trim() &&
      formData.ciudad.trim() &&
      formData.nombreCalle.trim() &&
      formData.numeroPrincipal.trim() &&
      (formData.usarMismaParaFacturacion || selectedBillingAddress)
    );
  }, [
    currentStep,
    selectedAddress,
    formData.nombreDireccion,
    formData.instruccionesEntrega,
    formData.departamento,
    formData.ciudad,
    formData.nombreCalle,
    formData.numeroPrincipal,
    formData.usarMismaParaFacturacion,
    selectedBillingAddress
  ]);

  // Notificar cuando el formulario es válido
  React.useEffect(() => {
    if (onFormValidChange) {
      onFormValidChange(isFormComplete);
    }
  }, [isFormComplete, onFormValidChange]);

  // Estados para departamentos y ciudades dinámicas
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [billingCities, setBillingCities] = useState<City[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBillingCities, setLoadingBillingCities] = useState(false);

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const data = await locationsService.getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Error cargando departamentos:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, []);

  // Cargar ciudades cuando se selecciona un departamento
  useEffect(() => {
    const loadCities = async () => {
      if (!formData.departamento) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);
        const data = await locationsService.getCitiesByDepartment(formData.departamento);
        setCities(data);
      } catch (error) {
        console.error("Error cargando ciudades:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [formData.departamento]);

  // Cargar ciudades de facturación cuando se selecciona un departamento de facturación
  useEffect(() => {
    const loadBillingCities = async () => {
      if (!formData.departamentoFacturacion) {
        setBillingCities([]);
        return;
      }

      try {
        setLoadingBillingCities(true);
        const data = await locationsService.getCitiesByDepartment(formData.departamentoFacturacion);
        setBillingCities(data);
      } catch (error) {
        console.error("Error cargando ciudades de facturación:", error);
        setBillingCities([]);
      } finally {
        setLoadingBillingCities(false);
      }
    };

    loadBillingCities();
  }, [formData.departamentoFacturacion]);

  // Ciudades disponibles para envío
  const availableCities = useMemo(() => cities, [cities]);

  // Ciudades disponibles para facturación
  const availableBillingCities = useMemo(() => billingCities, [billingCities]);

  // Construir dirección sugerida automáticamente cuando cambien los campos manuales
  useEffect(() => {
    // Solo construir si tenemos TODOS los campos requeridos: Tipo de Vía, Principal, Secund., Compl. y ciudad
    if (
      formData.nombreCalle &&
      formData.numeroPrincipal &&
      formData.numeroSecundario &&
      formData.numeroComplementario &&
      formData.ciudad
    ) {
      // Buscar el nombre de la ciudad en las ciudades cargadas
      const city = cities.find(c => c.codigo === formData.ciudad);
      const cityName = city?.nombre || "";

      // Construir la dirección en formato colombiano
      const parts: string[] = [];

      if (formData.nombreCalle) parts.push(formData.nombreCalle);
      if (formData.numeroPrincipal) parts.push(`#${formData.numeroPrincipal}`);
      if (formData.numeroSecundario) parts.push(formData.numeroSecundario);
      if (formData.numeroComplementario) parts.push(`-${formData.numeroComplementario}`);
      if (formData.barrio && cityName) parts.push(`${formData.barrio}, ${cityName}`);
      else if (cityName) parts.push(cityName);

      const constructedAddress = parts.join(' ');
      setSuggestedAddress(constructedAddress);
    } else {
      setSuggestedAddress("");
    }
  }, [formData.nombreCalle, formData.numeroPrincipal, formData.numeroSecundario, formData.numeroComplementario, formData.barrio, formData.ciudad, cities]);

  // useEffect para aplicar datos de geolocalización automática
  useEffect(() => {
    if (geoLocationData && !isRequestingLocation) {
      console.log('📍 Aplicando datos de geolocalización al formulario:', geoLocationData);
      
      // CORRECCIÓN TEMPORAL: Si el backend devuelve "Bogotá" como departamento, corregirlo a "Cundinamarca"
      let departamentoCorregido = geoLocationData.departamento || '';
      if (geoLocationData.ciudad && 
          (geoLocationData.ciudad.toLowerCase().includes('bogotá') || geoLocationData.ciudad.toLowerCase().includes('bogota')) && 
          departamentoCorregido === 'Bogotá') {
        departamentoCorregido = 'Cundinamarca';
        console.log('🔄 [FRONTEND-FIX] Corrigiendo departamento de "Bogotá" a "Cundinamarca"');
      }
      
      // PASO 1: Aplicar departamento corregido y otros datos (excepto ciudad)
      setFormData((prev) => ({
        ...prev,
        // Usar departamento corregido
        departamento: prev.departamento || departamentoCorregido,
        // NO aplicar ciudad aún - esperar a que se carguen las ciudades del departamento
        // Solo actualizar tipo de vía si está vacío
        nombreCalle: prev.nombreCalle || geoLocationData.tipo_via || '',
        // Solo actualizar números si están vacíos
        numeroPrincipal: prev.numeroPrincipal || geoLocationData.numero_principal || '',
        numeroSecundario: prev.numeroSecundario || geoLocationData.numero_secundario || '',
        numeroComplementario: prev.numeroComplementario || geoLocationData.numero_complementario || '',
        // Solo actualizar barrio si está vacío
        barrio: prev.barrio || geoLocationData.barrio || '',
      }));
      
      console.log('✅ Datos de geolocalización aplicados al formulario con corrección:', { departamentoCorregido });
    }
  }, [geoLocationData, isRequestingLocation]);

  // useEffect separado para aplicar ciudad DESPUÉS de que se carguen las ciudades
  useEffect(() => {
    console.log('🔍 [DEBUG] useEffect ciudad - Condiciones:', {
      hasGeoData: !!geoLocationData,
      notRequesting: !isRequestingLocation, 
      hasCities: cities.length,
      currentCiudad: formData.ciudad,
      targetCiudad: geoLocationData?.ciudad
    });

    if (geoLocationData && !isRequestingLocation && cities.length > 0) {
      // Solo aplicar si la ciudad actual está vacía o no coincide con la de geolocalización
      if (!formData.ciudad || (geoLocationData.ciudad && !cities.find(c => c.codigo === formData.ciudad && geoLocationData.ciudad && c.nombre.toLowerCase() === geoLocationData.ciudad.toLowerCase()))) {
        
        console.log('🏙️ Aplicando ciudad de geolocalización después de cargar lista:', geoLocationData.ciudad);
        console.log('🏙️ [DEBUG] Ciudades disponibles:', cities.map(c => `${c.nombre} (${c.codigo})`));
        
        // Buscar la ciudad por NOMBRE (no por código) en la lista de ciudades cargadas
        const ciudadEncontrada = cities.find(city => 
          geoLocationData.ciudad && city.nombre.toLowerCase().includes(geoLocationData.ciudad.toLowerCase())
        );
        
        if (ciudadEncontrada) {
          console.log('✅ Ciudad encontrada en lista:', ciudadEncontrada);
          
          // PASO 2: Aplicar el CÓDIGO de la ciudad (no el nombre)
          setFormData((prev) => ({
            ...prev,
            ciudad: ciudadEncontrada.codigo, // ← Usar CÓDIGO, no nombre
          }));
          
          console.log('✅ Ciudad de geolocalización aplicada:', ciudadEncontrada.nombre, 'con código:', ciudadEncontrada.codigo);
        } else {
          console.warn('⚠️ Ciudad no encontrada en lista:', geoLocationData.ciudad);
          console.warn('⚠️ [DEBUG] Nombres disponibles:', cities.map(c => c.nombre));
          
          // Intentar búsqueda más flexible
          const ciudadFlexible = cities.find(city =>
            geoLocationData.ciudad && (
              city.nombre.toLowerCase().includes('bogot') ||
              geoLocationData.ciudad.toLowerCase().includes(city.nombre.toLowerCase())
            )
          );
          
          if (ciudadFlexible) {
            console.log('✅ Ciudad encontrada con búsqueda flexible:', ciudadFlexible);
            setFormData((prev) => ({
              ...prev,
              ciudad: ciudadFlexible.codigo,
            }));
            console.log('✅ Ciudad flexible aplicada:', ciudadFlexible.nombre, 'con código:', ciudadFlexible.codigo);
          }
        }
      }
    }
  }, [geoLocationData, isRequestingLocation, cities, formData.ciudad]);

  // Validar si el Step 1 está completo para habilitar el botón "Continuar"
  const isStep1Complete = useMemo(() => {
    return !!(
      selectedAddress &&
      formData.departamento.trim() &&
      formData.ciudad.trim() &&
      formData.nombreCalle.trim() &&
      formData.numeroPrincipal.trim() &&
      formData.numeroSecundario.trim() &&
      formData.numeroComplementario.trim() &&
      formData.setsReferencia.trim()
    );
  }, [
    selectedAddress,
    formData.departamento,
    formData.ciudad,
    formData.nombreCalle,
    formData.numeroPrincipal,
    formData.numeroSecundario,
    formData.numeroComplementario,
    formData.setsReferencia
  ]);

  // Calcular campos faltantes para mostrar en tooltip
  const missingFields = useMemo(() => {
    const missing: string[] = [];

    if (!formData.departamento.trim()) missing.push("Departamento");
    if (!formData.ciudad.trim()) missing.push("Ciudad");
    if (!formData.nombreCalle.trim()) missing.push("Tipo de Vía");
    if (!formData.numeroPrincipal.trim()) missing.push("Principal");
    if (!formData.numeroSecundario.trim()) missing.push("# Secund.");
    if (!formData.numeroComplementario.trim()) missing.push("# Compl.");
    if (!formData.setsReferencia.trim()) missing.push("Sets de referencia");
    if (!selectedAddress) missing.push("Dirección de Google Maps");

    return missing;
  }, [
    selectedAddress,
    formData.departamento,
    formData.ciudad,
    formData.nombreCalle,
    formData.numeroPrincipal,
    formData.numeroSecundario,
    formData.numeroComplementario,
    formData.setsReferencia
  ]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedAddress) {
      newErrors.address =
        "Selecciona una dirección de envío usando el autocompletado";
    }

    if (!formData.nombreDireccion.trim()) {
      newErrors.nombreDireccion = "El nombre de la dirección es requerido";
    }

    if (!formData.instruccionesEntrega.trim()) {
      newErrors.instruccionesEntrega = "Las instrucciones de entrega son requeridas";
    }

    // Validar campos requeridos de dirección
    if (!formData.departamento.trim()) {
      newErrors.departamento = "El departamento es requerido";
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = "La ciudad es requerida";
    }

    if (!formData.nombreCalle.trim()) {
      newErrors.nombreCalle = "El nombre de la calle es requerido";
    }

    if (!formData.numeroPrincipal.trim()) {
      newErrors.numeroPrincipal = "El número principal es requerido";
    }

    // Validar dirección de facturación si no usa la misma
    if (!formData.usarMismaParaFacturacion) {
      if (!selectedBillingAddress) {
        newErrors.billingAddress =
          "Selecciona una dirección de facturación usando el autocompletado";
      }

      if (!formData.nombreDireccionFacturacion.trim()) {
        newErrors.nombreDireccionFacturacion =
          "El nombre de la dirección de facturación es requerido";
      }

      if (!formData.departamentoFacturacion.trim()) {
        newErrors.departamentoFacturacion = "El departamento es requerido";
      }

      if (!formData.ciudad.trim()) {
        newErrors.ciudad = "La ciudad es requerida para facturación";
      }

      if (!formData.nombreCalleFacturacion.trim()) {
        newErrors.nombreCalleFacturacion = "El nombre de la calle es requerido";
      }

      if (!formData.numeroPrincipalFacturacion.trim()) {
        newErrors.numeroPrincipalFacturacion = "El número principal es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitInternal = async () => {
    if (!validateForm() || !selectedAddress) {
      return;
    }

    setIsLoading(true);

    try {
      // Validar que selectedAddress tenga la estructura necesaria
      if (!selectedAddress) {
        throw new Error("No se ha seleccionado una dirección válida");
      }

      // Obtener coordenadas de manera segura - manejar diferentes estructuras posibles
      let latitude: number;
      let longitude: number;

      if (
        selectedAddress.latitude !== undefined &&
        selectedAddress.longitude !== undefined
      ) {
        // Estructura directa según PlaceDetails type
        latitude = selectedAddress.latitude;
        longitude = selectedAddress.longitude;
      } else if (selectedAddress.geometry?.location) {
        // Estructura de Google Places API
        latitude = selectedAddress.geometry.location.lat;
        longitude = selectedAddress.geometry.location.lng;
      } else {
        throw new Error(
          "No se pudieron obtener las coordenadas de la dirección seleccionada"
        );
      }

      // Transformar PlaceDetails al formato esperado por el backend
      // Incluir todos los campos opcionales si están disponibles
      const transformedPlaceDetails = {
        placeId: selectedAddress.placeId,
        formattedAddress: selectedAddress.formattedAddress,
        name: selectedAddress.name || "",
        latitude,
        longitude,
        addressComponents: selectedAddress.addressComponents || [],
        types: selectedAddress.types || [],
        // Campos opcionales - incluir solo si existen
        ...(selectedAddress.postalCode && {
          postalCode: selectedAddress.postalCode,
        }),
        ...(selectedAddress.city && { city: selectedAddress.city }),
        ...(selectedAddress.department && {
          department: selectedAddress.department,
        }),
        ...(selectedAddress.locality && { locality: selectedAddress.locality }),
        ...(selectedAddress.neighborhood && {
          neighborhood: selectedAddress.neighborhood,
        }),
        ...(selectedAddress.vicinity && { vicinity: selectedAddress.vicinity }),
        ...(selectedAddress.url && { url: selectedAddress.url }),
        ...(selectedAddress.nomenclature && {
          nomenclature: selectedAddress.nomenclature,
        }),
      };

      // Crear dirección de envío
      const shippingAddressRequest: CreateAddressRequest = {
        nombreDireccion: formData.nombreDireccion,
        tipoDireccion: formData.tipoDireccion,
        tipo: formData.usarMismaParaFacturacion ? "AMBOS" : "ENVIO",
        esPredeterminada: true, // Marcar como predeterminada automáticamente
        placeDetails: transformedPlaceDetails as PlaceDetails,
        // Nuevos campos estructurados
        departamento: formData.departamento || undefined,
        nombreCalle: formData.nombreCalle || undefined,
        numeroPrincipal: formData.numeroPrincipal || undefined,
        numeroSecundario: formData.numeroSecundario || undefined,
        barrio: formData.barrio || undefined,
        setsReferencia: formData.setsReferencia || undefined,
        instruccionesEntrega: formData.instruccionesEntrega || undefined,
        // Solo enviar ciudad si es un código válido (string numérico)
        ciudad: formData.ciudad && /^\d+$/.test(formData.ciudad) ? formData.ciudad : undefined,
      };

      const shippingResponse = await addressesService.createAddress(
        shippingAddressRequest
      );

      // Si no usa la misma dirección, crear dirección de facturación separada
      if (!formData.usarMismaParaFacturacion && selectedBillingAddress) {

        // Obtener coordenadas de la dirección de facturación de manera segura
        let billingLatitude: number;
        let billingLongitude: number;

        if (
          selectedBillingAddress.latitude !== undefined &&
          selectedBillingAddress.longitude !== undefined
        ) {
          // Estructura directa según PlaceDetails type
          billingLatitude = selectedBillingAddress.latitude;
          billingLongitude = selectedBillingAddress.longitude;
        } else if (selectedBillingAddress.geometry?.location) {
          // Estructura de Google Places API
          billingLatitude = selectedBillingAddress.geometry.location.lat;
          billingLongitude = selectedBillingAddress.geometry.location.lng;
        } else {
          throw new Error(
            "No se pudieron obtener las coordenadas de la dirección de facturación seleccionada"
          );
        }

        // Transformar PlaceDetails de facturación al formato esperado por el backend
        // Incluir todos los campos opcionales si están disponibles
        const transformedBillingPlaceDetails = {
          placeId: selectedBillingAddress.placeId,
          formattedAddress: selectedBillingAddress.formattedAddress,
          name: selectedBillingAddress.name || "",
          latitude: billingLatitude,
          longitude: billingLongitude,
          addressComponents: selectedBillingAddress.addressComponents || [],
          types: selectedBillingAddress.types || [],
          // Campos opcionales - incluir solo si existen
          ...(selectedBillingAddress.postalCode && {
            postalCode: selectedBillingAddress.postalCode,
          }),
          ...(selectedBillingAddress.city && {
            city: selectedBillingAddress.city,
          }),
          ...(selectedBillingAddress.department && {
            department: selectedBillingAddress.department,
          }),
          ...(selectedBillingAddress.locality && {
            locality: selectedBillingAddress.locality,
          }),
          ...(selectedBillingAddress.neighborhood && {
            neighborhood: selectedBillingAddress.neighborhood,
          }),
          ...(selectedBillingAddress.vicinity && {
            vicinity: selectedBillingAddress.vicinity,
          }),
          ...(selectedBillingAddress.url && {
            url: selectedBillingAddress.url,
          }),
          ...(selectedBillingAddress.nomenclature && {
            nomenclature: selectedBillingAddress.nomenclature,
          }),
        };

        const billingAddressRequest: CreateAddressRequest = {
          nombreDireccion: formData.nombreDireccionFacturacion,
          tipoDireccion: formData.tipoDireccionFacturacion,
          tipo: "FACTURACION",
          esPredeterminada: false,
          placeDetails: transformedBillingPlaceDetails as PlaceDetails,
          // Nuevos campos estructurados para facturación
          departamento: formData.departamentoFacturacion || undefined,
          nombreCalle: formData.nombreCalleFacturacion || undefined,
          numeroPrincipal: formData.numeroPrincipalFacturacion || undefined,
          numeroSecundario: formData.numeroSecundarioFacturacion || undefined,
          barrio: formData.barrioFacturacion || undefined,
          setsReferencia: formData.setsReferenciaFacturacion || undefined,
          instruccionesEntrega:
            formData.instruccionesEntregaFacturacion || undefined,
          // Solo enviar ciudad si es un código válido (string numérico)
          ciudad: formData.ciudad && /^\d+$/.test(formData.ciudad) ? formData.ciudad : undefined,
        };

        await addressesService.createAddress(
          billingAddressRequest
        );
      }

      // CRÍTICO: Guardar SIEMPRE en checkout-address ANTES de sincronizar
      // Esto garantiza que Step3 y Step4 puedan leer la dirección
      if (globalThis.window !== undefined) {
        let userEmail = user?.email || '';
        try {
          const userInfo = JSON.parse(globalThis.window.localStorage.getItem('imagiq_user') || '{}');
          userEmail = userInfo?.email || userEmail;
        } catch (e) {
          console.error('Error parsing user info:', e);
        }
        
        const checkoutAddress = {
          id: shippingResponse.id,
          usuario_id: shippingResponse.usuarioId || '',
          email: userEmail,
          linea_uno: shippingResponse.direccionFormateada || shippingResponse.lineaUno || '',
          codigo_dane: shippingResponse.codigo_dane || '',
          ciudad: shippingResponse.ciudad || '',
          pais: shippingResponse.pais || 'Colombia',
          esPredeterminada: true,
        };
        globalThis.window.localStorage.setItem('checkout-address', JSON.stringify(checkoutAddress));
        globalThis.window.localStorage.setItem('imagiq_default_address', JSON.stringify(checkoutAddress));
        console.log('✅ [AddNewAddressForm] Dirección guardada en checkout-address:', checkoutAddress);
      }

      // Sincronizar la dirección con el header y localStorage
      try {
        // Obtener email del usuario desde localStorage si no está autenticado
        let userEmail = user?.email || '';
        if (!userEmail && globalThis.window !== undefined) {
          const userInfo = JSON.parse(globalThis.window.localStorage.getItem('imagiq_user') || '{}');
          userEmail = userInfo?.email || '';
        }

        await syncAddress({
          address: shippingResponse,
          userEmail,
          user,
          loginFn: login,
          fromHeader: false, // Viene del checkout/formulario
        });
      } catch (syncError) {
        console.error('⚠️ Error al sincronizar dirección con el header:', syncError);
        // No bloquear el flujo si falla la sincronización
        // La dirección ya fue guardada en checkout-address arriba
      }

      // Callback with the created address - ESPERAR la promesa si devuelve una
      console.log('📞 [AddNewAddressForm] Llamando a onAddressAdded callback con dirección:', shippingResponse.id);
      const result = onAddressAdded?.(shippingResponse);

      // Si onAddressAdded devuelve una promesa, esperarla (para consultar candidate stores)
      if (result instanceof Promise) {
        console.log('⏳ [AddNewAddressForm] Esperando promesa de onAddressAdded (candidate stores)...');
        await result;
        console.log('✅ [AddNewAddressForm] Promesa completada, candidate stores consultados');
      } else {
        console.log('✅ [AddNewAddressForm] onAddressAdded completado (no promesa)');
      }

      // Resetear el ref después de guardar
      if (onSubmitRef) {
        onSubmitRef.current = null;
      }

      // Reset form
      setFormData({
        nombreDireccion: "",
        tipoDireccion: "casa",
        usarMismaParaFacturacion: true,
        departamento: "",
        ciudad: "",
        nombreCalle: "",
        numeroPrincipal: "",
        numeroSecundario: "",
        numeroComplementario: "",
        barrio: "",
        setsReferencia: "",
        instruccionesEntrega: "",
        nombreDireccionFacturacion: "",
        tipoDireccionFacturacion: "casa",
        departamentoFacturacion: "",
        nombreCalleFacturacion: "",
        numeroPrincipalFacturacion: "",
        numeroSecundarioFacturacion: "",
        numeroComplementarioFacturacion: "",
        barrioFacturacion: "",
        setsReferenciaFacturacion: "",
        instruccionesEntregaFacturacion: "",
      });
      setSelectedAddress(null);
      setSelectedBillingAddress(null);
      setIsCityAutoCompleted(false);
    } catch (error) {
      console.error("Error al agregar dirección:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setErrors({ submit: `Error al guardar la dirección: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Si intentan modificar la ciudad y fue auto-completada, no permitirlo
    if (field === "ciudad" && isCityAutoCompleted) {
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Helper para determinar el estilo del borde basado en si el campo está lleno
  const getFieldBorderClass = (fieldValue: string, hasError: boolean = false): string => {
    if (hasError) {
      return "border-red-500";
    }
    if (fieldValue.trim()) {
      return "border-green-200"; // Verde muy tenue, casi pastel
    }
    return "border-red-200"; // Rojo muy tenue, casi pastel
  };

  // Helper para determinar el color de fondo basado en si el campo está lleno
  const getFieldBackgroundClass = (fieldValue: string): string => {
    if (fieldValue.trim()) {
      return "bg-gray-50"; // Fondo gris cuando está lleno
    }
    return "bg-white"; // Fondo blanco cuando está vacío
  };

  // Helper para extraer la ciudad de PlaceDetails
  const extractCityFromPlace = (place: PlaceDetails): string => {
    // Primero intentar usar el campo city directo
    if (place.city) {
      return place.city;
    }

    // Si no, buscar en addressComponents
    const getAddressComponent = (componentTypes: string[]) => {
      const component = place.addressComponents?.find((comp) =>
        componentTypes.some((type) => comp.types.includes(type))
      );
      return component?.longName || component?.shortName || "";
    };

    return (
      getAddressComponent([
        "locality",
        "administrative_area_level_2",
        "sublocality",
      ]) || ""
    );
  };

  // Helper para encontrar el departamento por nombre
  const findDepartmentByName = (departmentName: string): string => {
    if (!departmentName) return "";

    // Limpiar y normalizar el nombre del departamento
    const normalizedName = departmentName
      .toLowerCase()
      .normalize("NFD")
      .replaceAll(/[\u0300-\u036f]/g, "") // Remover acentos
      .trim();

    // Buscar coincidencia exacta o parcial en los departamentos cargados
    const department = departments.find((d) => {
      const normalizedDeptName = d.nombre
        .toLowerCase()
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "");

      const exactMatch = normalizedDeptName === normalizedName;
      const partialMatch = normalizedDeptName.includes(normalizedName) ||
                          normalizedName.includes(normalizedDeptName);

      return exactMatch || partialMatch;
    });

    return department?.nombre || "";
  };

  // Helper para encontrar el código de ciudad por nombre
  const findCityCodeByName = (cityName: string): string => {
    if (!cityName) return "";

    // Limpiar el nombre de la ciudad (remover "D.C.", comas, etc.)
    const cleanCityName = cityName
      .split(',')[0] // Tomar solo la primera parte antes de la coma
      .replaceAll(/D\.C\./gi, '') // Remover "D.C."
      .trim();

    // Normalizar el nombre de la ciudad para comparación
    const normalizedName = cleanCityName
      .toLowerCase()
      .normalize("NFD")
      .replaceAll(/[\u0300-\u036f]/g, ""); // Remover acentos

    // Buscar coincidencia exacta o parcial en las ciudades cargadas dinámicamente
    const city = cities.find((c) => {
      const normalizedCityName = c.nombre
        .toLowerCase()
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "");

      // Comparar nombres normalizados
      const exactMatch = normalizedCityName === normalizedName;
      const partialMatch = normalizedCityName.includes(normalizedName) ||
                          normalizedName.includes(normalizedCityName);

      // También verificar si el nombre original contiene la ciudad (sin normalizar)
      const originalMatch = c.nombre.toLowerCase().includes(cleanCityName.toLowerCase()) ||
                           cleanCityName.toLowerCase().includes(c.nombre.toLowerCase());

      return exactMatch || partialMatch || originalMatch;
    });

    return city?.codigo || "";
  };

  const handleAddressSelect = (place: PlaceDetails) => {
    setSelectedAddress(place as ExtendedPlaceDetails);

    // Debug: Ver qué trae Google Maps
    console.log("🔍 Place Details:", {
      neighborhood: place.neighborhood,
      department: place.department,
      city: place.city,
      fullPlace: place
    });

    // Auto-completar departamento
    const departmentName = place.department || "";
    const departmentMatch = findDepartmentByName(departmentName);

    // Auto-completar la ciudad
    const extractedCity = extractCityFromPlace(place);
    let cityCode = "";
    if (extractedCity) {
      cityCode = findCityCodeByName(extractedCity);
      if (!cityCode) {
        // Si no se encuentra la ciudad en la lista, mostrar error
        setErrors((prev) => ({
          ...prev,
          ciudad: `No se encontró la ciudad "${extractedCity}" en la lista. Por favor, selecciónala manualmente.`,
        }));
      } else {
        // Limpiar error de ciudad si existe
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.ciudad;
          return newErrors;
        });
      }
    }

    // Auto-completar nombre de calle (solo el tipo de vía)
    const nombreCalle = place.nomenclature?.type || place.streetName?.split(' ')[0] || "";

    // Auto-completar número principal
    const numeroPrincipal = place.streetNumber || "";

    // Auto-completar barrio
    const barrio = place.neighborhood || "";

    // Actualizar campos - SOLO auto-completar los que están vacíos para preservar valores manuales
    setFormData((prev) => ({
      ...prev,
      departamento: prev.departamento || departmentMatch,
      ciudad: prev.ciudad || cityCode,
      // Solo auto-completar si el usuario NO ha llenado el campo manualmente
      nombreCalle: prev.nombreCalle || nombreCalle,
      numeroPrincipal: prev.numeroPrincipal || numeroPrincipal,
      barrio: prev.barrio || barrio,
    }));

    setIsCityAutoCompleted(!!cityCode); // Solo marcar como auto-completada si encontramos la ciudad

    // Clear address error when address is selected
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleBillingAddressSelect = (place: PlaceDetails) => {
    setSelectedBillingAddress(place as ExtendedPlaceDetails);

    // Auto-completar departamento para facturación
    const departmentName = place.department || "";
    const departmentMatch = findDepartmentByName(departmentName);

    // Auto-completar la ciudad
    const extractedCity = extractCityFromPlace(place);
    let cityCode = "";
    if (extractedCity) {
      cityCode = findCityCodeByName(extractedCity);
      if (!cityCode) {
        setErrors((prev) => ({
          ...prev,
          ciudad: `No se encontró la ciudad "${extractedCity}" en la lista. Por favor, selecciónala manualmente.`,
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.ciudad;
          return newErrors;
        });
      }
    }

    // Auto-completar nombre de calle para facturación (solo el tipo de vía)
    const nombreCalleFacturacion = place.nomenclature?.type || place.streetName?.split(' ')[0] || "";

    // Auto-completar número principal para facturación
    const numeroPrincipalFacturacion = place.streetNumber || "";

    // Auto-completar barrio para facturación
    const barrioFacturacion = place.neighborhood || "";

    // Actualizar campos de facturación - SOLO auto-completar los que están vacíos
    setFormData((prev) => ({
      ...prev,
      departamentoFacturacion: prev.departamentoFacturacion || departmentMatch,
      ciudad: prev.ciudad || cityCode, // La ciudad es compartida
      // Solo auto-completar si el usuario NO ha llenado el campo manualmente
      nombreCalleFacturacion: prev.nombreCalleFacturacion || nombreCalleFacturacion,
      numeroPrincipalFacturacion: prev.numeroPrincipalFacturacion || numeroPrincipalFacturacion,
      barrioFacturacion: prev.barrioFacturacion || barrioFacturacion,
    }));

    setIsCityAutoCompleted(!!cityCode);

    // Clear billing address error when address is selected
    if (errors.billingAddress) {
      setErrors((prev) => ({ ...prev, billingAddress: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usarMisma = e.target.checked;
    setFormData((prev) => ({ ...prev, usarMismaParaFacturacion: usarMisma }));

    // Si cambia a usar la misma dirección, limpiar datos de facturación
    if (usarMisma) {
      setSelectedBillingAddress(null);
      setFormData((prev) => ({
        ...prev,
        nombreDireccionFacturacion: "",
        tipoDireccionFacturacion: "casa",
        departamentoFacturacion: "",
        nombreCalleFacturacion: "",
        numeroPrincipalFacturacion: "",
        numeroSecundarioFacturacion: "",
        barrioFacturacion: "",
        setsReferenciaFacturacion: "",
        instruccionesEntregaFacturacion: "",
      }));
      // Limpiar errores de facturación
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.billingAddress;
        delete newErrors.nombreDireccionFacturacion;
        return newErrors;
      });
    }
  };

  // Exponer handleSubmit a través del ref si se proporciona
  React.useEffect(() => {
    if (onSubmitRef) {
      onSubmitRef.current = async () => {
        // Validar antes de proceder
        if (!validateForm() || !selectedAddress) {
          return;
        }
        // Llamar a handleSubmitInternal
        await handleSubmitInternal();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSubmitRef, selectedAddress?.placeId, formData.nombreDireccion, formData.instruccionesEntrega, formData.usarMismaParaFacturacion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitInternal();
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Indicador de pasos y botón continuar */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center ${!withContainer ? 'gap-1' : 'gap-2'}`}>
          <div className={`flex items-center justify-center ${!withContainer ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} rounded-full font-bold ${
            currentStep === 1 ? "bg-black text-white" : "bg-gray-200 text-gray-600"
          }`}>
            1
          </div>
          <div className={`${!withContainer ? 'w-8' : 'w-12'} h-0.5 bg-gray-300`}></div>
          <div className={`flex items-center justify-center ${!withContainer ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} rounded-full font-bold ${
            currentStep === 2 ? "bg-black text-white" : "bg-gray-200 text-gray-600"
          }`}>
            2
          </div>
        </div>

        {/* Botón Continuar - solo visible en paso 1 */}
        {currentStep === 1 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!isStep1Complete}
              onMouseEnter={() => !isStep1Complete && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>

            {/* Tooltip mostrando campos faltantes */}
            {showTooltip && !isStep1Complete && missingFields.length > 0 && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-2">Campos faltantes:</div>
                <ul className="space-y-1">
                  {missingFields.map((field, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>{field}</span>
                    </li>
                  ))}
                </ul>
                {/* Flecha del tooltip */}
                <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Indicador de geolocalización */}
      {isRequestingLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
            <div className="text-blue-700">
              <div className="font-medium">🌍 Detectando tu ubicación...</div>
              <div className="text-sm text-blue-600">Completaremos automáticamente: departamento, ciudad, barrio y tipo de vía</div>
            </div>
          </div>
        </div>
      )}
      
      {/* PASO 1: Datos esenciales de la dirección */}
      {currentStep === 1 && (
        <div className="space-y-4">
          {/* Grid de campos según Samsung: Departamento y Ciudad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Departamento */}
          <div>
            <label
              htmlFor="departamento"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Departamento <span className="text-red-500">*</span>
            </label>
            <select
              id="departamento"
              value={formData.departamento}
              onChange={(e) => {
                handleInputChange("departamento", e.target.value);
                // Limpiar la ciudad seleccionada cuando cambia el departamento
                handleInputChange("ciudad", "");
              }}
              disabled={disabled || loadingDepartments}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                disabled || loadingDepartments
                  ? "bg-gray-100 cursor-not-allowed opacity-60"
                  : getFieldBackgroundClass(formData.departamento)
              } ${
                getFieldBorderClass(formData.departamento, !!errors.departamento)
              }`}
            >
              <option value="">
                {loadingDepartments ? "Cargando departamentos..." : "-- Selecciona un departamento --"}
              </option>
              {departments.map((dept) => (
                <option key={dept.nombre} value={dept.nombre}>
                  {dept.nombre}
                </option>
              ))}
            </select>
            {errors.departamento && (
              <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>
            )}
          </div>

          {/* Ciudad */}
          <div>
            <label
              htmlFor="ciudad"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Ciudad <span className="text-red-500">*</span>
            </label>
            <select
              id="ciudad"
              value={formData.ciudad}
              onChange={(e) => handleInputChange("ciudad", e.target.value)}
              disabled={disabled || !formData.departamento || loadingCities}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                disabled || !formData.departamento || loadingCities
                  ? "bg-gray-100 cursor-not-allowed border-gray-300 opacity-60"
                  : `${getFieldBackgroundClass(formData.ciudad)} ${getFieldBorderClass(formData.ciudad, !!errors.ciudad)}`
              }`}
            >
              <option value="">
                {!formData.departamento
                  ? "-- Primero selecciona un departamento --"
                  : loadingCities
                  ? "Cargando ciudades..."
                  : "-- Selecciona una ciudad --"}
              </option>
              {availableCities.map((city) => (
                <option key={city.codigo} value={city.codigo}>
                  {city.nombre}
                </option>
              ))}
            </select>
            {errors.ciudad && (
              <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>
            )}
          </div>
        </div>

        {/* Grid: Tipo de Vía y números de dirección - 2 filas en móvil, 1 fila en desktop */}
        <div className={!withContainer 
          ? "grid grid-cols-2 md:grid-cols-[1.5fr_1.2fr_0.75fr_0.75fr] gap-2" 
          : "grid grid-cols-2 md:grid-cols-[1.8fr_1.2fr_0.8fr_0.8fr] gap-2"}>
          {/* Tipo de Vía */}
          <div className="w-full md:w-auto">
            <label
              htmlFor="nombreCalle"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Tipo de Vía <span className="text-red-500">*</span>
            </label>
            <select
              id="nombreCalle"
              value={formData.nombreCalle}
              onChange={(e) => handleInputChange("nombreCalle", e.target.value)}
              disabled={disabled}
              className={`w-full px-2 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed opacity-60"
                  : getFieldBackgroundClass(formData.nombreCalle)
              } ${
                getFieldBorderClass(formData.nombreCalle, !!errors.nombreCalle)
              }`}
            >
              <option value="">-- Selecciona --</option>
              {COLOMBIA_STREET_TYPES.map((streetType) => (
                <option key={streetType.codigo} value={streetType.nombre}>
                  {streetType.nombre}
                </option>
              ))}
            </select>
            {errors.nombreCalle && (
              <p className="text-red-500 text-xs mt-1">{errors.nombreCalle}</p>
            )}
          </div>

          {/* Número Principal */}
          <div className="w-full md:w-auto">
            <label
              htmlFor="numeroPrincipal"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Principal <span className="text-red-500">*</span>
            </label>
            <input
              id="numeroPrincipal"
              type="text"
              value={formData.numeroPrincipal}
              onChange={(e) => handleInputChange("numeroPrincipal", e.target.value)}
              placeholder="80"
              disabled={disabled}
              className={`w-full px-2 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed opacity-60"
                  : getFieldBackgroundClass(formData.numeroPrincipal)
              } ${
                getFieldBorderClass(formData.numeroPrincipal, !!errors.numeroPrincipal)
              }`}
            />
            {errors.numeroPrincipal && (
              <p className="text-red-500 text-xs mt-1">{errors.numeroPrincipal}</p>
            )}
          </div>

          {/* Número Secundario */}
          <div className="w-full md:w-auto">
            <label
              htmlFor="numeroSecundario"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              # Secund.
            </label>
            <div className="flex items-center gap-1">
              <span className="text-gray-600 font-medium text-sm flex-shrink-0">#</span>
              <input
                id="numeroSecundario"
                type="text"
                value={formData.numeroSecundario}
                onChange={(e) => handleInputChange("numeroSecundario", e.target.value)}
                placeholder="15"
                disabled={disabled}
                className={`w-full px-2 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  disabled
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : getFieldBackgroundClass(formData.numeroSecundario)
                } ${
                  getFieldBorderClass(formData.numeroSecundario)
                }`}
              />
            </div>
          </div>

          {/* Número Complementario */}
          <div className="w-full md:w-auto">
            <label
              htmlFor="numeroComplementario"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              # Compl.
            </label>
            <div className="flex items-center gap-1">
              <span className="text-gray-600 font-medium text-sm flex-shrink-0">-</span>
              <input
                id="numeroComplementario"
                type="text"
                value={formData.numeroComplementario}
                onChange={(e) => handleInputChange("numeroComplementario", e.target.value)}
                placeholder="25"
                disabled={disabled}
                className={`w-full px-2 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  disabled
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : getFieldBackgroundClass(formData.numeroComplementario)
                } ${
                  getFieldBorderClass(formData.numeroComplementario)
                }`}
              />
            </div>
          </div>
        </div>

        {/* Grid: Barrio y Sets de referencia en una sola fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Barrio */}
          <div>
            <label
              htmlFor="barrio"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Barrio
            </label>
            <input
              id="barrio"
              type="text"
              value={formData.barrio}
              onChange={(e) => handleInputChange("barrio", e.target.value)}
              placeholder="ej: Chicó"
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed opacity-60"
                  : getFieldBackgroundClass(formData.barrio)
              } ${
                getFieldBorderClass(formData.barrio)
              }`}
            />
          </div>

          {/* Sets de referencia (antes puntoReferencia) */}
          <div>
            <label
              htmlFor="setsReferencia"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Sets de referencia 
            </label>
            <input
              id="setsReferencia"
              type="text"
              value={formData.setsReferencia}
              onChange={(e) =>
                handleInputChange("setsReferencia", e.target.value)
              }
              placeholder="ej: Oficina 204"
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed opacity-60"
                  : getFieldBackgroundClass(formData.setsReferencia)
              } ${
                getFieldBorderClass(formData.setsReferencia)
              }`}
            />
          </div>
        </div>

        {/* Google Maps - Buscar y validar dirección completa */}
        <div>
          <div className={`${
            !formData.nombreCalle || !formData.numeroPrincipal || !formData.numeroSecundario || !formData.numeroComplementario || !formData.departamento || !formData.ciudad
              ? "pointer-events-none"
              : ""
          }`}>
            <AddressAutocomplete
              addressType="shipping"
              placeholder={
                !formData.nombreCalle || !formData.numeroPrincipal || !formData.numeroSecundario || !formData.numeroComplementario || !formData.departamento || !formData.ciudad
                  ? "Completa todos los campos de dirección primero (Tipo, Principal, Secund., Compl.)"
                  : "Busca tu dirección completa (ej: Calle 80 # 15-25, Bogotá)"
              }
              onPlaceSelect={handleAddressSelect}
              value={suggestedAddress}
              disabled={disabled || !formData.nombreCalle || !formData.numeroPrincipal || !formData.numeroSecundario || !formData.numeroComplementario || !formData.departamento || !formData.ciudad}
              enableAutoSelect={enableAutoSelect}
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        {/* Mapa 3D - mostrar cuando se selecciona una dirección */}
        {selectedAddress && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación de dirección de envío en el mapa
            </label>
            <AddressMap3D
              address={selectedAddress}
              height="200px"
              enable3D={true}
              showControls={false}
            />
          </div>
        )}
        </div>
      )}

      {/* PASO 2: Información adicional */}
      {currentStep === 2 && (
        <div className="space-y-4">
          {/* Nombre de la dirección y Tipo de propiedad en la misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre de la dirección */}
            <div>
              <label
                htmlFor="nombreDireccion"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                Nombre de la dirección <span className="text-red-500">*</span>
              </label>
              <input
                id="nombreDireccion"
                type="text"
                value={formData.nombreDireccion}
                onChange={(e) =>
                  handleInputChange("nombreDireccion", e.target.value)
                }
                placeholder="ej: Casa, Oficina, Casa de mamá"
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  disabled
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : getFieldBackgroundClass(formData.nombreDireccion)
                } ${
                  errors.nombreDireccion ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nombreDireccion && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nombreDireccion}
                </p>
              )}
            </div>

            {/* Tipo de propiedad */}
            <div>
              <label
                htmlFor="tipoDireccionPropiedad"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                Tipo de propiedad <span className="text-red-500">*</span>
              </label>
              <select
                id="tipoDireccionPropiedad"
                value={formData.tipoDireccion}
                onChange={(e) =>
                  handleInputChange("tipoDireccion", e.target.value)
                }
                disabled={disabled}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  disabled
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : "bg-gray-50"
                }`}
              >
                <option value="oficina">Oficina</option>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Instrucciones de entrega */}
          <div>
            <label
              htmlFor="instruccionesEntrega"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Instrucciones de entrega <span className="text-red-500">*</span>
            </label>
            <input
              id="instruccionesEntrega"
              type="text"
              value={formData.instruccionesEntrega}
              onChange={(e) =>
                handleInputChange("instruccionesEntrega", e.target.value)
              }
              placeholder="ej: Portería 24 horas, llamar al llegar"
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed opacity-60"
                  : getFieldBackgroundClass(formData.instruccionesEntrega)
              } ${
                errors.instruccionesEntrega ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.instruccionesEntrega && (
              <p className="text-red-500 text-xs mt-1">
                {errors.instruccionesEntrega}
              </p>
            )}
          </div>

        </div>
      )}

      {/* Errores generales - Solo en paso 2 */}
      {currentStep === 2 && errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-500 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Botones de navegación y submit - Solo en paso 2 */}
      {currentStep === 2 && (
        <div className="flex gap-3 pt-2">
          {/* Si hay onSubmitRef, significa que el botón de guardar está fuera del formulario (Step 2) */}
          {/* Si NO hay onSubmitRef, debemos mostrar el botón de guardar aquí dentro (Modales) */}
          {(!withContainer && onSubmitRef) ? (
            // En Step2: Solo mostrar "Atrás" si NO está oculto con hideBackButton
            !hideBackButton && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                disabled={disabled}
                className={`w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium transition ${
                  disabled
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : "hover:bg-gray-50"
                }`}
              >
                Atrás
              </button>
            )
          ) : (
            // En Modal: Mostrar ambos botones
            <>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !selectedAddress ||
                  !formData.nombreDireccion ||
                  !formData.instruccionesEntrega ||
                  (!formData.usarMismaParaFacturacion && !selectedBillingAddress)
                }
                className="flex-1 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  "Guardar dirección"
                )}
              </button>
            </>
          )}
        </div>
      )}

      {/* Sección de dirección de facturación - REMOVIDA */}
      {false && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <h5 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
            Dirección de Facturación
          </h5>

          {/* Nombre de dirección de facturación */}
          <div>
            <label
              htmlFor="nombreDireccionFacturacion"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Nombre de la dirección <span className="text-red-500">*</span>
            </label>
            <input
              id="nombreDireccionFacturacion"
              type="text"
              value={formData.nombreDireccionFacturacion}
              onChange={(e) =>
                handleInputChange(
                  "nombreDireccionFacturacion",
                  e.target.value
                )
              }
              placeholder="ej: Oficina, Empresa, Otro"
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.nombreDireccionFacturacion
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.nombreDireccionFacturacion && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombreDireccionFacturacion}
              </p>
            )}
          </div>

          {/* Autocompletado de dirección de facturación */}
          <div>
            <label
              htmlFor="direccionFacturacion"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Buscar dirección (Google Maps) <span className="text-red-500">*</span>
            </label>
            <AddressAutocomplete
              addressType="billing"
              placeholder="Busca tu dirección de facturación (ej: Calle 80 # 15-25, Bogotá)"
              onPlaceSelect={handleBillingAddressSelect}
              enableAutoSelect={enableAutoSelect}
            />
            {errors.billingAddress && (
              <p className="text-red-500 text-xs mt-1">
                {errors.billingAddress}
              </p>
            )}
          </div>

          {/* Grid de campos de facturación: Departamento y Ciudad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="departamentoFacturacion"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                Departamento <span className="text-red-500">*</span>
              </label>
              <select
                id="departamentoFacturacion"
                value={formData.departamentoFacturacion}
                onChange={(e) => {
                  handleInputChange("departamentoFacturacion", e.target.value);
                  // Limpiar la ciudad seleccionada cuando cambia el departamento de facturación
                  handleInputChange("ciudad", "");
                }}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.departamentoFacturacion ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">
                  {loadingDepartments ? "Cargando departamentos..." : "-- Selecciona un departamento --"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.nombre} value={dept.nombre}>
                    {dept.nombre}
                  </option>
                ))}
              </select>
              {errors.departamentoFacturacion && (
                <p className="text-red-500 text-xs mt-1">{errors.departamentoFacturacion}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="ciudadFacturacion"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                Ciudad <span className="text-red-500">*</span> (compartida con envío)
              </label>
              <select
                id="ciudadFacturacion"
                value={formData.ciudad}
                onChange={(e) => handleInputChange("ciudad", e.target.value)}
                disabled={!formData.departamentoFacturacion}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  !formData.departamentoFacturacion
                    ? "bg-gray-100 cursor-not-allowed"
                    : errors.ciudad
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">
                  {!formData.departamentoFacturacion
                    ? "-- Primero selecciona un departamento --"
                    : "-- Selecciona una ciudad --"}
                </option>
                {availableBillingCities.map((city) => (
                  <option key={city.codigo} value={city.codigo}>
                    {city.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid: Nombre Calle y Número Principal para facturación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nombreCalleFacturacion"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                Tipo de Vía <span className="text-red-500">*</span>
              </label>
              <select
                id="nombreCalleFacturacion"
                value={formData.nombreCalleFacturacion}
                onChange={(e) => handleInputChange("nombreCalleFacturacion", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.nombreCalleFacturacion ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Selecciona tipo de vía --</option>
                {COLOMBIA_STREET_TYPES.map((streetType) => (
                  <option key={streetType.codigo} value={streetType.nombre}>
                    {streetType.nombre}
                  </option>
                ))}
              </select>
              {errors.nombreCalleFacturacion && (
                <p className="text-red-500 text-xs mt-1">{errors.nombreCalleFacturacion}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="numeroPrincipalFacturacion"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                Número principal *
              </label>
              <input
                id="numeroPrincipalFacturacion"
                type="text"
                value={formData.numeroPrincipalFacturacion}
                onChange={(e) => handleInputChange("numeroPrincipalFacturacion", e.target.value)}
                placeholder="ej: 98"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.numeroPrincipalFacturacion ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.numeroPrincipalFacturacion && (
                <p className="text-red-500 text-xs mt-1">{errors.numeroPrincipalFacturacion}</p>
              )}
            </div>
          </div>

          {/* Grid: Número Secundario y Barrio para facturación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="numeroSecundarioFacturacion"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                Número secundario
              </label>
              <input
                id="numeroSecundarioFacturacion"
                type="text"
                value={formData.numeroSecundarioFacturacion}
                onChange={(e) => handleInputChange("numeroSecundarioFacturacion", e.target.value)}
                placeholder="ej: -28"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="barrioFacturacion"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                Barrio
              </label>
              <input
                id="barrioFacturacion"
                type="text"
                value={formData.barrioFacturacion}
                onChange={(e) => handleInputChange("barrioFacturacion", e.target.value)}
                placeholder="ej: Chicó"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Tipo de propiedad para facturación */}
          <div>
            <label
              htmlFor="tipoDireccionFacturacionPropiedad"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Tipo de propiedad <span className="text-red-500">*</span>
            </label>
            <select
              id="tipoDireccionFacturacionPropiedad"
              value={formData.tipoDireccionFacturacion}
              onChange={(e) =>
                handleInputChange("tipoDireccionFacturacion", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="oficina">Oficina</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Sets de referencia para facturación */}
          <div>
            <label
              htmlFor="setsReferenciaFacturacion"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Sets de referencia
            </label>
            <input
              id="setsReferenciaFacturacion"
              type="text"
              value={formData.setsReferenciaFacturacion}
              onChange={(e) =>
                handleInputChange(
                  "setsReferenciaFacturacion",
                  e.target.value
                )
              }
              placeholder="ej: Oficina 204"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Instrucciones de entrega para facturación */}
          <div>
            <label
              htmlFor="instruccionesEntregaFacturacion"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              Instrucciones de entrega (Opcional)
            </label>
            <textarea
              id="instruccionesEntregaFacturacion"
              value={formData.instruccionesEntregaFacturacion}
              onChange={(e) =>
                handleInputChange(
                  "instruccionesEntregaFacturacion",
                  e.target.value
                )
              }
              placeholder="ej: Horario de oficina, llamar antes de llegar"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Mapa de dirección de facturación si es diferente */}
          {selectedBillingAddress && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación de dirección de facturación en el mapa
              </label>
              <AddressMap3D
                address={selectedBillingAddress}
                height="200px"
                enable3D={true}
                showControls={false}
              />
            </div>
          )}
        </div>
      )}
    </form>
  );

  return withContainer ? (
    <div className="p-4 rounded-lg border border-gray-200 shadow-lg bg-white w-full max-w-3xl">
      {formContent}
    </div>
  ) : (
    <div className="w-full max-w-4xl">
      {formContent}
    </div>
  );
}
