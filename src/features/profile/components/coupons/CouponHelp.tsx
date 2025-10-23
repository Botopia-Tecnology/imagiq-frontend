/**
 * @module CouponHelp
 * @description Help section for coupons page
 */

import React from 'react';
import { Gift } from 'lucide-react';

export const CouponHelp: React.FC = () => {
  return (
    <div className="mt-8 bg-gray-50 border-2 border-gray-100 rounded-2xl p-6">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
          <Gift className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-2">¿Cómo usar tus cupones?</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Copia el código del cupón y pégalo en el carrito de compras antes de finalizar tu
            pedido. Algunos cupones tienen restricciones de compra mínima.
          </p>
        </div>
      </div>
    </div>
  );
};

CouponHelp.displayName = 'CouponHelp';

export default CouponHelp;
