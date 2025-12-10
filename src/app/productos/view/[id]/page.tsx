"use client";

import React, { use } from "react";
import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import smartphonesImg from "@/img/dispositivosmoviles/cel1.png";
import {
  ProductCardProps,
  ProductColor,
} from "@/app/productos/components/ProductCard";
import type {
  ProductVariant,
  ColorOption,
  UseProductSelectionReturn,
} from "@/hooks/useProductSelection";
import DetailsProductSection from "@/app/productos/dispositivos-moviles/detalles-producto/DetailsProductSection";
import ProductDetailSkeleton from "@/app/productos/dispositivos-moviles/detalles-producto/ProductDetailSkeleton";
import AddToCartButton from "../../viewpremium/components/AddToCartButton";
import StockNotificationModal from "@/components/StockNotificationModal";
import { useStockNotification } from "@/hooks/useStockNotification";
import { useAnalytics } from "@/lib/analytics/hooks/useAnalytics";
import { useTradeInPrefetch } from "@/hooks/useTradeInPrefetch";

// Type for the product selection data passed from DetailsProductSection
// This is a subset of UseProductSelectionReturn with only the properties passed by the callback
type ProductSelectionData = {
  selectedSku: string | null;
  selectedPrice: number | null;
  selectedOriginalPrice: number | null;
  selectedStockTotal: number | null;
  selectedVariant: ProductVariant | null;
  selectedSkuPostback: string | null;
  selection: {
    selectedColor: string | null;
    selectedCapacity: string | null;
    selectedMemoriaram: string | null;
  };
  getSelectedColorOption: () => ColorOption | null;
};

// Convierte ProductCardProps a formato esperado por ViewProduct
function convertProductForView(product: ProductCardProps) {
  const image =
    typeof product.image === "string" ? smartphonesImg : product.image;
  const safeValue = (
    value: string | number | null | undefined,
    fallback: string = "None"
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return fallback;
    }
    return String(value);
  };
  return {
    id: safeValue(product.id, "None"),
    name: safeValue(product.name, "None"),
    image: image,
    price: safeValue(product.price, "None"),
    originalPrice: product.originalPrice
      ? safeValue(product.originalPrice)
      : undefined,
    discount: product.discount ? safeValue(product.discount) : undefined,
    colors:
      product.colors?.map((color: ProductColor) => ({
        name: safeValue(color.name || color.label, "None"),
        hex: safeValue(color.hex, "#808080"),
      })) || [],
    category: product.apiProduct?.categoria || "", // Use category from API
    description: safeValue(product.apiProduct?.descGeneral?.[0], "None"),
    specs: [
      { label: "Marca", value: "Samsung" }, // ProductApiData no tiene campo marca, todos son Samsung
      { label: "Modelo", value: safeValue(product.apiProduct?.modelo?.[0], "None") },
      {
        label: "Categoría",
        value: safeValue(product.apiProduct?.categoria, "None"),
      },
      {
        label: "Subcategoría",
        value: safeValue(product.apiProduct?.subcategoria, "None"),
      },
      {
        label: "Capacidad",
        value: safeValue(
          product.selectedCapacity?.value || product.capacities?.[0]?.value,
          "None"
        ),
      },
      {
        label: "SKU",
        value: safeValue(
          product.selectedColor?.sku || product.colors?.[0]?.sku,
          "None"
        ),
      },
    ],
  };
}

// Wrapper para manejar el estado de carga de variantes
function ProductContentWithVariants({
  product,
  onVariantsReady,
  onProductSelectionChange,
  productSelection,
  onNotifyStock,
}: {
  product: ProductCardProps;
  onVariantsReady: (ready: boolean) => void;
  onProductSelectionChange?: (selection: ProductSelectionData) => void;
  productSelection: ProductSelectionData | null;
  onNotifyStock?: () => void;
}) {
  const convertedProduct = convertProductForView(product);

  return (
    <>
      <DetailsProductSection
        product={product}
        onVariantsReady={onVariantsReady}
        onProductSelectionChange={onProductSelectionChange}
      />
      <ViewProduct product={convertedProduct} flix={product} productSelection={productSelection} />
      <AddToCartButton
        product={product}
        productSelection={productSelection}
        onNotifyStock={onNotifyStock}
      />
    </>
  );
}

