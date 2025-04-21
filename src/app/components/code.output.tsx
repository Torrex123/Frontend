'use client';
import { motion } from "framer-motion";
import CodeEditor from "../components/code.editor";
import Navbar from "../components/navbar";
import { useThemeStore } from "../store/themeStore"; // Importing the theme store

export default function ChallengePage() {
    const { theme } = useThemeStore(); // Get current theme from context
    
    return (
        <div className={`min-h-screen flex flex-col ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 text-gray-100' 
                : 'bg-gradient-to-br from-blue-50 via-gray-50 to-white text-gray-800'
        } transition-colors duration-300`}>
            <Navbar />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-grow flex items-center justify-center p-3 md:p-6"
            >
                <div className={`w-full max-w-[1400px] rounded-xl shadow-2xl mx-auto my-2 p-2 md:p-4 h-[calc(100vh-8rem)] backdrop-blur-sm backdrop-filter ${
                    theme === 'dark'
                        ? 'bg-gray-850/80 border border-gray-700/50 shadow-gray-900/50'
                        : 'bg-white/90 border border-gray-200 shadow-gray-300/30'
                } transition-all duration-300`}>
                    <CodeEditor />
                </div>
            </motion.div>
        </div>
    );
}