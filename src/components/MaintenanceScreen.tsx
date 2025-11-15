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
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Sombras dinámicas animadas - minimalistas con movimiento visible */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Sombra superior izquierda */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gray-900/[0.08] rounded-full blur-3xl animate-float-1" />

        {/* Sombra inferior derecha */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gray-900/[0.08] rounded-full blur-3xl animate-float-2" />

        {/* Sombra central flotante */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gray-900/[0.05] rounded-full blur-3xl animate-float-3" />

        {/* Sombra derecha media */}
        <div className="absolute top-2/3 right-1/4 w-[350px] h-[350px] bg-gray-900/[0.06] rounded-full blur-3xl animate-float-4" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Título principal - SAMSUNG STORE centrado y grande */}
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

          {/* Productos destacados */}
          <div className="mb-8 animate-fade-in-delay-3">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <div
                  key={product.sku}
                  className="group bg-white border border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
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
                          className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
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
                      onClick={() => {
                        const email = prompt("Ingresa tu email para notificarte:");
                        if (email && email.includes("@")) {
                          setNotifyEmail(email);
                          handleNotifyMe(product.sku);
                        } else if (email) {
                          alert("Por favor ingresa un email válido");
                        }
                      }}
                      disabled={notificationSent.has(product.sku)}
                      className={`w-full py-3 font-medium transition-all duration-300 ${
                        notificationSent.has(product.sku)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                          : "bg-black text-white hover:bg-gray-900 hover:shadow-lg"
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

      {/* Estilos de animaciones minimalistas */}
      <style jsx>{`
        /* Animación de sombra 1 - Diagonal suave */
        @keyframes float-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(80px, -60px) scale(1.15);
          }
          50% {
            transform: translate(120px, -40px) scale(1.1);
          }
          75% {
            transform: translate(60px, 20px) scale(0.95);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        /* Animación de sombra 2 - Circular amplia */
        @keyframes float-2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-100px, 80px) scale(1.2);
          }
          50% {
            transform: translate(-150px, 0) scale(1.1);
          }
          75% {
            transform: translate(-80px, -60px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        /* Animación de sombra 3 - Ondulación */
        @keyframes float-3 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(100px, 50px) scale(1.15);
          }
          66% {
            transform: translate(-80px, -40px) scale(0.95);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        /* Animación de sombra 4 - Pulsación con movimiento */
        @keyframes float-4 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(60px, -80px) scale(1.25);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        /* Fade in para título */
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Slide up para productos */
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-1 {
          animation: float-1 20s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 25s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 18s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 22s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 1s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 1s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
