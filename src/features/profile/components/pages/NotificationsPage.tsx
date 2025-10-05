/**
 * @module NotificationsPage
 * @description Elegant notifications settings page
 * Following Single Responsibility Principle - handles notification preferences management
 */

import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Megaphone, Shield, Clock, Package, Heart, Star, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import { useProfile } from '../../hooks/useProfile';
import PageHeader from '../layouts/PageHeader';

interface NotificationsPageProps {
  onBack?: () => void;
  className?: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'general' | 'marketing' | 'security';
  channels: {
    email: boolean;
    push: boolean;
  };
}

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}> = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const switchSize = size === 'sm' ? 'w-10 h-6' : 'w-12 h-7';
  const toggleSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const translateDistance = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        switchSize,
        checked ? 'bg-blue-600' : 'bg-gray-200',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
      disabled={disabled}
    >
      <span
        className={cn(
          'inline-block rounded-full bg-white shadow transform transition-transform duration-200',
          toggleSize,
          checked ? translateDistance : 'translate-x-1',
          'mt-1'
        )}
      />
    </button>
  );
};

const NotificationRow: React.FC<{
  setting: NotificationSetting;
  onEmailChange: (id: string, enabled: boolean) => void;
  onPushChange: (id: string, enabled: boolean) => void;
}> = ({ setting, onEmailChange, onPushChange }) => {
  const Icon = setting.icon;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          setting.category === 'general' && 'bg-blue-100 text-blue-600',
          setting.category === 'marketing' && 'bg-green-100 text-green-600',
          setting.category === 'security' && 'bg-red-100 text-red-600'
        )}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">
            {setting.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {setting.description}
          </p>

          {/* Toggle Controls */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 min-w-[40px]">Email</span>
              <ToggleSwitch
                checked={setting.channels.email}
                onChange={(checked) => onEmailChange(setting.id, checked)}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 min-w-[40px]">Push</span>
              <ToggleSwitch
                checked={setting.channels.push}
                onChange={(checked) => onPushChange(setting.id, checked)}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategorySection: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  settings: NotificationSetting[];
  onEmailChange: (id: string, enabled: boolean) => void;
  onPushChange: (id: string, enabled: boolean) => void;
  allEmailEnabled: boolean;
  allPushEnabled: boolean;
  onToggleAllEmail: () => void;
  onToggleAllPush: () => void;
}> = ({
  title,
  description,
  icon: Icon,
  settings,
  onEmailChange,
  onPushChange,
  allEmailEnabled,
  allPushEnabled,
  onToggleAllEmail,
  onToggleAllPush
}) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>

          {/* Master toggles */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Email</span>
              <ToggleSwitch
                checked={allEmailEnabled}
                onChange={onToggleAllEmail}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Push</span>
              <ToggleSwitch
                checked={allPushEnabled}
                onChange={onToggleAllPush}
                size="sm"
              />
            </div>
          </div>
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

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onBack,
  className
}) => {
  const { state } = useProfile();

  // Initialize notification settings based on profile preferences
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    // General Notifications
    {
      id: 'order-updates',
      title: 'Actualizaciones de Pedidos',
      description: 'Estado de tus pedidos, confirmaciones y entregas',
      icon: Package,
      category: 'general',
      channels: {
        email: state.preferences?.notifications?.email ?? true,
        push: state.preferences?.notifications?.push ?? true
      }
    },
    {
      id: 'order-delivered',
      title: 'Pedido Entregado',
      description: 'Cuando tu pedido haya sido entregado exitosamente',
      icon: Bell,
      category: 'general',
      channels: {
        email: state.preferences?.notifications?.email ?? true,
        push: state.preferences?.notifications?.push ?? true
      }
    },
    {
      id: 'wishlist-updates',
      title: 'Lista de Deseos',
      description: 'Productos en oferta o cambios de precio en tu lista',
      icon: Heart,
      category: 'general',
      channels: {
        email: false,
        push: true
      }
    },

    // Marketing Notifications
    {
      id: 'promotions',
      title: 'Promociones y Ofertas',
      description: 'Descuentos especiales, cupones y ofertas exclusivas',
      icon: Megaphone,
      category: 'marketing',
      channels: {
        email: state.preferences?.notifications?.marketing ?? false,
        push: state.preferences?.notifications?.marketing ?? false
      }
    },
    {
      id: 'new-products',
      title: 'Nuevos Productos',
      description: 'Productos nuevos en tus categorías favoritas',
      icon: Star,
      category: 'marketing',
      channels: {
        email: state.preferences?.notifications?.marketing ?? false,
        push: false
      }
    },
    {
      id: 'recommendations',
      title: 'Recomendaciones',
      description: 'Productos sugeridos basados en tus compras',
      icon: Settings,
      category: 'marketing',
      channels: {
        email: false,
        push: state.preferences?.notifications?.marketing ?? false
      }
    },

    // Security Notifications
    {
      id: 'account-security',
      title: 'Seguridad de la Cuenta',
      description: 'Cambios de contraseña y accesos desde nuevos dispositivos',
      icon: Shield,
      category: 'security',
      channels: {
        email: true,
        push: true
      }
    },
    {
      id: 'payment-alerts',
      title: 'Alertas de Pago',
      description: 'Problemas con métodos de pago y transacciones',
      icon: Clock,
      category: 'security',
      channels: {
        email: true,
        push: true
      }
    }
  ]);

  const handleEmailChange = (id: string, enabled: boolean) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, channels: { ...setting.channels, email: enabled } }
          : setting
      )
    );
  };

  const handlePushChange = (id: string, enabled: boolean) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, channels: { ...setting.channels, push: enabled } }
          : setting
      )
    );
  };

  const handleSaveSettings = () => {
    console.log('Save notification settings:', notificationSettings);
    // TODO: Implement API call to save settings
  };

  const getSettingsByCategory = (category: string) =>
    notificationSettings.filter(setting => setting.category === category);

  const getAllEmailEnabled = (category: string) =>
    getSettingsByCategory(category).every(setting => setting.channels.email);

  const getAllPushEnabled = (category: string) =>
    getSettingsByCategory(category).every(setting => setting.channels.push);

  const handleToggleAllEmail = (category: string) => {
    const allEnabled = getAllEmailEnabled(category);
    const categorySettings = getSettingsByCategory(category);

    setNotificationSettings(prev =>
      prev.map(setting =>
        categorySettings.includes(setting)
          ? { ...setting, channels: { ...setting.channels, email: !allEnabled } }
          : setting
      )
    );
  };

  const handleToggleAllPush = (category: string) => {
    const allEnabled = getAllPushEnabled(category);
    const categorySettings = getSettingsByCategory(category);

    setNotificationSettings(prev =>
      prev.map(setting =>
        categorySettings.includes(setting)
          ? { ...setting, channels: { ...setting.channels, push: !allEnabled } }
          : setting
      )
    );
  };

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <PageHeader
        title="Notificaciones"
        subtitle="Gestiona cómo y cuándo quieres recibir notificaciones"
        onBack={onBack}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveSettings}
          >
            Guardar
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* General Notifications */}
        <CategorySection
          title="Notificaciones Generales"
          description="Información importante sobre tus pedidos y cuenta"
          icon={Bell}
          settings={getSettingsByCategory('general')}
          onEmailChange={handleEmailChange}
          onPushChange={handlePushChange}
          allEmailEnabled={getAllEmailEnabled('general')}
          allPushEnabled={getAllPushEnabled('general')}
          onToggleAllEmail={() => handleToggleAllEmail('general')}
          onToggleAllPush={() => handleToggleAllPush('general')}
        />

        {/* Marketing Notifications */}
        <CategorySection
          title="Marketing y Promociones"
          description="Ofertas, descuentos y recomendaciones personalizadas"
          icon={Megaphone}
          settings={getSettingsByCategory('marketing')}
          onEmailChange={handleEmailChange}
          onPushChange={handlePushChange}
          allEmailEnabled={getAllEmailEnabled('marketing')}
          allPushEnabled={getAllPushEnabled('marketing')}
          onToggleAllEmail={() => handleToggleAllEmail('marketing')}
          onToggleAllPush={() => handleToggleAllPush('marketing')}
        />

        {/* Security Notifications */}
        <CategorySection
          title="Seguridad"
          description="Alertas importantes sobre la seguridad de tu cuenta"
          icon={Shield}
          settings={getSettingsByCategory('security')}
          onEmailChange={handleEmailChange}
          onPushChange={handlePushChange}
          allEmailEnabled={getAllEmailEnabled('security')}
          allPushEnabled={getAllPushEnabled('security')}
          onToggleAllEmail={() => handleToggleAllEmail('security')}
          onToggleAllPush={() => handleToggleAllPush('security')}
        />

        {/* Help Text */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex gap-3">
            <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 mb-1">
                Sobre las notificaciones
              </h4>
              <p className="text-blue-700">
                Las notificaciones de seguridad no se pueden desactivar para proteger tu cuenta.
                Puedes personalizar todas las demás según tus preferencias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

NotificationsPage.displayName = 'NotificationsPage';

export default NotificationsPage;