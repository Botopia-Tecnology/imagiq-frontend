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

// Tipos para los datos de video
interface VideoData {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  description?: string;
}

// Datos de los videos
const videosData: VideoData[] = [
  {
    id: "video-1",
    src: "/nevera_beespoke.mp4",
    title: "¡Explora su potencial!",
    subtitle: "",
    description: "",
  },
];

/**
 * Componente de video individual con controles personalizados
 */
const VideoPlayer = ({ video }: { video: VideoData; index: number }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Inicia reproduciendo automáticamente
  const videoRef = useRef<HTMLVideoElement>(null);

  // Efecto para reproducir automáticamente cuando se monta el componente
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Reset the video
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [video.src]);

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

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"
        style={{ zIndex: 1 }}
      />

      <div
        className="absolute inset-0 p-6 text-white"
        style={{ zIndex: 2, fontFamily: "SamsungSharpSans" }}
      >
        <div className="absolute bottom-6 left-6">
          <p className="text-lg md:text-xl font-medium opacity-90">
            {video.subtitle}
          </p>
          <p className="text-sm md:text-base opacity-80 mt-1">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente principal de la sección de videos
 */
export default function VideosSection() {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handlePrev = () => {
    setCurrentVideo((prev) => (prev === 0 ? videosData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentVideo((prev) => (prev === videosData.length - 1 ? 0 : prev + 1));
  };
  return (
    <section
      className="w-full pt-8 pb-8 px-4"
      style={{
        fontFamily: "SamsungSharpSans",
        background: "#ffffff", // Fondo blanco
        minHeight: "80vh",
      }}
      aria-label="Sección de videos promocionales"
    >
      <div className="max-w-7xl mx-auto w-full overflow-hidden">
        {/* Contenedor de flechas y video en fila */}
        <div className="flex items-center justify-center w-full">
          {/* Botón Anterior (izquierda del video) */}
          <button
            className="w-10 h-10 sm:w-12 sm:h-12 text-black  rounded-full text-3xl flex items-center justify-center transition"
            onClick={handlePrev}
            aria-label="Anterior"
          >
            ‹
          </button>

          {/* Contenedor del video */}
          <div
            className="mx-2 w-0 flex-1"
            style={{
              height: "500px",
              aspectRatio: "16/9",
            }}
          >
            <VideoPlayer
              video={videosData[currentVideo]}
              index={currentVideo}
            />
          </div>

          {/* Botón Siguiente (derecha del video) */}
          <button
            className="w-10 h-10 sm:w-12 sm:h-12 text-black rounded-full text-3xl flex items-center justify-center transition"
            onClick={handleNext}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>

        {/* Descripción opcional */}
        {videosData[currentVideo].description && (
          <div className="mt-6 text-center text-black/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            {videosData[currentVideo].description}
          </div>
        )}

        {/* Indicadores de carrusel (puntos) */}
        <div className="flex justify-center mt-10 space-x-3">
          {videosData.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentVideo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentVideo ? "bg-black" : "bg-black/30"
              }`}
              aria-label={`Ir al video ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
