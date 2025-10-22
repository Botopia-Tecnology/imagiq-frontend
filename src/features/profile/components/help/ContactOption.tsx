/**
 * @module ContactOption
 * @description Samsung-style contact support option card
 */

import React from 'react';
import { Clock } from 'lucide-react';
import Button from '@/components/Button';

interface ContactOptionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  action: string;
  available: string;
  onClick: () => void;
}

export const ContactOption: React.FC<ContactOptionProps> = ({
  title,
  description,
  icon: Icon,
  action,
  available,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-gray-400 transition-colors">
      <div className="flex flex-col gap-4">
        {/* Icon - Samsung style */}
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-base">{title}</h3>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</p>

          {/* Availability */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-bold">{available}</span>
          </div>

          {/* Action Button - Samsung style */}
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className="w-full font-bold border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white"
          >
            {action}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactOption;
