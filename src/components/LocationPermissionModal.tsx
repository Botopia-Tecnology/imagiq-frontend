"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { formatAccuracy } from '@/lib/geolocation';

interface LocationPermissionModalProps {
  /**
   * Mostrar el modal automáticamente al cargar
   */
  autoShow?: boolean;

  /**
   * Callback cuando se obtiene la ubicación
   */
  onLocationGranted?: (lat: number, lon: number, accuracy: number) => void;

  /**
   * Callback cuando se niega el permiso
   */
  onLocationDenied?: () => void;
}

export function LocationPermissionModal({
  autoShow = true,
  onLocationGranted,
  onLocationDenied,
}: LocationPermissionModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const { location, error, isLoading, requestLocation, permissionStatus } = useGeolocation({
    immediate: false,
    onSuccess: (loc) => {
      setIsVisible(false);
      onLocationGranted?.(loc.latitude, loc.longitude, loc.accuracy);
    },
    onError: (err) => {
      if (err.type === 'PERMISSION_DENIED') {
        setIsVisible(false);
        onLocationDenied?.();
      }
    },
  });

  // Mostrar modal automáticamente
  useEffect(() => {
    if (!autoShow) return;

    // No mostrar si ya se obtuvo la ubicación o si el usuario la rechazó
    const hasLocation = localStorage.getItem('imagiq_user_location');
    const wasRejected = localStorage.getItem('imagiq_location_rejected');

    if (!hasLocation && !wasRejected && !isDismissed) {
      // Esperar un poco antes de mostrar el modal
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoShow, isDismissed]);

  const handleAllow = async () => {
    await requestLocation();
  };

  const handleDeny = () => {
    localStorage.setItem('imagiq_location_rejected', 'true');
    setIsVisible(false);
    setIsDismissed(true);
    onLocationDenied?.();
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4 pointer-events-auto animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              ¿Permitir acceso a tu ubicación?
            </h2>
            <p className="text-sm text-gray-600">
              Usaremos tu ubicación para mostrarte productos y servicios disponibles cerca de ti,
              calcular costos de envío más precisos y brindarte una mejor experiencia.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700">Beneficios:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-black mt-0.5">✓</span>
                <span>Productos disponibles en tu zona</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-0.5">✓</span>
                <span>Cálculo preciso de costos de envío</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-0.5">✓</span>
                <span>Tiendas físicas cercanas</span>
              </li>
            </ul>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg">
              {error.type === 'PERMISSION_DENIED'
                ? 'Has denegado el permiso de ubicación. Puedes cambiarlo en la configuración de tu navegador.'
                : error.type === 'POSITION_UNAVAILABLE'
                ? 'No pudimos obtener tu ubicación. Verifica que el GPS esté activado.'
                : error.type === 'TIMEOUT'
                ? 'La solicitud tardó demasiado. Intenta nuevamente.'
                : 'Ocurrió un error al obtener tu ubicación.'}
            </div>
          )}

          {/* Location info */}
          {location && (
            <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg">
              <p className="font-semibold">Ubicación obtenida</p>
              <p className="mt-1">
                Precisión: {formatAccuracy(location.accuracy)} ({Math.round(location.accuracy)}m)
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleDeny}
              disabled={isLoading}
              className="flex-1"
            >
              Ahora no
            </Button>
            <Button
              onClick={handleAllow}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Obteniendo...
                </span>
              ) : (
                'Permitir'
              )}
            </Button>
          </div>

          {/* Privacy note */}
          <p className="text-xs text-gray-500 text-center pt-2">
            Tu privacidad es importante. No compartimos tu ubicación con terceros.
          </p>
        </div>
      </div>
    </>
  );
}
