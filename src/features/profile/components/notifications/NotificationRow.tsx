/**
 * @module NotificationRow
 * @description Samsung-style notification settings row
 */

import React from "react";
import { Mail, Smartphone } from "lucide-react";
// 'cn' not needed in this component
import ToggleSwitch from "./ToggleSwitch";

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  category: "general" | "marketing" | "security";
  channels: {
    email: boolean;
    push: boolean;
  };
}

interface NotificationRowProps {
  setting: NotificationSetting;
  onEmailChange: (id: string, enabled: boolean) => void;
  onPushChange: (id: string, enabled: boolean) => void;
}

export const NotificationRow: React.FC<NotificationRowProps> = ({
  setting,
  onEmailChange,
  onPushChange,
}) => {
  const Icon = setting.icon;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4">
        {/* Icon - Samsung style: monochrome */}
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 text-base">
            {setting.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {setting.description}
          </p>

          {/* Toggle Controls - Samsung style */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-900" strokeWidth={1.5} />
              <span className="text-sm font-bold text-gray-900 min-w-[50px]">
                Email
              </span>
              <ToggleSwitch
                checked={setting.channels.email}
                onChange={(checked) => onEmailChange(setting.id, checked)}
                size="sm"
                disabled={setting.category === "security"}
              />
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-gray-900" strokeWidth={1.5} />
              <span className="text-sm font-bold text-gray-900 min-w-[50px]">
                Push
              </span>
              <ToggleSwitch
                checked={setting.channels.push}
                onChange={(checked) => onPushChange(setting.id, checked)}
                size="sm"
                disabled={setting.category === "security"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationRow;
