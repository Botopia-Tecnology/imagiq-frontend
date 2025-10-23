/**
 * @module MenuItem
 * @description Samsung-style menu item - clean and minimal
 */

import React from "react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  badge?: string | number;
  hasChevron?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  testId?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  badge,
  hasChevron = true,
  onClick,
  disabled = false,
  className,
  testId,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  // Support Space and Enter activation for keyboard users
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key;
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const Container: React.ElementType = onClick && !disabled ? "button" : "div";

  return (
    <Container
      className={cn(
        "flex items-center gap-4 p-4 md:p-5 border-b-2 border-gray-100 last:border-b-0",
        "transition-colors duration-200",
        onClick &&
          !disabled && [
            "cursor-pointer",
            "hover:bg-gray-50",
            "active:bg-gray-100",
          ],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick && !disabled ? handleClick : undefined}
      onKeyDown={onClick && !disabled ? handleKeyDown : undefined}
      // if Container is button, tabIndex/role/aria-disabled are handled natively
      tabIndex={onClick && !disabled ? 0 : -1}
      role={onClick ? undefined : "listitem"}
      aria-label={label}
      aria-disabled={disabled}
      data-testid={testId}
      type={Container === "button" ? "button" : undefined}
    >
      {/* Icon - Samsung style: simple and clean */}
      <div className="flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
      </div>

      {/* Label - Samsung style: bold text */}
      <span className="flex-1 text-base md:text-lg font-bold text-gray-900">
        {label}
      </span>

      {/* Badge - Samsung style: subtle */}
      {badge != null && (
        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold bg-gray-900 text-white rounded-full">
          {badge}
        </span>
      )}

      {/* Chevron */}
      {hasChevron && onClick && !disabled && (
        <ChevronRight
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          strokeWidth={2}
        />
      )}
    </Container>
  );
};

MenuItem.displayName = "MenuItem";

export default MenuItem;
