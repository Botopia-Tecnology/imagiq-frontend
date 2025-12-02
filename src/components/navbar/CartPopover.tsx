"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartContext } from "@/features/cart/CartContext";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { productEndpoints, type ProductApiData } from "@/lib/api";
import { CartBundleGroup } from "@/app/carrito/components/CartBundleGroup";
import { BundleWarningPopup } from "@/app/carrito/components/BundleWarningPopup";
import type { CartProduct, BundleInfo } from "@/hooks/useCart";

interface CartPopoverProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Cache para productos sugeridos
const CACHE_KEY_SUGGESTIONS = "cart_popover_suggestions";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface SuggestionsCache {
  products: ProductApiData[];
  timestamp: number;
}

function getCachedSuggestions(): ProductApiData[] | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY_SUGGESTIONS);
    if (!cached) return null;

    const data: SuggestionsCache = JSON.parse(cached);
    const now = Date.now();

    if (now - data.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY_SUGGESTIONS);
      return null;
    }

    return data.products;
  } catch {
    return null;
  }
}

function setCachedSuggestions(products: ProductApiData[]): void {
  if (typeof window === "undefined") return;

  try {
    const data: SuggestionsCache = {
      products,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEY_SUGGESTIONS, JSON.stringify(data));
  } catch {
    // Ignorar errores de storage
  }
}

