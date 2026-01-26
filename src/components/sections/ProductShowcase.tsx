"use client";

import { useMemo, useState, useCallback } from "react";
import { useProducts } from "@/features/products/useProducts";
import { useFavorites } from "@/features/products/useProducts";
import ProductCard, { ProductCardProps } from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import GuestDataModal from "@/app/productos/components/GuestDataModal";

interface ProductShowcaseProps {
  initialProducts?: ProductCardProps[];
}

export default function ProductShowcase({ initialProducts }: ProductShowcaseProps = {}) {
  // Solo hacer fetch si NO hay datos iniciales del servidor
  const shouldFetch = !initialProducts || initialProducts.length === 0;

  const filters = useMemo(() =>
    shouldFetch ? {
      limit: 300, // Límite muy alto para asegurar que incluya todos los productos
      page: 1,
      minStock: 1,
    } : null,
  [shouldFetch]);

  const { products: apiProducts, loading: apiLoading } = useProducts(filters);

  // Usar productos iniciales si están disponibles, sino usar los de la API
  const allProducts = initialProducts && initialProducts.length > 0 ? initialProducts : apiProducts;
  const loading = initialProducts && initialProducts.length > 0 ? false : apiLoading;

  // Hook de favoritos
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Estados para el modal de invitado
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingFavorite, setPendingFavorite] = useState<string | null>(null);

  // Filtrar productos específicos para el showcase
  const products = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    // Función auxiliar para limpiar y parsear precios (robusta para cualquier formato)
    const parsePrice = (price: string | number | undefined): number => {
      if (typeof price === 'number') return price;
      if (!price) return 0;
      // Eliminar todo lo que no sea dígito (elimina $, puntos, comas, espacios)
      const cleanPrice = price.toString().replace(/\D/g, '');
      return parseFloat(cleanPrice || '0');
    };

    // Función auxiliar: verifica si un producto tiene un SKU que coincide
    const hasMatchingSKU = (product: ProductCardProps, skuPrefix: string): boolean => {
      const skuArray = product.apiProduct?.sku;
      if (!Array.isArray(skuArray)) return false;
      return skuArray.some(sku => sku?.includes(skuPrefix));
    };

    // 1. Encontrar el Watch 8 (Prioridad 1)
    const watch8 = allProducts.find(p =>
      hasMatchingSKU(p, 'SM-L500') ||
      hasMatchingSKU(p, 'SM-L320') ||
      (p.name && p.name.includes('Watch8'))
    );

    // 2. Encontrar los Celulares más caros (Premium)
    const phones = allProducts
      .filter(p => {
        const name = p.name ? p.name.toLowerCase() : '';
        const price = parsePrice(p.price);

        // Debe ser un Galaxy
        const isGalaxy = name.includes('galaxy');

        // FILTRO DE PRECIO: Solo productos de más de 2 Millones
        const isPremiumPrice = price > 2000000;

        // Exclusiones explícitas de accesorios y otros
        const isNotAccessory = !name.includes('funda') &&
          !name.includes('cover') &&
          !name.includes('cubierta') &&
          !name.includes('case') &&
          !name.includes('protector') &&
          !name.includes('cargador') &&
          !name.includes('adaptador') &&
          !name.includes('correa') &&
          !name.includes('fit') &&
          !name.includes('buds') &&
          !name.includes('watch');

        // No debe ser "Test"
        const isNotTest = !name.includes('test');

        return isGalaxy && isPremiumPrice && isNotAccessory && isNotTest;
      })
      .sort((a, b) => {
        // Ordenar por precio descendente
        return parsePrice(b.price) - parsePrice(a.price);
      });

    // Construir la lista final: Watch 8 + Top 3 Celulares Premium
    const finalProducts: ProductCardProps[] = [];

    if (watch8) {
      finalProducts.push(watch8);
    }

    // Rellenar con los teléfonos más caros encontrados
    const phonesNeeded = 4 - finalProducts.length;
    const uniquePhones = phones.filter(p => p.id !== watch8?.id);
    finalProducts.push(...uniquePhones.slice(0, phonesNeeded));

    // FALLBACK: Si aún faltan productos (algo falló con los filtros estrictos),
    // rellenar con cualquier cosa cara que no sea accesorio obvio
    if (finalProducts.length < 4) {
      const existingIds = new Set(finalProducts.map(p => p.id));
      const remainingNeeded = 4 - finalProducts.length;

      const fallbackProducts = allProducts
        .filter(p => !existingIds.has(p.id))
        .filter(p => {
          const name = p.name ? p.name.toLowerCase() : '';
          const price = parsePrice(p.price);
          return price > 500000 && // Precio decente
            !name.includes('funda') &&
            !name.includes('cover') &&
            !name.includes('tv') &&
            !name.includes('nevera');
        })
        .sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        .slice(0, remainingNeeded);

      finalProducts.push(...fallbackProducts);
    }

    return finalProducts.slice(0, 4);
  }, [allProducts]);

  // Manejar toggle de favoritos
  const handleToggleFavorite = useCallback(async (productId: string) => {
    // Verificar si el usuario está autenticado o tiene datos guardados
    const userData = localStorage.getItem("imagiq_user");
    const parsedUser = userData ? JSON.parse(userData) : null;

    // Si no hay usuario guardado, mostrar modal de invitado
    if (!parsedUser?.id) {
      setPendingFavorite(productId);
      setShowGuestModal(true);
      return;
    }

    // Si ya es favorito, remover
    if (isFavorite(productId)) {
      try {
        await removeFromFavorites(productId, parsedUser);
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      // Si no es favorito, agregar
      try {
        await addToFavorites(productId, parsedUser);
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  // Manejar envío del modal de invitado
  const handleGuestSubmit = useCallback(async (guestData: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    tipo_documento?: string;
    numero_documento?: string;
  }) => {
    if (!pendingFavorite) return;

    try {
      // addToFavorites filtrará automáticamente los campos no permitidos
      const userInfo = await addToFavorites(pendingFavorite, guestData);
      // Si recibimos información del usuario, guardarla (incluyendo tipo_documento y numero_documento si existen)
      if (userInfo) {
        // Mantener los campos de documento en localStorage aunque no se envíen al backend
        const userDataToSave = {
          ...userInfo,
          ...(guestData.tipo_documento && { tipo_documento: guestData.tipo_documento }),
          ...(guestData.numero_documento && { numero_documento: guestData.numero_documento }),
        };
        localStorage.setItem("imagiq_user", JSON.stringify(userDataToSave));
      }
      setShowGuestModal(false);
      setPendingFavorite(null);

    } catch (error) {
      console.error("Error handling guest favorite:", error);
      // Aquí podrías mostrar un error al usuario si lo deseas
    }
  }, [pendingFavorite, addToFavorites]);

  if (loading) {
    return (
      <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
        <div className="w-full" style={{ maxWidth: "1440px" }}>
          {/* Desktop: Grid 4 columnas */}
          <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full">
                <SkeletonCard />
              </div>
            ))}
          </div>

          {/* Mobile: Scroll horizontal */}
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-[25px] px-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shrink-0 w-[calc(100vw-32px)] sm:w-[280px]">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
      <div className="w-full" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas */}
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="shrink-0 w-[calc(100vw-32px)] sm:w-[280px]"
              >
                <ProductCard
                  {...product}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de datos de invitado */}
      {showGuestModal && (
        <GuestDataModal
          isOpen={showGuestModal}
          onClose={() => {
            setShowGuestModal(false);
            setPendingFavorite(null);
          }}
          onSubmit={handleGuestSubmit}
        />
      )}
    </section>
  );
}
