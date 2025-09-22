"use client";
/**
 * 📱 COMPARATION PRODUCT COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente para comparar dos productos (celulares).
 * - Selectores de producto arriba
 * - Imágenes centradas
 * - Tarjeta comparativa con especificaciones
 * - Código limpio, escalable y documentado
 * - Experiencia de usuario optimizada
 */

import React, { useState } from "react";
import Image from "next/image";
import samsungS25 from "@/img/dispositivosmoviles/cel1.png"; // Cambia por la imagen real
import samsungS24 from "@/img/dispositivosmoviles/cel2.png"; // Cambia por la imagen real
import cameraIcon from "@/img/dispositivosmoviles/camera-icon.png"; // Cambia por la imagen real

const products = [
  {
    name: "Galaxy S25 Ultra 5G",
    image: samsungS25,
    specs: {
      camera: [
        "Cámara ultraancha 50 MP",
        "Cámara de ángulo amplio 200 MP",
        "Teleobjetivo 50/10 MP",
      ],
    },
  },
  {
    name: "Galaxy S24 Ultra 5G",
    image: samsungS24,
    specs: {
      camera: [
        "Cámara ultraancha 12 MP",
        "Cámara de ángulo amplio 200 MP",
        "Teleobjetivo 50/10 MP",
      ],
    },
  },
];

