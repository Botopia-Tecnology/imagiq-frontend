import React, { useState } from "react";
import { X } from "lucide-react";

interface GuestUserData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

interface GuestDataModalProps {
  onSubmit: (data: GuestUserData) => void;
  onCancel: () => void;
}

const GuestDataModal: React.FC<GuestDataModalProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<GuestUserData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const [errors, setErrors] = useState<Partial<GuestUserData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: Partial<GuestUserData> = {};
    if (!formData.nombre) newErrors.nombre = "Requerido";
    if (!formData.apellido) newErrors.apellido = "Requerido";
    if (!formData.email) newErrors.email = "Requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.telefono) newErrors.telefono = "Requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo con blur */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-white/10"
        onClick={onCancel}
      />

      {/* Contenedor del modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Tus datos para guardar favoritos</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contenido del formulario */}
        <div className="p-4 space-y-4">
          {[
            { label: "Nombre", name: "nombre", type: "text" },
            { label: "Apellido", name: "apellido", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Teléfono", name: "telefono", type: "tel" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name as keyof GuestUserData]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors[name as keyof GuestUserData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[name as keyof GuestUserData]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestDataModal;
