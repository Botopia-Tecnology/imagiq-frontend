import { productEndpoints, type ProductApiData } from "@/lib/api";

const CACHE_KEY_SUGGESTIONS = "cart_popover_suggestions";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface SuggestionsCache {
  products: ProductApiData[];
  timestamp: number;
}

/**
 * Precarga productos sugeridos para el popover del carrito
 * Esta función se ejecuta en background cuando se agrega un producto al carrito
 * para que las sugerencias ya estén disponibles cuando el usuario haga hover
 */
export async function preloadCartSuggestions(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // Verificar si ya hay datos en cache válidos
    const cached = sessionStorage.getItem(CACHE_KEY_SUGGESTIONS);
    if (cached) {
      const data: SuggestionsCache = JSON.parse(cached);
      const now = Date.now();

      // Si el cache es válido, no hacer nada
      if (now - data.timestamp < CACHE_DURATION) {
        return;
      }
    }

    // Hacer fetch de accesorios universales
    const response = await productEndpoints.getFiltered({
      subcategoria: "Accesorios",
      limit: 10,
      sortBy: "precio",
      sortOrder: "desc",
    });

    if (response.success && response.data?.products) {
      // Filtrar productos universales
      const universal = response.data.products.filter((p) =>
        "device" in p && p.device?.some((d) => d?.toLowerCase().trim() === "universal")
      ) as ProductApiData[];

      // Guardar en cache
      const cacheData: SuggestionsCache = {
        products: universal,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(CACHE_KEY_SUGGESTIONS, JSON.stringify(cacheData));
    }
  } catch (error) {
    // Fallar silenciosamente - las sugerencias no son críticas
    console.error("Error precargando sugerencias del carrito:", error);
  }
}
