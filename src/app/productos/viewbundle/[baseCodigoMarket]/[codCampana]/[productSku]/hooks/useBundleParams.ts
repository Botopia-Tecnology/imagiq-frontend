import { use } from "react";

interface BundleParams {
  baseCodigoMarket: string;
  codCampana: string;
  productSku: string;
}

interface ParamsWithBundleIds {
  baseCodigoMarket: string;
  codCampana: string;
  productSku: string;
}

/**
 * Hook para extraer y validar los parámetros de URL del bundle
 * Maneja la extracción type-safe de los parámetros dinámicos de Next.js
 */
export function useBundleParams(params: Promise<unknown>): BundleParams | null {
  const resolvedParams = use(params);

  const extractParam = (key: keyof ParamsWithBundleIds): string | undefined => {
    if (
      resolvedParams &&
      typeof resolvedParams === "object" &&
      key in resolvedParams
    ) {
      return (resolvedParams as ParamsWithBundleIds)[key];
    }
    return undefined;
  };

  const baseCodigoMarket = extractParam("baseCodigoMarket");
  const codCampana = extractParam("codCampana");
  const productSku = extractParam("productSku");

  if (!baseCodigoMarket || !codCampana || !productSku) {
    return null;
  }

  return { baseCodigoMarket, codCampana, productSku };
}
