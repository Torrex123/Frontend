"use client";

import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export default function ThemeInitializer() {
    const { initialized, initializeTheme } = useThemeStore();
    useEffect(() => {
        if (!initialized) {
            initializeTheme();
        }
    }, [initialized, initializeTheme]);

    return null;
}