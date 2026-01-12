import React, { createContext, useState, useEffect } from 'react';
import { sessionStorage } from '../utils/sessionStorage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load dark mode preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const settings = await sessionStorage.getSettings();
      if (settings.darkMode !== undefined) {
        setDarkMode(settings.darkMode);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setIsLoading(false);
    }
  };

  const toggleDarkMode = async (value) => {
    setDarkMode(value);
    try {
      const settings = await sessionStorage.getSettings();
      settings.darkMode = value;
      await sessionStorage.saveSettings(settings);
      console.log('Theme preference saved:', value);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = {
    darkMode,
    toggleDarkMode,
    colors: darkMode ? {
      background: '#0E1525',
      surface: '#151B2B',
      surfaceSecondary: '#1F1F23',
      text: '#fff',
      textSecondary: '#A0A4AB',
      textTertiary: '#7A7F87',
      primary: '#4EC8C0',
      border: '#2A2E35',
    } : {
      background: '#F5F5F5',
      surface: '#FFFFFF',
      surfaceSecondary: '#E8E8E8',
      text: '#000',
      textSecondary: '#555',
      textTertiary: '#888',
      primary: '#4EC8C0',
      border: '#E0E0E0',
    },
  };

  return (
    <ThemeContext.Provider value={{ ...theme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
