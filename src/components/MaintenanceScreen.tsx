"use client";

import { useEffect, useState, useRef } from "react";
import ProductCard from "@/app/productos/components/ProductCard";
import { ProductApiData } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoOverlay from "./VideoOverlay";

/**
 * Pantalla de mantenimiento - Diseño Samsung Real
 * Carrusel infinito con técnica de clonación
 */

// URLs de videos de Samsung
const SAMSUNG_VIDEOS = [
  "https://res.cloudinary.com/dqay3uml6/video/upload/v1763224198/Unboxing_Galaxy_Z_Fold7_Samsung_Q2oyEJdyvNQ_n53rtm.mp4",
  "https://res.cloudinary.com/dqay3uml6/video/upload/v1763224198/Presentamos_Galaxy_Watch_Ultra_Samsung_ibGFbue9X6Y_i5mixo.mp4",
  "https://res.cloudinary.com/dqay3uml6/video/upload/v1763224200/Ultra_Unfolds_Galaxy_Z_Fold7_Samsung_L986LXw1tNM_eo9d54.mp4",
  "https://res.cloudinary.com/dqay3uml6/video/upload/v1763224293/Disen%CC%83o_Galaxy_Tab_S11_Ultra_Samsung_MmLBwCTpoMg_bdgsj3.mp4",
];

const VIDEO_INTERVAL = 20000; // 20 segundos

