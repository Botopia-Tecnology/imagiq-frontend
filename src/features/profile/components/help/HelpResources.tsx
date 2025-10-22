/**
 * @module HelpResources
 * @description Samsung-style additional resources section
 */

import React from 'react';
import { Book, MapPin, Shield, ChevronRight, HelpCircle } from 'lucide-react';

export const HelpResources: React.FC = () => {
  const resources = [
    {
      id: 'guia-compra',
      icon: Book,
      label: 'Guía de Compra',
      href: '/guia-compra',
    },
    {
      id: 'estado-envios',
      icon: MapPin,
      label: 'Estado de Envíos',
      href: '/estado-envios',
    },
    {
      id: 'politicas',
      icon: Shield,
      label: 'Políticas y Términos',
      href: '/politicas',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Resources */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recursos Adicionales</h3>
        <div className="space-y-2">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <a
                key={resource.id}
                href={resource.href}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
                  <span className="font-bold text-gray-900">{resource.label}</span>
                </div>
                <ChevronRight
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors"
                  strokeWidth={2}
                />
              </a>
            );
          })}
        </div>
      </div>

      {/* Help Notice */}
      <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">¿No encuentras lo que buscas?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta. No
              dudes en contactarnos a través de cualquiera de nuestros canales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpResources;
