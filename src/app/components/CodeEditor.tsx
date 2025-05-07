import Editor from '@monaco-editor/react';
import { useRef, useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { runCode } from "../../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from './alertDialog';
import { 
    PlayIcon, 
    ArrowsPointingOutIcon, 
    ArrowsPointingInIcon, 
    ClipboardIcon, 
    TrashIcon,
    SunIcon,
    MoonIcon,
    XCircleIcon,
    DocumentDuplicateIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/solid';

export default function CodeEditor() {
    const editorRef = useRef<{ focus: () => void } | null>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [outputType, setOutputType] = useState('info'); 
    const [isRunning, setIsRunning] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isOutputCopied, setIsOutputCopied] = useState(false);
    const [theme, setTheme] = useState('light');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
    
    // Set editor theme based on app theme
    const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';

    useEffect(() => {
        setCode(CODE_SNIPPETS[language]);
    }, []);

    // Auto-scroll output when it changes
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const onMount = (editor: { focus: () => void; } | null) => {
        editorRef.current = editor;
        editor?.focus();
    }

    const selectLanguage = (newLang: string) => {
        if (code.trim()) {
            setPendingLanguage(newLang);
            setShowConfirmDialog(true);
        } else {
            setLanguage(newLang);
            setCode(CODE_SNIPPETS[newLang]);
            setOutput('');
            setOutputType('info');
        }
    };
    
    const confirmLanguageChange = () => {
        if (pendingLanguage) {
            setLanguage(pendingLanguage);
            setCode(CODE_SNIPPETS[pendingLanguage]);
            setOutput('');
            setOutputType('info');
            setPendingLanguage(null);
        }
        setShowConfirmDialog(false);
    };
    
    const cancelLanguageChange = () => {
        setPendingLanguage(null);
        setShowConfirmDialog(false);
    };

    const executeCode = async () => {
        try {
            setIsRunning(true);
            setOutput("Running code...");
            setOutputType('info');
            
            const response = await runCode(language, code);
            setOutput(response.run.output);

            if (response.run.stderr === "") {
                setOutputType('Éxito');
            }
            else { 
                setOutputType('Error');
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al ejecutar el código";
            setOutput(`Error: ${errorMessage}`);
            setOutputType('error');
            console.error(error);
        }
        finally {
            setIsRunning(false);
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    const copyOutputToClipboard = () => {
        navigator.clipboard.writeText(output);
        setIsOutputCopied(true);
        setTimeout(() => setIsOutputCopied(false), 2000);
    }

    const clearCode = () => {
        setCode('');
    }

    const clearOutput = () => {
        setOutput('');
        setOutputType('info');
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    // Get output status icon based on output type
    const getOutputStatusIcon = () => {
        switch(outputType) {
            case 'Éxito':
                return <CheckCircleIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />;
            case 'Error':
                return <ExclamationCircleIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />;
            default:
                return <InformationCircleIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />;
        }
    };

    // Get output panel background color based on output type
    const getOutputHeaderClass = () => {
        const baseClass = `flex justify-between items-center px-4 py-2 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`;

        switch(outputType) {
            case 'Éxito':
                return `${baseClass} ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`;
            case 'Error':
                return `${baseClass} ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'}`;
            default:
                return `${baseClass} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`;
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <motion.div 
                className={`flex flex-col rounded-xl shadow-xl transition-all duration-300 flex-grow overflow-hidden ${
                    theme === 'dark'
                        ? 'bg-gray-900 border border-gray-700/50'
                        : 'bg-gray-50 border border-gray-200'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className={`flex flex-col sm:flex-row justify-between items-center px-3 sm:px-4 py-2 sm:py-3 rounded-t-xl border-b ${
                    theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-100 border-gray-200'
                }`}>
                    <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                        <LanguageSelector language={language} selectLanguage={selectLanguage} />
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                        <motion.button 
                            className={`btn btn-sm flex items-center gap-1 px-2 sm:px-3 text-xs sm:text-sm ${
                                theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyToClipboard}
                            title="Coiar código"
                        >
                            {isCopied ? <DocumentDuplicateIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
                            {isCopied ? 'Copiado!' : 'Copiar'}
                        </motion.button>
                        
                        <motion.button 
                            className={`btn btn-sm flex items-center gap-1 px-2 sm:px-3 text-xs sm:text-sm ${
                                theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearCode}
                            title="Clear code"
                        >
                            <TrashIcon className="h-4 w-4" />
                            Borrar
                        </motion.button>
                        
                        <motion.button 
                            className={`btn btn-sm flex items-center gap-1 px-2 sm:px-3 text-xs sm:text-sm ${
                                theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            title={isFullScreen ? "Split view" : "Full screen"}
                        >
                            {isFullScreen ? 
                                <ArrowsPointingInIcon className="h-4 w-4" /> : 
                                <ArrowsPointingOutIcon className="h-4 w-4" />
                            }
                            {isFullScreen ? 'Dividir' : 'Expandir'}
                        </motion.button>
                        
                        <motion.button 
                            className={`btn btn-sm text-white flex items-center gap-1 px-3 sm:px-4 text-xs sm:text-sm ${
                                isRunning 
                                    ? 'opacity-80 cursor-not-allowed' 
                                    : ''
                            } ${
                                theme === 'dark'
                                    ? 'bg-emerald-600 hover:bg-emerald-500'
                                    : 'bg-emerald-500 hover:bg-emerald-400'
                            }`}
                            whileHover={!isRunning ? { scale: 1.05 } : {}}
                            whileTap={!isRunning ? { scale: 0.95 } : {}}
                            onClick={executeCode}
                            disabled={isRunning}
                        >
                            {isRunning ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Ejecutando
                                </>
                            ) : (
                                <>
                                    <PlayIcon className="h-4 w-4" />
                                    Ejecutar código
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
                
                <div className="editor-container relative flex-grow">
                    <Editor
                        height="100%"
                        language={language}
                        value={code}
                        theme={editorTheme}
                        onMount={onMount}
                        onChange={(code) => setCode(code || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14, // Smaller font size for better fit on smaller screens
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 12 },
                            fontLigatures: true,
                            lineNumbers: "on",
                            renderLineHighlight: "all",
                            cursorBlinking: "smooth",
                            smoothScrolling: true,
                            bracketPairColorization: { enabled: true },
                            formatOnPaste: true,
                            formatOnType: true,
                            tabSize: 2,
                            wordWrap: "on"
                        }}
                        className="rounded-b-xl overflow-hidden"
                    />
                    
                    {/* Theme toggle */}
                    <div className="absolute top-3 right-3 z-10">
                        <button 
                            onClick={toggleTheme}
                            className={`p-1.5 rounded-full ${
                                theme === 'dark'
                                    ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-300'
                                    : 'bg-gray-200/70 hover:bg-gray-300/80 text-gray-700'
                            }`}
                            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="h-4 w-4" />
                            ) : (
                                <MoonIcon className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
    
            <AnimatePresence>
                {!isFullScreen && (
                    <motion.div 
                        className={`rounded-xl shadow-xl overflow-hidden ${
                            theme === 'dark'
                                ? 'bg-gray-800 border border-gray-700/50'
                                : 'bg-gray-100 border border-gray-200'
                        }`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "30vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={getOutputHeaderClass()}>
                            <div className="flex items-center gap-2">
                                {getOutputStatusIcon()}
                                <h3 className={`font-bold text-sm sm:text-base ${
                                    outputType === 'Éxito' 
                                        ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                        : outputType === 'error'
                                            ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                            : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                }`}>
                                    {outputType === 'Éxito' 
                                        ? 'Éxito' 
                                        : outputType === 'Error' 
                                            ? 'Error' 
                                            : 'Salida'}
                                </h3>
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                                <motion.button 
                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${
                                        theme === 'dark'
                                            ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                    } transition-colors ${!output ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    whileHover={output ? { scale: 1.05 } : {}}
                                    whileTap={output ? { scale: 0.95 } : {}}
                                    onClick={clearOutput}
                                    disabled={!output}
                                >
                                    <XCircleIcon className="h-3 w-3" />
                                    Borrar
                                </motion.button>
                                <motion.button 
                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${
                                        theme === 'dark'
                                            ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                    } transition-colors ${!output ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    whileHover={output ? { scale: 1.05 } : {}}
                                    whileTap={output ? { scale: 0.95 } : {}}
                                    onClick={copyOutputToClipboard}
                                    disabled={!output}
                                >
                                    {isOutputCopied ? (
                                        <DocumentDuplicateIcon className="h-3 w-3" />
                                    ) : (
                                        <ClipboardIcon className="h-3 w-3" />
                                    )}
                                    {isOutputCopied ? 'Copiado!' : 'Copiar'}
                                </motion.button>
                            </div>
                        </div>
                        <div 
                            ref={outputRef}
                            className={`p-3 sm:p-4 h-[calc(30vh-40px)] overflow-y-auto custom-scrollbar font-mono text-xs sm:text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                            } ${
                                outputType === 'Error' 
                                    ? theme === 'dark' ? 'bg-red-900/10' : 'bg-red-50/50' 
                                    : outputType === 'Éxito'
                                        ? theme === 'dark' ? 'bg-green-900/10' : 'bg-green-50/50'
                                        : ''
                            }`}
                        >
                            {output ? (
                                <pre className="whitespace-pre-wrap break-words overflow-x-hidden">{output}</pre>
                            ) : (
                                <div className={`italic flex items-center justify-center h-full ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                    Clickea 'Ejecutar código' para ver la salida
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Cambiar lenguaje?"
                description="Cambiar el lenguaje reiniciará su código. ¿Estás seguro de que quieres continuar?"
                onConfirm={confirmLanguageChange}
                onCancel={cancelLanguageChange}
            />
        </div>
    );
}

const CODE_SNIPPETS: Record<string, string> = {
    python: `\ndef greet():\n\tprint("Welcome to CryptoPlayground")\n\ngreet()\n`,
    javascript: `\nfunction greet() {\n\tconsole.log("Welcome to CryptoPlayground");\n}\n\ngreet();\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Welcome to CryptoPlayground");\n\t}\n}\n`,
    ruby: `\n# Ruby 3.0.1 Snippet\n\ndef greet\n  puts "Welcome to CryptoPlayground"\nend\n\ngreet\n`,
    c: `\n/* C 10.2.0 Snippet */\n\n#include <stdio.h>\n\nvoid greet() {\n    printf("Welcome to CryptoPlayground\\n");\n}\n\nint main() {\n    greet();\n    return 0;\n}\n`,
    'c++': `\n/* C++ 10.2.0 Snippet */\n\n#include <iostream>\n\nvoid greet() {\n    std::cout << "Welcome to CryptoPlayground" << std::endl;\n}\n\nint main() {\n    greet();\n    return 0;\n}\n`,
    php: `<?php\n\nfunction greet() {\n\techo "Welcome to CryptoPlayground";\n}\n\ngreet();\n`,
    swift: `\n// Swift 5.3.3 Snippet\n\nfunc greet() {\n    print("Welcome to CryptoPlayground")\n}\n\ngreet()\n`,
    go: `\n// Go 1.16.2 Snippet\n\npackage main\n\nimport "fmt"\n\nfunc greet() {\n    fmt.Println("Welcome to CryptoPlayground")\n}\n\nfunc main() {\n    greet()\n}\n`
};
