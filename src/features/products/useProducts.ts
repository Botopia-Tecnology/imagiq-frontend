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

import { useState, useEffect, useCallback } from 'react';
import { productEndpoints, ProductFilterParams, ProductApiResponse } from '@/lib/api';
import { mapApiProductsToFrontend, groupProductsByCategory } from '@/lib/productMapper';
import { ProductCardProps } from '@/app/productos/components/ProductCard';

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
  refreshProducts: () => Promise<void>;
  hasMore: boolean;
}

export const useProducts = (initialFilters?: ProductFilters | (() => ProductFilters)): UseProductsReturn => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<Record<string, ProductCardProps[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<ProductFilters>(
    typeof initialFilters === 'function' ? initialFilters() : (initialFilters || {})
  );

  // Función para convertir filtros del frontend a parámetros de API
  const convertFiltersToApiParams = (filters: ProductFilters): ProductFilterParams => {
    const params: ProductFilterParams = {
      page: currentPage,
      limit: 50,
    };

    if (filters.category) params.categoria = filters.category;
    if (filters.subcategory) params.subcategoria = filters.subcategory;
    if (filters.priceRange?.min) params.precioMin = filters.priceRange.min;
    if (filters.priceRange?.max) params.precioMax = filters.priceRange.max;
    if (filters.color) params.color = filters.color;
    if (filters.capacity) params.capacidad = filters.capacity;
    if (filters.name) params.nombre = filters.name;
    if (filters.withDiscount !== undefined) params.conDescuento = filters.withDiscount;
    if (filters.minStock !== undefined) params.stockMinimo = filters.minStock;
    if (filters.descriptionKeyword) {
      // Usar el campo desDetallada para buscar en la descripción detallada
      params.desDetallada = filters.descriptionKeyword;
    }

    return params;
  };

  // Función principal para obtener productos
  const fetchProducts = useCallback(async (filters: ProductFilters = {}, append = false) => {
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
          setProducts(prev => [...prev, ...mappedProducts]);
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
        setError(response.message || 'Error al cargar productos');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error de conexión al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Función para buscar productos
  const searchProducts = useCallback(async (query: string) => {
    const filters = { ...currentFilters, name: query };
    setCurrentFilters(filters);
    setCurrentPage(1);
    await fetchProducts(filters, false);
  }, [currentFilters, fetchProducts]);

  // Función para filtrar productos
  const filterProducts = useCallback(async (filters: ProductFilters) => {
    setCurrentFilters(filters);
    setCurrentPage(1);
    await fetchProducts(filters, false);
  }, [fetchProducts]);

  // Función para cargar más productos (paginación)
  const loadMore = useCallback(async () => {
    if (hasNextPage && !loading) {
      setCurrentPage(prev => prev + 1);
      await fetchProducts(currentFilters, true);
    }
  }, [hasNextPage, loading, currentFilters, fetchProducts]);

  // Función para refrescar productos con filtros dinámicos
  const refreshProducts = useCallback(async () => {
    const filtersToUse = typeof initialFilters === 'function' ? initialFilters() : currentFilters;
    await fetchProducts(filtersToUse, false);
  }, [initialFilters, currentFilters, fetchProducts]);

  // Cargar productos iniciales y cuando cambien los filtros
  useEffect(() => {
    const filtersToUse = typeof initialFilters === 'function' ? initialFilters() : (initialFilters || {});
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
    refreshProducts,
    hasMore: hasNextPage,
  };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<ProductCardProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`🔍 Buscando producto con ID: ${productId}`);
        // Buscar producto por ID en todos los productos
        const response = await productEndpoints.getAll();
        if (response.success && response.data) {
          const apiData = response.data as ProductApiResponse;
          const mappedProducts = mapApiProductsToFrontend(apiData.products);
          
          console.log(`📦 Total de productos mapeados: ${mappedProducts.length}`);
          console.log(`🔍 IDs de productos disponibles:`, mappedProducts.map(p => p.id).slice(0, 10));
          
          const foundProduct = mappedProducts.find(p => p.id === productId);
          
          if (foundProduct) {
            console.log(`✅ Producto encontrado:`, foundProduct);
            setProduct(foundProduct);
            // Obtener productos relacionados (mismo modelo, diferentes colores)
            const related = mappedProducts.filter(p => 
              p.name.includes(foundProduct.name.split(' ')[1]) && p.id !== productId
            ).slice(0, 4);
            setRelatedProducts(related);
          } else {
            console.log(`❌ Producto no encontrado con ID: ${productId}`);
            console.log(`🔍 Buscando productos similares...`);
            
            // Buscar por codigoMarket (ahora el ID es el codigoMarket directamente)
            const similarProducts = mappedProducts.filter(p => 
              p.id === productId || p.id.includes(productId.split('/')[0]) // Buscar por código base
            );
            console.log(`🔍 Productos similares encontrados:`, similarProducts.map(p => p.id));
            
            // Si encontramos productos similares, usar el primero como fallback
            if (similarProducts.length > 0) {
              console.log(`🔄 Usando producto similar como fallback:`, similarProducts[0].id);
              setProduct(similarProducts[0]);
              setRelatedProducts(similarProducts.slice(1, 5));
            } else {
              setError('Producto no encontrado');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return {
    product,
    loading,
    error,
    relatedProducts,
  };
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar favoritos desde localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('imagiq_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addToFavorites = useCallback((productId: string) => {
    setFavorites(prev => {
      const newFavorites = [...prev, productId];
      localStorage.setItem('imagiq_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== productId);
      localStorage.setItem('imagiq_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading,
  };
};

export const useRecommendations = (userId?: string) => {
  const [recommendations, setRecommendations] = useState<ProductCardProps[]>([]);
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
      console.error('Error fetching recommendations:', err);
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
