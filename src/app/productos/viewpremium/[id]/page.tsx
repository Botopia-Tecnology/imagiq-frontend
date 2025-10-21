"use client";

import React, { use, useEffect } from "react";
import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import smartphonesImg from "@/img/dispositivosmoviles/cel1.png";
import {
  ProductCardProps,
  ProductColor,
} from "@/app/productos/components/ProductCard";
import ViewProductAppliance from "../../electrodomesticos/ViewProductAppliance";
import DetailsProductSection from "@/app/productos/dispositivos-moviles/detalles-producto/DetailsProductSection";
import ProductDetailSkeleton from "@/app/productos/dispositivos-moviles/detalles-producto/ProductDetailSkeleton";
import { useProductContext } from "@/features/products/ProductContext";

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
    description: safeValue(product.description, "None"),
    specs: [
      { label: "Marca", value: safeValue(product.brand, "None") },
      { label: "Modelo", value: safeValue(product.model, "None") },
      { label: "Categoría", value: safeValue(product.category, "None") },
      { label: "Subcategoría", value: safeValue(product.subcategory, "None") },
      { label: "Capacidad", value: safeValue(product.capacity, "None") },
      { label: "Stock", value: safeValue(product.stock, "None") },
      { label: "SKU", value: safeValue(product.sku, "None") },
    ],
  };
}

