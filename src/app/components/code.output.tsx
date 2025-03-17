import { div } from "framer-motion/client";
import React from "react";

interface ICodeOutputProps {
    output: string;
}

const CodeOutput: React.FC<ICodeOutputProps> = ({ output }) => {
    console.log(output);
    return (
        <div>
             <div className="flex gap-3 items-center !m-3 bg-base-300">
                    <h1 className="text-lg font-semibold !m-3">Code Output</h1>
            </div>
            <div className="bg-base-100 p-4 rounded-lg shadow-md border border-gray-300 h-[75vh] overflow-y-auto !m-3">
                <div className="whitespace-pre-wrap !m-3">
                    {output ? output : "Click 'Run Code' to execute"}
                </div>
            </div>
        </div>
        
    );
}

export default CodeOutput;