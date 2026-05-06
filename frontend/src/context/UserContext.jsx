import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Employee',
    department: 'Operations',
    avatar: null
  });

  const [settings, setSettings] = useState({
    answerLength: 'detailed',
    showSources: true,
    regenerateConfirmation: false,
    notifications: true,
    documentProcessingAlerts: true,
    systemAlerts: true,
    fontSize: 'medium',
    comfortableSpacing: false,
    highContrast: false
  });

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, settings, updateUser, updateSettings }}>
      {children}
    </UserContext.Provider>
  );
};
