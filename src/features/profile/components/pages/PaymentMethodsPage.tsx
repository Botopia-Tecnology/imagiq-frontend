import React from "react";

interface PageProps {
  onBack: () => void;
  className?: string;
}

const PaymentMethodsPage: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-black text-white rounded-lg">
        ← Volver
      </button>
      <div>PaymentMethodsPage - TODO</div>
    </div>
  );
};

export default PaymentMethodsPage;
