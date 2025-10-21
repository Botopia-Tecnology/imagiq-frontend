"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { productEndpoints, type ProductApiData } from "@/lib/api";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function Sugerencias({
  onAdd,
}: {
  onAdd?: (nombre: string) => void;
}) {
  const [sugerencias, setSugerencias] = useState<ProductApiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await productEndpoints.getFiltered({
          subcategoria: "Accesorios",
          limit: 10, // Traer más para filtrar
        });
        if (response.success && response.data?.products) {
          // Filtrar solo productos con imagen y tomar los primeros 3
          const productosConImagen = response.data.products
            .filter(p => p.imagePreviewUrl?.[0] && p.imagePreviewUrl[0].trim() !== '')
            .slice(0, 3);
          setSugerencias(productosConImagen);
        }
      } catch (error) {
        console.error("Error fetching accessories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#F4F4F4] rounded-2xl p-8 shadow-md mt-8">
        <h2 className="font-bold text-xl mb-6">Agrega a tu compra</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  // No mostrar la sección si no hay sugerencias con imágenes
  if (sugerencias.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F4F4F4] rounded-2xl p-8 shadow-md mt-8">
      <h2 className="font-bold text-xl mb-6">Agrega a tu compra</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {sugerencias.map((producto, idx) => (
          <div
            key={producto.sku[0] || idx}
            className="flex flex-col items-center w-full md:w-1/3 px-2"
          >
            <div className="relative w-28 h-28 mb-2 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src={getCloudinaryUrl(producto.imagePreviewUrl[0], "catalog")}
                  alt={producto.desDetallada[0] || producto.nombreMarket}
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
              <button
                className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
                aria-label={`Agregar ${producto.desDetallada[0] || producto.nombreMarket}`}
                onClick={() => onAdd?.(producto.desDetallada[0] || producto.nombreMarket)}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <div className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                {producto.desDetallada[0] || producto.nombreMarket}
              </div>
              <div className="text-lg font-bold text-gray-900">
                $ {(producto.precioeccommerce[0] || producto.precioNormal[0]).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
