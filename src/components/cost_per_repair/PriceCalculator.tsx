"use client";

import { useState } from "react";
import { Search, Smartphone, Laptop, Tv, Refrigerator, HelpCircle } from "lucide-react";

interface RepairPrice {
  device: string;
  part: string;
  price: string;
  warranty: string;
}

const repairPrices: RepairPrice[] = [
  // Galaxy S Series
  { device: "Galaxy S24 Ultra", part: "Pantalla", price: "$220.000", warranty: "3 meses" },
  { device: "Galaxy S24 Ultra", part: "Batería", price: "$90.000", warranty: "6 meses" },
  { device: "Galaxy S24 Ultra", part: "Cámara trasera", price: "$180.000", warranty: "3 meses" },
  { device: "Galaxy S24 Ultra", part: "S Pen", price: "$45.000", warranty: "3 meses" },
  
  { device: "Galaxy S24+", part: "Pantalla", price: "$200.000", warranty: "3 meses" },
  { device: "Galaxy S24+", part: "Batería", price: "$85.000", warranty: "6 meses" },
  { device: "Galaxy S24+", part: "Cámara trasera", price: "$160.000", warranty: "3 meses" },
  
  { device: "Galaxy S24", part: "Pantalla", price: "$180.000", warranty: "3 meses" },
  { device: "Galaxy S24", part: "Batería", price: "$80.000", warranty: "6 meses" },
  { device: "Galaxy S24", part: "Cámara trasera", price: "$150.000", warranty: "3 meses" },
  { device: "Galaxy S24", part: "Cámara frontal", price: "$90.000", warranty: "3 meses" },
  
  { device: "Galaxy S23 Ultra", part: "Pantalla", price: "$200.000", warranty: "3 meses" },
  { device: "Galaxy S23 Ultra", part: "Batería", price: "$85.000", warranty: "6 meses" },
  { device: "Galaxy S23 Ultra", part: "S Pen", price: "$40.000", warranty: "3 meses" },
  
  { device: "Galaxy S23", part: "Pantalla", price: "$160.000", warranty: "3 meses" },
  { device: "Galaxy S23", part: "Batería", price: "$75.000", warranty: "6 meses" },
  { device: "Galaxy S23", part: "Cámara trasera", price: "$140.000", warranty: "3 meses" },
  
  { device: "Galaxy S22", part: "Pantalla", price: "$140.000", warranty: "3 meses" },
  { device: "Galaxy S22", part: "Batería", price: "$70.000", warranty: "6 meses" },
  
  // Galaxy A Series
  { device: "Galaxy A54 5G", part: "Pantalla", price: "$120.000", warranty: "3 meses" },
  { device: "Galaxy A54 5G", part: "Batería", price: "$60.000", warranty: "6 meses" },
  { device: "Galaxy A54 5G", part: "Cámara trasera", price: "$80.000", warranty: "3 meses" },
  
  { device: "Galaxy A34 5G", part: "Pantalla", price: "$100.000", warranty: "3 meses" },
  { device: "Galaxy A34 5G", part: "Batería", price: "$55.000", warranty: "6 meses" },
  
  { device: "Galaxy A24", part: "Pantalla", price: "$85.000", warranty: "3 meses" },
  { device: "Galaxy A24", part: "Batería", price: "$50.000", warranty: "6 meses" },
  
  { device: "Galaxy A14", part: "Pantalla", price: "$70.000", warranty: "3 meses" },
  { device: "Galaxy A14", part: "Batería", price: "$45.000", warranty: "6 meses" },
  
  // Galaxy Note Series
  { device: "Galaxy Note 20 Ultra", part: "Pantalla", price: "$190.000", warranty: "3 meses" },
  { device: "Galaxy Note 20 Ultra", part: "Cámara trasera", price: "$160.000", warranty: "3 meses" },
  { device: "Galaxy Note 20 Ultra", part: "Batería", price: "$90.000", warranty: "6 meses" },
  { device: "Galaxy Note 20 Ultra", part: "S Pen", price: "$35.000", warranty: "3 meses" },
  
  { device: "Galaxy Note 20", part: "Pantalla", price: "$170.000", warranty: "3 meses" },
  { device: "Galaxy Note 20", part: "Cámara trasera", price: "$150.000", warranty: "3 meses" },
  { device: "Galaxy Note 20", part: "Batería", price: "$85.000", warranty: "6 meses" },
  
  // Galaxy Tab Series
  { device: "Galaxy Tab S9 Ultra", part: "Pantalla", price: "$280.000", warranty: "3 meses" },
  { device: "Galaxy Tab S9 Ultra", part: "Batería", price: "$120.000", warranty: "6 meses" },
  { device: "Galaxy Tab S9 Ultra", part: "S Pen", price: "$50.000", warranty: "3 meses" },
  
  { device: "Galaxy Tab S9+", part: "Pantalla", price: "$250.000", warranty: "3 meses" },
  { device: "Galaxy Tab S9+", part: "Batería", price: "$110.000", warranty: "6 meses" },
  
  { device: "Galaxy Tab S9", part: "Pantalla", price: "$220.000", warranty: "3 meses" },
  { device: "Galaxy Tab S9", part: "Batería", price: "$100.000", warranty: "6 meses" },
  
  { device: "Galaxy Tab S8", part: "Pantalla", price: "$200.000", warranty: "3 meses" },
  { device: "Galaxy Tab S8", part: "Batería", price: "$95.000", warranty: "6 meses" },
  
  { device: "Galaxy Tab A8", part: "Pantalla", price: "$150.000", warranty: "3 meses" },
  { device: "Galaxy Tab A8", part: "Batería", price: "$70.000", warranty: "6 meses" },
  
  { device: "Galaxy Tab A7 Lite", part: "Pantalla", price: "$120.000", warranty: "3 meses" },
  { device: "Galaxy Tab A7 Lite", part: "Batería", price: "$60.000", warranty: "6 meses" },
  
  // Galaxy Z Series (Plegables)
  { device: "Galaxy Z Fold 5", part: "Pantalla principal", price: "$450.000", warranty: "3 meses" },
  { device: "Galaxy Z Fold 5", part: "Pantalla externa", price: "$200.000", warranty: "3 meses" },
  { device: "Galaxy Z Fold 5", part: "Bisagra", price: "$300.000", warranty: "6 meses" },
  { device: "Galaxy Z Fold 5", part: "Batería", price: "$120.000", warranty: "6 meses" },
  
  { device: "Galaxy Z Flip 5", part: "Pantalla principal", price: "$320.000", warranty: "3 meses" },
  { device: "Galaxy Z Flip 5", part: "Pantalla externa", price: "$150.000", warranty: "3 meses" },
  { device: "Galaxy Z Flip 5", part: "Bisagra", price: "$250.000", warranty: "6 meses" },
  { device: "Galaxy Z Flip 5", part: "Batería", price: "$100.000", warranty: "6 meses" },
  
  { device: "Galaxy Z Fold 4", part: "Pantalla principal", price: "$400.000", warranty: "3 meses" },
  { device: "Galaxy Z Fold 4", part: "Pantalla externa", price: "$180.000", warranty: "3 meses" },
  { device: "Galaxy Z Fold 4", part: "Bisagra", price: "$280.000", warranty: "6 meses" },
  
  { device: "Galaxy Z Flip 4", part: "Pantalla principal", price: "$300.000", warranty: "3 meses" },
  { device: "Galaxy Z Flip 4", part: "Pantalla externa", price: "$130.000", warranty: "3 meses" },
  { device: "Galaxy Z Flip 4", part: "Bisagra", price: "$230.000", warranty: "6 meses" },
  
  // Samsung TV
  { device: "QLED 55\" Q80C", part: "Pantalla", price: "$800.000", warranty: "6 meses" },
  { device: "QLED 65\" Q90C", part: "Pantalla", price: "$1.200.000", warranty: "6 meses" },
  { device: "Crystal UHD 50\"", part: "Pantalla", price: "$600.000", warranty: "6 meses" },
  { device: "Neo QLED 75\"", part: "Pantalla", price: "$1.800.000", warranty: "6 meses" },
  { device: "OLED 55\" S90C", part: "Pantalla", price: "$1.000.000", warranty: "6 meses" },
  
  // Electrodomésticos
  { device: "Refrigerador Family Hub", part: "Compresor", price: "$350.000", warranty: "12 meses" },
  { device: "Refrigerador Family Hub", part: "Pantalla touch", price: "$450.000", warranty: "6 meses" },
  { device: "Refrigerador Side by Side", part: "Compresor", price: "$300.000", warranty: "12 meses" },
  { device: "Lavadora AddWash", part: "Motor", price: "$280.000", warranty: "12 meses" },
  { device: "Lavadora AddWash", part: "Bomba de agua", price: "$120.000", warranty: "6 meses" },
  { device: "Secadora DV90", part: "Resistencia", price: "$180.000", warranty: "6 meses" },
  { device: "Aire Acondicionado WindFree", part: "Compresor", price: "$400.000", warranty: "12 meses" },
  { device: "Lavavajillas DW60", part: "Bomba de lavado", price: "$150.000", warranty: "6 meses" },
  { device: "Microondas Grill", part: "Magnetrón", price: "$200.000", warranty: "6 meses" },
  
  // Otros dispositivos Samsung
  { device: "Galaxy Watch 6", part: "Pantalla", price: "$120.000", warranty: "3 meses" },
  { device: "Galaxy Watch 6", part: "Batería", price: "$80.000", warranty: "6 meses" },
  { device: "Galaxy Buds Pro", part: "Batería", price: "$60.000", warranty: "3 meses" },
  { device: "Galaxy Buds Pro", part: "Carcasa", price: "$40.000", warranty: "3 meses" },
  { device: "Samsung DeX Station", part: "Puerto USB-C", price: "$50.000", warranty: "6 meses" },
  { device: "Samsung Monitor M8", part: "Pantalla", price: "$400.000", warranty: "6 meses" },
  { device: "Samsung SSD T7", part: "Conector", price: "$30.000", warranty: "3 meses" },
  { device: "Cargador Inalámbrico", part: "Bobina", price: "$35.000", warranty: "6 meses" },
  { device: "S Pen Pro", part: "Punta", price: "$15.000", warranty: "3 meses" },
  { device: "Teclado Samsung", part: "Teclas", price: "$45.000", warranty: "6 meses" },
];