// Mantiene la integración con el contexto de tipo de producto
function SetApplianceFlag({ isRefrigerador }: { isRefrigerador: boolean }) {
  const { setIsAppliance } = useProductContext();
  useEffect(() => {
    setIsAppliance(isRefrigerador);
  }, [isRefrigerador, setIsAppliance]);
  return null;
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
  const { product, loading, error } = useProduct(id ?? "");
  const [showContent, setShowContent] = React.useState(false);

  // Estados para selección de variantes
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = React.useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [showStickyCarousel, setShowStickyCarousel] = React.useState(true);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const specsRef = React.useRef<HTMLDivElement>(null);

  // Delay para asegurar transición suave
  React.useEffect(() => {
    if (!loading && product) {
      const timer = setTimeout(() => setShowContent(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [loading, product]);

  // Inicializar selecciones cuando el producto se carga
  React.useEffect(() => {
    if (product) {
      // Seleccionar el primer color disponible
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
      // Seleccionar la primera capacidad disponible
      if (product.capacities && product.capacities.length > 0) {
        setSelectedStorage(product.capacities[0].value);
      }
    }
  }, [product]);

  // Obtener imágenes premium y videos premium (carrusel inicial)
  const getPremiumImages = () => {
    if (!product || !selectedColor) return [];
    
    const selectedColorData = product.colors?.find(c => c.name === selectedColor);
    const premiumImages: string[] = [];
    
    // 1. Videos premium del color seleccionado
    if (selectedColorData?.video_premium && selectedColorData.video_premium.length > 0) {
      premiumImages.push(...selectedColorData.video_premium.filter(url => url && url.trim() !== ""));
    }
    
    // 2. Imágenes premium del color seleccionado
    if (selectedColorData?.imagen_premium && selectedColorData.imagen_premium.length > 0) {
      premiumImages.push(...selectedColorData.imagen_premium.filter(url => url && url.trim() !== ""));
    }
    
    // 3. Si no hay contenido premium, agregar 3 imágenes de mockup por defecto
    if (premiumImages.length === 0) {
      premiumImages.push(
        "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759849937/galaxy-zflip7_spfhq7.webp",
        "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759849936/25s-ultra_xfxhqt.webp",
        "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759849937/galaxy-zflip7_spfhq7.webp"
      );
    }
    
    return premiumImages;
  };

  // Obtener imágenes del producto del color seleccionado (carrusel secundario)
  const getProductImages = () => {
    if (!product || !selectedColor) return [];
    
    const selectedColorData = product.colors?.find(c => c.name === selectedColor);
    const productImages: string[] = [];
    
    // SOLO imágenes específicas del color seleccionado
    if (selectedColorData?.imagePreviewUrl) {
      productImages.push(selectedColorData.imagePreviewUrl);
    }
    
    // Si el color tiene imágenes adicionales específicas, agregarlas
    // Buscar en imageDetailsUrls si hay imágenes específicas para este color
    if (product.imageDetailsUrls && product.imageDetailsUrls.length > 0) {
      // Filtrar solo imágenes que contengan el nombre del color en la URL
      const colorSpecificImages = product.imageDetailsUrls.filter(url => {
        if (!url || typeof url !== 'string') return false;
        const colorName = selectedColor.toLowerCase();
        return url.toLowerCase().includes(colorName) || 
               url.toLowerCase().includes(selectedColorData?.label?.toLowerCase() || '');
      });
      
      if (colorSpecificImages.length > 0) {
        productImages.push(...colorSpecificImages);
      }
    }
    
    return productImages;
  };

  const premiumImages = getPremiumImages();
  const productImages = getProductImages();

  // Debug: Mostrar qué imágenes se están usando
  React.useEffect(() => {
    console.log('🎨 Color seleccionado:', selectedColor);
    console.log('📸 Imágenes premium:', premiumImages);
    console.log('🖼️ Imágenes del producto:', productImages);
  }, [selectedColor, premiumImages, productImages]);

  // Detectar scroll para ocultar/mostrar el carrusel sticky
  React.useEffect(() => {
    const handleScroll = () => {
      if (!specsRef.current) return;
      
      const specsTop = specsRef.current.offsetTop;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Ocultar el carrusel sticky cuando el usuario ha scrolleado más allá de la mitad de la ventana
      // y las especificaciones ya no están visibles en la parte superior
      const shouldHideCarousel = scrollY > specsTop + 200;
      
      setShowStickyCarousel(!shouldHideCarousel);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play del carrusel premium (cambia cada 4 segundos)
  React.useEffect(() => {
    if (premiumImages.length > 1) {
      const autoPlayInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % premiumImages.length);
      }, 4000);

      return () => clearInterval(autoPlayInterval);
    }
  }, [premiumImages.length]);

  // Resetear índice de imagen cuando cambie el color seleccionado
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  if (!id) {
    return notFound();
  }
  if (loading || !showContent) {
    return <ProductDetailSkeleton />;
  }
  if (error) {
    return notFound();
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
  const convertedProduct = convertProductForView(product);

  const categoriasAppliance = [
    "neveras",
    "nevecon",
    "hornos microondas",
    "lavavajillas",
    "lavadora",
    "secadora",
    "aspiradoras",
    "aire acondicionado",
    "hornos",
    "microondas",
  ];
  const subcategoria = convertedProduct.specs
    .find((spec) => spec.label === "Subcategoría")
    ?.value?.toLowerCase();
  const isRefrigerador = subcategoria
    ? categoriasAppliance.some((cat) => subcategoria.includes(cat))
    : false;
  return (
    <>
      <SetApplianceFlag isRefrigerador={!!isRefrigerador} />
      {/* Vista de producto según categoría */}
      {isRefrigerador ? (
        /* Para electrodomésticos solo renderizar ViewProductAppliance */
        <ViewProductAppliance product={convertedProduct} />
      ) : (
        /* Para dispositivos móviles renderizar con carrusel en medio */
        <>
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 md:px-6 lg:px-12 py-4">
              <div className="max-w-7xl mx-auto">
                <p className="text-sm text-gray-600">
                  Galaxy Z / Detalles del producto
                </p>
              </div>
            </div>
          </div>

          {/* Layout de dos columnas: Carrusel a la izquierda, Info a la derecha */}
          <div className="bg-white py-8">
            <div className="container mx-auto px-4 md:px-6 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Columna izquierda: Contenedor sticky para carrusel e imagen estática */}
                  <div 
                    ref={carouselRef}
                    className="w-full lg:col-span-9 lg:sticky lg:top-20 relative"
                  >
                    {/* Carrusel de imágenes reales */}
                    <div className={`relative w-full transition-opacity duration-500 ease-in-out ${showStickyCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      {(() => {
                        // Determinar qué imágenes usar según el estado del scroll
                        const currentImages = showStickyCarousel ? premiumImages : productImages;
                        const currentImageSet = showStickyCarousel ? 'premium' : 'product';
                        
                        return currentImages.length > 0 ? (
                          <>
                            <div className="relative w-full h-[600px] bg-white rounded-2xl overflow-hidden shadow-2xl">
                              <img
                                src={currentImages[currentImageIndex]}
                                alt={`${product.name} - ${currentImageSet === 'premium' ? 'Premium' : 'Producto'} ${currentImageIndex + 1}`}
                                className="w-full h-full object-contain"
                              />
                              
                              {/* Flechas de navegación */}
                              {currentImages.length > 1 && (
                                <>
                                  <button
                                    onClick={() => setCurrentImageIndex((prev) => prev === 0 ? currentImages.length - 1 : prev - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
                                  >
                                    <span className="text-2xl">‹</span>
                                  </button>
                                  <button
                                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
                                  >
                                    <span className="text-2xl">›</span>
                                  </button>
                                </>
                              )}
                            </div>
                            
                            {/* Puntos de navegación */}
                            {currentImages.length > 1 && (
                              <div className="flex justify-center gap-2 mt-6">
                                {currentImages.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`h-2 rounded-full transition-all ${
                                      index === currentImageIndex
                                        ? "w-8 bg-gray-900"
                                        : "w-2 bg-gray-400 hover:bg-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-[600px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                            <div className="text-center">
                              <div className="text-6xl mb-4">📱</div>
                              <div>Imagen no disponible</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Imagen estática que aparece cuando el carrusel se oculta */}
                    <div className={`absolute inset-0 w-full transition-opacity duration-500 ease-in-out ${!showStickyCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      {productImages.length > 0 ? (
                        <>
                          <div className="relative w-full h-[600px] bg-white rounded-2xl overflow-hidden shadow-2xl">
                            <img
                              src={productImages[currentImageIndex % productImages.length]}
                              alt={`${product.name} - ${selectedColor} ${(currentImageIndex % productImages.length) + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex justify-center mt-6">
                            <button
                              onClick={() => {
                                setShowStickyCarousel(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-8 py-3 bg-white border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
                            >
                              Ver más fotos
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-500 text-lg font-semibold shadow-2xl">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎨</div>
                            <div>No hay fotos específicas para el color {selectedColor}</div>
                            <div className="text-sm mt-2">Selecciona otro color para ver más fotos</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna derecha: Información del producto - 25% del ancho */}
                  <div ref={specsRef} className="w-full lg:col-span-3">
                    <div className="sticky top-20">
                      {/* Dispositivo */}
                      <div className="mb-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <h3 className="text-lg font-bold text-gray-900">Dispositivo</h3>
                          <span className="text-gray-400 cursor-help text-sm">?</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1.5">Selecciona tu dispositivo</p>
                        <div className="border-2 border-blue-600 rounded-lg p-2">
                          <div className="font-semibold text-gray-900 mb-0.5 text-xs">{product.name}</div>
                          <div className="text-xs font-semibold text-gray-900">
                            {(() => {
                              const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
                              const priceStr = selectedCapacity?.price || product.price || "0";
                              const priceNumber = parseInt(priceStr.replace(/[^\d]/g, ''));
                              const monthlyPrice = Math.round(priceNumber / 24);
                              return `Desde $ ${monthlyPrice.toLocaleString('es-CO')} al mes o`;
                            })()}
                          </div>
                          <div className="text-base font-bold text-gray-900 mb-0.5">
                            {(() => {
                              const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
                              return selectedCapacity?.price || product.price || "Precio no disponible";
                            })()}
                          </div>
                          <p className="text-xs text-blue-600 leading-tight">
                            24 cuotas sin interés con bancos aliados. Continúa al carrito para ver el precio final con DTO
                          </p>
                        </div>
                      </div>

                      {/* Almacenamiento */}
                      {product.capacities && product.capacities.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <h3 className="text-base font-bold text-gray-900">Almacenamiento</h3>
                            <span className="text-gray-400 cursor-help text-sm">?</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1.5">Compra tu smartphone de mayor capacidad a menor precio</p>
                          
                          <div className="space-y-1.5">
                            {product.capacities.map((capacity, index) => {
                              const isSelected = capacity.value === selectedStorage;
                              const priceStr = capacity.price || "0";
                              const priceNumber = parseInt(priceStr.replace(/[^\d]/g, ''));
                              const monthlyPrice = Math.round(priceNumber / 24);
                              
                              return (
                                <div
                                  key={index}
                                  onClick={() => setSelectedStorage(capacity.value)}
                                  className={`border-2 rounded-lg p-2 cursor-pointer transition-colors ${
                                    isSelected
                                      ? "border-blue-600 bg-blue-50"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                >
                                  <div className="font-semibold text-gray-900 mb-0.5 text-xs">
                                    {capacity.label}
                                  </div>
                                  <div className="text-xs font-semibold text-gray-900">
                                    $ {monthlyPrice.toLocaleString('es-CO')} al mes o
                                  </div>
                                  <div className="text-base font-bold text-gray-900 mb-0.5">
                                    {capacity.price || "Precio no disponible"}
                                  </div>
                                  <p className="text-xs text-blue-600 leading-tight">
                                    Acumula puntos al comprar + 24 cuotas sin interés con bancos aliados. Continúa al carrito para ver el precio final con DTO
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Información importante */}
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-900 mb-0.5">
                              Información importante: Memoria ROM
                            </p>
                            <p className="text-xs text-gray-600 leading-tight">
                              Parte del espacio de la memoria esta ocupada por contenidos preinstalados. Para este dispositivo, el espacio disponible para el usuario es aproximadamente el 87% de la capacidad total de la memoria indicada.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Color */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <h3 className="text-base font-bold text-gray-900">Color</h3>
                          </div>
                          <p className="text-xs text-gray-600 mb-1.5">Selecciona el color de tu dispositivo.</p>
                          
                          <div className="flex gap-3">
                            {product.colors.map((color, index) => {
                              const isSelected = color.name === selectedColor;
                              
                              return (
                                <div
                                  key={index}
                                  onClick={() => {
                                    setSelectedColor(color.name);
                                    setCurrentImageIndex(0); // Resetear imagen al cambiar color
                                  }}
                                  className="flex flex-col items-center cursor-pointer transition-all"
                                >
                                  <div 
                                    className={`w-12 h-12 rounded-full border-3 transition-all ${
                                      isSelected
                                        ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2 scale-110"
                                        : "border-gray-300 hover:border-gray-400 hover:scale-105"
                                    }`}
                                    style={{ backgroundColor: color.hex }}
                                  ></div>
                                  <div className={`font-semibold text-center text-xs mt-1 ${
                                    isSelected ? "text-blue-600" : "text-gray-700"
                                  }`}>
                                    {color.label}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Entregas */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-600">Entregas: en 1-3 días laborables</p>
                      </div>

                      {/* Botones de acción */}
                      <div className="space-y-2">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-xs">
                          Comprar ahora
                        </button>
                        <button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2.5 px-3 rounded-lg border-2 border-gray-300 transition-colors text-xs">
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

           {/* Información del producto completa */}
          <DetailsProductSection product={product} />
          
          {/* Flixmedia y especificaciones */}
          <ViewProduct product={convertedProduct} flix={product} />
        </>
      )}
    </>
  );
}