export default function ComparationProduct() {
  // Estado para producto seleccionado
  const [selectedLeft, setSelectedLeft] = useState(products[0]);
  const [selectedRight, setSelectedRight] = useState(products[1]);

  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-12 py-16 px-4"
      style={{
        fontFamily: "SamsungSharpSans",
        minHeight: "100vh",
      }}
    >
      {/* Título móvil */}
      <div className="block md:hidden">
        <h2 className="text-white text-2xl font-bold text-center mb-8">
          Comparálos
        </h2>
      </div>

      {/* Selectores móvil */}
      <div className="flex md:hidden justify-center gap-4 w-full max-w-sm mb-8">
        {/* Selector izquierdo móvil */}
        <div className="relative flex-1">
          <select
            className="bg-transparent text-white px-4 py-2 rounded-full font-bold text-sm border-2 border-white/50 shadow-lg focus:outline-none focus:border-white transition-all duration-300 hover:border-white cursor-pointer appearance-none pr-8 w-full"
            value={selectedLeft.name}
            onChange={(e) => {
              const prod = products.find((p) => p.name === e.target.value);
              if (prod) setSelectedLeft(prod);
            }}
          >
            {products.map((p) => (
              <option
                key={p.name}
                value={p.name}
                className="bg-[#17407A] text-white"
              >
                {p.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              width="10"
              height="6"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Selector derecho móvil */}
        <div className="relative flex-1">
          <select
            className="bg-transparent text-white px-4 py-2 rounded-full font-bold text-sm border-2 border-white/50 shadow-lg focus:outline-none focus:border-white transition-all duration-300 hover:border-white cursor-pointer appearance-none pr-8 w-full"
            value={selectedRight.name}
            onChange={(e) => {
              const prod = products.find((p) => p.name === e.target.value);
              if (prod) setSelectedRight(prod);
            }}
          >
            {products.map((p) => (
              <option
                key={p.name}
                value={p.name}
                className="bg-[#17407A] text-white"
              >
                {p.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              width="10"
              height="6"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Comparación móvil */}
      <div className="flex md:hidden justify-center gap-6 w-full max-w-md px-4">
        {/* Producto izquierdo móvil */}
        <div className="flex flex-col items-center text-center flex-1">
          {/* Imagen del producto */}
          <div className="mb-4">
            <Image
              src={selectedLeft.image}
              alt={selectedLeft.name}
              width={120}
              height={140}
              className="object-contain"
            />
          </div>

          {/* Ícono de cámara */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
            <Image src={cameraIcon} alt="Cámara" width={24} height={24} />
          </div>

          {/* Especificaciones verticales */}
          <div className="space-y-3 text-white">
            <p className="text-sm font-bold leading-tight">
              Cámara
              <br />
              ultraancha
              <br />
              50 MP
            </p>
            <p className="text-sm font-bold leading-tight">
              Cámara de
              <br />
              ángulo amplio
              <br />
              200 MP
            </p>
            <p className="text-sm font-bold leading-tight">
              Teleobjetivo
              <br />
              50/10 MP
            </p>
          </div>
        </div>

        {/* Producto derecho móvil */}
        <div className="flex flex-col items-center text-center flex-1">
          {/* Imagen del producto */}
          <div className="mb-4">
            <Image
              src={selectedRight.image}
              alt={selectedRight.name}
              width={120}
              height={140}
              className="object-contain"
            />
          </div>

          {/* Ícono de cámara */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
            <Image src={cameraIcon} alt="Cámara" width={24} height={24} />
          </div>

          {/* Especificaciones verticales */}
          <div className="space-y-3 text-white">
            <p className="text-sm font-bold leading-tight">
              Cámara
              <br />
              ultraancha
              <br />
              12 MP
            </p>
            <p className="text-sm font-bold leading-tight">
              Cámara de
              <br />
              ángulo amplio
              <br />
              200 MP
            </p>
            <p className="text-sm font-bold leading-tight">
              Teleobjetivo
              <br />
              50/10 MP
            </p>
          </div>
        </div>
      </div>

      {/* Selectores y celulares - Desktop */}
      <div className="hidden md:flex items-end justify-center gap-20 w-full max-w-5xl">
        {/* Producto izquierdo */}
        <div className="flex flex-col items-center gap-6">
          {/* Selector elegante */}
          <div className="relative">
            <select
              className="bg-transparent text-white px-8 py-3 rounded-full font-bold text-base border-2 border-white/50 shadow-lg focus:outline-none focus:border-white transition-all duration-300 hover:border-white cursor-pointer appearance-none pr-12"
              value={selectedLeft.name}
              onChange={(e) => {
                const prod = products.find((p) => p.name === e.target.value);
                if (prod) setSelectedLeft(prod);
              }}
              style={{ minWidth: "200px" }}
            >
              {products.map((p) => (
                <option
                  key={p.name}
                  value={p.name}
                  className="bg-[#17407A] text-white"
                >
                  {p.name}
                </option>
              ))}
            </select>
            {/* Flecha personalizada */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Imagen del producto */}
          <div className="transform transition-all duration-300 hover:scale-105">
            <Image
              src={selectedLeft.image}
              alt={selectedLeft.name}
              width={240}
              height={280}
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              priority
            />
          </div>
        </div>

        {/* Producto derecho */}
        <div className="flex flex-col items-center gap-6">
          {/* Selector elegante */}
          <div className="relative">
            <select
              className="bg-transparent text-white px-8 py-3 rounded-full font-bold text-base border-2 border-white/50 shadow-lg focus:outline-none focus:border-white transition-all duration-300 hover:border-white cursor-pointer appearance-none pr-12"
              value={selectedRight.name}
              onChange={(e) => {
                const prod = products.find((p) => p.name === e.target.value);
                if (prod) setSelectedRight(prod);
              }}
              style={{ minWidth: "200px" }}
            >
              {products.map((p) => (
                <option
                  key={p.name}
                  value={p.name}
                  className="bg-[#17407A] text-white"
                >
                  {p.name}
                </option>
              ))}
            </select>
            {/* Flecha personalizada */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Imagen del producto */}
          <div className="transform transition-all duration-300 hover:scale-105">
            <Image
              src={selectedRight.image}
              alt={selectedRight.name}
              width={240}
              height={280}
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              priority
            />
          </div>
        </div>
      </div>

      {/* Tarjeta comparativa - Desktop */}
      <div className="hidden md:block w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        <div className="flex items-stretch justify-between gap-8">
          {/* Icono y título */}
          <div className="flex flex-col items-center justify-center gap-3 min-w-[120px]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Image src={cameraIcon} alt="Cámara" width={62} height={62} />
            </div>
            <span className="font-bold text-xl text-gray-800">Cámara</span>
          </div>

          {/* Especificaciones izquierda */}
          <div className="flex-1 flex flex-col justify-center gap-10 text-center">
            <h4 className="font-bold text-lg text-gray-800 mb-2">
              Cámara ultraancha
              <br />
              50 MP
            </h4>
            <div className="space-y-8">
              <p className="text-gray-600 text-lg font-bold">
                Cámara de ángulo
                <br />
                amplio
                <br />
                200 MP
              </p>
              <p className="text-gray-600 text-lg font-bold">
                Teleobjetivo
                <br />
                50/10 MP
              </p>
            </div>
          </div>

          {/* Especificaciones derecha */}
          <div className="flex-1 flex flex-col justify-center gap-10 text-center">
            <h4 className="font-bold text-lg text-gray-800 mb-2">
              Cámara ultraancha
              <br />
              12 MP
            </h4>
            <div className="space-y-8">
              <p className="text-gray-600 text-lg font-bold">
                Cámara de ángulo
                <br />
                amplio
                <br />
                200 MP
              </p>
              <p className="text-gray-600 text-lg font-bold">
                Teleobjetivo
                <br />
                50/10 MP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
