"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { productEndpoints, type ProductApiData, type ApiResponse, type ProductApiResponse } from "@/lib/api";
import type { CartProduct } from "@/hooks/useCart";
import { isBundle } from "@/lib/productMapper";
import SugerenciasSkeleton from "./components/SugerenciasSkeleton";
import SuggestionCard from "./components/SuggestionCard";

// Cache keys para sessionStorage
const CACHE_KEY = "sugerencias_accesorios_cache";
const CACHE_KEY_UNIVERSAL = "sugerencias_universales_cache";
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos

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
  "IT": ["universal_im"],
  "HA": ["universal_ha"],
  "AV": ["universal_av"],
  "TV": ["universal_tv", "universal_av"],
};

/**
 * Verifica si un accesorio es universal (device = "Universal" o "Universal_CATEGORIA")
 * y si corresponde a las categorías de productos en el carrito
 */
function isUniversalAccessory(
  product: ProductApiData,
  cartCategories: Set<string>
): boolean {
  const deviceValues = product.device || [];

  for (const device of deviceValues) {
    if (!device) continue;

    const normalizedDevice = device.toLowerCase().trim();

    if (normalizedDevice === "universal") {
      return true;
    }

    if (normalizedDevice.startsWith("universal_")) {
      if (cartCategories.size === 0) continue;

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

function getCachedUniversalData(): ProductApiData[] | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY_UNIVERSAL);
    if (!cached) return null;

    const data: UniversalCacheData = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY_UNIVERSAL);
      return null;
    }

    return data.productos;
  } catch {
    return null;
  }
}

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
 */
