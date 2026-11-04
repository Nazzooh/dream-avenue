import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type PublicTheme = 'light' | 'dark';
const THEME_KEY = 'da_public_theme';
const MOTION_KEY = 'da_public_motion';

type PublicPreferencesValue = {
  theme: PublicTheme;
  setTheme: (theme: PublicTheme) => void;
  toggleTheme: () => void;
  motionEnabled: boolean;
  setMotionEnabled: (enabled: boolean) => void;
  desktopMotionAllowed: boolean;
};

const PublicPreferencesContext = createContext<PublicPreferencesValue | null>(null);

function storedTheme(): PublicTheme {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

function storedMotion() {
  return localStorage.getItem(MOTION_KEY) !== 'off';
}

export function PublicPreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<PublicTheme>(storedTheme);
  const [motionEnabled, setMotionEnabled] = useState(storedMotion);
  const [desktopMotionAllowed, setDesktopMotionAllowed] = useState(false);

  useEffect(() => {
    // Only standard desktops/laptops: 1024px - 1920px with mouse and hover (excludes TV >1920px, tablets, and mobile)
    const query = window.matchMedia('(min-width: 1024px) and (max-width: 1920px) and (pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)');
    const update = () => setDesktopMotionAllowed(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.dataset.publicTheme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(MOTION_KEY, motionEnabled ? 'on' : 'off');
  }, [motionEnabled]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
    motionEnabled,
    setMotionEnabled,
    desktopMotionAllowed,
  }), [theme, motionEnabled, desktopMotionAllowed]);

  return <PublicPreferencesContext.Provider value={value}>{children}</PublicPreferencesContext.Provider>;
}

export function usePublicPreferences() {
  const value = useContext(PublicPreferencesContext);
  if (!value) throw new Error('usePublicPreferences must be used within PublicPreferencesProvider');
  return value;
}
