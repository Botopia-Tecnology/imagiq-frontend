import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FC } from "react";

type Props = {
  isAuthenticated: boolean;
  onClick: () => void;
  colorClass: string;
};

export const UserIcon: FC<Props> = ({ isAuthenticated, onClick, colorClass }) => (
  <button
    type="button"
    className={cn("flex items-center justify-center w-10 h-10", colorClass)}
    title={isAuthenticated ? "Dashboard" : "Ingresar"}
    aria-label={isAuthenticated ? "Dashboard" : "Ingresar"}
    onClick={onClick}
  >
    <User className={cn("w-7 h-7", colorClass)} />
  </button>
);
