import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FC } from "react";

type Props = {
  count: number;
  showBump: boolean;
  isClient: boolean;
  onClick: () => void;
  colorClass: string;
};

export const CartIcon: FC<Props> = ({ count, showBump, isClient, onClick, colorClass }) => (
  <Link
    href="/carrito"
    className={cn("flex items-center justify-center w-10 h-10", colorClass, "relative")}
    title="Carrito de compras"
    onClick={onClick}
  >
    <ShoppingCart className={cn("w-7 h-7", colorClass)} />
    {isClient && count > 0 && (
      <span
        className={cn(
          "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-extrabold transition-transform duration-150 ease-out",
          showBump ? "scale-110" : "scale-100"
        )}
        aria-live="polite"
      >
        {count > 99 ? "99+" : count}
      </span>
    )}
  </Link>
);
