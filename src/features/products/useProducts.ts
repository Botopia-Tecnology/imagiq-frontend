/**
 * Hooks para manejo de productos
 * - Obtener lista de productos con filtros
 * - Búsqueda de productos
 * - Obtener detalles de producto individual
 * - Manejo de favoritos
 * - Recomendaciones personalizadas
 * - Tracking de visualizaciones de productos
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  productEndpoints,
  ProductFilterParams,
  FavoriteFilterParams,
} from "@/lib/api";
import {
  mapApiProductsToFrontend,
  groupProductsByCategory,
} from "@/lib/productMapper";
import { ProductCardProps } from "@/app/productos/components/ProductCard";
import type { FrontendFilterParams } from "@/lib/sharedInterfaces";
import { productCache } from "@/lib/productCache";

type ProductFilters = FrontendFilterParams;


type UserInfo = {
  id?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  numero_documento?: string | null;
  rol?: number;
};

interface UseProductsReturn {
  products: ProductCardProps[];
  groupedProducts: Record<string, ProductCardProps[]>;
  loading: boolean;
  isLoadingMore: boolean; // Estado de carga para lazy loading (append)
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchProducts: (query: string, page?: number) => Promise<void>;
  filterProducts: (filters: ProductFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
  hasMore: boolean; // Hay más productos en la página actual (lazy scroll)
  hasMorePages: boolean; // Hay más páginas disponibles (paginación)
}
interface FavoriteFilters {
  page?: number;
  limit?: number;
}

interface UseFavoritesReturn {
  favorites: string[]; // solo ids
  favoritesAPI: ProductCardProps[]; // productos completos
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // acciones con ids
  addToFavorites: (
    id: string,

    guestUserData?: {
      id?:string,
      nombre: string;
      apellido: string;
      email: string;
      telefono: string;
    }
  ) => Promise<UserInfo | undefined>;
  removeFromFavorites: (id: string, guestUserData?: {
      id?:string,
      nombre: string;
      apellido: string;
      email: string;
      telefono: string;
    }) => Promise<void>;
  isFavorite: (id: string) => boolean;

  // acciones con API
  filterFavorites: (filters: FavoriteFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;

  hasMore: boolean;
}

export const useProducts = (
  initialFilters?: ProductFilters | (() => ProductFilters) | null
): UseProductsReturn => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<
    Record<string, ProductCardProps[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Estado separado para lazy loading
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<ProductFilters>(
    typeof initialFilters === "function"
      ? initialFilters()
      : initialFilters || {}
  );
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);
  const [lazyOffset, setLazyOffset] = useState(0);
  const [hasMoreInCurrentPage, setHasMoreInCurrentPage] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const lastUrlRef = useRef<string | null>(null);
  const productsRef = useRef<ProductCardProps[]>([]); // Ref para acceder a productos actuales sin causar re-renders
  const previousMenuUuidRef = useRef<string | undefined>(undefined);
  const previousSubmenuUuidRef = useRef<string | undefined>(undefined);

  // Función para convertir filtros del frontend a parámetros de API
  const convertFiltersToApiParams = useCallback(
    (filters: ProductFilters, offset?: number): ProductFilterParams => {
      const params: ProductFilterParams = {
        page: filters.page || currentPage,
        limit: filters.limit || 20,
        precioMin: 1, // Siempre filtrar productos con precio mayor a 0 por defecto
      };

      // Agregar parámetros de lazy loading si están definidos
      if (filters.lazyLimit !== undefined) {
        params.lazyLimit = filters.lazyLimit;
      }
      if (offset !== undefined) {
        params.lazyOffset = offset;
      } else if (filters.lazyOffset !== undefined) {
        params.lazyOffset = filters.lazyOffset;
      }

      // Aplicar filtros específicos (pueden sobrescribir el precioMin por defecto)
      if (filters.category) params.categoria = filters.category;
      if (filters.subcategory) params.subcategoria = filters.subcategory;
      if (filters.menuUuid) params.menuUuid = filters.menuUuid;
      if (filters.submenuUuid) params.submenuUuid = filters.submenuUuid;

      // Manejar filtros de precio usando precioMin/precioMax
      if (filters.precioMin !== undefined) {
        params.precioMin = filters.precioMin;
      }

      if (filters.precioMax !== undefined) {
        params.precioMax = filters.precioMax;
      }

      if (filters.color) params.color = filters.color;
      if (filters.capacity) params.capacidad = filters.capacity;
      if (filters.name) params.nombre = filters.name;
      if (filters.withDiscount !== undefined)
        params.conDescuento = filters.withDiscount;
      if (filters.minStock !== undefined) params.stockMinimo = filters.minStock;
      if (filters.descriptionKeyword) {
        // Usar el campo desDetallada para buscar en la descripción detallada
        params.desDetallada = filters.descriptionKeyword;
      }
      if (filters.model) params.modelo = filters.model;
      if (filters.filterMode) params.filterMode = filters.filterMode;

      // Añadir parámetros de ordenamiento
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;

      return params;
    },
    [currentPage]
  );

  // Función principal para obtener productos
  const fetchProducts = useCallback(
    async (filters: ProductFilters = {}, append = false, customOffset?: number) => {
      // Incrementar el ID de la petición para invalidar peticiones anteriores
      const currentRequestId = Date.now();
      setRequestId(currentRequestId);

      // Si no es append (carga inicial o cambio de filtros), resetear lazyOffset
      if (!append && customOffset === undefined) {
        setLazyOffset(0);
        setHasMoreInCurrentPage(true);
      }

      const apiParams = convertFiltersToApiParams(filters, customOffset);
      
      // Detectar cambios en menuUuid o submenuUuid para invalidación selectiva de caché
      const currentMenuUuid = apiParams.menuUuid;
      const currentSubmenuUuid = apiParams.submenuUuid;
      
      // Detectar cambios usando la misma lógica mejorada que usamos en el useEffect
      const menuUuidChangedForCache = 
        (previousMenuUuidRef.current === undefined) !== (currentMenuUuid === undefined) ||
        (previousMenuUuidRef.current !== undefined && currentMenuUuid !== undefined && previousMenuUuidRef.current !== currentMenuUuid);
      
      const submenuUuidChangedForCache = 
        (previousSubmenuUuidRef.current === undefined) !== (currentSubmenuUuid === undefined) ||
        (previousSubmenuUuidRef.current !== undefined && currentSubmenuUuid !== undefined && previousSubmenuUuidRef.current !== currentSubmenuUuid);
      
      if (!append && (menuUuidChangedForCache || submenuUuidChangedForCache)) {
        // Invalidar caché de combinaciones menu+submenu anteriores
        if (previousMenuUuidRef.current) {
          productCache.invalidatePattern((key) => {
            // Invalidar entradas que tengan el menuUuid anterior con cualquier submenuUuid
            const keyParams = productCache.parseCacheKey(key);
            if (!keyParams) return false;
            return keyParams.menuUuid === previousMenuUuidRef.current && 
                   keyParams.submenuUuid !== undefined;
          });
        }
        
        // Actualizar referencias
        previousMenuUuidRef.current = currentMenuUuid;
        previousSubmenuUuidRef.current = currentSubmenuUuid;
      }
      
      // Verificar caché solo para carga inicial (no para lazy loading)
      // El caché mejora la velocidad percibida al mostrar datos inmediatamente
      let hasCachedData = false;
      
      try {
        if (!append) {
          const cachedResponse = productCache.get(apiParams);
          if (cachedResponse && cachedResponse.success && cachedResponse.data) {
            hasCachedData = true;
            // Usar datos del caché inmediatamente para respuesta rápida (stale-while-revalidate)
            const apiData = cachedResponse.data;
            const mappedProducts = mapApiProductsToFrontend(apiData.products);
            
            // IMPORTANTE: Establecer todos los estados de forma síncrona
            // React batch automáticamente los setState en el mismo render,
            // pero establecer loading en false primero asegura que no se muestren skeletons
            setError(null);
            
            // Establecer productos y metadatos de forma síncrona
            setProducts(mappedProducts);
            productsRef.current = mappedProducts; // Actualizar ref
            setGroupedProducts(groupProductsByCategory(mappedProducts));
            setTotalItems(apiData.totalItems);
            setTotalPages(apiData.totalPages);
            setCurrentPage(apiData.currentPage);
            setHasNextPage(apiData.hasNextPage);
            setHasPreviousPage(apiData.hasPreviousPage);
            
            // Resetear estados
            if (!filters.lazyOffset && customOffset === undefined) {
              setLazyOffset(0);
              setHasMoreInCurrentPage(true);
            }
            
            // IMPORTANTE: Establecer loading en false AL FINAL para que React
            // actualice todos los estados juntos, evitando mostrar skeletons
            setLoading(false);
            
            // Si hay datos en caché, aún así hacer la llamada API en background
            // para actualizar datos frescos (stale-while-revalidate)
            // Pero NO limpiar productos ni mostrar loading
          } else {
            // No hay caché, mostrar loading normalmente
            // Limpiar productos para mostrar skeletons
            setLoading(true);
            setError(null);
            setProducts([]);
            productsRef.current = []; // Actualizar ref
          }
        } else {
          // Para lazy loading, mostrar loading normalmente
          setIsLoadingMore(true);
          setError(null);
        }

        // Construir URL de esta solicitud para decidir si abortamos la previa
        const sp = new URLSearchParams();
        (Object.entries(apiParams) as Array<[string, unknown]>).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            sp.append(key, String(value as string | number | boolean));
          }
        });
        const nextUrl = `/api/products/filtered?${sp.toString()}`;

        // Solo abortar si la solicitud anterior es para una URL DIFERENTE
        if (abortRef.current && lastUrlRef.current && lastUrlRef.current !== nextUrl) {
          abortRef.current.abort();
        }
        const controller = new AbortController();
        abortRef.current = controller;
        lastUrlRef.current = nextUrl;

        const response = await productEndpoints.getFiltered(apiParams, { signal: controller.signal });

        // Capturar el valor de hasCachedData para usar en el callback
        const wasCached = hasCachedData;

        // Verificar si esta petición sigue siendo válida comparando con el ID más reciente
        setRequestId((latestRequestId) => {
          // Si hay una petición más nueva, ignorar esta respuesta
          if (currentRequestId < latestRequestId) {
            return latestRequestId;
          }

          // Esta es la petición más reciente, procesar la respuesta
          if (response.success && response.data) {
            // Guardar en caché solo para carga inicial (no para lazy loading)
            // El lazy loading es incremental y no debería cacharse individualmente
            if (!append) {
              productCache.set(apiParams, response);
            }
            
            const apiData = response.data;
            const mappedProducts = mapApiProductsToFrontend(apiData.products);

            if (append) {
              setProducts((prev) => {
                // Crear un Set con los IDs existentes para evitar duplicados
                const existingIds = new Set(prev.map(p => p.id));
                // Filtrar solo los productos nuevos que no existen
                const newProducts = mappedProducts.filter(p => !existingIds.has(p.id));
                const updatedProducts = [...prev, ...newProducts];
                productsRef.current = updatedProducts; // Actualizar ref
                
                // Verificar si todavía hay más productos que cargar
                const lazyLimit = filters.lazyLimit || 6;
                const limit = filters.limit || 20;
                const currentOffset = customOffset !== undefined ? customOffset : (filters.lazyOffset || 0);
                const nextOffset = currentOffset + lazyLimit;
                
                // Si no hay productos nuevos o se alcanzó el límite, no hay más
                if (newProducts.length === 0 || nextOffset >= limit || (apiData.totalItems > 0 && nextOffset >= apiData.totalItems)) {
                  setHasMoreInCurrentPage(false);
                }
                
                return updatedProducts;
              });
            } else {
              // Solo actualizar productos si no había datos del caché o si los datos son diferentes
              // Esto evita "parpadeo" cuando los datos del caché ya están mostrados
              if (!wasCached) {
                setProducts(mappedProducts);
                productsRef.current = mappedProducts; // Actualizar ref
                setGroupedProducts(groupProductsByCategory(mappedProducts));
                // Resetear offset y estado cuando no es append
                if (!filters.lazyOffset && customOffset === undefined) {
                  setLazyOffset(0);
                  setHasMoreInCurrentPage(true);
                }
              } else {
                // Si había caché, solo actualizar si los datos son realmente diferentes
                // Comparar por cantidad de productos o IDs para evitar actualizaciones innecesarias
                setProducts((prev) => {
                  // Si los productos son diferentes, actualizar
                  const prevIds = new Set(prev.map(p => p.id));
                  const newIds = new Set(mappedProducts.map(p => p.id));
                  const areDifferent = 
                    prev.length !== mappedProducts.length ||
                    !Array.from(prevIds).every(id => newIds.has(id)) ||
                    !Array.from(newIds).every(id => prevIds.has(id));
                  
                  if (areDifferent) {
                    productsRef.current = mappedProducts; // Actualizar ref
                    return mappedProducts;
                  }
                  return prev; // Mantener productos actuales si son los mismos
                });
                
                // Siempre actualizar metadatos (totalItems, paginación, etc.)
                setGroupedProducts(groupProductsByCategory(mappedProducts));
                if (!filters.lazyOffset && customOffset === undefined) {
                  setLazyOffset(0);
                  setHasMoreInCurrentPage(true);
                }
              }
            }

            setTotalItems(apiData.totalItems);
            setTotalPages(apiData.totalPages);
            setCurrentPage(apiData.currentPage);
            setHasNextPage(apiData.hasNextPage);
            setHasPreviousPage(apiData.hasPreviousPage);
          } else {
            setError(response.message || "Error al cargar productos");
          }

          // Resetear el estado de carga correspondiente
          if (append) {
            setIsLoadingMore(false);
          } else {
            // Solo poner loading en false si no había caché (si había caché, ya se puso en false antes)
            if (!wasCached) {
              setLoading(false);
            }
          }
          return currentRequestId;
        });
      } catch (err) {
        // Ignorar aborts como errores visibles
        // @ts-expect-error 'name' puede existir si es AbortError
        if (err?.name === 'AbortError') {
          return;
        }
        console.error("Error fetching products:", err);
        setRequestId((latestRequestId) => {
          if (currentRequestId >= latestRequestId) {
            setError("Error de conexión al cargar productos");
            // Resetear el estado de carga correspondiente
            if (append) {
              setIsLoadingMore(false);
            } else {
              setLoading(false);
            }
            return currentRequestId;
          }
          return latestRequestId;
        });
      }
    },
    [convertFiltersToApiParams]
  );

  // Función para buscar productos
  const searchProducts = useCallback(
    async (query: string, page: number = 1) => {
      setLoading(true);
      setError(null);
      setCurrentSearchQuery(query);
      setCurrentPage(page);
      // Limpiar productos para mostrar skeletons
      setProducts([]);

      try {
        const searchParams = {
          precioMin: 1,
          page: page,
          limit: 15,
        };

        const response = await productEndpoints.search(query, searchParams);

        if (response.success && response.data) {
          const apiData = response.data;
          const mappedProducts = mapApiProductsToFrontend(apiData.products);

          setProducts(mappedProducts);
          setGroupedProducts(groupProductsByCategory(mappedProducts));
          setTotalItems(apiData.totalItems);
          setTotalPages(apiData.totalPages);
          setCurrentPage(apiData.currentPage);
          setHasNextPage(apiData.hasNextPage);
          setHasPreviousPage(apiData.hasPreviousPage);
        } else {
          setError(response.message || "Error al buscar productos");
        }
      } catch (err) {
        console.error("Error searching products:", err);
        setError("Error de conexión al buscar productos");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Función para filtrar productos
  const filterProducts = useCallback(
    async (filters: ProductFilters) => {
      setCurrentFilters(filters);
      // Solo resetear a página 1 si no se especifica una página en los filtros
      if (!filters.page) {
        setCurrentPage(1);
      }
      // Resetear offset y estado cuando se cambian filtros
      setLazyOffset(0);
      setHasMoreInCurrentPage(true);
      await fetchProducts(filters, false, 0);
    },
    [fetchProducts]
  );

  // Función para cargar más productos (paginación con lazy loading)
  const loadMore = useCallback(async () => {
    if (!loading && !isLoadingMore) {
      if (currentSearchQuery) {
        // Si estamos en modo búsqueda, usar paginación tradicional
        if (hasNextPage) {
          const nextPage = currentPage + 1;
          await searchProducts(currentSearchQuery, nextPage);
        }
      } else {
        // Si usamos lazy loading dentro de la página actual
        const lazyLimit = currentFilters.lazyLimit || 6;
        const limit = currentFilters.limit || 20;

        // Calcular el nuevo offset
        const newOffset = lazyOffset + lazyLimit;

        // Verificar tanto el límite de la página como el total de items disponibles
        // Si el nuevo offset alcanza el límite de la página actual O supera totalItems, DETENER
        // El usuario debe usar los botones de paginación para ir a la siguiente página
        if (newOffset < limit && (totalItems === 0 || newOffset < totalItems)) {
          // Continuar en la misma página con nuevo offset
          setLazyOffset(newOffset);
          await fetchProducts(currentFilters, true, newOffset);
        } else {
          // Ya no hay más productos en la página actual
          setHasMoreInCurrentPage(false);
        }
      }
    }
  }, [hasNextPage, loading, isLoadingMore, currentPage, currentSearchQuery, currentFilters, lazyOffset, totalItems, fetchProducts, searchProducts]);

  // Función para ir a una página específica
  const goToPage = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= totalPages && !loading) {
        if (currentSearchQuery) {
          // Si estamos en modo búsqueda, usar searchProducts
          await searchProducts(currentSearchQuery, page);
        } else {
          // Resetear offset y estado al cambiar de página manualmente
          setLazyOffset(0);
          setHasMoreInCurrentPage(true);
          const filtersWithPage = { ...currentFilters, page };
          setCurrentFilters(filtersWithPage);
          await fetchProducts(filtersWithPage, false, 0);
        }
      }
    },
    [totalPages, loading, currentSearchQuery, currentFilters, fetchProducts, searchProducts]
  );

  // Función para refrescar productos con filtros dinámicos
  const refreshProducts = useCallback(async () => {
    if (currentSearchQuery) {
      // Si estamos en modo búsqueda, refrescar la búsqueda actual
      await searchProducts(currentSearchQuery, currentPage);
    } else {
      // Resetear offset y estado al refrescar
      setLazyOffset(0);
      setHasMoreInCurrentPage(true);
      const filtersToUse =
        typeof initialFilters === "function" ? initialFilters() : currentFilters;
      
      // Invalidar caché para los filtros actuales para forzar actualización fresca
      const apiParams = convertFiltersToApiParams(filtersToUse, 0);
      productCache.invalidate(apiParams);
      
      await fetchProducts(filtersToUse, false, 0);
    }
  }, [initialFilters, currentFilters, currentSearchQuery, currentPage, fetchProducts, searchProducts, convertFiltersToApiParams]);

  // Cargar productos iniciales y cuando cambien los filtros
  useEffect(() => {
    // Si initialFilters es null, no hacer fetch inicial
    if (initialFilters === null) {
      return;
    }

    const filtersToUse =
      typeof initialFilters === "function"
        ? initialFilters()
        : initialFilters || {};

    // Detectar si cambian parámetros críticos (menuUuid, submenuUuid)
    const apiParams = convertFiltersToApiParams(filtersToUse);
    const currentMenuUuid = apiParams.menuUuid;
    const currentSubmenuUuid = apiParams.submenuUuid;
    
    // Detectar si seccion cambia a vacía (navegación a categoría base)
    // Cuando menuUuid y submenuUuid cambian a undefined, significa que navegamos de menu/submenu a categoría base
    // Esto es crítico porque necesitamos reemplazar los filtros completamente
    const seccionBecameEmpty = 
      previousMenuUuidRef.current !== undefined && 
      currentMenuUuid === undefined;
    
    // Detectar cambios críticos usando comparación estricta que maneja undefined correctamente
    // Necesitamos detectar cuando cambia de valor a undefined, o de undefined a valor, o entre valores diferentes
    const menuUuidChanged = 
      (previousMenuUuidRef.current === undefined) !== (currentMenuUuid === undefined) ||
      (previousMenuUuidRef.current !== undefined && currentMenuUuid !== undefined && previousMenuUuidRef.current !== currentMenuUuid);
    
    const submenuUuidChanged = 
      (previousSubmenuUuidRef.current === undefined) !== (currentSubmenuUuid === undefined) ||
      (previousSubmenuUuidRef.current !== undefined && currentSubmenuUuid !== undefined && previousSubmenuUuidRef.current !== currentSubmenuUuid);
    
    // Si seccion se vuelve vacía (navegación a categoría base), también es un cambio crítico
    const criticalParamsChanged = menuUuidChanged || submenuUuidChanged || seccionBecameEmpty;
    
    if (criticalParamsChanged) {
      // Reemplazar completamente los filtros cuando cambian parámetros críticos
      setCurrentFilters(filtersToUse);
    } else {
      // Para cambios menores (paginación, ordenamiento), hacer merge
      setCurrentFilters((prevFilters) => ({
        ...prevFilters,
        ...filtersToUse,
      }));
    }
    
    // Actualizar referencias siempre después de procesar
    // Esto asegura que la próxima vez detectemos cambios correctamente, incluso cuando cambia a undefined
    previousMenuUuidRef.current = currentMenuUuid;
    previousSubmenuUuidRef.current = currentSubmenuUuid;
    
    // Llamar fetchProducts - este verificará el caché internamente y mostrará datos inmediatamente si existen
    fetchProducts(filtersToUse, false);
  }, [initialFilters, fetchProducts, convertFiltersToApiParams]);

  return {
    products,
    groupedProducts,
    loading,
    isLoadingMore,
    error,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    searchProducts,
    filterProducts,
    loadMore,
    goToPage,
    refreshProducts,
    hasMore: hasMoreInCurrentPage, // Hay más productos en la página actual (para lazy scroll)
    hasMorePages: hasNextPage, // Hay más páginas (para paginación)
  };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<ProductCardProps | null>(null);
  const [loading, setLoading] = useState(true); // Cambiar a true inicialmente
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>(
    []
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const codigoMarketBase = productId;

        // Usar el endpoint específico para buscar por codigoMarketBase
        const response = await productEndpoints.getByCodigoMarket(codigoMarketBase);

        if (response.success && response.data) {
          const apiData = response.data;
          const mappedProducts = mapApiProductsToFrontend(apiData.products);

          if (mappedProducts.length > 0) {
            const foundProduct = mappedProducts[0]; // Tomar el primer producto encontrado
            setProduct(foundProduct);

            // Obtener productos relacionados (otros productos con el mismo modelo base)
            const modelBase =
              foundProduct.name.split(" ")[1] ||
              foundProduct.name.split(" ")[0];
            const related = mappedProducts
              .filter(
                (p) => p.name.includes(modelBase) && p.id !== foundProduct.id
              )
              .slice(0, 4);
            setRelatedProducts(related);
          } else {
            setError("Producto no encontrado");
          }
        } else {
          setError("Error al obtener datos del producto");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
      setError("ID de producto no válido");
    }
  }, [productId]);

  return {
    product,
    loading,
    error,
    relatedProducts,
  };
};

export const useFavorites = (userId?: string,
  initialFilters?: FavoriteFilters | (() => FavoriteFilters)
): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoritesAPI, setFavoritesAPI] = useState<ProductCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [currentFilters, setCurrentFilters] = useState<FavoriteFilters>(
    typeof initialFilters === "function"
      ? initialFilters()
      : initialFilters || {}
  );

  // Convertir filtros a API
  const convertFiltersToApiParams = useCallback(
    (filters: FavoriteFilters): FavoriteFilterParams => {
      return {
        page: filters.page || currentPage,
        limit: filters.limit || 12,
      };
    },
    [currentPage]
  );

  // Cargar favoritos desde localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("imagiq_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const fetchFavorites = useCallback(
    async (filters: FavoriteFilters = {}, append = false) => {
      if (userId) { //userInfo?.id
        setLoading(true);
        setError(null);
        try {
          const apiParams = convertFiltersToApiParams(filters);
      
          const response = await productEndpoints.getFavorites(
           userId, //userInfo?.id
            apiParams
          );

          if (response.success && response.data) {
           
            const apiData = response.data;
            const mapped = mapApiProductsToFrontend(apiData.products);

            if (append) {
              setFavoritesAPI((prev) => [...prev, ...mapped]);
            } else {
              setFavoritesAPI(mapped);
            }

            setTotalItems(apiData.totalItems);
            setTotalPages(apiData.totalPages);
            setCurrentPage(apiData.currentPage);
            setHasNextPage(apiData.hasNextPage);
            setHasPreviousPage(apiData.hasPreviousPage);
          } else {
            setError(response.message || "Error al cargar favoritos");
          }
        } catch (err) {
          console.error("Error fetching favorites:", err);
          setError("Error de conexión al cargar favoritos");
        } finally {
          setLoading(false);
        }
      }
    },
    [convertFiltersToApiParams, userId] //userInfo
  );
  // API: filtrar
  const filterFavorites = useCallback(
    async (filters: FavoriteFilters) => {
      setCurrentFilters(filters);
      if (!filters.page) setCurrentPage(1);
      await fetchFavorites(filters, false);
    },
    [fetchFavorites]
  );

  // API: load more
  const loadMore = useCallback(async () => {
    if (hasNextPage && !loading) {
      const nextPage = currentPage + 1;
      const filtersWithPage = { ...currentFilters, page: nextPage };
      setCurrentFilters(filtersWithPage);
      await fetchFavorites(filtersWithPage, true);
    }
  }, [hasNextPage, loading, currentPage, currentFilters, fetchFavorites]);

  // API: ir a página
  const goToPage = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= totalPages && !loading) {
        const filtersWithPage = { ...currentFilters, page };
        setCurrentFilters(filtersWithPage);
        await fetchFavorites(filtersWithPage, false);
      }
    },
    [totalPages, loading, currentFilters, fetchFavorites]
  );

  // API: refrescar
  const refreshFavorites = useCallback(async () => {
    await fetchFavorites(currentFilters, false);
  }, [currentFilters, fetchFavorites]);

  const addToFavorites = useCallback(
    async (
      productId: string,
      guestUserData?: {
        id?:string,
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
      }
    ) => {
     

      try {
        let payload;
     console.log('gess', guestUserData?.id)
        if (guestUserData?.id) {
          console.log('si tengo')
          // 2. Si ya tenemos el id guardado
          payload = {
            productSKU: productId,
            userInfo: {
              id: guestUserData.id,
            },
          };
        } else {
          // 3. Si no hay user guardado, enviar datos completos

          payload = {
            productSKU: productId,
            userInfo: guestUserData || {},
          };
        }

        // 4. Enviar petición al backend
        const response = await productEndpoints.addFavorite(payload);
       
        if (response.success) {
          setFavorites((prev) => {
            const newFavorites = [...prev, productId];
            localStorage.setItem(
              "imagiq_favorites",
              JSON.stringify(newFavorites)
            );
            return newFavorites;
          });
        }
        const userNombreFromResponse = response?.data?.userInfo?.nombre;
        console.log(response.data)
        // 5. Si recibes un id lo guardo en el local, para que no cree de nuevo un user
        if (userNombreFromResponse) {
          
          const newUserInfo = response.data.userInfo;
          localStorage.setItem("imagiq_user", JSON.stringify(newUserInfo));
          return newUserInfo;
        }
      } catch (err) {
        console.error("Error al agregar favorito en servidor", err);
      }
    },
    []
  );

  const removeFromFavorites = useCallback(
    async (productSKU: string, guestUserData?: {
        id?:string,
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
      }) => {
     
      try {
     
        if (guestUserData?.id) {
          const response = await productEndpoints.removeFavorite(
            guestUserData.id,
            productSKU
          );
          
          if (response.success) {
        
            setFavorites((prev) => {
              const newFavorites = prev.filter((id) => id !== productSKU);
              localStorage.setItem(
                "imagiq_favorites",
                JSON.stringify(newFavorites)
              );
              return newFavorites;
            });
          }
        }
      } catch (err) {
        console.error("Error al quitar favorito en servidor", err);
      }
    },
    []
  );

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.includes(productId);
    },
    [favorites]
  );

  useEffect(() => {
    if (userId) { //userInfo?.id
      const filtersToUse =
        typeof initialFilters === "function"
          ? initialFilters()
          : initialFilters || {};
      fetchFavorites(filtersToUse, false);
    }
  }, [initialFilters, fetchFavorites, userId]);

  return {
    favorites, // ids locales
    favoritesAPI, // productos desde API
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    filterFavorites,
    loadMore,
    goToPage,
    refreshFavorites,
    hasMore: hasNextPage,
  };
};

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<ProductCardProps[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const refreshRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      // Por ahora obtener productos con descuento como recomendaciones
      const response = await productEndpoints.getOffers();
      if (response.success && response.data) {
        const apiData = response.data;
        const mappedProducts = mapApiProductsToFrontend(apiData.products);
        setRecommendations(mappedProducts.slice(0, 8)); // Limitar a 8 recomendaciones
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRecommendations();
  }, [refreshRecommendations]);

  return {
    recommendations,
    loading,
    refreshRecommendations,
  };
};


