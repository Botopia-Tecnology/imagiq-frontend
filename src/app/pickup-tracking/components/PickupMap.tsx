"use client";


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import "leaflet/dist/leaflet.css";

interface PickupMapProps {
  direccionTienda?: string;
  ciudadTienda?: string;
  nombreTienda?: string;
  descripcionTienda?: string;
  latitudTienda?: string;
  longitudTienda?: string;
}

export default function PickupMap({
  direccionTienda,
  ciudadTienda,
  nombreTienda,
  descripcionTienda,
  latitudTienda,
  longitudTienda,
}: Readonly<PickupMapProps>) {
  // Remover "Ses" del inicio de la descripción si existe
  const nombreTiendaFormateado = descripcionTienda
    ? descripcionTienda.replace(/^Ses\s+/i, '').trim()
    : nombreTienda || "Tienda IMAGIQ";

  // Construir dirección completa
  const fullTiendaAddress = direccionTienda && ciudadTienda
    ? `${direccionTienda}, ${ciudadTienda}`
    : direccionTienda || nombreTiendaFormateado || "Ubicación de la tienda";

  // Coordenadas de la tienda (usar coordenadas reales de la API)
  const tiendaCoords: [number, number] | null = (() => {
    if (latitudTienda && longitudTienda) {
      const lat = Number.parseFloat(String(latitudTienda).trim());
      const lng = Number.parseFloat(String(longitudTienda).trim());
      // Validar que sean números válidos y dentro de rangos razonables
      if (!Number.isNaN(lat) && !Number.isNaN(lng) && 
          lat >= -90 && lat <= 90 && 
          lng >= -180 && lng <= 180) {
        return [lat, lng];
      }
    }
    // Si hay dirección pero no coordenadas, usar coordenadas por defecto de Bogotá
    if (direccionTienda) {
      return [4.6097, -74.0817]; // Bogotá centro como fallback
    }
    return null;
  })();

  // Icono para la tienda (azul)
  const tiendaIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="width:40px;height:50px;display:flex;align-items:center;justify-content:center;">
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C9.09 0 0 9.45 0 21.13C0 33.88 20 50 20 50C20 50 40 33.88 40 21.13C40 9.45 30.91 0 20 0Z" fill="#2563eb" stroke="white" stroke-width="3"/>
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white">S</text>
        </svg>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center aspect-square flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-black text-base mb-1">Ubicación de la tienda</h3>
              <p className="text-sm text-gray-500">
                {nombreTiendaFormateado}
              </p>
              {direccionTienda && (
                <p className="text-xs text-gray-600 mt-1">
                  {fullTiendaAddress}
                </p>
              )}
            </div>
          </div>
          
          {/* Navigation Buttons - Moved to header */}
          {(direccionTienda || nombreTiendaFormateado) && (
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullTiendaAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-400 text-white rounded-[12px] hover:bg-gray-500 transition text-sm font-medium shadow-sm"
              >
                <Image 
                  src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445116/Google_Maps_icon__2020.svg_r4s0ks.png" 
                  alt="Google Maps"
                  width={14}
                  height={16}
                  className="w-3.5 h-4"
                />
                Maps
              </a>
              <a
                href={`https://waze.com/ul?q=${encodeURIComponent(fullTiendaAddress)}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-[#33CCFF] text-white rounded-[12px] hover:bg-[#00B8E6] transition text-sm font-medium shadow-sm"
              >
                <Image 
                  src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445166/unnamed_jfcf46.png" 
                  alt="Waze"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                Waze
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map */}
      {(tiendaCoords || direccionTienda || nombreTiendaFormateado) && (
        <div className="relative w-full h-[350px]">
          {tiendaCoords ? (
            <MapContainer
              center={tiendaCoords}
              zoom={15}
              scrollWheelZoom={true}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Marcador de la Tienda */}
              <Marker position={tiendaCoords} icon={tiendaIcon}>
                <Popup>
                  <b>{nombreTiendaFormateado}</b>
                  <br />
                  {fullTiendaAddress}
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Cargando mapa...</p>
            </div>
          )}
        </div>
      )}

      {/* Store Info - Instructions */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 aspect-square">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Instrucciones para recoger tu pedido:
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              Presenta tu <strong>identificación</strong> y el <strong>token personal</strong> al personal de la tienda para recoger tu pedido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Named export for compatibility
export { PickupMap };