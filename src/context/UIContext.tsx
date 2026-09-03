import React, { createContext, useContext, useState } from 'react';

export type ModalType = 'upgrade' | 'settings' | 'help' | 'profile' | null;

interface SettingsConfig {
  darkMode: boolean;
  highContrast: boolean;
  notifications: boolean;
  dataSharing: boolean;
}

interface UIContextType {
  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  settings: SettingsConfig;
  updateSettings: (newSettings: Partial<SettingsConfig>) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsConfig>({
    darkMode: true,
    highContrast: false,
    notifications: true,
    dataSharing: true
  });

  const updateSettings = (newSettings: Partial<SettingsConfig>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <UIContext.Provider value={{ activeModal, openModal, closeModal, toastMessage, showToast, settings, updateSettings }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
