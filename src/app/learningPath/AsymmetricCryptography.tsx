"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiLock,
    FiCheck,
    FiArrowRight,
    FiAward,
    FiFileText,
    FiKey,
    FiShield,
    FiGlobe,
    FiHelpCircle,
    FiCheckCircle,
    FiX,
    FiUser,
    FiUsers,
    FiServer,
    FiCode,
    FiClock,
    FiGitBranch,
    FiCpu,
    FiInfo,
    FiMessageCircle,
    FiTrendingUp,
    FiAlertTriangle,
    FiBriefcase,
    FiSmartphone
} from 'react-icons/fi';
import { FaLightbulb } from "react-icons/fa";

// Types for our application
type AlgorithmType = 'rsa' | 'dh' | 'ecc';
type ProgressStage = 'learning' | 'quiz' | 'practical' | 'completed';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

export default function AsymmetricCryptography() {
    // State management
    const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmType>('rsa');
    const [progress, setProgress] = useState<number>(0);
    const [stage, setStage] = useState<ProgressStage>('learning');
    const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
    const [quizPassed, setQuizPassed] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('info');
    const [questionsAnswered, setQuestionsAnswered] = useState<number[]>([]);
    const [showCongratulations, setShowCongratulations] = useState<boolean>(false);
    const [practicalCompleted, setPracticalCompleted] = useState<boolean>(false);

    // Quiz state
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            question: "¿Cuál es la principal diferencia entre criptografía simétrica y asimétrica?",
            options: [
                "La criptografía asimétrica es más rápida",
                "La criptografía asimétrica utiliza dos claves diferentes para cifrar y descifrar",
                "La criptografía simétrica es más segura",
                "La criptografía asimétrica no requiere claves"
            ],
            correctAnswer: "La criptografía asimétrica utiliza dos claves diferentes para cifrar y descifrar"
        },
        {
            id: 2,
            question: "¿Qué problema fundamental resuelve el intercambio de claves Diffie-Hellman?",
            options: [
                "Permite a dos partes generar una clave compartida sobre un canal inseguro sin haberla intercambiado previamente",
                "Permite cifrar mensajes extremadamente largos",
                "Elimina la necesidad de claves en la comunicación",
                "Garantiza que los mensajes no puedan ser alterados en tránsito"
            ],
            correctAnswer: "Permite a dos partes generar una clave compartida sobre un canal inseguro sin haberla intercambiado previamente"
        },
        {
            id: 3,
            question: "¿Cuál es la ventaja principal de la criptografía de curva elíptica sobre RSA?",
            options: [
                "Es más antigua y probada",
                "Ofrece mayor seguridad con claves más cortas",
                "Es compatible con más dispositivos",
                "No tiene vulnerabilidades conocidas"
            ],
            correctAnswer: "Ofrece mayor seguridad con claves más cortas"
        },
        {
            id: 4,
            question: "En RSA, si tenemos la clave privada, ¿qué podemos hacer?",
            options: [
                "Solo cifrar mensajes",
                "Solo descifrar mensajes",
                "Tanto cifrar como descifrar mensajes",
                "Solo calcular hashes seguros"
            ],
            correctAnswer: "Tanto cifrar como descifrar mensajes"
        },
        {
            id: 5,
            question: "¿Qué componente matemático es fundamental para la seguridad de RSA?",
            options: [
                "La dificultad de factorizar números primos grandes",
                "La imposibilidad de resolver ecuaciones diferenciales",
                "La complejidad de los sistemas de ecuaciones lineales",
                "La aleatoriedad de los números irracionales"
            ],
            correctAnswer: "La dificultad de factorizar números primos grandes"
        }
    ]);

    // Update progress based on current algorithm and stage
    useEffect(() => {
        let newProgress = 0;

        // Base progress on current algorithm
        if (currentAlgorithm === 'rsa') newProgress = 0;
        else if (currentAlgorithm === 'dh') newProgress = 30;
        else if (currentAlgorithm === 'ecc') newProgress = 60;

        // Adjust based on stage
        if (stage === 'quiz') newProgress = 80;
        else if (stage === 'practical') newProgress = 90;
        else if (stage === 'completed') newProgress = 100;

        setProgress(newProgress);
    }, [currentAlgorithm, stage]);

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
            setShowCongratulations(true);
            // Here you would send the achievement to the database
        }, 1500);
    };

    // Navigate between different algorithms
    const handleAlgorithmChange = (algorithm: AlgorithmType) => {
        setCurrentAlgorithm(algorithm);
        setActiveTab('info');
    };

    // Navigate to the quiz when all algorithms are reviewed
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
                    <h1 className="text-3xl font-bold text-center">Criptografía Asimétrica</h1>

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
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentAlgorithm === 'rsa' ? 'border-primary bg-primary text-primary-content' : progress >= 30 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiKey className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">RSA</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 30 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentAlgorithm === 'dh' ? 'border-primary bg-primary text-primary-content' : progress >= 60 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiUsers className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Diffie-Hellman</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 60 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentAlgorithm === 'ecc' ? 'border-primary bg-primary text-primary-content' : progress >= 80 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiGitBranch className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Curvas Elípticas</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 80 ? '100%' : '0%' }}
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
                {/* Learning Stage - Display content based on current algorithm */}
                {stage === 'learning' && (
                    <div className="max-w-4xl mx-auto">
                        {/* Algorithm Navigation Tabs */}
                        <div className="tabs tabs-boxed mb-6 justify-center">
                            <button
                                className={`tab ${currentAlgorithm === 'rsa' ? 'tab-active' : ''}`}
                                onClick={() => handleAlgorithmChange('rsa')}
                            >
                                RSA
                            </button>
                            <button
                                className={`tab ${currentAlgorithm === 'dh' ? 'tab-active' : ''}`}
                                onClick={() => handleAlgorithmChange('dh')}
                            >
                                Diffie-Hellman
                            </button>
                            <button
                                className={`tab ${currentAlgorithm === 'ecc' ? 'tab-active' : ''}`}
                                onClick={() => handleAlgorithmChange('ecc')}
                            >
                                Curvas Elípticas
                            </button>
                        </div>

                        {/* Content Tabs for current algorithm */}
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

                        {/* RSA Content */}
                        {currentAlgorithm === 'rsa' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">RSA (Rivest-Shamir-Adleman)</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        RSA es uno de los primeros y más utilizados sistemas de criptografía de clave pública. Fue desarrollado en 1977 por Ron Rivest,
                                                        Adi Shamir y Leonard Adleman en el MIT, de cuyas iniciales deriva su nombre. RSA marcó un antes y un después
                                                        en la historia de la criptografía, ya que resolvió uno de los mayores problemas de los sistemas de cifrado tradicionales:
                                                        el intercambio seguro de claves.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Utiliza un par de claves: una pública para cifrar y una privada para descifrar</li>
                                                        <li>Se basa en la dificultad de factorizar el producto de dos números primos grandes</li>
                                                        <li>Permite tanto cifrado como firma digital</li>
                                                        <li>Es asimétrico, lo que resuelve el problema de distribución de claves</li>
                                                        <li>Las claves típicas tienen longitudes de 2048 o 4096 bits en la actualidad</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Funcionamiento Básico</h3>
                                                    <p className="mb-4">
                                                        El sistema RSA funciona de la siguiente manera:
                                                    </p>
                                                    <ol className="list-decimal list-inside space-y-1">
                                                        <li>Se generan dos claves matemáticamente relacionadas: una pública y una privada</li>
                                                        <li>La clave pública se distribuye libremente a cualquiera que quiera enviar un mensaje cifrado</li>
                                                        <li>El remitente utiliza la clave pública del destinatario para cifrar el mensaje</li>
                                                        <li>Solo el destinatario, con su clave privada, puede descifrar el mensaje</li>
                                                        <li>El proceso también puede utilizarse a la inversa para crear firmas digitales</li>
                                                    </ol>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiLock className="text-primary" />
                                                                Seguridad de RSA
                                                            </h3>
                                                            <p className="text-sm">
                                                                La seguridad de RSA se basa en:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li>La dificultad computacional de factorizar números grandes</li>
                                                                <li>El uso de números primos de cientos de dígitos</li>
                                                                <li>El continuo aumento de la longitud de claves frente a avances en computación</li>
                                                            </ul>
                                                            <p className="text-sm mt-2">
                                                                Con las longitudes de clave actuales, factorizar el producto de los números primos utilizados en RSA
                                                                está más allá de las capacidades prácticas de los supercomputadores actuales.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiClock className="text-secondary" />
                                                                Historia e Impacto
                                                            </h3>
                                                            <p className="text-sm">
                                                                Aunque Rivest, Shamir y Adleman publicaron RSA en 1977, más tarde se descubrió que el
                                                                sistema había sido inventado previamente por Clifford Cocks en GCHQ (Reino Unido) en 1973,
                                                                pero se mantuvo en secreto. RSA fue el primer algoritmo práctico que implementó los conceptos de
                                                                criptografía de clave pública propuestos por Whitfield Diffie y Martin Hellman.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de RSA</h2>

                                            <h3 className="text-xl font-bold mb-3">Fundamento Matemático</h3>
                                            <p className="mb-4">
                                                RSA se basa en propiedades fundamentales de la teoría de números y la aritmética modular.
                                                Su seguridad radica en la dificultad de factorizar productos de números primos grandes.
                                            </p>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-lg">Generación de Claves</h4>
                                                    <ol className="list-decimal list-inside space-y-2">
                                                        <li>Generar dos números primos grandes distintos <span className="font-mono">p</span> y <span className="font-mono">q</span></li>
                                                        <li>Calcular <span className="font-mono">n = p × q</span> (el módulo)</li>
                                                        <li>Calcular la función de Euler: <span className="font-mono">φ(n) = (p-1) × (q-1)</span></li>
                                                        <li>Elegir un entero <span className="font-mono">e</span> tal que <span className="font-mono">1 &lt; e &lt; φ(n)</span> y <span className="font-mono">gcd(e, φ(n)) = 1</span> (exponente de la clave pública)</li>
                                                        <li>Calcular <span className="font-mono">d</span> tal que <span className="font-mono">d × e ≡ 1 (mod φ(n))</span> (exponente de la clave privada)</li>
                                                    </ol>
                                                    <div className="mt-4">
                                                        <p className="font-medium">Clave pública: (<span className="font-mono">e</span>, <span className="font-mono">n</span>)</p>
                                                        <p className="font-medium">Clave privada: (<span className="font-mono">d</span>, <span className="font-mono">n</span>)</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Cifrado</h4>
                                                        <p className="mb-3">
                                                            Para cifrar un mensaje <span className="font-mono">m</span>, se convierte primero a un número (o bloques de números)
                                                            tal que <span className="font-mono">0 ≤ m &lt; n</span>, y luego:
                                                        </p>
                                                        <div className="bg-base-300 p-3 rounded-md text-center">
                                                            <span className="font-mono">c = m<sup>e</sup> mod n</span>
                                                        </div>
                                                        <p className="mt-3 text-sm">
                                                            Donde <span className="font-mono">c</span> es el texto cifrado.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Descifrado</h4>
                                                        <p className="mb-3">
                                                            Para descifrar el mensaje cifrado <span className="font-mono">c</span>:
                                                        </p>
                                                        <div className="bg-base-300 p-3 rounded-md text-center">
                                                            <span className="font-mono">m = c<sup>d</sup> mod n</span>
                                                        </div>
                                                        <p className="mt-3 text-sm">
                                                            Esto devuelve el mensaje original <span className="font-mono">m</span>.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Firma Digital con RSA</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="mb-3">
                                                        RSA también puede usarse para firmar mensajes, proporcionando autenticidad:
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-medium mb-2">Para firmar un mensaje:</h4>
                                                            <ol className="list-decimal list-inside text-sm space-y-1">
                                                                <li>Calcular el hash <span className="font-mono">h</span> del mensaje</li>
                                                                <li>Calcular la firma <span className="font-mono">s = h<sup>d</sup> mod n</span> usando la clave privada</li>
                                                                <li>Enviar el mensaje junto con la firma <span className="font-mono">s</span></li>
                                                            </ol>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium mb-2">Para verificar la firma:</h4>
                                                            <ol className="list-decimal list-inside text-sm space-y-1">
                                                                <li>Calcular el hash <span className="font-mono">h</span> del mensaje recibido</li>
                                                                <li>Calcular <span className="font-mono">h' = s<sup>e</sup> mod n</span> usando la clave pública</li>
                                                                <li>Si <span className="font-mono">h = h'</span>, la firma es válida</li>
                                                            </ol>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Consideraciones Prácticas</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Aspecto</th>
                                                            <th>Detalle</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Longitud de clave recomendada</td>
                                                            <td>Mínimo 2048 bits para uso general, 3072 o 4096 bits para mayor seguridad a largo plazo</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tamaño máximo de mensaje</td>
                                                            <td>Menor que el módulo <span className="font-mono">n</span> (en la práctica, se cifran bloques más pequeños)</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Relleno (Padding)</td>
                                                            <td>Esquemas como PKCS#1 v1.5 o OAEP son necesarios para seguridad en implementaciones reales</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Rendimiento</td>
                                                            <td>Significativamente más lento que cifrados simétricos (~1000 veces), por lo que suele usarse para intercambio de claves</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Vulnerabilidades</td>
                                                            <td>Ataques de temporización, canal lateral, e implementación incorrecta del algoritmo</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Optimizaciones</h3>
                                                        <div className="text-sm">
                                                            En la práctica, RSA se implementa con varias optimizaciones:
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Exponenciación modular rápida para cálculos eficientes</li>
                                                                <li>Teorema chino del resto para acelerar operaciones con clave privada</li>
                                                                <li>Cifrado híbrido: usar RSA para intercambiar una clave simétrica temporal</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de RSA</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Seguridad Web</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiGlobe className="mr-2 text-primary" />
                                                                TLS/SSL y HTTPS
                                                            </h4>
                                                            <p className="mb-3">
                                                                RSA es fundamental en la infraestructura de seguridad web:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Autenticación de servidores web mediante certificados digitales</li>
                                                                <li>Establecimiento seguro de canales de comunicación</li>
                                                                <li>Intercambio seguro de claves de sesión para cifrado simétrico</li>
                                                                <li>Firma digital de certificados de sitios web</li>
                                                            </ul>
                                                            <p className="mt-3 text-sm">
                                                                Cuando ves el candado en tu navegador, es probable que se esté utilizando RSA como parte del proceso.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Comunicaciones Seguras</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiUser className="mr-2 text-secondary" />
                                                                Correo Electrónico y Mensajería
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">PGP/GPG:</span> Utilizan RSA para cifrado y firmas digitales en correos electrónicos</li>
                                                                <li><span className="font-medium">S/MIME:</span> Estándar para correo seguro basado en PKI y RSA</li>
                                                                <li><span className="font-medium">Aplicaciones de mensajería:</span> Muchas usan RSA para el intercambio inicial de claves</li>
                                                                <li><span className="font-medium">Chat seguro:</span> Verificación de identidad y establecimiento de canales seguros</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Autenticación y Documentos</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiFileText className="mr-2 text-accent" />
                                                                Firmas Digitales
                                                            </h4>
                                                            <p className="mb-3">
                                                                RSA es ampliamente utilizado para firmar digitalmente:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Documentos oficiales y contratos electrónicos</li>
                                                                <li>Software y actualizaciones de sistema</li>
                                                                <li>Código fuente en repositorios</li>
                                                                <li>Transacciones financieras</li>
                                                                <li>Comunicaciones corporativas</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Sistemas de Claves</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiKey className="mr-2 text-info" />
                                                                Infraestructura de Clave Pública (PKI)
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">Certificados digitales:</span> Las autoridades de certificación firman certificados con RSA</li>
                                                                <li><span className="font-medium">Tarjetas inteligentes:</span> Almacenan claves RSA para autenticación segura</li>
                                                                <li><span className="font-medium">Tokens de seguridad:</span> Dispositivos físicos con claves RSA para acceso</li>
                                                                <li><span className="font-medium">VPN:</span> Autenticación de dispositivos y usuarios</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Limitaciones y Desafíos</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiCpu className="mr-2 text-warning" />
                                                                Rendimiento
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Operaciones matemáticas intensivas</li>
                                                                <li>Requiere significativamente más recursos que el cifrado simétrico</li>
                                                                <li>No adecuado para cifrar grandes volúmenes de datos</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiClock className="mr-2 text-error" />
                                                                Amenazas Futuras
                                                            </h4>
                                                            <p className="text-sm">
                                                                <ul className="list-disc list-inside text-sm">
                                                                    <li>Computación cuántica podría romper RSA (algoritmo de Shor)</li>
                                                                    <li>Requiere continuo aumento de tamaño de claves</li>
                                                                    <li>Necesidad de migración progresiva a alternativas post-cuánticas</li>
                                                                </ul>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiAlertTriangle className="mr-2 text-warning" />
                                                                Implementación
                                                            </h4>
                                                            <p className="text-sm">
                                                                <ul className="list-disc list-inside text-sm">
                                                                    <li>Vulnerable a errores de implementación</li>
                                                                    <li>Requiere relleno (padding) adecuado</li>
                                                                    <li>Sensible a ataques de temporización y canal lateral</li>
                                                                </ul>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FaLightbulb className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Uso Híbrido: La Mejor Práctica</h3>
                                                        <div className="text-sm">
                                                            <p>En la práctica, RSA rara vez se usa solo para cifrar datos. El enfoque más común es:</p>
                                                            <ol className="list-decimal list-inside mt-1">
                                                                <li>Generar una clave simétrica aleatoria de un solo uso (AES, ChaCha20, etc.)</li>
                                                                <li>Cifrar los datos con esta clave simétrica (rápido y eficiente)</li>
                                                                <li>Cifrar solo la clave simétrica con RSA (lento pero solo para datos pequeños)</li>
                                                                <li>Transmitir tanto el mensaje cifrado como la clave cifrada</li>
                                                            </ol>
                                                            <p className="mt-1">Este método combina la seguridad de RSA con la eficiencia de los cifrados simétricos.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-6">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAlgorithmChange('dh')}
                                        >
                                            Siguiente: Diffie-Hellman <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Diffie-Hellman Content */}
                        {currentAlgorithm === 'dh' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Intercambio de Claves Diffie-Hellman</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        El intercambio de claves Diffie-Hellman (DH) es un método que permite a dos partes establecer una clave
                                                        secreta compartida sobre un canal de comunicación inseguro sin haber intercambiado información secreta previamente.
                                                        Fue desarrollado por Whitfield Diffie y Martin Hellman en 1976, y representó una revolución en el campo
                                                        de la criptografía.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Permite acuerdo de claves sin intercambio previo de secretos</li>
                                                        <li>Se basa en la dificultad del problema del logaritmo discreto</li>
                                                        <li>No proporciona autenticación por sí mismo</li>
                                                        <li>Soluciona el problema de distribución de claves en canales inseguros</li>
                                                        <li>Es uno de los fundamentos de la criptografía moderna</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Concepto Clave</h3>
                                                    <p className="mb-4">
                                                        El principio fundamental de Diffie-Hellman es que dos partes pueden calcular un secreto compartido
                                                        incluso cuando toda su comunicación es pública. Esto se logra aprovechando propiedades matemáticas
                                                        especiales como la conmutatividad de ciertas operaciones.
                                                    </p>
                                                    <p>
                                                        Una analogía común para entender Diffie-Hellman es la "mezcla de colores", donde ambas partes
                                                        pueden llegar al mismo color final sin revelar sus colores secretos individuales.
                                                    </p>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiUsers className="text-primary" />
                                                                ¿Para qué sirve?
                                                            </h3>
                                                            <p className="text-sm">
                                                                Diffie-Hellman permite:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li>Establecer una clave secreta compartida sobre un canal público</li>
                                                                <li>Generar claves de sesión para comunicaciones cifradas</li>
                                                                <li>Implementar "Perfect Forward Secrecy" (PFS) en protocolos de comunicación</li>
                                                                <li>Renovar claves periódicamente sin intercambios adicionales de secretos</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiClock className="text-secondary" />
                                                                Impacto Histórico
                                                            </h3>
                                                            <p className="text-sm">
                                                                Diffie-Hellman fue el primer algoritmo de clave pública publicado, precediendo incluso a RSA.
                                                                Su publicación en 1976 provocó una revolución en la criptografía, allanando el camino para
                                                                sistemas como TLS/SSL, PGP, SSH y casi todos los protocolos de seguridad en Internet.
                                                            </p>
                                                            <p className="text-sm mt-2">
                                                                Al igual que con RSA, se descubrió posteriormente que GCHQ (Reino Unido) había desarrollado
                                                                conceptos similares años antes, pero los mantuvo clasificados.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de Diffie-Hellman</h2>

                                            <h3 className="text-xl font-bold mb-3">Fundamento Matemático</h3>
                                            <p className="mb-4">
                                                El protocolo Diffie-Hellman se basa en propiedades de la aritmética modular y la dificultad del
                                                problema del logaritmo discreto en ciertos grupos.
                                            </p>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-lg">Parámetros Básicos</h4>
                                                    <p className="mb-4">
                                                        Para comenzar, las partes deben acordar dos parámetros públicos:
                                                    </p>
                                                    <ul className="list-disc list-inside mb-4">
                                                        <li><span className="font-mono">p</span>: Un número primo grande (típicamente 2048 bits o más)</li>
                                                        <li><span className="font-mono">g</span>: Un generador (usualmente 2 o 5) que es una raíz primitiva módulo <span className="font-mono">p</span></li>
                                                    </ul>
                                                    <p className="text-sm">
                                                        Estos parámetros no necesitan ser secretos y pueden ser compartidos abiertamente, incluso reutilizados
                                                        por muchos usuarios.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-lg">Protocolo de Intercambio de Claves</h4>
                                                    <p className="mb-4">
                                                        Supongamos que Alice y Bob quieren establecer una clave compartida:
                                                    </p>

                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Paso</th>
                                                                    <th>Alice</th>
                                                                    <th>Bob</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>Elige un número privado <span className="font-mono">a</span></td>
                                                                    <td>Elige un número privado <span className="font-mono">b</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>2</td>
                                                                    <td>Calcula <span className="font-mono">A = g<sup>a</sup> mod p</span></td>
                                                                    <td>Calcula <span className="font-mono">B = g<sup>b</sup> mod p</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>3</td>
                                                                    <td>Envía <span className="font-mono">A</span> a Bob</td>
                                                                    <td>Envía <span className="font-mono">B</span> a Alice</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>4</td>
                                                                    <td>Calcula la clave compartida<br /><span className="font-mono">s = B<sup>a</sup> mod p</span></td>
                                                                    <td>Calcula la clave compartida<br /><span className="font-mono">s = A<sup>b</sup> mod p</span></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="alert alert-success mt-4 text-sm">
                                                        <FiCheck className="w-5 h-5 mr-2" />
                                                        Las claves calculadas son idénticas porque: B<sup>a</sup> = (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> = (g<sup>a</sup>)<sup>b</sup> = A<sup>b</sup> (mod p)
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Variantes de Diffie-Hellman</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">DH sobre Campo Finito (Clásico)</h4>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            <li>Usa aritmética modular con un primo grande p</li>
                                                            <li>Seguridad basada en el problema del logaritmo discreto</li>
                                                            <li>Vulnerable a avances en ciertos tipos de ataques</li>
                                                            <li>Requiere claves de 2048 bits o más para seguridad actual</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">ECDH (Diffie-Hellman de Curva Elíptica)</h4>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            <li>Basado en curvas elípticas en lugar de aritmética modular simple</li>
                                                            <li>Mucho más eficiente - claves más cortas para igual seguridad</li>
                                                            <li>Una clave ECDH de 256 bits ofrece seguridad similar a DH de 3072 bits</li>
                                                            <li>Mayor adopción en sistemas modernos</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Consideraciones de Seguridad</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base mb-3">Vulnerabilidades y Mitigaciones</h4>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Vulnerabilidad</th>
                                                                    <th>Descripción</th>
                                                                    <th>Mitigación</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Ataque Man-in-the-Middle</td>
                                                                    <td>Un atacante podría interceptar y alterar los mensajes entre Alice y Bob</td>
                                                                    <td>Combinación con mecanismos de autenticación (DH autenticado)</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Parámetros débiles</td>
                                                                    <td>Ciertos valores de p y g pueden comprometer la seguridad</td>
                                                                    <td>Usar parámetros bien verificados o grupos estandarizados</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Números aleatorios débiles</td>
                                                                    <td>Exponentes previsibles comprometen la seguridad</td>
                                                                    <td>Generadores de números aleatorios criptográficamente seguros</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Ataques de cálculo de logaritmos</td>
                                                                    <td>Avances matemáticos pueden debilitar el problema subyacente</td>
                                                                    <td>Aumentar tamaño de parámetros o migrar a curvas elípticas</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Perfect Forward Secrecy (PFS)</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                Una propiedad importante de Diffie-Hellman es que puede proporcionar "Perfect Forward Secrecy"
                                                                cuando se genera un nuevo par de claves efímeras para cada sesión:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Incluso si la clave privada a largo plazo es comprometida en el futuro</li>
                                                                <li>Las sesiones pasadas permanecen seguras</li>
                                                                <li>Porque cada sesión usa claves efímeras independientes</li>
                                                                <li>Que son descartadas después de su uso</li>
                                                            </ul>
                                                            <p className="mt-1">
                                                                Esta propiedad es crucial en protocolos modernos como TLS 1.3 y muchas aplicaciones de mensajería segura.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de Diffie-Hellman</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Seguridad Web</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiGlobe className="mr-2 text-primary" />
                                                                TLS/SSL y HTTPS
                                                            </h4>
                                                            <p className="mb-3">
                                                                Diffie-Hellman es fundamental para la seguridad de las comunicaciones web:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Intercambio de clave de sesión en handshakes TLS</li>
                                                                <li>Mecanismo clave para Perfect Forward Secrecy (DHE, ECDHE)</li>
                                                                <li>TLS 1.3 requiere ECDHE para todos los handshakes</li>
                                                                <li>Protege billones de conexiones web diariamente</li>
                                                            </ul>
                                                            <div className="alert alert-success mt-3 text-sm">
                                                                <FiInfo className="w-5 h-5 mr-2" />
                                                                Los cifradores modernos en HTTPS incluyen "DHE" o "ECDHE" en su nombre, indicando uso de Diffie-Hellman efímero.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Redes Seguras</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiLock className="mr-2 text-secondary" />
                                                                VPN y SSH
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">SSH:</span> Utiliza DH para establecer claves seguras en sesiones remotas</li>
                                                                <li><span className="font-medium">IPsec:</span> Protocolo de seguridad de red que implementa DH para intercambio de claves</li>
                                                                <li><span className="font-medium">VPN:</span> OpenVPN, WireGuard y otras soluciones utilizan DH o ECDH</li>
                                                                <li><span className="font-medium">Redes corporativas:</span> Autenticación y comunicación segura entre dispositivos</li>
                                                            </ul>
                                                            <p className="mt-3 text-sm">
                                                                En estas aplicaciones, DH permite establecer túneles cifrados sin necesidad de compartir secretos previamente.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Mensajería Segura</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiMessageCircle className="mr-2 text-accent" />
                                                                Aplicaciones de Comunicación
                                                            </h4>
                                                            <p className="mb-3">
                                                                DH es un componente clave en aplicaciones de mensajería modernas:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li><span className="font-medium">Signal Protocol:</span> Utiliza ECDH para generar claves de sesión</li>
                                                                <li><span className="font-medium">WhatsApp, Telegram, etc.:</span> Implementan cifrado basado en DH</li>
                                                                <li><span className="font-medium">Doble Ratchet:</span> Algoritmo que utiliza ECDH para renovación constante de claves</li>
                                                                <li><span className="font-medium">PGP/GPG:</span> Opciones para incorporar DH en el cifrado de correo electrónico</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">IoT y Sistemas Embebidos</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiCpu className="mr-2 text-info" />
                                                                Dispositivos Conectados
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li>Establecimiento de claves entre dispositivos con recursos limitados</li>
                                                                <li>Comunicación segura en redes de sensores</li>
                                                                <li>ECDH es preferido por su eficiencia en dispositivos de baja potencia</li>
                                                                <li>Autenticación y emparejamiento de dispositivos en entornos domésticos</li>
                                                            </ul>
                                                            <p className="mt-3 text-sm">
                                                                En IoT, ECDH es especialmente valioso porque ofrece buena seguridad con menor uso de recursos.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Implementaciones Prácticas</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiCode className="mr-2 text-primary" />
                                                                Bibliotecas y APIs
                                                            </h4>
                                                            <p className="text-sm">
                                                                <ul className="list-disc list-inside text-sm">
                                                                    <li>OpenSSL ofrece implementaciones completas</li>
                                                                    <li>Libsodium proporciona APIs de alto nivel</li>
                                                                    <li>Web Crypto API en navegadores modernos</li>
                                                                    <li>Implementaciones nativas en lenguajes como Go, Rust</li>
                                                                </ul>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiServer className="mr-2 text-secondary" />
                                                                Protocolos Estandarizados
                                                            </h4>
                                                            <p className="text-sm">
                                                                <ul className="list-disc list-inside text-sm">
                                                                    <li>IKE (Internet Key Exchange) en IPsec</li>
                                                                    <li>TLS 1.3 con DHE y ECDHE obligatorios</li>
                                                                    <li>X3DH (Extended Triple Diffie-Hellman) para mensajería</li>
                                                                    <li>Grupos DH estandarizados por IETF (RFC 7919)</li>
                                                                </ul>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiShield className="mr-2 text-accent" />
                                                                Mejores Prácticas
                                                            </h4>
                                                            <p className="text-sm">
                                                                <ul className="list-disc list-inside text-sm">
                                                                    <li>Usar ECDH sobre DH clásico cuando sea posible</li>
                                                                    <li>Implementar DH efímero para Perfect Forward Secrecy</li>
                                                                    <li>Combinar con autenticación fuerte</li>
                                                                    <li>Usar parámetros y grupos estandarizados</li>
                                                                </ul>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Limitaciones a considerar</h3>
                                                        <div className="text-sm">
                                                            <p>Aunque Diffie-Hellman es una poderosa herramienta criptográfica, es importante recordar que:</p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>No proporciona autenticación por sí mismo - siempre debe combinarse con mecanismos de autenticación</li>
                                                                <li>Es vulnerable a ataques de man-in-the-middle sin autenticación adecuada</li>
                                                                <li>Parámetros débiles o algoritmos de generación de números aleatorios deficientes pueden comprometer la seguridad</li>
                                                                <li>La computación cuántica representa una amenaza futura para su seguridad</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-between mt-6">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleAlgorithmChange('rsa')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: RSA
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAlgorithmChange('ecc')}
                                        >
                                            Siguiente: Curvas Elípticas <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Elliptic Curve Cryptography Content */}
                        {currentAlgorithm === 'ecc' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Criptografía de Curva Elíptica (ECC)</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        La Criptografía de Curva Elíptica (ECC, por sus siglas en inglés) es un enfoque de criptografía de clave pública
                                                        basado en la estructura algebraica de las curvas elípticas sobre campos finitos. Desarrollada de forma independiente
                                                        por Neal Koblitz y Victor S. Miller en 1985, ECC ha ganado popularidad significativa en las últimas décadas debido a
                                                        su excelente relación entre seguridad y tamaño de clave.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Ofrece el mismo nivel de seguridad que RSA con claves mucho más cortas</li>
                                                        <li>Se basa en la dificultad del problema del logaritmo discreto en curvas elípticas (ECDLP)</li>
                                                        <li>Permite cifrado, firmas digitales e intercambio de claves</li>
                                                        <li>Es más eficiente en términos de cómputo, memoria y ancho de banda</li>
                                                        <li>Ideal para dispositivos con recursos limitados (móviles, IoT, tarjetas inteligentes)</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Comparación con RSA</h3>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Nivel de Seguridad</th>
                                                                    <th>Tamaño de Clave RSA</th>
                                                                    <th>Tamaño de Clave ECC</th>
                                                                    <th>Ratio</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>80 bits</td>
                                                                    <td>1024 bits</td>
                                                                    <td>160 bits</td>
                                                                    <td>1:6.4</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>128 bits</td>
                                                                    <td>3072 bits</td>
                                                                    <td>256 bits</td>
                                                                    <td>1:12</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>192 bits</td>
                                                                    <td>7680 bits</td>
                                                                    <td>384 bits</td>
                                                                    <td>1:20</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>256 bits</td>
                                                                    <td>15360 bits</td>
                                                                    <td>512 bits</td>
                                                                    <td>1:30</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiGitBranch className="text-primary" />
                                                                ¿Qué es una curva elíptica?
                                                            </h3>
                                                            <p className="text-sm">
                                                                Una curva elíptica es una curva plana definida por una ecuación de la forma:
                                                            </p>
                                                            <div className="bg-base-300 p-2 rounded-md text-center my-2">
                                                                <span className="font-mono">y² = x³ + ax + b</span>
                                                            </div>
                                                            <p className="text-sm">
                                                                donde a y b son constantes. En criptografía, estas curvas se definen sobre campos finitos,
                                                                no sobre números reales, lo que les da propiedades matemáticas especiales útiles para
                                                                operaciones criptográficas.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiTrendingUp className="text-secondary" />
                                                                Adopción Creciente
                                                            </h3>
                                                            <p className="text-sm">
                                                                ECC ha experimentado una adopción creciente en los últimos años:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li>La NSA recomienda ECC para proteger información gubernamental</li>
                                                                <li>Bitcoin y muchas otras criptomonedas utilizan ECDSA para firmas</li>
                                                                <li>TLS 1.3 prioriza cifrados basados en curvas elípticas</li>
                                                                <li>Aplicaciones móviles y IoT favorecen ECC por su eficiencia</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de ECC</h2>

                                            <h3 className="text-xl font-bold mb-3">Fundamentos Matemáticos</h3>
                                            <p className="mb-4">
                                                La criptografía de curva elíptica opera en la estructura matemática formada por puntos en una curva elíptica
                                                sobre un campo finito, típicamente un campo primo Fp o un campo binario F2ᵐ.
                                            </p>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-lg">Operaciones en Curvas Elípticas</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h5 className="font-medium mb-2">Adición de Puntos</h5>
                                                            <p className="text-sm mb-2">
                                                                Dados dos puntos P y Q en la curva, existe una regla geométrica para encontrar un tercer punto P + Q:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Trazar una línea entre P y Q</li>
                                                                <li>Encontrar el tercer punto de intersección con la curva</li>
                                                                <li>Reflejar este punto sobre el eje x</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium mb-2">Multiplicación Escalar</h5>
                                                            <p className="text-sm mb-2">
                                                                La operación fundamental es la multiplicación escalar: dado un punto P y un entero k, calcular kP:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>kP = P + P + ... + P (k veces)</li>
                                                                <li>Se implementa eficientemente con algoritmos como double-and-add</li>
                                                                <li>Es computacionalmente fácil de calcular</li>
                                                                <li>Pero su operación inversa (logaritmo discreto) es computacionalmente difícil</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Algoritmos ECC Principales</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">ECDH (Elliptic Curve Diffie-Hellman)</h4>
                                                        <p className="mb-3 text-sm">
                                                            Variante de Diffie-Hellman para intercambio de claves usando curvas elípticas:
                                                        </p>
                                                        <ol className="list-decimal list-inside text-sm space-y-1">
                                                            <li>Alice genera par de claves (dₐ, Qₐ = dₐ·G)</li>
                                                            <li>Bob genera par de claves (dᵦ, Qᵦ = dᵦ·G)</li>
                                                            <li>Alice y Bob intercambian claves públicas Qₐ y Qᵦ</li>
                                                            <li>Alice calcula S = dₐ·Qᵦ</li>
                                                            <li>Bob calcula S = dᵦ·Qₐ</li>
                                                            <li>Ambos obtienen el mismo punto S compartido</li>
                                                        </ol>
                                                        <p className="mt-2 text-sm">
                                                            Como dₐ·Qᵦ = dₐ·(dᵦ·G) = dᵦ·(dₐ·G) = dᵦ·Qₐ, ambos obtienen el mismo secreto.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">ECDSA (Elliptic Curve Digital Signature Algorithm)</h4>
                                                        <p className="mb-2 text-sm">
                                                            Algoritmo de firma digital basado en curvas elípticas:
                                                        </p>
                                                        <h5 className="font-medium mb-1">Generación de firma:</h5>
                                                        <ol className="list-decimal list-inside text-sm space-y-1">
                                                            <li>Calcular el hash h del mensaje</li>
                                                            <li>Generar un número aleatorio efímero k</li>
                                                            <li>Calcular el punto R = k·G y obtener r (coordenada x de R)</li>
                                                            <li>Calcular s = k⁻¹(h + r·d) mod n, donde d es la clave privada</li>
                                                            <li>La firma es el par (r, s)</li>
                                                        </ol>
                                                        <h5 className="font-medium mb-1 mt-2">Verificación de firma:</h5>
                                                        <ol className="list-decimal list-inside text-sm space-y-1">
                                                            <li>Calcular u₁ = h·s⁻¹ mod n y u₂ = r·s⁻¹ mod n</li>
                                                            <li>Calcular el punto R' = u₁·G + u₂·Q, donde Q es la clave pública</li>
                                                            <li>La firma es válida si la coordenada x de R' es igual a r</li>
                                                        </ol>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Curvas Estándar</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="mb-3">
                                                        Existen varias curvas elípticas estandarizadas que son ampliamente utilizadas:
                                                    </p>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Curva</th>
                                                                    <th>Tamaño (bits)</th>
                                                                    <th>Usos Comunes</th>
                                                                    <th>Notas</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>P-256 (secp256r1)</td>
                                                                    <td>256</td>
                                                                    <td>TLS, aplicaciones generales</td>
                                                                    <td>Estandarizada por NIST, ampliamente soportada</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>P-384 (secp384r1)</td>
                                                                    <td>384</td>
                                                                    <td>Aplicaciones de alta seguridad</td>
                                                                    <td>Mayor seguridad que P-256</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>P-521 (secp521r1)</td>
                                                                    <td>521</td>
                                                                    <td>Seguridad a muy largo plazo</td>
                                                                    <td>Máximo nivel de seguridad en curvas NIST</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Curve25519</td>
                                                                    <td>255</td>
                                                                    <td>ECDH moderno, VPNs, mensajería</td>
                                                                    <td>Diseñada para eficiencia y resistencia a implementaciones inseguras</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Ed25519</td>
                                                                    <td>255</td>
                                                                    <td>Firmas digitales, SSH, certificados</td>
                                                                    <td>Variante de Edwards de Curve25519 optimizada para firmas</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>secp256k1</td>
                                                                    <td>256</td>
                                                                    <td>Bitcoin, criptomonedas</td>
                                                                    <td>Usada en Bitcoin y otras blockchain, no es curva NIST</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Consideraciones de Implementación</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Generación Segura de Claves</h4>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            <li>Uso de generadores de números aleatorios criptográficamente seguros (CSPRNG)</li>
                                                            <li>La clave privada debe ser un entero en el rango [1, n-1] donde n es el orden del punto base</li>
                                                            <li>La clave pública Q se calcula como Q = d·G donde d es la clave privada y G el punto base</li>
                                                            <li>Validación de puntos para prevenir ataques de punto inválido</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Desafíos de Implementación</h4>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            <li>Implementación resistente a ataques de canal lateral (timing, etc.)</li>
                                                            <li>Prevención de ataques de revelación de clave privada</li>
                                                            <li>Manejo adecuado de generación de números aleatorios (crítico para ECDSA)</li>
                                                            <li>Uso de aritmética constante en tiempo para operaciones con claves privadas</li>
                                                            <li>Selección de curvas apropiadas según el caso de uso</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Controversias sobre Curvas NIST</h3>
                                                        <div className="text-sm">
                                                            <p>Existe cierta controversia respecto a las curvas estandarizadas por NIST:</p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Tras las revelaciones de Snowden, surgieron preocupaciones sobre posibles debilidades intencionadas</li>
                                                                <li>Los parámetros de estas curvas se generaron usando semillas cuyo origen no es completamente transparente</li>
                                                                <li>Como alternativa, muchos prefieren curvas como Curve25519 o curvas Edwards, que fueron diseñadas con criterios más transparentes</li>
                                                                <li>Daniel J. Bernstein y Tanja Lange han sido críticos de las curvas NIST y han propuesto alternativas más seguras</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de ECC</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Seguridad Web y TLS</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiLock className="mr-2 text-primary" />
                                                                Protocolos de Internet
                                                            </h4>
                                                            <p className="mb-3">
                                                                ECC ha sido ampliamente adoptado en protocolos de seguridad web:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>TLS 1.3 prioriza cifrados basados en ECDHE para intercambio de claves</li>
                                                                <li>Certificados de sitios web firmados con ECDSA son cada vez más comunes</li>
                                                                <li>Reduce el tamaño de los paquetes TLS, mejorando la velocidad de carga</li>
                                                                <li>Menor consumo de CPU en servidores con alto volumen de conexiones</li>
                                                            </ul>
                                                            <div className="alert alert-success mt-3 text-sm">
                                                                <FiInfo className="w-5 h-5 mr-2" />
                                                                CloudFlare, una de las CDN más grandes del mundo, utiliza certificados ECC para millones de sitios web debido a su eficiencia.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Criptomonedas y Blockchain</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiBriefcase className="mr-2 text-secondary" />
                                                                Finanzas Descentralizadas
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">Bitcoin:</span> Utiliza secp256k1 para ECDSA en la firma de transacciones</li>
                                                                <li><span className="font-medium">Ethereum:</span> Emplea ECDSA y derivación de direcciones con curvas elípticas</li>
                                                                <li><span className="font-medium">Wallets:</span> Las direcciones de criptomonedas se derivan de claves públicas ECC</li>
                                                                <li><span className="font-medium">Smart contracts:</span> Verificación de firmas ECDSA en contratos inteligentes</li>
                                                                <li><span className="font-medium">Schnorr signatures:</span> Mejoras basadas en ECC para mayor privacidad y eficiencia</li>
                                                            </ul>
                                                            <p className="mt-3 text-sm">
                                                                La adopción mundial de criptomonedas ha convertido a ECC en una de las tecnologías criptográficas más utilizadas.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Dispositivos Móviles y IoT</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiSmartphone className="mr-2 text-accent" />
                                                                Entornos Restringidos
                                                            </h4>
                                                            <p className="mb-3">
                                                                ECC es ideal para dispositivos con recursos limitados:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Menor consumo de energía que RSA para el mismo nivel de seguridad</li>
                                                                <li>Claves más pequeñas que requieren menos memoria y ancho de banda</li>
                                                                <li>Aplicaciones de mensajería segura en móviles (Signal, WhatsApp)</li>
                                                                <li>Autenticación en dispositivos IoT con capacidad de cómputo limitada</li>
                                                                <li>Comunicación segura entre sensores y hubs en redes inteligentes</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Seguridad Empresarial</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiShield className="mr-2 text-info" />
                                                                Aplicaciones Corporativas
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">VPNs:</span> Autenticación y establecimiento de canales seguros</li>
                                                                <li><span className="font-medium">Smartcards:</span> Tarjetas de identificación corporativas</li>
                                                                <li><span className="font-medium">SSH:</span> El protocolo SSH soporta claves basadas en ECC</li>
                                                                <li><span className="font-medium">Firma de código:</span> Para control de integridad de software</li>
                                                                <li><span className="font-medium">Firma de documentos:</span> Contratos electrónicos y documentos legales</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Comparación de Rendimiento</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="mb-3">
                                                        ECC ofrece ventajas significativas de rendimiento sobre RSA:
                                                    </p>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Operación</th>
                                                                    <th>RSA 2048</th>
                                                                    <th>ECC 256</th>
                                                                    <th>Ventaja de ECC</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Generación de claves</td>
                                                                    <td>Lenta</td>
                                                                    <td>Muy rápida</td>
                                                                    <td>~10-40x más rápido</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Firma</td>
                                                                    <td>Rápida</td>
                                                                    <td>Rápida</td>
                                                                    <td>Similar o ligeramente más rápido</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Verificación</td>
                                                                    <td>Lenta</td>
                                                                    <td>Moderada</td>
                                                                    <td>~2-5x más rápido</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Tamaño de clave</td>
                                                                    <td>2048 bits</td>
                                                                    <td>256 bits</td>
                                                                    <td>~8x más pequeña</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Tamaño de firma</td>
                                                                    <td>2048 bits</td>
                                                                    <td>512 bits</td>
                                                                    <td>~4x más pequeña</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Consumo de energía</td>
                                                                    <td>Alto</td>
                                                                    <td>Bajo</td>
                                                                    <td>~8-15x menos energía</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiCpu className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Soporte en Hardware</h3>
                                                        <div className="text-sm">
                                                            <p>El soporte de ECC en hardware está aumentando rápidamente:</p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Intel incluye instrucciones específicas para ECC en procesadores modernos</li>
                                                                <li>ARM ha integrado aceleradores para curvas elípticas en sus diseños</li>
                                                                <li>Módulos criptográficos de hardware (HSM) soportan amplias operaciones ECC</li>
                                                                <li>Chips dedicados para IoT integran operaciones ECC eficientes en energía</li>
                                                                <li>Tarjetas inteligentes y tokens de seguridad implementan ECC en hardware</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-between mt-6">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleAlgorithmChange('dh')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: Diffie-Hellman
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
                                <h2 className="card-title text-2xl mb-6">Ejercicio Práctico: Implementación de Criptografía Asimétrica</h2>

                                {practicalCompleted ? (
                                    <div className="alert alert-success mb-6">
                                        <FiCheckCircle className="w-6 h-6" />
                                        <span>¡Excelente trabajo! Tu implementación ha pasado todas las pruebas.</span>
                                    </div>
                                ) : (
                                    <p className="mb-6">
                                        En este ejercicio, implementarás funciones básicas de criptografía asimétrica utilizando RSA y ECC.
                                        Sigue las instrucciones y completa el código requerido.
                                    </p>
                                )}

                                <div className="card bg-base-100 shadow-md mb-6">
                                    <div className="card-body">
                                        <h3 className="card-title text-lg">
                                            <FiFileText className="mr-2 text-primary" />
                                            Instrucciones
                                        </h3>
                                        <ol className="list-decimal list-inside space-y-2">
                                            <li>Implementa funciones para generar pares de claves RSA y ECC</li>
                                            <li>Crea funciones de cifrado y descifrado utilizando RSA</li>
                                            <li>Implementa una función para firmar mensajes con RSA o ECDSA</li>
                                            <li>Desarrolla una función para verificar firmas digitales</li>
                                            <li>Implementa un intercambio de claves basado en Diffie-Hellman o ECDH</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="tabs tabs-boxed mb-4">
                                        <button className="tab tab-active">JavaScript</button>
                                        <button className="tab">Python</button>
                                        <button className="tab">Java</button>
                                    </div>

                                    <div className="mockup-code bg-base-300 text-base-content">

                                    </div>
                                </div>

                                <div className="card bg-base-100 shadow-md mb-6">
                                    <div className="card-body">
                                        <h3 className="card-title text-lg">
                                            <FiHelpCircle className="mr-2 text-secondary" />
                                            Recursos útiles
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Puedes utilizar bibliotecas criptográficas estándar para tu implementación</li>
                                            <li>Para JavaScript, considera usar Web Crypto API, node-rsa, o la biblioteca crypto de Node.js</li>
                                            <li>Asegúrate de manejar correctamente los formatos de clave (PEM, DER, JWK, etc.)</li>
                                            <li>Recuerda que los mensajes para RSA deben ser más pequeños que el tamaño de la clave</li>
                                            <li>Para ECDSA y ECDH, considera usar curvas estándar como P-256 o Curve25519</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="card bg-base-300 shadow-md mb-6">
                                    <div className="card-body">
                                        <h3 className="card-title text-lg">
                                            <FiCode className="mr-2 text-accent" />
                                            Ejemplo de uso
                                        </h3>
                                        <div className="mockup-code bg-base-100 text-base-content">
                                            <pre data-prefix="1"><code>// Ejemplo de cómo usar las funciones que implementarás</code></pre>
                                            <pre data-prefix="2"><code></code></pre>
                                            <pre data-prefix="3"><code>// Generar par de claves RSA</code></pre>
                                            <pre data-prefix="5"><code></code></pre>
                                            <pre data-prefix="6"><code>// Cifrar un mensaje</code></pre>
                                            <pre data-prefix="7"><code>const message = "Mensaje secreto para encriptar";</code></pre>
                                            <pre data-prefix="8"><code>const encryptedMessage = rsaEncrypt(publicKey, message);</code></pre>
                                            <pre data-prefix="9"><code>console.log("Mensaje cifrado:", encryptedMessage);</code></pre>
                                            <pre data-prefix="10"><code></code></pre>
                                            <pre data-prefix="11"><code>// Descifrar el mensaje</code></pre>
                                            <pre data-prefix="12"><code>const decryptedMessage = rsaDecrypt(privateKey, encryptedMessage);</code></pre>
                                            <pre data-prefix="13"><code>console.log("Mensaje descifrado:", decryptedMessage);</code></pre>
                                            <pre data-prefix="14"><code></code></pre>
                                            <pre data-prefix="15"><code>// Firmar un mensaje</code></pre>
                                            <pre data-prefix="16"><code>const signature = signMessage(privateKey, message);</code></pre>
                                            <pre data-prefix="17"><code>const isValid = verifySignature(publicKey, message, signature);</code></pre>
                                            <pre data-prefix="18"><code>console.log("¿Firma válida?", isValid);</code></pre>
                                        </div>
                                    </div>
                                </div>

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
                                    <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Criptografía Asimétrica</h2>
                                    <p className="text-lg mb-6">Has dominado los conceptos fundamentales de los sistemas de clave pública y sus aplicaciones en la seguridad moderna.</p>

                                    <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                                                <FiKey className="h-5 w-5" />
                                                Experto en Criptografía Asimétrica
                                            </div>
                                        </div>
                                        <p>Has demostrado un conocimiento sólido de los sistemas de clave pública, incluyendo RSA, Diffie-Hellman y Curvas Elípticas, así como sus aplicaciones prácticas.</p>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4">Conocimientos adquiridos</h3>
                                    <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 space-y-2">
                                        <li>Fundamentos matemáticos de la criptografía asimétrica</li>
                                        <li>Algoritmos RSA, Diffie-Hellman y Criptografía de Curva Elíptica</li>
                                        <li>Intercambio seguro de claves sobre canales inseguros</li>
                                        <li>Firmas digitales y sus aplicaciones</li>
                                        <li>Consideraciones prácticas de implementación y seguridad</li>
                                    </ul>

                                    <div className="alert alert-info shadow-lg mb-6 text-left">
                                        <div>
                                            <FiHelpCircle className="w-6 h-6" />
                                            <div>
                                                <h3 className="font-bold">Próximos pasos</h3>
                                                <p>Para expandir tus conocimientos en seguridad criptográfica, te recomendamos explorar el módulo "Certificados Digitales y PKI" para entender cómo se gestiona la confianza en la infraestructura de clave pública, o "Protocolos Criptográficos" para aprender cómo se combinan diferentes sistemas criptográficos en protocolos seguros.</p>
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
                <p>© 2023 Plataforma de Aprendizaje de Criptografía</p>
            </footer>

            {/* Congratulations Modal */}
            {showCongratulations && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">¡Excelente trabajo!</h3>
                        <p className="py-4">Has completado exitosamente el módulo de Criptografía Asimétrica. Tu logro ha sido registrado y ahora formas parte de los Expertos en Criptografía Asimétrica.</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowCongratulations(false)}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}