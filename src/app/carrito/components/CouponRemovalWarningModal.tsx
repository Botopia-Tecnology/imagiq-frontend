"use client";

import { createPortal } from "react-dom";
import { AlertTriangle, X, Tag } from "lucide-react";

interface CouponRemovalWarningModalProps {
  isOpen: boolean;
  couponCode: string;
  discountAmount: number;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CouponRemovalWarningModal({
  isOpen,
  couponCode,
  discountAmount,
  productName,
  onConfirm,
  onCancel,
}: CouponRemovalWarningModalProps) {
  if (!isOpen) return null;

  const formattedDiscount = Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(discountAmount);

  const modalContent = (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-full">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Se eliminará tu bono
              </h3>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600 mb-4">
            Al eliminar{" "}
            <span className="font-medium text-gray-900">{productName}</span>, el
            bono{" "}
            <span className="font-medium text-green-600">{couponCode}</span>{" "}
            dejará de aplicar porque requiere este producto en el carrito.
          </p>
          <div className="bg-amber-50 rounded-lg p-3 flex items-center gap-3 border border-amber-100">
            <Tag className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Perderás un descuento de{" "}
              <span className="font-bold">{formattedDiscount}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar producto y bono
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
