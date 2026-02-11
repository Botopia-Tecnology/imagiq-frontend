/**
 * Utilidades para manejo de contenido Tiptap
 * Este archivo NO tiene 'use client' para poder usarse en Server Components
 */

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

interface TiptapContent {
  type: 'doc';
  content: TiptapNode[];
}

/**
 * Extrae las secciones (headings) del contenido Tiptap para generar el sidebar
 */
export function extractSectionsFromContent(
  content: TiptapContent | null
): { id: string; title: string; level: number }[] {
  const sections: { id: string; title: string; level: number }[] = [];

  if (!content || !content.content) {
    return sections;
  }

  const traverse = (nodes: TiptapNode[]) => {
    for (const node of nodes) {
      if (node.type === 'heading' && node.attrs?.level && (node.attrs.level as number) <= 3) {
        const text = node.content?.map((c) => c.text || '').join('') || '';
        if (text) {
          const id = text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos (acentos)
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
          sections.push({
            id,
            title: text,
            level: node.attrs.level as number,
          });
        }
      }
      if (node.content) {
        traverse(node.content);
      }
    }
  };

  traverse(content.content);
  return sections;
}
