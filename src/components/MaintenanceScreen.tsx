"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/app/productos/components/ProductCard";
import { ProductApiData } from "@/lib/api";

/**
 * Pantalla de mantenimiento - Diseño Samsung Real
 * Reutiliza ProductCard existente con botón "Notifícame"
 */

export default function MaintenanceScreen() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<ProductApiData[]>([]);

  useEffect(() => {
    setMounted(true);

    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const skus = [
          "SM-F966BDBJCOO",
          "SM-F766BDBKCOO",
          "SM-X930NZADCOO",
          "SM-L705FZB1COO",
        ];

        const productsData: ProductApiData[] = [];

        for (const sku of skus) {
          try {
            const response = await fetch(
              `${API_URL}/api/products/search/grouped?sku=${sku}&limit=1`
            );
            const data = await response.json();

            if (data.success && data.data?.products && data.data.products.length > 0) {
              productsData.push(data.data.products[0]);
            }
          } catch (error) {
            console.error(`Error fetching ${sku}:`, error);
          }
        }

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Sombras dinámicas animadas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gray-900/[0.08] rounded-full blur-3xl animate-float-1" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gray-900/[0.08] rounded-full blur-3xl animate-float-2" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gray-900/[0.05] rounded-full blur-3xl animate-float-3" />
        <div className="absolute top-2/3 right-1/4 w-[350px] h-[350px] bg-gray-900/[0.06] rounded-full blur-3xl animate-float-4" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Título principal */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black mb-8 md:mb-10 animate-fade-in">
              SAMSUNG STORE
            </h1>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-black mb-8 md:mb-10 animate-fade-in-delay-1">
              Estamos trabajando
              <br />
              <span className="font-bold">en algo especial</span>
            </h2>
          </div>

          {/* Productos - Usando ProductCard existente */}
          <div className="mb-8 animate-fade-in-delay-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product, idx) => {
                // Preparar colores para ProductCard
                const colors = product.codigoMarket?.map((sku, i) => ({
                  name: product.color?.[i] || "default",
                  hex: product.hexCode?.[i] || "#000000",
                  label: product.nombreColor?.[i] || product.color?.[i] || "Color",
                  sku: sku,
                  ean: product.ean?.[i] || "",
                  price: product.precio?.[i],
                  originalPrice: product.precioOriginal?.[i],
                  imagePreviewUrl: product.imagePreviewUrl?.[i],
                })) || [];

                return (
                  <div
                    key={product.codigoMarketBase || idx}
                    className="animate-slide-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <ProductCard
                      id={product.codigoMarketBase || ""}
                      name={product.nombreMarket?.[0] || "Producto Samsung"}
                      image={product.imagePreviewUrl?.[0] || "/placeholder-product.png"}
                      colors={colors}
                      price={product.precio?.[0]}
                      originalPrice={product.precioOriginal?.[0]}
                      discount={product.descuento?.[0]}
                      apiProduct={product}
                      segmento={product.segmento}
                      className="h-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-12 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              ¿Necesitas ayuda?{" "}
              <a
                href="mailto:soporte@imagiq.com"
                className="text-black font-medium hover:underline"
              >
                Contáctanos
              </a>
            </p>
          </div>
        </main>
      </div>

      {/* Estilos de animaciones */}
      <style jsx>{`
        @keyframes float-1 {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, -60px) scale(1.15); }
          50% { transform: translate(120px, -40px) scale(1.1); }
          75% { transform: translate(60px, 20px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes float-2 {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-100px, 80px) scale(1.2); }
          50% { transform: translate(-150px, 0) scale(1.1); }
          75% { transform: translate(-80px, -60px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes float-3 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, 50px) scale(1.15); }
          66% { transform: translate(-80px, -40px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes float-4 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -80px) scale(1.25); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 18s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 22s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-fade-in-delay-1 { animation: fade-in 1s ease-out 0.2s forwards; opacity: 0; }
        .animate-fade-in-delay-2 { animation: fade-in 1s ease-out 0.4s forwards; opacity: 0; }
        .animate-fade-in-delay-3 { animation: fade-in 1s ease-out 0.6s forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}
