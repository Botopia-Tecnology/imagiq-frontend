"use client";

import React, { useState } from "react";
import Image from "next/image";
import entregoEstrenoLogo from "@/img/entrego-estreno/entrego-estreno-logo.png";
import phoneIcon from "@/img/entrego-estreno/phone-icon.png";
import tabletIcon from "@/img/entrego-estreno/tablet-icon.png";
import contenidoCajaProducto from "@/img/entrego-estreno/contenido-caja-producto.png";
import { useRouter } from "next/navigation";

/**
 * Tipo de producto para el carrito
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  // Agrega más campos según tu modelo
}

/**
 * Simulación de función para agregar al carrito (reemplaza por tu contexto real)
 */
const addToCart = async (product: Product) => {
  // Simula delay y éxito
  return new Promise((resolve) => setTimeout(resolve, 800));
};

/**
 * Componente EntregoEstreno
 * - Botones de navegación en desktop/tablet y mobile
 * - Regresar: navega al detalle del producto
 * - Continuar con la compra: agrega el producto al carrito y navega al carrito
 * - Feedback visual de carga y deshabilitado
 */
const EntregoEstreno: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deviceCondition, setDeviceCondition] = useState<string>("");
  const [deviceCategory, setDeviceCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("Apple");
  const [selectedModel, setSelectedModel] = useState<string>("iPhone 11");
  const [selectedCapacity, setSelectedCapacity] = useState<string>("512 GB");
  const [selectedDiscount, setSelectedDiscount] =
    useState<string>("Galaxy Z Fold 5");

  /**
   * Botón regresar: navega al componente de detalles del producto
   * - Redirige a /productos/dispositivos-moviles/details (sin productId)
   */
  const handleGoBack = () => {
    router.push("/productos/dispositivos-moviles/details");
  };

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center">
      {/* Logo superior */}
      <div className="w-full flex justify-center -mb-18">
        <Image
          src={entregoEstrenoLogo}
          alt="Logo Entrego y estreno"
          width={260}
          height={90}
          className="object-contain"
          priority
        />
      </div>
      {/* Título y subtítulo */}
      <div className="w-full max-w-[1000px] flex flex-col items-center mb-4">
        <p
          className="text-[#222] text-[16px] font-normal mb-2 text-center"
          style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
        >
          Selecciona Estreno y Entrego y recibe un bono por tu dispositivo
          antiguo
        </p>
        {/* Bloque original solo visible en desktop/tablet */}
        <div className="w-full gap-6 justify-center mb-4 hidden sm:flex">
          <button
            type="button"
            className="flex-1 flex items-center justify-between border border-[#BDBDBD] rounded-xl bg-white px-6 py-4 min-w-[320px] max-w-[420px] h-[64px] shadow-sm"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            disabled
          >
            <span className="text-[#222] text-[16px] font-normal text-left">
              Entrega tu dispositivo antiguo
            </span>
            <span className="text-[#888] text-[13px] font-normal text-right">
              Ahorra hasta
              <br />
              $900.000
            </span>
          </button>
          <button
            type="button"
            className="flex-1 flex items-center border border-[#BDBDBD] rounded-xl bg-white px-6 py-4 min-w-[320px] max-w-[420px] h-[64px] shadow-sm"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            disabled
          >
            <span className="text-[#222] text-[16px] font-normal text-left">
              No, gracias
            </span>
          </button>
        </div>
        {/* Bloque responsive solo visible en mobile */}
        <div className="w-full flex flex-row gap-2 justify-center mb-2 sm:hidden">
          <button
            type="button"
            className="w-1/2 flex items-center justify-center border border-[#BDBDBD] rounded-xl bg-white px-2 py-4 min-w-[120px] max-w-[420px] h-[64px] shadow-sm"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            disabled
          >
            <span className="text-[#222] text-[16px] font-normal text-center">
              Entrega tu dispositivo antiguo
            </span>
          </button>
          <button
            type="button"
            className="w-1/2 flex items-center justify-center border border-[#BDBDBD] rounded-xl bg-white px-2 py-4 min-w-[120px] max-w-[420px] h-[64px] shadow-sm"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            disabled
          >
            <span className="text-[#222] text-[16px] font-normal text-center">
              No, gracias
            </span>
          </button>
        </div>
        <span className="block sm:hidden text-[#222] text-[14px] font-normal text-center mb-2">
          ¡Ahorra hasta $900.000 utilizando este beneficio !
        </span>
      </div>
      {/* Card principal */}
      <section className="w-full max-w-[1000px] bg-[#E5E5E5] rounded-[20px] px-[32px] pt-[32px] pb-[32px] mb-8 flex flex-col items-center border border-[#CFCFCF]">
        {/* Pregunta condiciones */}
        <div className="w-full flex flex-col items-center mb-7">
          <p className="text-[#222] text-[16px] font-medium text-center mb-5">
            ¿Tu dispositivo está en buenas condiciones?
          </p>
          <div className="grid grid-cols-2 w-full gap-6 mb-7">
            <button
              className={`w-full h-[56px] rounded-[14px] border border-[#BDBDBD] bg-white text-[#222] text-[16px] font-medium flex items-center justify-center px-6 ${
                deviceCondition === "si" ? "ring-2 ring-[#007AFF]" : ""
              }`}
              onClick={() => setDeviceCondition("si")}
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              Sí
            </button>
            <button
              className={`w-full h-[56px] rounded-[14px] border border-[#BDBDBD] bg-white text-[#222] text-[16px] font-medium flex items-center justify-center px-6 ${
                deviceCondition === "no" ? "ring-2 ring-[#007AFF]" : ""
              }`}
              onClick={() => setDeviceCondition("no")}
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              No
            </button>
          </div>
        </div>
        {/* Categoría dispositivo */}
        <div className="w-full flex flex-col items-center mb-7">
          <p className="text-[#222] text-[16px] font-medium text-center mb-5">
            Selecciona la categoría de tu dispositivo
          </p>
          <div className="grid grid-cols-2 w-full gap-6 mb-7">
            {/* Smartphone button */}
            <button
              className={`w-full h-[85px] rounded-[14px] border border-[#BDBDBD] bg-white flex sm:flex-row sm:items-center sm:justify-between flex-col items-center justify-center px-8 ${
                deviceCategory === "smartphone" ? "ring-2 ring-[#007AFF]" : ""
              }`}
              onClick={() => setDeviceCategory("smartphone")}
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              <span className="font-semibold text-[16px] text-[#222] mb-1 sm:mb-0">
                Smartphone
              </span>
              <Image
                src={phoneIcon}
                alt="Smartphone"
                width={40}
                height={40}
                className="sm:w-[65px] sm:h-[65px] sm:ml-2"
              />
            </button>
            {/* Tablet button */}
            <button
              className={`w-full h-[85px] rounded-[14px] border border-[#BDBDBD] bg-white flex sm:flex-row sm:items-center sm:justify-between flex-col items-center justify-center px-8 ${
                deviceCategory === "tablet" ? "ring-2 ring-[#007AFF]" : ""
              }`}
              onClick={() => setDeviceCategory("tablet")}
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              <span className="font-semibold text-[16px] text-[#222] mb-1 sm:mb-0">
                Tablet
              </span>
              <Image
                src={tabletIcon}
                alt="Tablet"
                width={40}
                height={40}
                className="sm:w-[65px] sm:h-[65px] sm:ml-2"
              />
            </button>
          </div>
        </div>
        {/* Dropdowns */}
        {/* Desktop/tablet: 3 columnas */}
        <div className="w-full grid grid-cols-3 gap-6 mb-7 hidden sm:grid">
          {/* Marca */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[14px] text-[#222] mb-1 block font-medium"
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              Marca
            </label>
            <div className="relative">
              <select
                className="w-full h-[56px] px-4 pr-10 rounded-[14px] border border-[#BDBDBD] bg-white text-[15px] appearance-none focus:border-[#2176E6] focus:ring-2 focus:ring-[#2176E6] focus:outline-none transition-all duration-150 cursor-pointer"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
              >
                <option value="" disabled>
                  Selecciona una marca
                </option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Huawei">Huawei</option>
                <option value="Xiaomi">Xiaomi</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]">
                ▼
              </span>
            </div>
          </div>
          {/* Modelo */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[14px] text-[#222] mb-1 block font-medium"
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              Modelo
            </label>
            <div className="relative">
              <select
                className="w-full h-[56px] px-4 pr-10 rounded-[14px] border border-[#BDBDBD] bg-white text-[15px] appearance-none focus:border-[#2176E6] focus:ring-2 focus:ring-[#2176E6] focus:outline-none transition-all duration-150 cursor-pointer"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
              >
                <option value="" disabled>
                  Selecciona un modelo
                </option>
                <optgroup label="Apple">
                  <option value="iPhone 11">iPhone 11</option>
                  <option value="iPhone 12">iPhone 12</option>
                </optgroup>
                <optgroup label="Samsung">
                  <option value="Galaxy S23">Galaxy S23</option>
                  <option value="Galaxy Z Fold 5">Galaxy Z Fold 5</option>
                </optgroup>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]">
                ▼
              </span>
            </div>
          </div>
          {/* Capacidad */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[14px] text-[#222] mb-1 block font-medium"
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              Capacidad
            </label>
            <div className="relative">
              <select
                className="w-full h-[56px] px-4 pr-10 rounded-[14px] border border-[#BDBDBD] bg-white text-[15px] appearance-none focus:border-[#2176E6] focus:ring-2 focus:ring-[#2176E6] focus:outline-none transition-all duration-150 cursor-pointer"
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
              >
                <option value="" disabled>
                  Selecciona capacidad
                </option>
                <option value="64 GB">64 GB</option>
                <option value="128 GB">128 GB</option>
                <option value="256 GB">256 GB</option>
                <option value="512 GB">512 GB</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]">
                ▼
              </span>
            </div>
          </div>
        </div>
        {/* Mobile: vertical, ancho completo y alineado */}
        <div className="w-full flex flex-col gap-4 mb-7 sm:hidden">
          {/* Marca */}
          <div className="flex flex-col gap-2 w-full">
            <label
              className="text-[14px] text-[#222] mb-1 block font-medium"
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              Marca
            </label>
            <div className="relative w-full">
              <select
                className="w-full h-[56px] px-4 pr-10 rounded-[14px] border border-[#BDBDBD] bg-white text-[15px] appearance-none focus:border-[#2176E6] focus:ring-2 focus:ring-[#2176E6] focus:outline-none transition-all duration-150 cursor-pointer"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
              >
                <option value="" disabled>
                  Selecciona una marca
                </option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Huawei">Huawei</option>
                <option value="Xiaomi">Xiaomi</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]">
                ▼
              </span>
            </div>
          </div>
          {/* Modelo */}
          <div className="flex flex-col gap-2 w-full">
            <label
              className="text-[14px] text-[#222] mb-1 block font-medium"
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              Modelo
            </label>
            <div className="relative w-full">
              <select
                className="w-full h-[56px] px-4 pr-10 rounded-[14px] border border-[#BDBDBD] bg-white text-[15px] appearance-none focus:border-[#2176E6] focus:ring-2 focus:ring-[#2176E6] focus:outline-none transition-all duration-150 cursor-pointer"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
              >
                <option value="" disabled>
                  Selecciona un modelo
                </option>
                <optgroup label="Apple">
                  <option value="iPhone 11">iPhone 11</option>
                  <option value="iPhone 12">iPhone 12</option>
                </optgroup>
                <optgroup label="Samsung">
                  <option value="Galaxy S23">Galaxy S23</option>
                  <option value="Galaxy Z Fold 5">Galaxy Z Fold 5</option>
                </optgroup>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]">
                ▼
              </span>
            </div>
          </div>
          {/* Capacidad */}
          <div className="flex flex-col gap-2 w-full">
            <label
              className="text-[14px] text-[#222] mb-1 block font-medium"
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              Capacidad
            </label>
            <div className="relative w-full">
              <select
                className="w-full h-[56px] px-4 pr-10 rounded-[14px] border border-[#BDBDBD] bg-white text-[15px] appearance-none focus:border-[#2176E6] focus:ring-2 focus:ring-[#2176E6] focus:outline-none transition-all duration-150 cursor-pointer"
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
              >
                <option value="" disabled>
                  Selecciona capacidad
                </option>
                <option value="64 GB">64 GB</option>
                <option value="128 GB">128 GB</option>
                <option value="256 GB">256 GB</option>
                <option value="512 GB">512 GB</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]">
                ▼
              </span>
            </div>
          </div>
        </div>
        {/* ¿Qué dispositivo vas a comprar? */}
        <div className="w-full mb-7">
          <label
            className="text-[14px] text-[#222] mb-2 block font-medium"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
          >
            ¿Qué dispositivo vas a comprar?
          </label>
          <div className="relative">
            <select
              className="w-full h-[56px] px-4 pr-10 rounded-[14px] border border-[#BDBDBD] bg-white text-[15px] appearance-none focus:border-[#2176E6] focus:ring-2 focus:ring-[#2176E6] focus:outline-none transition-all duration-150 cursor-pointer"
              value={selectedDiscount}
              onChange={(e) => setSelectedDiscount(e.target.value)}
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              <option value="" disabled>
                Selecciona el dispositivo
              </option>
              <option value="Galaxy Z Fold 5">Galaxy Z Fold 5</option>
              <option value="Galaxy S23 Ultra">Galaxy S23 Ultra</option>
              <option value="Galaxy Tab S9">Galaxy Tab S9</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]">
              ▼
            </span>
          </div>
        </div>
        {/* Descuento máximo */}
        {/* Desktop/tablet: horizontal */}
        <div className="w-full bg-[#D9D9D9] rounded-[14px] p-6 flex-col md:flex-row justify-between items-center mb-7 hidden sm:flex">
          <div
            className="text-[15px] text-[#222] font-semibold mb-2 md:mb-0"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
          >
            APPLE
            <br />
            Dispositivo a entregar:{" "}
            <span className="font-bold">iPhone 11 pro 256GB</span>
          </div>
          <div
            className="text-[15px] text-[#222] font-semibold"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
          >
            El máximo valor del bono retoma
            <br />
            <span className="font-bold text-[18px]">$3,054,000</span>
          </div>
        </div>
        {/* Mobile: vertical, bloques alineados */}
        <div className="w-full flex flex-col gap-2 mb-7 sm:hidden">
          <div
            className="w-full text-center text-[#222] text-lg font-bold mb-1"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
          >
            El descuento máximo posible que podrías recibir por tu dispositivo
            es:
          </div>
          <div className="w-full bg-[#D9D9D9] rounded-[14px] shadow-md px-4 py-5 flex flex-row justify-between items-end mt-1">
            <div
              className="text-[15px] text-[#222] font-semibold text-left self-center"
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              APPLE
              <br />
              Dispositivo a entregar:{" "}
              <span className="font-bold">iPhone 11 pro 256GB</span>
            </div>
            <div
              className="text-[15px] text-[#222] font-semibold text-right flex flex-col items-end justify-end leading-tight"
              style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            >
              <span>El máximo valor del bono retoma</span>
              <span className="font-bold text-[18px] mt-1">$3,054,000</span>
            </div>
          </div>
        </div>
        {/* Botones navegación */}
        {/* Desktop/tablet: grid 2 columnas */}
        <div className="w-full grid grid-cols-2 gap-6 mt-2 hidden sm:grid">
          {/* Botón regresar: navega al detalle del producto */}
          <button
            className="h-[56px] rounded-[14px] border border-[#BDBDBD] bg-white text-[#222] text-[16px] font-normal flex items-center justify-center shadow-sm px-6 transition-all duration-200 active:scale-[0.97] focus:ring-2 focus:ring-[#2176E6]"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            onClick={handleGoBack}
            disabled={loading}
            aria-label="Regresar al detalle del producto"
          >
            Regresar
          </button>
          {/* Botón continuar: agrega al carrito y navega */}
          <button
            className={`h-[56px] rounded-[14px] text-[#222] text-[16px] font-semibold flex items-center justify-center shadow-sm whitespace-nowrap px-6 transition-all duration-200 active:scale-[0.97] focus:ring-2 focus:ring-[#2176E6] ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            style={{
              fontFamily: "SamsungSharpSans, sans-serif",
              backgroundColor: "#b2e2f2", // Color solicitado
              color: "#222",
            }}
            onClick={async () => {
              setLoading(true);
              await addToCart(product);
              router.push("/carrito");
            }}
            disabled={loading}
            aria-label="Continuar con la compra"
          >
            {loading ? (
              <span className="animate-spin mr-2 w-5 h-5 border-2 border-[#222] border-t-transparent rounded-full"></span>
            ) : null}
            Continuar con la compra
          </button>
        </div>
        {/* Mobile: fondo gris, botones alineados y centrados */}
        <div className="w-full max-w-[540px] mx-auto bg-[#E5E5E5] flex flex-row justify-center items-center gap-4 px-4 sm:hidden">
          {/* Botón regresar: navega al detalle del producto */}
          <button
            className="h-[56px] w-full rounded-[14px] border border-[#BDBDBD] bg-white text-[#222] text-[16px] font-normal flex items-center justify-center shadow-sm px-6 transition-all duration-200 active:scale-[0.97] focus:ring-2 focus:ring-[#2176E6]"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
            onClick={handleGoBack}
            disabled={loading}
            aria-label="Regresar al detalle del producto"
          >
            Regresar
          </button>
          {/* Botón continuar: agrega al carrito y navega */}
          <button
            className={`h-[56px] w-full rounded-[14px] text-[#222] text-[16px] font-semibold flex items-center justify-center shadow-sm whitespace-nowrap px-6 transition-all duration-200 active:scale-[0.97] focus:ring-2 focus:ring-[#2176E6] ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            style={{
              fontFamily: "SamsungSharpSans, sans-serif",
              backgroundColor: "#b2e2f2", // Color solicitado
              color: "#222",
            }}
            onClick={async () => {
              setLoading(true);
              await addToCart(product);
              router.push("/carrito");
            }}
            disabled={loading}
            aria-label="Continuar con la compra"
          >
            {loading ? (
              <span className="animate-spin mr-2 w-5 h-5 border-2 border-[#222] border-t-transparent rounded-full"></span>
            ) : null}
            Continuar con la compra
          </button>
        </div>
      </section>
      {/* ¿Qué hay en la caja? */}
      <section className="w-full max-w-[1000px] bg-[#F6F6F6] rounded-2xl px-[40px] pt-[32px] pb-[32px] flex flex-col items-center border border-[#E5E5E5] mb-10">
        <h2
          className="text-[#222] text-[20px] font-bold mb-6 w-full text-left"
          style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
        >
          ¿Qué hay en la caja?
        </h2>
        {/* Desktop/tablet layout (horizontal) */}
        <div className="w-full flex flex-row justify-between items-end mb-4 hidden sm:flex">
          <div className="flex flex-row items-end" style={{ minWidth: 480 }}>
            <Image
              src={contenidoCajaProducto}
              alt="Contenido de la caja"
              width={440}
              height={160}
              className="object-contain"
              priority
            />
          </div>
          <div
            className="flex flex-col items-start justify-end text-[14px] text-[#222]"
            style={{
              fontFamily: "SamsungSharpSans, sans-serif",
              minWidth: 220,
            }}
          >
            <ul className="list-none mb-2">
              <li>1. Smartphone</li>
              <li>2. Cable de Datos C-C</li>
              <li>3. Pin de extracción</li>
            </ul>
            <span className="text-[12px] text-[#666]">
              * Galaxy S25, Galaxy S25+ no incluye adaptador de carga.
            </span>
          </div>
        </div>
        {/* Mobile layout (vertical) */}
        <div className="w-full flex flex-col items-center mb-4 sm:hidden">
          <div className="w-full flex justify-center mb-3">
            <Image
              src={contenidoCajaProducto}
              alt="Contenido de la caja"
              width={260}
              height={95}
              className="object-contain"
              priority
            />
          </div>
          <div
            className="w-full flex flex-col items-start justify-center text-[14px] text-[#222]"
            style={{ fontFamily: "SamsungSharpSans, sans-serif" }}
          >
            <ul className="list-none mb-2 text-left w-full">
              <li>1. Smartphone</li>
              <li>2. Cable de Datos C-C</li>
              <li>3. Pin de extracción</li>
            </ul>
            <span className="text-[12px] text-[#666] text-left w-full">
              * Galaxy S25, Galaxy S25+ no incluye adaptador de carga.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EntregoEstreno;
