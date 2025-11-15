"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

interface VideoOverlayProps {
  isOpen: boolean;
  videoUrl: string;
  onClose: () => void;
  onVideoEnd: () => void;
}

export default function VideoOverlay({
  isOpen,
  videoUrl,
  onClose,
  onVideoEnd,
}: VideoOverlayProps) {
  const [canSkip, setCanSkip] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reiniciar estado
      setCanSkip(false);
      setVideoProgress(0);

      // Permitir saltar después de 3 segundos
      const timer = setTimeout(() => {
        setCanSkip(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setVideoProgress(progress);
    };

    const handleEnded = () => {
      onVideoEnd();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onVideoEnd]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Botón Skip - Responsive */}
      {canSkip && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 transition-all duration-200 animate-fade-in"
        >
          <span className="text-xs sm:text-sm font-medium">Saltar video</span>
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-200"
          style={{ width: `${videoProgress}%` }}
        />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
