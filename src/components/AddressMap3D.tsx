/**
 * @module AddressMap3D
 * @description Componente de mapa 3D para mostrar direcciones seleccionadas usando Google Maps
 */

import React, { useEffect, useRef, useState } from 'react';
import { PlaceDetails } from '@/types/places.types';
import { useGoogleMaps } from '@/services/googleMapsLoader';

interface AddressMap3DProps {
  /**
   * Dirección a mostrar en el mapa
   */
  address: PlaceDetails | null;

  /**
   * Altura del mapa
   */
  height?: string;

  /**
   * Ancho del mapa
   */
  width?: string;

  /**
   * Si debe mostrar los controles de zoom
   */
  showControls?: boolean;

  /**
   * Si debe estar en modo 3D
   */
  enable3D?: boolean;

  /**
   * Tipo de mapa
   */
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

  /**
   * Callback cuando el mapa está listo
   */
  onMapReady?: (map: google.maps.Map) => void;
}

export const AddressMap3D: React.FC<AddressMap3DProps> = ({
  address,
  height = '400px',
  width = '100%',
  showControls = true,
  enable3D = true,
  mapType = 'roadmap',
  onMapReady
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Usar el hook del servicio singleton
  const { isLoaded: isGoogleMapsLoaded, error: mapError, isLoading } = useGoogleMaps();

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || mapError || !isGoogleMapsLoaded) return;

    try {
      // Coordenadas por defecto (centro de Bogotá)
      const defaultLat = 4.570868;
      const defaultLng = -74.297333;

      // Configurar el mapa
      const mapOptions: google.maps.MapOptions = {
        center: { lat: defaultLat, lng: defaultLng },
        zoom: 15,
        mapTypeId: mapType as google.maps.MapTypeId,
        disableDefaultUI: !showControls,
        zoomControl: showControls,
        mapTypeControl: showControls,
        scaleControl: showControls,
        streetViewControl: showControls,
        rotateControl: showControls,
        fullscreenControl: showControls,
        gestureHandling: 'cooperative',
        styles: enable3D ? [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ saturation: -20 }]
          }
        ] : undefined
      };

      // Crear el mapa
      map.current = new google.maps.Map(mapContainer.current, mapOptions);

      // Habilitar modo 3D si está solicitado
      if (enable3D) {
        map.current.setTilt(45); // Ángulo de inclinación para efecto 3D
      }

      // Crear InfoWindow
      infoWindow.current = new google.maps.InfoWindow();

      setIsMapLoaded(true);
      onMapReady?.(map.current);

    } catch (error) {
      console.error('Error inicializando Google Maps:', error);
      setIsMapLoaded(false);
    }

    return () => {
      // Limpiar mapa si es necesario
      if (marker.current) {
        marker.current.setMap(null);
      }
      if (infoWindow.current) {
        infoWindow.current.close();
      }
    };
  }, [mapType, showControls, enable3D, onMapReady, mapError, isGoogleMapsLoaded]);

  // Actualizar marcador cuando cambia la dirección
  useEffect(() => {
    // Debug: Logging para verificar sincronización
    console.log('🗺️ AddressMap3D - Nueva dirección recibida:', {
      address,
      formattedAddress: address?.formattedAddress,
      latitude: address?.latitude,
      longitude: address?.longitude,
      name: address?.name,
      placeId: address?.placeId
    });

    if (!map.current || !isMapLoaded || !address) return;

    // Limpiar marcador anterior y cerrar InfoWindow
    if (marker.current) {
      marker.current.setMap(null);
      marker.current = null;
    }
    if (infoWindow.current) {
      infoWindow.current.close();
    }

    // Crear posición del marcador
    const position = { lat: address.latitude, lng: address.longitude };

    // Crear nuevo marcador personalizado
    marker.current = new google.maps.Marker({
      position: position,
      map: map.current,
      title: address.name || 'Ubicación seleccionada',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      animation: google.maps.Animation.DROP
    });

    // Crear contenido del InfoWindow más compacto con botón de cerrar personalizado
    const infoContent = `
      <div style="padding: 4px 6px; max-width: 180px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.2; position: relative;">
        <button
          onclick="document.querySelector('.gm-style-iw').parentElement.style.display='none'"
          style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 16px;
            height: 16px;
            border: none;
            border-radius: 50%;
            background: #374151;
            color: white;
            font-size: 10px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            font-weight: bold;
          "
          onmouseover="this.style.background='#1f2937'"
          onmouseout="this.style.background='#374151'"
        >×</button>
        <div style="margin: 0; font-size: 10px; color: #374151; font-weight: 500; word-wrap: break-word;">
          ${address.formattedAddress}
        </div>
        ${address.name ? `
          <div style="margin: 2px 0 0 0; font-size: 9px; color: #3b82f6; display: flex; align-items: center;">
            <span style="margin-right: 2px;">🏢</span>${address.name}
          </div>
        ` : ''}
      </div>
    `;

    // Configurar InfoWindow con opciones optimizadas
    if (infoWindow.current) {
      infoWindow.current.setContent(infoContent);

      // Configurar opciones del InfoWindow para minimizar espacio
      infoWindow.current.setOptions({
        maxWidth: 180,
        pixelOffset: new google.maps.Size(0, -5),
        disableAutoPan: false,
        zIndex: 1000
      });

      // Agregar listener para abrir InfoWindow al hacer clic
      marker.current.addListener('click', () => {
        infoWindow.current?.open(map.current, marker.current);

        // Aplicar estilos personalizados al InfoWindow
        setTimeout(() => {
          const infoWindowDiv = document.querySelector('.gm-style-iw');
          const infoWindowCloseButton = document.querySelector('.gm-style-iw button');

          if (infoWindowDiv) {
            const styledDiv = infoWindowDiv as HTMLElement;
            styledDiv.style.padding = '2px';
            styledDiv.style.borderRadius = '6px';
            styledDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          }

          if (infoWindowCloseButton) {
            // Ocultar completamente la X por defecto
            const styledButton = infoWindowCloseButton as HTMLElement;
            styledButton.style.display = 'none';
            styledButton.style.visibility = 'hidden';
            styledButton.style.opacity = '0';
          }

          // Buscar y ocultar también cualquier otro botón de cerrar
          const allCloseButtons = document.querySelectorAll('.gm-style-iw-c button, .gm-style-iw-d button');
          allCloseButtons.forEach(button => {
            const styledButton = button as HTMLElement;
            styledButton.style.display = 'none';
            styledButton.style.visibility = 'hidden';
            styledButton.style.opacity = '0';
          });

        }, 100);
      });
    }

    // Centrar mapa en la nueva ubicación con animación suave
    map.current.panTo(position);
    map.current.setZoom(17);

    // Mostrar InfoWindow automáticamente después de un momento
    setTimeout(() => {
      if (infoWindow.current && marker.current) {
        infoWindow.current.open(map.current, marker.current);

        // Aplicar estilos personalizados al InfoWindow después de que se abra
        setTimeout(() => {
          const infoWindowDiv = document.querySelector('.gm-style-iw');
          const infoWindowCloseButton = document.querySelector('.gm-style-iw button');

          if (infoWindowDiv) {
            const styledDiv = infoWindowDiv as HTMLElement;
            styledDiv.style.padding = '2px';
            styledDiv.style.borderRadius = '6px';
            styledDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          }

          if (infoWindowCloseButton) {
            // Ocultar completamente la X por defecto
            const styledButton = infoWindowCloseButton as HTMLElement;
            styledButton.style.display = 'none';
            styledButton.style.visibility = 'hidden';
            styledButton.style.opacity = '0';
          }

          // Buscar y ocultar también cualquier otro botón de cerrar
          const allCloseButtons = document.querySelectorAll('.gm-style-iw-c button, .gm-style-iw-d button');
          allCloseButtons.forEach(button => {
            const styledButton = button as HTMLElement;
            styledButton.style.display = 'none';
            styledButton.style.visibility = 'hidden';
            styledButton.style.opacity = '0';
          });

        }, 100);
      }
    }, 1000);

  }, [address, isMapLoaded]);

  if (mapError) {
    return (
      <div
        style={{ height, width }}
        className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-300"
      >
        <div className="text-center p-6 max-w-sm">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-blue-800 font-semibold mb-2">Google Maps No Disponible</h3>
          <p className="text-blue-600 text-sm mb-3 whitespace-pre-line">{mapError}</p>
          <div className="text-blue-500 text-xs space-y-1">
            <p>💡 Abre la consola del navegador (F12) para más detalles</p>
            <p>🔄 Recarga la página si el problema persiste</p>
          </div>
          {address && (
            <div className="mt-4 p-3 bg-white/70 rounded-lg">
              <p className="text-xs text-gray-700 font-medium">Dirección seleccionada:</p>
              <p className="text-xs text-gray-600 mt-1">{address.formattedAddress}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md">
      {/* Contenedor del mapa */}
      <div
        ref={mapContainer}
        style={{ height, width }}
        className="bg-gray-100"
      />

      {/* Indicador de carga */}
      {(!isMapLoaded || !isGoogleMapsLoaded || isLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-1"></div>
            <p className="text-gray-600 text-xs">
              {isLoading || !isGoogleMapsLoaded ? 'Cargando...' : 'Iniciando...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressMap3D;