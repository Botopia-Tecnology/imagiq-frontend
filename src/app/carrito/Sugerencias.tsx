"use client";

import { Plus } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { productEndpoints, type ProductApiData } from "@/lib/api";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import type { CartProduct } from "@/hooks/useCart";
import { isBundle } from "@/lib/productMapper";
import SugerenciasSkeleton from "./components/SugerenciasSkeleton";

// Cache keys para sessionStorage
const CACHE_KEY = "sugerencias_accesorios_cache";
const CACHE_KEY_UNIVERSAL = "sugerencias_universales_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CacheData {
  modelos: string[];
  productos: ProductApiData[];
  timestamp: number;
}

interface UniversalCacheData {
  productos: ProductApiData[];
  timestamp: number;
}

/**
 * Mapeo de categorías a sufijos de Universal
 * IM = Imagiq (dispositivos móviles), HA = Home Appliances (electrodomésticos), AV = Audio/Video
 */
const CATEGORY_TO_UNIVERSAL_MAP: Record<string, string[]> = {
  "IM": ["universal_im"],
  "IT": ["universal_im"], // Dispositivos móviles también pueden ser IT
  "HA": ["universal_ha"],
  "AV": ["universal_av"],
  "TV": ["universal_tv", "universal_av"],
};

/**
 * Verifica si un accesorio es universal (device = "Universal" o "Universal_CATEGORIA")
 * y si corresponde a las categorías de productos en el carrito
 * Ejemplos: "Universal", "Universal_IM", "Universal_TV", "Universal_Audio"
 */
