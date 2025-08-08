import React from "react";
import { MapPin, Phone, Clock } from "lucide-react";

interface Location {
  id: number;
  name: string;
  address: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
  city?: string;
  mall?: string;
}

interface StoreCardProps {
  store: Location;
  onDirectionsClick?: (store: Location) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onDirectionsClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[300px] max-w-[340px] relative backdrop-blur-sm overflow-hidden">
      {/* Arrow pointing up to marker */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 z-10 shadow-sm"></div>

      {/* Store Information */}
      <div className="space-y-4">
        {/* Header Section */}
        <div className="pb-3 border-b border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-900 text-base leading-tight pr-2">
              {store.name}
            </h3>
            {store.city && (
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 whitespace-nowrap">
                <MapPin className="w-3 h-3 mr-1" />
                {store.city}
              </span>
            )}
          </div>

          {store.mall && (
            <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              <span className="text-sm mr-1.5">🏬</span>
              <p className="text-xs font-medium leading-tight">{store.mall}</p>
            </div>
          )}
        </div>

        {/* Contact Details Section */}
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-7 h-7 bg-red-50 rounded-full flex items-center justify-center mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-800 mb-1">
                Dirección
              </p>
              <p className="text-sm text-gray-600 leading-relaxed break-words">
                {store.address}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-7 h-7 bg-green-50 rounded-full flex items-center justify-center mt-0.5">
              <Phone className="w-3.5 h-3.5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-800 mb-1">
                Teléfono
              </p>
              <a
                href={`tel:${store.phone}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors block hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {store.phone}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center mt-0.5">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-800 mb-1">
                Horarios
              </p>
              <p className="text-sm text-gray-600 leading-relaxed break-words">
                {store.hours}
              </p>
            </div>
          </div>
        </div>

        {/* Directions Button */}
        {onDirectionsClick && (
          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={() => onDirectionsClick(store)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Cómo llegar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export type { Location };
