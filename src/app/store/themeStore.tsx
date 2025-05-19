"use client";

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeStore = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light", // Default theme
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "chat-theme",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // Important for Next.js
    }
  )
);

// Function to hydrate the store on client side
export function hydrateThemeStore() {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme) {
      try {
        const parsedState = JSON.parse(savedTheme);
        if (parsedState.state?.theme) {
          useThemeStore.setState({ theme: parsedState.state.theme });
        }
      } catch{
        // Fallback if JSON parsing fails
        const legacyTheme = localStorage.getItem("chat-theme") || "light";
        useThemeStore.setState({ theme: legacyTheme });
      }
    }
  }
}