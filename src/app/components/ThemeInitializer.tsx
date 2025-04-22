"use client";

import { useEffect } from 'react';
import { hydrateThemeStore, useThemeStore } from '../store/themeStore';

export default function ThemeInitializer() {
    useEffect(() => {
        // Hydrate the store as soon as possible on client side
        hydrateThemeStore();
        
        // Apply the theme immediately to prevent flash
        const theme = useThemeStore.getState().theme;
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.className = theme;
    }, []);

    return null;
}