"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Importación de iconos
import PaperIcon from "@/img/tracking-service/Paper-icon.png";
import PackageIcon from "@/img/tracking-service/package-icon.png";
import PackageCarIcon from "@/img/tracking-service/package_car-icon.png";
import HomeIcon from "@/img/tracking-service/Home_light-icon.png";

/**
 * Estados posibles del pedido en el proceso de tracking
 */
type OrderStatus = "procesada" | "enviado" | "reparto" | "entregado";

/**
 * Interfaz para los pasos del tracking
 */
interface TrackingStep {
  id: OrderStatus;
  title: string;
  icon: typeof PaperIcon;
  completed: boolean;
  active: boolean;
}

/**
 * Componente TrackingService
 *
 * Muestra el estado del pedido con un progreso visual paso a paso.
 * Incluye navegación completa del sitio y información detallada del pedido.
 *
 * Características:
 * - Progreso visual dinámico basado en el estado actual
 * - Responsive design
 * - Animaciones suaves para transiciones
 * - Navegación integrada
 * - Información del pedido centralizada
 */
export default function TrackingService() {
  // Valores por defecto internos
  const orderNumber = "15874945561MJ";
  const estimatedDate = "15-05-2025";
  const currentStatus: OrderStatus = "procesada";
  const [activeStep, setActiveStep] = useState<OrderStatus>(currentStatus);

  /**
   * Configuración de los pasos del tracking
   */
  const trackingSteps: TrackingStep[] = [
    {
      id: "procesada",
      title: "Orden\nprocesada",
      icon: PaperIcon,
      completed: true, // Solo este está completado por defecto
      active: activeStep === "procesada",
    },
    {
      id: "enviado",
      title: "Pedido\nEnviado",
      icon: PackageIcon,
      completed: getStepIndex(activeStep) >= 1,
      active: activeStep === "enviado",
    },
    {
      id: "reparto",
      title: "En reparto",
      icon: PackageCarIcon,
      completed: getStepIndex(activeStep) >= 2,
      active: activeStep === "reparto",
    },
    {
      id: "entregado",
      title: "Pedido\nentregado",
      icon: HomeIcon,
      completed: getStepIndex(activeStep) >= 3,
      active: activeStep === "entregado",
    },
  ];

  /**
   * Obtiene el índice numérico del paso actual
   */
  function getStepIndex(status: OrderStatus): number {
    const statusOrder: OrderStatus[] = [
      "procesada",
      "enviado",
      "reparto",
      "entregado",
    ];
    return statusOrder.indexOf(status);
  }

  /**
   * Simula el progreso automático del pedido para demo
   */
  useEffect(() => {
    const statusProgression: OrderStatus[] = [
      "procesada",
      "enviado",
      "reparto",
      "entregado",
    ];
    const currentIndex = getStepIndex(activeStep);

    if (currentIndex < 3) {
      const timer = setTimeout(() => {
        setActiveStep(statusProgression[currentIndex + 1]);
      }, 5000); // Cambia cada 5 segundos para demo

      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12">
      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4">
        {/* Tracking Card */}
        <div
          className="bg-white rounded-2xl shadow-sm max-w-7xl mx-auto overflow-hidden"
          style={{ minHeight: "500px" }}
        >
          {/* Header del estado */}
          <div className="pt-8 px-8 pb-4">
            <h1 className="text-2xl font-bold text-black mb-4">
              Estado de tu pedido:
            </h1>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-bold">Orden #</span> {orderNumber}
              </p>
              <div className="mt-3">
                <p className="font-bold text-black">Fecha Entrega estimada</p>
                <p className="text-base text-gray-700">{estimatedDate}</p>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="relative px-8 py-12">
            {/* Línea de progreso */}
            <div className="absolute top-[60px] left-24 right-24 h-16 flex items-center">
              <div className="w-full h-3 bg-blue-500 rounded-full" />
            </div>

            {/* Pasos del tracking */}
            <div
              className="relative flex justify-between px-8"
              style={{ height: "160px" }}
            >
              {trackingSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center flex-1"
                  style={{ position: "relative", height: "100%" }}
                >
                  {/* Círculo del paso - centrado y alineado con la línea */}
                  <div
                    className={`rounded-full flex items-center justify-center transition-all duration-500 z-30 shadow-lg ${
                      step.id === "procesada"
                        ? "bg-blue-500 border-0"
                        : "bg-white border-4 border-blue-300"
                    } ${step.active ? "ring-4 ring-blue-200 scale-105" : ""}`}
                    style={{
                      width: "58px",
                      height: "58px",
                      position: "absolute",
                      top: "45px", // alineado con la línea
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {step.id !== "procesada" && (
                      <div
                        className="rounded-full bg-blue-300"
                        style={{ width: "10px", height: "10px" }}
                      />
                    )}
                  </div>

                  {/* Icono y texto alineados debajo del círculo */}
                  <div
                    className="flex flex-col items-center max-w-28"
                    style={{ marginTop: "80px" }}
                  >
                    <div className="mb-5 mt-4">
                      <Image
                        src={step.icon}
                        alt={step.title}
                        width={42}
                        height={42}
                        className="w-12 h-12 object-contain filter grayscale-0 opacity-90"
                      />
                    </div>
                    <p
                      className={`text-sm font-semibold leading-tight text-center whitespace-pre-line ${
                        step.id === "procesada" ? "text-black" : "text-gray-600"
                      } ${step.active ? "text-blue-600 font-bold" : ""}`}
                      style={{ marginBottom: "8px" }}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
