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
  // IMPORTANTE: Este carrusel NO depende del color seleccionado
  // Muestra contenido premium general del producto
  // Si no hay contenido premium, devuelve array vacío (NO usa imágenes mockeadas)
  const getPremiumImages = () => {
    if (!product) {
      return [];
    }
    
    const premiumImages: string[] = [];
    
    console.log('📦 Buscando contenido premium general del producto (independiente del color)');
    
    // Recolectar TODOS los videos e imágenes premium de TODOS los colores
    // y eliminar duplicados para tener contenido premium general
    const allVideos = new Set<string>();
    const allImages = new Set<string>();
    
    product.colors?.forEach((color) => {
      // Videos premium
      if (color.video_premium && Array.isArray(color.video_premium)) {
        color.video_premium.forEach(url => {
          if (url && typeof url === 'string' && url.trim() !== '') {
            allVideos.add(url);
          }
        });
      }
      
      // Imágenes premium
      if (color.imagen_premium && Array.isArray(color.imagen_premium)) {
        color.imagen_premium.forEach(url => {
          if (url && typeof url === 'string' && url.trim() !== '') {
            allImages.add(url);
          }
        });
      }
    });
    
    // Agregar primero los videos, luego las imágenes
    if (allVideos.size > 0) {
      console.log('🎥 Videos premium encontrados:', allVideos.size);
      premiumImages.push(...Array.from(allVideos));
    }
    
    if (allImages.size > 0) {
      console.log('🖼️ Imágenes premium encontradas:', allImages.size);
      premiumImages.push(...Array.from(allImages));
    }
    
    // Si no hay contenido premium, devolver array vacío
    if (premiumImages.length === 0) {
      console.log('⚠️ No hay contenido premium disponible en el API');
    } else {
      console.log('✅ Premium images loaded (general del producto):', premiumImages.length);
    }
    
    return premiumImages;
  };

  // Obtener imágenes del producto del color seleccionado (carrusel secundario)
  const getProductImages = () => {
    if (!product || !selectedColor) return [];
    
    const selectedColorData = product.colors?.find(c => c.name === selectedColor);
    const productImages: string[] = [];
    
    console.log('🎨 Buscando imágenes para color:', selectedColor);
    console.log('📦 imageDetailsUrls disponibles:', product.imageDetailsUrls);
    
    // Si el color tiene imágenes adicionales específicas, agregarlas
    // Buscar en imageDetailsUrls si hay imágenes específicas para este color
    if (product.imageDetailsUrls && Array.isArray(product.imageDetailsUrls) && product.imageDetailsUrls.length > 0) {
      // Filtrar solo imágenes que contengan el nombre del color en la URL
      const colorSpecificImages = product.imageDetailsUrls.filter(url => {
        if (!url || typeof url !== 'string') return false;
        const urlLower = url.toLowerCase();
        const colorName = selectedColor.toLowerCase();
        const colorLabel = selectedColorData?.label?.toLowerCase() || '';
        
        // Buscar coincidencias en la URL
        return urlLower.includes(colorName) || 
               urlLower.includes(colorLabel) ||
               // También buscar por palabras clave del color (ej: "negro", "azul", etc)
               colorLabel.split(' ').some(word => word.length > 3 && urlLower.includes(word));
      });
      
      if (colorSpecificImages.length > 0) {
        console.log('✅ Imágenes específicas del color encontradas:', colorSpecificImages.length);
        productImages.push(...colorSpecificImages);
      } else {
        console.log('⚠️ No se encontraron imágenes específicas del color en imageDetailsUrls');
        // Si no hay imágenes específicas, usar todas las imageDetailsUrls disponibles
        const validImages = product.imageDetailsUrls.filter(url => url && typeof url === 'string' && url.trim() !== '');
        if (validImages.length > 0) {
          console.log('📸 Usando todas las imágenes disponibles:', validImages.length);
          productImages.push(...validImages);
        }
      }
    }
    
    // Si no hay imágenes específicas del color, usar la imagen principal del color
    if (productImages.length === 0 && selectedColorData?.imagePreviewUrl) {
      console.log('📸 Usando imagen preview del color');
      productImages.push(selectedColorData.imagePreviewUrl);
    }
    
    // Eliminar duplicados usando Set
    const uniqueImages = [...new Set(productImages)];
    
    console.log('✅ Total de imágenes del producto:', uniqueImages.length);
    return uniqueImages;
  };

  const premiumImages = getPremiumImages();
  const productImages = getProductImages();

  // Detectar scroll para ocultar/mostrar el carrusel sticky
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calcular el porcentaje de scroll (0-100)
      const scrollPercentage = (scrollY / documentHeight) * 100;
      
      // TEMPORAL: Mostrar el porcentaje en consola para debugging
      console.log('📊 Scroll percentage:', scrollPercentage.toFixed(2) + '%');
      
      // Cambiar al segundo carrusel cuando el scroll llegue al 20%
      const shouldHideCarousel = scrollPercentage > 20;
      setShowStickyCarousel(!shouldHideCarousel);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Ejecutar una vez al montar
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Resetear índice de imagen cuando cambie el color seleccionado
  // SOLO si estamos en el carrusel de producto (no en el premium)
  React.useEffect(() => {
    if (!showStickyCarousel) {
      setCurrentImageIndex(0);
    }
  }, [selectedColor, showStickyCarousel]);

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