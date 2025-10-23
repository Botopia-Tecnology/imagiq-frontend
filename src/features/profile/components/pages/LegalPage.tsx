import React from "react";

interface PageProps {
  onBack: () => void;
  className?: string;
  documentType?: string;
}

const LegalPage: React.FC<PageProps> = ({ onBack, documentType }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-black text-white rounded-lg"
      >
        ← Volver
      </button>
      <div>LegalPage - TODO {documentType ? `(${documentType})` : ""}</div>
    </div>
  );
};

export default LegalPage;
