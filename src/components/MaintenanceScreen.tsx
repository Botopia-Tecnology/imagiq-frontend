"use client";

import { useEffect, useState } from "react";

/**
 * Pantalla de mantenimiento con diseño Samsung
 *
 * Filosofía de diseño:
 * - Minimalista pero futurista
 * - Sombras sutiles y dinámicas
 * - Animaciones fluidas
 * - Esquema de colores Samsung (azul, negro, blanco)
 */
export default function MaintenanceScreen() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    setMounted(true);

    // Generar partículas flotantes aleatorias
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Partículas flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted && particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/20 blur-sm animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Grid de fondo sutil */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(59, 130, 246) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Gradiente radial central */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Contenido principal */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Logo animado (placeholder - reemplazar con logo real) */}
        <div className="mb-12 animate-pulse-slow">
          <div className="relative">
            {/* Anillo exterior giratorio */}
            <div className="absolute -inset-4 rounded-full border-2 border-blue-500/30 animate-spin-slow" />
            <div className="absolute -inset-2 rounded-full border border-blue-400/20 animate-spin-reverse" />

            {/* Logo central */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-900 shadow-2xl shadow-blue-500/50">
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Texto principal con efecto de brillo */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl animate-gradient">
            Estamos trabajando
          </h1>
          <h2 className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-2xl font-light tracking-wide text-transparent md:text-4xl">
            en una nueva experiencia
          </h2>
        </div>

        {/* Descripción con efecto glassmorphism */}
        <div className="mb-12 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <p className="text-center text-lg leading-relaxed text-gray-300 md:text-xl">
            Estamos preparando algo especial para ti.
            <br />
            <span className="font-semibold text-blue-400">
              Las mejores ofertas
            </span>{" "}
            te esperan muy pronto.
          </p>
        </div>

        {/* Indicador de carga animado */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full bg-blue-500 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Barra de progreso decorativa */}
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden shadow-inner">
            <div className="h-full w-1/3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-progress shadow-lg shadow-blue-500/50" />
          </div>
        </div>

        {/* Tarjetas de características flotantes */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-4xl w-full px-4">
          {[
            { icon: "🎁", title: "Ofertas exclusivas", desc: "Descuentos únicos" },
            { icon: "⚡", title: "Rendimiento mejorado", desc: "Más rápido que nunca" },
            { icon: "✨", title: "Nueva interfaz", desc: "Diseño renovado" },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/20"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Brillo al hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

              <div className="relative text-center">
                <div className="mb-3 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>

              {/* Línea decorativa inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Mensaje de contacto */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?{" "}
            <a
              href="mailto:soporte@imagiq.com"
              className="font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>

      {/* Estilos de animaciones personalizadas */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
