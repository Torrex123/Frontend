"use client";

import { useThemeStore } from "../store/themeStore";
import { useEffect } from "react";

interface ThemeStore {
    theme: string;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore() as ThemeStore;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.className = theme; 
  }, [theme]);

  return <>{children}</>;
}



