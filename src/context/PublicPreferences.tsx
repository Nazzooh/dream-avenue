import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type PublicTheme = 'light' | 'dark';
const THEME_KEY = 'da_public_theme';

type PublicPreferencesValue = {
  theme: PublicTheme;
  setTheme: (theme: PublicTheme) => void;
  toggleTheme: () => void;
  /** Compatibility values kept false while public components are simplified. */
  motionEnabled: false;
  setMotionEnabled: (_enabled: boolean) => void;
  desktopMotionAllowed: false;
};

const PublicPreferencesContext = createContext<PublicPreferencesValue | null>(null);

function storedTheme(): PublicTheme {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

export function PublicPreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<PublicTheme>(storedTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.dataset.publicTheme = theme;
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
    motionEnabled: false,
    setMotionEnabled: () => undefined,
    desktopMotionAllowed: false,
  }), [theme]);

  return <PublicPreferencesContext.Provider value={value}>{children}</PublicPreferencesContext.Provider>;
}

export function usePublicPreferences() {
  const value = useContext(PublicPreferencesContext);
  if (!value) throw new Error('usePublicPreferences must be used within PublicPreferencesProvider');
  return value;
}
