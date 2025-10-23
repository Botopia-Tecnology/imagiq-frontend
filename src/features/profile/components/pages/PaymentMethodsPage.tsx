import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";

interface PaymentMethodsPageProps {
  onBack: () => void;
}

const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({ onBack }) => {
  const { state } = useProfile();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "credit" | "debit" | "bank"
  >("all");

  const cards = state.user?.tarjetas || [];

  const filteredCards = cards.filter((card) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "credit") return card.tipo_tarjeta === "credit_card";
    if (selectedFilter === "debit") return card.tipo_tarjeta === "debit_card";
    if (selectedFilter === "bank") return card.tipo_tarjeta === "bank_account";
    return true;
  });

  const counts = {
    all: cards.length,
    credit: cards.filter((c) => c.tipo_tarjeta === "credit_card").length,
    debit: cards.filter((c) => c.tipo_tarjeta === "debit_card").length,
    bank: cards.filter((c) => c.tipo_tarjeta === "bank_account").length,
  };

  const handleAddCard = () => console.log("Agregar método de pago");
  // Removed unused handlers for SonarQube/ESLint compliance

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Métodos de Pago
                </h1>
                <p className="text-sm text-gray-600">{cards.length} métodos</p>
              </div>
            </div>
            <button
              onClick={handleAddCard}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: "all", label: "Todas", count: counts.all },
              { key: "credit", label: "Crédito", count: counts.credit },
              { key: "debit", label: "Débito", count: counts.debit },
              { key: "bank", label: "Banco", count: counts.bank },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() =>
                  setSelectedFilter(key as "all" | "credit" | "debit" | "bank")
                }
                className={
                  "px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors " +
                  (selectedFilter === key
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                }
              >
                {label} {count > 0 && `(${count})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredCards.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">
              No tienes métodos de pago en esta categoría
            </p>
            <button
              onClick={handleAddCard}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Agregar método de pago
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl border-2 border-gray-200 p-6 flex flex-col gap-2"
              >
                <div className="font-semibold text-lg text-gray-900">
                  {card.alias || card.nombre_titular || "Tarjeta"}
                </div>
                <div className="text-gray-600 text-sm">
                  •••• {card.ultimos_dijitos}
                </div>
                <div className="text-gray-400 text-xs">{card.tipo_tarjeta}</div>
                {/* Add edit/delete/default actions here if needed */}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-gray-900 text-white rounded-2xl border-2 border-gray-800 p-6">
          <div className="flex gap-3">
            {/* Icon removed for SonarQube/ESLint compliance */}
            <div>
              <h3 className="font-bold text-lg mb-2">Seguridad de tus datos</h3>
              <p className="text-sm text-gray-300">
                Tus datos de pago están protegidos con encriptación de nivel
                bancario. Nunca almacenamos el CVV de tus tarjetas.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 p-6">
          <div className="flex gap-3">
            {/* Icon removed for SonarQube/ESLint compliance */}
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Tarjetas expiradas
              </h3>
              <p className="text-sm text-gray-600">
                Las tarjetas expiradas no se pueden usar para realizar compras.
                Actualiza la información de tu tarjeta para continuar usándola.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
