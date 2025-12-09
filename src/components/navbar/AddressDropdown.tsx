"use client";

import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MapPin, Check, Plus, X, ChevronDown /*, Trash2 */ } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/features/auth/context";
import type { Address } from "@/types/address";
import AddNewAddressForm from "../../app/carrito/components/AddNewAddressForm";
// COMENTADO: Ya no se usa para eliminar direcciones
// import { invalidateShippingOriginCache } from "@/hooks/useShippingOrigin";
import { useDefaultAddress } from "@/hooks/useDefaultAddress";
import { addressesService } from "@/services/addresses.service";
import { syncAddress, syncNewAddress, direccionToAddress } from "@/lib/addressSync";

interface AddressDropdownProps {
  showWhiteItems: boolean;
  renderMobileTrigger?: (params: {
    onClick: () => void;
    isOpen: boolean;
    showWhiteItems: boolean;
    displayAddress?: Address | null;
  }) => ReactNode;
}

/**
 * Helper function to extract address up to city name
 * Example: "Cra 56 #35-23, Puente Aranda, Bogotá, Colombia" -> "Cra 56 #35-23, Puente Aranda, Bogotá"
 */
const getAddressUpToCity = (address: Address | null): string => {
  if (!address) return 'Dirección';

  const { direccionFormateada, ciudad, lineaUno } = address;

  // If no formatted address and no line one, return city
  if (!direccionFormateada && !lineaUno) {
    return ciudad || 'Dirección';
  }

  // Use formatted address or line one
  const fullAddress = direccionFormateada || lineaUno || '';

  // If no city, return address as is (or truncated if too long)
  if (!ciudad) {
    return fullAddress;
  }

  // Find city in the full address and extract up to it (including the city)
  const cityIndex = fullAddress.indexOf(ciudad);
  if (cityIndex !== -1) {
    // Extract up to city name + city length
    const addressUpToCity = fullAddress.substring(0, cityIndex + ciudad.length);
    return addressUpToCity;
  }

  // Fallback: if city not found in address, just return the full address
  // This ensures we show as much as possible
  return fullAddress;
};