function extractUniqueModelos(cartProducts: CartProduct[]): { original: string; normalized: string }[] {
  const modelosMap = new Map<string, string>();

  for (const product of cartProducts) {
    const modelo = product.modelo;

    if (modelo && modelo.trim()) {
      const original = modelo.trim();
      const normalized = original.toLowerCase();

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

  const normalizedModelos = new Set(modelos.map(m => m.normalized));

  for (const device of deviceValues) {
    const normalizedDevice = normalizeForExactMatch(device);

    if (normalizedModelos.has(normalizedDevice)) {
      return true;
    }
  }

  return false;
}

function hasStock(product: ProductApiData): boolean {
  if (!product.stockTotal || product.stockTotal.length === 0) return false;

  const totalStock = product.stockTotal.reduce((sum: number, stock: number) => sum + (stock || 0), 0);
  return totalStock > 0;
}

function getCachedData(modelos: { original: string; normalized: string }[]): ProductApiData[] | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CacheData = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_DURATION) {
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
  cartProducts = [],
}: {
  cartProducts?: CartProduct[];
}) {
  const [sugerenciasCompatibles, setSugerenciasCompatibles] = useState<ProductApiData[]>([]);
  const [sugerenciasUniversales, setSugerenciasUniversales] = useState<ProductApiData[]>([]);
  const [loading, setLoading] = useState(true);

  // Use refs to prevent infinite loops
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);
  const lastFetchKeyRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Refs sincronizados con state para evitar stale closures en useCallback
  const sugerenciasCompatiblesRef = useRef<ProductApiData[]>([]);
  const sugerenciasUniversalesRef = useRef<ProductApiData[]>([]);

  // Extraer modelos únicos de los productos del carrito
  const modelosRaw = useMemo(() => extractUniqueModelos(cartProducts), [cartProducts]);
  const cartCategoriesRaw = useMemo(() => extractUniqueCategories(cartProducts), [cartProducts]);
  const cartSkusRaw = useMemo(() => new Set(cartProducts.map(p => p.sku)), [cartProducts]);

  // Create stable string keys for comparison
  const modelosKey = useMemo(() =>
    modelosRaw.map(m => m.normalized).sort().join(","),
    [modelosRaw]
  );

  const categoriesKey = useMemo(() =>
    Array.from(cartCategoriesRaw).sort().join(","),
    [cartCategoriesRaw]
  );

  const cartSkusKey = useMemo(() =>
    Array.from(cartSkusRaw).sort().join(","),
    [cartSkusRaw]
  );

  // Stable references: only change when actual content changes (not on every cartProducts reference change)
  // This prevents the fetch from being aborted when shipping info loads for each product
  const modelos = useMemo(() => modelosRaw, [modelosKey]);
  const cartCategories = useMemo(() => cartCategoriesRaw, [categoriesKey]);
  const cartSkus = useMemo(() => cartSkusRaw, [cartSkusKey]);

  // Create a stable fetch key that changes only when relevant data changes
  const fetchKey = useMemo(() =>
    `${modelosKey}|${categoriesKey}|${cartSkusKey}`,
    [modelosKey, categoriesKey, cartSkusKey]
  );

  // Mantener refs sincronizados con state (evita stale closures en useCallback)
  useEffect(() => { sugerenciasCompatiblesRef.current = sugerenciasCompatibles; }, [sugerenciasCompatibles]);
  useEffect(() => { sugerenciasUniversalesRef.current = sugerenciasUniversales; }, [sugerenciasUniversales]);

  const fetchAccessoriosRelacionados = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) return;

    // Check if we already fetched for this exact combination
    // Pero permitir re-fetch si no tenemos productos mostrados (usando refs para evitar stale closure)
    if (lastFetchKeyRef.current === fetchKey && hasFetchedRef.current) {
      if (sugerenciasCompatiblesRef.current.length === 0 && sugerenciasUniversalesRef.current.length === 0) {
        hasFetchedRef.current = false;
      } else {
        return;
      }
    }

    isFetchingRef.current = true;
    setLoading(true);

    // Crear AbortController para cancelar si el componente se desmonta o fetchKey cambia
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Obtener cache para usar como fallback, pero SIEMPRE intentar fetch fresco
    const cachedCompatibles = getCachedData(modelos);
    const cachedUniversal = getCachedUniversalData();

    // Si hay cache válido, mostrarlo inmediatamente mientras se hace el fetch fresco
    if (!hasFetchedRef.current) {
      if (cachedCompatibles) {
        setSugerenciasCompatibles(cachedCompatibles.filter((p: ProductApiData) => !cartSkus.has(p.sku[0])));
      }
      if (cachedUniversal) {
        setSugerenciasUniversales(cachedUniversal.filter((p: ProductApiData) => !cartSkus.has(p.sku[0])));
      }
      if (cachedCompatibles || cachedUniversal) {
        setLoading(false);
      }
    }

    // Retry logic: intentar hasta 3 veces
    const maxRetries = 3;
    const retryDelay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetchWithTimeout(
          productEndpoints.getFiltered({
            subcategoria: "Accesorios",
            limit: 50,
            sortBy: "precio",
            sortOrder: "desc",
          }),
          8000
        );

        // Si fue abortado, no actualizar state
        if (controller.signal.aborted) return;

        if (!response.success || !response.data?.products) {
          if (cachedCompatibles) {
            setSugerenciasCompatibles(cachedCompatibles.filter((p: ProductApiData) => !cartSkus.has(p.sku[0])));
          }
          if (cachedUniversal) {
            setSugerenciasUniversales(cachedUniversal.filter((p: ProductApiData) => !cartSkus.has(p.sku[0])));
          }
          if (cachedCompatibles || cachedUniversal) {
            setLoading(false);
            isFetchingRef.current = false;
            hasFetchedRef.current = true;
            lastFetchKeyRef.current = fetchKey;
            return;
          }
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
            if (controller.signal.aborted) return;
            continue;
          }
          const filteredCompatibles: ProductApiData[] = cachedCompatibles !== null
            ? (cachedCompatibles as ProductApiData[]).filter((p: ProductApiData) => !cartSkus.has(p.sku[0]))
            : [];
          const filteredUniversales: ProductApiData[] = cachedUniversal !== null
            ? (cachedUniversal as ProductApiData[]).filter((p: ProductApiData) => !cartSkus.has(p.sku[0]))
            : [];
          setSugerenciasCompatibles(filteredCompatibles);
          setSugerenciasUniversales(filteredUniversales);
          setLoading(false);
          isFetchingRef.current = false;
          hasFetchedRef.current = true;
          lastFetchKeyRef.current = fetchKey;
          return;
        }

        const allProducts = response.data.products;
        const seenSkus = new Set<string>();
        const compatibleAccessories: ProductApiData[] = [];
        const universalAccessories: ProductApiData[] = [];

        for (const item of allProducts) {
          if (isBundle(item)) continue;

          const product = item;
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

        const hasNewResults = compatibleAccessories.length > 0 || universalAccessories.length > 0;
        const hasExistingResults = sugerenciasCompatiblesRef.current.length > 0 || sugerenciasUniversalesRef.current.length > 0;

        // Solo actualizar state si hay resultados nuevos O si no teníamos nada antes
        if (hasNewResults || !hasExistingResults) {
          setSugerenciasCompatibles(compatibleAccessories);
          setSugerenciasUniversales(universalAccessories);
        }

        // Solo actualizar cache si hay resultados — no sobreescribir cache bueno con vacío
        if (compatibleAccessories.length > 0) {
          setCacheData(modelos, compatibleAccessories);
        }
        if (universalAccessories.length > 0) {
          setCacheUniversalData(universalAccessories);
        }

        setLoading(false);
        isFetchingRef.current = false;
        hasFetchedRef.current = true;
        lastFetchKeyRef.current = fetchKey;
        return;

      } catch (error) {
        console.warn(`Sugerencias: intento ${attempt}/${maxRetries} falló:`, error);

        if (attempt === maxRetries) {
          if (cachedCompatibles || cachedUniversal) {
            if (cachedCompatibles) {
              setSugerenciasCompatibles(cachedCompatibles.filter((p: ProductApiData) => !cartSkus.has(p.sku[0])));
            } else {
              setSugerenciasCompatibles([]);
            }
            if (cachedUniversal) {
              setSugerenciasUniversales(cachedUniversal.filter((p: ProductApiData) => !cartSkus.has(p.sku[0])));
            } else {
              setSugerenciasUniversales([]);
            }
          }
          setLoading(false);
          isFetchingRef.current = false;
          hasFetchedRef.current = true;
          lastFetchKeyRef.current = fetchKey;
          return;
        }

        // Esperar antes del siguiente intento (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        if (controller.signal.aborted) return;
      }
    }
  }, [modelos, cartSkus, cartCategories, fetchKey]);

  // Ref para la función fetch: permite que el useEffect siempre llame la versión más reciente
  // sin depender de la referencia del callback
  const fetchRef = useRef(fetchAccessoriosRelacionados);
  fetchRef.current = fetchAccessoriosRelacionados;

  // Solo depende de fetchKey (string estable) — NO del callback reference
  useEffect(() => {
    const keyChanged = lastFetchKeyRef.current !== fetchKey;

    // Marcar el fetchKey INMEDIATAMENTE para evitar que StrictMode re-ejecute con keyChanged=true
    // En StrictMode React hace: mount → cleanup → mount. Si no marcamos aquí,
    // el segundo mount ve keyChanged=true y aborta el fetch del primero.
    lastFetchKeyRef.current = fetchKey;

    if (keyChanged) {
      abortControllerRef.current?.abort();
      hasFetchedRef.current = false;
      isFetchingRef.current = false;
    }

    if (!isFetchingRef.current) {
      fetchRef.current();
    }

    // NO cleanup abort — React StrictMode re-monta el componente (mount → cleanup → mount).
    // Si abortamos en cleanup, el primer fetch se pierde. React ignora silenciosamente
    // setState en componentes desmontados, así que no hay memory leak.
  }, [fetchKey]);

  const renderProductRow = (productos: ProductApiData[]) => (
    <div className="mb-6 last:mb-0">
      <div className="flex gap-4 overflow-x-auto pt-3 pb-2 snap-x snap-mandatory pl-6 md:pl-0 md:pt-0 md:overflow-x-visible md:flex-wrap md:justify-start md:gap-4 scrollbar-hide">
        {productos.map((producto, idx) => (
          <SuggestionCard key={producto.sku[0] || idx} product={producto} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <SugerenciasSkeleton />;
  }

  const hasCompatibles = sugerenciasCompatibles.length > 0;
  const hasUniversales = sugerenciasUniversales.length > 0;

  if (!hasCompatibles && !hasUniversales) {
    return null;
  }

  const titulo = modelos.length > 0
    ? `Agrega a tu compra para tu ${modelos[0].original}`
    : "Agrega a tu compra";

  return (
    <section className="rounded-2xl py-3 md:p-6">
      <h2 className="font-bold text-lg mb-2 md:mb-4 px-6 md:px-0">{titulo}</h2>

      {hasCompatibles && renderProductRow(sugerenciasCompatibles)}

      {hasUniversales && renderProductRow(sugerenciasUniversales)}
    </section>
  );
}

const fetchWithTimeout = async (
  promise: Promise<ApiResponse<ProductApiResponse>>,
  timeoutMs: number
): Promise<ApiResponse<ProductApiResponse>> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  return Promise.race([promise, timeout]);
};