export default function MaintenanceScreen() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<ProductApiData[]>([]);
  const [offset, setOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Estados para el video overlay
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [countdown, setCountdown] = useState(VIDEO_INTERVAL / 1000);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Modelos de productos específicos a mostrar (esto trae TODAS las variantes)
  const productModels = [
    "Galaxy Z Fold 7 5G",
    "Galaxy Z Flip 7 5G",
    "Galaxy Tab S11 Ultra WiFi",
    "Galaxy Watch Ultra, 47mm",
  ];

  useEffect(() => {
    setMounted(true);

    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const productsData: ProductApiData[] = [];

        for (const modelo of productModels) {
          try {
            const response = await fetch(
              `${API_URL}/api/products/search/grouped?modelo=${encodeURIComponent(modelo)}&limit=1`
            );
            const data = await response.json();

            if (data.success && data.data?.products && data.data.products.length > 0) {
              productsData.push(data.data.products[0]);
            }
          } catch (error) {
            console.error(`Error fetching ${modelo}:`, error);
          }
        }

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Animación continua
  useEffect(() => {
    if (!isHovered && products.length > 0 && carouselRef.current) {
      const speed = 0.5; // píxeles por frame
      let lastTime = performance.now();

      const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        setOffset((prevOffset) => {
          const newOffset = prevOffset + speed;

          // Calcular el ancho total de un set de productos
          if (carouselRef.current) {
            const totalWidth = carouselRef.current.scrollWidth / 2;

            // Usar módulo para loop continuo sin reset visible
            return newOffset % totalWidth;
          }

          return newOffset;
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isHovered, products.length]);

  // Lógica del temporizador de video
  useEffect(() => {
    if (!mounted) return;

    const startCountdown = () => {
      setCountdown(VIDEO_INTERVAL / 1000);

      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Cuando llega a 0, reproducir video aleatorio
            playRandomVideo();
            return VIDEO_INTERVAL / 1000;
          }
          return prev - 1;
        });
      }, 1000);
    };

    startCountdown();

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [mounted]);

  const playRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * SAMSUNG_VIDEOS.length);
    setCurrentVideoUrl(SAMSUNG_VIDEOS[randomIndex]);
    setIsVideoPlaying(true);

    // Pausar countdown mientras se reproduce el video
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };

  const handleVideoClose = () => {
    setIsVideoPlaying(false);
    setCurrentVideoUrl("");

    // Reiniciar countdown
    setCountdown(VIDEO_INTERVAL / 1000);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          playRandomVideo();
          return VIDEO_INTERVAL / 1000;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVideoEnd = () => {
    handleVideoClose();
  };

  if (!mounted) return null;

  // Duplicar productos para efecto infinito sin espacios
  const displayProducts = [...products, ...products];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Video Overlay */}
      <VideoOverlay
        isOpen={isVideoPlaying}
        videoUrl={currentVideoUrl}
        onClose={handleVideoClose}
        onVideoEnd={handleVideoEnd}
      />

      {/* Contador de próximo video - Responsive */}
      {!isVideoPlaying && (
        <div className="fixed bottom-4 right-4 sm:top-6 sm:right-6 sm:bottom-auto md:top-8 md:right-8 z-50 bg-white/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-gray-200">
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Próximo video en <span className="font-bold text-black">{countdown}s</span>
          </p>
        </div>
      )}

      {/* Sombras dinámicas animadas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gray-900/[0.08] rounded-full blur-3xl animate-float-1" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gray-900/[0.08] rounded-full blur-3xl animate-float-2" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gray-900/[0.05] rounded-full blur-3xl animate-float-3" />
        <div className="absolute top-2/3 right-1/4 w-[350px] h-[350px] bg-gray-900/[0.06] rounded-full blur-3xl animate-float-4" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        <main className="py-4 sm:py-6 md:py-8">
          {/* Título principal - Responsive con padding lateral */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-3 sm:mb-4 md:mb-6 animate-fade-in">
                SAMSUNG STORE
              </h1>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-black mb-4 sm:mb-6 md:mb-8 animate-fade-in-delay-1 px-2">
                Estamos trabajando <span className="font-bold">en algo especial</span>
              </h2>
            </div>
          </div>

          {/* Carrusel de productos - Responsive */}
          {products.length > 0 && (
            <div
              className="relative mb-6 sm:mb-8 animate-fade-in-delay-3 z-0 w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="overflow-hidden">
                <div
                  ref={carouselRef}
                  className="flex gap-3 sm:gap-4 md:gap-6"
                  style={{
                    transform: `translateX(-${offset}px)`,
                    transition: 'none',
                  }}
                >
                  {displayProducts.map((product, idx) => (
                    <div
                      key={`${product.codigoMarketBase}-${idx}`}
                      className="flex-shrink-0 w-48 sm:w-56 md:w-64"
                    >
                      {/* Mobile: scale-90, Tablet: scale-80, Desktop: scale-75 */}
                      <div className="transform scale-90 sm:scale-80 md:scale-75">
                        <ProductCard
                          id={product.codigoMarketBase || ""}
                          name={product.nombreMarket?.[0] || "Producto Samsung"}
                          image={product.imagePreviewUrl?.[0] || "/placeholder-product.png"}
                          colors={[]}
                          price={product.precioeccommerce?.[0]?.toString()}
                          originalPrice={product.precioNormal?.[0]?.toString()}
                          apiProduct={product}
                          segmento={product.segmento}
                          className="h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicadores de posición - Responsive */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                {products.map((_, idx) => {
                  const currentIndex = Math.floor(offset / (carouselRef.current?.scrollWidth || 1) * products.length * 2) % products.length;
                  return (
                    <div
                      key={idx}
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${
                        idx === currentIndex ? "bg-black w-6 sm:w-8" : "bg-gray-300 w-1.5 sm:w-2"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer - Responsive con padding lateral */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500">
                ¿Necesitas ayuda?{" "}
                <a
                  href="mailto:soporte@imagiq.com"
                  className="text-black font-medium hover:underline"
                >
                  Contáctanos
                </a>
              </p>
            </div>
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

        .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 18s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 22s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-fade-in-delay-1 { animation: fade-in 1s ease-out 0.2s forwards; opacity: 0; }
        .animate-fade-in-delay-3 { animation: fade-in 1s ease-out 0.6s forwards; opacity: 0; }
      `}</style>
    </div>
  );
}
