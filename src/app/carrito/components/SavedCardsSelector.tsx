"use client";

import React, { useEffect } from "react";
import { Plus, Check, CreditCard } from "lucide-react";
import { DBCard } from "@/features/profile/types";
import CardBrandLogo from "@/components/ui/CardBrandLogo";

interface SavedCardsSelectorProps {
  userId: string;
  cards: DBCard[];
  selectedCardId: string | null;
  onCardSelect: (cardId: string) => void;
  onAddNewCard: () => void;
  isLoading?: boolean;
}

const SavedCardsSelector: React.FC<SavedCardsSelectorProps> = ({
  userId,
  cards,
  selectedCardId,
  onCardSelect,
  onAddNewCard,
  isLoading = false,
}) => {
  // Debug: Log cuando cambian las tarjetas
  useEffect(() => {
    console.log("🎴 [SavedCardsSelector] Tarjetas recibidas:", cards);
    console.log("🎴 [SavedCardsSelector] Cantidad:", cards?.length || 0);
    console.log("🎴 [SavedCardsSelector] Usuario ID:", userId);
    console.log("🎴 [SavedCardsSelector] Tarjeta seleccionada actual:", selectedCardId);
  }, [cards, userId, selectedCardId]);

  // Auto-seleccionar la tarjeta predeterminada al montar
  useEffect(() => {
    console.log("🔄 [SavedCardsSelector] Intentando auto-seleccionar tarjeta...");
    if (!selectedCardId && cards.length > 0) {
      const defaultCard = cards.find((card) => card.es_predeterminada);
      console.log("🔍 [SavedCardsSelector] Tarjeta predeterminada encontrada:", defaultCard);
      if (defaultCard) {
        console.log("✅ [SavedCardsSelector] Seleccionando tarjeta predeterminada:", defaultCard.id);
        onCardSelect(String(defaultCard.id));
      } else {
        // Si no hay predeterminada, seleccionar la primera
        console.log("⚠️ [SavedCardsSelector] No hay predeterminada, seleccionando primera tarjeta:", cards[0].id);
        onCardSelect(String(cards[0].id));
      }
    }
  }, [cards, selectedCardId, onCardSelect]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  // Si no hay tarjetas, mostrar mensaje para agregar
  if (cards.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 text-sm mb-4">
          No tienes tarjetas guardadas
        </p>
        <button
          type="button"
          onClick={onAddNewCard}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar tarjeta
        </button>
      </div>
    );
  }

  // Filtrar solo tarjetas activas y no expiradas
  const activeCards = cards.filter((card) => {
    if (!card.activa) return false;

    // Verificar expiración
    if (card.fecha_vencimiento) {
      const [month, year] = card.fecha_vencimiento.split("/");
      const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expDate < now) return false;
    }

    return true;
  });

  return (
    <div className="space-y-3">
      {/* Título */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">
          Tus tarjetas guardadas
        </h3>
        <button
          type="button"
          onClick={onAddNewCard}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Nueva tarjeta
        </button>
      </div>

      {/* Lista de tarjetas */}
      <div className="space-y-3">
        {activeCards.map((card) => {
          const isSelected = selectedCardId === String(card.id);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onCardSelect(String(card.id))}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Radio button visual */}
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-black bg-black"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>

                {/* Logo de marca */}
                <div className="flex-shrink-0">
                  <CardBrandLogo brand={card.marca} size="md" />
                </div>

                {/* Información de la tarjeta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 tracking-wider">
                      •••• {card.ultimos_dijitos}
                    </p>
                    {card.es_predeterminada && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    {card.nombre_titular && (
                      <span className="uppercase truncate">
                        {card.nombre_titular}
                      </span>
                    )}
                    {card.fecha_vencimiento && (
                      <span>Vence {card.fecha_vencimiento}</span>
                    )}
                  </div>
                </div>

                {/* Tipo de tarjeta */}
                {card.tipo_tarjeta && (
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500 uppercase">
                      {card.tipo_tarjeta.includes("credit") ? "Crédito" : "Débito"}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mensaje informativo */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">🔒 Pago seguro:</span> El cargo se realizará directamente a la tarjeta seleccionada.
        </p>
      </div>
    </div>
  );
};

export default SavedCardsSelector;
