'use client';
import { motion } from "framer-motion";
import CodeEditor from "../components/code.editor";
import Navbar from "../components/navbar";

export default function ChallengePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-grow flex items-center justify-center"
            >
                <div className="bg-base-100 w-full max-w-[1450px] rounded-xl shadow-lg border border-base-300 mx-auto p-1 md:p-4 h-[calc(100vh-8rem)]">
                    <CodeEditor />
                </div>
            </motion.div>
        </div>
    );
}