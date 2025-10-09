/**
 * @module CheckoutFlow
 * @description Flujo completo de checkout con pasos de dirección, pago y confirmación
 */

import React, { useState } from 'react';
import Image from 'next/image';
import CheckoutAddressStep from './CheckoutAddressStep';
import { PlaceDetails } from '@/types/places.types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutFlowProps {
  /**
   * Items del carrito
   */
  cartItems: CartItem[];

  /**
   * Direcciones guardadas del usuario
   */
  savedAddresses?: PlaceDetails[];

  /**
   * Callback cuando se completa el checkout
   */
  onCheckoutComplete?: (data: {
    address: PlaceDetails;
    items: CartItem[];
    total: number;
  }) => void;

  /**
   * Callback para cancelar checkout
   */
  onCancel?: () => void;
}

type CheckoutStep = 'cart' | 'address' | 'payment' | 'confirmation';

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  cartItems,
  savedAddresses = [],
  onCheckoutComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedAddress, setSelectedAddress] = useState<PlaceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = selectedAddress ? 8000 : 0; // Costo base de envío
  const total = subtotal + deliveryCost;

  const handleAddressSelected = (address: PlaceDetails | null) => {
    setSelectedAddress(address);
  };

  const handleContinueToPayment = (address: PlaceDetails) => {
    setIsLoading(true);

    // Simular procesamiento
    setTimeout(() => {
      setSelectedAddress(address);
      setCurrentStep('payment');
      setIsLoading(false);
    }, 1000);
  };

  const handlePaymentComplete = () => {
    if (selectedAddress) {
      onCheckoutComplete?.({
        address: selectedAddress,
        items: cartItems,
        total
      });
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'address':
        onCancel?.();
        break;
      case 'payment':
        setCurrentStep('address');
        break;
      case 'confirmation':
        setCurrentStep('payment');
        break;
    }
  };

  const steps = [
    { key: 'address', label: 'Dirección', icon: '📍' },
    { key: 'payment', label: 'Pago', icon: '💳' },
    { key: 'confirmation', label: 'Confirmación', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Indicador de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                <div className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                      ${index <= currentStepIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {index < currentStepIndex ? '✓' : step.icon}
                  </div>
                  <span
                    className={`
                      ml-2 text-sm font-medium
                      ${index <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      mx-4 h-0.5 w-16
                      ${index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {currentStep === 'address' && (
              <CheckoutAddressStep
                initialAddress={selectedAddress}
                onAddressChange={handleAddressSelected}
                onContinue={handleContinueToPayment}
                onBack={handleBack}
                isLoading={isLoading}
                savedAddresses={savedAddresses}
              />
            )}

            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  💳 Información de Pago
                </h2>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <p className="text-gray-600 mb-4">
                    Paso de pago en construcción
                  </p>
                  <button
                    onClick={handlePaymentComplete}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Simular Pago Completado
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  ✅ Pedido Confirmado
                </h2>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-gray-600 mb-4">
                    ¡Tu pedido ha sido procesado exitosamente!
                  </p>
                  <p className="text-sm text-gray-500">
                    Recibirás un email de confirmación en breve
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                📦 Resumen del Pedido
              </h3>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>
                    {selectedAddress ? `$${deliveryCost.toLocaleString()}` : 'Calculando...'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Dirección de envío */}
              {selectedAddress && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    📍 Dirección de Envío
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.formattedAddress}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    ✅ Zona de cobertura confirmada
                  </p>
                </div>
              )}

              {/* Información de entrega */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  🚚 Información de Entrega
                </h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• Tiempo estimado: 2-6 horas</p>
                  <p>• Entrega de lunes a sábado</p>
                  <p>• Horario: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;