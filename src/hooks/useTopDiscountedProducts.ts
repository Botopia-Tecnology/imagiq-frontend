/**
 * Hook para obtener los productos con mayor descuento
 * Organiza productos por subcategorías específicas con cantidades definidas
 */

import { useState, useEffect } from 'react';
import { productEndpoints } from '@/lib/api';
import { mapApiProductsToFrontend } from '@/lib/productMapper';
import type { ProductCardProps } from '@/app/productos/components/ProductCard';
import type { BaseApiFilters } from '@/lib/sharedInterfaces';

interface UseTopDiscountedProductsOptions {
  limit?: number;
  excludeSubcategories?: string[];
}

interface UseTopDiscountedProductsReturn {
  products: ProductCardProps[];
  loading: boolean;
  error: string | null;
}

// Configuración de subcategorías y cantidades deseadas
const SUBCATEGORY_CONFIG = [
  { name: 'Celulares', count: 4 },
  { name: 'Tablets', count: 1 },
  { name: 'Wearables', count: 1 },
  { name: 'Televisores', count: 2 },
  { name: 'Computadores', count: 1 },
  { name: 'Neveras', count: 1 },
  { name: 'Lavadoras', count: 1 },
] as const;

export function useTopDiscountedProducts(
  options: UseTopDiscountedProductsOptions = {}
): UseTopDiscountedProductsReturn {
  const { limit = 12 } = options;

  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTopDiscountedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Traer productos con descuento - NO incluir sortBy ni sortOrder
        const params: BaseApiFilters = {
          conDescuento: true,
          limit: 100,
          page: 1,
          precioMin: 1,
        };

        const response = await productEndpoints.getFiltered(params as never);

        if (!isMounted) return;

        if (response.success && response.data) {
          const mappedProducts = mapApiProductsToFrontend(response.data.products);

          // Filtrar productos que tengan imagen válida y no sean Accesorios
          const validProducts = mappedProducts.filter(product => {
            if (!product.apiProduct?.subcategoria) return false;
            if (product.apiProduct.subcategoria === 'Accesorios') return false;
            if (typeof product.image !== 'string' || !product.image) return false;
            return true;
          });

          // Calcular descuento para cada producto
          const productsWithDiscount = validProducts.map(product => {
            const originalPrice = Number.parseFloat(product.originalPrice || '0');
            const currentPrice = Number.parseFloat(product.price || '0');
            const discountPercentage = originalPrice > 0
              ? ((originalPrice - currentPrice) / originalPrice) * 100
              : 0;
            return { product, discountPercentage };
          });

          // Agrupar productos por subcategoría
          const productsBySubcategory = new Map<string, Array<{ product: ProductCardProps; discountPercentage: number }>>();

          for (const { product, discountPercentage } of productsWithDiscount) {
            const subcategory = product.apiProduct!.subcategoria;
            if (!productsBySubcategory.has(subcategory)) {
              productsBySubcategory.set(subcategory, []);
            }
            productsBySubcategory.get(subcategory)!.push({ product, discountPercentage });
          }

          // Ordenar productos dentro de cada subcategoría por descuento descendente
          for (const products of productsBySubcategory.values()) {
            products.sort((a, b) => b.discountPercentage - a.discountPercentage);
          }

          // Seleccionar productos según la configuración
          const selectedProducts: ProductCardProps[] = [];

          for (const { name, count } of SUBCATEGORY_CONFIG) {
            const categoryProducts = productsBySubcategory.get(name) || [];
            const productsToAdd = categoryProducts
              .slice(0, count)
              .map(item => item.product);
            selectedProducts.push(...productsToAdd);

            if (selectedProducts.length >= limit) {
              break;
            }
          }

          setProducts(selectedProducts.slice(0, limit));
        } else {
          setError(response.message || 'Error al cargar productos');
          setProducts([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching top discounted products:', err);
        setError('Error al cargar productos con descuento');
        setProducts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTopDiscountedProducts();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { products, loading, error };
}
