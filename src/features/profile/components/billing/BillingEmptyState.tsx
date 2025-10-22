/**
 * @module BillingEmptyState
 * @description Samsung-style empty states for billing page
 */

import React from "react";
import { Receipt, FileText, Package } from "lucide-react";
import Button from "@/components/Button";

export const BillingEmptyState: React.FC = () => (
  <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <Receipt className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      No tienes facturas disponibles
    </h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      Las facturas de tus compras aparecerán aquí una vez que realices tu primer
      pedido
    </p>
    <Button
      variant="primary"
      onClick={() => {
        globalThis.location.href = "/productos";
      }}
      className="font-bold bg-black hover:bg-gray-800"
    >
      <Package className="w-5 h-5 mr-2" />
      Explorar Productos
    </Button>
  </div>
);

export const NoResultsState: React.FC = () => (
  <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
    <FileText
      className="w-16 h-16 mx-auto mb-4 text-gray-400"
      strokeWidth={1.5}
    />
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      No se encontraron facturas
    </h3>
    <p className="text-gray-600">Intenta cambiar los filtros de búsqueda</p>
  </div>
);

export const BillingHelp: React.FC = () => (
  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-2">Acerca de tus facturas</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          Las facturas se generan automáticamente cuando realizas una compra.
          Puedes descargarlas en formato PDF para tus registros contables. Si
          necesitas una factura con datos fiscales específicos, contáctanos.
        </p>
      </div>
    </div>
  </div>
);
