/**
 * 📱 PRODUCT SHOWCASE - 4 Product Cards
 *
 * Muestra Z Fold 7, Z Flip 7, S25 Ultra y Watch 8
 * Productos específicos con búsqueda por SKU
 */

"use client";

import { useMemo, useState, useCallback } from "react";
import { useProducts } from "@/features/products/useProducts";
import { useFavorites } from "@/features/products/useProducts";
import ProductCard, { ProductCardProps } from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import GuestDataModal from "@/app/productos/components/GuestDataModal";

export default function ProductShowcase() {
  // Obtener productos con límite amplio que incluya diferentes categorías
  const filters = useMemo(() => ({
    limit: 300, // Límite muy alto para asegurar que incluya todos los productos
    page: 1,
    minStock: 1,
  }), []);

  const { products: allProducts, loading } = useProducts(filters);
  
  // Hook de favoritos
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Estados para el modal de invitado
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingFavorite, setPendingFavorite] = useState<string | null>(null);

  // Filtrar productos específicos: Z Fold 7, Z Flip 7, S25 Ultra, Watch 8
  const products = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    // Función auxiliar: verifica si un producto tiene un SKU que coincide
    const hasMatchingSKU = (product: ProductCardProps, skuPrefix: string): boolean => {
      const skuArray = product.apiProduct?.sku;
      if (!Array.isArray(skuArray)) return false;
      return skuArray.some(sku => sku?.includes(skuPrefix));
    };

    // Buscar cada producto por su SKU específico
    const zFold7 = allProducts.find(p => hasMatchingSKU(p, 'SM-F966B'));
    const zFlip7 = allProducts.find(p => hasMatchingSKU(p, 'SM-F766B'));
    const s25Ultra = allProducts.find(p => hasMatchingSKU(p, 'SM-S938B'));
    const watch8 = allProducts.find(p =>
      hasMatchingSKU(p, 'SM-L500') ||
      hasMatchingSKU(p, 'SM-L500N')
    );

    // Combinar productos encontrados en orden
    const foundProducts: ProductCardProps[] = [];
    if (zFold7) foundProducts.push(zFold7);
    if (zFlip7) foundProducts.push(zFlip7);
    if (s25Ultra) foundProducts.push(s25Ultra);
    if (watch8) foundProducts.push(watch8);

    return foundProducts;
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
        console.error("Error al remover favorito:", error);
      }
    } else {
      // Si no es favorito, agregar
      try {
        await addToFavorites(productId, parsedUser);
      } catch (error) {
        console.error("Error al agregar favorito:", error);
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
      console.error("Error al agregar favorito:", error);
    }
  }, [pendingFavorite, addToFavorites]);

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
        <div className="w-full" style={{ maxWidth: "1440px" }}>
          {/* Desktop: Grid 4 columnas */}
          <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={`skeleton-${i}`} className="w-full">
                <SkeletonCard />
              </div>
            ))}
          </div>

          {/* Mobile: Scroll horizontal */}
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-[25px] px-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`skeleton-mobile-${i}`} className="shrink-0 w-[280px]">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay productos, no mostrar nada
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
                className="shrink-0 w-[280px]"
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
