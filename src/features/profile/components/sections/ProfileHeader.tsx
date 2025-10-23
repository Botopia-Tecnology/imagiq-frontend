import React from "react";
import { Edit } from "lucide-react";
import { ProfileUser } from "../../types";

interface ProfileHeaderProps {
  user: ProfileUser;
  onEditProfile: () => void;
  loading?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditProfile, loading }) => {
  // Obtener iniciales del nombre y apellido
  const getInitials = (): string => {
    const firstName = user.nombre || "";
    const lastName = user.apellido || "";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Obtener nombre completo
  const getFullName = (): string => {
    return `${user.nombre || ""} ${user.apellido || ""}`.trim();
  };

  if (loading) {
    return (
      <div className="bg-white border-b-2 border-gray-100 p-6 md:p-8">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b-2 border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar con iniciales */}
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold border-2 border-gray-200">
                {getInitials()}
              </div>
              {/* Indicador online */}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
            </div>

            {/* Información del usuario */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {getFullName()}
              </h1>
              <p className="text-sm md:text-base text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Botón Editar perfil */}
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-4 py-2 font-bold border-2 border-black hover:bg-black hover:text-white transition-colors rounded-lg self-start md:self-auto"
          >
            <Edit className="w-4 h-4" />
            Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
