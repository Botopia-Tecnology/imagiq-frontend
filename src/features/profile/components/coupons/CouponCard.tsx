/**
 * @module CouponCard
 * @description Individual coupon card component with Samsung-style design
 */

import React from 'react';
import { Gift, Calendar, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import { Coupon } from '../../types';

interface CouponCardProps {
  coupon: Coupon;
  onCopy: (code: string) => void;
  onUse: (couponId: string) => void;
  copiedCode?: string;
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onCopy,
  onUse,
  copiedCode
}) => {
  const isExpired = new Date(coupon.expirationDate) < new Date();
  const isUsed = coupon.isUsed;
  const isActive = !isExpired && !isUsed;

  const getDiscountText = (): string => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    }
    return `$${coupon.discountValue.toLocaleString()} OFF`;
  };

  const getStatusBadge = (): { label: string; bg: string } => {
    if (isUsed) return { label: 'USADO', bg: 'bg-gray-900' };
    if (isExpired) return { label: 'EXPIRADO', bg: 'bg-gray-400' };
    return { label: 'ACTIVO', bg: 'bg-black' };
  };

  const status = getStatusBadge();

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 transition-all duration-200',
        isActive
          ? 'border-gray-200 hover:border-black hover:shadow-lg'
          : 'border-gray-200 opacity-60'
      )}
    >
      <div className="relative bg-white p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Cupón</span>
          </div>
          <span className={cn('text-xs font-bold text-white px-3 py-1 rounded-full', status.bg)}>
            {status.label}
          </span>
        </div>

        {/* Discount */}
        <div className="mb-6">
          <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {getDiscountText()}
          </div>
          <p className="text-base text-gray-600">{coupon.description}</p>
        </div>

        {/* Code */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Código
              </div>
              <div className="font-mono text-xl md:text-2xl font-bold text-gray-900 tracking-wider">
                {coupon.code}
              </div>
            </div>
            <button
              onClick={() => onCopy(coupon.code)}
              disabled={!isActive}
              className={cn(
                'ml-4 p-3 rounded-lg border-2 transition-colors',
                isActive
                  ? 'border-black hover:bg-black hover:text-white'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              )}
              aria-label="Copiar código"
            >
              {copiedCode === coupon.code ? (
                <Check className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <Copy className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3 text-sm border-t-2 border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-medium">Válido hasta</span>
            </div>
            <span className="font-bold text-gray-900">{formatDate(coupon.expirationDate)}</span>
          </div>
          {coupon.minOrderValue && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Compra mínima</span>
              <span className="font-bold text-gray-900">
                ${coupon.minOrderValue.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {isActive && (
        <div className="border-t-2 border-gray-100 p-4">
          <Button
            variant="primary"
            onClick={() => onUse(coupon.id)}
            className="w-full font-bold py-3 bg-black hover:bg-gray-800"
          >
            Usar Cupón
          </Button>
        </div>
      )}
    </div>
  );
};

CouponCard.displayName = 'CouponCard';

export default CouponCard;
