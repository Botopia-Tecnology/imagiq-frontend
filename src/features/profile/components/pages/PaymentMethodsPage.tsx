import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { useAuthContext } from "@/features/auth/context";
import Modal from "@/components/ui/Modal";
import AddCardForm from "@/components/forms/AddCardForm";
import CardBrandLogo from "@/components/ui/CardBrandLogo";

interface PaymentMethodsPageProps {
  onBack: () => void;
}

const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({ onBack }) => {
  const { state, actions } = useProfile();
  const authContext = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cards = state.user?.tarjetas || [];

  const handleAddCard = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCardAdded = async () => {
    // Recargar el perfil para mostrar la nueva tarjeta
    await actions.loadProfile();
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal para agregar tarjeta */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg" showCloseButton={false}>
        <AddCardForm
          userId={authContext.user?.id || ""}
          onSuccess={handleCardAdded}
          onCancel={handleCloseModal}
          showAsModal={true}
        />
      </Modal>
      <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Mobile layout: stacked */}
          <div className="flex md:hidden flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Métodos de Pago
                  </h1>
                  <p className="text-xs text-gray-600">{cards.length} métodos</p>
                </div>
              </div>
              <button
                onClick={handleAddCard}
                className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </div>

          {/* Desktop layout: all in one row */}
          <div className="hidden md:flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Métodos de Pago
                </h1>
                <p className="text-xs text-gray-600">{cards.length} métodos</p>
              </div>
            </div>

            <button
              onClick={handleAddCard}
              className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {cards.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-sm mb-4">
              No tienes métodos de pago registrados
            </p>
            <button
              onClick={handleAddCard}
              className="px-5 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Agregar método de pago
            </button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {cards.map((card) => {
              // Determinar color de gradiente según marca (colores pastel más suaves)
              const getCardGradient = (marca?: string) => {
                if (!marca) return "from-slate-400 to-slate-500";
                const brandLower = marca.toLowerCase();
                if (brandLower.includes("visa")) return "from-blue-300 to-blue-400";
                if (brandLower.includes("mastercard")) return "from-orange-300 to-red-300";
                if (brandLower.includes("amex") || brandLower.includes("american")) return "from-teal-300 to-teal-400";
                if (brandLower.includes("discover")) return "from-orange-300 to-orange-400";
                if (brandLower.includes("diners")) return "from-indigo-300 to-indigo-400";
                return "from-slate-400 to-slate-500";
              };

              return (
                <div
                  key={card.id}
                  className={`relative bg-gradient-to-br ${getCardGradient(card.marca)} rounded-xl p-3.5 shadow-lg hover:shadow-xl transition-all cursor-pointer group aspect-[1.586/1]`}
                >
                  {/* Badge de predeterminada */}
                  {card.es_predeterminada && (
                    <div className="absolute top-1.5 right-1.5 bg-white/30 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      Principal
                    </div>
                  )}

                  {/* Banco en esquina superior izquierda + Logo de marca en esquina superior derecha */}
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="text-gray-800 text-[10px] font-semibold uppercase bg-white/30 backdrop-blur-sm px-1.5 py-0.5 rounded">
                      {card.banco
                        ? card.banco
                            // Primero, colapsar abreviaciones como S.A, C.A., etc. a SA, CA
                            .replace(/([A-Z])[.\-_]([A-Z])[.\-_]?/g, '$1$2')
                            // Reemplazar otros caracteres especiales por espacio
                            .replace(/[,.\-_()]/g, ' ')
                            // Normalizar espacios múltiples a uno solo
                            .replace(/\s+/g, ' ')
                            // Eliminar espacios al inicio y final
                            .trim()
                            // Dividir por espacios
                            .split(' ')
                            // Tomar las primeras 2 palabras
                            .slice(0, 2)
                            // Unir con espacio
                            .join(' ')
                        : "Banco"}
                    </div>
                    <CardBrandLogo brand={card.marca} size="lg" />
                  </div>

                  {/* Número de tarjeta */}
                  <div className="mb-2.5">
                    <div className="text-gray-800 text-sm font-mono tracking-wider font-semibold">
                      •••• •••• •••• {card.ultimos_dijitos}
                    </div>
                  </div>

                  {/* Titular y fecha */}
                  <div className="flex justify-between items-end gap-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-700 text-[10px] mb-0.5 font-semibold">TITULAR</div>
                      <div className="text-gray-800 text-xs font-bold uppercase truncate">
                        {card.nombre_titular || card.alias || "TARJETA"}
                      </div>
                    </div>
                    {card.fecha_vencimiento && (
                      <div className="flex-shrink-0">
                        <div className="text-gray-700 text-[10px] mb-0.5 font-semibold">VENCE</div>
                        <div className="text-gray-800 text-xs font-mono font-semibold">
                          {card.fecha_vencimiento}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tipo de tarjeta en esquina inferior derecha */}
                  {card.tipo_tarjeta && (
                    <div className="absolute bottom-2 right-2 bg-white/30 backdrop-blur-sm text-gray-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {card.tipo_tarjeta.toLowerCase() === 'credit' || card.tipo_tarjeta.toLowerCase().includes('credit')
                        ? 'CRÉDITO'
                        : card.tipo_tarjeta.toLowerCase() === 'debit' || card.tipo_tarjeta.toLowerCase().includes('debit')
                        ? 'DÉBITO'
                        : card.tipo_tarjeta.toUpperCase()}
                    </div>
                  )}

                  {/* Efecto hover */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