function isUniversalAccessory(
  product: ProductApiData,
  cartCategories: Set<string>
): boolean {
  const deviceValues = product.device || [];

  for (const device of deviceValues) {
    if (!device) continue;

    const normalizedDevice = device.toLowerCase().trim();

    // Si es exactamente "universal" sin sufijo, es compatible con todas las categorías
    if (normalizedDevice === "universal") {
      return true;
    }

    // Si empieza con "universal_", verificar que el sufijo coincida con alguna categoría del carrito
    if (normalizedDevice.startsWith("universal_")) {
      // Si no hay categorías en el carrito, no mostrar accesorios con sufijo específico
      if (cartCategories.size === 0) continue;

      // Verificar si alguna categoría del carrito coincide con el sufijo del universal
      for (const category of cartCategories) {
        const validSuffixes = CATEGORY_TO_UNIVERSAL_MAP[category.toUpperCase()] || [];
        if (validSuffixes.some(suffix => normalizedDevice === suffix)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Obtiene accesorios universales del caché
 */
function getCachedUniversalData(): ProductApiData[] | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY_UNIVERSAL);
    if (!cached) return null;

    const data: UniversalCacheData = JSON.parse(cached);
    const now = Date.now();

    if (now - data.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY_UNIVERSAL);
      return null;
    }

    return data.productos;
  } catch {
    return null;
  }
}

/**
 * Guarda accesorios universales en caché
 */
function setCacheUniversalData(productos: ProductApiData[]): void {
  if (typeof window === "undefined") return;

  try {
    const data: UniversalCacheData = {
      productos,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEY_UNIVERSAL, JSON.stringify(data));
  } catch {
    // Ignorar errores de storage
  }
}

/**
 * Extrae las categorías únicas de los productos del carrito
 */
function extractUniqueCategories(cartProducts: CartProduct[]): Set<string> {
  const categories = new Set<string>();

  for (const product of cartProducts) {
    if (product.categoria && product.categoria.trim()) {
      categories.add(product.categoria.trim());
    }
  }

  return categories;
}

/**
 * Extrae los modelos únicos de los productos del carrito
 * SOLO usa el campo modelo directo, sin intentar extraerlo del nombre
 * Retorna objetos con el modelo original (para display) y normalizado (para comparación)
 */
function extractUniqueModelos(cartProducts: CartProduct[]): { original: string; normalized: string }[] {
  const modelosMap = new Map<string, string>(); // normalized -> original

  for (const product of cartProducts) {
    const modelo = product.modelo;

    // Solo agregar si hay un modelo válido
    if (modelo && modelo.trim()) {
      const original = modelo.trim();
      const normalized = original.toLowerCase();

      // Guardar el primer modelo original encontrado para cada normalizado
      if (!modelosMap.has(normalized)) {
        modelosMap.set(normalized, original);
      }
    }
  }

  return Array.from(modelosMap.entries()).map(([normalized, original]) => ({
    original,
    normalized,
  }));
}

/**
 * Normaliza un string para comparación exacta
 * - Convierte a minúsculas
 * - Elimina espacios extra
 * - Trim
 */
function normalizeForExactMatch(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Verifica si un accesorio es compatible con alguno de los modelos del carrito
 * usando MATCH EXACTO (case-insensitive)
 */
function isAccessoryCompatible(
  accessory: ProductApiData,
  modelos: { original: string; normalized: string }[]
): boolean {
  const deviceValues = accessory.device || [];

  if (deviceValues.length === 0 || modelos.length === 0) {
    return false;
  }

  // Set de modelos normalizados del carrito
  const normalizedModelos = new Set(modelos.map(m => m.normalized));

  // Buscar match exacto entre device del accesorio y modelo del carrito
  for (const device of deviceValues) {
    const normalizedDevice = normalizeForExactMatch(device);

    if (normalizedModelos.has(normalizedDevice)) {
      return true;
    }
  }

  return false;
}

/**
 * Verifica si un producto tiene stock disponible
 */
function hasStock(product: ProductApiData): boolean {
  if (!product.stockTotal || product.stockTotal.length === 0) return false;

  const totalStock = product.stockTotal.reduce((sum, stock) => sum + (stock || 0), 0);
  return totalStock > 0;
}

/**
 * Verifica si el caché es válido
 */
function getCachedData(modelos: { original: string; normalized: string }[]): ProductApiData[] | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CacheData = JSON.parse(cached);
    const now = Date.now();

    if (now - data.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    const cachedModelosSet = new Set(data.modelos);
    const currentModelosNormalized = modelos.map(m => m.normalized);

    if (cachedModelosSet.size !== currentModelosNormalized.length) return null;
    for (const m of currentModelosNormalized) {
      if (!cachedModelosSet.has(m)) return null;
    }

    return data.productos;
  } catch {
    return null;
  }
}

/**
 * Guarda datos en caché
 */
function setCacheData(modelos: { original: string; normalized: string }[], productos: ProductApiData[]): void {
  if (typeof window === "undefined") return;

  try {
    const data: CacheData = {
      modelos: modelos.map(m => m.normalized),
      productos,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignorar errores de storage
  }
}

export default function Sugerencias({
  onAdd,
  cartProducts = [],
}: {
  onAdd?: (producto: ProductApiData) => void;
  cartProducts?: CartProduct[];
}) {
  const [sugerenciasCompatibles, setSugerenciasCompatibles] = useState<ProductApiData[]>([]);
  const [sugerenciasUniversales, setSugerenciasUniversales] = useState<ProductApiData[]>([]);
  const [loading, setLoading] = useState(true);

  // Extraer modelos únicos de los productos del carrito
  const modelos = useMemo(() => extractUniqueModelos(cartProducts), [cartProducts]);

  // Extraer categorías únicas de los productos del carrito
  const cartCategories = useMemo(() => extractUniqueCategories(cartProducts), [cartProducts]);

  // SKUs de productos ya en el carrito (para no sugerirlos)
  const cartSkus = useMemo(() => new Set(cartProducts.map(p => p.sku)), [cartProducts]);

  // El cache se valida automáticamente en fetchAccessoriosRelacionados usando los modelos
  // No es necesario limpiarlo explícitamente al cambiar la longitud del carrito

  const fetchAccessoriosRelacionados = useCallback(async () => {
    // Intentar usar caché primero
    const cachedCompatibles = getCachedData(modelos);
    const cachedUniversal = getCachedUniversalData();

    // Si tenemos ambos caches válidos, usarlos directamente
    if (cachedCompatibles && cachedUniversal) {
      setSugerenciasCompatibles(cachedCompatibles.filter(p => !cartSkus.has(p.sku[0])));
      setSugerenciasUniversales(cachedUniversal.filter(p => !cartSkus.has(p.sku[0])));
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await productEndpoints.getFiltered({
        subcategoria: "Accesorios",
        limit: 50, // Reducido de 100 - solo necesitamos ~8 productos
        sortBy: "precio",
        sortOrder: "desc",
      });

      if (!response.success || !response.data?.products) {
        setSugerenciasCompatibles([]);
        setSugerenciasUniversales([]);
        return;
      }

      const allProducts = response.data.products;
      const seenSkus = new Set<string>();
      const compatibleAccessories: ProductApiData[] = [];
      const universalAccessories: ProductApiData[] = [];

      for (const item of allProducts) {
        // Filtrar bundles - solo procesar productos regulares
        if (isBundle(item)) continue;

        const product = item; // TypeScript ahora sabe que es ProductApiData
        const sku = product.sku[0];
        if (seenSkus.has(sku) || cartSkus.has(sku)) continue;
        seenSkus.add(sku);

        if (!product.imagePreviewUrl?.[0] || product.imagePreviewUrl[0].trim() === '') continue;
        if (!hasStock(product)) continue;

        if (isUniversalAccessory(product, cartCategories)) {
          if (universalAccessories.length < 4) universalAccessories.push(product);
        } else if (modelos.length > 0) {
          const isCompatible = isAccessoryCompatible(product, modelos);
          if (isCompatible && compatibleAccessories.length < 4) {
            compatibleAccessories.push(product);
          }
        }

        // Early exit si ya tenemos suficientes
        if (compatibleAccessories.length >= 4 && universalAccessories.length >= 4) break;
      }

      // Ordenar por precio (mayor primero)
      compatibleAccessories.sort((a, b) => {
        const priceA = a.precioeccommerce?.[0] || a.precioNormal?.[0] || 0;
        const priceB = b.precioeccommerce?.[0] || b.precioNormal?.[0] || 0;
        return priceB - priceA;
      });

      setSugerenciasCompatibles(compatibleAccessories);
      setCacheData(modelos, compatibleAccessories);

      setSugerenciasUniversales(universalAccessories);
      setCacheUniversalData(universalAccessories);

    } catch {
      setSugerenciasCompatibles([]);
      setSugerenciasUniversales([]);
    } finally {
      setLoading(false);
    }
  }, [modelos, cartSkus, cartCategories]);

  useEffect(() => {
    fetchAccessoriosRelacionados();
  }, [fetchAccessoriosRelacionados]);

  // Componente reutilizable para renderizar una fila de productos
  const renderProductRow = (productos: ProductApiData[]) => (
    <div className="mb-6 last:mb-0">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {productos.map((producto, idx) => (
          <div
            key={producto.sku[0] || idx}
            className="flex flex-col items-center w-full md:w-1/4 px-2"
          >
            <div className="relative w-28 h-28 mb-2 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-[#F4F4F4] flex items-center justify-center overflow-hidden">
                <Image
                  src={getCloudinaryUrl(producto.imagePreviewUrl[0], "catalog")}
                  alt={producto.desDetallada[0] || producto.nombreMarket?.[0] || ''}
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
              <button
                className="absolute -top-2 -right-2 bg-black text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-gray-800 transition cursor-pointer"
                aria-label={`Agregar ${producto.desDetallada[0] || producto.nombreMarket?.[0] || ''}`}
                onClick={() => onAdd?.(producto)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mt-2">
              <div className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                {producto.desDetallada[0] || producto.nombreMarket?.[0] || ''}
              </div>
              <div className="text-base font-bold text-gray-900">
                $ {(producto.precioeccommerce[0] || producto.precioNormal[0]).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <SugerenciasSkeleton />;
  }

  // No mostrar la sección si no hay sugerencias
  const hasCompatibles = sugerenciasCompatibles.length > 0;
  const hasUniversales = sugerenciasUniversales.length > 0;

  if (!hasCompatibles && !hasUniversales) {
    return null;
  }

  // Construir el título dinámico (usar el modelo original para display)
  const titulo = modelos.length > 0
    ? `Agrega a tu compra para tu ${modelos[0].original}`
    : "Agrega a tu compra";

  return (
    <section className="rounded-2xl p-6 mt-2">
      <h2 className="font-bold text-lg mb-4">{titulo}</h2>

      {/* Fila 1: Accesorios compatibles con el modelo */}
      {hasCompatibles && renderProductRow(sugerenciasCompatibles)}

      {/* Fila 2: Accesorios universales */}
      {hasUniversales && renderProductRow(sugerenciasUniversales)}
    </section>
  );
}
