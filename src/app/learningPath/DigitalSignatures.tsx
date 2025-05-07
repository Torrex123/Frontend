"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
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
    FiServer,
    FiCode,
    FiZap,
    FiCpu,
    FiSmartphone,
    FiAlertTriangle,
    FiTarget,
    FiGitCommit
} from 'react-icons/fi';

import { FaFingerprint } from 'react-icons/fa';

import confetti from 'canvas-confetti';

// Types for our application
type SignatureType = 'rsa-pss' | 'ecdsa';
type ProgressStage = 'learning' | 'quiz' | 'practical' | 'completed';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

export default function DigitalSignatures() {
    // State management
    const [currentSignature, setCurrentSignature] = useState<SignatureType>('rsa-pss');
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
            question: "¿Cuál es el propósito principal de una firma digital?",
            options: [
                "Cifrar mensajes para mantenerlos confidenciales",
                "Verificar la identidad del remitente y la integridad del mensaje",
                "Acelerar la transmisión de datos en redes",
                "Comprimir archivos para un almacenamiento eficiente"
            ],
            correctAnswer: "Verificar la identidad del remitente y la integridad del mensaje"
        },
        {
            id: 2,
            question: "¿Qué tipo de clave se utiliza para generar una firma digital?",
            options: [
                "Clave pública",
                "Clave simétrica",
                "Clave privada",
                "Función hash"
            ],
            correctAnswer: "Clave privada"
        },
        {
            id: 3,
            question: "¿Cuál es una ventaja principal de ECDSA sobre RSA-PSS?",
            options: [
                "Mayor resistencia a ataques cuánticos",
                "Firmas más pequeñas y generación más rápida con el mismo nivel de seguridad",
                "Mejor compatibilidad con sistemas antiguos",
                "Descentralización completa"
            ],
            correctAnswer: "Firmas más pequeñas y generación más rápida con el mismo nivel de seguridad"
        },
        {
            id: 4,
            question: "En RSA-PSS, ¿qué significa PSS?",
            options: [
                "Public Signature Standard",
                "Private Secure System",
                "Probabilistic Signature Scheme",
                "Protected Signing Service"
            ],
            correctAnswer: "Probabilistic Signature Scheme"
        },
        {
            id: 5,
            question: "¿Qué problema resuelve el uso de un esquema probabilístico como PSS en RSA?",
            options: [
                "Mejora la velocidad de procesamiento",
                "Reduce el tamaño de las firmas",
                "Mitiga ataques de falsificación existencial",
                "Elimina la necesidad de un nonce"
            ],
            correctAnswer: "Mitiga ataques de falsificación existencial"
        }
    ]);

    // Update progress based on current signature algorithm and stage
    useEffect(() => {
        let newProgress = 0;

        // Base progress on current signature type
        if (currentSignature === 'rsa-pss') newProgress = 0;
        else if (currentSignature === 'ecdsa') newProgress = 40;

        // Adjust based on stage
        if (stage === 'quiz') newProgress = 80;
        else if (stage === 'practical') newProgress = 90;
        else if (stage === 'completed') newProgress = 100;

        setProgress(newProgress);
    }, [currentSignature, stage]);

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

    // Navigate between different signature algorithms
    const handleSignatureChange = (signature: SignatureType) => {
        setCurrentSignature(signature);
        setActiveTab('info');
    };

    // Navigate to the quiz when all signature algorithms are reviewed
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
                    <h1 className="text-3xl font-bold text-center">Firmas Digitales</h1>

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
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentSignature === 'rsa-pss' ? 'border-primary bg-primary text-primary-content' : progress >= 40 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiKey className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">RSA-PSS</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 40 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentSignature === 'ecdsa' ? 'border-primary bg-primary text-primary-content' : progress >= 80 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiTarget className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">ECDSA</span>
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
                {/* Learning Stage - Display content based on current signature algorithm */}
                {stage === 'learning' && (
                    <div className="max-w-4xl mx-auto">
                        {/* Signature Algorithm Navigation Tabs */}
                        <div className="tabs tabs-boxed mb-6 justify-center">
                            <button
                                className={`tab ${currentSignature === 'rsa-pss' ? 'tab-active' : ''}`}
                                onClick={() => handleSignatureChange('rsa-pss')}
                            >
                                RSA-PSS
                            </button>
                            <button
                                className={`tab ${currentSignature === 'ecdsa' ? 'tab-active' : ''}`}
                                onClick={() => handleSignatureChange('ecdsa')}
                            >
                                ECDSA
                            </button>
                        </div>

                        {/* Content Tabs for current signature algorithm */}
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

                        {/* RSA-PSS Content */}
                        {currentSignature === 'rsa-pss' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">RSA-PSS (Probabilistic Signature Scheme)</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        RSA-PSS es una variante avanzada de la firma digital RSA que utiliza un enfoque probabilístico,
                                                        mejorando significativamente la seguridad respecto a los esquemas tradicionales de RSA.
                                                        Fue propuesto por Mihir Bellare y Phillip Rogaway en 1996 y actualmente es considerado el estándar
                                                        para las firmas RSA modernas.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Esquema probabilístico que genera firmas diferentes cada vez, incluso para el mismo mensaje</li>
                                                        <li>Basado en el algoritmo RSA y sus principios matemáticos de factorización</li>
                                                        <li>Incorpora un componente aleatorio (salt) para mejorar la seguridad</li>
                                                        <li>Fuertes garantías de seguridad probables bajo el modelo de oráculo aleatorio</li>
                                                        <li>Estandarizado en PKCS#1 v2.1 y RFC 8017</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Importancia en la Seguridad Digital</h3>
                                                    <p className="mb-4">
                                                        RSA-PSS representa una evolución importante en las firmas digitales por:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Mayor resistencia a ataques de falsificación existencial</li>
                                                        <li>Protección contra vulnerabilidades encontradas en los esquemas RSA tradicionales</li>
                                                        <li>Cumplimiento con estándares modernos de seguridad criptográfica</li>
                                                        <li>Amplia adopción en infraestructuras de clave pública (PKI)</li>
                                                        <li>Compatibilidad con aplicaciones que requieren firmas digitales robustas</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiHelpCircle className="text-primary" />
                                                                ¿Por qué PSS?
                                                            </h3>
                                                            <p className="mb-4">
                                                                El esquema tradicional RSA-PKCS#1 v1.5 tiene vulnerabilidades conocidas. PSS (Probabilistic Signature Scheme) añade:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Aleatoriedad en cada firma generada</li>
                                                                <li>Pruebas formales de seguridad</li>
                                                                <li>Mayor resistencia a ataques adaptativos</li>
                                                                <li>Mejor protección contra técnicas de análisis avanzadas</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiShield className="text-secondary" />
                                                                PSS vs PKCS#1 v1.5
                                                            </h3>
                                                            <p className="text-sm">
                                                                Mientras que PKCS#1 v1.5 utiliza un esquema determinista, RSA-PSS incorpora sal (salt) aleatoria y una función máscara (MGF) más sofisticada.
                                                                Esto hace que sea prácticamente imposible generar la misma firma dos veces para un mensaje idéntico, incluso usando la misma clave.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de RSA-PSS</h2>

                                            <h3 className="text-xl font-bold mb-3">Funcionamiento del Esquema</h3>
                                            <p className="mb-4">
                                                RSA-PSS es un algoritmo de firma que combina la fortaleza matemática de RSA con técnicas avanzadas de codificación y aleatorización.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Generación de Firma</h4>
                                                        <ol className="list-decimal list-inside text-sm space-y-1">
                                                            <li>Se aplica una función hash al mensaje (típicamente SHA-256 o SHA-512)</li>
                                                            <li>Se genera un valor aleatorio (salt) de longitud fija</li>
                                                            <li>Se concatena el hash del mensaje y la sal</li>
                                                            <li>Se aplica una segunda función hash a esta concatenación</li>
                                                            <li>Se genera una máscara utilizando MGF (Mask Generation Function)</li>
                                                            <li>Se combinan estos elementos según el formato PSS</li>
                                                            <li>Se aplica la transformación RSA (operación de exponenciación modular con clave privada)</li>
                                                            <li>El resultado es la firma digital</li>
                                                        </ol>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Verificación de Firma</h4>
                                                        <ol className="list-decimal list-inside text-sm space-y-1">
                                                            <li>Se aplica la transformación RSA (exponenciación modular con clave pública)</li>
                                                            <li>Se verifica que el resultado tenga el formato correcto según PSS</li>
                                                            <li>Se extrae la máscaración y se recupera el hash original</li>
                                                            <li>Se calcula el hash del mensaje original</li>
                                                            <li>Se compara el hash recuperado con el hash calculado</li>
                                                            <li>Si coinciden, la firma es válida; de lo contrario, es inválida</li>
                                                        </ol>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Componentes Clave</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Componente</th>
                                                            <th>Descripción</th>
                                                            <th>Importancia</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Función Hash</td>
                                                            <td>Función criptográfica unidireccional (SHA-256, SHA-512)</td>
                                                            <td>Garantiza integridad y resistencia a colisiones</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Sal (Salt)</td>
                                                            <td>Valor aleatorio generado durante el proceso de firma</td>
                                                            <td>Proporciona el componente probabilístico, aumentando seguridad</td>
                                                        </tr>
                                                        <tr>
                                                            <td>MGF (Mask Generation Function)</td>
                                                            <td>Función que expande una entrada corta en una salida más larga</td>
                                                            <td>Generalmente utiliza MGF1 basada en funciones hash</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Transformación RSA</td>
                                                            <td>Operación matemática de exponenciación modular</td>
                                                            <td>Base criptográfica del algoritmo RSA</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Parámetros y Tamaños Recomendados</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Parámetro</th>
                                                                    <th>Tamaño Recomendado</th>
                                                                    <th>Notas</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Módulo RSA (n)</td>
                                                                    <td>2048, 3072 o 4096 bits</td>
                                                                    <td>2048 bits es el mínimo recomendado actualmente</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Función Hash</td>
                                                                    <td>SHA-256 o SHA-512</td>
                                                                    <td>Debe coincidir con el nivel de seguridad de la clave RSA</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Tamaño de Sal</td>
                                                                    <td>Igual al tamaño de la salida hash</td>
                                                                    <td>p.ej., 32 bytes para SHA-256</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>MGF</td>
                                                                    <td>MGF1 basada en la misma función hash</td>
                                                                    <td>Definida en PKCS#1 v2.1</td>
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
                                                        <h3 className="font-bold">Seguridad Matemática</h3>
                                                        <div className="text-sm">
                                                            La seguridad de RSA-PSS se basa en la dificultad del problema de factorización de enteros grandes.
                                                            Además, el esquema PSS proporciona seguridad demostrable en el modelo de oráculo aleatorio,
                                                            lo que significa que romper RSA-PSS es tan difícil como romper el propio RSA, siempre que se
                                                            utilicen parámetros adecuados.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de RSA-PSS</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Infraestructura de Clave Pública (PKI)</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiKey className="mr-2 text-primary" />
                                                                Certificados Digitales
                                                            </h4>
                                                            <p className="mb-3">
                                                                RSA-PSS se utiliza para firmar certificados digitales X.509 en modernos sistemas PKI:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Autoridades de Certificación (CA) utilizan RSA-PSS para firmar certificados</li>
                                                                <li>TLS/SSL para conexiones seguras en internet</li>
                                                                <li>Firma de código para proteger la distribución de software</li>
                                                                <li>Sistemas de autenticación basados en certificados</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Servicios Gubernamentales</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiShield className="mr-2 text-secondary" />
                                                                Firma Electrónica
                                                            </h4>
                                                            <ul className="list-disc list-inside mb-3">
                                                                <li>Documentos legales electrónicos</li>
                                                                <li>Sistemas de voto electrónico</li>
                                                                <li>Pasaportes y documentos de identidad electrónicos</li>
                                                                <li>Declaraciones de impuestos digitales</li>
                                                            </ul>
                                                            <p className="text-sm">
                                                                RSA-PSS cumple con los requisitos legales y técnicos para firmas electrónicas
                                                                en muchas jurisdicciones debido a su seguridad demostrable.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Protocolos y Estándares</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiGlobe className="mr-2 text-accent" />
                                                                Comunicaciones Seguras
                                                            </h4>
                                                            <p className="text-sm">
                                                                RSA-PSS se utiliza en TLS 1.3 y TLS 1.2 como algoritmo de firma digital.
                                                                También se implementa en protocolos como S/MIME para correo electrónico seguro
                                                                y en OpenPGP para cifrado de comunicaciones.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiFileText className="mr-2 text-info" />
                                                                Firma de Documentos
                                                            </h4>
                                                            <p className="text-sm">
                                                                Adobe PDF utiliza RSA-PSS para su esquema de firma digital avanzada.
                                                                Muchas plataformas de gestión documental empresarial implementan
                                                                RSA-PSS para garantizar la autenticidad e integridad de los documentos.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiServer className="mr-2 text-success" />
                                                                Seguridad en Infraestructura
                                                            </h4>
                                                            <p className="text-sm">
                                                                Firmas de actualizaciones de firmware y software.
                                                                Autenticación en sistemas de control industrial.
                                                                Verificación de integridad en sistemas críticos.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg mb-6">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Consideraciones para el Futuro</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                Aunque RSA-PSS sigue siendo seguro con tamaños de clave adecuados,
                                                                los avances en la computación cuántica representan una amenaza a largo plazo.
                                                                Las organizaciones con necesidades de seguridad a largo plazo deben considerar:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Aumentar regularmente los tamaños de clave RSA</li>
                                                                <li>Planificar la transición a algoritmos post-cuánticos</li>
                                                                <li>Implementar esquemas híbridos cuando sea posible</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-6">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleSignatureChange('ecdsa')}
                                        >
                                            Siguiente: ECDSA <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ECDSA Content */}
                        {currentSignature === 'ecdsa' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">ECDSA (Elliptic Curve Digital Signature Algorithm)</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        ECDSA es un algoritmo de firma digital que utiliza criptografía de curva elíptica, una alternativa
                                                        moderna a RSA que ofrece el mismo nivel de seguridad con claves mucho más pequeñas.
                                                        Fue propuesto en 1992 por Scott Vanstone como una variante basada en curvas elípticas del algoritmo DSA.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Basado en la matemática de curvas elípticas sobre campos finitos</li>
                                                        <li>Genera firmas mucho más pequeñas que RSA para el mismo nivel de seguridad</li>
                                                        <li>Requiere menos recursos computacionales para generar y verificar firmas</li>
                                                        <li>Ideal para dispositivos con restricciones de recursos (IoT, tarjetas inteligentes)</li>
                                                        <li>Ampliamente adoptado en protocolos modernos de seguridad</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Ventajas sobre RSA</h3>
                                                    <p className="mb-4">
                                                        ECDSA ofrece varias ventajas significativas sobre RSA-PSS:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Tamaños de clave más pequeños (256 bits en ECDSA vs 2048+ bits en RSA)</li>
                                                        <li>Firmas más compactas (64 bytes vs 256+ bytes)</li>
                                                        <li>Generación de firmas significativamente más rápida</li>
                                                        <li>Menor consumo de energía, ideal para dispositivos móviles</li>
                                                        <li>Mejor rendimiento en sistemas con limitaciones de memoria</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiTarget className="text-primary" />
                                                                Curvas Estándar
                                                            </h3>
                                                            <p className="text-sm mb-3">
                                                                Las curvas elípticas más utilizadas en ECDSA incluyen:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li><span className="font-medium">P-256 (secp256r1):</span> Estándar NIST, muy utilizada</li>
                                                                <li><span className="font-medium">secp256k1:</span> Utilizada en Bitcoin y otras criptomonedas</li>
                                                                <li><span className="font-medium">Curve25519:</span> Diseñada para EdDSA, variante de ECDSA</li>
                                                                <li><span className="font-medium">brainpoolP256r1:</span> Curva estándar europea</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiZap className="text-secondary" />
                                                                Equivalencia de Seguridad
                                                            </h3>
                                                            <div className="overflow-x-auto">
                                                                <table className="table w-full text-sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>ECDSA</th>
                                                                            <th>RSA</th>
                                                                            <th>Nivel de Seguridad</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>256 bits</td>
                                                                            <td>3072 bits</td>
                                                                            <td>128 bits</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>384 bits</td>
                                                                            <td>7680 bits</td>
                                                                            <td>192 bits</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>521 bits</td>
                                                                            <td>15360 bits</td>
                                                                            <td>256 bits</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de ECDSA</h2>

                                            <h3 className="text-xl font-bold mb-3">Fundamentos Matemáticos</h3>
                                            <p className="mb-4">
                                                ECDSA se basa en las propiedades matemáticas de las curvas elípticas definidas sobre campos finitos,
                                                aprovechando el problema del logaritmo discreto en curvas elípticas (ECDLP).
                                            </p>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">Curvas Elípticas</h4>
                                                    <p>
                                                        Una curva elíptica sobre un campo finito se define generalmente mediante la ecuación de Weierstrass:
                                                    </p>
                                                    <p className="bg-base-300 p-2 rounded-md text-center my-2">
                                                        y² = x³ + ax + b (mod p)
                                                    </p>
                                                    <p className="text-sm">
                                                        Donde <span className="font-mono">a</span> y <span className="font-mono">b</span> son constantes que definen la curva,
                                                        y <span className="font-mono">p</span> es un número primo grande (para curvas sobre campos primos).
                                                        Los puntos de la curva, junto con un "punto en el infinito", forman un grupo bajo una operación especial de "suma de puntos".
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Generación de Claves</h4>
                                                        <ol className="list-decimal list-inside text-sm space-y-1">
                                                            <li>Se selecciona una curva elíptica E con un punto generador G de orden n</li>
                                                            <li>Se elige un número aleatorio d (entero) como clave privada, donde 1 ≤ d ≤ n-1</li>
                                                            <li>Se calcula Q = d × G (multiplicación escalar en la curva)</li>
                                                            <li>La clave pública es el punto Q en la curva</li>
                                                            <li>Los parámetros públicos incluyen E, G, n y Q</li>
                                                        </ol>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Proceso de Firma</h4>
                                                        <ol className="list-decimal list-inside text-sm space-y-1">
                                                            <li>Se calcula el hash h del mensaje a firmar</li>
                                                            <li>Se selecciona un número aleatorio k (efímero), donde 1 ≤ k ≤ n-1</li>
                                                            <li>Se calcula el punto R = k × G y se obtiene r = x-coordenada de R (mod n)</li>
                                                            <li>Si r = 0, se vuelve al paso 2</li>
                                                            <li>Se calcula s = k⁻¹(h + r·d) mod n</li>
                                                            <li>Si s = 0, se vuelve al paso 2</li>
                                                            <li>La firma es el par (r, s)</li>
                                                        </ol>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">Verificación de Firma</h4>
                                                    <ol className="list-decimal list-inside text-sm space-y-1">
                                                        <li>Verificar que r y s son enteros en el rango [1, n-1]</li>
                                                        <li>Calcular el hash h del mensaje recibido (usando la misma función hash)</li>
                                                        <li>Calcular w = s⁻¹ mod n</li>
                                                        <li>Calcular u₁ = h·w mod n y u₂ = r·w mod n</li>
                                                        <li>Calcular el punto P = u₁ × G + u₂ × Q</li>
                                                        <li>Si P es el punto en el infinito, rechazar la firma</li>
                                                        <li>Calcular v = x-coordenada de P (mod n)</li>
                                                        <li>La firma es válida si y solo si v = r</li>
                                                    </ol>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Consideraciones de Seguridad</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-bold">Generación de Números Aleatorios</h4>
                                                            <p className="text-sm">
                                                                La seguridad de ECDSA depende críticamente de la calidad del número aleatorio k (nonce)
                                                                utilizado en la firma. La reutilización o predicción de k puede llevar a la recuperación
                                                                de la clave privada. Este fue el caso de varios fallos de seguridad notables, incluido
                                                                un problema en la implementación de PlayStation 3.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">Selección de Curvas</h4>
                                                            <p className="text-sm">
                                                                No todas las curvas elípticas ofrecen el mismo nivel de seguridad. Es importante
                                                                utilizar curvas estandarizadas y bien auditadas. Algunos expertos en criptografía
                                                                han expresado preocupaciones sobre ciertas curvas NIST debido a posibles debilidades
                                                                o backdoors, lo que ha llevado al desarrollo de curvas alternativas como Curve25519.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Variantes de ECDSA</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Variante</th>
                                                            <th>Características</th>
                                                            <th>Aplicaciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>ECDSA Estándar</td>
                                                            <td>Implementación según estándares ANSI X9.62, FIPS 186-4</td>
                                                            <td>PKI, TLS, aplicaciones empresariales</td>
                                                        </tr>
                                                        <tr>
                                                            <td>EdDSA (Ed25519)</td>
                                                            <td>Variante que utiliza curvas Edwards, con mejor resistencia a ataques de canal lateral</td>
                                                            <td>SSH, sistemas de alta seguridad, criptomonedas</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Schnorr (sobre curvas elípticas)</td>
                                                            <td>Esquema de firma más simple con propiedades de agregación</td>
                                                            <td>Bitcoin (BIP-340), protocolos de privacidad</td>
                                                        </tr>
                                                        <tr>
                                                            <td>SM2</td>
                                                            <td>Variante china de ECDSA con curvas específicas</td>
                                                            <td>Infraestructura nacional china, comercio electrónico en China</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Determinismo en ECDSA</h3>
                                                        <div className="text-sm">
                                                            Para mitigar los riesgos asociados con la generación débil de números aleatorios,
                                                            existe una variante de ECDSA conocida como "ECDSA determinista" (RFC 6979), donde el
                                                            nonce k se deriva determinísticamente del mensaje y la clave privada usando una función
                                                            HMAC. Esto elimina la necesidad de un generador de números aleatorios y previene la
                                                            reutilización de k sin comprometer la seguridad.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de ECDSA</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Blockchain y Criptomonedas</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiGitCommit className="mr-2 text-primary" />
                                                                Criptomonedas
                                                            </h4>
                                                            <p className="mb-3">
                                                                ECDSA es fundamental en varias tecnologías blockchain:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Bitcoin utiliza ECDSA con la curva secp256k1 para firmar transacciones</li>
                                                                <li>Ethereum también utiliza ECDSA para autenticar transacciones y mensaje</li>
                                                                <li>Muchas otras criptomonedas y tokens adoptan variantes de ECDSA</li>
                                                                <li>Los monederos hardware y software implementan ECDSA para proteger activos digitales</li>
                                                            </ul>
                                                            <p className="text-sm mt-3">
                                                                Las claves pequeñas y las firmas compactas de ECDSA son ideales para blockchain,
                                                                donde el espacio en la cadena es valioso y los recursos computacionales pueden ser limitados.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Dispositivos Móviles e IoT</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiSmartphone className="mr-2 text-secondary" />
                                                                Sistemas Embebidos
                                                            </h4>
                                                            <ul className="list-disc list-inside mb-3">
                                                                <li>Autenticación en aplicaciones móviles</li>
                                                                <li>Firmas en dispositivos IoT con recursos limitados</li>
                                                                <li>Tarjetas inteligentes y tokens de seguridad</li>
                                                                <li>Dispositivos médicos implantables</li>
                                                                <li>Sistemas de control industrial con restricciones energéticas</li>
                                                            </ul>
                                                            <p className="text-sm">
                                                                La eficiencia energética y el bajo requerimiento de memoria de ECDSA lo hacen
                                                                ideal para dispositivos con batería o con capacidades computacionales limitadas.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Protocolos y Estándares</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiGlobe className="mr-2 text-accent" />
                                                                Seguridad en Internet
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>TLS/SSL para conexiones web seguras</li>
                                                                <li>SSH para administración remota segura</li>
                                                                <li>IPsec para conexiones VPN</li>
                                                                <li>DNSSEC para seguridad del sistema de nombres de dominio</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiKey className="mr-2 text-info" />
                                                                PKI y Certificados
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Certificados X.509 utilizados en HTTPS</li>
                                                                <li>Infraestructuras de clave pública empresariales</li>
                                                                <li>Tarjetas de identificación electrónica</li>
                                                                <li>Pasaportes electrónicos</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiCpu className="mr-2 text-success" />
                                                                Sistemas Operativos
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Arranque seguro en dispositivos modernos</li>
                                                                <li>Firmado de actualizaciones del sistema</li>
                                                                <li>Verificación de la integridad del código</li>
                                                                <li>Autenticación del kernel y controladores</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Comparativa con RSA-PSS en Aplicaciones Reales</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Escenario</th>
                                                            <th>ECDSA</th>
                                                            <th>RSA-PSS</th>
                                                            <th>Preferencia típica</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Dispositivos móviles</td>
                                                            <td>Excelente (bajo consumo, firmas pequeñas)</td>
                                                            <td>Aceptable (mayor consumo energético)</td>
                                                            <td>ECDSA</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Servidores web</td>
                                                            <td>Muy bueno (generación rápida)</td>
                                                            <td>Bueno (verificación rápida)</td>
                                                            <td>Mixto (ambos son comunes)</td>
                                                        </tr>
                                                        <tr>
                                                            <td>IoT/Sistemas embebidos</td>
                                                            <td>Excelente (requisitos mínimos)</td>
                                                            <td>Deficiente (alto costo computacional)</td>
                                                            <td>ECDSA</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Sistemas legados</td>
                                                            <td>Variable (menor compatibilidad)</td>
                                                            <td>Excelente (amplio soporte)</td>
                                                            <td>RSA-PSS</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Blockchain</td>
                                                            <td>Excelente (eficiencia de almacenamiento)</td>
                                                            <td>Deficiente (firmas demasiado grandes)</td>
                                                            <td>ECDSA</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Futuro de ECDSA</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                Aunque ECDSA ofrece ventajas significativas sobre RSA-PSS, ambos algoritmos
                                                                son vulnerables a la computación cuántica. Los avances en algoritmos cuánticos
                                                                como el algoritmo de Shor podrían comprometer tanto                                                                 la seguridad de RSA como la de ECDSA. La comunidad criptográfica está trabajando
                                                                en alternativas post-cuánticas, y es recomendable seguir los estándares emergentes
                                                                en esta área para aplicaciones con necesidades de seguridad a largo plazo.
                                                            </p>
                                                            <p className="mt-1">
                                                                Mientras tanto, variantes como EdDSA (basada en curvas Edwards) están ganando
                                                                popularidad por sus mejores características de seguridad contra ataques de canal lateral.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-between mt-6">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleSignatureChange('rsa-pss')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: RSA-PSS
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
                                <h2 className="card-title text-2xl mb-6">Ejercicio Práctico: Implementación de Firmas Digitales</h2>

                                {practicalCompleted ? (
                                    <div className="alert alert-success mb-6">
                                        <FiCheckCircle className="w-6 h-6" />
                                        <span>¡Excelente trabajo! Tu implementación ha pasado todas las pruebas.</span>
                                    </div>
                                ) : (
                                    <p className="mb-6">
                                        En este ejercicio, implementarás un sistema básico de firma digital utilizando uno de los algoritmos estudiados.
                                        Sigue las instrucciones y completa el código requerido.
                                    </p>
                                )}

                                {/* Esta sección quedaría en blanco como solicitaste, solo mostrando el esqueleto */}
                                <div className="card bg-base-300 p-6 mb-6">
                                    <h3 className="text-lg font-bold mb-4">Implementación de firma digital</h3>
                                    <div className="bg-base-100 p-4 rounded-md">
                                        {/* Aquí iría el editor de código o la interfaz para implementar el ejercicio práctico */}
                                        <div className="h-40 flex items-center justify-center text-base-content/50">
                                            [Editor de código para implementación de firmas digitales]
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
                                    <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Firmas Digitales</h2>
                                    <p className="text-lg mb-6">Has dominado los conceptos fundamentales de los algoritmos de firma digital modernos y has demostrado habilidades prácticas en su implementación.</p>

                                    <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                                                <FaFingerprint className="h-5 w-5" />
                                                Especialista en Firmas Digitales
                                            </div>
                                        </div>
                                        <p>Has demostrado comprensión teórica y habilidades prácticas en la implementación y uso de algoritmos de firma digital como RSA-PSS y ECDSA.</p>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4">Conocimientos adquiridos</h3>
                                    <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 space-y-2">
                                        <li>Fundamentos de la firma digital y su rol en la seguridad</li>
                                        <li>Diferencias entre algoritmos de firma basados en RSA y en curvas elípticas</li>
                                        <li>Consideraciones de seguridad para implementaciones prácticas</li>
                                        <li>Aplicaciones reales de las firmas digitales en diversos sectores</li>
                                        <li>Ventajas y desventajas de diferentes algoritmos de firma</li>
                                    </ul>

                                    <div className="alert alert-info shadow-lg mb-6 text-left">
                                        <div>
                                            <FiHelpCircle className="w-6 h-6" />
                                            <div>
                                                <h3 className="font-bold">Próximos pasos</h3>
                                                <p>Para seguir aprendiendo, te recomendamos continuar con el módulo "Certificados Digitales y PKI" donde explorarás la infraestructura que hace posible la confianza en Internet. También podrías explorar "Contratos Inteligentes y Blockchain" para ver aplicaciones avanzadas de las firmas digitales en tecnologías descentralizadas.</p>
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