export default function CartPopover({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: CartPopoverProps) {
  const {
    cart,
    updateQuantity,
    removeProduct,
    updateBundleQuantity,
    removeBundleProduct,
    formatPrice,
    isEmpty,
  } = useCartContext();

  const [suggestions, setSuggestions] = useState<ProductApiData[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Estados para popups de confirmación de bundles
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  const [pendingQuantityChange, setPendingQuantityChange] = useState<{
    codCampana: string;
    productSku: string;
    quantity: number;
    productName: string;
    otherNames: string[];
  } | null>(null);

  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [productToRemove, setProductToRemove] = useState<{
    sku: string;
    name: string;
    otherNames: string[];
  } | null>(null);

  // Agrupar productos por bundle (igual que Step1)
  const { bundleGroups, nonBundleProducts } = useMemo(() => {
    const groups = new Map<string, { bundleInfo: BundleInfo; items: CartProduct[] }>();
    const standalone: CartProduct[] = [];

    for (const product of cart) {
      if (product.bundleInfo) {
        const key = `${product.bundleInfo.codCampana}-${product.bundleInfo.productSku}`;
        if (!groups.has(key)) {
          groups.set(key, { bundleInfo: product.bundleInfo, items: [] });
        }
        groups.get(key)!.items.push(product);
      } else {
        standalone.push(product);
      }
    }

    return {
      bundleGroups: Array.from(groups.values()),
      nonBundleProducts: standalone,
    };
  }, [cart]);

  // Calcular totales
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Cargar sugerencias al abrir el popover
  useEffect(() => {
    if (!isOpen || isEmpty) return;

    // Intentar obtener del cache primero
    const cached = getCachedSuggestions();
    if (cached && cached.length > 0) {
      setSuggestions(cached.slice(0, 3)); // Máximo 3 sugerencias
      return;
    }

    // Si no hay cache, cargar desde API
    setIsLoadingSuggestions(true);

    productEndpoints
      .getFiltered({
        subcategoria: "Accesorios",
        limit: 10,
        sortBy: "precio",
        sortOrder: "desc",
      })
      .then((response) => {
        if (response.success && response.data?.products) {
          // Filtrar productos universales
          const universal = response.data.products.filter((p) =>
            "device" in p && p.device?.some((d) => d?.toLowerCase().trim() === "universal")
          ) as ProductApiData[];

          const topSuggestions = universal.slice(0, 3);
          setSuggestions(topSuggestions);
          setCachedSuggestions(universal);
        }
      })
      .catch((err) => {
        console.error("Error cargando sugerencias:", err);
      })
      .finally(() => {
        setIsLoadingSuggestions(false);
      });
  }, [isOpen, isEmpty]);

  // Handlers para bundles (con confirmación)
  const handleBundleQuantityChange = async (
    codCampana: string,
    productSku: string,
    quantity: number
  ) => {
    // Encontrar el bundle y sus productos
    const bundleGroup = bundleGroups.find(
      (g) => g.bundleInfo.codCampana === codCampana && g.bundleInfo.productSku === productSku
    );

    if (!bundleGroup) return;

    const currentQuantity = bundleGroup.items[0]?.quantity || 1;
    if (quantity === currentQuantity) return;

    // Preparar datos para el popup
    const productName = bundleGroup.items[0]?.name || "Producto";
    const otherNames = bundleGroup.items.slice(1).map((item) => item.name);

    setPendingQuantityChange({
      codCampana,
      productSku,
      quantity,
      productName,
      otherNames,
    });
    setShowQuantityPopup(true);
  };

  const handleConfirmQuantityChange = async () => {
    if (pendingQuantityChange) {
      await updateBundleQuantity(
        pendingQuantityChange.codCampana,
        pendingQuantityChange.productSku,
        pendingQuantityChange.quantity
      );
    }
    setShowQuantityPopup(false);
    setPendingQuantityChange(null);
  };

  const handleBundleRemove = async (sku: string, keepOtherProducts: boolean) => {
    // Encontrar el producto y su bundle
    const product = cart.find((p) => p.sku === sku);
    if (!product || !product.bundleInfo) return;

    const bundleGroup = bundleGroups.find(
      (g) =>
        g.bundleInfo.codCampana === product.bundleInfo!.codCampana &&
        g.bundleInfo.productSku === product.bundleInfo!.productSku
    );

    if (!bundleGroup) return;

    const otherNames = bundleGroup.items
      .filter((item) => item.sku !== sku)
      .map((item) => item.name);

    setProductToRemove({
      sku,
      name: product.name,
      otherNames,
    });
    setShowRemovePopup(true);
  };

  const handleConfirmRemove = async (keepOtherProducts?: boolean) => {
    if (productToRemove) {
      await removeBundleProduct(productToRemove.sku, keepOtherProducts ?? true);
    }
    setShowRemovePopup(false);
    setProductToRemove(null);
  };

  // Handlers para productos individuales (sin confirmación)
  const handleQuantityChange = (
    e: React.MouseEvent,
    productSku: string,
    newQuantity: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (newQuantity < 1) return;
    if (newQuantity > 5) return; // Límite máximo
    updateQuantity(productSku, newQuantity);
  };

  const handleRemove = (e: React.MouseEvent, productSku: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeProduct(productSku);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute right-0 top-full mt-2 w-[450px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 hidden md:block"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Tu carrito
            </h3>
          </div>

          {/* Content */}
          {isEmpty ? (
            <div className="px-6 py-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {/* Products List */}
              <div className="max-h-[400px] overflow-y-auto">
                <div className="px-6 py-4 space-y-4">
                  {/* Bundles agrupados */}
                  {bundleGroups.map((group) => (
                    <CartBundleGroup
                      key={`${group.bundleInfo.codCampana}-${group.bundleInfo.productSku}`}
                      bundleInfo={group.bundleInfo}
                      items={group.items}
                      onUpdateQuantity={handleBundleQuantityChange}
                      onRemoveProduct={handleBundleRemove}
                      formatPrice={formatPrice}
                    />
                  ))}

                  {/* Productos individuales (no bundle) */}
                  {nonBundleProducts.map((product) => (
                    <div
                      key={product.sku}
                      className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                    >
                      {/* Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={getCloudinaryUrl(product.image, "catalog")}
                          alt={product.name || "Producto"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </h4>

                        {/* Variant info */}
                        {(product.colorName || product.capacity) && (
                          <p className="text-xs text-gray-500 mb-2">
                            {product.colorName && <span>{product.colorName}</span>}
                            {product.colorName && product.capacity && " • "}
                            {product.capacity && <span>{product.capacity}</span>}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) =>
                                handleQuantityChange(
                                  e,
                                  product.sku,
                                  product.quantity - 1
                                )
                              }
                              disabled={product.quantity <= 1}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>

                            <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                              {product.quantity}
                            </span>

                            <button
                              onClick={(e) =>
                                handleQuantityChange(
                                  e,
                                  product.sku,
                                  product.quantity + 1
                                )
                              }
                              disabled={product.quantity >= 5}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="flex items-center justify-end gap-1 mb-0.5">
                                <span className="text-xs font-semibold text-green-600">
                                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(product.originalPrice * product.quantity)}
                                </span>
                              </div>
                            )}
                            <p className="text-sm font-bold text-gray-900">
                              {formatPrice(product.price * product.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => handleRemove(e, product.sku)}
                        className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions Section */}
              {suggestions.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    También te puede interesar
                  </h4>
                  <div className="space-y-2">
                    {suggestions.map((product) => (
                      <Link
                        key={product.sku[0]}
                        href={`/productos/viewpremium/${product.sku[0]}`}
                        className="flex gap-2 p-2 rounded-lg hover:bg-white transition-colors group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded overflow-hidden">
                          <Image
                            src={getCloudinaryUrl(
                              (typeof product.imagePreviewUrl === "string"
                                ? product.imagePreviewUrl
                                : product.imagePreviewUrl?.[0]) || "",
                              "catalog"
                            )}
                            alt={
                              (Array.isArray(product.modelo)
                                ? product.modelo[0]
                                : product.modelo) || "Producto sugerido"
                            }
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-900 font-medium line-clamp-1 group-hover:text-black">
                            {Array.isArray(product.modelo)
                              ? product.modelo[0]
                              : product.modelo}
                          </p>
                          <p className="text-xs font-bold text-gray-900">
                            {formatPrice(
                              Array.isArray(product.precioNormal)
                                ? product.precioNormal[0]
                                : product.precioNormal || 0
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
                {/* Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* CTA Button */}
                <Link
                  href="/carrito/step1"
                  onClick={onMouseLeave}
                  className="block w-full bg-black text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Ver carrito completo
                </Link>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Popups de confirmación para bundles */}
      {pendingQuantityChange && (
        <BundleWarningPopup
          type="quantity"
          productName={pendingQuantityChange.productName}
          currentQuantity={
            bundleGroups.find(
              (g) =>
                g.bundleInfo.codCampana === pendingQuantityChange.codCampana &&
                g.bundleInfo.productSku === pendingQuantityChange.productSku
            )?.items[0]?.quantity || 1
          }
          newQuantity={pendingQuantityChange.quantity}
          otherProductNames={pendingQuantityChange.otherNames}
          onConfirm={handleConfirmQuantityChange}
          onCancel={() => {
            setShowQuantityPopup(false);
            setPendingQuantityChange(null);
          }}
          isOpen={showQuantityPopup}
        />
      )}

      {productToRemove && (
        <BundleWarningPopup
          type="remove"
          productName={productToRemove.name}
          otherProductNames={productToRemove.otherNames}
          onConfirm={handleConfirmRemove}
          onCancel={() => {
            setShowRemovePopup(false);
            setProductToRemove(null);
          }}
          isOpen={showRemovePopup}
        />
      )}
    </AnimatePresence>
  );
}
