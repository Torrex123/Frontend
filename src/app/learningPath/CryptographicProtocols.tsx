"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiLock,
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
    FiServer,
    FiCode,
    FiDatabase,
    FiMail,
    FiLayers,
    FiSmartphone,
    FiAlertTriangle,
    FiWifi,
    FiTerminal,
    FiDownload,
    FiUpload,
    FiGrid,
    FiMonitor,
    FiShuffle
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

// Types for our application
type ProtocolType = 'ssl-tls' | 'ssh';
type ProgressStage = 'learning' | 'quiz' | 'completed';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

export default function CryptographicProtocols() {
    // State management
    const [currentProtocol, setCurrentProtocol] = useState<ProtocolType>('ssl-tls');
    const [progress, setProgress] = useState<number>(0);
    const [stage, setStage] = useState<ProgressStage>('learning');
    const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
    const [quizPassed, setQuizPassed] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('info');
    const [questionsAnswered, setQuestionsAnswered] = useState<number[]>([]);

    // Quiz state
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            question: "¿Cuál es la principal diferencia entre SSL y TLS?",
            options: [
                "SSL es un protocolo completamente diferente, mientras que TLS es solo para navegadores web",
                "TLS es la evolución de SSL con mejoras de seguridad y correcciones de vulnerabilidades",
                "SSL está enfocado en la autenticación, mientras que TLS se enfoca en el cifrado",
                "SSL es abierto y gratuito, mientras que TLS requiere licencia comercial"
            ],
            correctAnswer: "TLS es la evolución de SSL con mejoras de seguridad y correcciones de vulnerabilidades"
        },
        {
            id: 2,
            question: "¿Qué problema de seguridad crítico resuelve el SSH respecto a protocolos anteriores como Telnet?",
            options: [
                "Mejora la velocidad de conexión en redes lentas",
                "Proporciona cifrado de las comunicaciones, evitando transmisiones en texto plano",
                "Elimina la necesidad de autenticación con usuario y contraseña",
                "Solamente funciona en sistemas operativos basados en Unix"
            ],
            correctAnswer: "Proporciona cifrado de las comunicaciones, evitando transmisiones en texto plano"
        },
        {
            id: 3,
            question: "En TLS 1.3, ¿cuál es una mejora significativa respecto a TLS 1.2?",
            options: [
                "Aumento del tamaño de los certificados para mayor seguridad",
                "Eliminación de algoritmos criptográficos obsoletos o inseguros",
                "Requerimiento de un servidor DNS dedicado",
                "Eliminación de la compatibilidad con navegadores antiguos"
            ],
            correctAnswer: "Eliminación de algoritmos criptográficos obsoletos o inseguros"
        },
        {
            id: 4,
            question: "¿Qué mecanismo de autenticación es más seguro en SSH?",
            options: [
                "Autenticación basada en contraseña",
                "Autenticación basada en host",
                "Autenticación basada en claves públicas/privadas",
                "Autenticación biométrica integrada"
            ],
            correctAnswer: "Autenticación basada en claves públicas/privadas"
        },
        {
            id: 5,
            question: "¿Qué problema resuelve el mecanismo de 'Perfect Forward Secrecy' en TLS?",
            options: [
                "Previene ataques de fuerza bruta contra contraseñas",
                "Protege contra la falsificación de certificados SSL",
                "Garantiza que las sesiones pasadas sigan siendo seguras aunque la clave privada del servidor sea comprometida en el futuro",
                "Elimina la necesidad de Autoridades de Certificación"
            ],
            correctAnswer: "Garantiza que las sesiones pasadas sigan siendo seguras aunque la clave privada del servidor sea comprometida en el futuro"
        }
    ]);

    // Update progress based on current protocol and stage
    useEffect(() => {
        let newProgress = 0;

        // Base progress on current protocol
        if (currentProtocol === 'ssl-tls') newProgress = 0;
        else if (currentProtocol === 'ssh') newProgress = 50;

        // Adjust based on stage
        if (stage === 'quiz') newProgress = 80;
        else if (stage === 'completed') newProgress = 100;

        setProgress(newProgress);
    }, [currentProtocol, stage]);

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
                setStage('completed');
                // Celebrar la finalización exitosa
                confetti({
                    particleCount: 250,
                    spread: 80,
                    origin: { y: 0.6 },
                });
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

    // Navigate between different protocols
    const handleProtocolChange = (protocol: ProtocolType) => {
        setCurrentProtocol(protocol);
        setActiveTab('info');
    };

    // Navigate to the quiz when all protocols are reviewed
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
                    <h1 className="text-3xl font-bold text-center">Protocolos Criptográficos</h1>

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
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentProtocol === 'ssl-tls' ? 'border-primary bg-primary text-primary-content' : progress >= 50 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiGlobe className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">SSL/TLS</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 50 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentProtocol === 'ssh' ? 'border-primary bg-primary text-primary-content' : progress >= 80 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiTerminal className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">SSH</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 80 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${stage === 'quiz' ? 'border-primary bg-primary text-primary-content' : progress >= 100 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiFileText className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Evaluación</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 100 ? '100%' : '0%' }}
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
                {/* Learning Stage - Display content based on current protocol */}
                {stage === 'learning' && (
                    <div className="max-w-4xl mx-auto">
                        {/* Protocol Navigation Tabs */}
                        <div className="tabs tabs-boxed mb-6 justify-center">
                            <button
                                className={`tab ${currentProtocol === 'ssl-tls' ? 'tab-active' : ''}`}
                                onClick={() => handleProtocolChange('ssl-tls')}
                            >
                                SSL/TLS
                            </button>
                            <button
                                className={`tab ${currentProtocol === 'ssh' ? 'tab-active' : ''}`}
                                onClick={() => handleProtocolChange('ssh')}
                            >
                                SSH
                            </button>
                        </div>

                        {/* Content Tabs for current protocol */}
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

                        {/* SSL/TLS Protocol Content */}
                        {currentProtocol === 'ssl-tls' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">SSL/TLS: Secure Sockets Layer y Transport Layer Security</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        SSL (Secure Sockets Layer) y su sucesor TLS (Transport Layer Security) son protocolos criptográficos
                                                        diseñados para proporcionar comunicaciones seguras a través de una red de computadoras, típicamente Internet.
                                                        Estos protocolos son la base de la seguridad en la web moderna y se utilizan ampliamente para proteger
                                                        transacciones en línea, información personal y comunicaciones.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Evolución de SSL a TLS</h3>
                                                    <div className="overflow-x-auto mb-4">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Versión</th>
                                                                    <th>Año</th>
                                                                    <th>Estado</th>
                                                                    <th>Notas</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>SSL 1.0</td>
                                                                    <td>1994</td>
                                                                    <td>Nunca publicado</td>
                                                                    <td>Versión inicial con problemas de seguridad</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>SSL 2.0</td>
                                                                    <td>1995</td>
                                                                    <td>Obsoleto</td>
                                                                    <td>Vulnerabilidades graves, prohibido por RFC 6176</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>SSL 3.0</td>
                                                                    <td>1996</td>
                                                                    <td>Obsoleto</td>
                                                                    <td>Vulnerable a POODLE, prohibido por RFC 7568</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>TLS 1.0</td>
                                                                    <td>1999</td>
                                                                    <td>Obsoleto</td>
                                                                    <td>Basado en SSL 3.0, con mejoras de seguridad</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>TLS 1.1</td>
                                                                    <td>2006</td>
                                                                    <td>Obsoleto</td>
                                                                    <td>Mejoras para prevenir ataques de relleno</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>TLS 1.2</td>
                                                                    <td>2008</td>
                                                                    <td>Ampliamente usado</td>
                                                                    <td>Mayor flexibilidad criptográfica, AEAD</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>TLS 1.3</td>
                                                                    <td>2018</td>
                                                                    <td>Actual</td>
                                                                    <td>Rediseño importante, handshake más rápido, mejor seguridad</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Funciones Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">Confidencialidad</span>: Cifra los datos transmitidos para que solo el destinatario previsto pueda leerlos</li>
                                                        <li><span className="font-medium">Integridad</span>: Garantiza que los datos no sean modificados durante la transmisión</li>
                                                        <li><span className="font-medium">Autenticación</span>: Verifica la identidad de las partes comunicantes, especialmente del servidor</li>
                                                        <li><span className="font-medium">Forward Secrecy</span>: Protege las comunicaciones pasadas si una clave privada se ve comprometida en el futuro</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiLock className="text-primary" />
                                                                HTTPS y SSL/TLS
                                                            </h3>
                                                            <p className="text-sm">
                                                                HTTPS (HTTP Secure) es simplemente HTTP que funciona sobre una conexión TLS/SSL.
                                                                Cuando ves "https://" en la barra de direcciones de tu navegador y un icono de candado,
                                                                significa que la comunicación entre tu navegador y el servidor web está cifrada
                                                                utilizando TLS.
                                                            </p>
                                                            <div className="mt-2 flex items-center gap-2 text-success">
                                                                <FiLock className="w-4 h-4" />
                                                                <span className="text-xs">https://example.com</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiShield className="text-secondary" />
                                                                Certificados SSL/TLS
                                                            </h3>
                                                            <p className="text-sm">
                                                                Los certificados SSL/TLS son documentos digitales que vinculan una clave criptográfica a la información
                                                                de una organización. Los certificados incluyen:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li>Nombre de dominio o servidor</li>
                                                                <li>Organización propietaria</li>
                                                                <li>Ubicación</li>
                                                                <li>Fecha de vencimiento</li>
                                                                <li>Clave pública</li>
                                                                <li>Firma digital de la Autoridad de Certificación (CA)</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de SSL/TLS</h2>

                                            <h3 className="text-xl font-bold mb-3">Arquitectura del Protocolo</h3>
                                            <p className="mb-4">
                                                SSL/TLS opera entre la capa de aplicación y la capa de transporte del modelo OSI.
                                                El protocolo se divide en dos capas principales:
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base flex items-center gap-2">
                                                            <FiLayers className="text-primary" />
                                                            Protocolo de Registro TLS
                                                        </h4>
                                                        <p className="text-sm">
                                                            Esta capa inferior maneja el encapsulamiento de los datos de varios protocolos de capa superior.
                                                            Es responsable de:
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm mt-2">
                                                            <li>Fragmentar los datos en bloques manejables</li>
                                                            <li>Comprimir datos (opcional)</li>
                                                            <li>Aplicar algoritmos de cifrado y MACs (Message Authentication Codes)</li>
                                                            <li>Transmitir los datos cifrados</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base flex items-center gap-2">
                                                            <FiShuffle className="text-secondary" />
                                                            Protocolo de Handshake
                                                        </h4>
                                                        <p className="text-sm">
                                                            Esta capa superior gestiona la autenticación y el establecimiento de los parámetros de cifrado.
                                                            Es responsable de:
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm mt-2">
                                                            <li>Autenticación del servidor (y opcionalmente del cliente)</li>
                                                            <li>Negociación de algoritmos criptográficos</li>
                                                            <li>Establecimiento de claves de sesión</li>
                                                            <li>Verificación de certificados</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Proceso de Handshake en TLS</h3>

                                            <div className="card bg-base-100 shadow-lg mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">TLS 1.2 vs TLS 1.3 Handshake</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h5 className="font-bold text-sm mb-2">TLS 1.2 Handshake (2-RTT)</h5>
                                                            <ol className="list-decimal list-inside text-sm space-y-1">
                                                                <li>Cliente envía ClientHello (versiones TLS, cifrados soportados)</li>
                                                                <li>Servidor responde con ServerHello, certificado, y ServerHelloDone</li>
                                                                <li>Cliente verifica certificado, envía ClientKeyExchange</li>
                                                                <li>Ambas partes calculan claves maestras y de sesión</li>
                                                                <li>Cliente envía ChangeCipherSpec y Finished</li>
                                                                <li>Servidor envía ChangeCipherSpec y Finished</li>
                                                                <li>Comunicación cifrada establecida</li>
                                                            </ol>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-sm mb-2">TLS 1.3 Handshake (1-RTT)</h5>
                                                            <ol className="list-decimal list-inside text-sm space-y-1">
                                                                <li>Cliente envía ClientHello con cifrados y grupos clave soportados y guess de parámetros</li>
                                                                <li>Servidor responde con ServerHello, certificado, y Finished</li>
                                                                <li>Cliente verifica certificado, envía Finished</li>
                                                                <li>Comunicación cifrada establecida</li>
                                                            </ol>
                                                            <p className="text-sm mt-2">
                                                                TLS 1.3 introduce 0-RTT (Zero Round Trip Time) para reconexiones, permitiendo enviar datos en el primer mensaje.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Componentes Criptográficos</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Componente</th>
                                                            <th>TLS 1.2</th>
                                                            <th>TLS 1.3</th>
                                                            <th>Propósito</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Intercambio de claves</td>
                                                            <td>RSA, DH, ECDH, DHE, ECDHE</td>
                                                            <td>ECDHE, DHE solamente</td>
                                                            <td>Establecer claves de sesión compartidas</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Cifrado</td>
                                                            <td>AES-CBC, AES-GCM, 3DES, RC4 (inseguro)</td>
                                                            <td>AES-GCM, AES-CCM, ChaCha20-Poly1305</td>
                                                            <td>Confidencialidad de los datos</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Integridad</td>
                                                            <td>HMAC-SHA1, HMAC-SHA256, AEAD</td>
                                                            <td>Solo cifrados AEAD</td>
                                                            <td>Garantizar integridad y autenticidad</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Firma digital</td>
                                                            <td>RSA, DSA, ECDSA</td>
                                                            <td>RSA-PSS, ECDSA, EdDSA</td>
                                                            <td>Autenticar certificados y mensajes</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Mejoras en TLS 1.3</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <ul className="list-disc list-inside space-y-2">
                                                        <li><span className="font-medium">Simplificación:</span> Eliminación de algoritmos obsoletos y vulnerables</li>
                                                        <li><span className="font-medium">Rendimiento:</span> Handshake reducido a 1-RTT (incluso 0-RTT para reconexiones)</li>
                                                        <li><span className="font-medium">Forward Secrecy obligatorio:</span> Solo se permiten métodos de intercambio de claves efímeros</li>
                                                        <li><span className="font-medium">Seguridad de la firma:</span> Utiliza algoritmos de firma modernos</li>
                                                        <li><span className="font-medium">Cifrado temprano:</span> Los datos del handshake se cifran lo antes posible</li>
                                                        <li><span className="font-medium">Resistencia a fingerprinting:</span> Mayor privacidad al reducir información expuesta</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Vulnerabilidades Históricas Importantes</h3>
                                                        <div className="text-sm">
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li><span className="font-medium">BEAST (2011):</span> Ataque contra TLS 1.0 usando CBC</li>
                                                                <li><span className="font-medium">CRIME (2012) y BREACH (2013):</span> Explotaban compresión TLS</li>
                                                                <li><span className="font-medium">Heartbleed (2014):</span> Vulnerabilidad en OpenSSL, no en el protocolo TLS</li>
                                                                <li><span className="font-medium">POODLE (2014):</span> Ataque que comprometió SSL 3.0</li>
                                                                <li><span className="font-medium">FREAK y Logjam (2015):</span> Degradación a cifrado débil</li>
                                                            </ul>
                                                            <p className="mt-1">Estas vulnerabilidades han influido en el diseño de TLS 1.3, haciéndolo significativamente más seguro.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de SSL/TLS</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Seguridad Web</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiGlobe className="mr-2 text-primary" />
                                                                HTTPS
                                                            </h4>
                                                            <p className="mb-3">
                                                                La aplicación más visible de TLS es en HTTPS, que proporciona:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Navegación web segura</li>
                                                                <li>Protección para comercio electrónico</li>
                                                                <li>Autenticación para banca en línea</li>
                                                                <li>Seguridad para aplicaciones web y APIs</li>
                                                            </ul>
                                                            <p className="text-sm mt-3">
                                                                Los navegadores modernos marcan los sitios sin HTTPS como "no seguros" y
                                                                Google utiliza HTTPS como factor de clasificación en los resultados de búsqueda.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Protocolos de Correo Electrónico</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiMail className="mr-2 text-secondary" />
                                                                Correo Seguro
                                                            </h4>
                                                            <ul className="list-disc list-inside mb-3">
                                                                <li><span className="font-medium">SMTPS</span>: SMTP sobre TLS para envío de correos</li>
                                                                <li><span className="font-medium">IMAPS</span>: IMAP sobre TLS para recepción de correos</li>
                                                                <li><span className="font-medium">POP3S</span>: POP3 sobre TLS para recepción de correos</li>
                                                                <li><span className="font-medium">STARTTLS</span>: Extensión para iniciar TLS en conexiones existentes</li>
                                                            </ul>
                                                            <p className="text-sm">
                                                                Estos protocolos protegen tanto las credenciales de usuario como
                                                                el contenido de los correos durante la transmisión entre clientes
                                                                y servidores.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Otros Usos Comunes</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiDatabase className="mr-2 text-accent" />
                                                                Bases de Datos
                                                            </h4>
                                                            <p className="text-sm">
                                                                MySQL, PostgreSQL, MongoDB y otros motores de bases de datos
                                                                utilizan TLS para proteger las conexiones cliente-servidor,
                                                                especialmente crítico para aplicaciones distribuidas y en la nube.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiWifi className="mr-2 text-info" />
                                                                VPN y Redes
                                                            </h4>
                                                            <p className="text-sm">
                                                                OpenVPN usa TLS como base para su seguridad.
                                                                FTPS (FTP con TLS) protege transferencias de archivos.
                                                                MQTT sobre TLS asegura comunicaciones IoT.
                                                                WebSockets seguros (WSS) para comunicaciones bidireccionales.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiSmartphone className="mr-2 text-success" />
                                                                Aplicaciones Móviles
                                                            </h4>
                                                            <p className="text-sm">
                                                                Las aplicaciones móviles utilizan TLS para comunicarse
                                                                con servidores backend, proteger datos de usuario, y
                                                                asegurar transacciones en aplicaciones financieras, de salud
                                                                y redes sociales.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Certificados Let's Encrypt</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <div className="md:w-2/3">
                                                            <h4 className="font-bold">Democratizando HTTPS</h4>
                                                            <p className="text-sm mb-2">
                                                                Let's Encrypt ha revolucionado la adopción de HTTPS al proporcionar certificados SSL/TLS gratuitos y
                                                                automáticos. Características principales:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Autoridad de certificación gratuita, de código abierto</li>
                                                                <li>Renovación automática de certificados</li>
                                                                <li>Proceso de validación simplificado</li>
                                                                <li>Integración con la mayoría de los servidores web</li>
                                                                <li>Más de 250 millones de sitios web activos protegidos</li>
                                                                <li>Ha impulsado que HTTPS sea el estándar predeterminado en la web</li>
                                                            </ul>
                                                        </div>
                                                        <div className="md:w-1/3">
                                                            <div className="bg-base-300 p-3 rounded-md text-sm font-mono">
                                                                <div className="mb-1 font-bold text-xs">Emisión de certificado</div>
                                                                $ certbot --nginx -d example.com<br />
                                                                Saving debug log to /var/log/letsencrypt/letsencrypt.log<br />
                                                                Plugins selected: Authenticator nginx, Installer nginx<br />
                                                                Obtaining a new certificate<br />
                                                                Deploying certificate<br />
                                                                Successfully deployed certificate for example.com
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Mejores Prácticas para SSL/TLS</h3>
                                                        <div className="text-sm">
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Utilizar TLS 1.2 o 1.3 y deshabilitar versiones antiguas</li>
                                                                <li>Implementar HSTS (HTTP Strict Transport Security) para forzar HTTPS</li>
                                                                <li>Configurar correctamente la lista de cifrados, priorizando los más seguros</li>
                                                                <li>Usar Perfect Forward Secrecy para proteger datos pasados</li>
                                                                <li>Mantener actualizadas las implementaciones de TLS (OpenSSL, etc.)</li>
                                                                <li>Automatizar la renovación de certificados para evitar vencimientos</li>
                                                                <li>Verificar la configuración con herramientas como SSL Labs</li>
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
                                            onClick={() => handleProtocolChange('ssh')}
                                        >
                                            Siguiente: SSH <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SSH Protocol Content */}
                        {currentProtocol === 'ssh' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">SSH: Secure Shell</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        SSH (Secure Shell) es un protocolo criptográfico y programa que permite el acceso remoto
                                                        seguro a sistemas y la transferencia segura de archivos entre computadoras. Desarrollado
                                                        en 1995 por Tatu Ylönen, SSH fue creado como una alternativa segura a protocolos como Telnet,
                                                        rlogin y FTP, que transmitían datos (incluyendo contraseñas) sin cifrar.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Evolución de SSH</h3>
                                                    <div className="overflow-x-auto mb-4">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Versión</th>
                                                                    <th>Año</th>
                                                                    <th>Características</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>SSH-1</td>
                                                                    <td>1995</td>
                                                                    <td>Versión original, tiene vulnerabilidades de seguridad conocidas</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>SSH-2</td>
                                                                    <td>2006</td>
                                                                    <td>Rediseño completo, más seguro, soporte para múltiples mecanismos de autenticación, estandarizado como RFC 4250-4256</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>OpenSSH</td>
                                                                    <td>1999-presente</td>
                                                                    <td>Implementación de código abierto más utilizada, evolución continua con nuevas características y mejoras de seguridad</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">Acceso remoto seguro</span> a servidores y dispositivos</li>
                                                        <li><span className="font-medium">Transferencia de archivos cifrada</span> mediante protocolos como SCP y SFTP</li>
                                                        <li><span className="font-medium">Túneles seguros</span> para reenvío de puertos y aplicaciones</li>
                                                        <li><span className="font-medium">Múltiples métodos de autenticación</span>, incluyendo contraseñas y claves públicas</li>
                                                        <li><span className="font-medium">Integridad de datos</span> mediante códigos de autenticación de mensajes</li>
                                                        <li><span className="font-medium">Compresión de datos</span> para mejorar el rendimiento en conexiones lentas</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiTerminal className="text-primary" />
                                                                SSH vs Telnet
                                                            </h3>
                                                            <div className="text-sm">
                                                                <div className="mb-2">
                                                                    <span className="font-bold text-error">Telnet:</span>
                                                                    <ul className="list-disc list-inside ml-2">
                                                                        <li>Sin cifrado - texto plano</li>
                                                                        <li>Sin verificación de integridad</li>
                                                                        <li>Sin verificación de identidad del servidor</li>
                                                                        <li>Vulnerable a ataques de intermediario</li>
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <span className="font-bold text-success">SSH:</span>
                                                                    <ul className="list-disc list-inside ml-2">
                                                                        <li>Comunicación completamente cifrada</li>
                                                                        <li>Verificación de integridad</li>
                                                                        <li>Fuerte autenticación de servidor y cliente</li>
                                                                        <li>Resistente a ataques de intermediario</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiKey className="text-secondary" />
                                                                Métodos de Autenticación
                                                            </h3>
                                                            <p className="text-sm mb-2">
                                                                SSH soporta varios métodos de autenticación:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li><span className="font-medium">Contraseña</span>: Método básico pero menos seguro</li>
                                                                <li><span className="font-medium">Clave pública</span>: Más seguro, basado en criptografía asimétrica</li>
                                                                <li><span className="font-medium">Basado en host</span>: Autenticación basada en la identidad del host</li>
                                                                <li><span className="font-medium">GSSAPI</span>: Para integración con Kerberos</li>
                                                                <li><span className="font-medium">Autenticación de dos factores</span>: Combinando múltiples métodos</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de SSH</h2>

                                            <h3 className="text-xl font-bold mb-3">Arquitectura del Protocolo</h3>
                                            <p className="mb-4">
                                                SSH está estructurado en tres capas principales que trabajan juntas para proporcionar una conexión segura:
                                            </p>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiLayers className="mr-2 text-primary" />
                                                                Capa de Transporte
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Proporciona cifrado y compresión</li>
                                                                <li>Garantiza integridad con MACs</li>
                                                                <li>Maneja el intercambio de claves</li>
                                                                <li>Autenticación del servidor</li>
                                                                <li>Negociación de algoritmos</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiUser className="mr-2 text-secondary" />
                                                                Capa de Autenticación
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Verifica la identidad del cliente</li>
                                                                <li>Gestiona múltiples métodos de autenticación</li>
                                                                <li>Maneja la autenticación basada en contraseña</li>
                                                                <li>Implementa autenticación de clave pública</li>
                                                                <li>Soporta métodos basados en host y Kerberos</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiGrid className="mr-2 text-accent" />
                                                                Capa de Conexión
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Gestiona canales de comunicación</li>
                                                                <li>Maneja múltiples sesiones simultáneas</li>
                                                                <li>Proporciona reenvío de puertos (tunneling)</li>
                                                                <li>Control de flujo de datos</li>
                                                                <li>Transferencia de datos del terminal interactivo</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Proceso de Establecimiento de Conexión</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <ol className="list-decimal list-inside space-y-1">
                                                        <li><span className="font-medium">Identificación de versión:</span> Cliente y servidor intercambian versiones de SSH</li>
                                                        <li><span className="font-medium">Negociación de algoritmos:</span> Acuerdan los algoritmos para intercambio de claves, cifrado, MAC y compresión</li>
                                                        <li><span className="font-medium">Intercambio de claves (Key Exchange):</span> Utilizando algoritmos como Diffie-Hellman para establecer una clave de sesión secreta compartida</li>
                                                        <li><span className="font-medium">Inicialización de cifrado:</span> Se configuran los algoritmos de cifrado con las claves derivadas</li>
                                                        <li><span className="font-medium">Autenticación de servidor:</span> El cliente verifica la identidad del servidor</li>
                                                        <li><span className="font-medium">Autenticación de cliente:</span> El servidor autentica al cliente usando el método acordado</li>
                                                        <li><span className="font-medium">Establecimiento de sesión:</span> Se crea un canal de comunicación seguro para la interacción</li>
                                                    </ol>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Algoritmos Criptográficos</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Categoría</th>
                                                            <th>Algoritmos Comunes</th>
                                                            <th>Recomendados Actualmente</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Intercambio de claves</td>
                                                            <td>diffie-hellman-group1, diffie-hellman-group14, ecdh-sha2-nistp256</td>
                                                            <td>curve25519-sha256, diffie-hellman-group16-sha512</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Cifrado simétrico</td>
                                                            <td>3des-cbc, aes128-cbc, aes256-cbc, arcfour</td>
                                                            <td>chacha20-poly1305, aes256-gcm, aes128-gcm</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Códigos MAC</td>
                                                            <td>hmac-md5, hmac-sha1, hmac-sha2-256</td>
                                                            <td>hmac-sha2-512, hmac-sha2-256-etm</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Algoritmos de clave pública</td>
                                                            <td>ssh-rsa, ssh-dss</td>
                                                            <td>rsa-sha2-512, rsa-sha2-256, ssh-ed25519</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Compresión</td>
                                                            <td>none, zlib</td>
                                                            <td>none (en enlaces rápidos), zlib@openssh.com (condicional)</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Reenvío de Puertos (Port Forwarding)</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Tipos de Reenvío</h4>
                                                        <div className="text-sm space-y-2">
                                                            <div>
                                                                <p className="font-medium">Local Forwarding (-L):</p>
                                                                <p>Conecta un puerto en la máquina local a un puerto en un destino remoto a través del servidor SSH.</p>
                                                                <div className="bg-base-300 p-2 rounded-md text-xs mt-1 font-mono">
                                                                    ssh -L 8080:internal-server:80 gateway-server
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Remote Forwarding (-R):</p>
                                                                <p>Conecta un puerto en el servidor SSH a un puerto en la máquina local.</p>
                                                                <div className="bg-base-300 p-2 rounded-md text-xs mt-1 font-mono">
                                                                    ssh -R 8080:localhost:80 remote-server
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Dynamic Forwarding (-D):</p>
                                                                <p>Configura un proxy SOCKS en la máquina local.</p>
                                                                <div className="bg-base-300 p-2 rounded-md text-xs mt-1 font-mono">
                                                                    ssh -D 9090 gateway-server
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Aplicaciones Prácticas</h4>
                                                        <ul className="list-disc list-inside text-sm">
                                                            <li>Acceso a servicios internos detrás de firewalls</li>
                                                            <li>Evasión de restricciones geográficas</li>
                                                            <li>Protección del tráfico en redes no confiables</li>
                                                            <li>Acceso remoto a bases de datos</li>
                                                            <li>Conexión segura a servicios web internos</li>
                                                            <li>Navegación segura a través de un proxy SOCKS</li>
                                                            <li>Administración remota de dispositivos en redes separadas</li>
                                                            <li>Acceso a interfaces web administrativas de forma segura</li>
                                                        </ul>
                                                        <div className="alert alert-info mt-2 p-2 text-xs">
                                                            <FiHelpCircle className="mr-1" />
                                                            El reenvío de puertos SSH proporciona cifrado de extremo a extremo para protocolos que carecen de seguridad propia.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Consideraciones de Seguridad</h3>
                                                        <div className="text-sm">
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Deshabilitar SSH-1 por completo (vulnerable)</li>
                                                                <li>Evitar el uso de algoritmos obsoletos (3DES, MD5, etc.)</li>
                                                                <li>Implementar autenticación por clave pública en lugar de contraseñas</li>
                                                                <li>Utilizar frases de contraseña (passphrase) para proteger las claves privadas</li>
                                                                <li>Configurar el tiempo de espera de inactividad y el número máximo de intentos</li>
                                                                <li>Restringir el acceso a usuarios, grupos y direcciones IP específicos</li>
                                                                <li>Cambiar el puerto SSH predeterminado (22) para reducir ataques automatizados</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de SSH</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Administración de Sistemas</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiServer className="mr-2 text-primary" />
                                                                Administración Remota
                                                            </h4>
                                                            <p className="mb-3">
                                                                SSH es la herramienta estándar para:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Acceso a servidores remoto para administración</li>
                                                                <li>Configuración y mantenimiento de dispositivos de red</li>
                                                                <li>Automatización de tareas mediante scripts</li>
                                                                <li>Gestión de servidores cloud</li>
                                                                <li>Acceso a entornos de emergencia y recuperación</li>
                                                            </ul>
                                                            <div className="bg-base-300 p-2 rounded-md text-xs mt-3 font-mono">
                                                                $ ssh admin@serverip<br />
                                                                $ sudo apt update && sudo apt upgrade<br />
                                                                $ systemctl restart apache2
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Transferencia Segura de Archivos</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiUpload className="mr-2 text-secondary" />
                                                                <FiDownload className="mr-2 text-secondary" />
                                                                Protocolos SSH de Transferencia
                                                            </h4>
                                                            <div className="mb-3 space-y-2">
                                                                <div>
                                                                    <p className="font-medium">SCP (Secure Copy):</p>
                                                                    <p className="text-sm">Protocolo simple para copiar archivos basado en el comando 'cp' de Unix.</p>
                                                                    <div className="bg-base-300 p-1 rounded-md text-xs mt-1 font-mono">
                                                                        $ scp archivo.txt usuario@servidor:/destino/
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">SFTP (SSH File Transfer Protocol):</p>
                                                                    <p className="text-sm">Protocolo más avanzado con capacidades similares a FTP pero sobre SSH.</p>
                                                                    <div className="bg-base-300 p-1 rounded-md text-xs mt-1 font-mono">
                                                                        $ sftp usuario@servidor<br />
                                                                        sftp `&gt;`get remoto.txt<br />
                                                                        sftp `&gt;`put local.txt
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm">
                                                                Estas herramientas reemplazan a FTP tradicional, proporcionando
                                                                cifrado y autenticación segura para la transferencia de archivos.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Túneles y Conectividad Segura</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiGlobe className="mr-2 text-accent" />
                                                                VPN Improvisada
                                                            </h4>
                                                            <p className="text-sm">
                                                                SSH puede funcionar como una solución VPN ligera mediante el reenvío dinámico
                                                                (opción -D) que crea un proxy SOCKS. Esto permite asegurar tráfico web,
                                                                correo electrónico y otras aplicaciones cuando se navega en redes Wi-Fi públicas
                                                                o no confiables.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiDatabase className="mr-2 text-info" />
                                                                Acceso a Bases de Datos
                                                            </h4>
                                                            <p className="text-sm">
                                                                Los túneles SSH permiten conexiones seguras a bases de datos remotas
                                                                que no están expuestas directamente a Internet. Esto es esencial para
                                                                administración remota de MySQL, PostgreSQL, MongoDB y otras bases de datos
                                                                mientras se mantiene el acceso limitado a usuarios autorizados.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiMonitor className="mr-2 text-success" />
                                                                Acceso a GUI Remotas
                                                            </h4>
                                                            <p className="text-sm">
                                                                SSH con reenvío X11 (opción -X) permite ejecutar aplicaciones gráficas
                                                                en un servidor remoto mientras se muestra la interfaz en el sistema local.
                                                                También se puede tunelizar VNC, RDP y otros protocolos de escritorio remoto
                                                                para agregar una capa adicional de seguridad.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">DevOps e Infraestructura como Código</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiCode className="mr-2 text-primary" />
                                                                Automatización
                                                            </h4>
                                                            <p className="text-sm mb-2">
                                                                SSH es un componente fundamental en herramientas de automatización DevOps:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Ansible utiliza SSH para la configuración automática de servidores</li>
                                                                <li>Jenkins puede usar SSH para despliegues automatizados</li>
                                                                <li>Git utiliza SSH para acceso seguro a repositorios</li>
                                                                <li>Scripts de aprovisionamiento en plataformas cloud</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiKey className="mr-2 text-secondary" />
                                                                Gestión de Claves SSH
                                                            </h4>
                                                            <p className="text-sm mb-2">
                                                                En entornos empresariales, la gestión de claves SSH se vuelve crítica:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Sistemas de administración centralizada de claves</li>
                                                                <li>Rotación automática de claves</li>
                                                                <li>Integración con sistemas de identidad corporativa</li>
                                                                <li>Auditoría y monitoreo de acceso SSH</li>
                                                                <li>Sistemas basados en certificados en lugar de listas de claves autorizadas</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Implementaciones y Clientes</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Software</th>
                                                            <th>Tipo</th>
                                                            <th>Plataforma</th>
                                                            <th>Características</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>OpenSSH</td>
                                                            <td>Cliente/Servidor</td>
                                                            <td>Unix/Linux/macOS/Windows</td>
                                                            <td>Implementación de código abierto más común, muy completa</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PuTTY</td>
                                                            <td>Cliente</td>
                                                            <td>Windows</td>
                                                            <td>Cliente popular para Windows, incluye herramientas relacionadas</td>
                                                        </tr>
                                                        <tr>
                                                            <td>WinSCP</td>
                                                            <td>Cliente</td>
                                                            <td>Windows</td>
                                                            <td>Cliente SFTP/SCP gráfico con interfaz de tipo explorador</td>
                                                        </tr>
                                                        <tr>
                                                            <td>FileZilla</td>
                                                            <td>Cliente</td>
                                                            <td>Multiplataforma</td>
                                                            <td>Cliente FTP/SFTP con interfaz gráfica</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Dropbear</td>
                                                            <td>Cliente/Servidor</td>
                                                            <td>Unix/Linux</td>
                                                            <td>Implementación ligera para sistemas embebidos</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">SSH en la Era de la Nube</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                A pesar del auge de servicios en la nube y tecnologías sin servidor, SSH sigue siendo crítico:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Los principales proveedores cloud (AWS, Azure, GCP) utilizan SSH como método principal de acceso a instancias</li>
                                                                <li>La gestión de claves SSH se ha integrado en sistemas de IAM (Identity and Access Management) cloud</li>
                                                                <li>Los contenedores y orquestadores como Kubernetes siguen requiriendo acceso SSH para depuración y mantenimiento</li>
                                                                <li>Las prácticas modernas incluyen bastion hosts y claves efímeras generadas bajo demanda</li>
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
                                            onClick={() => handleProtocolChange('ssl-tls')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: SSL/TLS
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
                                <p className="mb-6">Responde correctamente todas las preguntas para completar el módulo. Puedes intentarlo tantas veces como necesites.</p>

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
                                    ) :
                                        (
                                            <div className="text-success font-bold flex items-center">
                                                <FiCheckCircle className="mr-2" /> Completando el módulo...
                                            </div>
                                        )}
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
                                    <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Protocolos Criptográficos</h2>
                                    <p className="text-lg mb-6">Has dominado los conceptos fundamentales de SSL/TLS y SSH, comprendiendo cómo estos protocolos fundamentales aseguran las comunicaciones en Internet y los sistemas modernos.</p>

                                    <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                                                <FiShield className="h-5 w-5" />
                                                Experto en Protocolos Seguros
                                            </div>
                                        </div>
                                        <p>Has demostrado comprensión profunda de los protocolos criptográficos esenciales para la seguridad de comunicaciones y sistemas.</p>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4">Conocimientos adquiridos</h3>
                                    <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 space-y-2">
                                        <li>Historia y evolución de SSL/TLS y SSH</li>
                                        <li>Arquitectura y componentes de estos protocolos de seguridad</li>
                                        <li>Mecanismos criptográficos que garantizan confidencialidad e integridad</li>
                                        <li>Proceso de establecimiento de conexiones seguras</li>
                                        <li>Aplicaciones prácticas en entornos de producción</li>
                                        <li>Mejores prácticas para implementación y configuración segura</li>
                                    </ul>

                                    <div className="alert alert-info shadow-lg mb-6 text-left">
                                        <div>
                                            <FiHelpCircle className="w-6 h-6" />
                                            <div>
                                                <h3 className="font-bold">Próximos pasos</h3>
                                                <p>Para seguir profundizando en la seguridad de redes, te recomendamos explorar los módulos de "VPN y Seguridad en la Capa de Red", "Gestión de Certificados Digitales" o "Seguridad en Aplicaciones Web". También podrías interesarte en el curso avanzado de "Análisis de Seguridad en Protocolos de Red".</p>
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