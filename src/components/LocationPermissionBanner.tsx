"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X, ChevronDown } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationPermissionBannerProps {
  autoShow?: boolean;
  onLocationGranted?: (lat: number, lon: number, accuracy: number) => void;
  onLocationDenied?: () => void;
}

export function LocationPermissionBanner({
  autoShow = true,
  onLocationGranted,
  onLocationDenied,
}: LocationPermissionBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { error, isLoading, requestLocation } = useGeolocation({
    immediate: false,
    onSuccess: (loc) => {
      setIsVisible(false);
      onLocationGranted?.(loc.latitude, loc.longitude, loc.accuracy);
    },
    onError: (err) => {
      if (err.type === 'PERMISSION_DENIED') {
        localStorage.setItem('imagiq_location_rejected', 'true');
        setTimeout(() => setIsVisible(false), 3000);
        onLocationDenied?.();
      }
    },
  });

  useEffect(() => {
    if (!autoShow) return;

    const hasLocation = localStorage.getItem('imagiq_user_location');
    const wasRejected = localStorage.getItem('imagiq_location_rejected');

    if (!hasLocation && !wasRejected) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [autoShow]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[99999]
        bg-white border-b border-gray-200 shadow-md
        transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Icon */}
          <MapPin className="h-6 w-6 text-black flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-base font-semibold text-black">
                Para una mejor experiencia, activa tu ubicación
              </p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-600 hover:text-black transition-colors"
                aria-label={isExpanded ? 'Contraer' : 'Expandir'}
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {!isExpanded && (
              <p className="text-xs text-gray-600">
                Envío gratis, ofertas locales y entrega el mismo día
              </p>
            )}

            {isExpanded && (
              <div className="text-xs text-gray-600 space-y-1 mt-2">
                <p className="font-medium text-gray-900">Te perderías de:</p>
                <ul className="space-y-0.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span><strong>Envío gratis</strong> en productos cerca de ti</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span><strong>Ofertas exclusivas</strong> de tiendas en tu zona</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span><strong>Entrega el mismo día</strong> si estás cerca</span>
                  </li>
                </ul>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 mt-1">
                {error.type === 'PERMISSION_DENIED'
                  ? 'Permiso denegado. Puedes activarlo en configuración.'
                  : 'No se pudo obtener tu ubicación.'}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.setItem('imagiq_location_rejected', 'true');
                setIsVisible(false);
                onLocationDenied?.();
              }}
              disabled={isLoading}
              className="text-sm text-gray-600 hover:text-black"
            >
              Ahora no
            </Button>
            <Button
              size="sm"
              onClick={requestLocation}
              disabled={isLoading}
              className="text-sm bg-black text-white hover:bg-gray-800 font-semibold rounded-lg px-6 py-2"
            >
              {isLoading ? 'Obteniendo...' : 'Continuar'}
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-black transition-colors p-1.5 rounded hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
