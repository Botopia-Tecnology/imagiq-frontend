"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Pantalla de mantenimiento - Diseño Samsung Real
 *
 * Filosofía de diseño:
 * - Blanco y negro (true Samsung aesthetic)
 * - Minimalista y limpio
 * - Sombras dinámicas y sutiles
 * - Tipografía clara y jerarquía visual
 */

interface Product {
  sku: string;
  name: string;
  image: string;
  loading?: boolean;
}

export default function MaintenanceScreen() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      sku: "SM-F966BDBJCOO",
      name: "Galaxy Z Fold6",
      image: "/placeholder-product.png",
      loading: true,
    },
    {
      sku: "SM-F766BDBKCOO",
      name: "Galaxy Z Flip6",
      image: "/placeholder-product.png",
      loading: true,
    },
    {
      sku: "SM-X930NZADCOO",
      name: "Galaxy Tab S10+",
      image: "/placeholder-product.png",
      loading: true,
    },
    {
      sku: "SM-L705FZB1COO",
      name: "Galaxy Watch Ultra",
      image: "/placeholder-product.png",
      loading: true,
    },
  ]);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notificationSent, setNotificationSent] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setMounted(true);

    // Fetch product data from API
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const skus = [
          "SM-F966BDBJCOO",
          "SM-F766BDBKCOO",
          "SM-X930NZADCOO",
          "SM-L705FZB1COO",
        ];

        const productsData = await Promise.all(
          skus.map(async (sku) => {
            try {
              const response = await fetch(
                `${API_URL}/api/v1/products?sku=${sku}&limit=1`
              );
              const data = await response.json();

              if (data.success && data.data.length > 0) {
                const product = data.data[0];
                return {
                  sku,
                  name:
                    product.nombreMarket?.[0] ||
                    product.desDetallada?.[0] ||
                    "Producto Samsung",
                  image: product.imagePreviewUrl?.[0] || "/placeholder-product.png",
                  loading: false,
                };
              }
              return {
                sku,
                name: "Producto Samsung",
                image: "/placeholder-product.png",
                loading: false,
              };
            } catch {
              return {
                sku,
                name: "Producto Samsung",
                image: "/placeholder-product.png",
                loading: false,
              };
            }
          })
        );

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleNotifyMe = (sku: string) => {
    if (!notifyEmail || !notifyEmail.includes("@")) {
      alert("Por favor ingresa un email válido");
      return;
    }

    // Aquí podrías llamar a un endpoint para guardar la notificación
    console.log(`Notificar a ${notifyEmail} cuando ${sku} esté disponible`);

    setNotificationSent((prev) => new Set(prev).add(sku));

    // Mostrar feedback
    alert("¡Gracias! Te notificaremos cuando el sitio esté disponible.");
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Sombras dinámicas de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gray-900/3 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header - SAMSUNG STORE */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              SAMSUNG STORE
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Mensaje principal */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-6">
              <div className="w-16 h-1 bg-black" />
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-black mb-8">
              Estamos trabajando
              <br />
              <span className="font-bold">en algo especial</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Nuestro equipo está preparando una experiencia renovada.
              <br />
              Vuelve pronto para descubrir las mejores ofertas.
            </p>
          </div>

          {/* Email notification */}
          <div className="max-w-md mx-auto mb-20">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-black text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
              <button
                onClick={() => handleNotifyMe("general")}
                className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-900 transition-colors"
              >
                Notifícame
              </button>
            </div>
          </div>

          {/* Productos destacados */}
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">
              Próximamente disponibles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.sku}
                  className="group bg-white border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Imagen del producto */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {product.loading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full p-8">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    )}
                  </div>

                  {/* Info del producto */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-black mb-2 line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h4>

                    {/* SKU */}
                    <p className="text-xs text-gray-500 mb-4 font-mono">
                      {product.sku}
                    </p>

                    {/* Botón Notifícame */}
                    <button
                      onClick={() => handleNotifyMe(product.sku)}
                      disabled={notificationSent.has(product.sku)}
                      className={`w-full py-3 font-medium transition-all ${
                        notificationSent.has(product.sku)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                          : "bg-black text-white hover:bg-gray-900"
                      }`}
                    >
                      {notificationSent.has(product.sku)
                        ? "✓ Te notificaremos"
                        : "Notifícame"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer message */}
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
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-30px) translateX(20px);
          }
          66% {
            transform: translateY(-15px) translateX(-20px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
