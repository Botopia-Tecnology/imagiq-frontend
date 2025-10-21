"use client";

import React from "react";
import { ProductCardProps } from "@/app/productos/components/ProductCard";

export const useProductLogic = (product: ProductCardProps | null) => {
  // Estados para selección de variantes
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = React.useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [showStickyCarousel, setShowStickyCarousel] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalImageIndex, setModalImageIndex] = React.useState(0);
  const [slideDirection, setSlideDirection] = React.useState<'left' | 'right'>('right');
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const specsRef = React.useRef<HTMLDivElement>(null);

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

  // Funciones para el modal
  const openModal = () => {
    setIsModalOpen(true);
    setModalImageIndex(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNextImage = () => {
    if (productImages.length > 0) {
      setSlideDirection('right');
      setModalImageIndex((prev) => (prev + 1) % productImages.length);
    }
  };

  const goToPrevImage = () => {
    if (productImages.length > 0) {
      setSlideDirection('left');
      setModalImageIndex((prev) => prev === 0 ? productImages.length - 1 : prev - 1);
    }
  };

  const goToImage = (index: number) => {
    if (index > modalImageIndex) {
      setSlideDirection('right');
    } else {
      setSlideDirection('left');
    }
    setModalImageIndex(index);
  };

  return {
    selectedColor,
    selectedStorage,
    currentImageIndex,
    showStickyCarousel,
    isModalOpen,
    modalImageIndex,
    slideDirection,
    carouselRef,
    specsRef,
    premiumImages,
    productImages,
    setSelectedColor,
    setSelectedStorage,
    setCurrentImageIndex,
    openModal,
    closeModal,
    goToNextImage,
    goToPrevImage,
    goToImage,
  };
};
