"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DeliveryMapProps {
  direccionOrigen?: string;
  direccionDestino?: string;
  ciudadDestino?: string;
}

export function DeliveryMap({
  direccionOrigen = "Carrera 11 #82-71, Centro Comercial Andino", // Tienda IMAGIQ por defecto
  direccionDestino,
  ciudadDestino = "Bogotá",
}: Readonly<DeliveryMapProps>) {
  const fullDestinoAddress = direccionDestino
    ? `${direccionDestino}, ${ciudadDestino}`
    : "Dirección de entrega";

  // Coordenadas de la tienda IMAGIQ (Centro Comercial Andino)
  const origenCoords: [number, number] = [4.6682, -74.0538];

  // Coordenadas por defecto para el destino (Bogotá centro)
  const [destinoCoords, setDestinoCoords] = useState<[number, number]>([4.6097, -74.0817]);

  // Icono para punto de origen (verde)
  const origenIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="width:40px;height:50px;display:flex;align-items:center;justify-content:center;">
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C9.09 0 0 9.45 0 21.13C0 33.88 20 50 20 50C20 50 40 33.88 40 21.13C40 9.45 30.91 0 20 0Z" fill="#10B981" stroke="white" stroke-width="3"/>
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white">A</text>
        </svg>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

  // Icono para punto de destino (rojo)
  const destinoIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="width:40px;height:50px;display:flex;align-items:center;justify-content:center;">
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C9.09 0 0 9.45 0 21.13C0 33.88 20 50 20 50C20 50 40 33.88 40 21.13C40 9.45 30.91 0 20 0Z" fill="#EF4444" stroke="white" stroke-width="3"/>
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white">B</text>
        </svg>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

  // Geocodificar la dirección de destino si existe
  useEffect(() => {
    if (direccionDestino) {
      const geocodeAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullDestinoAddress)}&limit=1`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            setDestinoCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        } catch (error) {
          console.error("Error geocoding address:", error);
        }
      };
      geocodeAddress();
    }
  }, [direccionDestino, fullDestinoAddress]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
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
            <h3 className="font-semibold text-gray-900">Ruta de Entrega</h3>
            <p className="text-sm text-gray-600">
              Desde tienda IMAGIQ hasta tu dirección
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative w-full h-[350px]">
        <MapContainer
          center={origenCoords}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcador de Origen (Tienda IMAGIQ) */}
          <Marker position={origenCoords} icon={origenIcon}>
            <Popup>
              <b>A - Tienda IMAGIQ</b>
              <br />
              {direccionOrigen}
            </Popup>
          </Marker>

          {/* Marcador de Destino */}
          <Marker position={destinoCoords} icon={destinoIcon}>
            <Popup>
              <b>B - Tu Dirección</b>
              <br />
              {fullDestinoAddress}
            </Popup>
          </Marker>

          {/* Línea de ruta entre origen y destino */}
          <Polyline
            positions={[origenCoords, destinoCoords]}
            pathOptions={{
              color: "#17407A",
              weight: 4,
              opacity: 0.7,
              dashArray: "10, 10",
            }}
          />
        </MapContainer>
      </div>

      {/* Route Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-start gap-4">
          {/* Origen */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">
                Origen
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-8">
              {direccionOrigen}
            </p>
          </div>

          {/* Flecha */}
          <div className="flex items-center pt-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>

          {/* Destino */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">
                Destino
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-8">
              {fullDestinoAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
