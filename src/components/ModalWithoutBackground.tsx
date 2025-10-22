"use client";

import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export default function ModalWithoutBackground({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
}: ModalProps) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto">
      <div
        className="fixed inset-0 backdrop-blur-sm bg-white/10 pointer-events-auto"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-xl w-full mx-4 pointer-events-auto", // w-full + mx-4 para móviles
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between p-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  // Renderizar el modal usando un portal en el body
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
