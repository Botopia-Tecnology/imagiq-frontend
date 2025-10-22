/**
 * @module ProfileHeader
 * @description Samsung-style profile header - clean and minimal
 */

import React from "react";
import { Edit } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { ProfileUser } from "../../types";

interface ProfileHeaderProps {
  user: ProfileUser;
  onEditProfile: () => void;
  loading?: boolean;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditProfile,
  loading = false,
  className,
}) => {
  const getInitials = (user: ProfileUser): string => {
    const firstName = user.nombre || "";
    const lastName = user.apellido || "";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getFullName = (user: ProfileUser): string => {
    return `${user.nombre || ""} ${user.apellido || ""}`.trim();
  };

  if (loading) {
    return (
      <div
        className={cn(
          "bg-white border-b-2 border-gray-100 p-6 md:p-8",
          className
        )}
      >
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
    <div className={cn("bg-white border-b-2 border-gray-100", className)}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar - Samsung style: larger, cleaner */}
            <div className="relative">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={getFullName(user)}
                  width={96}
                  height={96}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold border-2 border-gray-200">
                  {getInitials(user)}
                </div>
              )}
              {/* Online indicator */}
              <div
                aria-hidden
                className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"
              />
            </div>

            {/* User Info - Samsung style: bold names */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {getFullName(user)}
              </h1>
              <p className="text-sm md:text-base text-gray-600">{user.email}</p>
              {user.loyaltyPoints != null && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                  <span>{user.loyaltyPoints} puntos</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button - Samsung style */}
          <Button
            variant="outline"
            size="md"
            onClick={onEditProfile}
            className="flex items-center gap-2 font-bold border-2 border-black hover:bg-black hover:text-white transition-colors self-start md:self-auto"
          >
            <Edit className="w-4 h-4" />
            Editar perfil
          </Button>
        </div>
      </div>
    </div>
  );
};

ProfileHeader.displayName = "ProfileHeader";

export default ProfileHeader;
