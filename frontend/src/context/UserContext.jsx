import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authGetMe, clearToken } from '../services/api';

const UserContext = createContext();

const STORAGE_KEY_SETTINGS = 'opsmind-settings';

const defaultUser = {
  id: null,
  name: '',
  email: '',
  picture: null,
  authProviders: [],
};

const defaultSettings = {
  answerLength: 'detailed',
  showSources: true,
  regenerateConfirmation: false,
  notifications: true,
  documentProcessingAlerts: true,
  systemAlerts: true,
  fontSize: 'medium',
  comfortableSpacing: false,
  highContrast: false
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // true while checking token on mount

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Controls whether the login popup is visible
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Persist settings to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // On mount — try to restore session from JWT token
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const me = await authGetMe();
        if (me) {
          setUser({
            id: me.id,
            name: me.name,
            email: me.email,
            picture: me.picture || null,
            authProviders: me.authProviders || [],
          });
          setIsLoggedIn(true);
        }
      } catch {
        // token invalid or expired — stay logged out
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  /**
   * Called after successful login/signup — set user from API response.
   */
  const loginWithUserData = useCallback((userData) => {
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      picture: userData.picture || null,
      authProviders: userData.authProviders || [],
    });
    setIsLoggedIn(true);
    setShowLoginPopup(false);
  }, []);

  /**
   * Log out — clear token and reset state.
   */
  const logout = useCallback(() => {
    clearToken();
    setUser(defaultUser);
    setIsLoggedIn(false);
  }, []);

  /**
   * Open / close the login popup from anywhere.
   */
  const openLoginPopup = useCallback(() => setShowLoginPopup(true), []);
  const closeLoginPopup = useCallback(() => setShowLoginPopup(false), []);

  return (
    <UserContext.Provider value={{
      user,
      settings,
      isLoggedIn,
      authLoading,
      showLoginPopup,
      updateUser,
      updateSettings,
      loginWithUserData,
      logout,
      openLoginPopup,
      closeLoginPopup,
    }}>
      {children}
    </UserContext.Provider>
  );
};
