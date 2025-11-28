"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartProduct, BundleInfo } from "@/hooks/useCart";
import { BundleWarningPopup } from "./BundleWarningPopup";
import Image from "next/image";
import { TradeInCompletedSummary } from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";

interface CartBundleGroupProps {
  /** Información del bundle */
  bundleInfo: BundleInfo;
  /** Productos que pertenecen a este bundle */
  items: CartProduct[];
  /** Callback para actualizar cantidad del bundle */
  onUpdateQuantity: (
    codCampana: string,
    productSku: string,
    quantity: number
  ) => Promise<void>;
  /** Callback para eliminar un producto del bundle */
  onRemoveProduct: (sku: string, keepOtherProducts: boolean) => Promise<void>;
  /** Función para formatear precios */
  formatPrice: (price: number) => string;
  /** Datos de Trade-In para el bundle */
  tradeInData?: {
    deviceName: string;
    value: number;
    completed: boolean;
  } | null;
  /** Callback para abrir el modal de Trade-In */
  onOpenTradeInModal?: () => void;
  /** Callback para remover Trade-In */
  onRemoveTradeIn?: () => void;
  /** Ciudad de envío */
  shippingCity?: string;
  /** Mostrar mensaje de canPickUp */
  showCanPickUpMessage?: boolean;
}

/**
 * Componente que muestra los productos de un bundle con indicador visual
 */
export function CartBundleGroup({
  bundleInfo,
  items,
  onUpdateQuantity,
  onRemoveProduct,
  formatPrice,
  tradeInData,
  onOpenTradeInModal,
  onRemoveTradeIn,
  shippingCity,
  showCanPickUpMessage = false,
}: CartBundleGroupProps) {
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
  const [productToRemove, setProductToRemove] = useState<CartProduct | null>(null);
  const [productForQuantityChange, setProductForQuantityChange] = useState<CartProduct | null>(null);

  // Calcular cantidad (todos los productos del bundle tienen la misma)
  const quantity = items[0]?.quantity || 1;

  // Handlers
  const handleQuantityChange = (product: CartProduct, newQuantity: number) => {
    if (newQuantity === quantity) return;
    setProductForQuantityChange(product);
    setPendingQuantity(newQuantity);
    setShowQuantityPopup(true);
  };

  const handleConfirmQuantity = () => {
    if (pendingQuantity !== null) {
      onUpdateQuantity(bundleInfo.codCampana, bundleInfo.productSku, pendingQuantity);
    }
    setShowQuantityPopup(false);
    setPendingQuantity(null);
    setProductForQuantityChange(null);
  };

  const handleRemoveClick = (product: CartProduct) => {
    setProductToRemove(product);
    setShowRemovePopup(true);
  };

  const handleConfirmRemove = (keepOtherProducts?: boolean) => {
    if (productToRemove) {
      onRemoveProduct(productToRemove.sku, keepOtherProducts ?? true);
    }
    setShowRemovePopup(false);
    setProductToRemove(null);
  };

  const otherProductNames = productToRemove
    ? items.filter((p) => p.sku !== productToRemove.sku).map((p) => p.name)
    : items.map((p) => p.name);

  const otherProductNamesForQuantity = productForQuantityChange
    ? items.filter((p) => p.sku !== productForQuantityChange.sku).map((p) => p.name)
    : items.slice(1).map((p) => p.name);

  // Calcular ahorro individual de cada producto
  const calculateProductSavings = (product: CartProduct) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return (product.originalPrice - product.price) * product.quantity;
    }
    return 0;
  };

  // Verificar si debe mostrar el banner de Trade-In
  const shouldShowTradeInBanner = bundleInfo.ind_entre_estre === 1;

  // Obtener el nombre completo del bundle (concatenar todos los productos con " + ")
  const bundleName = items
    .map((item) => item.name)
    .filter(Boolean)
    .join(" + ") || "Bundle";

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Productos del bundle */}
        <div className="divide-y divide-gray-100">
          {items.map((product) => {
            const productSavings = calculateProductSavings(product);

            return (
              <div key={product.sku} className="p-4">
                <div className="flex gap-4">
                  {/* Imagen con fondo gris */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 rounded-xl">
                    <Image
                      src={product.image || "/img/logo_imagiq.png"}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Info del producto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {/* Nombre + Color concatenado */}
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-2">
                          {product.name}
                          {product.colorName && (
                            <span> - {product.colorName}</span>
                          )}
                        </h4>

                        {/* Variantes (capacidad, ram) */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          {product.color && (
                            <span
                              className="w-3 h-3 rounded-full border border-gray-200"
                              style={{ backgroundColor: product.color }}
                            />
                          )}
                          {product.capacity && product.capacity !== "No Aplica" && (
                            <span className="text-xs text-gray-500">
                              {product.capacity}
                            </span>
                          )}
                          {product.ram && product.ram !== "No" && (
                            <span className="text-xs text-gray-500">
                              {product.ram} RAM
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveClick(product);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Precios y ahorro individual */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(product.price * product.quantity)}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.originalPrice * product.quantity)}
                          </span>
                        )}
                      {productSavings > 0 && (
                        <span className="text-xs text-sky-600 font-medium">
                          Ahorras {formatPrice(productSavings)}
                        </span>
                      )}
                    </div>

                    {/* Selector de cantidad */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-gray-500">Cantidad:</span>
                      <div className="flex items-center border border-gray-200 rounded bg-white">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(product, quantity - 1);
                          }}
                          disabled={quantity <= 1}
                          className="p-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                          {quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(product, quantity + 1);
                          }}
                          className="p-1.5 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner de Trade-In dentro del bundle (solo si ind_entre_estre === 1) */}
        {shouldShowTradeInBanner && (
          <div className="px-4 pb-4 pt-3 border-t border-gray-100">
            <TradeInCompletedSummary
              deviceName={tradeInData?.deviceName || bundleName}
              tradeInValue={tradeInData?.value || 0}
              onEdit={tradeInData?.completed ? (onRemoveTradeIn || undefined) : (onOpenTradeInModal || undefined)}
              isGuide={!tradeInData?.completed}
              shippingCity={shippingCity}
              showCanPickUpMessage={showCanPickUpMessage}
            />
          </div>
        )}
      </div>

      {/* Popups */}
      <BundleWarningPopup
        type="quantity"
        productName={productForQuantityChange?.name || items[0]?.name || "Producto"}
        currentQuantity={quantity}
        newQuantity={pendingQuantity ?? quantity}
        otherProductNames={otherProductNamesForQuantity}
        onConfirm={handleConfirmQuantity}
        onCancel={() => {
          setShowQuantityPopup(false);
          setPendingQuantity(null);
          setProductForQuantityChange(null);
        }}
        isOpen={showQuantityPopup}
      />

      <BundleWarningPopup
        type="remove"
        productName={productToRemove?.name || "Producto"}
        otherProductNames={otherProductNames}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setShowRemovePopup(false);
          setProductToRemove(null);
        }}
        isOpen={showRemovePopup}
      />
    </>
  );
}
