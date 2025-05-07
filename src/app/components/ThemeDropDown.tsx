"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Paintbrush, Check } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk",
    "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter",
    "dim", "nord", "sunset",
];

export default function ThemeDropdown() {
    const { theme, setTheme } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef < HTMLLIElement > (null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <li
            className="cursor-pointer relative flex items-center transform hover:scale-105 transition duration-300"
            onClick={() => setIsOpen(!isOpen)}
            ref={dropdownRef}
        >
            <div className="flex items-center gap-2">
                <div>Temas</div>
                <Paintbrush size={20} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-48 sm:w-56 bg-base-200 shadow-lg rounded-lg p-3 top-10 z-50"
                    >
                        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 space-y-2 overflow-x-hidden">
                            {themes.map((t) => (
                                <button
                                    key={t}
                                    className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-base-300 transition !m-2 w-full"
                                    onClick={() => {
                                        setTheme(t);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="relative h-5 w-5 sm:h-6 sm:w-6 rounded-md overflow-hidden grid grid-cols-2 grid-rows-2 gap-px" data-theme={t}>
                                            <div className="bg-primary w-full h-full"></div>
                                            <div className="bg-secondary w-full h-full"></div>
                                            <div className="bg-accent w-full h-full"></div>
                                            <div className="bg-neutral w-full h-full"></div>
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                                    </div>
                                    {theme === t && <Check size={16} className="text-primary" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
}
