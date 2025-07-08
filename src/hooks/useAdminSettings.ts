import { useState, useEffect } from 'react';

interface AdminSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  userRegistration: boolean;
  primaryTextColor: string;
  secondaryTextColor: string;
  accentTextColor: string;
  backgroundColor: string;
  [key: string]: any;
}

const defaultSettings: AdminSettings = {
  siteName: 'Habitude',
  siteDescription: 'Your personal habit tracking and goal management platform',
  maintenanceMode: false,
  userRegistration: true,
  primaryTextColor: '#1f2937',
  secondaryTextColor: '#6b7280',
  accentTextColor: '#3b82f6',
  backgroundColor: '#ffffff',
};

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSetting = (key: keyof AdminSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const applyFontColors = () => {
    // Apply font colors to the document
    const root = document.documentElement;
    root.style.setProperty('--primary-text-color', settings.primaryTextColor);
    root.style.setProperty('--secondary-text-color', settings.secondaryTextColor);
    root.style.setProperty('--accent-text-color', settings.accentTextColor);
    root.style.setProperty('--background-color', settings.backgroundColor);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('adminSettings');
    // Reset CSS variables
    const root = document.documentElement;
    root.style.removeProperty('--primary-text-color');
    root.style.removeProperty('--secondary-text-color');
    root.style.removeProperty('--accent-text-color');
    root.style.removeProperty('--background-color');
  };

  return {
    settings,
    updateSetting,
    applyFontColors,
    resetToDefaults,
  };
}; 