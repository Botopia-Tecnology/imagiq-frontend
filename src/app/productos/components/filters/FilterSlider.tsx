/**
 * Componente de filtro tipo Slider (rango continuo)
 * Soporta valores manuales con rangos
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { DynamicFilterConfig } from "@/types/filters";

interface FilterSliderProps {
  filter: DynamicFilterConfig;
  minValue: number | null;
  maxValue: number | null;
  onRangeChange: (min: number | null, max: number | null) => void;
}

/**
 * Obtiene el rango mínimo y máximo de todos los rangos disponibles
 */
function getRangeBounds(filter: DynamicFilterConfig): {
  min: number;
  max: number;
} {
  const { valueConfig } = filter;
  let min = Infinity;
  let max = -Infinity;

  if (valueConfig.type === "manual" && valueConfig.ranges) {
    valueConfig.ranges.forEach((range) => {
      if (range.min < min) min = range.min;
      if (range.max > max) max = range.max;
    });
  } else if (valueConfig.type === "mixed" && valueConfig.ranges) {
    valueConfig.ranges.forEach((range) => {
      if (range.min < min) min = range.min;
      if (range.max > max) max = range.max;
    });
  }

  // Si no se encontraron rangos, usar valores por defecto
  if (min === Infinity) min = 0;
  if (max === -Infinity) max = 1000000;

  return { min, max };
}

