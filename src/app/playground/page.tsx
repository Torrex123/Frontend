'use client';
import { motion } from "framer-motion";
import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/UseAuth";

export default function Playground() {

    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-grow flex items-center justify-center"
            >
                <div className="bg-base-100 w-full max-w-full sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1450px] rounded-xl shadow-lg border border-base-300 mx-auto p-2 sm:p-3 md:p-4">
                    <CodeEditor />
                </div>
            </motion.div>
        </div>
    );
}