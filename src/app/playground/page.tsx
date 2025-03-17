'use client';
import { div } from "framer-motion/client";
import CodeEditor from "../components/code.editor";
import LanguageSelector from "../components/language.selector";
import Navbar from "../components/navbar";

export default function ChallengePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-base-200">
                <div className="bg-base-100 w-[90vw] shadow-md mx-4 my-8 p-4 h-[calc(100vh-9rem)]">
                    <CodeEditor />
                </div>
            </div>
        </div>
    );
}