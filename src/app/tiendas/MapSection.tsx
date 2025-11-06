import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FormattedStore } from "@/types/store";

interface MapSectionProps {
  stores: FormattedStore[];
}

// Custom Samsung pin icon
const samsungIcon = L.divIcon({
  className: "custom-samsung-pin",
  html: `
    <div style="width:32px;height:40px;display:flex;align-items:center;justify-content:center;">
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.27 0 0 7.56 0 16.9C0 27.1 16 40 16 40C16 40 32 27.1 32 16.9C32 7.56 24.73 0 16 0Z" fill="#1D8AFF"/>
        <text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle" font-family="Samsung Sharp Sans, Arial, sans-serif" font-size="18" font-weight="bold" fill="white">S</text>
      </svg>
    </div>
  `,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

export default function MapSection({ stores }: MapSectionProps) {
  // Filtrar solo tiendas con coordenadas válidas para mostrar en el mapa
  const storesWithValidCoords = stores.filter(
    (store) => store.latitud !== 0 && store.longitud !== 0 &&
               !isNaN(store.latitud) && !isNaN(store.longitud)
  );

  return (
    <div
      className="absolute z-0"
      style={{
        left: 30,
        right: 30,
        top: 0,
        bottom: 0,
        position: "absolute",
        height: "1350px",
        minHeight: "1350px",
        maxHeight: "1400px",
        width: "auto",
        borderRadius: "32px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
      }}
    >
      <MapContainer
        center={[4.6482837, -74.2478936]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {storesWithValidCoords.map((store) => (
          <Marker key={store.codigo} position={store.position} icon={samsungIcon}>
            <Popup>
              <b>{store.descripcion}</b>
              <br />
              {store.direccion}
              {store.ubicacion_cc && (
                <>
                  <br />
                  <small>{store.ubicacion_cc}</small>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
