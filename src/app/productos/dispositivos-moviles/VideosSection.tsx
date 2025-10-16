"use client";
/**
 * 🎥 VIDEOS SECTION COMPONENT - IMAGIQ ECOMMERCE
 *
 * Sección de videos promocionales para productos móviles.
 * - Diseño idéntico a la imagen de referencia
 * - Videos responsivos con overlay de texto
 * - Controles de reproducción personalizados
 * - Efectos de hover y transiciones suaves
 * - Background con efectos de luz consistente
 * - Código limpio, escalable y documentado
 * - Experiencia de usuario optimizada
 */

import React, { useState, useRef } from "react";
import { ProductCardProps } from "../components/ProductCard";
import FlixmediaDetails from "@/components/FlixmediaDetails";

// Tipos para los datos de video
interface VideoData {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  description?: string;
}

interface DetailsProps {
  product: ProductCardProps;
}

// Datos de los videos
const videosData: VideoData[] = [
  {
    id: "video-1",
    src: "/video-mobile1.mp4",
    title: "¡Explora su potencial!",
    subtitle: "",
    description: "",
  },
  {
    id: "video-2",
    src: "/video-mobile2.mp4",
    title: "Galaxy AI ✨",
    subtitle: "",
    description:
      "Recibe la próxima era de la IA móvil con un compañero de IA que está un paso adelante de tus necesidades. Solo deja que la conversación natural que el camino para verificar las tareas diarias con facilidad.",
  },
];

/**
 * Componente de video individual con controles personalizados
 */
const VideoPlayer = ({ video, index }: { video: VideoData; index: number }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Inicia reproduciendo automáticamente
  const videoRef = useRef<HTMLVideoElement>(null);

  // Efecto para reproducir automáticamente cuando se monta el componente
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay was prevented:", error);
        setIsPlaying(false);
      });
    }
  }, []);

  // Handler para play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handler cuando el video termina
  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300"
      onClick={togglePlayPause}
    >
      {/* Video de fondo */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        autoPlay
        onEnded={handleVideoEnd}
      >
        <source src={video.src} type="video/mp4" />
        Tu navegador no soporta el elemento video.
      </video>

      {/* Overlay con gradiente sutil */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"
        style={{ zIndex: 1 }}
      />

      {/* Contenido superpuesto */}
      <div
        className="absolute inset-0 p-6 text-white"
        style={{ zIndex: 2, fontFamily: "SamsungSharpSans" }}
      >
        {/* Para el primer video - solo Nuevo y Galaxy S25 Ultra */}
        {index === 0 && (
          <div className="absolute top-6 left-6">
            <p className="text-lg md:text-xl font-medium opacity-90">
              {video.subtitle}
            </p>
            <p className="text-lg md:text-xl font-medium opacity-90">
              {video.description}
            </p>
          </div>
        )}

        {/* Para el segundo video - solo el título dentro del video */}
        {index === 1 && (
          <div className="absolute bottom-6 left-6">
            <p className="text-lg md:text-xl font-medium opacity-90">
              {video.subtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Componente principal de la sección de videos
 */
const VideosSection: React.FC<DetailsProps> = ({ product }) => {
  const [showFlixmedia, setShowFlixmedia] = useState(true);

  return (
    <section
      className="w-full py-16 px-4"
      style={{
        fontFamily: "SamsungSharpSans",
        minHeight: "80vh",
      }}
      aria-label="Sección de videos promocionales"
    >
      {showFlixmedia && product.sku && (
              <FlixmediaDetails
                mpn={product.sku}
                ean={null}
                className="mb-8"
              />
            ) }
      <div className="max-w-6xl mx-auto">
        {/* Grid vertical de videos - uno encima del otro */}
        <div className="space-y-24 relative">
          {videosData.map((video, index) => (
            <div key={video.id} className="relative">
              {/* Título centrado arriba del primer video */}
              {index === 0 && (
                <div className="pb-4 text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-black">
                    ¡Explora su potencial!
                  </h2>
                </div>
              )}

              {/* Container del video */}
              <div
                className="w-full max-w-6xl mx-auto"
                style={{
                  height: "500px", // Altura fija para ambos videos
                  aspectRatio: "16/9", // Relación de aspecto horizontal
                }}
              >
                <VideoPlayer video={video} index={index} />
              </div>

              {/* Título Galaxy AI centrado entre los dos videos */}
              {index === 0 && (
                <div
                  className="flex items-center justify-center"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    right: "0",
                    height: "192px", // Altura del espacio space-y-24
                    zIndex: 10,
                  }}
                >
                  <h3 className="text-4xl md:text-5xl -mt-20 font-bold text-black text-center">
                    Galaxy AI ✨
                  </h3>
                </div>
              )}

              {/* Descripción fuera de la card del segundo video */}
              {index === 1 && (
                <div className="mt-4 max-w-6xl mx-auto px-6">
                  <p className="text-sm md:text-base text-white/90 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VideosSection