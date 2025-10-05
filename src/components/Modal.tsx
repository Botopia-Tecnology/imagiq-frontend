"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  showHeader?: boolean;
  footer?: React.ReactNode;
  preventCloseOnOverlay?: boolean;
  preventCloseOnEsc?: boolean;
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  overlayClassName,
  contentClassName,
  headerClassName,
  footerClassName,
  showHeader = true,
  footer,
  preventCloseOnOverlay = false,
  preventCloseOnEsc = false,
  isLoading = false,
}: ModalProps) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-xl", // Smaller size for better visibility
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !preventCloseOnEsc && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, preventCloseOnEsc, isLoading, onClose]);

  const handleOverlayClick = () => {
    if (!preventCloseOnOverlay && !isLoading) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-start justify-center pt-40 pb-4 px-4 overflow-y-auto",
        overlayClassName || "bg-white bg-opacity-70 backdrop-blur-sm"
      )}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl w-full max-h-[calc(100vh-11rem)] border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200 mb-8 flex flex-col",
          sizes[size],
          contentClassName
        )}
        onClick={handleContentClick}
        style={{
          borderRadius: "1rem",
        }}
      >
        {showHeader && (
          <div
            className={cn(
              "flex-shrink-0 bg-white rounded-t-2xl border-b border-gray-200 p-4 flex justify-between items-center z-10",
              headerClassName
            )}
          >
            {title && (
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            )}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              type="button"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}
        <div
          className={cn(
            "flex-1 overflow-y-auto",
            showHeader ? "p-5" : footer ? "p-4" : "p-4 rounded-2xl"
          )}
          style={{
            borderRadius:
              showHeader && footer
                ? "0"
                : showHeader
                ? "0 0 1rem 1rem"
                : footer
                ? "1rem 1rem 0 0"
                : "1rem",
          }}
        >
          {children}
        </div>
        {footer && (
          <div
            className={cn(
              "flex-shrink-0 bg-white rounded-b-2xl border-t border-gray-200 p-4",
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
