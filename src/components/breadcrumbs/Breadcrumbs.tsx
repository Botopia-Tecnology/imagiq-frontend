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
      className={`flex items-center text-sm overflow-hidden ${className}`}
    >
      <ol className="flex items-center space-x-2 min-w-0 flex-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center min-w-0 flex-shrink-0">
              {index > 0 && (
                <span className="mx-2 text-gray-400 flex-shrink-0" aria-hidden="true">
                  /
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors block max-w-[200px] overflow-hidden"
                  title={item.label}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`block overflow-hidden ${
                    isLast
                      ? "text-gray-900 font-medium max-w-[300px]"
                      : "text-gray-600 max-w-[200px]"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
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
