"use client";

import { useState } from "react";
import { Search, Smartphone, Laptop, Tv, Refrigerator } from "lucide-react";

interface RepairPrice {
  device: string;
  part: string;
  price: string;
  warranty: string;
}

const repairPrices: RepairPrice[] = [
  { device: "Galaxy S24", part: "Pantalla", price: "$180.000", warranty: "3 meses" },
  { device: "Galaxy S23", part: "Pantalla", price: "$160.000", warranty: "3 meses" },
  { device: "Galaxy A54", part: "Pantalla", price: "$120.000", warranty: "3 meses" },
  { device: "Galaxy S24", part: "Batería", price: "$80.000", warranty: "6 meses" },
  { device: "Galaxy Note 20", part: "Cámara trasera", price: "$150.000", warranty: "3 meses" },
  { device: "Galaxy Tab S9", part: "Pantalla", price: "$220.000", warranty: "3 meses" },
];

export default function PriceCalculator() {
  const [selectedDevice, setSelectedDevice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPrices = repairPrices.filter(price => 
    price.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
    price.part.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Consulta precios de reparación
          </h2>
          <p className="text-gray-600">
            Encuentra el costo exacto de reparación para tu dispositivo Samsung
          </p>
        </div>

        {/* Device Categories */}
        <div className="flex justify-center space-x-8 mb-8">
          {[
            { icon: Smartphone, label: "Smartphones", category: "smartphone" },
            { icon: Laptop, label: "Tablets", category: "tablet" },
            { icon: Tv, label: "TV", category: "tv" },
            { icon: Refrigerator, label: "Electrodomésticos", category: "appliance" }
          ].map(({ icon: Icon, label, category }) => (
            <button
              key={category}
              onClick={() => setSelectedDevice(category)}
              className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
                selectedDevice === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar modelo o componente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Componente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Garantía
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrices.map((price, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {price.device}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {price.part}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {price.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {price.warranty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Solicitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>* Los precios pueden variar según el centro de servicio técnico y disponibilidad de repuestos.</p>
          <p>Los precios incluyen mano de obra e instalación por técnicos certificados Samsung.</p>
        </div>
      </div>
    </section>
  );
}