// @ts-expect-error Next.js infiere el tipo de params automáticamente
export default function ProductViewPage({ params }) {
  const resolvedParams = use(params);
  type ParamsWithId = { id: string };
  const id =
    resolvedParams &&
      typeof resolvedParams === "object" &&
      "id" in resolvedParams
      ? (resolvedParams as ParamsWithId).id
      : undefined;
  // Estado para almacenar el producto inicial desde localStorage (Optimistic UI)
  const [initialProduct, setInitialProduct] = React.useState<ProductCardProps | null>(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        const saved = localStorage.getItem(`product_selection_${id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convertir datos guardados a estructura ProductCardProps mínima necesaria
          return {
            id: id,
            name: parsed.productName || "",
            image: parsed.image || smartphonesImg.src,
            price: parsed.price?.toString(),
            originalPrice: parsed.originalPrice?.toString(),
            colors: parsed.color ? [{
              name: parsed.color,
              hex: parsed.colorHex || "#000000",
              label: parsed.color,
              sku: parsed.sku || "",
              ean: parsed.ean || ""
            }] : [],
            capacities: parsed.capacity ? [{
              value: parsed.capacity,
              label: parsed.capacity
            }] : [],
            segmento: parsed.segmento,
            skuflixmedia: parsed.skuflixmedia, // Mapear skuflixmedia desde localStorage
            // Datos mínimos para que funcione la UI
            apiProduct: {
              codigoMarketBase: id,
              codigoMarket: [],
              nombreMarket: [parsed.productName || ""],
              categoria: "Móviles", // Fallback seguro
              subcategoria: "",
              modelo: [parsed.productName || ""],
              color: [],
              capacidad: [],
              memoriaram: [],
              descGeneral: [],
              sku: [],
              ean: [],
              desDetallada: [],
              stockTotal: [],
              cantidadTiendas: [],
              cantidadTiendasReserva: [],
              urlImagenes: [],
              urlRender3D: [],
              imagePreviewUrl: [],
              imageDetailsUrls: [],
              precioNormal: [],
              precioeccommerce: [],
              fechaInicioVigencia: [],
              fechaFinalVigencia: [],
              indRetoma: [],
              indcerointeres: [],
              skuPostback: [],
              skuflixmedia: parsed.skuflixmedia ? [parsed.skuflixmedia] : [], // También en apiProduct por si acaso
            }
          } as ProductCardProps;
        }
      } catch (e) {
        console.error("Error parsing saved product selection:", e);
      }
    }
    return null;
  });

  const { product: apiProduct, loading, error } = useProduct(id ?? "");

  // Usar producto del API si está listo, sino usar el inicial de localStorage
  const product = apiProduct || initialProduct;

  const [variantsReady, setVariantsReady] = React.useState(false);
  const [productSelection, setProductSelection] =
    React.useState<ProductSelectionData | null>(null);
  const stockNotification = useStockNotification();
  const { trackViewItem } = useAnalytics();

  // 🚀 Prefetch automático de datos de Trade-In
  useTradeInPrefetch();

  // Reset variants ready cuando cambia el producto
  React.useEffect(() => {
    setVariantsReady(false);
  }, [id]);

  // 🔥 Track View Item apenas el producto carga (solo una vez por producto)
  React.useEffect(() => {
    if (product && !loading) {
      const productPrice =
        typeof product.price === "number"
          ? product.price
          : Number.parseFloat(String(product.price)) || 0;

      trackViewItem({
        item_id: product.id,
        item_name: product.name,
        item_brand: "Samsung",
        item_category: product.apiProduct?.categoria || "Sin categoría",
        price: productPrice,
        currency: "COP",
      });
    }
    // Solo ejecutar cuando el producto carga, NO cuando cambia la selección de variante
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, loading]);

  // Callback para recibir productSelection desde DetailsProductSection
  const handleProductSelectionChange = React.useCallback(
    (selection: ProductSelectionData) => {
      setProductSelection(selection);
    },
    []
  );

  // Handler para notificación de stock
  const handleRequestStockNotification = async (email: string) => {
    if (!product || !productSelection) return;

    // Obtener el SKU del producto seleccionado
    const selectedSku = productSelection.selectedSku;

    // Obtener el codigoMarket correspondiente a la variante seleccionada
    const codigoMarket =
      productSelection.selectedVariant?.codigoMarket ||
      product.apiProduct?.codigoMarketBase ||
      "";

    await stockNotification.requestNotification({
      productName: product.name,
      email,
      sku: selectedSku || undefined,
      codigoMarket,
    });
  };

  if (!id) {
    return notFound();
  }

  // Solo mostrar error si no tenemos ni producto API ni producto inicial
  if (error && !product) {
    return notFound();
  }

  // Solo mostrar skeleton si no tenemos ningún producto
  if (!product && loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Producto no encontrado
            </h2>
            <p className="text-gray-600">
              El producto que buscas no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Consideramos cargado si tenemos producto (sea local o API)
  // Si es local, variantsReady podría ser false inicialmente, pero queremos mostrar contenido
  const isFullyLoaded = !!product;

  return (
    <>
      {/* Mostrar skeleton solo si no hay producto en absoluto */}
      {!isFullyLoaded && <ProductDetailSkeleton />}

      {/* Modal de notificación de stock */}
      <StockNotificationModal
        isOpen={stockNotification.isModalOpen}
        onClose={stockNotification.closeModal}
        productName={product.name}
        productImage={
          productSelection?.selectedVariant?.imagePreviewUrl ||
          (typeof product.image === "string"
            ? product.image
            : smartphonesImg.src)
        }
        selectedColor={
          productSelection?.getSelectedColorOption?.()?.nombreColorDisplay ||
          productSelection?.selection?.selectedColor ||
          undefined
        }
        selectedStorage={
          productSelection?.selection?.selectedCapacity || undefined
        }
        onNotificationRequest={handleRequestStockNotification}
      />

      {/* Renderizar contenido inmediatamente si tenemos producto */}
      <div style={{ display: isFullyLoaded ? "block" : "none" }}>
        <ProductContentWithVariants
          product={product}
          onVariantsReady={setVariantsReady}
          onProductSelectionChange={handleProductSelectionChange}
          productSelection={productSelection}
          onNotifyStock={stockNotification.openModal}
        />
      </div>
    </>
  );
}
