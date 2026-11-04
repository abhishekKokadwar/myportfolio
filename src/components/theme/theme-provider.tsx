"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

type Theme = "light";

const ThemeContext = createContext<{
  theme: Theme;
}>({ theme: "light" });

export const themeInitScript = `
(function() {
  document.documentElement.setAttribute('data-theme', 'light');
  document.documentElement.classList.remove('dark');
})();
`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
