/**
 * @module PaymentSecurityNotice
 * @description Security information for payment methods
 */

import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

export const PaymentSecurityNotice: React.FC = () => (
  <div className="mt-8 bg-gray-50 border-2 border-gray-100 rounded-2xl p-6">
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
        <Shield className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-2">Seguridad de tus datos</h4>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Tus datos de pago están protegidos con encriptación de nivel bancario. Nunca
          almacenamos el CVV de tus tarjetas.
        </p>
        <div className="flex items-start gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-gray-600">
            Las tarjetas expiradas no se pueden usar para realizar compras. Actualiza la
            información de tu tarjeta para continuar usándola.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentSecurityNotice;
