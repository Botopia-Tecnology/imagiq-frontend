/**
 * Componente de media (video/imagen) del banner de producto
 */

"use client";

import { useRef, useEffect } from "react";

interface BannerMediaProps {
  videoUrl: string | null;
  imageUrl: string | null;
  videoEnded: boolean;
  onVideoEnd?: () => void;
}

export function BannerMedia({
  videoUrl,
  imageUrl,
  videoEnded,
  onVideoEnd,
}: Readonly<BannerMediaProps>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(videoUrl);

  // compute opacities in local variables to avoid nested ternary expressions in JSX
  const videoOpacity = videoEnded ? 0 : 1;

  // compute image opacity without nested ternaries
  let imageOpacity = 1;
  if (hasVideo) {
    imageOpacity = videoEnded ? 1 : 0;
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    video.muted = true;
    video.playsInline = true;
    video.load();

    if (video.readyState >= 3) {
      video.play().catch(() => {});
    }
  }, [videoUrl]);

  return (
    <div className="absolute inset-0">
      {/* Video */}
      {videoUrl && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop={false}
          playsInline
          preload="metadata"
          onEnded={onVideoEnd || undefined}
          style={{
            opacity: videoOpacity,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Imagen */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: `url(${imageUrl})`,
            opacity: imageOpacity,
          }}
        />
      )}
    </div>
  );
}
