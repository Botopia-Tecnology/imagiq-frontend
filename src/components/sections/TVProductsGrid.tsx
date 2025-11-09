/**
 * 📺 TV PRODUCTS GRID - 4 Televisores
 *
 * Muestra 4 televisores destacados después del banner de AI TVs
 */

"use client";

import { useMemo, useState, useCallback } from "react";
import { useProducts } from "@/features/products/useProducts";
import { useFavorites } from "@/features/products/useProducts";
import ProductCard from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import GuestDataModal from "@/app/productos/components/GuestDataModal";

export default function TVProductsGrid() {
  // Obtener productos de la categoría Televisores
  const filters = useMemo(() => ({
    limit: 50,
    page: 1,
    minStock: 1,
  }), []);

  const { products: allProducts, loading } = useProducts(filters);
  
  // Hook de favoritos
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Estados para el modal de invitado
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingFavorite, setPendingFavorite] = useState<string | null>(null);

  // Filtrar televisores
  const tvProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const tvs = allProducts.filter(p =>
      p.apiProduct?.subcategoria === 'Televisores' ||
      p.apiProduct?.categoria === 'Televisores'
    );

    return tvs.slice(0, 4);
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
          <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={`skeleton-${i}`} className="w-full">
                <SkeletonCard />
              </div>
            ))}
          </div>
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
  if (!tvProducts || tvProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
      <div className="w-full" style={{ maxWidth: "1440px" }}>
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {tvProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {tvProducts.map((product) => (
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