const AddressDropdown: React.FC<AddressDropdownProps> = React.memo(({
  showWhiteItems,
  renderMobileTrigger,
}) => {
  const { user, login, isAuthenticated } = useAuthContext();
  const { address: currentAddress, isLoading: loadingDefault, invalidate, refetch } = useDefaultAddress('ENVIO');
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // COMENTADO: Estados para eliminar dirección (ya no se usa)
  // const [deletingId, setDeletingId] = useState<string | null>(null);
  // const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const [guestAddress, setGuestAddress] = useState<Address | null>(null);

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Para usuarios invitados, leer dirección de localStorage
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      try {
        const savedAddress = globalThis.window?.localStorage.getItem('checkout-address');
        if (savedAddress) {
          const direccion = JSON.parse(savedAddress);
          // Convertir Direccion a Address usando la función helper
          const address = direccionToAddress(direccion) as Address;
          setGuestAddress(address);
        } else {
          setGuestAddress(null);
        }
      } catch (error) {
        console.error('Error reading guest address from localStorage:', error);
        setGuestAddress(null);
      }
    } else {
      setGuestAddress(null);
    }
  }, [isAuthenticated, user?.id]);

  // Escuchar cambios en localStorage para usuarios invitados
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      const handleStorageChange = (e: StorageEvent | Event) => {
        const key = (e as StorageEvent).key;
        if (key === 'checkout-address' || key === 'imagiq_default_address' || !key) {
          try {
            const savedAddress = globalThis.window?.localStorage.getItem('checkout-address');
            if (savedAddress) {
              const direccion = JSON.parse(savedAddress);
              const address = direccionToAddress(direccion) as Address;
              setGuestAddress(address);
            } else {
              setGuestAddress(null);
            }
          } catch (error) {
            console.error('Error reading guest address from localStorage:', error);
            setGuestAddress(null);
          }
        }
      };

      globalThis.window?.addEventListener('storage', handleStorageChange);
      globalThis.window?.addEventListener('checkout-address-changed', handleStorageChange as EventListener);

      return () => {
        globalThis.window?.removeEventListener('storage', handleStorageChange);
        globalThis.window?.removeEventListener('checkout-address-changed', handleStorageChange as EventListener);
      };
    }
  }, [isAuthenticated, user?.id]);

  // Cargar direcciones al inicio si no hay dirección predeterminada
  useEffect(() => {
    if (!loadingDefault && !currentAddress && user?.id && addresses.length === 0 && !isFetchingRef.current) {
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingDefault, currentAddress, user?.id]);

  // Escuchar cambios de dirección desde otros componentes (ej: carrito)
  useEffect(() => {
    const handleExternalAddressChange = async () => {
      console.log('🔄 Evento de cambio de dirección recibido en navbar desde otro componente');

      // Invalidar cache de useDefaultAddress
      invalidate();

      // Refrescar la dirección predeterminada
      await refetch();

      // Refrescar lista de direcciones
      if (user?.id) {
        await fetchAddresses();
      }

      console.log('✅ Navbar actualizado con la nueva dirección');
    };

    window.addEventListener('address-changed', handleExternalAddressChange);

    return () => {
      window.removeEventListener('address-changed', handleExternalAddressChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidate, refetch, user?.id]);

  const handleToggle = () => {
    if (!open && addresses.length === 0 && !isFetchingRef.current) {
      fetchAddresses();
    }
    setOpen(!open);
  };

  const fetchAddresses = async () => {
    if (!user?.id || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    try {
      const data = await addressesService.getUserAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleSelectAddress = async (address: Address) => {
    const currentAddressId = currentAddress?.id || (addresses.length > 0 ? addresses[0]?.id : null);
    if (address.id === currentAddressId) {
      setOpen(false);
      return;
    }

    try {
      // Usar utility centralizada para sincronizar dirección
      await syncAddress({
        address,
        userEmail: user?.email,
        user,
        loginFn: login,
        fromHeader: true,
      });

      // Invalidar cache del hook useDefaultAddress
      invalidate();

      // Refrescar la dirección actual
      await refetch();

      setOpen(false);
    } catch (error) {
      console.error("❌ Error setting default address:", error);
      alert('Error al cambiar la dirección predeterminada. Por favor intenta de nuevo.');
    }
  };

  const handleAddNewAddress = () => {
    // Permitir crear direcciones tanto para usuarios autenticados como guest
    // El modal de AddressModal maneja la creación con el guest ID si es necesario
    setOpen(false);
    setShowModal(true);
  };

  const handleAddressAdded = async (newAddress: Address) => {
    console.log('🆕 Nueva dirección agregada:', newAddress);

    // Cerrar el modal primero para mejor UX
    setShowModal(false);

    try {
      // Usar utility centralizada para sincronizar nueva dirección
      await syncNewAddress({
        address: newAddress,
        userEmail: user?.email,
        user,
        loginFn: login,
        fromHeader: true,
      });

      // Invalidar cache del hook useDefaultAddress
      invalidate();

      // Refrescar lista de direcciones
      await fetchAddresses();

      // Forzar refetch de la dirección predeterminada
      await refetch();
    } catch (error) {
      console.error('❌ Error al sincronizar nueva dirección:', error);
    }
  };

  // COMENTADO: Funciones para eliminar dirección (ya no se usa el botón de basurita)
  /*
  const handleDeleteClick = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se active el onClick del botón padre
    setConfirmingDeleteId(addressId);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDeleteId(null);
  };

  const handleConfirmDelete = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDeleteId(null);
    setDeletingId(addressId);

    try {
      console.log('🗑️ Eliminando dirección:', addressId);
      await addressesService.deleteAddress(addressId);
      console.log('✅ Dirección eliminada exitosamente');

      // Remover de la lista local inmediatamente para mejor UX
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);

      // Si se eliminó la dirección que se está mostrando, invalidar cache
      const currentAddressId = currentAddress?.id || (addresses.length > 0 ? addresses[0]?.id : null);
      if (addressId === currentAddressId) {
        invalidate();
        await refetch();
      }

      // Refrescar lista completa desde el backend para asegurar sincronización
      await fetchAddresses();

      // Invalidar cache del hook useShippingOrigin
      invalidateShippingOriginCache();

      // Si no quedan direcciones, actualizar el contexto
      if (updatedAddresses.length === 0 && user) {
        await login({
          ...user,
          defaultAddress: null,
        });
      }
    } catch (error) {
      console.error("❌ Error eliminando dirección:", error);
      alert('Error al eliminar la dirección. Por favor intenta de nuevo.');
    } finally {
      setDeletingId(null);
    }
  };
  */

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Si no hay usuario logueado pero hay dirección en localStorage, mostrarla
  // Si no hay dirección, mostrar botón para agregar dirección que redirige al login
  if (!isAuthenticated || !user?.id) {
    // Si hay dirección de invitado, mostrarla
    if (guestAddress) {
      const displayAddress = guestAddress;
      return (
        <>
          <div className="relative" ref={dropdownRef}>
          {/* Botón para Desktop (>= 1280px) - Una línea */}
          <button
            className={cn(
              "hidden xl:flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px] truncate hover:opacity-80 transition-opacity cursor-pointer",
              showWhiteItems ? "text-white/90" : "text-black/80"
            )}
            onClick={handleToggle}
            title={displayAddress.direccionFormateada || displayAddress.lineaUno || 'Dirección'}
            style={{ lineHeight: "1.4" }}
            type="button"
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span
              className="truncate block min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                lineHeight: "1.4",
                maxWidth: "calc(100% - 60px)"
              }}
              title={displayAddress.direccionFormateada || displayAddress.lineaUno || 'Dirección'}
            >
              {getAddressUpToCity(displayAddress)}
            </span>
            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
          </button>

          {/* Botón para Mobile/Tablet (< 1280px) */}
          {renderMobileTrigger ? (
            <>{renderMobileTrigger({
              onClick: handleToggle,
              isOpen: open,
              showWhiteItems,
              displayAddress,
            })}</>
          ) : (
            <button
              className={cn(
                "xl:hidden flex items-center justify-center w-10 h-10 hover:opacity-80 transition-opacity cursor-pointer",
                "text-black"
              )}
              onClick={handleToggle}
              title={displayAddress.direccionFormateada || displayAddress.lineaUno || displayAddress.ciudad || 'Dirección'}
              type="button"
            >
              <MapPin className="w-5 h-5 text-black" />
            </button>
          )}

          {/* Dropdown para mostrar la dirección y permitir agregar más (también para invitados) */}
          {open && (
            <div
              className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Dirección de envío</h3>
                  <p className="text-sm text-gray-700">
                    {displayAddress.direccionFormateada || displayAddress.lineaUno}
                  </p>
                  {displayAddress.ciudad && (
                    <p className="text-xs text-gray-500 mt-1">{displayAddress.ciudad}</p>
                  )}
                </div>

                {/* Botón para agregar nueva dirección (disponible para invitados) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNewAddress();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar nueva dirección</span>
                </button>
              </div>
            </div>
          )}
          {showModal && isMounted && createPortal(
            <div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowModal(false)}
            >
              <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Agregar nueva dirección
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="overflow-y-auto p-6">
                  <AddNewAddressForm
                    onAddressAdded={handleAddressAdded}
                    onCancel={() => setShowModal(false)}
                    withContainer={false}
                  />
                </div>
              </div>
            </div>,
            document.body
          )}
          </div>
        </>
      );
    }

    // Si no hay dirección, mostrar botón para agregar dirección
    return (
      <>
        <div className="relative" ref={dropdownRef}>
          {/* Botón para Desktop (>= 1280px) */}
          <button
          className={cn(
            "hidden xl:flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px] truncate hover:opacity-80 transition-opacity cursor-pointer",
            showWhiteItems ? "text-white/90" : "text-black/80"
          )}
          onClick={handleAddNewAddress}
          title="Agregar dirección"
          style={{ lineHeight: "1.4" }}
          type="button"
        >
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate block" style={{ lineHeight: "1.4" }}>
            Agregar dirección
          </span>
          <Plus className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
        </button>

        {/* Botón para Mobile/Tablet (< 1280px) */}
        <button
          className={cn(
            "xl:hidden flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer py-1 max-w-[200px] sm:max-w-[280px] pr-4",
            showWhiteItems ? "text-white/90" : "text-black/80"
          )}
          onClick={handleAddNewAddress}
          title="Agregar dirección"
          type="button"
        >
          <div className="flex flex-col items-start gap-0 min-w-0 flex-1">
            <div className="flex items-center gap-1 w-full">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[11px] font-semibold truncate">
                Agregar dirección
              </span>
            </div>
          </div>
          <Plus className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
      
      {showModal && isMounted && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                Agregar nueva dirección
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <AddNewAddressForm
                onAddressAdded={handleAddressAdded}
                onCancel={() => setShowModal(false)}
                withContainer={false}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
      </>
    );
  }

  // Skeleton mientras carga la dirección predeterminada (solo si hay usuario logueado)
  if (loadingDefault) {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Skeleton para Desktop (>= 1280px) */}
        <div className="hidden xl:flex items-center gap-1.5 max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px]">
          <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0" />
          <div className="h-4 bg-gray-300 rounded animate-pulse flex-1" />
          <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0 ml-1" />
        </div>

        {/* Skeleton para Mobile/Tablet (< 1280px) */}
        <div className="xl:hidden flex items-center gap-2 max-w-[200px] sm:max-w-[280px] pr-4">
          <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-1 w-full">
              <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0" />
              <div className="h-3 bg-gray-300 rounded animate-pulse flex-1" />
            </div>
            <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
          </div>
          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse flex-shrink-0" />
        </div>
      </div>
    );
  }

  // Determinar qué dirección mostrar: predeterminada o primera disponible
  const displayAddress = currentAddress || (addresses.length > 0 ? addresses[0] : null);

  // COMENTADO: Función getShortAddress ya no se usa
  /*
  // Función para obtener una versión corta de la dirección para mobile
  // NO mostrar nombreDireccion (ej: "Casa"), solo la dirección real
  const getShortAddress = (address: Address | null): string => {
    if (!address) return 'Dirección';
    
    // Priorizar ciudad (ej: "Bogotá")
    if (address.ciudad && address.ciudad.trim()) {
      return address.ciudad.trim();
    }
    
    // Si tiene dirección formateada, tomar los primeros caracteres
    if (address.direccionFormateada && address.direccionFormateada.trim()) {
      const trimmed = address.direccionFormateada.trim();
      return trimmed.length > 25 
        ? trimmed.substring(0, 25) + '...'
        : trimmed;
    }
    
    // Fallback a lineaUno
    if (address.lineaUno && address.lineaUno.trim()) {
      const trimmed = address.lineaUno.trim();
      return trimmed.length > 25 
        ? trimmed.substring(0, 25) + '...'
        : trimmed;
    }
    
    return 'Dirección';
  };
  */

  // Si no hay dirección predeterminada ni direcciones disponibles, mostrar botón para agregar dirección
  // También mostrar skeleton si está cargando direcciones
  if (!displayAddress) {
    if (loading || loadingDefault) {
      // Mostrar skeleton mientras carga
      return (
        <div className="relative" ref={dropdownRef}>
          {/* Skeleton para Desktop (>= 1280px) */}
          <div className="hidden xl:flex items-center gap-1.5 max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px]">
            <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0" />
            <div className="h-4 bg-gray-300 rounded animate-pulse flex-1" />
            <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0 ml-1" />
          </div>

          {/* Skeleton para Mobile/Tablet (< 1280px) */}
          <div className="xl:hidden flex items-center gap-2 max-w-[200px] sm:max-w-[280px] pr-4">
            <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-1 w-full">
                <div className="w-3.5 h-3.5 bg-gray-300 rounded animate-pulse flex-shrink-0" />
                <div className="h-3 bg-gray-300 rounded animate-pulse flex-1" />
              </div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
            </div>
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse flex-shrink-0" />
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="relative" ref={dropdownRef}>
          {/* Botón para Desktop (>= 1280px) */}
          <button
            className={cn(
              "hidden xl:flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px] truncate hover:opacity-80 transition-opacity cursor-pointer",
              showWhiteItems ? "text-white/90" : "text-black/80"
            )}
            onClick={handleAddNewAddress}
            title="Agregar dirección"
            style={{ lineHeight: "1.4" }}
            type="button"
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate block" style={{ lineHeight: "1.4" }}>
              Agregar dirección
            </span>
            <Plus className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
          </button>

          {/* Botón para Mobile/Tablet (< 1280px) */}
          <button
            className={cn(
              "xl:hidden flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer py-1 max-w-[200px] sm:max-w-[280px] pr-4",
              showWhiteItems ? "text-white/90" : "text-black/80"
            )}
            onClick={handleAddNewAddress}
            title="Agregar dirección"
            type="button"
          >
            <div className="flex flex-col items-start gap-0 min-w-0 flex-1">
              <div className="flex items-center gap-1 w-full">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[11px] font-semibold truncate">
                  Agregar dirección
                </span>
              </div>
            </div>
            <Plus className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </>
    );
  }

  // Si llegamos aquí, displayAddress debe existir
  if (!displayAddress) {
    return null;
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Botón para Desktop (>= 1280px) - Una línea */}
        <button
          className={cn(
            "hidden xl:flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium w-full hover:opacity-80 transition-opacity cursor-pointer",
            showWhiteItems ? "text-white/90" : "text-black/80"
          )}
          onClick={handleToggle}
          title={displayAddress.direccionFormateada || displayAddress.lineaUno || 'Dirección'}
          style={{ lineHeight: "1.4" }}
          type="button"
        >
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span
            className="truncate block min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              lineHeight: "1.4",
              maxWidth: "calc(100% - 60px)" // Dejar espacio para iconos y "Para Empresas"
            }}
            title={displayAddress.direccionFormateada || displayAddress.lineaUno || 'Dirección'}
          >
            {getAddressUpToCity(displayAddress)}
          </span>
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
        </button>

        {/* Botón para Mobile/Tablet (< 1280px) */}
        {renderMobileTrigger ? (
          <>{renderMobileTrigger({
            onClick: handleToggle,
            isOpen: open,
            showWhiteItems,
            displayAddress,
          })}</>
        ) : (
          <button
            className={cn(
              "xl:hidden flex items-center justify-center w-10 h-10 hover:opacity-80 transition-opacity cursor-pointer",
              "text-black"
            )}
            onClick={handleToggle}
            title={displayAddress.direccionFormateada || displayAddress.lineaUno || displayAddress.ciudad || 'Dirección'}
            type="button"
          >
            <MapPin className="w-5 h-5 text-black" />
          </button>
        )}

        {open && (
          <div
            className="fixed xl:absolute left-0 right-0 xl:left-0 xl:right-auto top-[64px] xl:top-full mt-0 xl:mt-1 w-full xl:w-[420px] bg-white border-t xl:border border-gray-200 xl:rounded-lg shadow-2xl z-[10000] overflow-hidden"
            role="menu"
          >
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-base">Mis direcciones</h3>
              <p className="text-xs text-gray-600 mt-1">
                Selecciona tu dirección predeterminada
              </p>
            </div>

            <div className="max-h-[60vh] xl:max-h-96 overflow-y-auto bg-white">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No hay direcciones registradas
                </div>
              ) : (
                addresses.map((address) => {
                  const currentAddressId = currentAddress?.id || (addresses.length > 0 ? addresses[0]?.id : null);
                  const isSelected = address.id === currentAddressId;
                  // COMENTADO: Variables para eliminar dirección (ya no se usa)
                  // const isDeleting = deletingId === address.id;
                  // const isConfirming = confirmingDeleteId === address.id;
                  return (
                    <div
                      key={address.id}
                      className={cn(
                        "w-full px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group",
                        isSelected && "bg-blue-50 hover:bg-blue-100"
                        // COMENTADO: Ya no se usa la confirmación de eliminar
                        // isConfirming && "bg-red-50"
                      )}
                    >
                      {/* COMENTADO: Vista de confirmación de eliminar dirección */}
                      {/* {isConfirming ? (
                        // Vista de confirmación
                        <div className="flex flex-col gap-3">
                          <p className="text-sm font-medium text-gray-900">
                            ¿Eliminar esta dirección?
                          </p>
                          <p className="text-xs text-gray-600">
                            Esta acción no se puede deshacer.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => handleConfirmDelete(address.id, e)}
                              disabled={isDeleting}
                              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              type="button"
                            >
                              {isDeleting ? (
                                <span className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Eliminando...
                                </span>
                              ) : (
                                'Eliminar'
                              )}
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              disabled={isDeleting}
                              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              type="button"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : ( */}
                        {/* Vista normal */}
                        <div className="flex items-start justify-between gap-3">
                          <button
                            className="flex-1 min-w-0 text-left"
                            onClick={() => handleSelectAddress(address)}
                            type="button"
                            // COMENTADO: Ya no se usa isDeleting
                            // disabled={isDeleting}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-sm">
                                {address.nombreDireccion}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
                              {address.direccionFormateada}
                            </p>
                            {address.ciudad && (
                              <p className="text-xs text-gray-500 mt-1">
                                {address.ciudad}
                                {address.departamento && `, ${address.departamento}`}
                              </p>
                            )}
                          </button>
                          {/* COMENTADO: Botón para eliminar dirección (basurita) */}
                          {/* <button
                            onClick={(e) => handleDeleteClick(address.id, e)}
                            disabled={isDeleting}
                            className={cn(
                              "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100",
                              isDeleting && "opacity-100 cursor-not-allowed"
                            )}
                            type="button"
                            title="Eliminar dirección"
                          >
                            {isDeleting ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button> */}
                        </div>
                      {/* COMENTADO: Cierre del condicional isConfirming */}
                      {/* )} */}
                    </div>
                );
                })
              )}
            </div>

            {/* Botón para agregar nueva dirección */}
            <div className="border-t border-gray-200 bg-white p-4">
              <button
                onClick={handleAddNewAddress}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                type="button"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar nueva dirección</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para agregar dirección - usando Portal para renderizar fuera del Navbar */}
      {/* Este modal se renderiza siempre al final del componente para todos los casos */}
      {showModal && isMounted && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                Agregar nueva dirección
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <AddNewAddressForm
                onAddressAdded={handleAddressAdded}
                onCancel={() => setShowModal(false)}
                withContainer={false}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
});

AddressDropdown.displayName = 'AddressDropdown';

export default AddressDropdown;
