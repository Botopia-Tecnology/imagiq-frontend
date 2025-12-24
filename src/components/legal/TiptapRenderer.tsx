'use client';

import React, { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Tipos para el contenido de Tiptap
interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

interface TiptapContent {
  type: 'doc';
  content: TiptapNode[];
}

interface TiptapRendererProps {
  content: TiptapContent | null;
  className?: string;
}

// Renderizar marcas (bold, italic, etc.)
function renderMarks(text: string, marks?: TiptapMark[]): React.ReactNode {
  if (!marks || marks.length === 0) {
    return text;
  }

  return marks.reduce((acc: React.ReactNode, mark) => {
    switch (mark.type) {
      case 'bold':
        return <strong>{acc}</strong>;
      case 'italic':
        return <em>{acc}</em>;
      case 'underline':
        return <u>{acc}</u>;
      case 'strike':
        return <s>{acc}</s>;
      case 'highlight':
        return (
          <mark className="bg-yellow-200 px-1 rounded">
            {acc}
          </mark>
        );
      case 'link':
        const href = (mark.attrs?.href as string) || '#';
        const isExternal = href.startsWith('http');
        if (isExternal) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              {acc}
            </a>
          );
        }
        return (
          <Link href={href} className="text-blue-600 underline hover:text-blue-800 transition-colors">
            {acc}
          </Link>
        );
      default:
        return acc;
    }
  }, text);
}

// Renderizar un nodo individual
function renderNode(node: TiptapNode, index: number): React.ReactNode {
  const key = `node-${index}-${node.type}`;

  switch (node.type) {
    case 'text':
      return (
        <Fragment key={key}>
          {renderMarks(node.text || '', node.marks)}
        </Fragment>
      );

    case 'paragraph':
      const textAlign = (node.attrs?.textAlign as string) || 'left';
      return (
        <p
          key={key}
          className="mb-4 text-gray-700 leading-relaxed"
          style={{ textAlign: textAlign as 'left' | 'center' | 'right' | 'justify' }}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </p>
      );

    case 'heading':
      const level = (node.attrs?.level as number) || 2;
      const headingAlign = (node.attrs?.textAlign as string) || 'left';
      const headingId = node.content
        ?.map((c) => c.text || '')
        .join('')
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      const headingClasses: Record<number, string> = {
        1: 'text-3xl font-bold mb-6 mt-8 text-black',
        2: 'text-2xl font-bold mb-4 mt-6 text-black',
        3: 'text-xl font-semibold mb-3 mt-5 text-gray-900',
        4: 'text-lg font-semibold mb-2 mt-4 text-gray-900',
      };

      return React.createElement(
        `h${level}` as 'h1' | 'h2' | 'h3' | 'h4',
        {
          key,
          id: headingId,
          className: headingClasses[level] || headingClasses[2],
          style: { textAlign: headingAlign as 'left' | 'center' | 'right' | 'justify' },
        },
        node.content?.map((child, i) => renderNode(child, i))
      );

    case 'bulletList':
      return (
        <ul key={key} className="list-disc list-inside mb-4 space-y-1 text-gray-700 pl-4">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={key} className="list-decimal list-inside mb-4 space-y-1 text-gray-700 pl-4">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      );

    case 'listItem':
      return (
        <li key={key} className="leading-relaxed">
          {node.content?.map((child, i) => {
            // Si el contenido es un párrafo, renderizarlo sin el wrapper p
            if (child.type === 'paragraph') {
              return child.content?.map((c, j) => renderNode(c, j));
            }
            return renderNode(child, i);
          })}
        </li>
      );

    case 'blockquote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic text-gray-600 bg-gray-50"
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case 'horizontalRule':
      return <hr key={key} className="my-6 border-gray-200" />;

    case 'hardBreak':
      return <br key={key} />;

    case 'image':
      const src = (node.attrs?.src as string) || '';
      const alt = (node.attrs?.alt as string) || 'Imagen';
      const title = (node.attrs?.title as string) || '';

      if (!src) return null;

      return (
        <figure key={key} className="my-6">
          <Image
            src={src}
            alt={alt}
            title={title}
            width={800}
            height={400}
            className="rounded-lg max-w-full h-auto"
            style={{ objectFit: 'contain' }}
          />
          {title && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {title}
            </figcaption>
          )}
        </figure>
      );

    case 'table':
      return (
        <div key={key} className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <tbody>
              {node.content?.map((child, i) => renderNode(child, i))}
            </tbody>
          </table>
        </div>
      );

    case 'tableRow':
      return (
        <tr key={key} className="border-b border-gray-300">
          {node.content?.map((child, i) => renderNode(child, i))}
        </tr>
      );

    case 'tableHeader':
      return (
        <th
          key={key}
          className="border border-gray-300 bg-gray-100 p-3 text-left font-semibold text-gray-900"
          colSpan={(node.attrs?.colspan as number) || 1}
          rowSpan={(node.attrs?.rowspan as number) || 1}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </th>
      );

    case 'tableCell':
      return (
        <td
          key={key}
          className="border border-gray-300 p-3 text-gray-700"
          colSpan={(node.attrs?.colspan as number) || 1}
          rowSpan={(node.attrs?.rowspan as number) || 1}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </td>
      );

    case 'codeBlock':
      return (
        <pre
          key={key}
          className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm"
        >
          <code>
            {node.content?.map((child, i) => renderNode(child, i))}
          </code>
        </pre>
      );

    case 'code':
      return (
        <code key={key} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm">
          {node.text}
        </code>
      );

    default:
      // Para nodos desconocidos, intentar renderizar su contenido
      if (node.content) {
        return (
          <Fragment key={key}>
            {node.content.map((child, i) => renderNode(child, i))}
          </Fragment>
        );
      }
      return null;
  }
}

export function TiptapRenderer({ content, className = '' }: TiptapRendererProps) {
  if (!content || !content.content) {
    return (
      <div className={`text-gray-500 ${className}`}>
        No hay contenido disponible.
      </div>
    );
  }

  return (
    <div className={`tiptap-content ${className}`}>
      {content.content.map((node, index) => renderNode(node, index))}
    </div>
  );
}

// Función helper para extraer secciones del contenido (para el sidebar)
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

export default TiptapRenderer;
