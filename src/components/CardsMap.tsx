import Image from "next/image";

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
    <div className="p-2 min-w-[280px] max-w-[320px]">
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
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-400 hover:bg-gray-500 py-2 rounded-lg text-[11px] font-bold shadow transition-colors duration-200"
            tabIndex={0}
            aria-label="Abrir en Google Maps"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            <Image 
              src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445116/Google_Maps_icon__2020.svg_r4s0ks.png" 
              alt="Google Maps"
              width={12}
              height={14}
              className="w-3 h-3.5 flex-shrink-0"
            />
            <span className="leading-[1]" style={{ color: 'white' }}>Maps</span>
          </a>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#33CCFF] hover:bg-[#2BB8E6] py-2 rounded-lg text-[11px] font-bold shadow transition-colors duration-200"
            tabIndex={0}
            aria-label="Abrir en Waze"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            <Image 
              src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445166/unnamed_jfcf46.png" 
              alt="Waze"
              width={14}
              height={14}
              className="w-3.5 h-3.5 flex-shrink-0"
            />
            <span className="leading-[1]" style={{ color: 'white' }}>Waze</span>
          </a>
        </div>
      </div>
    </div>
  );
};
