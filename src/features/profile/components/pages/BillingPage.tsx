/**
 * @module BillingPage
 * @description Samsung-style billing page - optimized and modular
 */

import React, { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { useProfile } from "../../hooks/useProfile";
import PageHeader from "../layouts/PageHeader";
import InvoiceCard from "../billing/InvoiceCard";
import InvoiceSummary from "../billing/InvoiceSummary";
import InvoiceFilters from "../billing/InvoiceFilters";
import {
  BillingEmptyState,
  NoResultsState,
  BillingHelp,
} from "../billing/BillingEmptyState";
import { InvoiceStatus } from "../../types";

interface BillingPageProps {
  onBack?: () => void;
  className?: string;
}

export const BillingPage: React.FC<BillingPageProps> = ({
  onBack,
  className,
}) => {
  const { state } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | "all">(
    "all"
  );
  const invoices = state.invoices || [];

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || invoice.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals and counts
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const pendingInvoices = invoices.filter((i) => i.status === "pending");

  const paidTotal = paidInvoices.reduce((sum, i) => sum + i.total, 0);
  const pendingTotal = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

  const statusCounts = {
    all: invoices.length,
    paid: paidInvoices.length,
    pending: pendingInvoices.length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    cancelled: invoices.filter((i) => i.status === "cancelled").length,
  };

  const handleDownload = async (invoiceId: string) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice?.downloadUrl) return;

    console.log("Downloading invoice:", invoiceId);
    // NOTE: Mock download behavior for demo; replace with real download logic
    alert(`Descargando factura ${invoice.invoiceNumber}...`);
  };

  // View details handled within InvoiceCard or via router when needed.

  const handleDownloadAll = () => {
    console.log("Download all invoices");
    // NOTE: Implement bulk download (e.g., zip generation or batch download)
    alert("Descargando todas las facturas...");
  };

  const hasInvoices = invoices.length > 0;
  const hasResults = filteredInvoices.length > 0;

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <PageHeader
        title="Información de Facturación"
        subtitle={`${invoices.length} ${
          invoices.length === 1 ? "factura" : "facturas"
        } disponibles`}
        onBack={onBack}
        actions={
          hasInvoices && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
              className="hidden sm:flex font-bold border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar todas
            </Button>
          )
        }
      />

      <div className="max-w-6xl mx-auto px-4 pb-8 space-y-6 mt-10">
        {hasInvoices ? (
          <>
            {/* Summary Cards */}
            <InvoiceSummary
              paidTotal={paidTotal}
              paidCount={paidInvoices.length}
              pendingTotal={pendingTotal}
              pendingCount={pendingInvoices.length}
              totalCount={invoices.length}
            />

            {/* Filters */}
            <InvoiceFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              statusCounts={statusCounts}
            />

            {/* Invoices List */}
            {hasResults ? (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              <NoResultsState />
            )}

            {/* Help Text */}
            <BillingHelp />
          </>
        ) : (
          <BillingEmptyState />
        )}
      </div>
    </div>
  );
};

BillingPage.displayName = "BillingPage";

export default BillingPage;
