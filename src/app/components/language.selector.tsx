import React, { useState, useRef, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";


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

interface LanguageSelectorProps {
    language: string;
    selectLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, selectLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        function handleClickOutside(event: { target: any; }) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <button
                className="flex items-center gap-2 btn m-1 w-40 shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {language || "Select Language"}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 mt-2 w-52 bg-base-200 rounded-lg p-2 shadow-sm z-10 top-12"
                    >
                        <ul className="space-y-2">
                            {Object.entries(LANGUAGES).map(([lang, version]) => (
                                <li key={lang} ref={dropdownRef}>
                                    <a
                                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-base-300 transition !m-2"
                                        onClick={() => {
                                            selectLanguage(lang);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span className="text-sm font-medium">{lang}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                                            - {version}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;
