/**
 * CHAT PRODUCT CARD - Versión para Chat del Agente
 *
 * Wrapper del ProductCard existente adaptado para el chat.
 * Usa el codigoMarketBase para cargar el producto completo desde el API.
 */

"use client";

import React, { useEffect, useState } from "react";
import { fetchProductByCodigoMarket, ProductApiData } from "@/lib/api";
import ProductCard from "@/app/productos/components/ProductCard";
import { Loader } from "lucide-react";

interface ChatProductCardProps {
  codigoMarketBase: string; // ID del producto para hacer fetch
}

export default function ChatProductCard({ codigoMarketBase }: ChatProductCardProps) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductApiData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hacer fetch del producto completo usando el API existente
        const productData = await fetchProductByCodigoMarket(codigoMarketBase);

        if (!productData) {
          setError("Producto no encontrado");
          return;
        }

        // Verificar que no sea un bundle (solo soportamos productos regulares en el chat)
        if ('isBundle' in productData && productData.isBundle) {
          setError("Los bundles no se pueden mostrar en el chat");
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error("[ChatProductCard] Error loading product:", err);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [codigoMarketBase]);

  // Estado de carga
  if (loading) {
    return (
      <div className="w-full max-w-xs bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center gap-3">
        <Loader className="w-8 h-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Cargando producto...</p>
      </div>
    );
  }

  // Estado de error
  if (error || !product) {
    return (
      <div className="w-full max-w-xs bg-red-50 rounded-lg border border-red-200 p-4">
        <p className="text-sm text-red-600">{error || "Error al cargar producto"}</p>
      </div>
    );
  }

  // Renderizar el ProductCard con estilos adaptados para el chat
  return (
    <div className="w-full max-w-xs">
      <ProductCard
        id={product.codigoMarketBase}
        name={product.nombreMarket?.[0] || product.modelo?.[0] || "Producto"}
        image={product.imagePreviewUrl?.[0] || product.urlImagenes?.[0] || "/placeholder.png"}
        colors={[]} // El ProductCard manejará esto internamente con apiProduct
        price={`$${product.precioeccommerce?.[0]?.toLocaleString("es-CO") || 0}`}
        originalPrice={product.precioNormal?.[0] ? `$${product.precioNormal[0].toLocaleString("es-CO")}` : undefined}
        apiProduct={product}
        className="shadow-md hover:shadow-lg transition-shadow"
        isInChat={true} // Indica que está en el chat para aplicar estilos compactos
      />
    </div>
  );
}
