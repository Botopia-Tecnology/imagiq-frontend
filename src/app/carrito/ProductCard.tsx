import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useShippingOrigin } from "@/hooks/useShippingOrigin";
import { TradeInCompletedSummary } from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";
import TradeInModal from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInModal";
import { safeGetLocalStorage } from "@/lib/localStorage";

export interface ProductCardProps {
  nombre: string;
  precio: number;
  precioOriginal?: number;
  cantidad: number;
  imagen: string;
  stock?: number;
  ubicacionEnvio?: string;
  /** Ciudad de envío (ej: "BOGOTÁ") */
  shippingCity?: string;
  /** Nombre de la tienda (ej: "Ses Bogotá C.C. Andino") */
  shippingStore?: string;
  color?: string;
  colorName?: string;
  capacity?: string;
  ram?: string;
  /** Indica si se está cargando la información de envío */
  isLoadingShippingInfo?: boolean;
  onQuantityChange: (cantidad: number) => void;
  onRemove: () => void;
  desDetallada?: string;
  /** Indica si el producto puede ser recogido en tienda */
  canPickUp?: boolean;
  /** Indica si se está cargando el canPickUp */
  isLoadingCanPickUp?: boolean;
  /** Indica si se está cargando el indRetoma */
  isLoadingIndRetoma?: boolean;
  /** Indica si el producto aplica para retoma (1 = aplica, 0 = no aplica) */
  indRetoma?: number;
  /** Callback para abrir el modal de Trade-In */
  onOpenTradeInModal?: () => void;
  /** Callback para remover el Trade-In */
  onRemoveTradeIn?: () => void;
  /** Datos del Trade-In completado (si existe) */
  tradeInData?: {
    deviceName: string;
    value: number;
    completed: boolean;
  } | null;
}

// Funciones puras para cálculos (SRP)
const calcularLimiteMaximo = (stock?: number): number =>
  Math.min(stock ?? 5, 5);
const calcularDisponible = (
  stock: number | undefined,
  cantidadActual: number
): number => Math.max(0, (stock ?? 5) - cantidadActual);
const calcularDescuento = (original?: number, actual?: number): number | null =>
  original && actual && original > actual
    ? Math.round(((original - actual) / original) * 100)
    : null;

/**
 * Valida si un valor de capacidad o RAM es válido para mostrar
 * Retorna false si el valor es "No Aplica" o "No" (case-insensitive)
 */
const esValorValido = (valor?: string): boolean => {
  if (!valor) return false;
  const valorNormalizado = valor.toLowerCase().trim();
  return valorNormalizado !== "no aplica" && valorNormalizado !== "no";
};

/**
 * Componente ProductCard para el carrito - Diseño Desktop/Mobile
 * Desktop: Imagen izquierda (20%) + Detalles derecha (80%)
 * Mobile: Layout vertical compacto
 */
