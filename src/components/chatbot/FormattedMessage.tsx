/**
 * Componente para formatear mensajes del chatbot
 * Convierte markdown básico y saltos de línea a HTML
 */

import React from 'react';

interface FormattedMessageProps {
  text: string;
}

export function FormattedMessage({ text }: FormattedMessageProps) {
  // Función para formatear el texto
  const formatText = (rawText: string) => {
    // Convertir **texto** a <strong>texto</strong>
    let formatted = rawText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Convertir URLs a enlaces clickeables
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
    );
    
    // Convertir emails a enlaces mailto
    formatted = formatted.replace(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g,
      '<a href="mailto:$1" class="text-blue-600 hover:underline">$1</a>'
    );
    
    // Convertir números de teléfono a enlaces tel
    formatted = formatted.replace(
      /(?:Teléfono:|Tel:|Tél:)\s*(\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4,5})/gi,
      'Teléfono: <a href="tel:$1" class="text-blue-600 hover:underline">$1</a>'
    );
    
    return formatted;
  };

  // Dividir por saltos de línea y procesar cada línea
  const lines = text.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmedLine = line.trim();
        
        // Detectar si es un elemento de lista (comienza con número. o -)
        const isNumberedList = /^\d+\.\s/.test(trimmedLine);
        const isBulletList = /^[-•]\s/.test(trimmedLine);
        
        if (isNumberedList || isBulletList) {
          return (
            <div 
              key={idx}
              className="flex gap-2 items-start"
            >
              <span 
                className="flex-shrink-0 text-blue-600 font-semibold"
                dangerouslySetInnerHTML={{ 
                  __html: formatText(trimmedLine.match(/^(\d+\.|-|•)/)?.[0] || '') 
                }}
              />
              <span 
                dangerouslySetInnerHTML={{ 
                  __html: formatText(trimmedLine.replace(/^(\d+\.|-|•)\s*/, '')) 
                }}
              />
            </div>
          );
        }
        
        // Línea normal
        return (
          <div 
            key={idx}
            dangerouslySetInnerHTML={{ __html: formatText(trimmedLine) }}
          />
        );
      })}
    </div>
  );
}
