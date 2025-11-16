import React from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useShippingOrigin } from "@/hooks/useShippingOrigin";

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
  desDetallada?:string;
  /** Indica si el producto puede ser recogido en tienda */
  canPickUp?: boolean;
  /** Indica si se está cargando el canPickUp */
  isLoadingCanPickUp?: boolean;
  /** Indica si se está cargando el indRetoma */
  isLoadingIndRetoma?: boolean;
  /** Indica si el producto aplica para retoma (1 = aplica, 0 = no aplica) */
  indRetoma?: number;
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
}) => {
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
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex gap-3">
          {/* Imagen */}
          <div className="flex flex-col items-center gap-2">
          <div className="w-40 h-40 relative flex-shrink-0 bg-gray-100 rounded-xl p-3">
            <Image
              src={imagen}
              alt={nombre}
              fill
              className="object-contain p-3"
              sizes="160px"
            />
          </div>
          <button
            onClick={onRemove}
            className="text-sm text-sky-600 hover:text-sky-700 font-medium transition"
            aria-label="Eliminar producto"
          >
            Eliminar
          </button>
        </div>

          {/* Contenido derecha */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Nombre truncado */}
            <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">
              {nombre} - {colorName && <span>{colorName}</span>}
            </h3>

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

            {/* Cantidad */}
            <div className="flex items-center gap-2 mb-2">
              <select
                value={cantidad}
                onChange={(e) => onQuantityChange(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer"
              >
                {Array.from({ length: limiteMax }, (_, i) => i + 1).map(
                  (num) => (
                    <option key={num} value={num}>
                      {num} u.
                    </option>
                  )
                )}
              </select>
              <span className="text-xs text-gray-500">
                Disponibles: {disponible}
              </span>
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

            {/* Precios */}
            <div className="flex flex-col">
              {descuento && (
                <div className="flex items-center gap-1 mb-0.5">
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

      {/* Desktop: Layout horizontal */}
      <div className="hidden md:flex bg-white p-6 gap-6 items-start border-b border-gray-200">
        {/* Imagen + Eliminar */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-40 h-40 relative flex-shrink-0 bg-gray-100 rounded-xl p-3">
            <Image
              src={imagen}
              alt={nombre}
              fill
              className="object-contain p-3"
              sizes="160px"
            />
          </div>
          <button
            onClick={onRemove}
            className="text-sm text-sky-600 hover:text-sky-700 font-medium transition cursor-pointer"
            aria-label="Eliminar producto"
          >
            Eliminar
          </button>
        </div>

        {/* Detalles - 80% */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
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
          </div>

          <div className="flex items-center gap-6 mt-4">
            {/* Selector de cantidad */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                <button
                  onClick={() => onQuantityChange(Math.max(1, cantidad - 1))}
                  className="p-2.5 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={cantidad <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold">
                  {cantidad}
                </span>
                <button
                  onClick={() =>
                    onQuantityChange(Math.min(limiteMax, cantidad + 1))
                  }
                  className="p-2.5 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={cantidad >= limiteMax}
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500 text-center">
                Disponibles: {disponible}
              </span>
              {isLoadingCanPickUp && (
                <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1 mx-auto" />
              )}
              {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && canPickUp !== undefined && !isLoadingCanPickUp && (
                <span className="text-xs text-gray-400 text-center">
                  canPickUp: {canPickUp ? "true" : "false"}
                </span>
              )}
              {isLoadingIndRetoma && (
                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mt-1 mx-auto" />
              )}
              {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && indRetoma !== undefined && !isLoadingIndRetoma && (
                <span className="text-xs text-gray-400 text-center">
                  retoma: {indRetoma}
                </span>
              )}
            </div>

            {/* Precios */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-bold text-gray-900">
                  ${precio.toLocaleString()}
                </span>
                {descuento && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ${precioOriginal?.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded whitespace-nowrap">
                      {descuento}%
                    </span>
                  </>
                )}
              </div>
              {descuento && precioOriginal && (
                <span className="text-sm text-green-600 font-medium">
                  Ahorras ${(precioOriginal - precio).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
