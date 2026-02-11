'use client';

import React, { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Tipos locales para evitar problemas de importación circular
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

/**
 * Renderiza marcas de texto (bold, italic, link, etc.)
 */
export function renderMarks(text: string, marks?: TiptapMark[]): React.ReactNode {
  if (!marks || marks.length === 0) return text;

  return marks.reduce((acc: React.ReactNode, mark: TiptapMark) => {
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
        return <mark className="bg-yellow-200 px-1 rounded">{acc}</mark>;
      case 'link': {
        const href = (mark.attrs?.href as string) || '#';
        const isExternal = href.startsWith('http');
        if (isExternal) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">
              {acc}
            </a>
          );
        }
        return <Link href={href} className="text-blue-600 underline hover:text-blue-800 transition-colors">{acc}</Link>;
      }
      default:
        return acc;
    }
  }, text);
}

/**
 * Renderiza un nodo Tiptap individual
 */
export function renderNode(node: TiptapNode, index: number): React.ReactNode {
  const key = `node-${index}-${node.type}`;

  switch (node.type) {
    case 'text':
      return <Fragment key={key}>{renderMarks(node.text || '', node.marks)}</Fragment>;

    case 'paragraph': {
      const textAlign = (node.attrs?.textAlign as string) || 'left';
      return (
        <p key={key} className="mb-4 text-gray-700 leading-relaxed" style={{ textAlign: textAlign as 'left' | 'center' | 'right' | 'justify' }}>
          {node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}
        </p>
      );
    }

    case 'heading':
      return renderHeading(node, key);

    case 'bulletList':
      return (
        <ul key={key} className="list-disc list-inside mb-4 space-y-1 text-gray-700 pl-4">
          {node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={key} className="list-decimal list-inside mb-4 space-y-1 text-gray-700 pl-4">
          {node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}
        </ol>
      );

    case 'listItem':
      return (
        <li key={key} className="leading-relaxed">
          {node.content?.map((child: TiptapNode, i: number) => {
            if (child.type === 'paragraph') {
              return child.content?.map((c: TiptapNode, j: number) => renderNode(c, j));
            }
            return renderNode(child, i);
          })}
        </li>
      );

    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic text-gray-600 bg-gray-50">
          {node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}
        </blockquote>
      );

    case 'horizontalRule':
      return <hr key={key} className="my-6 border-gray-200" />;

    case 'hardBreak':
      return <br key={key} />;

    case 'image':
      return renderImage(node, key);

    case 'table':
      return renderTable(node, key);

    case 'tableRow':
      return <tr key={key} className="border-b border-gray-300">{node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}</tr>;

    case 'tableHeader':
      return (
        <th key={key} className="border border-gray-300 bg-gray-100 p-3 text-left font-semibold text-gray-900" colSpan={(node.attrs?.colspan as number) || 1} rowSpan={(node.attrs?.rowspan as number) || 1}>
          {node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}
        </th>
      );

    case 'tableCell':
      return (
        <td key={key} className="border border-gray-300 p-3 text-gray-700" colSpan={(node.attrs?.colspan as number) || 1} rowSpan={(node.attrs?.rowspan as number) || 1}>
          {node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}
        </td>
      );

    case 'codeBlock':
      return (
        <pre key={key} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}</code>
        </pre>
      );

    case 'code':
      return <code key={key} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm">{node.text}</code>;

    default:
      if (node.content) {
        return <Fragment key={key}>{node.content.map((child: TiptapNode, i: number) => renderNode(child, i))}</Fragment>;
      }
      return null;
  }
}

function renderHeading(node: TiptapNode, key: string): React.ReactNode {
  const level = (node.attrs?.level as number) || 2;
  const headingAlign = (node.attrs?.textAlign as string) || 'left';
  const headingId = node.content
    ?.map((c: TiptapNode) => c.text || '')
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^\w\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .substring(0, 50);

  const headingClasses: Record<number, string> = {
    1: 'text-3xl font-bold mb-6 mt-8 text-black',
    2: 'text-2xl font-bold mb-4 mt-6 text-black',
    3: 'text-xl font-semibold mb-3 mt-5 text-gray-900',
    4: 'text-lg font-semibold mb-2 mt-4 text-gray-900',
  };

  return React.createElement(
    `h${level}` as 'h1' | 'h2' | 'h3' | 'h4',
    { key, id: headingId, className: headingClasses[level] || headingClasses[2], style: { textAlign: headingAlign } },
    node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))
  );
}

function renderImage(node: TiptapNode, key: string): React.ReactNode {
  const src = (node.attrs?.src as string) || '';
  const alt = (node.attrs?.alt as string) || 'Imagen';
  const title = (node.attrs?.title as string) || '';

  if (!src) return null;

  return (
    <figure key={key} className="my-6">
      <Image src={src} alt={alt} title={title} width={800} height={400} className="rounded-lg max-w-full h-auto" style={{ objectFit: 'contain' }} />
      {title && <figcaption className="text-center text-sm text-gray-500 mt-2">{title}</figcaption>}
    </figure>
  );
}

function renderTable(node: TiptapNode, key: string): React.ReactNode {
  return (
    <div key={key} className="overflow-x-auto mb-6">
      <table className="min-w-full border-collapse border border-gray-300">
        <tbody>{node.content?.map((child: TiptapNode, i: number) => renderNode(child, i))}</tbody>
      </table>
    </div>
  );
}
