import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default to 'dark'
  const [theme, setTheme] = useState('dark');

  // Load saved theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  // Define colors for each theme
  const themeStyles = {
    dark: {
      bg: 'bg-[#0A0A0A]',
      card: 'bg-[#121212]',
      text: 'text-white',
      subtext: 'text-gray-400',
      border: 'border-gray-800',
      input: 'bg-[#0A0A0A]',
    },
    light: {
      bg: 'bg-gray-100',
      card: 'bg-white',
      text: 'text-gray-900',
      subtext: 'text-gray-500',
      border: 'border-gray-200',
      input: 'bg-gray-50',
    },
    orange: { // Eye Protection Mode
      bg: 'bg-[#1a1410]', // Very dark brown/orange
      card: 'bg-[#241a15]', 
      text: 'text-[#e7d8c9]', // Warm beige
      subtext: 'text-[#9c8676]',
      border: 'border-[#3d2e26]',
      input: 'bg-[#1a1410]',
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, styles: themeStyles[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};