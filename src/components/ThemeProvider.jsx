'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { contentObject, contentText, useSiteData } from '@/lib/siteDataContext';

export const COLOR_PRESETS = [
  {
    id: 'gold',
    name: 'Imperial Gold',
    badge: '🌟',
    primary: '#d97706',
    gradient: 'from-amber-500 via-yellow-500 to-amber-700',
    lightGlow: 'rgba(245, 158, 11, 0.25)',
  },
  {
    id: 'patina',
    name: 'Verde Patina',
    badge: '🌿',
    primary: '#0d9488',
    gradient: 'from-teal-500 via-emerald-500 to-amber-600',
    lightGlow: 'rgba(13, 148, 136, 0.25)',
  },
  {
    id: 'copper',
    name: 'Sunset Copper',
    badge: '🌅',
    primary: '#ea580c',
    gradient: 'from-orange-500 via-rose-500 to-amber-700',
    lightGlow: 'rgba(234, 88, 12, 0.25)',
  },
];

const ThemeContext = createContext({
  theme: 'light',
  colorPreset: 'gold',
  toggleTheme: () => {},
  setColorPreset: () => {},
  mounted: false,
  themeTokens: {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [colorPreset, setColorPresetState] = useState('gold');
  const [mounted, setMounted] = useState(false);
  const siteData = useSiteData();

  const themeObj = contentObject(siteData.template?.structure?.theme);
  const primaryColor = contentText(themeObj.primaryColor) || '#d4af37';
  const secondaryColor = contentText(themeObj.secondaryColor) || '#0b0d12';
  const accentColor = contentText(themeObj.accentColor) || '#b8860b';
  const backgroundColor = contentText(themeObj.backgroundColor) || '#fdfbf7';
  const textColor = contentText(themeObj.textColor) || '#0f172a';
  const heroMinHeight = contentText(themeObj.heroMinHeight) || '85vh';
  const sectionPadding = contentText(themeObj.sectionPadding) || '6rem';
  const baseSize = contentText(themeObj.baseSize) || '16px';
  const headingFont = contentText(themeObj.headingFont) || 'Playfair Display';
  const bodyFont = contentText(themeObj.bodyFont) || 'Plus Jakarta Sans';

  const themeTokens = useMemo(() => ({
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    textColor,
    heroMinHeight,
    sectionPadding,
    baseSize,
    headingFont,
    bodyFont,
  }), [primaryColor, secondaryColor, accentColor, backgroundColor, textColor, heroMinHeight, sectionPadding, baseSize, headingFont, bodyFont]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('aurelia-theme') || 'light';
    const savedPreset = localStorage.getItem('aurelia-color-preset') || 'gold';
    
    setTheme(savedTheme);
    setColorPresetState(savedPreset);
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-accent', savedPreset);
    
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--brand-color', primaryColor);
    root.style.setProperty('--brand-secondary', secondaryColor);
    root.style.setProperty('--brand-accent', accentColor);
    root.style.setProperty('--page-background', backgroundColor);
    root.style.setProperty('--page-text', textColor);
    root.style.setProperty('--hero-min-height', heroMinHeight);
    root.style.setProperty('--section-padding', sectionPadding);
    root.style.setProperty('--base-size', baseSize);
    root.style.setProperty('--heading-font', `"${headingFont}", serif`);
    root.style.setProperty('--body-font', `"${bodyFont}", sans-serif`);
  }, [primaryColor, secondaryColor, accentColor, backgroundColor, textColor, heroMinHeight, sectionPadding, baseSize, headingFont, bodyFont]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('aurelia-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  const setColorPreset = (presetId) => {
    setColorPresetState(presetId);
    localStorage.setItem('aurelia-color-preset', presetId);
    document.documentElement.setAttribute('data-accent', presetId);
  };

  const themeStyle = {
    '--brand-color': primaryColor,
    '--brand-secondary': secondaryColor,
    '--brand-accent': accentColor,
    '--page-background': backgroundColor,
    '--page-text': textColor,
    '--hero-min-height': heroMinHeight,
    '--section-padding': sectionPadding,
    '--base-size': baseSize,
    '--heading-font': `"${headingFont}", serif`,
    '--body-font': `"${bodyFont}", sans-serif`,
  };

  return (
    <ThemeContext.Provider value={{ theme, colorPreset, toggleTheme, setColorPreset, mounted, themeTokens }}>
      <div style={themeStyle} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
