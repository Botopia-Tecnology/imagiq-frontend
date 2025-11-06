"use client";

import React, { forwardRef, useEffect } from "react";
import { ProductCardProps } from "@/app/productos/components/ProductCard";
import ARExperienceHandler from "../../electrodomesticos/components/ARExperienceHandler";
import { useCeroInteres } from "@/hooks/useCeroInteres";
import { useProductSelection } from "@/hooks/useProductSelection";

interface ProductInfoProps {
  product: ProductCardProps;
  selectedColor: string | null;
  selectedStorage: string | null;
  selectedRam: string | null;
  indcerointeres: number; // 0 = sin cuotas, 1 = mostrar "test"
  setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedStorage: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedRam: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  currentImageIndex: number;
  productImages: string[];
  onOpenModal: () => void;
}

const ProductInfo = forwardRef<HTMLDivElement, ProductInfoProps>(({
  product,
  selectedColor,
  selectedStorage,
  selectedRam,
  indcerointeres,
  setSelectedColor,
  setSelectedStorage,
  setSelectedRam,
  setCurrentImageIndex,
  currentImageIndex,
  productImages,
  onOpenModal,
}, ref) => {
  // Hook para manejo inteligente de selección de productos
  const productSelection = useProductSelection(product.apiProduct || {
    codigoMarketBase: product.id,
    codigoMarket: [],
    nombreMarket: product.name,
    categoria: '',
    subcategoria: '',
    modelo: '',
    color: [],
    capacidad: [],
    memoriaram: [],
    descGeneral: null,
    sku: [],
    ean: [],
    desDetallada: [],
    stockTotal: [],
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
  });

  // Obtener precio actual desde el hook de selección o usar el fallback legacy
  const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
  const priceStr = selectedCapacity?.price || product.price || "0";
  const legacyPrice = Number.parseInt(priceStr.replaceAll(/[^\d]/g, ''), 10);

  // Usar precio del sistema de selección si está disponible
  const currentPrice = productSelection.selectedPrice || legacyPrice;

  // Hook para cuotas sin interés (solo cuando indcerointeres === 1)
  const ceroInteres = useCeroInteres(
    product.apiProduct?.precioeccommerce || [],
    currentPrice,
    indcerointeres,
    true
  );

  // Sincronizar los estados del padre cuando cambie la selección del hook
  useEffect(() => {
    if (product.apiProduct && productSelection.selectedVariant) {
      // Actualizar los estados del padre para mantener sincronización
      const variant = productSelection.selectedVariant;

      // Encontrar el color correspondiente en product.colors
      const colorObj = product.colors?.find(c => c.label === variant.color);
      if (colorObj && colorObj.name !== selectedColor) {
        setSelectedColor(colorObj.name);
      }

      // Actualizar capacidad
      if (variant.capacity !== selectedStorage) {
        const capacityObj = product.capacities?.find(c => c.label === variant.capacity);
        setSelectedStorage(capacityObj?.value || variant.capacity);
      }

      // Actualizar RAM
      if (variant.memoriaram !== selectedRam) {
        setSelectedRam(variant.memoriaram);
      }
    }
  }, [productSelection.selectedVariant, product.apiProduct, product.colors, product.capacities, selectedColor, selectedStorage, selectedRam, setSelectedColor, setSelectedStorage, setSelectedRam]);

  return (
    <div ref={ref} className="w-full lg:col-span-3">
      <div className="lg:sticky lg:top-20">
        {/* Espacio en blanco superior */}
        <div className="h-8"></div>


        {/* Dispositivo */}
        <div className="mb-20">
          {/* Información de SKU, Código y Stock */}
          <div className="mb-4 space-y-1">
            {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === 'true' && productSelection.selectedSku && (
              <p className="text-sm text-gray-600">
                SKU: {productSelection.selectedSku}
              </p>
            )}
            {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === 'true' && productSelection.selectedCodigoMarket && (
              <p className="text-sm text-gray-600">
                Código: {productSelection.selectedCodigoMarket}
              </p>
            )}
            {productSelection.selectedStockTotal !== null && (
              <p className="text-sm text-gray-600">
                Stock Total: {productSelection.selectedStockTotal}
              </p>
            )}
          </div>

          <div className="border-2 border-blue-600 rounded-md p-4 bg-blue-50/30">
            <div className="flex items-center justify-between gap-3">
              <div className="font-bold text-black text-lg flex-1 self-center">{product.name}</div>
              <div className="text-right self-center">
                {(() => {
                  // Usar precio del sistema de selección si está disponible
                  const priceDisplay = productSelection.selectedPrice
                    ? `$ ${Math.round(productSelection.selectedPrice).toLocaleString('es-CO')}`
                    : (product.capacities?.find(c => c.value === selectedStorage)?.price || product.price || "Precio no disponible");
                  const monthlyPrice = Math.round(currentPrice / 12);

                  // Renderizar según indcerointeres
                  if (indcerointeres === 0) {
                    // CASO 0: Solo precio de contado (SIN cuotas)
                    return (
                      <div className="text-2xl text-black font-bold">
                        {priceDisplay}
                      </div>
                    );
                  }

                  if (indcerointeres === 1) {
                    // CASO 1: Cuotas sin interés (0%)
                    const textoInteresCompleto = ceroInteres.formatText();
                    const textoInteresSimple = ceroInteres.formatTextSimple();
                    
                    // Si hay error o está cargando, solo mostrar precio
                    if (ceroInteres.error || !textoInteresCompleto || !textoInteresSimple) {
                      return (
                        <div className="text-xl sm:text-2xl text-black font-bold">
                          {priceDisplay}
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* Layout limpio - simplificado en móvil */}
                        <div className="flex flex-col items-end gap-1">
                          {/* Móvil: Texto simplificado - Desktop: Texto completo */}
                          <div className="text-xs sm:text-sm md:text-base font-bold text-[#222] leading-tight text-right">
                            <span className="md:hidden">{textoInteresSimple}</span>
                            <span className="hidden md:inline">{textoInteresCompleto}</span>
                          </div>
                          {/* Separador "o" solo en móvil */}
                          <span className="text-[10px] text-gray-500 md:hidden">o</span>
                          {/* Precio de contado */}
                          <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-black font-bold">
                            {priceDisplay}
                          </div>
                        </div>
                      </>
                    );
                  }

                  // DEFAULT: Con financiación Addi
                  return (
                    <>
                      <div className="text-sm text-black">
                        Desde $ {monthlyPrice.toLocaleString('es-CO')} al mes o
                      </div>
                      <div className="text-2xl text-black">
                        {priceDisplay}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Almacenamiento */}
        {(() => {
          // Mostrar TODAS las capacidades disponibles para el color seleccionado (sin filtrar por RAM)
          const availableCapacities = product.apiProduct
            ? Array.from(new Set(
                productSelection.allVariants
                  .filter(v =>
                    v.color === productSelection.selection.selectedColor &&
                    v.capacity &&
                    v.capacity.trim() !== '' &&
                    v.capacity.toLowerCase() !== 'no aplica'
                  )
                  .map(v => v.capacity)
              ))
            : product.capacities?.filter(cap => {
                const normalizedLabel = cap.label?.toLowerCase().trim() || '';
                return !normalizedLabel.includes('no aplica') &&
                       normalizedLabel !== 'n/a' &&
                       normalizedLabel !== 'na' &&
                       normalizedLabel !== 'no' &&
                       normalizedLabel !== '';
              }).map(c => c.label) || [];

          if (availableCapacities.length === 0) return null;

          return (
          <div className="mb-6 mt-8">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-bold text-black">Almacenamiento</h3>
            </div>
            <p className="text-sm text-black mb-4">Compra tu smartphone de mayor capacidad a menor precio</p>

            <div className="space-y-3">
              {availableCapacities.map((capacityLabel, index) => {
                // Buscar información de la capacidad desde product.capacities o desde el hook
                const capacityInfo = product.capacities?.find(c => c.label === capacityLabel);
                const isSelected = product.apiProduct
                  ? productSelection.selection.selectedCapacity === capacityLabel
                  : capacityInfo?.value === selectedStorage;

                // Obtener precio: buscar cualquier variante con esta capacidad para mostrar su precio
                let priceStr = "0";
                if (product.apiProduct) {
                  // Si es la capacidad seleccionada actualmente, usar el precio seleccionado
                  if (isSelected && productSelection.selectedPrice) {
                    priceStr = `$ ${Math.round(productSelection.selectedPrice).toLocaleString('es-CO')}`;
                  } else {
                    // Si no, buscar cualquier variante con esta capacidad para obtener su precio
                    const variantWithCapacity = productSelection.allVariants.find(v => v.capacity === capacityLabel);
                    if (variantWithCapacity && variantWithCapacity.precioeccommerce) {
                      priceStr = `$ ${Math.round(variantWithCapacity.precioeccommerce).toLocaleString('es-CO')}`;
                    }
                  }
                } else if (capacityInfo?.price) {
                  priceStr = capacityInfo.price;
                }

                const priceNumber = typeof priceStr === 'string'
                  ? parseInt(priceStr.replace(/[^\d]/g, ''))
                  : priceStr;
                const monthlyPrice = Math.round(priceNumber / 12);
                const formattedLabel = String(capacityLabel || "")
                  .replace(/(\d+)\s*gb\b/i, '$1 GB');

                return (
                  <div key={index}>
                    <div
                      onClick={() => {
                        if (product.apiProduct) {
                          productSelection.selectCapacity(capacityLabel);
                        } else {
                          setSelectedStorage(capacityInfo?.value || capacityLabel);
                        }
                      }}
                      className={`border-2 rounded-md p-4 cursor-pointer transition-all ${isSelected
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-black text-base">
                          {formattedLabel}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-700">
                            $ {monthlyPrice.toLocaleString('es-CO')} al mes o
                          </div>
                          <div className="text-lg text-black">
                            {priceStr !== "0" ? priceStr : "Precio no disponible"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Información importante */}
            <div className="mt-3 p-3">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Información importante: Memoria ROM
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Parte del espacio de la memoria esta ocupada por contenidos preinstalados. Para este dispositivo, el espacio disponible para el usuario es aproximadamente el 87% de la capacidad total de la memoria indicada.
              </p>
            </div>
          </div>
          );
        })()}

        {/* Memoria RAM */}
        {(() => {
          // Mostrar TODAS las opciones de RAM disponibles para el color seleccionado (sin filtrar por capacidad)
          const availableRamOptions = product.apiProduct
            ? Array.from(new Set(
                productSelection.allVariants
                  .filter(v =>
                    v.color === productSelection.selection.selectedColor &&
                    v.memoriaram &&
                    v.memoriaram.trim() !== '' &&
                    v.memoriaram.toLowerCase() !== 'no aplica'
                  )
                  .map(v => v.memoriaram)
              ))
            : [];

          // Solo mostrar si hay opciones de RAM válidas
          if (availableRamOptions.length === 0) return null;

          return (
            <div className="mb-6 mt-8">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-2xl font-bold text-black">Memoria RAM</h3>
              </div>
              <p className="text-sm text-black mb-4">Elige tu Memoria Ram</p>

              <div className="grid grid-cols-2 gap-4">
                {availableRamOptions.map((ram, index) => {
                  const isSelected = product.apiProduct
                    ? productSelection.selection.selectedMemoriaram === ram
                    : ram === selectedRam;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (product.apiProduct) {
                          productSelection.selectMemoriaram(ram);
                        } else {
                          setSelectedRam(ram);
                        }
                      }}
                      className={`border-2 rounded-md px-6 py-6 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/30"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <span className="font-semibold text-base">{ram}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Color */}
        {(() => {
          // Usar colores disponibles del hook de selección
          const availableColorNames = product.apiProduct
            ? productSelection.availableColors
            : product.colors?.filter(color => {
                const normalizedLabel = color.label?.toLowerCase().trim() || '';
                return !normalizedLabel.includes('no aplica') &&
                       normalizedLabel !== 'n/a' &&
                       normalizedLabel !== 'na' &&
                       normalizedLabel !== 'no' &&
                       normalizedLabel !== '';
              }).map(c => c.name) || [];

          // Mapear nombres de colores disponibles a objetos de color completos
          const validColors = availableColorNames.map(colorName => {
            if (product.apiProduct) {
              // Buscar el color en el array de colors del producto
              const colorInfo = product.colors?.find(c => c.label === colorName);
              if (colorInfo) return colorInfo;

              // Si no se encuentra, crear un color básico
              return {
                name: colorName.toLowerCase().replace(/\s+/g, '-'),
                hex: '#808080',
                label: colorName,
                sku: '',
                ean: ''
              };
            }
            // Legacy: buscar por name
            return product.colors?.find(c => c.name === colorName) || {
              name: colorName,
              hex: '#808080',
              label: colorName,
              sku: '',
              ean: ''
            };
          });

          if (validColors.length === 0) return null;

          return (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-gray-900">Color</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">Selecciona el color de tu dispositivo.</p>

            {/* Selectores de color - SOLO DESKTOP */}
            <div className="hidden lg:flex gap-4 justify-center">
              {validColors.map((color, index) => {
                const isSelected = product.apiProduct
                  ? productSelection.selection.selectedColor === color.label
                  : color.name === selectedColor;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (product.apiProduct) {
                        productSelection.selectColor(color.label);
                      } else {
                        setSelectedColor(color.name);
                      }
                      setCurrentImageIndex(0);
                    }}
                    className="flex flex-col items-center cursor-pointer transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-black ring-2 ring-black ring-offset-2 scale-110"
                          : color.hex === '#000000' || color.hex.toLowerCase() === '#000000'
                            ? "border-gray-400 hover:border-gray-600 hover:scale-105"
                            : "border-gray-300 hover:border-gray-400 hover:scale-105"
                        }`}
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: (color.hex === '#000000' || color.hex.toLowerCase() === '#000000') && !isSelected
                          ? 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                          : undefined
                      }}
                    ></div>
                    <div className={`font-medium text-center text-xs mt-2 ${isSelected ? "text-black" : "text-gray-600"
                      }`}>
                      {color.label}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Botón AR Experience - SOLO DESKTOP Y TABLET */}
            {(() => {
              const urlRender3D = product.apiProduct && productSelection.selectedVariant?.urlRender3D
                ? productSelection.selectedVariant.urlRender3D
                : null;

              return urlRender3D && urlRender3D.trim() !== "" ? (
                <div className="hidden lg:flex justify-center mt-6">
                  <ARExperienceHandler
                    glbUrl={urlRender3D}
                    usdzUrl={urlRender3D}
                  />
                </div>
              ) : null;
            })()}

            {/* Carrusel de imágenes del color - SOLO MOBILE */}
            {productImages.length > 0 && (
              <div className="mt-6 lg:hidden">
                <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={productImages[currentImageIndex % productImages.length]}
                    src={productImages[currentImageIndex % productImages.length]}
                    alt={`${product.name} - ${selectedColor} ${(currentImageIndex % productImages.length) + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Error loading image:', productImages[currentImageIndex % productImages.length], e);
                    }}
                  />
                </div>

                {/* Botón Ver más */}
                <div className="flex justify-center mt-4 mb-6">
                  <button
                    onClick={onOpenModal}
                    className="px-6 py-2.5 bg-white text-black border-2 border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all hover:scale-105"
                  >
                    Ver más
                  </button>
                </div>



                {/* Selectores de color - SOLO MOBILE - Debajo de Ver más */}
                <div className="flex gap-4 justify-center mb-6">
                  {validColors.map((color, index) => {
                    const isSelected = product.apiProduct
                      ? productSelection.selection.selectedColor === color.label
                      : color.name === selectedColor;

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          if (product.apiProduct) {
                            productSelection.selectColor(color.label);
                          } else {
                            setSelectedColor(color.name);
                          }
                          setCurrentImageIndex(0);
                        }}
                        className="flex flex-col items-center cursor-pointer transition-all"
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-2 transition-all ${isSelected
                            ? "border-black ring-2 ring-black ring-offset-2 scale-110"
                            : "border-gray-300 hover:border-gray-400 hover:scale-105"
                            }`}
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className={`font-medium text-center text-xs mt-2 ${isSelected ? "text-black" : "text-gray-600"
                          }`}>
                          {color.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Botón AR Experience - Solo mobile, justo después de "Ver más" */}
                {(() => {
                  const urlRender3D = product.apiProduct && productSelection.selectedVariant?.urlRender3D
                    ? productSelection.selectedVariant.urlRender3D
                    : null;

                  return urlRender3D && urlRender3D.trim() !== "" ? (
                    <div className="flex justify-center mb-6">
                      <ARExperienceHandler
                        glbUrl={urlRender3D}
                        usdzUrl={urlRender3D}
                      />
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
          );
        })()}

        {/* Entregas */}
        <div className="mb-4 pb-32 md:pb-4 lg:border-b border-gray-200">
          <p className="text-xs text-gray-600">Entregas: en 1-3 días laborables</p>
        </div>
      </div>
    </div>
  );
});

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;
