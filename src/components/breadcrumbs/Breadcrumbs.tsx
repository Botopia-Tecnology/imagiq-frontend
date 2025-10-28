"use client";

import Link from "next/link";
import { BreadcrumbItem } from "./types";
import { useBreadcrumbs } from "./useBreadcrumbs";

interface BreadcrumbsProps {
  productName?: string;
  customItems?: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component
 * Automatically generates breadcrumbs based on current route and filters
 */
export default function Breadcrumbs({
  productName,
  customItems,
  className = "",
}: BreadcrumbsProps) {
  const items = useBreadcrumbs({ productName, customItems });

  if (items.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  /
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "text-gray-900 font-medium"
                      : "text-gray-600"
                  }
                  aria-current={isLast ? "page" : undefined}
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