export default function FilterSlider({
  filter,
  minValue,
  maxValue,
  onRangeChange,
}: FilterSliderProps) {
  const { min, max } = getRangeBounds(filter);
  const [localMin, setLocalMin] = useState<number>(minValue ?? min);
  const [localMax, setLocalMax] = useState<number>(maxValue ?? max);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);
  
  // Refs para almacenar los valores finales que se enviarán cuando termine el arrastre
  const pendingMinRef = useRef<number | null>(null);
  const pendingMaxRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalMin(minValue ?? min);
    setLocalMax(maxValue ?? max);
  }, [minValue, maxValue, min, max]);

  // Función para disparar la petición con debounce
  const triggerRangeChange = (immediate = false) => {
    // Limpiar timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const executeChange = () => {
      // Usar valores pendientes si existen, sino usar valores locales actuales
      const finalMin = pendingMinRef.current !== null 
        ? pendingMinRef.current 
        : (localMin !== min ? localMin : null);
      const finalMax = pendingMaxRef.current !== null 
        ? pendingMaxRef.current 
        : (localMax !== max ? localMax : null);
      
      // Solo disparar si hay cambios reales
      const currentMin = minValue ?? null;
      const currentMax = maxValue ?? null;
      
      if (finalMin !== currentMin || finalMax !== currentMax) {
        onRangeChange(finalMin, finalMax);
      }
      
      // Resetear valores pendientes
      pendingMinRef.current = null;
      pendingMaxRef.current = null;
    };

    if (immediate) {
      executeChange();
    } else {
      // Debounce de 300ms para cambios durante el arrastre o inputs
      debounceTimerRef.current = setTimeout(executeChange, 300);
    }
  };

  // Cleanup del timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Calcular porcentajes para el rango seleccionado
  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  // Convertir posición del mouse a valor del slider
  const getValueFromPosition = (clientX: number): number => {
    if (!sliderRef.current) return min;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(min + percent * (max - min));
  };

  // Calcular la distancia entre los thumbs para determinar cuál está más cerca del click
  const getClosestThumb = (clientX: number): "min" | "max" => {
    if (!sliderRef.current) return "min";
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    const minDistance = Math.abs(percent - minPercent);
    const maxDistance = Math.abs(percent - maxPercent);
    return minDistance < maxDistance ? "min" : "max";
  };

  // Estado temporal para valores mientras se editan
  const [editingMin, setEditingMin] = useState<string | null>(null);
  const [editingMax, setEditingMax] = useState<string | null>(null);

  const handleMinBlur = () => {
    setActiveThumb(null);
    setEditingMin(null);
    // Asegurar que el valor esté dentro del rango válido
    if (localMin < min) {
      setLocalMin(min);
      pendingMinRef.current = null;
      triggerRangeChange(true);
    } else if (localMin >= localMax) {
      const adjustedMin = Math.max(localMax - 1, min);
      setLocalMin(adjustedMin);
      pendingMinRef.current = adjustedMin === min ? null : adjustedMin;
      triggerRangeChange(true);
    } else {
      // Disparar cualquier cambio pendiente
      pendingMinRef.current = localMin === min ? null : localMin;
      triggerRangeChange(true);
    }
  };

  const handleMaxBlur = () => {
    setActiveThumb(null);
    setEditingMax(null);
    // Asegurar que el valor esté dentro del rango válido
    if (localMax > max) {
      setLocalMax(max);
      pendingMaxRef.current = null;
      triggerRangeChange(true);
    } else if (localMax <= localMin) {
      const adjustedMax = Math.min(localMin + 1, max);
      setLocalMax(adjustedMax);
      pendingMaxRef.current = adjustedMax === max ? null : adjustedMax;
      triggerRangeChange(true);
    } else {
      // Disparar cualquier cambio pendiente
      pendingMaxRef.current = localMax === max ? null : localMax;
      triggerRangeChange(true);
    }
  };

  // Handlers para el slider personalizado
  const handleMouseDown = (thumb: "min" | "max", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveThumb(thumb);
    setIsDragging(true);

    let isActive = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive || !sliderRef.current) return;
      
      const newValue = getValueFromPosition(e.clientX);
      
      if (thumb === "min") {
        const newMin = Math.min(Math.max(newValue, min), Math.max(localMax - 1, min));
        setLocalMin(newMin);
        setEditingMin(null);
        // Solo actualizar visualmente, guardar valor pendiente
        pendingMinRef.current = newMin === min ? null : newMin;
      } else {
        const newMax = Math.max(Math.min(newValue, max), Math.min(localMin + 1, max));
        setLocalMax(newMax);
        setEditingMax(null);
        // Solo actualizar visualmente, guardar valor pendiente
        pendingMaxRef.current = newMax === max ? null : newMax;
      }
    };

    const handleMouseUp = () => {
      isActive = false;
      setIsDragging(false);
      setActiveThumb(null);
      
      // Disparar la petición inmediatamente cuando termine el arrastre
      triggerRangeChange(true);
      
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (thumb: "min" | "max", e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveThumb(thumb);
    setIsDragging(true);

    const touch = e.touches[0];
    if (!touch) return;

    let isActive = true;

    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive || !sliderRef.current) return;
      
      const touch = e.touches[0];
      if (!touch) return;

      const newValue = getValueFromPosition(touch.clientX);
      
      if (thumb === "min") {
        const newMin = Math.min(Math.max(newValue, min), Math.max(localMax - 1, min));
        setLocalMin(newMin);
        setEditingMin(null);
        // Solo actualizar visualmente, guardar valor pendiente
        pendingMinRef.current = newMin === min ? null : newMin;
      } else {
        const newMax = Math.max(Math.min(newValue, max), Math.min(localMin + 1, max));
        setLocalMax(newMax);
        setEditingMax(null);
        // Solo actualizar visualmente, guardar valor pendiente
        pendingMaxRef.current = newMax === max ? null : newMax;
      }
    };

    const handleTouchEnd = () => {
      isActive = false;
      setIsDragging(false);
      setActiveThumb(null);
      
      // Disparar la petición inmediatamente cuando termine el arrastre
      triggerRangeChange(true);
      
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Manejar clic en el track para mover el thumb más cercano
  const handleTrackClick = (e: React.MouseEvent) => {
    // No hacer nada si se está arrastrando o si el clic fue en un thumb
    if (isDragging || activeThumb) return;
    
    // Verificar si el clic fue directamente en un thumb
    const target = e.target as HTMLElement;
    if (target === minInputRef.current || target === maxInputRef.current || 
        minInputRef.current?.contains(target) || maxInputRef.current?.contains(target)) {
      return;
    }
    
    if (!sliderRef.current) return;
    const newValue = getValueFromPosition(e.clientX);
    
    // Determinar qué thumb está más cerca
    const minDistance = Math.abs(newValue - localMin);
    const maxDistance = Math.abs(newValue - localMax);
    
    if (minDistance < maxDistance) {
      // Mover thumb mínimo
      const newMin = Math.min(Math.max(newValue, min), Math.max(localMax - 1, min));
      setLocalMin(newMin);
      setEditingMin(null);
      pendingMinRef.current = newMin === min ? null : newMin;
      triggerRangeChange(true); // Disparar inmediatamente para clics
    } else {
      // Mover thumb máximo
      const newMax = Math.max(Math.min(newValue, max), Math.min(localMin + 1, max));
      setLocalMax(newMax);
      setEditingMax(null);
      pendingMaxRef.current = newMax === max ? null : newMax;
      triggerRangeChange(true); // Disparar inmediatamente para clics
    }
  };

  // Handlers para los sliders (inputs type="range")
  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    // Asegurar que el mínimo no supere al máximo
    const newMin = Math.min(Math.max(newValue, min), Math.max(localMax - 1, min));
    setLocalMin(newMin);
    setEditingMin(null); // Limpiar estado de edición cuando se usa el slider
    pendingMinRef.current = newMin === min ? null : newMin;
    triggerRangeChange(); // Con debounce para cambios rápidos
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    // Asegurar que el máximo no sea menor al mínimo
    const newMax = Math.max(Math.min(newValue, max), Math.min(localMin + 1, max));
    setLocalMax(newMax);
    setEditingMax(null); // Limpiar estado de edición cuando se usa el slider
    pendingMaxRef.current = newMax === max ? null : newMax;
    triggerRangeChange(); // Con debounce para cambios rápidos
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Inputs numéricos mejorados */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Precio mínimo
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={editingMin !== null ? editingMin : localMin.toLocaleString("es-CO")}
              onChange={(e) => {
                const inputValue = e.target.value;
                setEditingMin(inputValue);
                // Remover separadores de miles y caracteres no numéricos
                const numericValue = inputValue.replace(/[^\d]/g, "");
                if (numericValue === "") {
                  return; // Permitir campo vacío mientras se escribe
                }
                const numValue = Number(numericValue);
                if (!isNaN(numValue) && numValue >= 0) {
                  const newMin = Math.min(Math.max(numValue, min), localMax - 1);
                  setLocalMin(newMin);
                  pendingMinRef.current = newMin === min ? null : newMin;
                  triggerRangeChange(); // Con debounce para cambios mientras se escribe
                }
              }}
              onFocus={(e) => {
                setActiveThumb("min");
                setEditingMin(e.target.value);
                e.target.select();
              }}
              onBlur={handleMinBlur}
              onClick={(e) => e.currentTarget.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={min.toLocaleString("es-CO")}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
              COP
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">
            {formatCurrency(localMin)}
          </span>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Precio máximo
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={editingMax !== null ? editingMax : localMax.toLocaleString("es-CO")}
              onChange={(e) => {
                const inputValue = e.target.value;
                setEditingMax(inputValue);
                // Remover separadores de miles y caracteres no numéricos
                const numericValue = inputValue.replace(/[^\d]/g, "");
                if (numericValue === "") {
                  return; // Permitir campo vacío mientras se escribe
                }
                const numValue = Number(numericValue);
                if (!isNaN(numValue) && numValue >= 0) {
                  const newMax = Math.max(Math.min(numValue, max), localMin + 1);
                  setLocalMax(newMax);
                  pendingMaxRef.current = newMax === max ? null : newMax;
                  triggerRangeChange(); // Con debounce para cambios mientras se escribe
                }
              }}
              onFocus={(e) => {
                setActiveThumb("max");
                setEditingMax(e.target.value);
                e.target.select();
              }}
              onBlur={handleMaxBlur}
              onClick={(e) => e.currentTarget.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={max.toLocaleString("es-CO")}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
              COP
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">
            {formatCurrency(localMax)}
          </span>
        </div>
      </div>

      {/* Slider dual personalizado */}
      <div 
        ref={sliderRef} 
        className="relative py-6 cursor-pointer select-none"
        onClick={handleTrackClick}
      >
        {/* Track de fondo */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full -translate-y-1/2" />
        
        {/* Track activo (rango seleccionado) */}
        <div
          className="absolute top-1/2 h-2 bg-blue-600 rounded-full -translate-y-1/2 pointer-events-none"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Thumb mínimo */}
        <div
          ref={minInputRef}
          className={cn(
            "absolute top-1/2 w-7 h-7 bg-blue-600 border-3 border-white rounded-full shadow-xl cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 transition-all touch-none",
            "hover:bg-blue-700 hover:scale-110",
            activeThumb === "min" && "scale-125 bg-blue-700 ring-2 ring-blue-300 z-10",
            !activeThumb && "z-3"
          )}
          style={{
            left: `${minPercent}%`,
            zIndex: activeThumb === "min" ? 10 : 3,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown("min", e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouchStart("min", e);
          }}
        />

        {/* Thumb máximo */}
        <div
          ref={maxInputRef}
          className={cn(
            "absolute top-1/2 w-7 h-7 bg-blue-600 border-3 border-white rounded-full shadow-xl cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 transition-all touch-none",
            "hover:bg-blue-700 hover:scale-110",
            activeThumb === "max" && "scale-125 bg-blue-700 ring-2 ring-blue-300 z-10",
            !activeThumb && "z-4"
          )}
          style={{
            left: `${maxPercent}%`,
            zIndex: activeThumb === "max" ? 10 : 4,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown("max", e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouchStart("max", e);
          }}
        />
      </div>

      {/* Límites del rango */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatCurrency(min)}</span>
        <span className="font-medium text-gray-700">
          {formatCurrency(localMin)} - {formatCurrency(localMax)}
        </span>
        <span>{formatCurrency(max)}</span>
      </div>
    </div>
  );
}

