"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { apiPost, apiGet } from "@/lib/api-client";
import type { CartProduct, BundleInfo } from "./useCart";

interface InvalidBundle {
  codCampana: string;
  productSku: string;
  reason: "expired" | "out_of_stock";
  affectedSkus: string[];
}

interface ValidateBundlesResponse {
  valid: boolean;
  invalidBundles: InvalidBundle[];
  updatedItems: CartProduct[];
}

interface BundleGroup {
  bundleInfo: BundleInfo;
  items: CartProduct[];
  totalPrice: number;
  totalDiscount: number;
  savings: number;
}

interface UseBundleValidationReturn {
  /** Indica si está validando bundles */
  isValidating: boolean;
  /** Lista de bundles inválidos encontrados */
  invalidBundles: InvalidBundle[];
  /** Grupos de bundles activos en el carrito */
  bundleGroups: BundleGroup[];
  /** Valida todos los bundles del carrito */
  validateBundles: () => Promise<ValidateBundlesResponse | null>;
  /** Verifica si un producto pertenece a un bundle */
  isProductInBundle: (sku: string, products: CartProduct[]) => boolean;
  /** Obtiene el bundle al que pertenece un producto */
  getProductBundle: (sku: string, products: CartProduct[]) => BundleInfo | undefined;
  /** Agrupa los productos por bundle */
  groupProductsByBundle: (products: CartProduct[]) => {
    bundleGroups: Map<string, CartProduct[]>;
    standaloneProducts: CartProduct[];
  };
}

const STORAGE_KEY = "cart-items";

/**
 * Hook para validar y gestionar bundles en el carrito.
 * Verifica vigencia, stock y agrupa productos por bundle.
 */
export function useBundleValidation(): UseBundleValidationReturn {
  const [isValidating, setIsValidating] = useState(false);
  const [invalidBundles, setInvalidBundles] = useState<InvalidBundle[]>([]);
  const [bundleGroups, setBundleGroups] = useState<BundleGroup[]>([]);

  /**
   * Verifica si un producto pertenece a un bundle
   */
  const isProductInBundle = useCallback(
    (sku: string, products: CartProduct[]): boolean => {
      const product = products.find((p) => p.sku === sku);
      return !!product?.bundleInfo;
    },
    []
  );

  /**
   * Obtiene el bundleInfo de un producto
   */
  const getProductBundle = useCallback(
    (sku: string, products: CartProduct[]): BundleInfo | undefined => {
      const product = products.find((p) => p.sku === sku);
      return product?.bundleInfo;
    },
    []
  );

  /**
   * Agrupa los productos por bundle y separa los productos individuales
   */
  const groupProductsByBundle = useCallback(
    (
      products: CartProduct[]
    ): {
      bundleGroups: Map<string, CartProduct[]>;
      standaloneProducts: CartProduct[];
    } => {
      const bundleGroups = new Map<string, CartProduct[]>();
      const standaloneProducts: CartProduct[] = [];

      for (const product of products) {
        if (product.bundleInfo) {
          const key = `${product.bundleInfo.codCampana}-${product.bundleInfo.productSku}`;
          if (!bundleGroups.has(key)) {
            bundleGroups.set(key, []);
          }
          bundleGroups.get(key)!.push(product);
        } else {
          standaloneProducts.push(product);
        }
      }

      return { bundleGroups, standaloneProducts };
    },
    []
  );

  /**
   * Calcula los grupos de bundles con totales
   */
  const calculateBundleGroups = useCallback(
    (products: CartProduct[]): BundleGroup[] => {
      const { bundleGroups } = groupProductsByBundle(products);
      const groups: BundleGroup[] = [];

      for (const [, items] of bundleGroups.entries()) {
        if (items.length === 0 || !items[0].bundleInfo) continue;

        const bundleInfo = items[0].bundleInfo;
        const totalPrice = items.reduce(
          (acc, item) =>
            acc + (item.originalPrice ?? item.price) * item.quantity,
          0
        );
        const totalDiscount = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        groups.push({
          bundleInfo,
          items,
          totalPrice,
          totalDiscount,
          savings: totalPrice - totalDiscount,
        });
      }

      return groups;
    },
    [groupProductsByBundle]
  );

  /**
   * Valida todos los bundles del carrito llamando al backend
   */
  const validateBundles =
    useCallback(async (): Promise<ValidateBundlesResponse | null> => {
      setIsValidating(true);

      try {
        const response = await apiPost<ValidateBundlesResponse>(
          "/api/cart/bundle/validate",
          {}
        );

        if (response) {
          setInvalidBundles(response.invalidBundles || []);

          // Si hay bundles inválidos, actualizar localStorage
          if (response.invalidBundles && response.invalidBundles.length > 0) {
            // Mostrar notificación por cada bundle inválido
            for (const invalid of response.invalidBundles) {
              const reason =
                invalid.reason === "expired"
                  ? "La promoción del bundle ha expirado"
                  : "Un producto del bundle está agotado";

              toast.warning("Bundle actualizado", {
                description: `${reason}. Los precios han sido actualizados.`,
                duration: 5000,
              });
            }

            // Actualizar productos en localStorage si el backend los devuelve
            if (response.updatedItems && response.updatedItems.length > 0) {
              try {
                localStorage.setItem(
                  STORAGE_KEY,
                  JSON.stringify(response.updatedItems)
                );
                window.dispatchEvent(new Event("storage"));
              } catch (error) {
                console.error(
                  "Error updating cart after bundle validation:",
                  error
                );
              }
            }
          }

          return response;
        }

        return null;
      } catch (error) {
        console.error("Error validating bundles:", error);
        return null;
      } finally {
        setIsValidating(false);
      }
    }, []);

  /**
   * Validación local de bundles (sin llamar al backend)
   * Verifica fechas de expiración
   */
  const validateBundlesLocally = useCallback((products: CartProduct[]) => {
    const now = new Date();
    const invalid: InvalidBundle[] = [];
    const { bundleGroups } = groupProductsByBundle(products);

    for (const [, items] of bundleGroups.entries()) {
      if (items.length === 0 || !items[0].bundleInfo) continue;

      const bundleInfo = items[0].bundleInfo;
      const fechaFinal = new Date(bundleInfo.fechaFinal);

      // Verificar si el bundle ha expirado
      if (fechaFinal < now) {
        invalid.push({
          codCampana: bundleInfo.codCampana,
          productSku: bundleInfo.productSku,
          reason: "expired",
          affectedSkus: items.map((i) => i.sku),
        });
      }
    }

    return invalid;
  }, [groupProductsByBundle]);

  /**
   * Efecto para validar bundles al montar y cuando cambia el carrito
   */
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setBundleGroups([]);
          setInvalidBundles([]);
          return;
        }

        const products = JSON.parse(stored) as CartProduct[];

        // Calcular grupos de bundles
        const groups = calculateBundleGroups(products);
        setBundleGroups(groups);

        // Validación local rápida (fechas de expiración)
        const localInvalid = validateBundlesLocally(products);
        if (localInvalid.length > 0) {
          setInvalidBundles(localInvalid);
          // Si hay bundles expirados localmente, validar con el backend
          validateBundles();
        }
      } catch (error) {
        console.error("Error processing cart for bundle validation:", error);
      }
    };

    // Ejecutar al montar
    handleStorageChange();

    // Escuchar cambios en localStorage
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleStorageChange);
    };
  }, [calculateBundleGroups, validateBundlesLocally, validateBundles]);

  return {
    isValidating,
    invalidBundles,
    bundleGroups,
    validateBundles,
    isProductInBundle,
    getProductBundle,
    groupProductsByBundle,
  };
}
