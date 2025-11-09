/**
 * 🧺 APPLIANCES PRODUCTS GRID - 4 Lavadoras
 *
 * Muestra 4 lavadoras/electrodomésticos después del banner Bespoke AI
 */

"use client";

import { useMemo, useState, useCallback } from "react";
import { useProducts } from "@/features/products/useProducts";
import { useFavorites } from "@/features/products/useProducts";
import ProductCard from "@/app/productos/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import GuestDataModal from "@/app/productos/components/GuestDataModal";

export default function AppliancesProductsGrid() {
  // Obtener productos con límite amplio para incluir electrodomésticos
  const filters = useMemo(
    () => ({
      limit: 300,
      page: 1,
      minStock: 1,
    }),
    []
  );

  const { products: allProducts, loading } = useProducts(filters);
  
  // Hook de favoritos
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Estados para el modal de invitado
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingFavorite, setPendingFavorite] = useState<string | null>(null);

  // Filtrar electrodomésticos específicos: Lavadora Bespoke AI, Nevera, Microondas, Aspiradora
  const applianceProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    // Función auxiliar para verificar SKU
    const hasMatchingSKU = (
      product: { apiProduct?: { sku?: string[] } },
      skuPrefix: string
    ): boolean => {
      const skuArray = product.apiProduct?.sku;
      if (!Array.isArray(skuArray)) return false;
      return skuArray.some((sku: string) => sku?.includes(skuPrefix));
    };

    const foundProducts = [];

    // 1. Lavadora con SKU WD26FB8690BECO
    const lavadora1 = allProducts.find(
      (p) => p.id === "WD26FB8690BECO" || hasMatchingSKU(p, "WD26FB8690")
    );
    if (lavadora1) foundProducts.push(lavadora1);

    // 2. Lavadora con SKU WF90F26ADSCO
    const lavadora2 = allProducts.find(
      (p) => p.id === "WF90F26ADSCO" || hasMatchingSKU(p, "WF90F26ADS")
    );
    if (lavadora2) foundProducts.push(lavadora2);

    // 3. Aire acondicionado con SKU AC024MN4PKH/CB
    const aireAcondicionado = allProducts.find(
      (p) => p.id === "AC024MN4PKH/CB" || hasMatchingSKU(p, "AC024MN4PKH")
    );
    if (aireAcondicionado) foundProducts.push(aireAcondicionado);

    // 4. Aspiradora más cara
    const aspiradoras = allProducts.filter(
      (p) =>
        p.apiProduct?.subcategoria === "Aspiradoras" ||
        p.apiProduct?.subcategoria === "Limpieza" ||
        p.apiProduct?.nombreMarket?.toLowerCase().includes("aspiradora")
    );
    const aspiradorasOrdenadas = aspiradoras.toSorted((a, b) => {
      const precioA =
        a.apiProduct?.precioeccommerce?.[0] ||
        a.apiProduct?.precioNormal?.[0] ||
        0;
      const precioB =
        b.apiProduct?.precioeccommerce?.[0] ||
        b.apiProduct?.precioNormal?.[0] ||
        0;
      return precioB - precioA;
    });
    const aspiradoraMasCara = aspiradorasOrdenadas[0];
    if (aspiradoraMasCara) foundProducts.push(aspiradoraMasCara);

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
                <div
                  key={`skeleton-mobile-${i}`}
                  className="shrink-0 w-[280px]"
                >
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
  if (!applianceProducts || applianceProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
      <div className="w-full" style={{ maxWidth: "1440px" }}>
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {applianceProducts.map((product) => (
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
            {applianceProducts.map((product) => (
              <div key={product.id} className="shrink-0 w-[280px]">
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
