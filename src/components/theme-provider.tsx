"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme, getTheme, themes } from "@/lib/theme";

interface ThemeContextType {
  currentTheme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<string>("navyPurpleGreen");
  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme("navyPurpleGreen"));

  const setTheme = (newThemeName: string) => {
    setThemeName(newThemeName);
    setCurrentTheme(getTheme(newThemeName));
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("maraplace-theme", newThemeName);
    }
  };

  useEffect(() => {
    // Load theme from localStorage on mount
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("maraplace-theme");
      if (savedTheme && themes[savedTheme]) {
        setThemeName(savedTheme);
        setCurrentTheme(getTheme(savedTheme));
      }
    }
  }, []);

  // Apply theme CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(currentTheme.colors).forEach(([colorKey, colorValue]) => {
      if (typeof colorValue === "string") {
        root.style.setProperty(`--color-${colorKey}`, colorValue);
      } else {
        Object.entries(colorValue).forEach(([shade, value]) => {
          root.style.setProperty(`--color-${colorKey}-${shade}`, value);
        });
      }
    });

    // Apply typography variables
    root.style.setProperty("--font-family-sans", currentTheme.typography.fontFamily.sans);
    root.style.setProperty("--font-family-serif", currentTheme.typography.fontFamily.serif);
    root.style.setProperty("--font-family-mono", currentTheme.typography.fontFamily.mono);
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    themeName,
    setTheme,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 