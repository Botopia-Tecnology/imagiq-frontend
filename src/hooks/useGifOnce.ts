/**
 * Hook useGifOnce
 * - Permite reproducir un GIF una sola vez con transición suave al final
 * - Captura el último frame y realiza un fade suave
 * - Evita cambios bruscos al terminar la animación
 */

import { useState, useEffect, useRef } from "react";

type UseGifOnceReturn = {
  isGifPlaying: boolean;
  imgRef: React.RefObject<HTMLImageElement>;
  staticImageUrl: string | null;
  isTransitioning: boolean; // Estado adicional para transiciones suaves
};

export const useGifOnce = (
  gifUrl: string,
  gifDuration: number = 3000,
  fadeOutDuration: number = 300 // Duración de la transición de salida
): UseGifOnceReturn => {
  const [isGifPlaying, setIsGifPlaying] = useState(true);
  const [staticImageUrl, setStaticImageUrl] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialLoadRef = useRef(true);

  // Crear un canvas oculto para capturar el frame del GIF
  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    return () => {
      if (staticImageUrl) {
        URL.revokeObjectURL(staticImageUrl);
      }
    };
  }, [staticImageUrl]);

  // Efecto para capturar el último frame del GIF con transición suave
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;

      // Capturar el frame casi al final de la animación (95%)
      const captureTime = Math.max(gifDuration * 0.95, gifDuration - 150);

      // Iniciar transición suave poco antes del final
      const transitionStartTime = Math.max(
        gifDuration - fadeOutDuration,
        captureTime - 50
      );

      // Programar captura del frame
      const captureTimer = setTimeout(() => {
        captureFrame();
      }, captureTime);

      // Programar inicio de transición
      const transitionTimer = setTimeout(() => {
        setIsTransitioning(true);
      }, transitionStartTime);

      // Programar fin de animación
      const stopTimer = setTimeout(() => {
        setIsGifPlaying(false);
        setIsTransitioning(false);
      }, gifDuration);

      return () => {
        clearTimeout(captureTimer);
        clearTimeout(transitionTimer);
        clearTimeout(stopTimer);
      };
    }
  }, [gifDuration, fadeOutDuration]);

  // Función para capturar el frame del GIF
  const captureFrame = () => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const img = imgRef.current;

    // Configurar el canvas para la captura
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      try {
        // Dibujar el frame actual en el canvas
        ctx.drawImage(img, 0, 0);

        // Convertir el canvas a una URL de datos
        const dataUrl = canvas.toDataURL("image/png");
        setStaticImageUrl(dataUrl);
      } catch (e) {
        console.error("Error al capturar frame:", e);
      }
    }
  };

  return { isGifPlaying, imgRef, staticImageUrl, isTransitioning };
};
