/**
 * Hook para obtener las ofertas destacadas desde el dashboard
 * Consume el endpoint /api/multimedia/ofertas-destacadas/activas
 */

import { useState, useEffect } from "react";

export interface OfertaDestacada {
  uuid: string;
  producto_id: number;
  orden: number;
  activo: boolean;
  // Estos campos se rellenan desde el backend cuando se consultan los productos
  producto_nombre?: string;
  producto_imagen?: string | null;
  link_url?: string | null;
}

interface UseOfertasDestacadasReturn {
  productos: OfertaDestacada[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useOfertasDestacadas(): UseOfertasDestacadasReturn {
  const [productos, setProductos] = useState<OfertaDestacada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOfertasDestacadas = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener ofertas activas
        const ofertasResponse = await fetch(
          `${API_BASE_URL}/api/multimedia/ofertas-destacadas/activas`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
            },
          }
        );

        if (!isMounted) return;

        if (!ofertasResponse.ok) {
          throw new Error("Error al cargar ofertas destacadas");
        }

        const ofertasData = await ofertasResponse.json();

        if (!ofertasData.success || !ofertasData.data) {
          setProductos([]);
          setLoading(false);
          return;
        }

        const ofertas = ofertasData.data as OfertaDestacada[];

        // Enriquecer con datos de productos
        const productosEnriquecidos = await Promise.all(
          ofertas.map(async (oferta) => {
            try {
              const productResponse = await fetch(
                `${API_BASE_URL}/api/products/${oferta.producto_id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                  },
                }
              );

              if (productResponse.ok) {
                const productData = await productResponse.json();
                if (productData.success && productData.data?.products?.[0]) {
                  const product = productData.data.products[0];
                  return {
                    ...oferta,
                    producto_nombre: product.nombreMarket,
                    producto_imagen: product.imagenPrevisualizacion,
                    link_url: `/productos/view/${oferta.producto_id}`,
                  };
                }
              }
            } catch (err) {
              console.error(
                `Error cargando producto ${oferta.producto_id}:`,
                err
              );
            }

            // Si el producto no existe o hay error, retornar null para filtrarlo después
            return null;
          })
        );

        // Filtrar productos que no existen (null) y ordenar por orden
        const productosValidos = productosEnriquecidos
          .filter((p): p is NonNullable<typeof p> => p !== null)
          .sort((a, b) => (a?.orden ?? 0) - (b?.orden ?? 0));

        if (isMounted) {
          setProductos(productosValidos);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching ofertas destacadas:", err);
        setError("Error al cargar ofertas destacadas");
        setProductos([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOfertasDestacadas();

    return () => {
      isMounted = false;
    };
  }, []);

  return { productos, loading, error };
}
