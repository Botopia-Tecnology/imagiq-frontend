/**
 * @module useNotificationSettings
 * @description Hook for managing notification settings state and actions
 */

import { useState, useCallback } from "react";
import { NotificationSetting } from "./NotificationRow";

export const useNotificationSettings = (
  initialSettings: NotificationSetting[]
) => {
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSetting[]>(initialSettings);

  const handleEmailChange = useCallback((id: string, enabled: boolean) => {
    setNotificationSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, channels: { ...setting.channels, email: enabled } }
          : setting
      )
    );
  }, []);

  const handlePushChange = useCallback((id: string, enabled: boolean) => {
    setNotificationSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, channels: { ...setting.channels, push: enabled } }
          : setting
      )
    );
  }, []);

  const getSettingsByCategory = useCallback(
    (category: string) =>
      notificationSettings.filter((setting) => setting.category === category),
    [notificationSettings]
  );

  const getAllEmailEnabled = useCallback(
    (category: string) =>
      getSettingsByCategory(category).every((setting) => setting.channels.email),
    [getSettingsByCategory]
  );

  const getAllPushEnabled = useCallback(
    (category: string) =>
      getSettingsByCategory(category).every((setting) => setting.channels.push),
    [getSettingsByCategory]
  );

  const handleToggleAllEmail = useCallback(
    (category: string) => {
      const allEnabled = getAllEmailEnabled(category);
      const categorySettings = getSettingsByCategory(category);

      setNotificationSettings((prev) =>
        prev.map((setting) =>
          categorySettings.includes(setting)
            ? {
                ...setting,
                channels: { ...setting.channels, email: !allEnabled },
              }
            : setting
        )
      );
    },
    [getAllEmailEnabled, getSettingsByCategory]
  );

  const handleToggleAllPush = useCallback(
    (category: string) => {
      const allEnabled = getAllPushEnabled(category);
      const categorySettings = getSettingsByCategory(category);

      setNotificationSettings((prev) =>
        prev.map((setting) =>
          categorySettings.includes(setting)
            ? { ...setting, channels: { ...setting.channels, push: !allEnabled } }
            : setting
        )
      );
    },
    [getAllPushEnabled, getSettingsByCategory]
  );

  const handleSaveSettings = useCallback(() => {
    console.log("Save notification settings:", notificationSettings);
    // NOTE: Placeholder - implement API call to persist notification settings.
  }, [notificationSettings]);

  return {
    notificationSettings,
    handleEmailChange,
    handlePushChange,
    getSettingsByCategory,
    getAllEmailEnabled,
    getAllPushEnabled,
    handleToggleAllEmail,
    handleToggleAllPush,
    handleSaveSettings,
  };
};
