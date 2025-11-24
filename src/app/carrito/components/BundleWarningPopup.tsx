"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Package, X } from "lucide-react";

interface BundleWarningPopupProps {
  /** Tipo de acción que disparó el popup */
  type: "quantity" | "remove";
  /** Nombre del producto afectado */
  productName: string;
  /** Cantidad actual (solo para type="quantity") */
  currentQuantity?: number;
  /** Nueva cantidad propuesta (solo para type="quantity") */
  newQuantity?: number;
  /** Nombres de los otros productos del bundle */
  otherProductNames: string[];
  /** Callback cuando el usuario confirma la acción */
  onConfirm: (keepOtherProducts?: boolean) => void;
  /** Callback cuando el usuario cancela */
  onCancel: () => void;
  /** Si el popup está visible */
  isOpen: boolean;
}

export function BundleWarningPopup({
  type,
  productName,
  currentQuantity,
  newQuantity,
  otherProductNames,
  onConfirm,
  onCancel,
  isOpen,
}: BundleWarningPopupProps) {
  const [keepOthers, setKeepOthers] = useState(true);

  if (!isOpen) return null;

  const isQuantityChange = type === "quantity";
  const isRemove = type === "remove";

  const modalContent = (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {isQuantityChange
                  ? "Cambiar cantidad del Bundle"
                  : "Eliminar producto del Bundle"}
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
          {isQuantityChange && (
            <>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium text-gray-900">{productName}</span> es parte de
                un bundle. Al cambiar la cantidad de{" "}
                <span className="font-medium text-gray-900">{currentQuantity}</span> a{" "}
                <span className="font-medium text-gray-900">{newQuantity}</span>, se
                actualizará la cantidad de todos los productos del bundle:
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Productos del bundle
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    {productName}
                  </li>
                  {otherProductNames.map((name, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {isRemove && (
            <>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium text-gray-900">{productName}</span> es parte de
                un bundle con descuento especial. Si lo eliminas, perderás el
                descuento del bundle.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Otros productos del bundle
                  </span>
                </div>
                <ul className="space-y-2">
                  {otherProductNames.map((name, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="removeOption"
                    checked={keepOthers}
                    onChange={() => setKeepOthers(true)}
                    className="mt-0.5 w-4 h-4 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Mantener los demás productos
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Los otros productos volverán a su precio original (sin
                      descuento de bundle)
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="removeOption"
                    checked={!keepOthers}
                    onChange={() => setKeepOthers(false)}
                    className="mt-0.5 w-4 h-4 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Eliminar todo el bundle
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Se eliminarán todos los productos del bundle del carrito
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}
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
            onClick={() => onConfirm(isRemove ? keepOthers : undefined)}
            className="px-4 py-2 text-sm bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isQuantityChange ? "Actualizar cantidad" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );

  // Usar Portal para renderizar fuera del stacking context del componente padre
  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
