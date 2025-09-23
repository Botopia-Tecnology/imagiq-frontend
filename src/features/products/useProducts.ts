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

import { useState, useEffect, useCallback } from "react";
import {
  productEndpoints,
  ProductFilterParams,
  ProductApiResponse,
  decodeCodigoMarketFromUrl,
  FavoriteFilterParams,
  FavoriteApiResponse,
} from "@/lib/api";
import {
  mapApiProductsToFrontend,
  groupProductsByCategory,
} from "@/lib/productMapper";
import { ProductCardProps } from "@/app/productos/components/ProductCard";
import { useAuthContext } from "../auth/context";

interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceRange?: { min: number; max: number };
  color?: string;
  capacity?: string;
  name?: string;
  withDiscount?: boolean;
  minStock?: number;
  descriptionKeyword?: string; // Nuevo filtro para palabras clave en descripción
  page?: number; // Página actual para paginación
  limit?: number; // Límite de productos por página
}

interface UseProductsReturn {
  products: ProductCardProps[];
  groupedProducts: Record<string, ProductCardProps[]>;
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchProducts: (query: string) => Promise<void>;
  filterProducts: (filters: ProductFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
  hasMore: boolean;
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
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // acciones con API
  filterFavorites: (filters: FavoriteFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;

  hasMore: boolean;
}

export const useProducts = (
  initialFilters?: ProductFilters | (() => ProductFilters)
): UseProductsReturn => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<
    Record<string, ProductCardProps[]>
  >({});
  const [loading, setLoading] = useState(false);
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

  // Función para convertir filtros del frontend a parámetros de API
  const convertFiltersToApiParams = useCallback(
    (filters: ProductFilters): ProductFilterParams => {
      const params: ProductFilterParams = {
        page: filters.page || currentPage,
        limit: filters.limit || 50,
        precioMin: 1, // Siempre filtrar productos con precio mayor a 0 por defecto
      };

      // Aplicar filtros específicos (pueden sobrescribir el precioMin por defecto)
      if (filters.category) params.categoria = filters.category;
      if (filters.subcategory) params.subcategoria = filters.subcategory;
      if (filters.priceRange?.min) params.precioMin = filters.priceRange.min; // Sobrescribe el valor por defecto
      if (filters.priceRange?.max) params.precioMax = filters.priceRange.max;
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

      return params;
    },
    [currentPage]
  );

  // Función principal para obtener productos
  const fetchProducts = useCallback(
    async (filters: ProductFilters = {}, append = false) => {
      setLoading(true);
      setError(null);

      try {
        const apiParams = convertFiltersToApiParams(filters);
        console.log(`🌐 Parámetros de API enviados:`, apiParams);
        const response = await productEndpoints.getFiltered(apiParams);

        if (response.success && response.data) {
          const apiData = response.data as ProductApiResponse;
          const mappedProducts = mapApiProductsToFrontend(apiData.products);

          if (append) {
            setProducts((prev) => [...prev, ...mappedProducts]);
          } else {
            setProducts(mappedProducts);
            setGroupedProducts(groupProductsByCategory(mappedProducts));
          }

          setTotalItems(apiData.totalItems);
          setTotalPages(apiData.totalPages);
          setCurrentPage(apiData.currentPage);
          setHasNextPage(apiData.hasNextPage);
          setHasPreviousPage(apiData.hasPreviousPage);
        } else {
          setError(response.message || "Error al cargar productos");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error de conexión al cargar productos");
      } finally {
        setLoading(false);
      }
    },
    [convertFiltersToApiParams]
  );

  // Función para buscar productos
  const searchProducts = useCallback(
    async (query: string) => {
      const filters = { ...currentFilters, name: query };
      setCurrentFilters(filters);
      setCurrentPage(1);
      await fetchProducts(filters, false);
    },
    [currentFilters, fetchProducts]
  );

  // Función para filtrar productos
  const filterProducts = useCallback(
    async (filters: ProductFilters) => {
      setCurrentFilters(filters);
      // Solo resetear a página 1 si no se especifica una página en los filtros
      if (!filters.page) {
        setCurrentPage(1);
      }
      await fetchProducts(filters, false);
    },
    [fetchProducts]
  );

  // Función para cargar más productos (paginación)
  const loadMore = useCallback(async () => {
    if (hasNextPage && !loading) {
      setCurrentPage((prev) => prev + 1);
      await fetchProducts(currentFilters, true);
    }
  }, [hasNextPage, loading, currentFilters, fetchProducts]);

  // Función para ir a una página específica
  const goToPage = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= totalPages && !loading) {
        const filtersWithPage = { ...currentFilters, page };
        setCurrentFilters(filtersWithPage);
        await fetchProducts(filtersWithPage, false);
      }
    },
    [totalPages, loading, currentFilters, fetchProducts]
  );

  // Función para refrescar productos con filtros dinámicos
  const refreshProducts = useCallback(async () => {
    const filtersToUse =
      typeof initialFilters === "function" ? initialFilters() : currentFilters;
    await fetchProducts(filtersToUse, false);
  }, [initialFilters, currentFilters, fetchProducts]);

  // Cargar productos iniciales y cuando cambien los filtros
  useEffect(() => {
    const filtersToUse =
      typeof initialFilters === "function"
        ? initialFilters()
        : initialFilters || {};
    fetchProducts(filtersToUse, false);
  }, [initialFilters, fetchProducts]);

  return {
    products,
    groupedProducts,
    loading,
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
    hasMore: hasNextPage,
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
        // Decodificar el ID de la URL para obtener el codigoMarket real
        const codigoMarket = decodeCodigoMarketFromUrl(productId);

        // Usar el endpoint específico para buscar por codigoMarket
        const response = await productEndpoints.getByCodigoMarket(codigoMarket);

        if (response.success && response.data) {
          const apiData = response.data as ProductApiResponse;
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

export const useFavorites = (
  initialFilters: FavoriteFilters = { page: 1, limit: 12 }
): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const [favoritesAPI, setFavoritesAPI] = useState<ProductCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [currentFilters, setCurrentFilters] =
    useState<FavoriteFilters>(initialFilters);

  // Cargar favoritos desde localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("imagiq_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
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

  // Obtener favoritos desde API
  const fetchFavorites = useCallback(
    async (filters: FavoriteFilters = {}, append = false) => {
      if (!isAuthenticated) return; // solo si está logueado

      setLoading(true);
      setError(null);

      try {
        const apiParams = convertFiltersToApiParams(filters);
        const response = await productEndpoints.getFavorites(apiParams);

        if (response.success && response.data) {
          const apiData = response.data as FavoriteApiResponse;
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
    },
    [isAuthenticated, convertFiltersToApiParams]
  );

  const addToFavorites = useCallback((productId: string) => {
    setFavorites((prev) => {
      const newFavorites = [...prev, productId];
      localStorage.setItem("imagiq_favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });

    //Con API
    //  setFavorites(prev => {
    //   const updated = [...prev, productId];
    //   localStorage.setItem('imagiq_favorites', JSON.stringify(updated));
    //   return updated;
    // });

    // try {
    //   if (isAuthenticated) {
    //     await productEndpoints.addFavorite(productId); // POST /favorites/:id
    //   }
    // } catch (err) {
    //   console.error('Error al agregar favorito en servidor', err);
    // }
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== productId);
      localStorage.setItem("imagiq_favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
    //Con API
    //    setFavorites(prev => {
    //   const updated = prev.filter(id => id !== productId);
    //   localStorage.setItem('imagiq_favorites', JSON.stringify(updated));
    //   return updated;
    // });

    // try {
    //   if (isAuthenticated) {
    //     await productEndpoints.removeFavorite(productId); // DELETE /favorites/:id
    //   }
    // } catch (err) {
    //   console.error('Error al quitar favorito en servidor', err);
    // }
  }, []);

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.includes(productId);
    },
    [favorites]
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

    // Inicial
  // useEffect(() => {
  //   fetchFavorites(initialFilters, false);
  // }, [initialFilters, fetchFavorites]);

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
        const apiData = response.data as ProductApiResponse;
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
