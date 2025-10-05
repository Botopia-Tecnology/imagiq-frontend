/**
 * @module CouponsPage
 * @description Elegant coupons management page
 * Following Single Responsibility Principle - handles coupon display and management
 */

import React, { useState } from 'react';
import { Search, Gift, Calendar, Copy, Check, Tag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import { useProfile } from '../../hooks/useProfile';
import PageHeader from '../layouts/PageHeader';
import { Coupon } from '../../types';

interface CouponsPageProps {
  onBack?: () => void;
  className?: string;
}

const CouponCard: React.FC<{
  coupon: Coupon;
  onCopy: (code: string) => void;
  onUse: (couponId: string) => void;
  copiedCode?: string;
}> = ({ coupon, onCopy, onUse, copiedCode }) => {
  const isExpired = new Date(coupon.expirationDate) < new Date();
  const isUsed = coupon.isUsed;
  const isActive = !isExpired && !isUsed;

  const getDiscountText = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    }
    return `$${coupon.discountValue} OFF`;
  };

  const getStatusColor = () => {
    if (isUsed) return 'from-gray-400 to-gray-600';
    if (isExpired) return 'from-red-400 to-red-600';
    return 'from-green-500 to-blue-600';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl shadow-lg transition-all duration-200',
      isActive ? 'hover:scale-105 hover:shadow-xl' : 'opacity-75'
    )}>
      {/* Coupon Design */}
      <div className={cn(
        'relative bg-gradient-to-br text-white p-6',
        getStatusColor()
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="text-sm font-medium">Cupón</span>
            </div>
            <div className="flex items-center gap-2">
              {!isUsed && !isExpired && (
                <Star className="w-4 h-4 fill-current" />
              )}
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                {isUsed ? 'USADO' : isExpired ? 'EXPIRADO' : 'ACTIVO'}
              </span>
            </div>
          </div>

          {/* Discount */}
          <div className="mb-4">
            <div className="text-2xl font-bold tracking-tight">
              {getDiscountText()}
            </div>
            <div className="text-sm opacity-90">
              {coupon.description}
            </div>
          </div>

          {/* Code */}
          <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs opacity-75 mb-1">Código</div>
                <div className="font-mono text-lg font-bold tracking-wider">
                  {coupon.code}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopy(coupon.code)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2"
                disabled={!isActive}
              >
                {copiedCode === coupon.code ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="flex justify-between items-end text-sm">
            <div>
              <div className="opacity-75 mb-1">Válido hasta</div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(coupon.expirationDate)}
              </div>
            </div>
            {coupon.minOrderValue && (
              <div className="text-right">
                <div className="opacity-75 mb-1">Compra mínima</div>
                <div>${coupon.minOrderValue}</div>
              </div>
            )}
          </div>
        </div>

        {/* Perforated Edge Effect */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full shadow-inner" />
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full shadow-inner" />
      </div>

      {/* Action Button */}
      {isActive && (
        <div className="bg-white p-4">
          <Button
            variant="primary"
            onClick={() => onUse(coupon.id)}
            className="text-sm w-full"
          >
            Usar Cupón
          </Button>
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC<{ filter: string }> = ({ filter }) => (
  <div className="bg-white rounded-lg p-8 text-center">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <Gift className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {filter === 'all' ? 'No tienes cupones disponibles' : `No tienes cupones ${filter.toLowerCase()}`}
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      {filter === 'all'
        ? 'Los cupones que recibas aparecerán aquí para que puedas usarlos en tus compras'
        : 'No hay cupones que coincidan con este filtro'
      }
    </p>
    {filter === 'all' && (
      <Button variant="primary" onClick={() => window.location.href = '/productos'}>
        Explorar Productos
      </Button>
    )}
  </div>
);

export const CouponsPage: React.FC<CouponsPageProps> = ({
  onBack,
  className
}) => {
  const { state } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');
  const [copiedCode, setCopiedCode] = useState<string>('');

  // Filter coupons
  const filteredCoupons = state.coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchQuery.toLowerCase());

    const now = new Date();
    const isExpired = new Date(coupon.expirationDate) < now;
    const isUsed = coupon.isUsed;
    const isActive = !isExpired && !isUsed;

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'active') return matchesSearch && isActive;
    if (selectedFilter === 'used') return matchesSearch && isUsed;
    if (selectedFilter === 'expired') return matchesSearch && isExpired;

    return matchesSearch;
  });

  // Count coupons by status
  const couponCounts = {
    all: state.coupons.length,
    active: state.coupons.filter(c => !c.isUsed && new Date(c.expirationDate) >= new Date()).length,
    used: state.coupons.filter(c => c.isUsed).length,
    expired: state.coupons.filter(c => !c.isUsed && new Date(c.expirationDate) < new Date()).length
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleUseCoupon = (couponId: string) => {
    console.log('Use coupon:', couponId);
    // TODO: Navigate to products page with coupon applied
  };

  const filters = [
    { value: 'all' as const, label: 'Todos', count: couponCounts.all, icon: Tag },
    { value: 'active' as const, label: 'Activos', count: couponCounts.active, icon: Star },
    { value: 'used' as const, label: 'Usados', count: couponCounts.used, icon: Check },
    { value: 'expired' as const, label: 'Expirados', count: couponCounts.expired, icon: Calendar }
  ];

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <PageHeader
        title="Mis Cupones"
        subtitle={`${state.coupons.length} ${state.coupons.length === 1 ? 'cupón' : 'cupones'} disponibles`}
        onBack={onBack}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/productos'}
            className="hidden sm:flex"
          >
            <Gift className="w-4 h-4 mr-2" />
            Usar Cupón
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Search and Filters */}
        {state.coupons.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0',
                      selectedFilter === filter.value
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                    {filter.count > 0 && (
                      <span className="bg-white px-1.5 py-0.5 rounded-full text-xs">
                        {filter.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Coupons Grid */}
        {filteredCoupons.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onCopy={handleCopyCode}
                onUse={handleUseCoupon}
                copiedCode={copiedCode}
              />
            ))}
          </div>
        ) : state.coupons.length === 0 ? (
          <EmptyState filter="all" />
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay cupones en esta categoría
            </h3>
            <p className="text-gray-500">
              Cambia el filtro para ver otros cupones
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex gap-3">
            <Gift className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-green-900 mb-1">
                ¿Cómo usar tus cupones?
              </h4>
              <p className="text-green-700">
                Copia el código del cupón y pégalo en el carrito de compras antes de finalizar tu pedido.
                Algunos cupones tienen restricciones de compra mínima.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CouponsPage.displayName = 'CouponsPage';

export default CouponsPage;