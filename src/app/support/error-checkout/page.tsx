"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function SupportErrorPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params?.get("orderId");
  const status = params?.get("status") || "REJECTED";

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/soporte/inicio_de_soporte");
    }, 8000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-rose-700 mb-4">
          Pago de Soporte No Procesado
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Lo sentimos. Hubo un problema al procesar el pago de soporte.
        </p>

        {orderId && (
          <p className="text-sm text-gray-700 mb-4">
            Número de orden: <strong>{orderId}</strong>
          </p>
        )}

        <p className="text-sm text-gray-500 mb-6">
          Estado: <strong>{status}</strong>
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/soporte/inicio_de_soporte"
            className="px-4 py-2 bg-rose-600 text-white rounded"
          >
            Volver a soporte
          </Link>
          <Link href="/" className="px-4 py-2 border rounded">
            Ir al inicio
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Serás redirigido automáticamente al inicio de soporte en 8 segundos.
        </p>
      </div>
    </div>
  );
}
