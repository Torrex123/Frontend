"use client";

import { create } from 'zustand';

type ThemeStore = {
  theme: string;
  initialized: boolean;
  setTheme: (theme: string) => void;
  initializeTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",
  initialized: false,
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("chat-theme", theme);
    }
    set({ theme });
  },
  initializeTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("chat-theme") || "light";
      set({ theme: savedTheme, initialized: true });
    }
  }
}));