import * as monaco from 'monaco-editor';
import { useRef, useState, useEffect} from 'react';
import LanguageSelector from './LanguageSelector';
import { runCode } from "../../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from './alertDialog';
import { Resizable, ResizeDirection } from 're-resizable';
import 'react-resizable/css/styles.css';
import { Editor } from '@monaco-editor/react';

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
import { usePathname } from 'next/navigation';
import { IoMdArrowRoundBack } from 'react-icons/io';

interface CodeEditorProps {
    onCodeChange?: (code: string) => void;
    onOutputChange?: (output: string, outputType: string) => void;
    onLanguageChange?: (language: string) => void;
    value?: string;
    initialCode?: string;
    initialLanguage?: string;
    isModule?: boolean;
}

export default function CodeEditor({
    onCodeChange,
    onOutputChange,
    onLanguageChange,
    value = '',
    initialCode = '',
    initialLanguage = 'javascript',
    isModule = false
}: CodeEditorProps) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const [code, setCode] = useState(initialCode || '');
    const [language, setLanguage] = useState<keyof typeof CODE_SNIPPETS>(initialLanguage as keyof typeof CODE_SNIPPETS);
    const [output, setOutput] = useState('');
    const [outputType, setOutputType] = useState('info');
    const [isRunning, setIsRunning] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isOutputCopied, setIsOutputCopied] = useState(false);
    const [theme, setTheme] = useState('light');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
    const [editorHeight, setEditorHeight] = useState(500);
    const [outputHeight, setOutputHeight] = useState(200);
    const [isResizing, setIsResizing] = useState(false);
    const [isOnPlaygrounRoute, setIsOnPlaygroundRoute] = useState(false);
    const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';
    const pathname = usePathname();

    useEffect(() => {
        if (!initialCode) {
            setCode(CODE_SNIPPETS[language as keyof typeof CODE_SNIPPETS]);
        }

        setEditorHeight(window.innerHeight * 0.6);
        setOutputHeight(window.innerHeight * 0.25);

    }, []);

    useEffect(() => {
        if (pathname === '/playground') {
            setIsOnPlaygroundRoute(true);
        } else {
            setIsOnPlaygroundRoute(false);
        }
    }, [pathname]);

    // Auto-scroll output when it changes
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }

        if (onOutputChange) {
            onOutputChange(output, outputType);
        }
    }, [output, outputType]);

    // Communicate code changes to external components
    useEffect(() => {
        if (onCodeChange) {
            onCodeChange(code);
        }
    }, [code]);

    useEffect(() => {
        if (isModule) {
            setLanguage('python');
        }
    }, [isModule]);

    useEffect(() => {

        if (value) {
            setCode(value);
        }
    }, [value]);

    // Communicate language changes to external components
    useEffect(() => {
        if (onLanguageChange) {
            onLanguageChange(language);
        }
    }, [language]);

    // callback to parent component when editor is resized
    useEffect(() => {
        if (!isResizing && editorRef.current) {
            setTimeout(() => {
                editorRef.current?.layout();
            }, 100);
        }
    }, [isResizing]);

    const handleBackHome = () => {
        window.location.href = '/home';
    }

    const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
        editor?.focus();
    };

    const handleResizeStart = () => {
        setIsResizing(true);
    };

    const handleEditorResizeStop = (
        e: MouseEvent | TouchEvent,
        direction: ResizeDirection,
        ref: HTMLElement,
    ) => {
        setIsResizing(false);
        const newHeight = ref.offsetHeight || parseInt(ref.style.height, 10);
        setEditorHeight(newHeight);

        if (editorRef.current) {
            editorRef.current.layout();
        }
    };

    const handleOutputResizeStop = (
        e: MouseEvent | TouchEvent,
        direction: ResizeDirection,
        ref: HTMLElement,
        d: { width: number; height: number }
    ) => {
        setIsResizing(false);
        const newHeight = ref.offsetHeight || parseInt(ref.style.height, 10);
        setOutputHeight(newHeight);
    };

    const selectLanguage = (newLang: string) => {
        if (code.trim() && code !== CODE_SNIPPETS[language]) {
            setPendingLanguage(newLang);
            setShowConfirmDialog(true);
        } else {
            setLanguage(newLang as keyof typeof CODE_SNIPPETS);
            setCode(CODE_SNIPPETS[newLang as keyof typeof CODE_SNIPPETS]);
            setOutput('');
            setOutputType('info');
        }
    };

    const confirmLanguageChange = () => {
        if (pendingLanguage) {
            setLanguage(pendingLanguage as keyof typeof CODE_SNIPPETS);
            setCode(CODE_SNIPPETS[pendingLanguage as keyof typeof CODE_SNIPPETS]);
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
            setOutput("Ejecutando código...");
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
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const copyOutputToClipboard = () => {
        navigator.clipboard.writeText(output);
        setIsOutputCopied(true);
        setTimeout(() => setIsOutputCopied(false), 2000);
    };

    const clearCode = () => {
        setCode('');
    };

    const clearOutput = () => {
        setOutput('');
        setOutputType('info');
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Get output status icon based on output type
    const getOutputStatusIcon = () => {
        switch (outputType) {
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
        const baseClass = `flex justify-between items-center px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`;

        switch (outputType) {
            case 'Éxito':
                return `${baseClass} ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`;
            case 'Error':
                return `${baseClass} ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'}`;
            default:
                return `${baseClass} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`;
        }
    };

    const resizeHandleStyles = {
        bottom: {
            width: '100%',
            height: '8px',
            bottom: '0px',
            cursor: 'ns-resize',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    };

    const CustomHandle = ({ className = '' }: { className?: string }) => (
        <div className={`${className} flex justify-center items-center`}>
            <div className="w-16 h-1 rounded-full bg-gray-300 opacity-50 hover:opacity-80 transition-opacity"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-full gap-4">
            <Resizable
                className={`editor-container flex flex-col rounded-xl shadow-xl transition-all duration-300 overflow-hidden ${theme === 'dark'
                    ? 'bg-gray-900 border border-gray-700/50'
                    : 'bg-gray-50 border border-gray-200'
                    }`}
                size={{ width: '100%', height: editorHeight }}
                minHeight={200}
                maxHeight={800}
                enable={{ bottom: true }}
                handleComponent={{ bottom: <CustomHandle /> }}
                handleStyles={resizeHandleStyles}
                onResizeStart={handleResizeStart}
                onResizeStop={handleEditorResizeStop}
                style={{
                    opacity: isResizing ? 0.85 : 1,
                    transition: isResizing ? 'none' : 'opacity 0.2s'
                }}
            >
                <div className={`flex flex-col sm:flex-row justify-between items-center px-3 sm:px-4 py-2 sm:py-3 rounded-t-xl border-b ${theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-100 border-gray-200'
                    }`}>
                    <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                        {isOnPlaygrounRoute && (
                            <button
                                onClick={handleBackHome}
                                className="flex gap-2 btn btn-primary btn-outline m-1 shadow-md text-left px-4 font-medium"
                            >
                                <IoMdArrowRoundBack className="h-5 w-5" />
                                <span>Volver</span>
                            </button>
                        )}
                        {!isModule && (
                            <LanguageSelector language={language} selectLanguage={selectLanguage} />
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                        <motion.button
                            className={`btn btn-sm flex items-center gap-1 px-2 sm:px-3 text-xs sm:text-sm ${theme === 'dark'
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyToClipboard}
                            title="Copiar código"
                        >
                            {isCopied ? <DocumentDuplicateIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
                            {isCopied ? 'Copiado!' : 'Copiar'}
                        </motion.button>

                        <motion.button
                            className={`btn btn-sm flex items-center gap-1 px-2 sm:px-3 text-xs sm:text-sm ${theme === 'dark'
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
                            className={`btn btn-sm flex items-center gap-1 px-2 sm:px-3 text-xs sm:text-sm ${theme === 'dark'
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
                            className={`btn btn-sm text-white flex items-center gap-1 px-3 sm:px-4 text-xs sm:text-sm ${isRunning
                                ? 'opacity-80 cursor-not-allowed'
                                : ''
                                } ${theme === 'dark'
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

                <div className="relative flex-grow h-full">
                    <Editor
                        height="100%"
                        language={language}
                        value={code}
                        theme={editorTheme}
                        onMount={onMount}
                        onChange={(code) => setCode(code || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
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
                            className={`p-1.5 rounded-full ${theme === 'dark'
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
            </Resizable>

            <AnimatePresence>
                {!isFullScreen && (
                    <Resizable
                        className={`output-container rounded-xl shadow-xl overflow-hidden ${theme === 'dark'
                            ? 'bg-gray-800 border border-gray-700/50'
                            : 'bg-gray-100 border border-gray-200'
                            }`}
                        size={{ width: '100%', height: outputHeight }}
                        minHeight={100}
                        maxHeight={500}
                        enable={{ bottom: true }}
                        handleComponent={{ bottom: <CustomHandle /> }}
                        handleStyles={resizeHandleStyles}
                        onResizeStart={handleResizeStart}
                        onResizeStop={handleOutputResizeStop}
                        style={{
                            opacity: isResizing ? 0.85 : 1,
                            transition: isResizing ? 'none' : 'opacity 0.2s'
                        }}
                    >
                        <div className={getOutputHeaderClass()}>
                            <div className="flex items-center gap-2">
                                {getOutputStatusIcon()}
                                <h3 className={`font-bold text-sm sm:text-base ${outputType === 'Éxito'
                                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                    : outputType === 'Error'
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
                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${theme === 'dark'
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
                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${theme === 'dark'
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
                            className={`p-3 sm:p-4 h-[calc(100%-40px)] overflow-y-auto custom-scrollbar font-mono text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                                } ${outputType === 'Error'
                                    ? theme === 'dark' ? 'bg-red-900/10' : 'bg-red-50/50'
                                    : outputType === 'Éxito'
                                        ? theme === 'dark' ? 'bg-green-900/10' : 'bg-green-50/50'
                                        : ''
                                }`}
                        >
                            {output ? (
                                <pre className="whitespace-pre-wrap break-words overflow-x-hidden">{output}</pre>
                            ) : (
                                <div className={`italic flex items-center justify-center h-full ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                    Clickea &apos;Ejecutar código&apos; para ver la salida
                                </div>
                            )}
                        </div>
                    </Resizable>
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

const CODE_SNIPPETS = {
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