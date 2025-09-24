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
  precioMin?: number;
  precioMax?: number;
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

  const [currentFilters, setCurrentFilters] = useState<ProductFilters>(
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

  // // Cargar favoritos desde localStorage
  // useEffect(() => {
  //   const savedFavorites = localStorage.getItem("imagiq_favorites");
  //   if (savedFavorites) {
  //     setFavorites(JSON.parse(savedFavorites));
  //   }
  // }, []);

  // Obtener favoritos desde API
  const rawUser = localStorage.getItem("imagiq_user");
  let userInfo = rawUser ? JSON.parse(rawUser) : null;

  const fetchFavorites = useCallback(
    async (filters: FavoriteFilters = {}, append = false) => {
      if (userInfo && userInfo.userId) {
        setLoading(true);
        setError(null);
        try {
          const apiParams = convertFiltersToApiParams(filters);
          const response = await productEndpoints.getFavorites(
            userInfo.userId,
            apiParams
          );

          if (response.success && response.data) {
            console.log(response);
            const apiData = response.data as FavoriteApiResponse;
            const mapped = mapApiProductsToFrontend(apiData.products);

            const newFavoriteIds = mapped
              .map((product) => product.id)
             
            console.log(newFavoriteIds);
            setFavorites(newFavoriteIds);
            localStorage.setItem(
              "imagiq_favorites",
              JSON.stringify(newFavoriteIds)
            );

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
    [convertFiltersToApiParams]
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

  const addToFavorites = useCallback(async (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = [...prev, productId];
      localStorage.setItem("imagiq_favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });

    try {
      const rawUser = localStorage.getItem("imagiq_user");
      let userInfo = rawUser ? JSON.parse(rawUser) : null;

      let payload;

      if (userInfo && userInfo.userId) {
        // 2. Si ya tenemos el userId guardado
        payload = {
          productSKU: productId,
          userInfo: {
            userId: userInfo.userId,
          },
        };
      } else {
        // 3. Si no hay user guardado, enviar datos completos
        const guestUserData = {
          nombre: "Jennyfer6",
          apellido: "B",
          email: "correo6@ejemplo.com",
          telefono: "123456789",
        };

        payload = {
          productSKU: productId,
          userInfo: guestUserData,
        };
      }

      // 4. Enviar petición al backend
      const response = await productEndpoints.addFavorite(payload);
      // 5. Si recibes un userId lo guardo en el local, para que no cree de nuevo un user
      if (response?.data?.usuario_id && (!userInfo || !userInfo.userId)) {
        console.log(response.data);
        localStorage.setItem(
          "imagiq_user",
          JSON.stringify({ userId: response.data.usuario_id })
        );
      }
    } catch (err) {
      console.error("Error al agregar favorito en servidor", err);
    }
  }, []);

  const removeFromFavorites = useCallback(async (productSKU: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== productSKU);
      localStorage.setItem("imagiq_favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
    const rawUser = localStorage.getItem("imagiq_user");
    let userInfo = rawUser ? JSON.parse(rawUser) : null;
    try {
      if (userInfo && userInfo.userId) {
        await productEndpoints.removeFavorite(userInfo.userId, productSKU);
      }
    } catch (err) {
      console.error("Error al quitar favorito en servidor", err);
    }
  }, []);

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.includes(productId);
    },
    [favorites]
  );

  useEffect(() => {
    const filtersToUse =
      typeof initialFilters === "function"
        ? initialFilters()
        : initialFilters || {};
    fetchFavorites(filtersToUse, false);
  }, [initialFilters, fetchFavorites]);

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
