/**
 * Renderizador de bloques de contenido para banners
 * Componente reutilizable que maneja el renderizado de content_blocks
 */

"use client";

import type { ContentBlock } from "@/types/banner";

interface ContentBlockRendererProps {
  block: ContentBlock;
  isMobile: boolean;
  videoEnded: boolean;
  scale?: number; // Factor de escala opcional (ej: 0.4 para 40%)
  centerContent?: boolean; // Si true, usa translate(-50%, -50%) como en el dashboard
}

export function ContentBlockRenderer({
  block,
  isMobile,
  videoEnded,
  scale = 1,
  centerContent = false,
}: Readonly<ContentBlockRendererProps>) {
  // Helper para escalar tamaños
  const scaleSize = (size: string): string => {
    if (scale === 1) return size;
    const regex = /([\d.]+)(rem|px|em)/;
    const match = regex.exec(size);
    if (match) {
      const value = Number.parseFloat(match[1]) * scale;
      return `${value}${match[2]}`;
    }
    return size;
  };

  // Posiciones según dispositivo
  const position = isMobile ? block.position_mobile : block.position_desktop;

  // Configuraciones de contenedor según dispositivo
  const textAlign = (isMobile && block.textAlign_mobile) || block.textAlign || 'left';
  const gap = scaleSize((isMobile && block.gap_mobile) || block.gap || '12px');
  const maxWidth = (isMobile && block.maxWidth_mobile) || block.maxWidth || 'none';

  // Clase de visibilidad con transición
  const visibilityClass = `absolute transition-opacity duration-700 ${
    videoEnded ? 'opacity-100' : 'opacity-0'
  }`;

  // Estilos del título: usar mobile si existe, sino desktop
  const titleStyles = block.title && {
    fontSize: scaleSize((isMobile && block.title_mobile?.fontSize) || block.title.fontSize || '2rem'),
    fontWeight: (isMobile && block.title_mobile?.fontWeight) || block.title.fontWeight || '700',
    color: (isMobile && block.title_mobile?.color) || block.title.color || '#ffffff',
    lineHeight: (isMobile && block.title_mobile?.lineHeight) || block.title.lineHeight || '1.2',
    textTransform: (isMobile && block.title_mobile?.textTransform) || block.title.textTransform || 'none',
    letterSpacing: (isMobile && block.title_mobile?.letterSpacing) || block.title.letterSpacing || 'normal',
    textShadow: (isMobile && block.title_mobile?.textShadow) || block.title.textShadow || '2px 2px 4px rgba(0,0,0,0.5)',
  };

  return (
    <div
      key={block.id}
      className={visibilityClass}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: centerContent ? 'translate(-50%, -50%)' : 'translate(0, 0)',
        maxWidth,
      }}
    >
      <div
        className="flex flex-col"
        style={{
          gap,
        }}
      >
        {/* Título */}
        {block.title && (
          <h2
            style={{
              ...titleStyles,
              margin: 0,
              whiteSpace: 'pre-line',
              textAlign,
            }}
          >
            {block.title.text}
          </h2>
        )}

        {/* Subtítulo */}
        {block.subtitle && (() => {
          const subtitleStyles = {
            fontSize: scaleSize((isMobile && block.subtitle_mobile?.fontSize) || block.subtitle.fontSize || '1.5rem'),
            fontWeight: (isMobile && block.subtitle_mobile?.fontWeight) || block.subtitle.fontWeight || '600',
            color: (isMobile && block.subtitle_mobile?.color) || block.subtitle.color || '#ffffff',
            lineHeight: (isMobile && block.subtitle_mobile?.lineHeight) || block.subtitle.lineHeight || '1.3',
            textTransform: (isMobile && block.subtitle_mobile?.textTransform) || block.subtitle.textTransform || 'none',
          };
          return (
            <h3
              style={{
                ...subtitleStyles,
                margin: 0,
                whiteSpace: 'pre-line',
                textAlign,
              }}
            >
              {block.subtitle.text}
            </h3>
          );
        })()}

        {/* Descripción */}
        {block.description && (() => {
          const descriptionStyles = {
            fontSize: scaleSize((isMobile && block.description_mobile?.fontSize) || block.description.fontSize || '1rem'),
            fontWeight: (isMobile && block.description_mobile?.fontWeight) || block.description.fontWeight || '400',
            color: (isMobile && block.description_mobile?.color) || block.description.color || '#ffffff',
            lineHeight: (isMobile && block.description_mobile?.lineHeight) || block.description.lineHeight || '1.5',
            textTransform: (isMobile && block.description_mobile?.textTransform) || block.description.textTransform || 'none',
          };
          return (
            <p
              style={{
                ...descriptionStyles,
                margin: 0,
                whiteSpace: 'pre-line',
                textAlign,
              }}
            >
              {block.description.text}
            </p>
          );
        })()}

        {/* CTA */}
        {block.cta && (() => {
          const ctaStyles = {
            fontSize: scaleSize((isMobile && block.cta_mobile?.fontSize) || block.cta.fontSize || '1rem'),
            fontWeight: (isMobile && block.cta_mobile?.fontWeight) || block.cta.fontWeight || '600',
            backgroundColor: (isMobile && block.cta_mobile?.backgroundColor) || block.cta.backgroundColor || '#ffffff',
            color: (isMobile && block.cta_mobile?.color) || block.cta.color || '#000000',
            padding: scaleSize((isMobile && block.cta_mobile?.padding) || block.cta.padding || '12px 24px'),
            borderRadius: scaleSize((isMobile && block.cta_mobile?.borderRadius) || block.cta.borderRadius || '8px'),
            border: (isMobile && block.cta_mobile?.border) || block.cta.border || 'none',
            textTransform: (isMobile && block.cta_mobile?.textTransform) || block.cta.textTransform || 'none',
            backdropFilter: (isMobile && block.cta_mobile?.backdropFilter) || block.cta.backdropFilter,
            boxShadow: (isMobile && block.cta_mobile?.boxShadow) || block.cta.boxShadow,
          };
          return (
            <div style={{ textAlign }}>
              <a
                href={block.cta.link_url || '#'}
                className="inline-block transition-all duration-300 hover:scale-105 hover:shadow-lg pointer-events-auto"
                style={{
                  ...ctaStyles,
                  textDecoration: 'none',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                }}
              >
                {block.cta.text}
              </a>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
