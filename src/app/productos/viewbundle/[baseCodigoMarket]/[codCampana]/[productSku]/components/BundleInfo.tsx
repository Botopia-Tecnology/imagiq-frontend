"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { BundleOptionProps } from "@/lib/productMapper";
import type { BundleProduct } from "@/lib/api";
import { PurchaseSummary } from "./PurchaseSummary";
import { useCartContext } from "@/features/cart/CartContext";
import type { CartProduct, BundleInfo as BundleInfoType } from "@/hooks/useCart";
import {
  TradeInSelector,
  TradeInModal
} from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";

interface BundleInfoProps {
  bundleName: string;
  selectedOption: BundleOptionProps;
  bundleFechaFinal?: string;
  bundleOptionsCount: number;
  selectedOptionIndex: number;
  onOptionChange: (index: number) => void;
  codCampana: string;
  skusBundle: string[];
  onAddToCart?: (handler: () => Promise<void>) => void;
}

/**
 * Componente que muestra la información del bundle en la columna derecha
 * Incluye: nombre, productos incluidos, selector de opciones y resumen de compra
 */
export function BundleInfo({
  bundleName,
  selectedOption,
  bundleFechaFinal,
  bundleOptionsCount,
  selectedOptionIndex,
  onOptionChange,
  codCampana,
  skusBundle,
  onAddToCart: exposeAddToCart,
}: BundleInfoProps) {
  const router = useRouter();
  const { addBundleToCart } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);

  // Trade-In states
  const [tradeInOption, setTradeInOption] = useState<"no" | "yes">("no");
  const [isTradeInModalOpen, setIsTradeInModalOpen] = useState(false);
  const [tradeInCompleted, setTradeInCompleted] = useState(false);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [tradeInDeviceName, setTradeInDeviceName] = useState<string>("");

  // Verificar si alguno de los productos del bundle tiene ind_entre_estre === 1
  // Accedemos al campo de forma segura ya que viene de la API pero no está en el tipo
  const hasTradeIn = selectedOption.productos?.some((p) => (p as BundleProduct & { ind_entre_estre?: number }).ind_entre_estre === 1) || false;
  const productSku = selectedOption.product_sku;

  // Cargar datos de Trade-In desde localStorage al montar el componente
  useEffect(() => {
    if (!hasTradeIn) return;

    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const data = JSON.parse(storedTradeIn);
        let tradeInData = data;

        // Si hay un SKU específico, buscar los datos para ese SKU
        if (productSku && typeof data === 'object' && !data.deviceName) {
          tradeInData = data[productSku];
        }

        if (tradeInData && tradeInData.completed) {
          setTradeInCompleted(true);
          setTradeInValue(tradeInData.value);
          setTradeInDeviceName(tradeInData.deviceName);
          setTradeInOption("yes");
        }
      } catch (error) {
        console.error("Error al cargar datos de Trade-In:", error);
      }
    }
  }, [hasTradeIn, productSku]);

  // Construir detalles de productos para el resumen
  const productDetails = selectedOption.productos
    ?.map((p) => {
      const details = [p.modelo];
      if (p.nombreColor) details.push(p.nombreColor);
      if (p.capacidad) details.push(p.capacidad);
      return details.join(" | ");
    })
    .join("\n");

  // Función para agregar al carrito
  const handleAddToCart = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (!selectedOption.productos || selectedOption.productos.length === 0) {
        toast.error("No se pudo agregar el bundle", {
          description: "No hay productos disponibles en este bundle",
        });
        return;
      }

      const products: Omit<CartProduct, "quantity">[] = selectedOption.productos.map((product) => ({
        id: (product.codigoMarket || product.sku).split('/')[0],
        name: product.modelo,
        image: product.imagePreviewUrl || "/img/logo_imagiq.png",
        price: product.product_discount_price,
        originalPrice: product.product_original_price,
        sku: product.sku,
        ean: product.ean || product.sku,
        color: product.color,
        colorName: product.nombreColor,
        capacity: product.capacidad,
        ram: product.memoriaram,
        stock: product.stockTotal,
        modelo: product.modelo,
      }));

      const firstProduct = selectedOption.productos[0];
      const bundleInfo: BundleInfoType = {
        codCampana,
        productSku: selectedOption.product_sku,
        skusBundle: skusBundle,
        bundlePrice: firstProduct.bundle_price,
        bundleDiscount: firstProduct.bundle_discount,
        fechaFinal: bundleFechaFinal ? new Date(bundleFechaFinal) : new Date(),
      };

      await addBundleToCart(products, bundleInfo);

      toast.success("Bundle agregado al carrito", {
        description: "El bundle se ha agregado correctamente",
      });

      // Si hay Trade-In completado, navegar al carrito
      if (tradeInCompleted && tradeInOption === "yes") {
        router.push("/carrito/step1");
      }
    } catch (error) {
      console.error("Error al agregar bundle:", error);
      toast.error("Error al agregar el bundle", {
        description: "Por favor intenta de nuevo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Exponer la función handleAddToCart al componente padre
  useEffect(() => {
    if (exposeAddToCart) {
      exposeAddToCart(handleAddToCart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exposeAddToCart]);

  // Handlers de Trade-In
  const handleOpenTradeInModal = () => {
    setIsTradeInModalOpen(true);
  };

  const handleTradeInChange = (option: "no" | "yes") => {
    setTradeInOption(option);

    if (option === "no") {
      setTradeInCompleted(false);
      setTradeInValue(0);
      setTradeInDeviceName("");

      // Limpiar localStorage
      if (productSku) {
        try {
          const storedTradeIn = localStorage.getItem("imagiq_trade_in");
          if (storedTradeIn) {
            const data = JSON.parse(storedTradeIn);
            if (typeof data === 'object' && !data.deviceName) {
              delete data[productSku];
              localStorage.setItem("imagiq_trade_in", JSON.stringify(data));
            }
          }
        } catch (e) {
          console.error("Error cleaning trade-in for SKU:", e);
        }
      }
    }
  };

  const handleCompleteTradeIn = (deviceName: string, value: number) => {
    setTradeInCompleted(true);
    setTradeInValue(value);
    setTradeInDeviceName(deviceName);
    setIsTradeInModalOpen(false);
  };

  const handleCancelWithoutCompletion = () => {
    setTradeInOption("no");
    setIsTradeInModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Oferta válida hasta */}
      {bundleFechaFinal && (
        <p className="text-sm font-semibold text-blue-600">
          Oferta válida hasta:{" "}
          {new Date(bundleFechaFinal).toLocaleDateString("es-CO")}
        </p>
      )}

      {/* Selector de opciones */}
      {bundleOptionsCount > 1 && (
        <OptionsSelector
          optionsCount={bundleOptionsCount}
          selectedIndex={selectedOptionIndex}
          onSelect={onOptionChange}
        />
      )}

      {/* Trade-In Selector - Solo si el bundle acepta entrego y estreno */}
      {hasTradeIn && (
        <TradeInSelector
          selectedOption={tradeInOption}
          onSelectionChange={handleTradeInChange}
          onOpenModal={handleOpenTradeInModal}
          isCompleted={tradeInCompleted}
          completedDeviceName={tradeInDeviceName}
          completedTradeInValue={tradeInValue}
        />
      )}

      {/* Resumen de compra con precio y botones */}
      <PurchaseSummary
        productName={bundleName}
        productDetails={productDetails}
        price={selectedOption.price}
        originalPrice={selectedOption.originalPrice}
        discount={selectedOption.discount}
        hasStock={(selectedOption.stockTotal ?? 0) > 0}
        onAddToCart={handleAddToCart}
        isLoading={isLoading}
      />

      {/* Modal de Trade-In */}
      {hasTradeIn && (
        <TradeInModal
          isOpen={isTradeInModalOpen}
          onClose={() => setIsTradeInModalOpen(false)}
          onContinue={() => setIsTradeInModalOpen(false)}
          onCancelWithoutCompletion={handleCancelWithoutCompletion}
          onCompleteTradeIn={handleCompleteTradeIn}
          productSku={productSku}
        />
      )}
    </div>
  );
}

function OptionsSelector({
  optionsCount,
  selectedIndex,
  onSelect,
}: {
  optionsCount: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Opciones disponibles:</h3>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: optionsCount }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={`px-4 py-2 rounded-md border transition-all ${selectedIndex === index
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
          >
            Opción {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
