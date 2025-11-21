"use client";

import { Plus } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { productEndpoints, type ProductApiData } from "@/lib/api";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import type { CartProduct } from "@/hooks/useCart";

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
 * Verifica si un accesorio es universal (device = "Universal")
 */
function isUniversalAccessory(product: ProductApiData): boolean {
  const deviceValues = product.device || [];

  for (const device of deviceValues) {
    if (device && device.toLowerCase().trim() === "universal") {
      return true;
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
 * Extrae los modelos únicos de los productos del carrito
 */
function extractUniqueModelos(cartProducts: CartProduct[]): string[] {
  const modelos = new Set<string>();

  for (const product of cartProducts) {
    let modelo = product.modelo;

    if (!modelo || !modelo.trim()) {
      const sourceName = product.desDetallada || product.name || "";
      modelo = extractModeloFromName(sourceName);
    }

    if (modelo && modelo.trim()) {
      modelos.add(modelo.trim());
    }
  }

  return Array.from(modelos);
}

/**
 * Intenta extraer el modelo del nombre del producto
 */
function extractModeloFromName(name: string): string {
  if (!name) return "";

  const cleanName = name.replace(/^Samsung\s+/i, "").trim();

  const patterns = [
    /Galaxy\s+(?:S|A|Z)\d+\s*(?:Ultra|Plus|\+|FE|Pro|Lite)?/i,
    /Galaxy\s+M\d+\s*(?:Pro|Lite)?/i,
    /Galaxy\s+Tab\s*\w*\d*\s*(?:Ultra|Plus|\+|FE)?/i,
    /Galaxy\s+Watch\s*\d*\s*(?:Ultra|Classic|Active)?/i,
    /Galaxy\s+Buds\s*\d*\s*(?:Pro|Plus|\+|Live|FE)?/i,
    /Galaxy\s+Fit\s*\d*\s*(?:Pro|e)?/i,
    /Galaxy\s+Book\s*\d*\s*(?:Pro|Go|Flex|Ion|S)?/i,
    /Galaxy\s+(?:Z\s*)?(?:Fold|Flip)\s*\d*/i,
    /Galaxy\s+Ring/i,
    /Galaxy\s+\w+/i,
  ];

  for (const pattern of patterns) {
    const match = cleanName.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  const galaxyMatch = cleanName.match(/Galaxy\s+\S+/i);
  if (galaxyMatch) {
    return galaxyMatch[0].trim();
  }

  const words = cleanName
    .split(/\s+/)
    .filter(w => !(/^\d+GB$/i.test(w) || /^\d+TB$/i.test(w) || /^(Negro|Blanco|Azul|Verde|Morado|Gris|Plata|Dorado|Rosa|Crema|Grafito|Titanio)$/i.test(w)))
    .slice(0, 3);

  return words.join(" ");
}

/**
 * Normaliza un string para comparación fuzzy
 */
function normalizeForFuzzy(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

/**
 * Calcula un score de similitud entre dos strings
 */
function fuzzyMatchScore(modelo: string, device: string): number {
  if (!modelo || !device) return 0;

  const normalizedModelo = normalizeForFuzzy(modelo);
  const normalizedDevice = normalizeForFuzzy(device);

  if (normalizedModelo === normalizedDevice) return 1;
  if (normalizedDevice.includes(normalizedModelo)) return 0.9;
  if (normalizedModelo.includes(normalizedDevice)) return 0.85;

  const modeloTokens = normalizedModelo.split(" ").filter(t => t.length > 1);
  const deviceTokens = normalizedDevice.split(" ").filter(t => t.length > 1);

  if (modeloTokens.length === 0 || deviceTokens.length === 0) return 0;

  let matchCount = 0;
  for (const mt of modeloTokens) {
    for (const dt of deviceTokens) {
      if (mt === dt) {
        matchCount += 1;
        break;
      }
      if (mt.includes(dt) || dt.includes(mt)) {
        matchCount += 0.5;
        break;
      }
    }
  }

  const score = matchCount / Math.max(modeloTokens.length, deviceTokens.length);

  const seriesPattern = /(?:s|a|z|m)\d+/i;
  const modeloSeries = normalizedModelo.match(seriesPattern)?.[0];
  const deviceSeries = normalizedDevice.match(seriesPattern)?.[0];

  if (modeloSeries && deviceSeries && modeloSeries === deviceSeries) {
    return Math.min(1, score + 0.3);
  }

  return score;
}

/**
 * Verifica si un accesorio es compatible con alguno de los modelos del carrito
 */
function isAccessoryCompatible(
  accessory: ProductApiData,
  modelos: string[],
  minScore: number = 0.5
): { compatible: boolean; score: number } {
  const deviceValues = accessory.device || [];

  if (deviceValues.length === 0) {
    return { compatible: false, score: 0 };
  }

  let maxScore = 0;

  for (const modelo of modelos) {
    for (const device of deviceValues) {
      const score = fuzzyMatchScore(modelo, device);
      maxScore = Math.max(maxScore, score);

      if (maxScore >= 0.9) {
        return { compatible: true, score: maxScore };
      }
    }
  }

  return { compatible: maxScore >= minScore, score: maxScore };
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
function getCachedData(modelos: string[]): ProductApiData[] | null {
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
    const currentModelosSet = new Set(modelos);

    if (cachedModelosSet.size !== currentModelosSet.size) return null;
    for (const m of modelos) {
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
function setCacheData(modelos: string[], productos: ProductApiData[]): void {
  if (typeof window === "undefined") return;

  try {
    const data: CacheData = {
      modelos,
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
  const modelos = useMemo(() => {
    const extracted = extractUniqueModelos(cartProducts);
    if (process.env.NODE_ENV === 'development' && cartProducts.length > 0) {
      console.log('🛒 Sugerencias - cartProducts:', cartProducts.map(p => ({
        name: p.name,
        modelo: p.modelo,
        desDetallada: p.desDetallada,
      })));
      console.log('🔍 Sugerencias - modelos extraídos:', extracted);
    }
    return extracted;
  }, [cartProducts]);

  // SKUs de productos ya en el carrito (para no sugerirlos)
  const cartSkus = useMemo(() => new Set(cartProducts.map(p => p.sku)), [cartProducts]);

  // Limpiar caché cuando cambian los productos del carrito
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(CACHE_KEY);
    }
  }, [cartProducts.length]);

  const fetchAccessoriosRelacionados = useCallback(async () => {
    setLoading(true);

    try {
      const response = await productEndpoints.getFiltered({
        subcategoria: "Accesorios",
        limit: 100,
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
      const compatibleAccessories: Array<{ product: ProductApiData; score: number }> = [];
      const universalAccessories: ProductApiData[] = [];

      const cachedUniversal = getCachedUniversalData();

      for (const product of allProducts) {
        const sku = product.sku[0];
        if (seenSkus.has(sku) || cartSkus.has(sku)) continue;
        seenSkus.add(sku);

        if (!product.imagePreviewUrl?.[0] || product.imagePreviewUrl[0].trim() === '') continue;
        if (!hasStock(product)) continue;

        if (isUniversalAccessory(product)) {
          universalAccessories.push(product);
        } else if (modelos.length > 0) {
          const { compatible, score } = isAccessoryCompatible(product, modelos);
          if (compatible) {
            compatibleAccessories.push({ product, score });
          }
        }
      }

      compatibleAccessories.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const priceA = a.product.precioeccommerce?.[0] || a.product.precioNormal?.[0] || 0;
        const priceB = b.product.precioeccommerce?.[0] || b.product.precioNormal?.[0] || 0;
        return priceB - priceA;
      });

      const matchedProducts = compatibleAccessories.map(a => a.product).slice(0, 4);
      setSugerenciasCompatibles(matchedProducts);
      setCacheData(modelos, matchedProducts);

      const universalProducts = cachedUniversal || universalAccessories.slice(0, 4);
      setSugerenciasUniversales(universalProducts);
      if (!cachedUniversal) {
        setCacheUniversalData(universalProducts);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 Sugerencias:', {
          modelosBuscados: modelos,
          compatiblesEncontrados: matchedProducts.length,
          universalesEncontrados: universalProducts.length,
        });
      }

    } catch (error) {
      console.error("Error fetching accessories:", error);
      setSugerenciasCompatibles([]);
      setSugerenciasUniversales([]);
    } finally {
      setLoading(false);
    }
  }, [modelos, cartSkus]);

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
              <div className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                {producto.desDetallada[0] || producto.nombreMarket?.[0] || ''}
              </div>
              <div className="text-lg font-bold text-gray-900">
                $ {(producto.precioeccommerce[0] || producto.precioNormal[0]).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="rounded-2xl p-8 mt-8">
        <h2 className="font-bold text-xl mb-6">Agrega a tu compra</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  // No mostrar la sección si no hay sugerencias
  const hasCompatibles = sugerenciasCompatibles.length > 0;
  const hasUniversales = sugerenciasUniversales.length > 0;

  if (!hasCompatibles && !hasUniversales) {
    return null;
  }

  // Construir el título dinámico
  const titulo = modelos.length > 0
    ? `Agrega a tu compra para tu ${modelos[0]}`
    : "Agrega a tu compra";

  return (
    <section className="rounded-2xl p-8 mt-8">
      <h2 className="font-bold text-xl mb-6">{titulo}</h2>

      {/* Fila 1: Accesorios compatibles con el modelo */}
      {hasCompatibles && renderProductRow(sugerenciasCompatibles)}

      {/* Fila 2: Accesorios universales */}
      {hasUniversales && renderProductRow(sugerenciasUniversales)}
    </section>
  );
}
