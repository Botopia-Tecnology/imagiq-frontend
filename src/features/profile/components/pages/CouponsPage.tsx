/**
 * @module CouponsPage
 * @description Samsung-style coupons page - clean and minimal
 */

import React, { useState, useMemo } from "react";
import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { useProfile } from "../../hooks/useProfile";
import PageHeader from "../layouts/PageHeader";
import { Coupon } from "../../types";
import CouponCard from "../coupons/CouponCard";
import CouponEmptyState from "../coupons/CouponEmptyState";
import CouponFilters from "../coupons/CouponFilters";
import CouponHelp from "../coupons/CouponHelp";

interface CouponsPageProps {
  onBack?: () => void;
  className?: string;
}

type FilterValue = "all" | "active" | "used" | "expired";

interface FilterOption {
  value: FilterValue;
  label: string;
  count: number;
}

const isCouponExpired = (expirationDate: Date): boolean => {
  return new Date(expirationDate) < new Date();
};

const isCouponActive = (coupon: Coupon): boolean => {
  return !coupon.isUsed && !isCouponExpired(coupon.expirationDate);
};

export const CouponsPage: React.FC<CouponsPageProps> = ({
  onBack,
  className,
}) => {
  const { state } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>("all");
  const [copiedCode, setCopiedCode] = useState<string>("");

  // Memoized coupon counts
  const couponCounts = useMemo(
    () => ({
      all: state.coupons.length,
      active: state.coupons.filter(isCouponActive).length,
      used: state.coupons.filter((c) => c.isUsed).length,
      expired: state.coupons.filter(
        (c) => !c.isUsed && isCouponExpired(c.expirationDate)
      ).length,
    }),
    [state.coupons]
  );

  // Memoized filtered coupons
  const filteredCoupons = useMemo(() => {
    return state.coupons.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      switch (selectedFilter) {
        case "all":
          return true;
        case "active":
          return isCouponActive(coupon);
        case "used":
          return coupon.isUsed;
        case "expired":
          return !coupon.isUsed && isCouponExpired(coupon.expirationDate);
        default:
          return true;
      }
    });
  }, [state.coupons, searchQuery, selectedFilter]);

  const handleCopyCode = async (code: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleUseCoupon = (couponId: string): void => {
    console.log("Use coupon:", couponId);
    globalThis.location.href = "/productos";
  };

  const filters: FilterOption[] = [
    { value: "all", label: "Todos", count: couponCounts.all },
    { value: "active", label: "Activos", count: couponCounts.active },
    { value: "used", label: "Usados", count: couponCounts.used },
    { value: "expired", label: "Expirados", count: couponCounts.expired },
  ];

  const showNoResultsMessage =
    filteredCoupons.length === 0 && state.coupons.length > 0;

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <PageHeader
        title="Mis Cupones"
        subtitle={`${state.coupons.length} ${
          state.coupons.length === 1 ? "cupón" : "cupones"
        }`}
        onBack={onBack}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              globalThis.location.href = "/productos";
            }}
            className="hidden sm:flex font-bold border-2 border-black hover:bg-black hover:text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            Usar Cupón
          </Button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 pb-8 mt-10">
        {/* Search and Filters */}
        {state.coupons.length > 0 && (
          <CouponFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            filters={filters}
          />
        )}

        {/* Coupons Grid */}
        {(() => {
          if (filteredCoupons.length > 0) {
            return (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
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
            );
          }

          if (state.coupons.length === 0) {
            return <CouponEmptyState filter="all" />;
          }

          if (showNoResultsMessage) {
            return (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
                <Gift
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No hay cupones en esta categoría
                </h3>
                <p className="text-gray-600">
                  Cambia el filtro para ver otros cupones
                </p>
              </div>
            );
          }

          return null;
        })()}

        {/* Help Text */}
        {state.coupons.length > 0 && <CouponHelp />}
      </div>
    </div>
  );
};

CouponsPage.displayName = "CouponsPage";

export default CouponsPage;
