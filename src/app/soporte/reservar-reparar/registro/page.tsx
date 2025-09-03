"use client";

import { useState } from "react";
import MyPageSubHeader from "../../../../components/MyPageSubHeader";
import { Search, Smartphone, Monitor, Home, Plus, QrCode } from "lucide-react";

export default function RegistroProductosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { id: "moviles", name: "Dispositivos Móviles", icon: Smartphone },
    { id: "tv", name: "Televisores y AV", icon: Monitor },
    { id: "electrodomesticos", name: "Electrodomésticos", icon: Home }
  ];

  const popularProducts = [
    "Galaxy S24 Ultra",
    "Galaxy S24",
    "Galaxy A54",
    "Galaxy Tab S9",
    "Smart TV 65\" QLED",
    "Refrigerador Family Hub",
    "Lavadora EcoBubble",
    "Galaxy Watch6"
  ];

  return (
    <div className="min-h-screen bg-white">
      <MyPageSubHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registrar nuevo producto
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Busca tu dispositivo Samsung para registrarlo y acceder a beneficios exclusivos, 
            soporte prioritario y garantía extendida.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por modelo (ej: Galaxy S24, Smart TV 55&quot;, Family Hub)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <category.icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Productos populares
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {popularProducts.map((product, index) => (
              <button
                key={index}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-gray-900 font-medium">{product}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Alternative Registration Methods */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-center">
              <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Escanear código QR
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Muchos productos Samsung incluyen un código QR para registro rápido
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Abrir Escáner
              </button>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-center">
              <Plus className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Registro manual
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Ingresa manualmente el número de serie o IMEI de tu dispositivo
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Registro Manual
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ¿Necesitas ayuda para encontrar tu modelo?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Para móviles: Ve a Configuración → Acerca del teléfono</li>
            <li>• Para TV: Ve a Configuración → Soporte → Información del producto</li>
            <li>• Para electrodomésticos: Busca la etiqueta en la parte posterior del producto</li>
            <li>• También puedes encontrar el modelo en la caja original o factura de compra</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
