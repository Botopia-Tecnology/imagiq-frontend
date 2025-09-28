import { MapPin, Navigation } from "lucide-react";

export interface Location {
  id: number;
  name: string;
  address: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
  city?: string;
  mall?: string;
  email?: string;
  saturday?: string;
  sunday?: string;
}

export interface StoreCardProps {
  store: Location;
}

/**
 * StoreCard - Card de información de tienda Samsung para popups de mapa
 * Visualmente premium, escalable y con UX mejorada. Usa iconos locales importados.
 *
 * Props:
 *   - store: Información de la tienda (Location)
 */
export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  // URLs para direcciones
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    store.address
  )}`;
  const wazeUrl = `https://waze.com/ul?ll=${store.lat},${store.lng}&navigate=yes`;

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-[300px] max-w-[350px] relative backdrop-blur-md overflow-hidden animate-fade-in">
      {/* Flecha decorativa para el popup */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45 z-10 shadow-sm"></div>
      <div className="space-y-2">
        {/* Título */}
        <h3 className="font-bold text-[#002142] text-base leading-tight mb-1 drop-shadow-sm tracking-tight">
          {store.name}
        </h3>
        {/* Dirección */}
        <div className="mb-1">
          <span className="font-semibold text-gray-800 text-xs">
            Dirección:
          </span>{" "}
          <span className="text-xs text-gray-600 font-medium break-words">
            {store.address}
          </span>
        </div>
        {/* Teléfono */}
        <div className="mb-1">
          <span className="font-semibold text-gray-800 text-xs">Teléfono:</span>{" "}
          <span className="text-xs text-gray-600 font-medium">
            {store.phone}
          </span>
        </div>
        {/* Email */}
        {store.email && (
          <div className="mb-1">
            <span className="font-semibold text-gray-800 text-xs">
              Correo Electrónico:
            </span>{" "}
            <span className="text-xs text-gray-600 font-medium break-words">
              {store.email}
            </span>
          </div>
        )}
        {/* Horario */}
        <div className="mb-1">
          <span className="font-semibold text-gray-800 text-xs">
            Horario de atención:
          </span>{" "}
          <span className="text-xs text-gray-600 font-medium">
            {store.hours}
          </span>
        </div>
        {store.saturday && (
          <div className="mb-1">
            <span className="text-xs text-gray-600 font-medium">
              {store.saturday}
            </span>
          </div>
        )}
        {store.sunday && (
          <div className="mb-1">
            <span className="text-xs text-gray-600 font-medium">
              {store.sunday}
            </span>
          </div>
        )}
        {/* Botones de direcciones */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#eaf3e7] hover:bg-[#d2e3c7] text-[#222] py-2 rounded-lg text-xs font-bold shadow transition-colors duration-200 border border-gray-200"
            tabIndex={0}
            aria-label="Abrir en Google Maps"
          >
            <MapPin className="w-5 h-5 text-green-600" />
            Ir con Maps
          </a>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#222] py-2 rounded-lg text-xs font-bold shadow transition-colors duration-200 border border-gray-200"
            tabIndex={0}
            aria-label="Abrir en Waze"
          >
            <Navigation className="w-5 h-5 text-blue-600" />
            Ir con Waze
          </a>
        </div>
      </div>
    </div>
  );
};
