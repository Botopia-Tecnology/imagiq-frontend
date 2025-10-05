/**
 * @module PaymentMethodsPage
 * @description Elegant payment methods management page
 * Following Single Responsibility Principle - handles payment methods CRUD operations
 */

import React, { useState } from 'react';
import { Plus, CreditCard, Star, Edit, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import { useProfile } from '../../hooks/useProfile';
import PageHeader from '../layouts/PageHeader';
import { PaymentMethod } from '../../types';
import pseLogo from "@/img/iconos/logo-pse.png";

interface PaymentMethodsPageProps {
  onBack?: () => void;
  className?: string;
}

const getBrandColor = (brand?: string) => {
  switch (brand?.toLowerCase()) {
    case 'visa':
      return 'from-blue-600 to-blue-800';
    case 'mastercard':
      return 'from-red-600 to-orange-600';
    case 'american express':
      return 'from-green-600 to-teal-600';
    default:
      return 'from-gray-600 to-gray-800';
  }
};

const getBrandLogo = (brand?: string) => {
  switch (brand?.toLowerCase()) {
    case 'visa':
      return <SiVisa className="w-8 h-5 text-white" />;
    case 'mastercard':
      return <SiMastercard className="w-8 h-5 text-white" />;
    case 'american express':
      return <SiAmericanexpress className="w-8 h-5 text-white" />;
    default:
      return <CreditCard className="w-5 h-5 text-white" />;
  }
};

const PaymentMethodCard: React.FC<{
  paymentMethod: PaymentMethod;
  onEdit: (method: PaymentMethod) => void;
  onDelete: (methodId: string) => void;
  onSetDefault: (methodId: string) => void;
  showDetails: boolean;
  onToggleDetails: () => void;
}> = ({ paymentMethod, onEdit, onDelete, onSetDefault, showDetails, onToggleDetails }) => {
  const isCard = paymentMethod.type === 'credit_card' || paymentMethod.type === 'debit_card';

  if (isCard) {
    return (
      <div className="relative">
        {/* Credit Card Design */}
        <div className={cn(
          'relative p-6 rounded-xl bg-gradient-to-br text-white shadow-lg',
          getBrandColor(paymentMethod.brand),
          'transform transition-all duration-200 hover:scale-105 hover:shadow-xl'
        )}>
          {/* Card Background Pattern */}
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-12 translate-y-12" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium">{paymentMethod.alias}</span>
              </div>
              <div className="flex items-center gap-2">
                {paymentMethod.isDefault && (
                  <Star className="w-4 h-4 fill-current" />
                )}
                <div className="flex items-center justify-center bg-white bg-opacity-20 px-2 py-1 rounded min-w-[40px]">
                  {getBrandLogo(paymentMethod.brand)}
                </div>
              </div>
            </div>

            {/* Card Number */}
            <div className="mb-4">
              <div className="text-lg font-mono tracking-wider">
                •••• •••• •••• {paymentMethod.last4Digits}
              </div>
            </div>

            {/* Card Details */}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-75 mb-1">Válida hasta</div>
                <div className="text-sm font-medium">
                  {showDetails ? paymentMethod.expirationDate : '••/••'}
                </div>
              </div>
              <div className="text-xs opacity-75">
                {paymentMethod.type === 'credit_card' ? 'Crédito' : 'Débito'}
              </div>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleDetails}
              className="text-gray-600"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(paymentMethod)}
              className="text-gray-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(paymentMethod.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {!paymentMethod.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(paymentMethod.id)}
            >
              Predeterminado
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Bank Account Card (simplified)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{paymentMethod.alias}</h3>
            <p className="text-sm text-gray-500">Cuenta bancaria •••• {paymentMethod.last4Digits}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(paymentMethod)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(paymentMethod.id)}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onAddMethod: () => void }> = ({ onAddMethod }) => (
  <div className="bg-white rounded-lg p-8 text-center">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <CreditCard className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No tienes métodos de pago guardados
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      Agrega una tarjeta o cuenta bancaria para realizar compras más rápido
    </p>
    <Button variant="primary" onClick={onAddMethod}>
      <Plus className="w-4 h-4 mr-2" />
      Agregar Método de Pago
    </Button>
  </div>
);

export const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({
  onBack,
  className
}) => {
  const { state } = useProfile();
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const handleAddPaymentMethod = () => {
    console.log('Add new payment method');
    // TODO: Open add payment method modal/form
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    console.log('Edit payment method:', method.id);
    // TODO: Open edit payment method modal/form
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    console.log('Delete payment method:', methodId);
    // TODO: Implement delete confirmation and API call
  };

  const handleSetDefaultPaymentMethod = (methodId: string) => {
    console.log('Set default payment method:', methodId);
    // TODO: Implement set default API call
  };

  const toggleDetails = (methodId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [methodId]: !prev[methodId]
    }));
  };

  const cardMethods = state.paymentMethods.filter(pm => pm.type === 'credit_card' || pm.type === 'debit_card');
  const bankMethods = state.paymentMethods.filter(pm => pm.type === 'bank_account');

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <PageHeader
        title="Métodos de Pago"
        subtitle={`${state.paymentMethods.length} ${state.paymentMethods.length === 1 ? 'método' : 'métodos'} guardados`}
        onBack={onBack}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddPaymentMethod}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar Método</span>
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {state.paymentMethods.length > 0 ? (
          <>
            {/* Credit/Debit Cards */}
            {cardMethods.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Tarjetas ({cardMethods.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {cardMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      paymentMethod={method}
                      onEdit={handleEditPaymentMethod}
                      onDelete={handleDeletePaymentMethod}
                      onSetDefault={handleSetDefaultPaymentMethod}
                      showDetails={showDetails[method.id] || false}
                      onToggleDetails={() => toggleDetails(method.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bank Accounts */}
            {bankMethods.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cuentas Bancarias ({bankMethods.length})
                </h2>
                <div className="space-y-4">
                  {bankMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      paymentMethod={method}
                      onEdit={handleEditPaymentMethod}
                      onDelete={handleDeletePaymentMethod}
                      onSetDefault={handleSetDefaultPaymentMethod}
                      showDetails={showDetails[method.id] || false}
                      onToggleDetails={() => toggleDetails(method.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState onAddMethod={handleAddPaymentMethod} />
        )}

        {/* Security Notice */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-green-900 mb-1">
                Seguridad de tus datos
              </h4>
              <p className="text-green-700">
                Todos tus métodos de pago están protegidos con encriptación de nivel bancario.
                Nunca almacenamos números de tarjeta completos en nuestros servidores.
              </p>
            </div>
          </div>
        </div>

        {/* Accepted Payment Methods */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Métodos de pago aceptados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <SiVisa className="w-12 h-7 text-[#1A1F71]" />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <SiMastercard className="w-12 h-7 text-[#EB001B]" />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <SiAmericanexpress className="w-12 h-7 text-[#006FCF]" />
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Image
                src={pseLogo}
                alt="PSE"
                width={48}
                height={28}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentMethodsPage.displayName = 'PaymentMethodsPage';

export default PaymentMethodsPage;