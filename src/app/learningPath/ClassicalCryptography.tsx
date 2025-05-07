"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiArrowRight,
    FiAward,
    FiBookOpen,
    FiKey,
    FiRotateCw,
    FiShield,
    FiHelpCircle,
    FiCheckCircle,
    FiX,
    FiCode
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

// Types for our application
type CipherType = 'caesar' | 'substitution' | 'vigenere' | 'transposition';
type ProgressStage = 'learning' | 'quiz' | 'practical' | 'completed';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

export default function ClassicalCryptography() {
    // State management
    const [currentCipher, setCurrentCipher] = useState<CipherType>('caesar');
    const [progress, setProgress] = useState<number>(0);
    const [stage, setStage] = useState<ProgressStage>('learning');
    const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
    const [quizPassed, setQuizPassed] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('info');
    const [questionsAnswered, setQuestionsAnswered] = useState<number[]>([]);
    const [practicalCompleted, setPracticalCompleted] = useState<boolean>(false);

    // Quiz state
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            question: "¿Qué cifrado utiliza un desplazamiento fijo para cada letra del alfabeto?",
            options: ["Cifrado de César", "Cifrado de sustitución", "Cifrado de Vigenère", "Cifrado de transposición"],
            correctAnswer: "Cifrado de César"
        },
        {
            id: 2,
            question: "En el cifrado de sustitución, ¿qué se reemplaza?",
            options: ["Cada letra por otra letra específica", "Cada palabra por un símbolo", "El orden de las letras", "Solo las vocales"],
            correctAnswer: "Cada letra por otra letra específica"
        },
        {
            id: 3,
            question: "¿Qué característica principal tiene el cifrado Vigenère que lo hace más seguro que el de César?",
            options: ["Usa múltiples alfabetos cifrantes", "Es más antiguo", "Utiliza símbolos en lugar de letras", "No utiliza el alfabeto"],
            correctAnswer: "Usa múltiples alfabetos cifrantes"
        },
        {
            id: 4,
            question: "¿Cuál es la principal debilidad del cifrado de César?",
            options: ["Solo hay 25 posibles claves", "Es demasiado lento", "Requiere computadoras potentes", "Es demasiado complejo"],
            correctAnswer: "Solo hay 25 posibles claves"
        },
        {
            id: 5,
            question: "En el cifrado de transposición, ¿qué sucede con las letras del mensaje original?",
            options: ["Cambian de posición pero no de identidad", "Se reemplazan por otras letras", "Se convierten en números", "Se eliminan del mensaje"],
            correctAnswer: "Cambian de posición pero no de identidad"
        }
    ]);

    // Caesar cipher interactive example state
    const [caesarText, setCaesarText] = useState<string>('');
    const [caesarShift, setCaesarShift] = useState<number>(3);
    const [caesarResult, setCaesarResult] = useState<string>('');

    // Substitution cipher interactive example state
    const [substitutionText, setSubstitutionText] = useState<string>('');
    const [substitutionKey, setSubstitutionKey] = useState<string>('ZEBRASCDFGHIJKLMNOPQTUVWXY');
    const [substitutionResult, setSubstitutionResult] = useState<string>('');

    // Vigenere cipher interactive example state
    const [vigenereText, setVigenereText] = useState<string>('');
    const [vigenereKey, setVigenereKey] = useState<string>('CLAVE');
    const [vigenereResult, setVigenereResult] = useState<string>('');

    // Transposition cipher interactive example state
    const [transpositionText, setTranspositionText] = useState<string>('');
    const [transpositionKey, setTranspositionKey] = useState<number>(3);
    const [transpositionResult, setTranspositionResult] = useState<string>('');

    // Update progress based on current cipher and stage
    useEffect(() => {
        let newProgress = 0;

        // Base progress on current cipher
        if (currentCipher === 'caesar') newProgress = 0;
        else if (currentCipher === 'substitution') newProgress = 25;
        else if (currentCipher === 'vigenere') newProgress = 50;
        else if (currentCipher === 'transposition') newProgress = 75;

        // Adjust based on stage
        if (stage === 'quiz') newProgress += 20;
        else if (stage === 'practical') newProgress += 22;
        else if (stage === 'completed') newProgress = 100;

        setProgress(newProgress);
    }, [currentCipher, stage]);

    // Caesar cipher implementation
    useEffect(() => {
        if (caesarText) {
            const result = caesarText
                .split('')
                .map(char => {
                    if (!/[A-Za-z]/.test(char)) return char;

                    const code = char.charCodeAt(0);
                    const isUpperCase = code >= 65 && code <= 90;
                    const shiftedCode = ((code - (isUpperCase ? 65 : 97) + caesarShift) % 26) + (isUpperCase ? 65 : 97);

                    return String.fromCharCode(shiftedCode);
                })
                .join('');

            setCaesarResult(result);
        } else {
            setCaesarResult('');
        }
    }, [caesarText, caesarShift]);

    // Substitution cipher implementation
    useEffect(() => {
        if (substitutionText && substitutionKey.length === 26) {
            const result = substitutionText
                .split('')
                .map(char => {
                    if (!/[A-Za-z]/.test(char)) return char;

                    const code = char.toUpperCase().charCodeAt(0);
                    if (code < 65 || code > 90) return char;

                    const index = code - 65;
                    const substitutedChar = substitutionKey[index];

                    return char === char.toUpperCase() ? substitutedChar : substitutedChar.toLowerCase();
                })
                .join('');

            setSubstitutionResult(result);
        } else {
            setSubstitutionResult('');
        }
    }, [substitutionText, substitutionKey]);

    // Vigenere cipher implementation
    useEffect(() => {
        if (vigenereText && vigenereKey) {
            const result = vigenereText
                .split('')
                .map((char, i) => {
                    if (!/[A-Za-z]/.test(char)) return char;

                    const isUpperCase = char === char.toUpperCase();
                    const plainChar = char.toUpperCase().charCodeAt(0) - 65;
                    const keyChar = vigenereKey[i % vigenereKey.length].toUpperCase().charCodeAt(0) - 65;
                    const encryptedChar = String.fromCharCode(((plainChar + keyChar) % 26) + 65);

                    return isUpperCase ? encryptedChar : encryptedChar.toLowerCase();
                })
                .join('');

            setVigenereResult(result);
        } else {
            setVigenereResult('');
        }
    }, [vigenereText, vigenereKey]);

    // Transposition cipher implementation
    useEffect(() => {
        if (transpositionText && transpositionKey > 0) {
            // Remove spaces for simplicity
            const cleanText = transpositionText.replace(/\s/g, '').toUpperCase();

            // Create the transposition grid
            const grid: string[][] = [];
            let index = 0;

            while (index < cleanText.length) {
                const row: string[] = [];
                for (let i = 0; i < transpositionKey && index < cleanText.length; i++) {
                    row.push(cleanText[index]);
                    index++;
                }
                grid.push(row);
            }

            // Read column by column
            let result = '';
            for (let col = 0; col < transpositionKey; col++) {
                for (let row = 0; row < grid.length; row++) {
                    if (col < grid[row].length) {
                        result += grid[row][col];
                    }
                }
            }

            setTranspositionResult(result);
        } else {
            setTranspositionResult('');
        }
    }, [transpositionText, transpositionKey]);

    // Answer a question in the quiz
    const handleAnswerQuestion = (questionId: number, answer: string) => {
        const updatedQuestions = questions.map(q =>
            q.id === questionId ? { ...q, userAnswer: answer } : q
        );
        setQuestions(updatedQuestions);

        if (!questionsAnswered.includes(questionId)) {
            setQuestionsAnswered([...questionsAnswered, questionId]);
        }
    };

    // Submit the quiz for evaluation
    const handleSubmitQuiz = () => {
        setQuizSubmitted(true);

        const allCorrect = questions.every(q => q.userAnswer === q.correctAnswer);
        setQuizPassed(allCorrect);

        if (allCorrect) {
            setTimeout(() => {
                setStage('practical');
                setQuizSubmitted(false);
            }, 2000);
        }
    };

    // Reset the quiz to try again
    const handleResetQuiz = () => {
        const resetQuestions = questions.map(q => ({ ...q, userAnswer: undefined }));
        setQuestions(resetQuestions);
        setQuestionsAnswered([]);
        setQuizSubmitted(false);
    };


    // Navigate between different ciphers
    const handleCipherChange = (cipher: CipherType) => {
        setCurrentCipher(cipher);
        setActiveTab('info');
    };

    // Navigate to the quiz when all ciphers are reviewed
    const handleStartQuiz = () => {
        setStage('quiz');
    };

    // Return to the main dashboard (this would be linked to your routing system)
    const handleReturnToDashboard = () => {
        // Implement navigation to the dashboard
        console.log("Return to dashboard");
    };

    // Complete the practical exercise (this would be implemented with actual coding challenges)
    const handleSubmitPractical = () => {
        // In a real implementation, you would verify the code submission here
        setPracticalCompleted(true);

        setTimeout(() => {
            setStage('completed');
            // Here you would send the achievement to the database
            confetti({
                particleCount: 250,
                spread: 80,
                origin: { y: 0.6 },
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-base-100">
            {/* Module Header */}
            <header className="bg-base-200 py-6 shadow-md">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center">Criptografía Clásica</h1>

                    {/* Progress Bar */}
                    <div className="w-full max-w-3xl mx-auto mt-4">
                        <div className="mb-2 flex justify-between items-center">
                            <span className="text-sm font-medium">Progreso del módulo</span>
                            <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-base-300 rounded-full h-2.5">
                            <div
                                className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        {/* Progress Steps */}
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentCipher === 'caesar' ? 'border-primary bg-primary text-primary-content' : progress >= 25 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiBookOpen className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">César</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 25 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentCipher === 'substitution' ? 'border-primary bg-primary text-primary-content' : progress >= 50 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiKey className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Sustitución</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 50 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentCipher === 'vigenere' ? 'border-primary bg-primary text-primary-content' : progress >= 75 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiShield className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Vigenère</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 75 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentCipher === 'transposition' ? 'border-primary bg-primary text-primary-content' : progress >= 95 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiRotateCw className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Transposición</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 95 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${stage === 'completed' ? 'border-success bg-success text-success-content' : 'border-base-300 bg-base-100'}`}>
                                    <FiAward className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Completado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Learning Stage - Display content based on current cipher */}
                {stage === 'learning' && (
                    <div className="max-w-4xl mx-auto">
                        {/* Cipher Navigation Tabs */}
                        <div className="tabs tabs-boxed mb-6 justify-center">
                            <button
                                className={`tab ${currentCipher === 'caesar' ? 'tab-active' : ''}`}
                                onClick={() => handleCipherChange('caesar')}
                            >
                                Cifrado César
                            </button>
                            <button
                                className={`tab ${currentCipher === 'substitution' ? 'tab-active' : ''}`}
                                onClick={() => handleCipherChange('substitution')}
                            >
                                Cifrado de Sustitución
                            </button>
                            <button
                                className={`tab ${currentCipher === 'vigenere' ? 'tab-active' : ''}`}
                                onClick={() => handleCipherChange('vigenere')}
                            >
                                Cifrado Vigenère
                            </button>
                            <button
                                className={`tab ${currentCipher === 'transposition' ? 'tab-active' : ''}`}
                                onClick={() => handleCipherChange('transposition')}
                            >
                                Cifrado de Transposición
                            </button>
                        </div>

                        {/* Content Tabs for current cipher */}
                        <div className="tabs mb-4">
                            <button
                                className={`tab tab-bordered ${activeTab === 'info' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('info')}
                            >
                                Información
                            </button>
                            <button
                                className={`tab tab-bordered ${activeTab === 'interactive' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('interactive')}
                            >
                                Práctica Interactiva
                            </button>
                            <button
                                className={`tab tab-bordered ${activeTab === 'history' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                Historia
                            </button>
                        </div>

                        {/* Caesar Cipher Content */}
                        {currentCipher === 'caesar' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Cifrado de César</h2>
                                            <p className="mb-4">
                                                El cifrado César, también conocido como cifrado por desplazamiento, es una de las técnicas de cifrado más simples y ampliamente conocidas. Lleva el nombre de Julio César, quien lo usó para comunicarse con sus generales.
                                            </p>
                                            <h3 className="text-xl font-bold mt-6 mb-2">¿Cómo funciona?</h3>
                                            <p className="mb-4">
                                                En este cifrado, cada letra del texto original se reemplaza por otra letra que se encuentra un número fijo de posiciones más adelante en el alfabeto. Por ejemplo, con un desplazamiento de 3:
                                            </p>
                                            <ul className="list-disc list-inside mb-4 space-y-1">
                                                <li>A se convierte en D</li>
                                                <li>B se convierte en E</li>
                                                <li>C se convierte en F</li>
                                                <li>Y así sucesivamente...</li>
                                            </ul>
                                            <div className="alert alert-info shadow-lg mb-4">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <span>
                                                        La fórmula es: <strong>E(x) = (x + k) mod 26</strong>, donde x es la posición de la letra en el alfabeto (0-25) y k es la clave (el desplazamiento).
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold mt-6 mb-2">Fortalezas y Debilidades</h3>
                                            <div className="overflow-x-auto">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Fortalezas</th>
                                                            <th>Debilidades</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Simple de entender e implementar</td>
                                                            <td>Muy fácil de romper mediante análisis de frecuencia</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Puede ser realizado manualmente</td>
                                                            <td>Solo hay 25 posibles claves para probar</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Útil como introducción a la criptografía</td>
                                                            <td>No ofrece seguridad real para comunicaciones importantes</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'interactive' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Práctica con Cifrado César</h2>
                                            <p className="mb-6">Ingresa un texto y selecciona el desplazamiento para ver cómo funciona el cifrado César:</p>

                                            <div className="form-control w-full mb-4">
                                                <label className="label">
                                                    <span className="label-text">Texto a cifrar:</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Escribe algo..."
                                                    className="input input-bordered w-full"
                                                    value={caesarText}
                                                    onChange={(e) => setCaesarText(e.target.value)}
                                                />
                                            </div>

                                            <div className="form-control w-full mb-6">
                                                <label className="label">
                                                    <span className="label-text">Desplazamiento (1-25):</span>
                                                    <span className="label-text-alt">Valor actual: {caesarShift}</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="25"
                                                    value={caesarShift}
                                                    onChange={(e) => setCaesarShift(Number(e.target.value))}
                                                    className="range range-primary"
                                                />
                                                <div className="w-full flex justify-between text-xs px-2 mt-2">
                                                    <span>1</span>
                                                    <span>5</span>
                                                    <span>10</span>
                                                    <span>15</span>
                                                    <span>20</span>
                                                    <span>25</span>
                                                </div>
                                            </div>

                                            <div className="bg-base-300 p-4 rounded-lg">
                                                <h3 className="font-bold mb-2">Resultado cifrado:</h3>
                                                <p className="font-mono text-lg">{caesarResult || 'Ingresa un texto para ver el resultado'}</p>
                                            </div>

                                            <div className="mt-6 p-4 border border-base-300 rounded-lg">
                                                <h3 className="font-bold mb-2">Reto:</h3>
                                                <p>Intenta descifrar este mensaje: <span className="font-mono">FRPSXWDGRUHV</span></p>
                                                <p className="text-sm mt-2">Pista: Fue cifrado con un desplazamiento de 3.</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'history' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Historia del Cifrado César</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        El cifrado César lleva el nombre de Julio César, quien según el historiador Suetonio, lo utilizó para proteger mensajes de importancia militar.
                                                    </p>
                                                    <p className="mb-4">
                                                        César usaba un desplazamiento de 3 para sus comunicaciones. Esto significa que cada letra en sus mensajes era sustituida por la letra que estaba tres posiciones más adelante en el alfabeto.
                                                    </p>
                                                    <p className="mb-4">
                                                        Este método era efectivo en su época porque la mayoría de los enemigos de Roma eran analfabetos y no conocían los conceptos de criptografía. Sin embargo, para los estándares modernos, el cifrado César es extremadamente débil.
                                                    </p>
                                                    <h3 className="text-xl font-bold mt-6 mb-2">Cifrado César a través del tiempo</h3>
                                                    <ul className="timeline timeline-vertical">
                                                        <li>
                                                            <div className="timeline-start">100 a.C.</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">Julio César comienza a utilizar el cifrado</div>
                                                            <hr />
                                                        </li>
                                                        <li>
                                                            <hr />
                                                            <div className="timeline-start">Siglo IX</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">Al-Kindi desarrolla el análisis de frecuencia para romper cifrados</div>
                                                            <hr />
                                                        </li>
                                                        <li>
                                                            <hr />
                                                            <div className="timeline-start">1467</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">Leon Battista Alberti diseña el primer cifrado polialfabético</div>
                                                            <hr />
                                                        </li>
                                                        <li>
                                                            <hr />
                                                            <div className="timeline-start">Siglo XX</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">El cifrado César se usa principalmente con fines educativos</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title">¿Sabías que?</h3>
                                                            <p className="mb-4">El ROT13 es una variación del cifrado César que usa un desplazamiento de 13 letras. Al tener el alfabeto inglés 26 letras, ROT13 tiene la propiedad de ser su propio inverso.</p>
                                                            <p>Es decir, para cifrar y descifrar se aplica el mismo algoritmo.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-6">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleCipherChange('substitution')}
                                        >
                                            Siguiente: Cifrado de Sustitución <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Substitution Cipher Content */}
                        {currentCipher === 'substitution' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Cifrado de Sustitución</h2>
                                            <p className="mb-4">
                                                El cifrado de sustitución es una técnica más avanzada que el cifrado César. En vez de desplazar las letras por un número fijo, cada letra del alfabeto se sustituye por otra letra o símbolo de acuerdo a una clave predefinida.
                                            </p>
                                            <h3 className="text-xl font-bold mt-6 mb-2">¿Cómo funciona?</h3>
                                            <p className="mb-4">
                                                En el cifrado de sustitución simple, cada letra del alfabeto original se reemplaza consistentemente por una letra o símbolo del alfabeto cifrado. Se debe definir una tabla de sustitución completa que mapee cada letra a su correspondiente.
                                            </p>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table table-zebra w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Alfabeto Original</th>
                                                            <td>A</td>
                                                            <td>B</td>
                                                            <td>C</td>
                                                            <td>D</td>
                                                            <td>E</td>
                                                            <td>F</td>
                                                            <td>G</td>
                                                            <td>H</td>
                                                            <td>I</td>
                                                            <td>...</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>Alfabeto Cifrado</th>
                                                            <td>Z</td>
                                                            <td>E</td>
                                                            <td>B</td>
                                                            <td>R</td>
                                                            <td>A</td>
                                                            <td>S</td>
                                                            <td>C</td>
                                                            <td>D</td>
                                                            <td>F</td>
                                                            <td>...</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="alert alert-info shadow-lg mb-4">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <span>
                                                        La seguridad de este cifrado radica en el número de posibles combinaciones: ¡hay 26! (26 factorial) o aproximadamente 4x10²⁶ posibles claves!
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold mt-6 mb-2">Fortalezas y Debilidades</h3>
                                            <div className="overflow-x-auto">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Fortalezas</th>
                                                            <th>Debilidades</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Muchas más claves posibles que el cifrado César</td>
                                                            <td>Sigue siendo vulnerable al análisis de frecuencia de letras</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Relativamente fácil de implementar</td>
                                                            <td>La clave (el alfabeto completo) es difícil de memorizar</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Puede ser más seguro si se cambia la clave con frecuencia</td>
                                                            <td>Los patrones de palabras se mantienen visibles</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'interactive' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Práctica con Cifrado de Sustitución</h2>
                                            <p className="mb-6">Ingresa un texto y una clave de sustitución para ver cómo funciona:</p>

                                            <div className="form-control w-full mb-4">
                                                <label className="label">
                                                    <span className="label-text">Texto a cifrar:</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Escribe algo..."
                                                    className="input input-bordered w-full"
                                                    value={substitutionText}
                                                    onChange={(e) => setSubstitutionText(e.target.value)}
                                                />
                                            </div>

                                            <div className="form-control w-full mb-6">
                                                <label className="label">
                                                    <span className="label-text">Clave de sustitución (26 letras):</span>
                                                    <span className="label-text-alt">Cada letra representa la sustitución de A-Z</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                                    className="input input-bordered w-full"
                                                    value={substitutionKey}
                                                    onChange={(e) => {
                                                        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                                                        if (value.length <= 26) {
                                                            setSubstitutionKey(value);
                                                        }
                                                    }}
                                                    maxLength={26}
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt">Alfabeto original: ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
                                                </label>
                                            </div>

                                            <div className="bg-base-300 p-4 rounded-lg">
                                                <h3 className="font-bold mb-2">Resultado cifrado:</h3>
                                                <p className="font-mono text-lg">{substitutionResult || 'Ingresa un texto para ver el resultado'}</p>
                                            </div>

                                            <div className="alert alert-warning mt-6">
                                                <FiHelpCircle className="h-6 w-6" />
                                                <div>
                                                    <h3 className="font-bold">Consejo</h3>
                                                    <p className="text-sm">Para que un cifrado de sustitución sea válido, cada letra debe aparecer exactamente una vez en la clave. Todas las letras de A-Z deben estar presentes sin repeticiones.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'history' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Historia del Cifrado de Sustitución</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        Los cifrados de sustitución han sido utilizados por miles de años, con evidencia de su uso que data del antiguo Egipto. Sin embargo, fueron los árabes, particularmente Al-Kindi en el siglo IX, quienes avanzaron significativamente en su estudio y análisis.
                                                    </p>
                                                    <p className="mb-4">
                                                        Uno de los cifrados de sustitución más famosos fue el utilizado por María, Reina de Escocia, en el siglo XVI para comunicarse con sus aliados mientras estaba encarcelada. Desafortunadamente para ella, sus mensajes fueron interceptados y descifrados, lo que contribuyó a su ejecución.
                                                    </p>
                                                    <h3 className="text-xl font-bold mt-6 mb-2">Tipos de Cifrados de Sustitución</h3>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Tipo</th>
                                                                    <th>Descripción</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="font-bold">Monoalfabético</td>
                                                                    <td>Cada letra se sustituye consistentemente por otra letra o símbolo específico.</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="font-bold">Polialfabético</td>
                                                                    <td>Se utilizan múltiples alfabetos de sustitución. El cifrado Vigenère es un ejemplo.</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="font-bold">Homofónico</td>
                                                                    <td>Cada letra puede ser sustituida por varios posibles símbolos, con las letras más frecuentes teniendo más sustitutos.</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="font-bold">Poligráfico</td>
                                                                    <td>Se sustituyen grupos de letras en lugar de letras individuales.</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title">El Cifrado Atbash</h3>
                                                            <p className="mb-4">El Atbash es un antiguo cifrado de sustitución hebreo donde cada letra se reemplaza por su equivalente al recorrer el alfabeto en sentido inverso.</p>
                                                            <p>A se convierte en Z, B en Y, C en X, y así sucesivamente.</p>
                                                        </div>
                                                    </div>
                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title">¿Sabías que?</h3>
                                                            <p>El famoso "Disco Cifrador" de Leon Battista Alberti, creado en 1467, fue el primer sistema de cifrado polialfabético documentado. Esta invención marcó un avance significativo, ya que los cifrados polialfabéticos son mucho más resistentes al análisis de frecuencia.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-between mt-6">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleCipherChange('caesar')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: Cifrado César
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleCipherChange('vigenere')}
                                        >
                                            Siguiente: Cifrado Vigenère <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Vigenere Cipher Content */}
                        {currentCipher === 'vigenere' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Cifrado Vigenère</h2>
                                            <p className="mb-4">
                                                El cifrado Vigenère es un método de cifrado por sustitución polialfabética que utiliza una serie de diferentes cifrados César basados en las letras de una palabra clave. Fue descrito por primera vez por Giovan Battista Bellaso en 1553, pero incorrectamente atribuido más tarde a Blaise de Vigenère.
                                            </p>
                                            <h3 className="text-xl font-bold mt-6 mb-2">¿Cómo funciona?</h3>
                                            <p className="mb-4">
                                                El cifrado Vigenère utiliza una palabra o frase como clave. Cada letra de la clave determina qué alfabeto cifrado usar para cada letra del texto original:
                                            </p>
                                            <ol className="list-decimal list-inside mb-4 space-y-1">
                                                <li>Se elige una palabra clave (por ejemplo, "CLAVE")</li>
                                                <li>Se repite la palabra clave para que coincida con la longitud del mensaje</li>
                                                <li>Cada letra de la clave indica cuánto desplazar la letra correspondiente del mensaje</li>
                                                <li>Se aplica el desplazamiento según el valor de la letra de la clave (A=0, B=1, C=2...)</li>
                                            </ol>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table table-zebra w-full">
                                                    <tbody>
                                                        <tr>
                                                            <th>Mensaje:</th>
                                                            <td>H</td>
                                                            <td>O</td>
                                                            <td>L</td>
                                                            <td>A</td>
                                                            <td>M</td>
                                                            <td>U</td>
                                                            <td>N</td>
                                                            <td>D</td>
                                                            <td>O</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Clave:</th>
                                                            <td>C</td>
                                                            <td>L</td>
                                                            <td>A</td>
                                                            <td>V</td>
                                                            <td>E</td>
                                                            <td>C</td>
                                                            <td>L</td>
                                                            <td>A</td>
                                                            <td>V</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Desplazamiento:</th>
                                                            <td>2</td>
                                                            <td>11</td>
                                                            <td>0</td>
                                                            <td>21</td>
                                                            <td>4</td>
                                                            <td>2</td>
                                                            <td>11</td>
                                                            <td>0</td>
                                                            <td>21</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Resultado:</th>
                                                            <td>J</td>
                                                            <td>Z</td>
                                                            <td>L</td>
                                                            <td>V</td>
                                                            <td>Q</td>
                                                            <td>W</td>
                                                            <td>Y</td>
                                                            <td>D</td>
                                                            <td>J</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="alert alert-info shadow-lg mb-4">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <span>
                                                        La fórmula del cifrado Vigenère es: <strong>C = (P + K) mod 26</strong>, donde C es la letra cifrada, P es la letra original y K es la posición de la letra de la clave en el alfabeto.
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold mt-6 mb-2">Fortalezas y Debilidades</h3>
                                            <div className="overflow-x-auto">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Fortalezas</th>
                                                            <th>Debilidades</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Resistente al análisis de frecuencia simple</td>
                                                            <td>Vulnerable si se conoce la longitud de la clave</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Fácil de implementar y recordar</td>
                                                            <td>Susceptible al ataque de Kasiski y al análisis de coincidencia</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Mucho más seguro que los cifrados monoalfabéticos</td>
                                                            <td>Las claves cortas reducen significativamente su seguridad</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'interactive' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Práctica con Cifrado Vigenère</h2>
                                            <p className="mb-6">Ingresa un texto y una palabra clave para ver cómo funciona el cifrado Vigenère:</p>

                                            <div className="form-control w-full mb-4">
                                                <label className="label">
                                                    <span className="label-text">Texto a cifrar:</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Escribe algo..."
                                                    className="input input-bordered w-full"
                                                    value={vigenereText}
                                                    onChange={(e) => setVigenereText(e.target.value)}
                                                />
                                            </div>

                                            <div className="form-control w-full mb-6">
                                                <label className="label">
                                                    <span className="label-text">Palabra clave:</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="CLAVE"
                                                    className="input input-bordered w-full"
                                                    value={vigenereKey}
                                                    onChange={(e) => {
                                                        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                                                        setVigenereKey(value);
                                                    }}
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt">Solo letras (A-Z) sin espacios ni caracteres especiales</span>
                                                </label>
                                            </div>

                                            <div className="bg-base-300 p-4 rounded-lg">
                                                <h3 className="font-bold mb-2">Resultado cifrado:</h3>
                                                <p className="font-mono text-lg">{vigenereResult || 'Ingresa un texto para ver el resultado'}</p>
                                            </div>

                                            <div className="mt-6 p-4 border border-base-300 rounded-lg">
                                                <h3 className="font-bold mb-2">Ejemplo visual del cifrado:</h3>
                                                <div className="overflow-x-auto">
                                                    <table className="table table-xs">
                                                        <thead>
                                                            <tr>
                                                                <th></th>
                                                                {Array.from({ length: 26 }, (_, i) => (
                                                                    <th key={i}>{String.fromCharCode(65 + i)}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Array.from({ length: 5 }, (_, rowIndex) => (
                                                                <tr key={rowIndex}>
                                                                    <th>{rowIndex === 0 ? 'A' : rowIndex === 1 ? 'B' : rowIndex === 2 ? 'C' : rowIndex === 3 ? 'D' : 'E'}</th>
                                                                    {Array.from({ length: 26 }, (_, colIndex) => (
                                                                        <td key={colIndex} className={`text-xs ${colIndex === rowIndex ? 'bg-primary text-primary-content' : ''}`}>
                                                                            {String.fromCharCode(65 + ((colIndex + rowIndex) % 26))}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <p className="text-sm mt-2">La tabla muestra los primeros 5 alfabetos desplazados utilizados en el cifrado Vigenère. Cada fila representa un desplazamiento según la letra de la clave.</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'history' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Historia del Cifrado Vigenère</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        Aunque se le atribuye a Blaise de Vigenère, este cifrado fue realmente descrito por primera vez por Giovan Battista Bellaso en un libro publicado en 1553. La atribución errónea surgió en el siglo XIX por un malentendido histórico.
                                                    </p>
                                                    <p className="mb-4">
                                                        El cifrado Vigenère fue considerado imposible de romper durante más de 300 años, ganándose el apodo de "le chiffre indéchiffrable" (el cifrado indescifrable).
                                                    </p>
                                                    <p className="mb-4">
                                                        No fue hasta mediados del siglo XIX que Friedrich Kasiski publicó un método general para descifrar los mensajes Vigenère, seguido por el trabajo de Charles Babbage, quien había desarrollado una técnica similar unos años antes pero no la había publicado.
                                                    </p>
                                                    <h3 className="text-xl font-bold mt-6 mb-2">Línea de Tiempo</h3>
                                                    <ul className="timeline timeline-vertical">
                                                        <li>
                                                            <div className="timeline-start">1553</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">Giovan Battista Bellaso publica el primer método de cifrado Vigenère</div>
                                                            <hr />
                                                        </li>
                                                        <li>
                                                            <hr />
                                                            <div className="timeline-start">1586</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">Blaise de Vigenère publica su propio tratado de cifrado, pero más fuerte que el que lleva su nombre</div>
                                                            <hr />
                                                        </li>
                                                        <li>
                                                            <hr />
                                                            <div className="timeline-start">1800s</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">El cifrado gana popularidad y se considera indescifrable</div>
                                                            <hr />
                                                        </li>
                                                        <li>
                                                            <hr />
                                                            <div className="timeline-start">1863</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">Friedrich Kasiski publica un método general para romper el cifrado Vigenère</div>
                                                            <hr />
                                                        </li>
                                                        <li>
                                                            <hr />
                                                            <div className="timeline-start">1854-1863</div>
                                                            <div className="timeline-middle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" /></svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">Charles Babbage desarrolla un método similar para romper Vigenère, pero no lo publica</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title">La Tabla de Vigenère</h3>
                                                            <p className="mb-4">La herramienta clásica para implementar este cifrado es la Tabla de Vigenère, un cuadrado de 26×26 con alfabetos desplazados.</p>
                                                            <p>Para cifrar, se encuentra la intersección de la fila (letra de la clave) y la columna (letra del mensaje) en la tabla.</p>
                                                        </div>
                                                    </div>
                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title">¿Sabías que?</h3>
                                                            <p>Durante la Guerra Civil Americana, el cifrado Vigenère fue utilizado por los Confederados. Sin embargo, su uso no fue siempre efectivo debido a errores operativos y mensajes demasiado cortos.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-between mt-6">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleCipherChange('substitution')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: Sustitución
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleCipherChange('transposition')}
                                        >
                                            Siguiente: Transposición <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transposition Cipher Content */}
                        {currentCipher === 'transposition' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Cifrado de Transposición</h2>
                                            <p className="mb-4">
                                                A diferencia de los cifrados de sustitución que reemplazan caracteres, los cifrados de transposición reorganizan los caracteres del mensaje original sin cambiar su identidad. Como resultado, todas las letras originales están presentes en el mensaje cifrado, pero en un orden diferente.
                                            </p>
                                            <h3 className="text-xl font-bold mt-6 mb-2">¿Cómo funciona?</h3>
                                            <p className="mb-4">
                                                En el cifrado de transposición por columnas (uno de los más comunes), el texto se escribe en filas de una longitud predeterminada y luego se lee por columnas, siguiendo un orden específico determinado por la clave:
                                            </p>
                                            <ol className="list-decimal list-inside mb-4 space-y-1">
                                                <li>Se elige un número de columnas (la clave)</li>
                                                <li>Se escribe el mensaje en filas de esa longitud</li>
                                                <li>Se lee el texto columna por columna</li>
                                            </ol>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table table-zebra w-full">
                                                    <caption className="caption-top">Ejemplo: Mensaje "HOLA MUNDO SECRETO" con clave 4 (columnas)</caption>
                                                    <tbody>
                                                        <tr>
                                                            <td className="border">H</td>
                                                            <td className="border">O</td>
                                                            <td className="border">L</td>
                                                            <td className="border">A</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border">M</td>
                                                            <td className="border">U</td>
                                                            <td className="border">N</td>
                                                            <td className="border">D</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border">O</td>
                                                            <td className="border">S</td>
                                                            <td className="border">E</td>
                                                            <td className="border">C</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border">R</td>
                                                            <td className="border">E</td>
                                                            <td className="border">T</td>
                                                            <td className="border">O</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="mb-4">Leyendo por columnas, el mensaje cifrado sería: "HMOR OUSE LNET ADCO"</p>
                                            <div className="alert alert-info shadow-lg mb-4">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <span>
                                                        El cifrado de transposición puede hacerse más complejo utilizando permutaciones de columnas según una palabra clave. Por ejemplo, clave "CAVE" = orden de lectura 1,4,3,2.
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold mt-6 mb-2">Fortalezas y Debilidades</h3>
                                            <div className="overflow-x-auto">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Fortalezas</th>
                                                            <th>Debilidades</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Completamente inmune al análisis de frecuencia de letras individuales</td>
                                                            <td>Vulnerable al análisis de pares de letras (bigramas) y trigramas</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Se puede aplicar varias veces para aumentar la seguridad</td>
                                                            <td>Las palabras cortas pueden seguir siendo reconocibles</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Puede combinarse con cifrados de sustitución</td>
                                                            <td>Si se conoce o se adivina el idioma y la longitud de la clave, puede ser atacado</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'interactive' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Práctica con Cifrado de Transposición</h2>
                                            <p className="mb-6">Ingresa un texto y el número de columnas para ver cómo funciona el cifrado de transposición:</p>

                                            <div className="form-control w-full mb-4">
                                                <label className="label">
                                                    <span className="label-text">Texto a cifrar:</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Escribe algo..."
                                                    className="input input-bordered w-full"
                                                    value={transpositionText}
                                                    onChange={(e) => setTranspositionText(e.target.value)}
                                                />
                                            </div>

                                            <div className="form-control w-full mb-6">
                                                <label className="label">
                                                    <span className="label-text">Número de columnas:</span>
                                                    <span className="label-text-alt">Valor actual: {transpositionKey}</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="2"
                                                    max="10"
                                                    value={transpositionKey}
                                                    onChange={(e) => setTranspositionKey(Number(e.target.value))}
                                                    className="range range-primary"
                                                />
                                                <div className="w-full flex justify-between text-xs px-2 mt-2">
                                                    <span>2</span>
                                                    <span>3</span>
                                                    <span>4</span>
                                                    <span>5</span>
                                                    <span>6</span>
                                                    <span>7</span>
                                                    <span>8</span>
                                                    <span>9</span>
                                                    <span>10</span>
                                                </div>
                                            </div>

                                            <div className="bg-base-300 p-4 rounded-lg">
                                                <h3 className="font-bold mb-2">Resultado cifrado:</h3>
                                                <p className="font-mono text-lg">{transpositionResult || 'Ingresa un texto para ver el resultado'}</p>
                                            </div>

                                            <div className="mt-6 p-4 border border-base-300 rounded-lg">
                                                <h3 className="font-bold mb-2">Visualización de la transposición:</h3>

                                                {transpositionText && (
                                                    <div className="overflow-x-auto">
                                                        <table className="table table-xs mt-2">
                                                            <caption className="caption-top">Matriz de transposición</caption>
                                                            <tbody>
                                                                {(() => {
                                                                    const cleanText = transpositionText.replace(/\s/g, '').toUpperCase();
                                                                    const rows = [];
                                                                    for (let i = 0; i < cleanText.length; i += transpositionKey) {
                                                                        const row = [];
                                                                        for (let j = 0; j < transpositionKey; j++) {
                                                                            if (i + j < cleanText.length) {
                                                                                row.push(cleanText[i + j]);
                                                                            } else {
                                                                                row.push('');
                                                                            }
                                                                        }
                                                                        rows.push(row);
                                                                    }

                                                                    return rows.map((row, rowIndex) => (
                                                                        <tr key={rowIndex}>
                                                                            {row.map((cell, cellIndex) => (
                                                                                <td key={cellIndex} className="border text-center">{cell}</td>
                                                                            ))}
                                                                        </tr>
                                                                    ));
                                                                })()}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                <p className="text-sm mt-4">
                                                    Para descifrar, reconstruye la matriz colocando el texto cifrado en columnas, y luego lee por filas.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'history' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Historia del Cifrado de Transposición</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        Los cifrados de transposición tienen una historia que se remonta a la antigua Grecia. Uno de los primeros dispositivos de este tipo fue la "Escítala", utilizada por los espartanos alrededor del siglo V a.C. para comunicaciones militares.
                                                    </p>
                                                    <p className="mb-4">
                                                        La Escítala consistía en un bastón de un diámetro específico alrededor del cual se enrollaba una tira de pergamino. Se escribía el mensaje a lo largo del bastón y luego se desenrollaba. La tira de pergamino contenía letras aparentemente aleatorias que solo podían leerse correctamente al enrollarla alrededor de un bastón del mismo diámetro.
                                                    </p>
                                                    <h3 className="text-xl font-bold mt-6 mb-2">Tipos de Cifrados de Transposición</h3>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Tipo</th>
                                                                    <th>Descripción</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="font-bold">Transposición por Columnas</td>
                                                                    <td>El mensaje se escribe en filas y se lee por columnas, a veces reordenadas según una clave.</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="font-bold">Rail Fence (Zig-zag)</td>
                                                                    <td>El texto se escribe en patrón diagonal, formando "raíles" de una valla, y luego se lee por filas.</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="font-bold">Transposición por Rutas</td>
                                                                    <td>El texto se coloca en una cuadrícula y se lee siguiendo una ruta específica (espiral, etc.).</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="font-bold">Rejilla Giratoria</td>
                                                                    <td>Utiliza una plantilla con agujeros que se rota sobre el mensaje para revelar solo ciertas letras en cada posición.</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title">La Escítala Espartana</h3>
                                                            <figure className="my-4">
                                                                <div className="h-32 bg-base-300 flex items-center justify-center rounded-lg">
                                                                    {/* Aquí iría una imagen de la Escítala */}
                                                                    <p className="text-center">Ilustración de la Escítala</p>
                                                                </div>
                                                            </figure>
                                                            <p>Este simple dispositivo es considerado uno de los primeros sistemas criptográficos de transposición de la historia.</p>
                                                        </div>
                                                    </div>
                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title">¿Sabías que?</h3>
                                                            <p>Durante la Primera Guerra Mundial, los alemanes utilizaron un cifrado de doble transposición que resultó muy difícil de romper sin conocer la clave exacta. Este sistema inspiró desarrollos posteriores en criptografía.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-between mt-6">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleCipherChange('vigenere')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: Vigenère
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleStartQuiz}
                                        >
                                            Comenzar Evaluación <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Quiz Stage */}
                {stage === 'quiz' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="card bg-base-200 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb-6">Evaluación de Conocimientos</h2>
                                <p className="mb-6">Responde correctamente todas las preguntas para avanzar al siguiente nivel. Puedes intentarlo tantas veces como necesites.</p>

                                {quizSubmitted && (
                                    <div className={`alert ${quizPassed ? 'alert-success' : 'alert-error'} mb-6`}>
                                        <div>
                                            {quizPassed ? <FiCheckCircle className="w-6 h-6" /> : <FiX className="w-6 h-6" />}
                                            <span>
                                                {quizPassed
                                                    ? '¡Felicidades! Has respondido correctamente todas las preguntas.'
                                                    : 'Algunas respuestas son incorrectas. Por favor, revisa tus respuestas e intenta de nuevo.'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    {questions.map((question) => (
                                        <div key={question.id} className="card bg-base-100 shadow-md">
                                            <div className="card-body">
                                                <h3 className="text-lg font-bold mb-4">{question.id}. {question.question}</h3>
                                                <div className="space-y-2">
                                                    {question.options.map((option, index) => (
                                                        <div key={index} className="form-control">
                                                            <label className="label cursor-pointer justify-start gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${question.id}`}
                                                                    className="radio radio-primary"
                                                                    checked={question.userAnswer === option}
                                                                    onChange={() => handleAnswerQuestion(question.id, option)}
                                                                    disabled={quizSubmitted && quizPassed}
                                                                />
                                                                <span className="label-text">{option}</span>
                                                                {quizSubmitted && (
                                                                    option === question.correctAnswer ? (
                                                                        <FiCheckCircle className="text-success ml-2" />
                                                                    ) : question.userAnswer === option ? (
                                                                        <FiX className="text-error ml-2" />
                                                                    ) : null
                                                                )}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                                {quizSubmitted && question.userAnswer !== question.correctAnswer && (
                                                    <div className="mt-4 text-sm text-error">
                                                        La respuesta correcta es: {question.correctAnswer}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="card-actions justify-end mt-8">
                                    {quizSubmitted && !quizPassed ? (
                                        <button
                                            className="btn btn-outline"
                                            onClick={handleResetQuiz}
                                        >
                                            Intentar de nuevo
                                        </button>
                                    ) : !quizSubmitted ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleSubmitQuiz}
                                            disabled={questionsAnswered.length < questions.length}
                                        >
                                            Enviar respuestas
                                        </button>
                                    ) : (
                                        <div className="text-success font-bold flex items-center">
                                            <FiCheckCircle className="mr-2" /> Avanzando al siguiente nivel...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Challenge Stage */}
                {stage === 'practical' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="card bg-base-200 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb-6">Ejercicio Práctico: Implementación de Cifrado Simétrico</h2>

                                {practicalCompleted ? (
                                    <div className="alert alert-success mb-6">
                                        <FiCheckCircle className="w-6 h-6" />
                                        <span>¡Excelente trabajo! Tu implementación ha pasado todas las pruebas.</span>
                                    </div>
                                ) : (
                                    <p className="mb-6">
                                        En este ejercicio, implementarás un cifrador simétrico básico utilizando uno de los algoritmos que hemos estudiado.
                                        Sigue las instrucciones y completa el código requerido.
                                    </p>
                                )}

                                <div className="flex justify-between mt-8">
                                    <div>
                                        <button className="btn btn-outline" onClick={() => setStage('quiz')}>
                                            <FiArrowRight className="mr-2 rotate-180" /> Volver al cuestionario
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="btn btn-accent">
                                            <FiCode className="mr-2" /> Ejecutar pruebas
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleSubmitPractical}
                                        >
                                            Enviar solución <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Completion Stage */}
                {stage === 'completed' && (
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            className="card bg-base-200 shadow-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="card-body text-center">
                                <div className="py-6">
                                    <motion.div
                                        className="text-9xl mb-4 text-success mx-auto"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: 360 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <FiAward className="mx-auto" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Criptografía Clásica</h2>
                                    <p className="text-lg mb-6">Has dominado los fundamentos de los cifrados históricos y has aprendido valiosas lecciones sobre la evolución de la criptografía.</p>

                                    <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                                                <FiKey className="h-5 w-5" />
                                                Maestro de Cifrados Clásicos
                                            </div>
                                        </div>
                                        <p>Has demostrado conocimiento y habilidad en la aplicación de técnicas de cifrado tradicionales.</p>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4">¿Qué has aprendido?</h3>
                                    <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 space-y-2">
                                        <li>Funcionamiento del cifrado César y sus limitaciones</li>
                                        <li>Implementación de cifrados de sustitución y sus fortalezas</li>
                                        <li>Uso de cifrados polialfabéticos como Vigenère</li>
                                        <li>Transposición como alternativa a la sustitución</li>
                                        <li>Análisis de la seguridad de diferentes técnicas clásicas</li>
                                    </ul>

                                    <div className="alert alert-info shadow-lg mb-6 text-left">
                                        <div>
                                            <FiHelpCircle className="w-6 h-6" />
                                            <div>
                                                <h3 className="font-bold">Próximos pasos</h3>
                                                <p>¿Listo para explorar más? Te recomendamos continuar con el módulo "Criptografía Moderna" para aprender sobre cifrados de clave simétrica, asimétrica y funciones hash.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={handleReturnToDashboard}
                                        >
                                            Volver al Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-base-200 text-center py-4 border-t border-base-300">
                <p>© 2025 CryptoPlayground</p>
            </footer>
        </div>
    );
}