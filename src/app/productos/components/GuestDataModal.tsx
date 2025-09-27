import { cn } from "@/lib/utils";
import React, { useState } from "react";

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
   <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50" onClick={onCancel} >

      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Tus datos para guardar favoritos</h2>

        <div className="space-y-3" >
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
       
          <button
            onClick={handleSubmit}
            className={cn(
                          "w-full bg-sky-600 text-white py-3 px-4 rounded-lg text-sm font-semibold cursor-pointer",
                          "transition-all duration-200 flex items-center justify-center gap-2",
                          "hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed",
                       
                        )}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestDataModal;
