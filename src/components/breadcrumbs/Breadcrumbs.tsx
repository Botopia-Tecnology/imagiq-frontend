"use client";

import Link from "next/link";
import { BreadcrumbItem } from "./types";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { useCategoryMetadataOptional } from "@/contexts/CategoryMetadataContext";

interface BreadcrumbsProps {
  productName?: string;
  customItems?: BreadcrumbItem[];
  className?: string;
  // New props for dynamic breadcrumbs from database
  productId?: string;
  categoryCode?: string;
  subcategoria?: string;
  menuUuid?: string;
  submenuUuid?: string;
}

/**
 * Breadcrumb navigation component
 * Automatically generates breadcrumbs based on current route and filters
 * Now supports dynamic category names from database via CategoryMetadataContext
 */
export default function Breadcrumbs({
  productName,
  customItems,
  className = "",
  productId,
  categoryCode,
  subcategoria,
  menuUuid,
  submenuUuid,
}: BreadcrumbsProps) {
  const metadata = useCategoryMetadataOptional();

  // Build dynamic items if we have product data and metadata is ready
  const dynamicItems =
    productId && metadata?.isReady
      ? metadata.buildDynamicBreadcrumbs(
          productId,
          categoryCode,
          subcategoria,
          menuUuid,
          submenuUuid
        )
      : undefined;

  const items = useBreadcrumbs({
    productName,
    customItems: dynamicItems || customItems,
  });

  // Show skeleton during loading if we expect dynamic content
  if (productId && metadata && !metadata.isReady && metadata.isLoading) {
    return (
      <nav
        aria-label="Breadcrumb loading"
        className={`flex items-center text-xs ${className}`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 font-normal">Inicio</span>
          <span className="mx-2 text-gray-500">/</span>
          <span className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
          <span className="mx-2 text-gray-500">/</span>
          <span className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  if (items.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs overflow-hidden ${className}`}
    >
      <ol className="flex items-center space-x-2 min-w-0 flex-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center min-w-0 flex-shrink-0"
            >
              {index > 0 && (
                <span
                  className="mx-2 text-gray-500 flex-shrink-0"
                  aria-hidden="true"
                >
                  /
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors block max-w-[200px] overflow-hidden font-normal"
                  title={item.label}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`block overflow-hidden font-normal ${
                    isLast
                      ? "text-gray-600 max-w-[300px]"
                      : "text-gray-500 max-w-[200px]"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                  }}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
