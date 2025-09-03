"use client";

import { useState } from "react";
import { Smartphone, Monitor, Home, Headphones, Clock, MapPin } from "lucide-react";

interface RepairTypesProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
}

export default function RepairTypes({ selectedService, onServiceSelect }: RepairTypesProps) {
  const [activeTab, setActiveTab] = useState("tipos");

  const repairCategories = [
    {
      id: "moviles",
      name: "Dispositivos Móviles",
      icon: Smartphone,
      services: [
        "Reparación de pantalla",
        "Cambio de batería",
        "Reparación de cámara",
        "Problemas de software",
        "Daños por agua"
      ],
      timeEstimate: "1-3 días hábiles"
    },
    {
      id: "tv",
      name: "Televisores y AV",
      icon: Monitor,
      services: [
        "Reparación de pantalla",
        "Problemas de imagen",
        "Fallas de audio",
        "Conectividad WiFi",
        "Actualización de software"
      ],
      timeEstimate: "3-7 días hábiles"
    },
    {
      id: "electrodomesticos",
      name: "Electrodomésticos",
      icon: Home,
      services: [
        "Refrigeradores",
        "Lavadoras y secadoras",
        "Aires acondicionados",
        "Hornos microondas",
        "Lavavajillas"
      ],
      timeEstimate: "2-5 días hábiles"
    },
    {
      id: "audio",
      name: "Audio y Accesorios",
      icon: Headphones,
      services: [
        "Auriculares Galaxy",
        "Soundbars",
        "Altavoces Bluetooth",
        "Cargadores",
        "Fundas y protectores"
      ],
      timeEstimate: "1-2 días hábiles"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tipos de Reparación
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Selecciona el tipo de dispositivo que necesitas reparar para obtener 
            información específica sobre nuestros servicios.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <button
              onClick={() => setActiveTab("tipos")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "tipos"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Tipos de Servicio
            </button>
            <button
              onClick={() => setActiveTab("proceso")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "proceso"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Proceso de Reparación
            </button>
          </div>
        </div>

        {activeTab === "tipos" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {repairCategories.map((category) => (
              <div
                key={category.id}
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
                  selectedService === category.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent hover:border-blue-200"
                }`}
                onClick={() => onServiceSelect(category.id)}
              >
                <div className="text-center mb-4">
                  <div className={`p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center ${
                    selectedService === category.id ? "bg-blue-600" : "bg-blue-100"
                  }`}>
                    <category.icon className={`h-8 w-8 ${
                      selectedService === category.id ? "text-white" : "text-blue-600"
                    }`} />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  {category.name}
                </h3>
                
                <ul className="space-y-2 mb-4">
                  {category.services.map((service, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {service}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {category.timeEstimate}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "proceso" && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Diagnóstico
                </h3>
                <p className="text-gray-600">
                  Nuestros técnicos certificados realizan una evaluación completa 
                  de tu dispositivo para identificar el problema.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reparación
                </h3>
                <p className="text-gray-600">
                  Utilizamos repuestos originales Samsung y seguimos estrictos 
                  protocolos de calidad para la reparación.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Entrega
                </h3>
                <p className="text-gray-600">
                  Te notificamos cuando tu dispositivo esté listo y puedes 
                  recogerlo en el centro de servicio autorizado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
            <MapPin className="h-5 w-5" />
            Encontrar Centro de Servicio
          </button>
        </div>
      </div>
    </section>
  );
}
