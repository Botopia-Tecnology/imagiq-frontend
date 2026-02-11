'use client';

import { renderNode } from './tiptap-node-renderers';

// Tipos para el contenido Tiptap
interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

export interface TiptapContent {
  type: 'doc';
  content: TiptapNode[];
}

export interface TiptapRendererProps {
  content: TiptapContent | null;
  className?: string;
}

/**
 * Componente que renderiza contenido Tiptap JSON a HTML
 */
export function TiptapRenderer({ content, className = '' }: Readonly<TiptapRendererProps>) {
  if (!content?.content) {
    return <div className={`text-gray-500 ${className}`}>No hay contenido disponible.</div>;
  }

  return (
    <div className={`tiptap-content ${className}`}>
      {content.content.map((node, index) => renderNode(node, index))}
    </div>
  );
}

// Re-exportar utilidades para mantener compatibilidad
export { extractSectionsFromContent } from '@/lib/tiptap-utils';

export default TiptapRenderer;