export default function PriceCalculator() {
  const [selectedDevice, setSelectedDevice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const getFilteredPrices = () => {
    let filtered = repairPrices;
    
    // Filter by device category
    if (selectedDevice) {
      switch (selectedDevice) {
        case "smartphone":
          filtered = filtered.filter(price => 
            price.device.includes("Galaxy S") || 
            price.device.includes("Galaxy A") || 
            price.device.includes("Galaxy Note") ||
            price.device.includes("Galaxy Z")
          );
          break;
        case "tablet":
          filtered = filtered.filter(price => price.device.includes("Galaxy Tab"));
          break;
        case "tv":
          filtered = filtered.filter(price => 
            price.device.includes("QLED") || 
            price.device.includes("Crystal") ||
            price.device.includes("Neo QLED") ||
            price.device.includes("OLED") ||
            price.device.includes("TV")
          );
          break;
        case "appliance":
          filtered = filtered.filter(price => 
            price.device.includes("Refrigerador") || 
            price.device.includes("Lavadora") ||
            price.device.includes("Secadora") ||
            price.device.includes("Aire") ||
            price.device.includes("Lavavajillas") ||
            price.device.includes("Microondas")
          );
          break;
        case "other":
          filtered = filtered.filter(price => 
            price.device.includes("Galaxy Watch") || 
            price.device.includes("Galaxy Buds") ||
            price.device.includes("DeX") ||
            price.device.includes("Monitor") ||
            price.device.includes("SSD") ||
            price.device.includes("Cargador") ||
            price.device.includes("S Pen") ||
            price.device.includes("Teclado")
          );
          break;
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(price => 
        price.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.part.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  const filteredPrices = getFilteredPrices();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Precios de reparación
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Escribe el modelo de tu dispositivo y consulta los costos de reparación con Samsung. 
            Encuentra el costo exacto de reparación para tu dispositivo.
          </p>
        </div>

        {/* Important Information - Diseño mejorado */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Información importante</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold">Precios fuera de garantía</span> con IVA incluido
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold">Centros autorizados Samsung</span> certificados
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold">Garantía incluida</span> en todas las reparaciones
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold">Repuestos originales</span> Samsung únicamente
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold">Técnicos certificados</span> y especializados
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold">Soporte completo</span> antes y después del servicio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Device Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Selecciona tu tipo de dispositivo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Smartphone, label: "Smartphones", category: "smartphone" },
              { icon: Laptop, label: "Tablets", category: "tablet" },
              { icon: Tv, label: "TV", category: "tv" },
              { icon: Refrigerator, label: "Electrodomésticos", category: "appliance" },
              { icon: HelpCircle, label: "Otro", category: "other" }
            ].map(({ icon: Icon, label, category }) => (
              <button
                key={category}
                onClick={() => setSelectedDevice(category)}
                className={`flex flex-col items-center p-6 rounded-xl transition-all duration-200 border-2 ${
                  selectedDevice === category
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="h-8 w-8 mb-3" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Busca tu dispositivo o componente
          </h3>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Ej: Galaxy S24, pantalla, batería..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {searchTerm && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setSelectedDevice("");
                    setSearchTerm("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Table - Solo mostrar cuando hay búsqueda de TEXTO activa */}
        {searchTerm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Resultados de búsqueda para &ldquo;{searchTerm}&rdquo;
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {filteredPrices.length} resultado{filteredPrices.length !== 1 ? 's' : ''} encontrado{filteredPrices.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Dispositivo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Componente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Garantía
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPrices.length > 0 ? (
                    filteredPrices.map((price, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{price.device}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{price.part}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-blue-600">{price.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {price.warranty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                            Solicitar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">No se encontraron resultados</p>
                          <p className="text-sm">Intenta con otro término de búsqueda o modelo de dispositivo</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mensaje inicial cuando no hay búsqueda de TEXTO */}
        {!searchTerm && (
          <div className="text-center py-8">
            <div className="text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg text-gray-500">Escribe en el buscador para ver los precios</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
