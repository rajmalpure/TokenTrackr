import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/* All theme colors as CSS variables set directly on <html> */
const applyTheme = (isDark) => {
  const root = document.documentElement;

  if (isDark) {
    root.classList.add('dark');
    root.style.setProperty('--bg-page',    '#020617');
    root.style.setProperty('--bg-card',    '#0f172a');
    root.style.setProperty('--bg-card2',   'rgba(255,255,255,0.05)');
    root.style.setProperty('--bg-input',   'rgba(255,255,255,0.06)');
    root.style.setProperty('--text-main',  '#f1f5f9');
    root.style.setProperty('--text-sub',   '#94a3b8');
    root.style.setProperty('--text-muted', '#64748b');
    root.style.setProperty('--border',     'rgba(255,255,255,0.1)');
    root.style.setProperty('--border-2',   'rgba(255,255,255,0.06)');
  } else {
    root.classList.remove('dark');
    root.style.setProperty('--bg-page',    '#f8fafc');
    root.style.setProperty('--bg-card',    '#ffffff');
    root.style.setProperty('--bg-card2',   '#f1f5f9');
    root.style.setProperty('--bg-input',   '#f8fafc');
    root.style.setProperty('--text-main',  '#0f172a');
    root.style.setProperty('--text-sub',   '#475569');
    root.style.setProperty('--text-muted', '#94a3b8');
    root.style.setProperty('--border',     '#e2e8f0');
    root.style.setProperty('--border-2',   '#f1f5f9');
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* Apply on first paint before any render */
  useEffect(() => { applyTheme(isDark); }, []); // eslint-disable-line

  const toggleTheme = () => setIsDark((p) => !p);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};

export default ThemeContext;
