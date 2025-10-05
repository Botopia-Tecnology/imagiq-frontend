/**
 * @module ProfileHeader
 * @description Profile header component using existing UI components
 * Following Single Responsibility Principle - only handles profile header display
 */

import React from 'react';
import { Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import { ProfileUser } from '../../types';

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
  className
}) => {
  const getInitials = (user: ProfileUser): string => {
    const firstName = user.nombre || '';
    const lastName = user.apellido || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getFullName = (user: ProfileUser): string => {
    return `${user.nombre || ''} ${user.apellido || ''}`.trim();
  };

  if (loading) {
    return (
      <div className={cn('p-6 bg-white rounded-lg shadow-sm', className)}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
          <div className="w-24 h-9 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-sm', className)}>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={getFullName(user)}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white shadow-lg">
              {getInitials(user)}
            </div>
          )}

          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {getFullName(user)}
          </h1>
          <p className="text-sm text-gray-500 truncate">
            {user.email}
          </p>
          {user.loyaltyPoints && (
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-blue-600">
                {user.loyaltyPoints} puntos
              </span>
            </div>
          )}
        </div>

        {/* Edit Button - using existing Button component */}
        <Button
          variant="outline"
          size="sm"
          onClick={onEditProfile}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          <span className="hidden sm:inline">Editar perfil</span>
        </Button>
      </div>
    </div>
  );
};

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;