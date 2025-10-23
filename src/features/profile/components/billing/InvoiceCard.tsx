/**
 * @module InvoiceCard
 * @description Samsung-style invoice card with expandable details
 */

import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  ChevronDown,
  MapPin,
  CreditCard,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { Invoice } from "../../types";
import { getStatusConfig, formatCurrency, formatDate } from "./billingUtils";

interface InvoiceCardProps {
  invoice: Invoice;
  onDownload: (invoiceId: string) => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onDownload,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = getStatusConfig(invoice.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-gray-400 transition-colors">
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-gray-900">
                {invoice.invoiceNumber}
              </h3>
            </div>
            <div className="text-sm font-bold text-gray-600">
              Pedido: {invoice.orderNumber}
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm",
              statusConfig.bgColor,
              statusConfig.textColor
            )}
          >
            <StatusIcon className="w-4 h-4" strokeWidth={2} />
            {statusConfig.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Fecha de emisión
            </div>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" strokeWidth={1.5} />
              {formatDate(invoice.issueDate)}
            </div>
          </div>
          {invoice.paidDate && (
            <div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Fecha de pago
              </div>
              <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <StatusIcon className="w-4 h-4" strokeWidth={1.5} />
                {formatDate(invoice.paidDate)}
              </div>
            </div>
          )}
          {invoice.dueDate && !invoice.paidDate && (
            <div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Vencimiento
              </div>
              <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                {formatDate(invoice.dueDate)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Amount Section */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Total
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(invoice.total, invoice.currency)}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-colors font-bold"
            >
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              Detalles
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
                strokeWidth={2}
              />
            </button>
            {invoice.downloadUrl && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onDownload(invoice.id)}
                className="flex items-center gap-2 font-bold bg-black hover:bg-gray-800"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
                Descargar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-6 border-t-2 border-gray-200 space-y-6">
          {/* Breakdown */}
          <div>
            <h4 className="text-base font-bold text-gray-900 mb-4">Desglose</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-600">Descuento</span>
                  <span className="font-bold text-green-600">
                    -{formatCurrency(invoice.discount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-600">IVA (19%)</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(invoice.tax, invoice.currency)}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-gray-200 flex justify-between">
                <span className="font-bold text-gray-900 text-base">Total</span>
                <span className="font-bold text-gray-900 text-xl">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" strokeWidth={1.5} />
              Dirección de facturación
            </h4>
            <div className="text-sm font-bold text-gray-600 space-y-1">
              <div>{invoice.billingAddress.addressLine1}</div>
              {invoice.billingAddress.addressLine2 && (
                <div>{invoice.billingAddress.addressLine2}</div>
              )}
              <div>
                {invoice.billingAddress.city}, {invoice.billingAddress.state}
              </div>
              <div>{invoice.billingAddress.zipCode}</div>
            </div>
          </div>

          {/* Payment Method */}
          {invoice.paymentMethod && (
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" strokeWidth={1.5} />
                Método de pago
              </h4>
              <div className="text-sm font-bold text-gray-600">
                {invoice.paymentMethod.brand} ****
                {invoice.paymentMethod.last4Digits}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-3">Notas</h4>
              <div className="text-sm font-bold text-gray-600">
                {invoice.notes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;
