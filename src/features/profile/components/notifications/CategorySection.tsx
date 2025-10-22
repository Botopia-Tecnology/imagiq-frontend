/**
 * @module CategorySection
 * @description Samsung-style category section for notifications
 */

import React from 'react';
import { Mail, Smartphone } from 'lucide-react';
import NotificationRow, { NotificationSetting } from './NotificationRow';
import ToggleSwitch from './ToggleSwitch';

interface CategorySectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  settings: NotificationSetting[];
  onEmailChange: (id: string, enabled: boolean) => void;
  onPushChange: (id: string, enabled: boolean) => void;
  allEmailEnabled: boolean;
  allPushEnabled: boolean;
  onToggleAllEmail: () => void;
  onToggleAllPush: () => void;
  isSecurityCategory?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  description,
  icon: Icon,
  settings,
  onEmailChange,
  onPushChange,
  allEmailEnabled,
  allPushEnabled,
  onToggleAllEmail,
  onToggleAllPush,
  isSecurityCategory = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Section Header - Samsung style */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>

          {/* Master toggles - Samsung style */}
          {!isSecurityCategory && (
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-900" strokeWidth={1.5} />
                <span className="text-sm font-bold text-gray-900">Email</span>
                <ToggleSwitch checked={allEmailEnabled} onChange={onToggleAllEmail} size="sm" />
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-gray-900" strokeWidth={1.5} />
                <span className="text-sm font-bold text-gray-900">Push</span>
                <ToggleSwitch checked={allPushEnabled} onChange={onToggleAllPush} size="sm" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Individual Settings */}
      <div className="space-y-3">
        {settings.map((setting) => (
          <NotificationRow
            key={setting.id}
            setting={setting}
            onEmailChange={onEmailChange}
            onPushChange={onPushChange}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
