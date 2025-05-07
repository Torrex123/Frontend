"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiLock,
    FiCheck,
    FiArrowRight,
    FiAward,
    FiBookOpen,
    FiFileText,
    FiKey,
    FiShield,
    FiGlobe,
    FiHelpCircle,
    FiCheckCircle,
    FiX,
    FiUser,
    FiServer,
    FiCode,
    FiClock,
    FiZap,
    FiDatabase,
    FiRefreshCw,
    FiCpu,
    FiBox,
    FiLayers,
    FiSmartphone,
    FiCreditCard,
    FiAlertTriangle
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

// Types for our application
type CipherType = 'aes' | 'chacha' | 'salsa';
type ProgressStage = 'learning' | 'quiz' | 'practical' | 'completed';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

export default function SymmetricCryptography() {
    // State management
    const [currentCipher, setCurrentCipher] = useState<CipherType>('aes');
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
            question: "¿Cuál es la característica principal de la criptografía simétrica?",
            options: [
                "Usa diferentes claves para cifrar y descifrar",
                "Usa la misma clave para cifrar y descifrar",
                "No requiere claves",
                "Es inmune a todos los ataques"
            ],
            correctAnswer: "Usa la misma clave para cifrar y descifrar"
        },
        {
            id: 2,
            question: "¿Cuál de los siguientes NO es un modo de operación en AES?",
            options: [
                "CBC (Cipher Block Chaining)",
                "ECB (Electronic Codebook)",
                "CTR (Counter)",
                "RSA (Rivest-Shamir-Adleman)"
            ],
            correctAnswer: "RSA (Rivest-Shamir-Adleman)"
        },
        {
            id: 3,
            question: "ChaCha20 y Salsa20 son ejemplos de:",
            options: [
                "Cifrados de bloque",
                "Cifrados de flujo",
                "Funciones hash",
                "Algoritmos de clave pública"
            ],
            correctAnswer: "Cifrados de flujo"
        },
        {
            id: 4,
            question: "¿Qué ventaja principal ofrece ChaCha20 respecto a AES en dispositivos sin aceleración por hardware?",
            options: [
                "Mayor seguridad criptográfica",
                "Mejor rendimiento en software",
                "Claves más cortas",
                "Soporte para firmas digitales"
            ],
            correctAnswer: "Mejor rendimiento en software"
        },
        {
            id: 5,
            question: "¿Cuál de los siguientes tamaños de clave NO es estándar en AES?",
            options: [
                "128 bits",
                "192 bits",
                "256 bits",
                "512 bits"
            ],
            correctAnswer: "512 bits"
        }
    ]);

    // Update progress based on current cipher and stage
    useEffect(() => {
        let newProgress = 0;

        // Base progress on current cipher
        if (currentCipher === 'aes') newProgress = 0;
        else if (currentCipher === 'chacha') newProgress = 25;
        else if (currentCipher === 'salsa') newProgress = 50;

        // Adjust based on stage
        if (stage === 'quiz') newProgress = 75;
        else if (stage === 'practical') newProgress = 90;
        else if (stage === 'completed') newProgress = 100;

        setProgress(newProgress);
    }, [currentCipher, stage]);

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

    return (
        <div className="min-h-screen flex flex-col bg-base-100">
            {/* Module Header */}
            <header className="bg-base-200 py-6 shadow-md">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center">Criptografía Simétrica</h1>

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
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentCipher === 'aes' ? 'border-primary bg-primary text-primary-content' : progress >= 25 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiBox className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">AES</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 25 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentCipher === 'chacha' ? 'border-primary bg-primary text-primary-content' : progress >= 50 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiRefreshCw className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">ChaCha</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 50 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentCipher === 'salsa' ? 'border-primary bg-primary text-primary-content' : progress >= 75 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiZap className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Salsa</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 75 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${stage === 'quiz' ? 'border-primary bg-primary text-primary-content' : progress >= 90 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiFileText className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Evaluación</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 90 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${stage === 'completed' ? 'border-success bg-success text-success-content' : stage === 'practical' ? 'border-primary bg-primary text-primary-content' : 'border-base-300 bg-base-100'}`}>
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
                                className={`tab ${currentCipher === 'aes' ? 'tab-active' : ''}`}
                                onClick={() => handleCipherChange('aes')}
                            >
                                AES
                            </button>
                            <button
                                className={`tab ${currentCipher === 'chacha' ? 'tab-active' : ''}`}
                                onClick={() => handleCipherChange('chacha')}
                            >
                                ChaCha20
                            </button>
                            <button
                                className={`tab ${currentCipher === 'salsa' ? 'tab-active' : ''}`}
                                onClick={() => handleCipherChange('salsa')}
                            >
                                Salsa20
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
                                className={`tab tab-bordered ${activeTab === 'technical' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('technical')}
                            >
                                Detalles Técnicos
                            </button>
                            <button
                                className={`tab tab-bordered ${activeTab === 'applications' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('applications')}
                            >
                                Aplicaciones
                            </button>
                        </div>

                        {/* AES Cipher Content */}
                        {currentCipher === 'aes' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Advanced Encryption Standard (AES)</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        El Advanced Encryption Standard (AES) es uno de los algoritmos de cifrado simétrico más utilizados y seguros en la actualidad.
                                                        Fue seleccionado por el Instituto Nacional de Estándares y Tecnología (NIST) de Estados Unidos en 2001
                                                        tras un concurso de 5 años para reemplazar al envejecido estándar DES.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Es un cifrado de bloque que opera sobre bloques de datos de 128 bits</li>
                                                        <li>Admite claves de 128, 192 y 256 bits</li>
                                                        <li>Está basado en el algoritmo Rijndael, desarrollado por Vincent Rijmen y Joan Daemen</li>
                                                        <li>Es de dominio público y puede ser utilizado libremente</li>
                                                        <li>Ofrece un buen equilibrio entre seguridad, rendimiento, eficiencia y flexibilidad</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Importancia y Adopción</h3>
                                                    <p className="mb-4">
                                                        AES se ha convertido en el estándar mundial para el cifrado simétrico y es utilizado en numerosas aplicaciones:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Protección de comunicaciones en protocolos como TLS/SSL</li>
                                                        <li>Cifrado de archivos y discos</li>
                                                        <li>Seguridad en redes WiFi (WPA2, WPA3)</li>
                                                        <li>Protección de datos financieros</li>
                                                        <li>Sistemas de mensajería segura</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiHelpCircle className="text-primary" />
                                                                ¿Por qué AES?
                                                            </h3>
                                                            <p className="mb-4">
                                                                AES fue seleccionado por el NIST tras un riguroso proceso de evaluación que consideró:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Seguridad criptográfica</li>
                                                                <li>Eficiencia en diversas plataformas</li>
                                                                <li>Requisitos de memoria</li>
                                                                <li>Simplicidad de diseño</li>
                                                                <li>Flexibilidad</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiCpu className="text-secondary" />
                                                                Aceleración por Hardware
                                                            </h3>
                                                            <p className="text-sm">
                                                                Una de las ventajas de AES es que cuenta con instrucciones específicas en la mayoría de los procesadores modernos (Intel AES-NI, ARM Cryptography Extensions), lo que acelera significativamente su ejecución. Esto lo hace ideal para aplicaciones que requieren alto rendimiento.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de AES</h2>

                                            <h3 className="text-xl font-bold mb-3">Estructura y Funcionamiento</h3>
                                            <p className="mb-4">
                                                AES es un cifrado de bloque que utiliza una red de sustitución-permutación (SPN) y trabaja con bloques de 128 bits,
                                                organizados como una matriz de 4×4 bytes llamada "estado" (state).
                                            </p>

                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Variante</th>
                                                            <th>Tamaño de clave</th>
                                                            <th>Rondas</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>AES-128</td>
                                                            <td>128 bits (16 bytes)</td>
                                                            <td>10</td>
                                                        </tr>
                                                        <tr>
                                                            <td>AES-192</td>
                                                            <td>192 bits (24 bytes)</td>
                                                            <td>12</td>
                                                        </tr>
                                                        <tr>
                                                            <td>AES-256</td>
                                                            <td>256 bits (32 bytes)</td>
                                                            <td>14</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Transformaciones por Ronda</h3>
                                            <p className="mb-4">
                                                Cada ronda en AES consiste en una serie de transformaciones:
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div className="card bg-base-100 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <h4 className="card-title text-base">SubBytes</h4>
                                                        <p className="text-sm">
                                                            Sustitución no lineal donde cada byte se reemplaza según una tabla predefinida (S-box).
                                                            Proporciona confusión y dificulta los ataques de criptoanálisis.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <h4 className="card-title text-base">ShiftRows</h4>
                                                        <p className="text-sm">
                                                            Operación de transposición donde cada fila del estado se desplaza cíclicamente un número específico de posiciones.
                                                            Proporciona difusión entre columnas.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <h4 className="card-title text-base">MixColumns</h4>
                                                        <p className="text-sm">
                                                            Transformación lineal que mezcla los bytes de cada columna mediante multiplicación matricial en GF(2^8).
                                                            Proporciona difusión entre filas.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <h4 className="card-title text-base">AddRoundKey</h4>
                                                        <p className="text-sm">
                                                            Combinación del estado con la subclave de ronda mediante operación XOR.
                                                            Integra la clave en el proceso de cifrado.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Modos de Operación</h3>
                                            <p className="mb-4">
                                                AES es un cifrado de bloque, pero para cifrar datos de longitud variable, se utilizan diferentes "modos de operación":
                                            </p>

                                            <div className="overflow-x-auto">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Modo</th>
                                                            <th>Descripción</th>
                                                            <th>Usos Recomendados</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>ECB (Electronic Codebook)</td>
                                                            <td>Cada bloque se cifra independientemente</td>
                                                            <td>No recomendado para la mayoría de aplicaciones (vulnerable a análisis de patrones)</td>
                                                        </tr>
                                                        <tr>
                                                            <td>CBC (Cipher Block Chaining)</td>
                                                            <td>Cada bloque se combina con el bloque cifrado anterior</td>
                                                            <td>Aplicaciones que no requieren paralelismo</td>
                                                        </tr>
                                                        <tr>
                                                            <td>CTR (Counter)</td>
                                                            <td>Convierte el cifrado de bloque en un cifrado de flujo usando un contador</td>
                                                            <td>Ideal para aplicaciones que requieren paralelismo y acceso aleatorio</td>
                                                        </tr>
                                                        <tr>
                                                            <td>GCM (Galois/Counter Mode)</td>
                                                            <td>Combina el modo CTR con autenticación</td>
                                                            <td>Comunicaciones seguras (TLS), aplicaciones que requieren integridad y confidencialidad</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de AES</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Entornos de Alta Seguridad</h3>
                                                    <div className="card bg-base-100 shadow-md">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiShield className="mr-2 text-primary" />
                                                                Sectores Gubernamentales
                                                            </h4>
                                                            <p>
                                                                AES es aprobado por la NSA para información clasificada hasta nivel TOP SECRET cuando se implementa con claves de 256 bits. Es utilizado por agencias gubernamentales en todo el mundo para proteger información sensible.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Comunicaciones Seguras</h3>
                                                    <div className="card bg-base-100 shadow-md">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiGlobe className="mr-2 text-secondary" />
                                                                Protocolos de Internet
                                                            </h4>
                                                            <p>
                                                                AES es fundamental en protocolos como TLS/SSL para HTTPS, asegurando la navegación web, correo electrónico, mensajería y aplicaciones en la nube. Es la base de la seguridad en comunicaciones VPN y redes WiFi (WPA2/WPA3).
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Almacenamiento de Datos</h3>
                                                    <div className="card bg-base-100 shadow-md">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiDatabase className="mr-2 text-accent" />
                                                                Cifrado de Disco y Archivos
                                                            </h4>
                                                            <p>
                                                                Sistemas como BitLocker, FileVault, LUKS, y VeraCrypt utilizan AES para el cifrado de disco completo. Bases de datos y sistemas de archivos cifrados también implementan AES para proteger información sensible en reposo.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Industria Financiera</h3>
                                                    <div className="card bg-base-100 shadow-md">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiCreditCard className="mr-2 text-info" />
                                                                Transacciones Bancarias
                                                            </h4>
                                                            <p>
                                                                AES es esencial en la protección de transacciones financieras, datos de tarjetas de crédito (cumplimiento PCI DSS), sistemas bancarios en línea y cajeros automáticos, asegurando la integridad y confidencialidad de la información financiera.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card bg-base-100 shadow-lg mb-6">
                                                <div className="card-body">
                                                    <h3 className="card-title">
                                                        <FiCpu className="text-primary mr-2" />
                                                        Implementaciones de Hardware
                                                    </h3>
                                                    <p className="mb-4">
                                                        AES ha sido implementado en hardware especializado para optimizar su rendimiento:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">Intel AES-NI:</span> Conjunto de instrucciones que aceleran AES en procesadores Intel</li>
                                                        <li><span className="font-medium">ARM Cryptography Extensions:</span> Soporte para AES en dispositivos móviles</li>
                                                        <li><span className="font-medium">Tarjetas criptográficas:</span> Hardware especializado para operaciones de cifrado</li>
                                                        <li><span className="font-medium">SoC (System on Chip):</span> Implementaciones eficientes en dispositivos IoT</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Consideraciones prácticas</h3>
                                                        <div className="text-sm">
                                                            A pesar de su seguridad, la implementación correcta de AES es crucial. Errores comunes incluyen: reutilización de vectores de inicialización, manejo inseguro de claves, uso del modo ECB, o falta de autenticación. Se recomienda utilizar bibliotecas criptográficas probadas en lugar de implementaciones propias.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-6">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleCipherChange('chacha')}
                                        >
                                            Siguiente: ChaCha20 <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ChaCha Cipher Content */}
                        {currentCipher === 'chacha' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">ChaCha20</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        ChaCha20 es un cifrado de flujo moderno diseñado por Daniel J. Bernstein en 2008 como una evolución de su cifrado Salsa20.
                                                        Ha ganado amplia adopción debido a su excelente rendimiento en software y su seguridad robusta.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Cifrado de flujo con clave de 256 bits</li>
                                                        <li>Utiliza un nonce de 96 bits (12 bytes) y un contador de 32 bits</li>
                                                        <li>Basado en operaciones ARX (adición, rotación, XOR) - simples y eficientes</li>
                                                        <li>No requiere tablas de búsqueda, lo que evita ataques de timing basados en caché</li>
                                                        <li>Altamente paralelizable y resistente a criptoanálisis conocido</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Importancia y Adopción</h3>
                                                    <p className="mb-4">
                                                        ChaCha20 ha sido adoptado en diversos contextos por su combinación de seguridad y eficiencia:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>El protocolo TLS 1.3 como alternativa a AES para dispositivos sin aceleración por hardware</li>
                                                        <li>OpenSSH y otras implementaciones de SSH</li>
                                                        <li>WireGuard VPN</li>
                                                        <li>Aplicaciones y bibliotecas como libsodium</li>
                                                        <li>Sistemas Android para cifrado de datos</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiZap className="text-primary" />
                                                                Ventajas frente a AES
                                                            </h3>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Rendimiento superior en software, especialmente en dispositivos sin aceleración por hardware</li>
                                                                <li>Diseño más simple y fácil de implementar correctamente</li>
                                                                <li>Mejor resistencia a ataques de canal lateral (timing)</li>
                                                                <li>Mayor flexibilidad en entornos de recursos limitados</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiLock className="text-secondary" />
                                                                ChaCha20-Poly1305
                                                            </h3>
                                                            <p className="text-sm">
                                                                ChaCha20 se combina frecuentemente con el algoritmo de autenticación Poly1305 (también diseñado por Bernstein) para crear un cifrado autenticado (AEAD). Esta combinación proporciona tanto confidencialidad como integridad/autenticidad de los datos.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de ChaCha20</h2>

                                            <h3 className="text-xl font-bold mb-3">Estructura y Funcionamiento</h3>
                                            <p className="mb-4">
                                                ChaCha20 es un cifrado de flujo que genera un flujo de bits pseudoaleatorio (keystream) que se combina con el texto plano mediante XOR.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Estado Interno</h4>
                                                        <p>
                                                            El algoritmo opera sobre un estado de 512 bits organizado como una matriz 4×4 de palabras de 32 bits.
                                                            El estado se inicializa con:
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm mt-2">
                                                            <li>Constantes fijas (4 palabras)</li>
                                                            <li>Clave de 256 bits (8 palabras)</li>
                                                            <li>Contador de 32 bits (1 palabra)</li>
                                                            <li>Nonce de 96 bits (3 palabras)</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Función de Cuarto de Ronda</h4>
                                                        <p>
                                                            La operación central en ChaCha20 es la función de cuarto de ronda que modifica el estado interno:
                                                        </p>
                                                        <pre className="bg-base-300 p-2 rounded-md text-sm mt-2 overflow-x-auto">
                                                            a += b; d ^= a; d &lt;&lt;= 16;<br />
                                                            c += d; b ^= c; b &lt;&lt;= 12;<br />
                                                            a += b; d ^= a; d &lt;&lt;= 8;<br />
                                                            c += d; b ^= c; b &lt;&lt;= 7;
                                                        </pre>
                                                        <p className="text-sm mt-2">
                                                            Donde +, ^, y &lt;&lt;= representan adición modular 2³², XOR y rotación de bits a la izquierda.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Proceso de Cifrado</h3>
                                            <ol className="list-decimal list-inside space-y-2 mb-6">
                                                <li>Se inicializa el estado con la clave, contador y nonce</li>
                                                <li>Se aplican 20 rondas (10 rondas de columna y 10 rondas de diagonal) para mezclar el estado</li>
                                                <li>Se suma el estado original al estado mezclado</li>
                                                <li>El resultado se utiliza como keystream y se combina mediante XOR con el texto plano</li>
                                                <li>Para cifrar más datos, se incrementa el contador y se repite el proceso</li>
                                            </ol>

                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Parámetro</th>
                                                            <th>Tamaño</th>
                                                            <th>Propósito</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Clave</td>
                                                            <td>256 bits (32 bytes)</td>
                                                            <td>Secreto compartido entre emisor y receptor</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Nonce</td>
                                                            <td>96 bits (12 bytes)</td>
                                                            <td>Número usado una vez; debe ser único para cada mensaje con la misma clave</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Contador</td>
                                                            <td>32 bits (4 bytes)</td>
                                                            <td>Permite generar múltiples bloques de keystream (hasta 2³²)</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">ChaCha20-Poly1305 (AEAD)</h3>
                                            <p className="mb-4">
                                                Para proporcionar autenticación además de confidencialidad, ChaCha20 se combina frecuentemente con el algoritmo Poly1305:
                                            </p>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">Funcionamiento del AEAD</h4>
                                                    <ol className="list-decimal list-inside text-sm space-y-1">
                                                        <li>ChaCha20 genera un keystream para cifrar el mensaje</li>
                                                        <li>La misma clave y nonce, con manipulación adecuada, se utilizan para generar una clave única para Poly1305</li>
                                                        <li>Poly1305 calcula un código de autenticación (MAC) sobre el texto cifrado y datos adicionales autenticados (AAD)</li>
                                                        <li>El MAC se adjunta al mensaje cifrado</li>
                                                        <li>El receptor verifica el MAC antes de intentar descifrar, lo que protege contra manipulación</li>
                                                    </ol>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Consideraciones de Seguridad</h3>
                                                        <div className="text-sm">
                                                            Como todo cifrado de flujo, ChaCha20 requiere que cada nonce sea único para cada mensaje cifrado con la misma clave.
                                                            La reutilización de nonce compromete gravemente la seguridad y puede llevar a la recuperación del texto plano.
                                                            Por esta razón, muchas implementaciones utilizan un contador o valor aleatorio para el nonce.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de ChaCha20</h2>

                                            <h3 className="text-xl font-bold mb-3">Protocolos de Internet</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-lg flex items-center">
                                                        <FiGlobe className="mr-2 text-primary" />
                                                        TLS y HTTPS
                                                    </h4>
                                                    <p className="mb-3">
                                                        ChaCha20-Poly1305 es un cifrado oficial para TLS 1.3 (RFC 8446) y TLS 1.2 (RFC 7905). Es particularmente valioso para:
                                                    </p>
                                                    <ul className="list-disc list-inside">
                                                        <li>Dispositivos móviles sin aceleración AES por hardware</li>
                                                        <li>Servidores web de alto rendimiento</li>
                                                        <li>Entornos con restricciones de recursos</li>
                                                    </ul>
                                                    <p className="mt-3 text-sm">
                                                        Los navegadores modernos como Chrome, Firefox, Safari y Edge admiten ChaCha20-Poly1305 y lo priorizan en dispositivos sin aceleración AES.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Redes Privadas Virtuales</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiShield className="mr-2 text-secondary" />
                                                                WireGuard y OpenVPN
                                                            </h4>
                                                            <p>
                                                                WireGuard, un innovador protocolo VPN, utiliza ChaCha20-Poly1305 como su único cifrado. OpenVPN también ofrece soporte para ChaCha20-Poly1305.
                                                                Este cifrado proporciona excelente rendimiento en dispositivos de todos los tipos, desde routers pequeños hasta servidores potentes.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Comunicaciones Seguras</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiLock className="mr-2 text-accent" />
                                                                SSH y Mensajería
                                                            </h4>
                                                            <p>
                                                                OpenSSH incluye ChaCha20-Poly1305 como cifrado preferido. Aplicaciones de mensajería segura como Signal y elementos de Matrix/Element
                                                                implementan ChaCha20-Poly1305 para cifrado de mensajes, especialmente en dispositivos móviles donde ofrece ventajas de rendimiento y energía.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Sistemas Operativos y Plataformas</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiSmartphone className="mr-2 text-info" />
                                                                Android
                                                            </h4>
                                                            <p className="text-sm">
                                                                A partir de Android 7.0, ChaCha20-Poly1305 se utiliza para cifrado de disco en dispositivos sin aceleración AES, mejorando el rendimiento y la duración de la batería.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiServer className="mr-2 text-success" />
                                                                Bibliotecas Criptográficas
                                                            </h4>
                                                            <p className="text-sm">
                                                                Libsodium, OpenSSL, BoringSSL, GnuTLS y otras bibliotecas importantes ofrecen implementaciones optimizadas de ChaCha20-Poly1305 para distintas plataformas.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiLayers className="mr-2 text-warning" />
                                                                Cifrado de Disco
                                                            </h4>
                                                            <p className="text-sm">
                                                                Algunos sistemas de cifrado de disco completo permiten ChaCha20 como alternativa a AES, especialmente ventajoso en sistemas sin aceleración por hardware.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">¿Cuándo elegir ChaCha20 sobre AES?</h3>
                                                        <div className="text-sm">
                                                            <p>ChaCha20 es preferible en escenarios como:</p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Dispositivos sin aceleración AES por hardware</li>
                                                                <li>Implementaciones en software puro</li>
                                                                <li>Entornos con recursos limitados</li>
                                                                <li>Aplicaciones que necesitan resistencia a ataques de temporización</li>
                                                            </ul>
                                                            <p className="mt-1">AES sigue siendo preferible cuando hay aceleración por hardware disponible.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-between mt-6">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleCipherChange('aes')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: AES
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleCipherChange('salsa')}
                                        >
                                            Siguiente: Salsa20 <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Salsa20 Cipher Content */}
                        {currentCipher === 'salsa' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Salsa20</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        Salsa20 es un cifrado de flujo diseñado por Daniel J. Bernstein en 2005 y fue presentado como parte del proyecto eSTREAM,
                                                        una iniciativa para identificar nuevos cifrados de flujo prometedores. Es el predecesor directo de ChaCha20 y comparte muchas de sus características.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Cifrado de flujo que utiliza operaciones ARX (adición, rotación, XOR)</li>
                                                        <li>Soporta claves de 128 y 256 bits</li>
                                                        <li>Utiliza un nonce de 64 bits (8 bytes)</li>
                                                        <li>Diseñado para ser simple, eficiente y seguro</li>
                                                        <li>No depende de tablas de búsqueda, lo que lo hace resistente a ataques de canal lateral</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Relación con ChaCha20</h3>
                                                    <p className="mb-4">
                                                        Salsa20 fue el primer diseño, y ChaCha20 es una evolución que mantiene la misma estructura pero introduce modificaciones para mejorar la difusión:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Diferentes constantes iniciales</li>
                                                        <li>Función de cuarto de ronda modificada</li>
                                                        <li>Patrón de acceso a la matriz de estado diferente</li>
                                                        <li>En la práctica, ChaCha20 tiene mejor difusión pero ambos se consideran seguros</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiZap className="text-primary" />
                                                                Familia Salsa
                                                            </h3>
                                                            <p className="text-sm">
                                                                Salsa20 tiene variantes con diferente número de rondas:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li><span className="font-medium">Salsa20/20:</span> La versión completa con 20 rondas</li>
                                                                <li><span className="font-medium">Salsa20/12:</span> Versión con 12 rondas, seleccionada para el portfolio eSTREAM</li>
                                                                <li><span className="font-medium">Salsa20/8:</span> Versión con 8 rondas para aplicaciones que priorizan velocidad sobre seguridad</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiAward className="text-secondary" />
                                                                Reconocimiento
                                                            </h3>
                                                            <p className="text-sm">
                                                                Salsa20/12 fue seleccionado para el portfolio final de eSTREAM en 2008 para el perfil de software, lo que lo reconoce como uno de los cifrados de flujo más prometedores de su generación. Aunque ChaCha20 ha ganado más popularidad en años recientes, Salsa20 sigue siendo ampliamente utilizado y respetado.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de Salsa20</h2>

                                            <h3 className="text-xl font-bold mb-3">Estructura y Funcionamiento</h3>
                                            <p className="mb-4">
                                                Al igual que ChaCha20, Salsa20 es un cifrado de flujo que genera un keystream que se combina con el texto plano mediante XOR.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Estado Interno</h4>
                                                        <p>
                                                            Salsa20 opera sobre un estado de 512 bits organizados como una matriz 4×4 de palabras de 32 bits.
                                                            El estado se inicializa con:
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm mt-2">
                                                            <li>Constantes fijas "expand 32-byte k" (4 palabras)</li>
                                                            <li>Clave (8 palabras para 256 bits)</li>
                                                            <li>Posición en el flujo/contador (2 palabras)</li>
                                                            <li>Nonce (2 palabras)</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Función de Cuarto de Ronda</h4>
                                                        <p>
                                                            La operación central en Salsa20 es ligeramente diferente a ChaCha20:
                                                        </p>
                                                        <pre className="bg-base-300 p-2 rounded-md text-sm mt-2 overflow-x-auto">
                                                            b ^= (a + d) &lt;&lt;= 7;<br />
                                                            c ^= (b + a) &lt;&lt;= 9;<br />
                                                            d ^= (c + b) &lt;&lt;= 13;<br />
                                                            a ^= (d + c) &lt;&lt;= 18;
                                                        </pre>
                                                        <p className="text-sm mt-2">
                                                            Esta secuencia de operaciones difiere del patrón utilizado en ChaCha20.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Comparación con ChaCha20</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Característica</th>
                                                            <th>Salsa20</th>
                                                            <th>ChaCha20</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Tamaño de estado</td>
                                                            <td>512 bits (matriz 4×4 de 32 bits)</td>
                                                            <td>512 bits (matriz 4×4 de 32 bits)</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Nonce</td>
                                                            <td>64 bits (8 bytes)</td>
                                                            <td>96 bits (12 bytes)</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Patrón de mezcla</td>
                                                            <td>Mezcla en forma de "+"</td>
                                                            <td>Mezcla de columnas y diagonales</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Función de ronda</td>
                                                            <td>Diferente secuencia de operaciones ARX</td>
                                                            <td>Secuencia ARX modificada para mejor difusión</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Difusión</td>
                                                            <td>Buena</td>
                                                            <td>Mejorada respecto a Salsa20</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Proceso de Cifrado</h3>
                                            <ol className="list-decimal list-inside space-y-1 mb-6">
                                                <li>Se inicializa el estado con constantes, clave, contador y nonce</li>
                                                <li>Se aplican 20 rondas (o 12 en Salsa20/12) con el patrón de mezcla de Salsa20</li>
                                                <li>Se suma el estado original al estado mezclado</li>
                                                <li>El resultado se convierte en un bloque de 64 bytes del keystream</li>
                                                <li>El keystream se combina mediante XOR con el texto plano</li>
                                                <li>Para cifrar más datos, se incrementa el contador y se repite el proceso</li>
                                            </ol>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">El "Corazón" de Salsa20</h4>
                                                    <p>
                                                        La función principal de Salsa20, conocida como la función "core" o "hash", toma un estado de 512 bits y produce
                                                        una salida de 512 bits mezclada criptográficamente. Esta función se construye aplicando una serie de operaciones
                                                        en columnas y filas de forma alternada.
                                                    </p>
                                                    <div className="mt-3 text-sm">
                                                        <p className="font-medium">Ronda de Columnas:</p>
                                                        <p>Actualiza cuatro palabras: (0,4,8,12), (1,5,9,13), (2,6,10,14), (3,7,11,15)</p>

                                                        <p className="font-medium mt-2">Ronda de Filas:</p>
                                                        <p>Actualiza cuatro palabras: (0,1,2,3), (4,5,6,7), (8,9,10,11), (12,13,14,15)</p>

                                                        <p className="mt-2">Esta alternancia entre columnas y filas asegura que los cambios se propaguen por todo el estado.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Seguridad y Criptoanálisis</h3>
                                                        <div className="text-sm">
                                                            Salsa20 ha sido sometido a extenso análisis criptográfico. El mejor ataque conocido contra la versión completa (20 rondas)
                                                            solo reduce el factor de seguridad marginalmente, y no representa una amenaza práctica. Salsa20/12 ofrece un excelente
                                                            equilibrio entre seguridad y rendimiento, mientras que Salsa20/8 prioriza el rendimiento pero con un margen de seguridad menor.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de Salsa20</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Bibliotecas Criptográficas</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiCode className="mr-2 text-primary" />
                                                                Implementaciones de Software
                                                            </h4>
                                                            <p className="mb-3">
                                                                Salsa20 está ampliamente disponible en bibliotecas criptográficas modernas:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li><span className="font-medium">Libsodium:</span> Implementación de alto nivel de NaCl que incluye Salsa20</li>
                                                                <li><span className="font-medium">NaCl:</span> Biblioteca "Networking and Cryptography library" de Bernstein</li>
                                                                <li><span className="font-medium">Crypto++:</span> Biblioteca C++ con implementación de Salsa20</li>
                                                                <li><span className="font-medium">Botan:</span> Biblioteca C++ que incluye Salsa20</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Seguridad de Datos</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiDatabase className="mr-2 text-secondary" />
                                                                Almacenamiento y Archivos
                                                            </h4>
                                                            <ul className="list-disc list-inside mb-3">
                                                                <li><span className="font-medium">DNSCrypt:</span> Usa Salsa20 para cifrar consultas DNS</li>
                                                                <li><span className="font-medium">Sistemas de archivos cifrados:</span> Algunas implementaciones personalizadas</li>
                                                                <li><span className="font-medium">Bases de datos:</span> Para cifrado de campos sensibles</li>
                                                            </ul>
                                                            <p className="text-sm">
                                                                Aunque ChaCha20 ha ganado más adopción en años recientes, Salsa20 sigue siendo
                                                                valorado por su simplicidad y eficiencia en ciertos contextos.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Casos de Uso Específicos</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiShield className="mr-2 text-accent" />
                                                                Sistemas de Baja Potencia
                                                            </h4>
                                                            <p className="text-sm">
                                                                Salsa20 es adecuado para dispositivos IoT y sistemas embebidos por su eficiencia
                                                                computacional y bajos requisitos de memoria. La variante Salsa20/12 o incluso Salsa20/8
                                                                puede ser apropiada en entornos muy restringidos.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiCpu className="mr-2 text-info" />
                                                                Implementaciones en Software
                                                            </h4>
                                                            <p className="text-sm">
                                                                En plataformas sin aceleración criptográfica por hardware, Salsa20 ofrece rendimiento
                                                                excepcional. Su diseño evita operaciones que serían lentas en software, como las tablas
                                                                de sustitución que utiliza AES.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiGlobe className="mr-2 text-success" />
                                                                Aplicaciones de Código Abierto
                                                            </h4>
                                                            <p className="text-sm">
                                                                Salsa20 ha sido adoptado en varias aplicaciones de código abierto que valoran
                                                                la transparencia y la revisión de pares. Su simplicidad facilita la implementación
                                                                correcta y la auditoría.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Salsa20 vs ChaCha20 en la Práctica</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="mb-4">
                                                        Aunque técnicamente ambos algoritmos ofrecen niveles similares de seguridad, ChaCha20 ha ganado más adopción en años recientes debido a:
                                                    </p>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Factor</th>
                                                                    <th>ChaCha20</th>
                                                                    <th>Salsa20</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Estandarización</td>
                                                                    <td>IETF RFC 8439, adoptado en TLS 1.3</td>
                                                                    <td>Portfolio eSTREAM, menos estándar formal</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Difusión</td>
                                                                    <td>Mejor difusión de bits</td>
                                                                    <td>Buena difusión, pero algo menos efectiva</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Nonce</td>
                                                                    <td>96 bits, más conveniente para algunos protocolos</td>
                                                                    <td>64 bits, requiere más cuidado con nonces aleatorios</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Adopción</td>
                                                                    <td>Ampliamente adoptado en protocolos modernos</td>
                                                                    <td>Adopción más limitada, pero aún utilizado</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Consideraciones prácticas</h3>
                                                        <div className="text-sm">
                                                            Como con ChaCha20, se debe tener cuidado con la reutilización de nonce en Salsa20.
                                                            Para aplicaciones modernas, se recomienda generalmente utilizar ChaCha20-Poly1305 debido a
                                                            su mayor adopción, documentación y disponibilidad de implementaciones probadas.
                                                            Sin embargo, Salsa20 sigue siendo una opción válida y segura para ciertos casos de uso.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-between mt-6">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleCipherChange('chacha')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: ChaCha20
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
                                            <FiCheckCircle className="mr-2" /> Avanzando al ejercicio práctico...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Practical Exercise Stage */}
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
                                    <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Criptografía Simétrica</h2>
                                    <p className="text-lg mb-6">Has dominado los conceptos fundamentales de los cifrados simétricos modernos y has demostrado habilidades prácticas en su implementación.</p>

                                    <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                                                <FiKey className="h-5 w-5" />
                                                Especialista en Cifrado Simétrico
                                            </div>
                                        </div>
                                        <p>Has demostrado comprensión teórica y habilidades prácticas en la implementación y uso de algoritmos de cifrado simétrico modernos.</p>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4">Conocimientos adquiridos</h3>
                                    <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 space-y-2">
                                        <li>Fundamentos del cifrado simétrico moderno</li>
                                        <li>Diferencias entre cifrados de bloque (AES) y cifrados de flujo (ChaCha20, Salsa20)</li>
                                        <li>Consideraciones de seguridad y rendimiento en la selección de algoritmos</li>
                                        <li>Aspectos prácticos de la implementación de cifrado</li>
                                        <li>Aplicaciones reales de la criptografía simétrica</li>
                                    </ul>

                                    <div className="alert alert-info shadow-lg mb-6 text-left">
                                        <div>
                                            <FiHelpCircle className="w-6 h-6" />
                                            <div>
                                                <h3 className="font-bold">Próximos pasos</h3>
                                                <p>Para seguir aprendiendo, te recomendamos continuar con el módulo "Criptografía Asimétrica" donde explorarás algoritmos como RSA, ECC y sistemas de intercambio de claves. También podrías explorar "Funciones Hash Criptográficas" para completar tu comprensión de los componentes fundamentales de la criptografía moderna.</p>
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