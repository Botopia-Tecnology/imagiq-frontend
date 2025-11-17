/**
 * PRODUCT BANNER CARD - IMAGIQ ECOMMERCE
 *
 * Banner que se integra en el grid de productos
 * Ocupa 1 columna de ancho y toda la fila en altura
 * Se muestra cada 15 productos
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { parsePosition, positionToCSS } from "@/utils/bannerCoordinates";
import type { Banner } from "@/types/banner";
import { BannerMedia } from "./BannerMedia";
import { BannerContent } from "./BannerContent";

interface ProductBannerCardProps {
  config: Banner;
}

export function ProductBannerCard({ config }: Readonly<ProductBannerCardProps>) {
  const [videoEnded, setVideoEnded] = useState(false);

  // Calcular si debe mostrar contenido inmediatamente
  const hasVideo = Boolean(config.desktop_video_url);
  const showImmediately = !hasVideo;
  const effectiveVideoEnded = showImmediately || videoEnded;

  // Estilos de posicionamiento del contenido usando el nuevo sistema
  const position = parsePosition(config.position_desktop);
  const positionStyle = positionToCSS(position);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <div className="relative w-full max-w-[350px] mx-auto aspect-[5/9] overflow-hidden rounded-lg bg-gray-100 group shadow-sm hover:shadow-lg transition-shadow">
      {/* Media de fondo */}
      <BannerMedia
        videoUrl={config.desktop_video_url}
        imageUrl={config.desktop_image_url}
        videoEnded={videoEnded}
        onVideoEnd={handleVideoEnd}
      />

      {/* Overlay de hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

      {/* Contenido del banner */}
      <BannerContent
        title={config.title}
        description={config.description}
        cta={config.cta}
        linkUrl={config.link_url}
        colorFont={config.color_font}
        positionStyle={positionStyle}
        isVisible={effectiveVideoEnded}
      />

      {/* Overlay clickeable si no tiene CTA pero tiene link */}
      {config.link_url && !config.cta && (
        <Link
          href={config.link_url}
          className="absolute inset-0 z-20"
          aria-label={config.title || "Ver más"}
        />
      )}
    </div>
  );
}
