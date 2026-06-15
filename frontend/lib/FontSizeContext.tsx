'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'small' | 'medium' | 'large';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 'medium',
  setFontSize: () => {},
});

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const savedSize = localStorage.getItem('app-font-size') as FontSize;
    if (savedSize && ['small', 'medium', 'large'].includes(savedSize)) {
      setFontSizeState(savedSize);
      applyFontSize(savedSize);
    }
    setMounted(true);
  }, []);

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    if (size === 'small') {
      root.style.setProperty('--base-font-size', '14px');
    } else if (size === 'large') {
      root.style.setProperty('--base-font-size', '18px');
    } else {
      root.style.setProperty('--base-font-size', '16px');
    }
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('app-font-size', size);
    applyFontSize(size);
  };

  // To prevent hydration mismatch, we don't render children until mounted
  // However, since font-size is purely CSS, we can just render it.
  // The layout won't shift badly because the CSS variable applies instantly.

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);
