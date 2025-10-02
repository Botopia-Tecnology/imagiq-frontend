/**
 * 🎨 HERO IMAGE COMPONENT
 * Componente optimizado solo para secciones hero corporativas
 */

"use client";

import React from "react";
import Image from "next/image";

interface HeroImageProps {
  publicId: string;
  alt: string;
  className?: string;
}

const HeroImage: React.FC<HeroImageProps> = ({
  publicId,
  alt,
  className = "",
}) => {
  // URL directa de Cloudinary sin transformaciones para evitar timeouts
  const imageUrl = `https://res.cloudinary.com/dqsdl9bwv/image/upload/${publicId}`;

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={1920}
      height={1080}
      priority
      quality={90}
      className={`w-full h-auto object-contain ${className}`}
      sizes="100vw"
      loading="eager"
      unoptimized // Evita procesamiento adicional que puede causar timeout
    />
  );
};

export default HeroImage;