const ProductCard: React.FC<ProductCardProps> = ({
  nombre,
  precio,
  precioOriginal,
  cantidad,
  imagen,
  stock,
  shippingCity,
  shippingStore,
  color,
  colorName,
  capacity,
  ram,
  isLoadingShippingInfo,
  canPickUp,
  isLoadingCanPickUp = false,
  isLoadingIndRetoma = false,
  indRetoma,
  onQuantityChange,
  onRemove,
  onOpenTradeInModal,
  onRemoveTradeIn,
  tradeInData,
}) => {
  const [isTradeInModalOpen, setIsTradeInModalOpen] = useState(false);

  // Verificar si el usuario está logueado
  const user = safeGetLocalStorage<{
    id?: string;
    user_id?: string;
    email?: string;
  }>("imagiq_user", {});
  const isUserLoggedIn = !!(user?.id || user?.user_id || user?.email);

  // Verificar si canPickUp es false para mostrar mensaje informativo
  const showCanPickUpMessage = isUserLoggedIn && canPickUp === false;

  // Determinar si debe mostrar el banner de Trade-In para este producto
  // Si indRetoma es 1, SIEMPRE se debe mostrar (ya sea la guía o el resumen completado)
  const shouldShowTradeInBanner = indRetoma === 1;

  const handleOpenTradeInModal = () => {
    if (onOpenTradeInModal) {
      onOpenTradeInModal();
    } else {
      setIsTradeInModalOpen(true);
    }
  };

  const handleRemoveTradeIn = () => {
    if (onRemoveTradeIn) {
      onRemoveTradeIn();
    }
  };
  const limiteMax = calcularLimiteMaximo(stock);
  const disponible = calcularDisponible(stock, cantidad);
  const descuento = calcularDescuento(precioOriginal, precio);

  // Validar capacity y ram
  const capacityValida = esValorValido(capacity);
  const ramValida = esValorValido(ram);

  // Verificar condiciones para mostrar origen de envío
  const { shouldShowShippingOrigin } = useShippingOrigin();
  const mostrarOrigen =
    shouldShowShippingOrigin &&
    (shippingCity || shippingStore || isLoadingShippingInfo);
  return (
    <>
      {/* Mobile: Layout horizontal compacto estilo Mercado Libre */}
      <div className="md:hidden">
        <div className="bg-white p-4">
          <div className="flex gap-3">
            {/* Imagen */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-24 h-24 relative flex-shrink-0 bg-gray-100 rounded-xl p-2">
                <Image
                  src={imagen}
                  alt={nombre}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              </div>
            </div>

            {/* Contenido derecha */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Nombre truncado */}
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">
                    {nombre} - {colorName && <span>{colorName}</span>}
                  </h3>
                </div>
                <button
                  onClick={onRemove}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors -mr-2 -mt-2"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Detalles de variante */}
              {(color || capacityValida || ramValida) && (
                <div className="text-xs text-gray-600 mb-1 flex flex-wrap gap-1 items-center">
                  {color && (
                    <div
                      className="w-4 h-4 rounded-full ring-1 ring-gray-300"
                      style={{ backgroundColor: color }}
                      title={colorName || color}
                    />
                  )}
                  {color && (capacityValida || ramValida) && <span>•</span>}
                  {capacityValida && <span>{capacity}</span>}
                  {capacityValida && ramValida && <span>•</span>}
                  {ramValida && <span>{ram}</span>}
                </div>
              )}
              {mostrarOrigen && (
                <div className="mt-1">
                  {isLoadingShippingInfo ? (
                    <>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-40"></div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">
                        En {shippingCity}
                      </p>
                      {shippingStore && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {shippingStore}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Cantidad y Precio en la misma fila */}
              <div className="flex items-center justify-between gap-2">
                {/* Cantidad */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                    <button
                      onClick={() => onQuantityChange(Math.max(1, cantidad - 1))}
                      className="p-1.5 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      disabled={cantidad <= 1}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {cantidad}
                    </span>
                    <button
                      onClick={() =>
                        onQuantityChange(Math.min(limiteMax, cantidad + 1))
                      }
                      className="p-1.5 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      disabled={cantidad >= limiteMax}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && (
                    <span className="text-xs text-gray-500">
                      Disponibles: {disponible}
                    </span>
                  )}
                  {isLoadingCanPickUp && (
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1" />
                  )}
                  {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && canPickUp !== undefined && !isLoadingCanPickUp && (
                    <span className="text-xs text-gray-400">
                      canPickUp: {canPickUp ? "true" : "false"}
                    </span>
                  )}
                  {isLoadingIndRetoma && (
                    <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mt-1" />
                  )}
                  {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && indRetoma !== undefined && !isLoadingIndRetoma && (
                    <span className="text-xs text-gray-400">
                      retoma: {indRetoma}
                    </span>
                  )}
                </div>

                {/* Precios al lado derecho */}
                <div className="flex flex-col items-end">
                  {descuento && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-green-600">
                        -{descuento}%
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ${precioOriginal?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <span className="text-lg font-bold text-gray-900">
                    ${precio.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de Trade-In debajo del producto (solo si indRetoma === 1) */}
        {shouldShowTradeInBanner && (
          <div className="mt-3 px-4">
            <TradeInCompletedSummary
              deviceName={tradeInData?.deviceName || nombre}
              tradeInValue={tradeInData?.value || 0}
              onEdit={tradeInData?.completed ? handleRemoveTradeIn : handleOpenTradeInModal}
              isGuide={!tradeInData?.completed}
              shippingCity={shippingCity}
              showCanPickUpMessage={showCanPickUpMessage}
            />
          </div>
        )}
      </div>

      {/* Desktop/Tablet: Layout horizontal */}
      <div className="hidden md:block">
        <div className="flex bg-white p-4 gap-4 items-start">
          {/* Imagen */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 rounded-xl">
            <Image
              src={imagen}
              alt={nombre}
              fill
              className="object-contain p-2"
              sizes="112px"
            />
          </div>

          {/* Detalles - Centro */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
              {nombre} - {colorName && <span>{colorName}</span>}
            </h3>
            {/* Detalles de variante */}
            {(color || capacityValida || ramValida) && (
              <div className="text-sm text-gray-600 mb-1 flex flex-wrap gap-1 items-center">
                {color && (
                  <div
                    className="w-5 h-5 rounded-full ring-1 ring-gray-300"
                    style={{ backgroundColor: color }}
                    title={colorName || color}
                  />
                )}
                {color && (capacityValida || ramValida) && <span>•</span>}
                {capacityValida && <span>{capacity}</span>}
                {capacityValida && ramValida && <span>•</span>}
                {ramValida && <span>{ram}</span>}
              </div>
            )}

            {mostrarOrigen && (
              <div className="mt-1">
                {isLoadingShippingInfo ? (
                  <>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-40"></div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">
                      En {shippingCity}
                    </p>
                    {shippingStore && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {shippingStore}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Precios - debajo del nombre */}
            <div className="flex flex-col mt-2">
              <span className="text-sm font-semibold text-gray-900">
                ${precio.toLocaleString()}
              </span>
              {descuento && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 line-through">
                    ${precioOriginal?.toLocaleString()}
                  </span>
                  {precioOriginal && (
                    <span className="text-xs text-green-600 font-medium">
                      Ahorras ${(precioOriginal - precio).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: Eliminar y Cantidad */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            <button
              onClick={onRemove}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Eliminar producto"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Selector de cantidad */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500">Cantidad:</span>
              <div className="flex items-center border border-gray-200 rounded bg-white">
                <button
                  onClick={() => onQuantityChange(Math.max(1, cantidad - 1))}
                  className="p-1.5 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={cantidad <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3 h-3 text-gray-600" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-gray-900">
                  {cantidad}
                </span>
                <button
                  onClick={() =>
                    onQuantityChange(Math.min(limiteMax, cantidad + 1))
                  }
                  className="p-1.5 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={cantidad >= limiteMax}
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Debug info */}
            {isLoadingCanPickUp && (
              <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
            )}
            {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && canPickUp !== undefined && !isLoadingCanPickUp && (
              <span className="text-xs text-gray-400">
                canPickUp: {canPickUp ? "true" : "false"}
              </span>
            )}
            {isLoadingIndRetoma && (
              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
            )}
            {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && indRetoma !== undefined && !isLoadingIndRetoma && (
              <span className="text-xs text-gray-400">
                retoma: {indRetoma}
              </span>
            )}
          </div>
        </div>

        {/* Banner de Trade-In debajo del producto (solo si indRetoma === 1) */}
        {shouldShowTradeInBanner && (
          <div className="px-4 pb-4">
            <TradeInCompletedSummary
              deviceName={tradeInData?.deviceName || nombre}
              tradeInValue={tradeInData?.value || 0}
              onEdit={tradeInData?.completed ? handleRemoveTradeIn : handleOpenTradeInModal}
              isGuide={!tradeInData?.completed}
              shippingCity={shippingCity}
              showCanPickUpMessage={showCanPickUpMessage}
            />
          </div>
        )}
      </div>

      {/* Modal de Trade-In */}
      {isTradeInModalOpen && (
        <TradeInModal
          isOpen={isTradeInModalOpen}
          onClose={() => setIsTradeInModalOpen(false)}
          onContinue={() => setIsTradeInModalOpen(false)}
          onCancelWithoutCompletion={() => setIsTradeInModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
