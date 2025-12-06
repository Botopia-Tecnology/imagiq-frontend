import React from "react";
import { ArrowLeft, Star } from "lucide-react";

interface PageProps {
  onBack: () => void;
}

const LoyaltyPage: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Programa de Lealtad</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Star className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Próximamente
          </h2>
          <p className="text-gray-600 max-w-md">
            Estamos trabajando en esta funcionalidad. Pronto podrás acceder a
            nuestro programa de lealtad con beneficios exclusivos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
