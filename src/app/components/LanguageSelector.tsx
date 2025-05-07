import React, { useState, useRef, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FaJava } from "react-icons/fa";
import {
    SiPython,
    SiJavascript,
    SiRuby,
    SiC,
    SiCplusplus,
    SiPhp,
    SiSwift,
    SiGo
} from "react-icons/si";

export const LANGUAGES: Record<string, string> = {
    "python": "3.10.0",
    "javascript": "18.15.0",
    "java": "15.0.2",
    "ruby": "3.0.1",
    "c": "10.2.0",
    "c++": "10.2.0",
    "php": "8.2.3",
    "swift": "5.3.3",
    "go": "1.16.2"
};

// Language icons mapping using react-icons
const LANGUAGE_ICONS: Record<string, JSX.Element> = {
    "python": <SiPython className="text-[#3776AB]" />,
    "javascript": <SiJavascript className="text-[#F7DF1E]" />,
    "java": <FaJava className="text-[#007396]" />,
    "ruby": <SiRuby className="text-[#CC342D]" />,
    "c": <SiC className="text-[#A8B9CC]" />,
    "c++": <SiCplusplus className="text-[#00599C]" />,
    "php": <SiPhp className="text-[#777BB4]" />,
    "swift": <SiSwift className="text-[#FA7343]" />,
    "go": <SiGo className="text-[#00ADD8]" />
};

interface LanguageSelectorProps {
    language: string;
    selectLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, selectLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLang, setHoveredLang] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        <div className="relative" ref={dropdownRef}>
            <motion.button
                className="flex items-center justify-between gap-2 btn btn-primary btn-outline m-1 w-48 shadow-md text-left px-4 font-medium"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xl">
                        {LANGUAGE_ICONS[language] || <span className="opacity-70">📝</span>}
                    </span>
                    <span className="truncate capitalize">{language || "Select Language"}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDownIcon className="h-4 w-4" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 mt-2 w-64 bg-base-100 rounded-xl p-2 shadow-lg z-50 top-12 border border-base-300 backdrop-blur-sm overflow-x-hidden"
                        style={{
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <div className="py-1 max-h-[300px] overflow-y-auto custom-scrollbar overflow-x-hidden">
                            {Object.entries(LANGUAGES).map(([lang, version]) => (
                                <motion.div
                                key={lang}
                                className={`
                                    flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
                                    ${language === lang ? "bg-primary text-primary-content" : ""}
                                    ${hoveredLang === lang && language !== lang ? "bg-base-300" : ""}
                                `}
                                onMouseEnter={() => setHoveredLang(lang)}
                                onMouseLeave={() => setHoveredLang(null)}
                                onClick={() => {
                                    selectLanguage(lang);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.span
                                        className="text-xl"
                                        animate={{
                                            scale: hoveredLang === lang ? 1.2 : 1,
                                            rotate: hoveredLang === lang ? [0, -10, 10, -5, 5, 0] : 0
                                        }}
                                        transition={{
                                            scale: { duration: 0.2 },
                                            rotate: { duration: 0.5, ease: "easeInOut" }
                                        }}
                                    >
                                        {LANGUAGE_ICONS[lang]}
                                    </motion.span>
                                    <span className="text-sm font-medium capitalize">{lang}</span>
                                </div>
                                <span
                                    className={`
                                        text-xs font-mono px-2 py-1 rounded-full transition-all duration-200
                                        ${language === lang ? "bg-primary-content text-primary" : ""}
                                        ${hoveredLang === lang && language !== lang ? "bg-base-200 text-base-content" : ""}
                                        ${hoveredLang !== lang && language !== lang ? "opacity-70" : ""}
                                    `}
                                >
                                    v{version}
                                </span>
                            </motion.div>
                            
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;