"use client";

import { useState } from "react";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";

interface ServiceLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  services: string[];
  distance: string;
}

export default function ServiceLocations() {
  const [selectedCity, setSelectedCity] = useState("bogota");
  const [searchLocation, setSearchLocation] = useState("");

  const cities = [
    { id: "bogota", name: "Bogotá" },
    { id: "medellin", name: "Medellín" },
    { id: "cali", name: "Cali" },
    { id: "barranquilla", name: "Barranquilla" },
    { id: "cartagena", name: "Cartagena" }
  ];

  const serviceLocations: ServiceLocation[] = [
    {
      id: "1",
      name: "Samsung Service Center Zona Rosa",
      address: "Calle 85 #11-45, Zona Rosa",
      city: "Bogotá",
      phone: "+57 1 234-5678",
      hours: "Lun - Vie: 8:00 AM - 6:00 PM, Sáb: 9:00 AM - 4:00 PM",
      services: ["Móviles", "Televisores", "Electrodomésticos"],
      distance: "2.3 km"
    },
    {
      id: "2",
      name: "Samsung Service Andino",
      address: "Centro Comercial Andino, Local 245",
      city: "Bogotá", 
      phone: "+57 1 234-5679",
      hours: "Lun - Dom: 10:00 AM - 9:00 PM",
      services: ["Móviles", "Audio", "Accesorios"],
      distance: "4.7 km"
    },
    {
      id: "3",
      name: "Samsung Service Unicentro",
      address: "Centro Comercial Unicentro, Piso 2",
      city: "Bogotá",
      phone: "+57 1 234-5680",
      hours: "Lun - Sáb: 10:00 AM - 8:00 PM, Dom: 11:00 AM - 7:00 PM",
      services: ["Móviles", "Televisores", "Audio"],
      distance: "8.1 km"
    }
  ];

  const filteredLocations = serviceLocations.filter(location => 
    location.city.toLowerCase() === selectedCity.toLowerCase() &&
    (searchLocation === "" || 
     location.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
     location.address.toLowerCase().includes(searchLocation.toLowerCase()))
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Centros de Servicio Autorizados
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra el centro de servicio Samsung más cercano a tu ubicación. 
            Todos nuestros centros cuentan con técnicos certificados y repuestos originales.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* City Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona tu ciudad
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por ubicación específica
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Zona, centro comercial, dirección..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Locations List */}
        <div className="space-y-6">
          {filteredLocations.map((location) => (
            <div key={location.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Location Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {location.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{location.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{location.hours}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-blue-600 font-medium">
                        <Navigation className="h-4 w-4 mr-1" />
                        {location.distance}
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Servicios disponibles:</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Reservar Cita
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors">
                    Ver en Mapa
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    Llamar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron centros de servicio
            </h3>
            <p className="text-gray-600">
              Intenta buscar en otra ciudad o ajusta los términos de búsqueda.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿No encuentras un centro cerca?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            También ofrecemos servicio de recolección y entrega a domicilio en algunas ciudades. 
            Contacta nuestro centro de atención al cliente para más información.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Servicio a Domicilio
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
