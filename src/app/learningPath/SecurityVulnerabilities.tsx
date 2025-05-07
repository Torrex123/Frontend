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
    FiAlertTriangle,
    FiEye,
    FiWifi,
    FiHash,
    FiCrosshair,
    FiFilter,
    FiLink,
    FiLock,
    FiMessageSquare,
    FiUsers,
    FiSlash,
    FiGrid,
    FiRepeat
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

// Types for our application
type VulnerabilityType = 'mitm' | 'hash-collisions' | 'padding-oracle';
type ProgressStage = 'learning' | 'quiz' | 'completed';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

export default function SecurityVulnerabilities() {
    // State management
    const [currentVulnerability, setCurrentVulnerability] = useState<VulnerabilityType>('mitm');
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
            question: "¿Cuál es la mejor defensa contra ataques de Hombre en el Medio (MITM) en una conexión web?",
            options: [
                "Usar contraseñas complejas",
                "Implementar HTTPS con certificados verificados y HSTS",
                "Cambiar regularmente las credenciales de acceso",
                "Utilizar solo redes privadas"
            ],
            correctAnswer: "Implementar HTTPS con certificados verificados y HSTS"
        },
        {
            id: 2,
            question: "¿Qué propiedad de las funciones hash criptográficas se rompe cuando se encuentra una colisión?",
            options: [
                "Resistencia a preimagen",
                "Resistencia a segunda preimagen",
                "Resistencia a colisiones",
                "Distribución uniforme"
            ],
            correctAnswer: "Resistencia a colisiones"
        },
        {
            id: 3,
            question: "En un ataque de Padding Oracle, ¿qué información utiliza el atacante para descifrar gradualmente los datos cifrados?",
            options: [
                "La longitud del mensaje cifrado",
                "La clave privada parcial del sistema",
                "Las respuestas del sistema sobre la validez del padding",
                "El vector de inicialización (IV) del algoritmo"
            ],
            correctAnswer: "Las respuestas del sistema sobre la validez del padding"
        },
        {
            id: 4,
            question: "¿Cuál de las siguientes técnicas NO es efectiva contra ataques MITM?",
            options: [
                "Uso de certificados SSL/TLS",
                "Implementación de HSTS (HTTP Strict Transport Security)",
                "Verificación de claves públicas mediante huellas digitales",
                "Encriptación simétrica sin intercambio de claves autenticado"
            ],
            correctAnswer: "Encriptación simétrica sin intercambio de claves autenticado"
        },
        {
            id: 5,
            question: "¿Qué función hash es actualmente considerada segura contra ataques de colisión?",
            options: [
                "MD5",
                "SHA-1",
                "SHA-256",
                "RIPEMD-160"
            ],
            correctAnswer: "SHA-256"
        }
    ]);

    // Update progress based on current vulnerability and stage
    useEffect(() => {
        let newProgress = 0;

        // Base progress on current vulnerability
        if (currentVulnerability === 'mitm') newProgress = 0;
        else if (currentVulnerability === 'hash-collisions') newProgress = 33;
        else if (currentVulnerability === 'padding-oracle') newProgress = 66;

        // Adjust based on stage
        if (stage === 'quiz') newProgress = 90;
        else if (stage === 'completed') newProgress = 100;

        setProgress(newProgress);
    }, [currentVulnerability, stage]);

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

    // Navigate between different vulnerabilities
    const handleVulnerabilityChange = (vulnerability: VulnerabilityType) => {
        setCurrentVulnerability(vulnerability);
        setActiveTab('info');
    };

    // Navigate to the quiz when all vulnerabilities are reviewed
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
                    <h1 className="text-3xl font-bold text-center">Seguridad y Vulnerabilidades</h1>

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
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentVulnerability === 'mitm' ? 'border-primary bg-primary text-primary-content' : progress >= 33 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiUsers className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">MITM</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 33 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentVulnerability === 'hash-collisions' ? 'border-primary bg-primary text-primary-content' : progress >= 66 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiHash className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Hash Collisions</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 66 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentVulnerability === 'padding-oracle' ? 'border-primary bg-primary text-primary-content' : progress >= 90 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiLayers className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Padding Oracle</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 90 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${stage === 'completed' ? 'border-success bg-success text-success-content' : stage === 'quiz' ? 'border-primary bg-primary text-primary-content' : 'border-base-300 bg-base-100'}`}>
                                    <FiFileText className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Evaluación</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Learning Stage - Display content based on current vulnerability */}
                {stage === 'learning' && (
                    <div className="max-w-4xl mx-auto">
                        {/* Vulnerability Navigation Tabs */}
                        <div className="tabs tabs-boxed mb-6 justify-center">
                            <button
                                className={`tab ${currentVulnerability === 'mitm' ? 'tab-active' : ''}`}
                                onClick={() => handleVulnerabilityChange('mitm')}
                            >
                                Hombre en el Medio (MITM)
                            </button>
                            <button
                                className={`tab ${currentVulnerability === 'hash-collisions' ? 'tab-active' : ''}`}
                                onClick={() => handleVulnerabilityChange('hash-collisions')}
                            >
                                Colisiones Hash
                            </button>
                            <button
                                className={`tab ${currentVulnerability === 'padding-oracle' ? 'tab-active' : ''}`}
                                onClick={() => handleVulnerabilityChange('padding-oracle')}
                            >
                                Padding Oracle
                            </button>
                        </div>

                        {/* Content Tabs for current vulnerability */}
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
                                className={`tab tab-bordered ${activeTab === 'protection' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('protection')}
                            >
                                Protección
                            </button>
                        </div>

                        {/* MITM Attack Content */}
                        {currentVulnerability === 'mitm' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Ataque de Hombre en el Medio (MITM)</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        Un ataque de Hombre en el Medio (Man-in-the-Middle o MITM) es una técnica de ciberataque donde
                                                        un atacante se posiciona sigilosamente entre dos partes que se comunican, interceptando y
                                                        potencialmente alterando la comunicación sin que ninguna de las partes sea consciente de ello.
                                                        Es como si alguien estuviera leyendo secretamente todas tus cartas antes de que lleguen a su destinatario,
                                                        pudiendo incluso modificar su contenido.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Modalidades Comunes</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">Interceptación de red:</span> Captura de tráfico en redes públicas o vulnerables</li>
                                                        <li><span className="font-medium">Envenenamiento ARP:</span> Manipulación de tablas ARP para redirigir tráfico</li>
                                                        <li><span className="font-medium">Spoofing de DNS:</span> Redirección a sitios maliciosos falsificando respuestas DNS</li>
                                                        <li><span className="font-medium">Secuestro de sesiones:</span> Toma de control de sesiones establecidas</li>
                                                        <li><span className="font-medium">SSL/TLS Stripping:</span> Degradación de conexiones HTTPS a HTTP</li>
                                                        <li><span className="font-medium">Rogue Access Points:</span> Puntos de acceso WiFi maliciosos</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Impacto y Riesgos</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">Robo de credenciales:</span> Captura de nombres de usuario y contraseñas</li>
                                                        <li><span className="font-medium">Robo de datos sensibles:</span> Intercepción de información personal o financiera</li>
                                                        <li><span className="font-medium">Manipulación de datos:</span> Alteración de la información transmitida</li>
                                                        <li><span className="font-medium">Inyección de contenido malicioso:</span> Inserción de código dañino en la comunicación</li>
                                                        <li><span className="font-medium">Espionaje y vigilancia:</span> Monitoreo no autorizado de comunicaciones</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiAlertTriangle className="text-warning" />
                                                                Escenarios de Riesgo
                                                            </h3>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Redes WiFi públicas (cafeterías, aeropuertos)</li>
                                                                <li>Redes corporativas mal aseguradas</li>
                                                                <li>Dispositivos con software desactualizado</li>
                                                                <li>Comunicaciones no cifradas</li>
                                                                <li>Usuarios que ignoran advertencias de seguridad</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiCrosshair className="text-error" />
                                                                Signos de un Ataque MITM
                                                            </h3>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>Certificados SSL/TLS inválidos o sospechosos</li>
                                                                <li>Conexiones inesperadamente lentas</li>
                                                                <li>URLs extrañas o redirecciones inesperadas</li>
                                                                <li>Desconexiones frecuentes</li>
                                                                <li>Cambios en el comportamiento de aplicaciones web familiares</li>
                                                                <li>Advertencias del navegador sobre certificados o conexiones</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de Ataques MITM</h2>

                                            <h3 className="text-xl font-bold mb-3">Mecanismos de Ataque</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base flex items-center gap-2">
                                                            <FiWifi className="text-warning" />
                                                            Envenenamiento ARP
                                                        </h4>
                                                        <p className="text-sm">
                                                            El protocolo ARP (Address Resolution Protocol) asocia direcciones IP con direcciones MAC físicas.
                                                            En un ataque de envenenamiento ARP:
                                                        </p>
                                                        <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                                                            <li>El atacante envía mensajes ARP falsificados a la red local</li>
                                                            <li>Las tablas ARP de los dispositivos víctima se modifican</li>
                                                            <li>El tráfico se redirige a través de la máquina del atacante</li>
                                                            <li>Los paquetes pueden ser capturados, leídos y modificados antes de reenviarlos</li>
                                                        </ol>
                                                        <div className="bg-base-300 p-2 rounded-md text-xs mt-2 font-mono">
                                                            #Ejemplo de comando (arpspoof)<br />
                                                            arpspoof -i eth0 -t 192.168.1.5 192.168.1.1
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base flex items-center gap-2">
                                                            <FiGlobe className="text-warning" />
                                                            Spoofing de DNS
                                                        </h4>
                                                        <p className="text-sm">
                                                            DNS (Domain Name System) traduce nombres de dominio a direcciones IP.
                                                            En un ataque de spoofing DNS:
                                                        </p>
                                                        <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                                                            <li>El atacante manipula las consultas o respuestas DNS</li>
                                                            <li>Los usuarios son redirigidos a sitios maliciosos que parecen legítimos</li>
                                                            <li>Las víctimas interactúan con servidores controlados por atacantes</li>
                                                            <li>Se pueden robar credenciales o instalar malware</li>
                                                        </ol>
                                                        <div className="bg-base-300 p-2 rounded-md text-xs mt-2 font-mono">
                                                            #Ejemplo de ataque DNS<br />
                                                            dnsspoof -i eth0 -f hosts.txt
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Ataques Contra Protocolos Seguros</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">SSL/TLS Stripping</h4>
                                                        <p className="text-sm">
                                                            Este ataque degrada conexiones HTTPS a HTTP inseguro:
                                                        </p>
                                                        <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                                                            <li>El atacante intercepta la solicitud inicial a un sitio HTTPS</li>
                                                            <li>Establece una conexión HTTPS con el servidor legítimo</li>
                                                            <li>Pero devuelve al usuario una versión HTTP del sitio</li>
                                                            <li>El usuario interactúa con una versión no cifrada, mientras el atacante mantiene la conexión segura con el servidor</li>
                                                        </ol>
                                                        <p className="text-sm mt-2">
                                                            La herramienta SSLstrip automatiza este proceso, permitiendo capturar credenciales y datos sensibles.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Certificados SSL Falsos</h4>
                                                        <p className="text-sm">
                                                            En este ataque, se crean y presentan certificados SSL/TLS fraudulentos:
                                                        </p>
                                                        <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                                                            <li>El atacante genera un certificado para un dominio objetivo</li>
                                                            <li>Intercepta las conexiones y presenta este certificado falso</li>
                                                            <li>Si el usuario acepta el certificado (ignorando las advertencias), se establece una conexión "segura" con el atacante</li>
                                                            <li>El atacante mantiene otra conexión segura con el servidor real</li>
                                                        </ol>
                                                        <p className="text-sm mt-2">
                                                            Los navegadores modernos advierten sobre certificados no confiables, pero muchos usuarios ignoran estas alertas.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Herramientas de Ataque MITM</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Herramienta</th>
                                                            <th>Función Principal</th>
                                                            <th>Capacidades</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Ettercap</td>
                                                            <td>Suite completa para ataques MITM</td>
                                                            <td>Sniffing, envenenamiento ARP, filtrado de contenido, ataques SSL</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Wireshark</td>
                                                            <td>Analizador de paquetes de red</td>
                                                            <td>Captura y análisis de tráfico, inspección de protocolos</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Burp Suite</td>
                                                            <td>Proxy de interceptación para aplicaciones web</td>
                                                            <td>Intercepción, modificación y repetición de tráfico HTTP/HTTPS</td>
                                                        </tr>
                                                        <tr>
                                                            <td>SSLstrip</td>
                                                            <td>Herramienta de degradación HTTPS a HTTP</td>
                                                            <td>Automatización de ataques de downgrade de SSL/TLS</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Bettercap</td>
                                                            <td>Framework moderno para ataques de red</td>
                                                            <td>Spoofing, sniffing, proxying, con interfaz web</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Aspecto Legal y Ético</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                Las técnicas MITM generalmente se consideran ilegales cuando se utilizan sin autorización.
                                                                Sin embargo, son herramientas legítimas en contextos como:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Pruebas de penetración autorizadas</li>
                                                                <li>Auditorías de seguridad</li>
                                                                <li>Formación en ciberseguridad en entornos controlados</li>
                                                                <li>Investigación de incidentes de seguridad</li>
                                                            </ul>
                                                            <p className="mt-1">
                                                                La intercepción no autorizada de comunicaciones es un delito en la mayoría de jurisdicciones.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'protection' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Protección Contra Ataques MITM</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Protección para Usuarios</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiShield className="mr-2 text-success" />
                                                                Buenas Prácticas
                                                            </h4>
                                                            <ul className="list-disc list-inside">
                                                                <li>Verificar siempre que las conexiones sean HTTPS (candado en el navegador)</li>
                                                                <li>No ignorar advertencias de certificados en navegadores</li>
                                                                <li>Evitar el uso de redes WiFi públicas para actividades sensibles</li>
                                                                <li>Utilizar una VPN confiable al conectarse a redes públicas</li>
                                                                <li>Activar la autenticación de dos factores (2FA) en servicios críticos</li>
                                                                <li>Mantener actualizado el software, especialmente navegadores</li>
                                                                <li>Utilizar extensiones de navegador como HTTPS Everywhere</li>
                                                                <li>Verificar regularmente la validez de los certificados SSL/TLS</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Protección para Organizaciones</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiServer className="mr-2 text-primary" />
                                                                Medidas Técnicas
                                                            </h4>
                                                            <ul className="list-disc list-inside">
                                                                <li>Implementar HTTPS en todos los servicios web</li>
                                                                <li>Configurar HTTP Strict Transport Security (HSTS)</li>
                                                                <li>Utilizar DNS sobre HTTPS (DoH) o DNS sobre TLS (DoT)</li>
                                                                <li>Implementar Certificate Pinning en aplicaciones propias</li>
                                                                <li>Configurar monitoreo de detección de ARP spoofing</li>
                                                                <li>Asegurar redes inalámbricas con WPA3 y autenticación robusta</li>
                                                                <li>Utilizar redes privadas virtuales (VPN) para conexiones remotas</li>
                                                                <li>Educar a los empleados sobre las amenazas y medidas de protección</li>
                                                                <li>Implementar segmentación de red y controles de acceso</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Tecnologías de Protección</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Tecnología</th>
                                                            <th>Descripción</th>
                                                            <th>Protección ofrecida</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>HTTPS/TLS 1.3</td>
                                                            <td>Protocolo de seguridad para comunicaciones web</td>
                                                            <td>Cifrado de datos, autenticación del servidor, integridad de la comunicación</td>
                                                        </tr>
                                                        <tr>
                                                            <td>HSTS</td>
                                                            <td>HTTP Strict Transport Security</td>
                                                            <td>Previene ataques de downgrade forzando conexiones HTTPS</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Certificate Pinning</td>
                                                            <td>Vinculación de certificados específicos a dominios</td>
                                                            <td>Previene ataques con certificados fraudulentos</td>
                                                        </tr>
                                                        <tr>
                                                            <td>DNS sobre HTTPS/TLS</td>
                                                            <td>Consultas DNS cifradas</td>
                                                            <td>Protege contra manipulación y espionaje de DNS</td>
                                                        </tr>
                                                        <tr>
                                                            <td>VPN</td>
                                                            <td>Red privada virtual</td>
                                                            <td>Cifra todo el tráfico de red, ocultándolo de atacantes locales</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">Configuraciones Recomendadas para Servicios Web</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h5 className="font-bold text-sm">Encabezados HTTP de Seguridad</h5>
                                                            <div className="bg-base-300 p-2 rounded-md text-xs mt-1 font-mono overflow-x-auto">
                                                                # Nginx config example<br />
                                                                add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;<br />
                                                                add_header X-Content-Type-Options nosniff;<br />
                                                                add_header X-Frame-Options SAMEORIGIN;<br />
                                                                add_header X-XSS-Protection "1; mode=block";<br />
                                                                add_header Content-Security-Policy "default-src 'self';"
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-sm">Configuración SSL/TLS Segura</h5>
                                                            <div className="bg-base-300 p-2 rounded-md text-xs mt-1 font-mono overflow-x-auto">
                                                                # Nginx config example<br />
                                                                ssl_protocols TLSv1.2 TLSv1.3;<br />
                                                                ssl_prefer_server_ciphers on;<br />
                                                                ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384";<br />
                                                                ssl_session_cache shared:SSL:10m;<br />
                                                                ssl_session_timeout 1d;<br />
                                                                ssl_session_tickets off;
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Evaluación de Seguridad</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                Herramientas para verificar la protección contra ataques MITM:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li><a href="https://www.ssllabs.com/ssltest/" className="link link-primary">Qualys SSL Labs</a> - Evalúa configuración SSL/TLS</li>
                                                                <li><a href="https://www.hardenize.com/" className="link link-primary">Hardenize</a> - Análisis completo de seguridad web</li>
                                                                <li><a href="https://www.immuniweb.com/ssl/" className="link link-primary">ImmuniWeb</a> - Análisis de configuración SSL/TLS</li>
                                                                <li><a href="https://observatory.mozilla.org/" className="link link-primary">Mozilla Observatory</a> - Evalúa configuraciones de seguridad web</li>
                                                            </ul>
                                                            <p className="mt-1">
                                                                Realizar pruebas regulares ayuda a identificar y corregir vulnerabilidades antes de que sean explotadas.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-6">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleVulnerabilityChange('hash-collisions')}
                                        >
                                            Siguiente: Colisiones Hash <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hash Collisions Content */}
                        {currentVulnerability === 'hash-collisions' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Colisiones y Ataques de Preimagen en Hashes</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        Las funciones hash criptográficas son componentes fundamentales de la seguridad digital,
                                                        ya que convierten datos de cualquier tamaño en "huellas digitales" de tamaño fijo.
                                                        Idealmente, estas funciones deben ser resistentes a diferentes tipos de ataques,
                                                        pero cuando estas propiedades se rompen, surgen vulnerabilidades críticas.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Propiedades Ideales de Funciones Hash</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">Determinismo:</span> El mismo input siempre produce el mismo output</li>
                                                        <li><span className="font-medium">Eficiencia:</span> Cálculo rápido del hash para cualquier entrada</li>
                                                        <li><span className="font-medium">Efecto avalancha:</span> Pequeños cambios en la entrada producen cambios completamente diferentes en la salida</li>
                                                        <li><span className="font-medium">Resistencia a preimagen:</span> Dado un hash, es computacionalmente difícil encontrar un mensaje que lo produzca</li>
                                                        <li><span className="font-medium">Resistencia a segunda preimagen:</span> Dado un mensaje, es difícil encontrar otro mensaje que produzca el mismo hash</li>
                                                        <li><span className="font-medium">Resistencia a colisiones:</span> Es difícil encontrar dos mensajes diferentes que produzcan el mismo hash</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Tipos de Ataques</h3>
                                                    <div className="overflow-x-auto mb-4">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Tipo de Ataque</th>
                                                                    <th>Descripción</th>
                                                                    <th>Dificultad Teórica</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Ataque de Preimagen</td>
                                                                    <td>Dado un hash h, encontrar cualquier mensaje m donde hash(m) = h</td>
                                                                    <td>2<sup>n</sup> operaciones (n = bits de salida)</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Ataque de Segunda Preimagen</td>
                                                                    <td>Dado un mensaje m<sub>1</sub>, encontrar otro mensaje m<sub>2</sub> donde hash(m<sub>1</sub>) = hash(m<sub>2</sub>)</td>
                                                                    <td>2<sup>n</sup> operaciones</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Ataque de Colisión</td>
                                                                    <td>Encontrar dos mensajes diferentes m<sub>1</sub> y m<sub>2</sub> donde hash(m<sub>1</sub>) = hash(m<sub>2</sub>)</td>
                                                                    <td>2<sup>n/2</sup> operaciones (Paradoja del cumpleaños)</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <p className="text-sm">
                                                        Observa que los ataques de colisión son teóricamente más fáciles (raíz cuadrada de operaciones)
                                                        que los ataques de preimagen, debido al principio matemático conocido como paradoja del cumpleaños.
                                                    </p>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiHash className="text-primary" />
                                                                Algoritmos Hash Comunes
                                                            </h3>
                                                            <div className="overflow-x-auto">
                                                                <table className="table w-full text-sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Algoritmo</th>
                                                                            <th>Tamaño Output</th>
                                                                            <th>Estado</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>MD5</td>
                                                                            <td>128 bits</td>
                                                                            <td className="text-error">Roto</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>SHA-1</td>
                                                                            <td>160 bits</td>
                                                                            <td className="text-error">Roto</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>SHA-256</td>
                                                                            <td>256 bits</td>
                                                                            <td className="text-success">Seguro</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>SHA-3</td>
                                                                            <td>Flexible</td>
                                                                            <td className="text-success">Seguro</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>BLAKE2</td>
                                                                            <td>Flexible</td>
                                                                            <td className="text-success">Seguro</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiAlertTriangle className="text-warning" />
                                                                Impacto de las Colisiones
                                                            </h3>
                                                            <p className="text-sm">
                                                                Las colisiones de hash pueden comprometer:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li>Firmas digitales</li>
                                                                <li>Integridad de archivos</li>
                                                                <li>Sistemas de autenticación</li>
                                                                <li>Certificados SSL/TLS</li>
                                                                <li>Verificación de software</li>
                                                                <li>Estructuras de datos criptográficas</li>
                                                                <li>Blockchain y criptomonedas</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de Ataques a Funciones Hash</h2>

                                            <h3 className="text-xl font-bold mb-3">Colisiones Históricas Notables</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-bold">MD5 (Roto en 2004)</h4>
                                                            <p className="text-sm mb-2">
                                                                El primer ataque práctico contra MD5 fue demostrado por Xiaoyun Wang y sus colegas,
                                                                generando dos mensajes diferentes con el mismo hash MD5 en minutos.
                                                            </p>
                                                            <p className="text-sm">
                                                                En 2008, un equipo de investigadores creó un certificado SSL fraudulento
                                                                explotando colisiones MD5, demostrando un ataque práctico en una infraestructura
                                                                de confianza real (conocido como ataque "MD5 Considered Harmful Today").
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">SHA-1 (Roto en 2017)</h4>
                                                            <p className="text-sm mb-2">
                                                                Google y CWI Amsterdam demostraron la primera colisión práctica
                                                                de SHA-1 con el ataque "SHAttered", creando dos archivos PDF diferentes
                                                                con el mismo hash SHA-1.
                                                            </p>
                                                            <p className="text-sm">
                                                                El ataque requirió aproximadamente 6.500 años de CPU y 100 años de GPU
                                                                equivalentes a un solo procesador, pero fue factible con recursos distribuidos.
                                                                Desde entonces, el costo ha disminuido significativamente.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Técnicas de Ataque</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Ataque de Cumpleaños</h4>
                                                        <p className="text-sm">
                                                            Basado en la paradoja del cumpleaños: en un grupo de solo 23 personas,
                                                            hay una probabilidad mayor al 50% de que dos compartan cumpleaños.
                                                        </p>
                                                        <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                                                            <li>Generar variantes del mensaje M<sub>1</sub> (p.ej. añadiendo diferentes valores)</li>
                                                            <li>Computar y almacenar los hashes de estas variantes</li>
                                                            <li>Generar variantes del mensaje M<sub>2</sub></li>
                                                            <li>Verificar si algún hash coincide con los almacenados</li>
                                                            <li>Si hay coincidencia, se encontró una colisión</li>
                                                        </ol>
                                                        <p className="text-sm mt-2">
                                                            En vez de intentar 2<sup>n</sup> combinaciones (para un hash de n bits),
                                                            solo requiere aproximadamente 2<sup>n/2</sup> intentos.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Ataques de Criptoanálisis</h4>
                                                        <p className="text-sm">
                                                            Explotan debilidades matemáticas específicas de los algoritmos.
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                                            <li><span className="font-medium">Criptoanálisis diferencial:</span> Analiza cómo las diferencias en la entrada afectan al hash</li>
                                                            <li><span className="font-medium">Ataque de longitud extendida:</span> Explotan debilidades en la estructura de Merkle-Damgård</li>
                                                            <li><span className="font-medium">Ataques de canal lateral:</span> Observan tiempo de ejecución, consumo de energía o radiación electromagnética</li>
                                                            <li><span className="font-medium">Reutilización de bloques:</span> En algoritmos con debilidades en la función de compresión</li>
                                                        </ul>
                                                        <p className="text-sm mt-2">
                                                            Los ataques modernos suelen combinar múltiples técnicas para reducir
                                                            la complejidad computacional.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Caso Práctico: Ataque a Certificados SSL</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="text-sm mb-3">
                                                        Los ataques de colisión han sido utilizados para crear certificados SSL fraudulentos:
                                                    </p>
                                                    <ol className="list-decimal list-inside text-sm space-y-1">
                                                        <li>El atacante obtiene un certificado legítimo para un dominio que controla</li>
                                                        <li>Genera dos CSRs (Certificate Signing Requests):
                                                            <ul className="list-disc list-inside ml-4">
                                                                <li>CSR<sub>1</sub>: Para su propio dominio (benign.com)</li>
                                                                <li>CSR<sub>2</sub>: Para el dominio objetivo (bank.com)</li>
                                                            </ul>
                                                        </li>
                                                        <li>Manipula ambos CSRs para que produzcan el mismo hash (MD5 o SHA-1)</li>
                                                        <li>Envía CSR<sub>1</sub> a la Autoridad de Certificación que firma con la función hash vulnerable</li>
                                                        <li>La firma también es válida para CSR<sub>2</sub> debido a la colisión</li>
                                                        <li>El atacante ahora tiene un certificado fraudulento para bank.com firmado por una CA de confianza</li>
                                                    </ol>
                                                    <p className="text-sm mt-2">
                                                        Este tipo de ataque llevó al abandono de MD5 y posteriormente SHA-1 en certificados SSL/TLS.
                                                    </p>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Exploración Experimental de Colisiones</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">Colisiones MD5</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-base-300 p-2 rounded-md text-xs font-mono">
                                                            # Primer archivo (hello1.bin)<br />
                                                            d1 31 dd 02 c5 e6 ee c4<br />
                                                            69 3d 9a 06 98 af f9 5c<br />
                                                            2f ca b5 87 12 46 7e ab<br />
                                                            40 04 58 3e b8 fb 7f 89<br />
                                                            <br />
                                                            # MD5 Hash<br />
                                                            79054025255fb1a26e4bc422aef54eb4
                                                        </div>
                                                        <div className="bg-base-300 p-2 rounded-md text-xs font-mono">
                                                            # Segundo archivo (hello2.bin)<br />
                                                            d1 31 dd 02 c5 e6 ee c4<br />
                                                            69 3d 9a 06 98 af f9 5c<br />
                                                            2f ca b5 07 12 46 7e ab<br />
                                                            40 04 58 3e b8 fb 7f 89<br />
                                                            <br />
                                                            # MD5 Hash<br />
                                                            79054025255fb1a26e4bc422aef54eb4
                                                        </div>
                                                    </div>
                                                    <p className="text-sm mt-2">
                                                        Observa que los archivos difieren solo en un byte (subrayado), pero producen
                                                        el mismo hash MD5. Esto ilustra una colisión práctica. Tales colisiones se pueden
                                                        generar con herramientas especializadas o encontrarse en bases de datos de colisiones.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Resistencia Cuántica</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                La computación cuántica presenta amenazas adicionales para las funciones hash:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>El algoritmo de Grover podría reducir la resistencia a preimagen de 2<sup>n</sup> a 2<sup>n/2</sup></li>
                                                                <li>Para mantener 128 bits de seguridad contra ataques cuánticos, se necesitarían funciones hash con salida de 256 bits</li>
                                                                <li>SHA-256 y SHA3-256 se consideran resistentes a la computación cuántica a corto y mediano plazo</li>
                                                                <li>Para sistemas que requieren seguridad a largo plazo, se recomienda SHA-512 o SHA3-512</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'protection' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Protección Contra Ataques de Hash</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Mejores Prácticas</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiShield className="mr-2 text-success" />
                                                                Recomendaciones Generales
                                                            </h4>
                                                            <ul className="list-disc list-inside">
                                                                <li>Usar algoritmos hash modernos y seguros (SHA-256, SHA-3, BLAKE2)</li>
                                                                <li>Abandonar inmediatamente MD5 y SHA-1 en todas las aplicaciones</li>
                                                                <li>Implementar verificaciones de integridad múltiples cuando sea posible</li>
                                                                <li>Actualizar regularmente los algoritmos según evoluciona la criptografía</li>
                                                                <li>Para almacenamiento de contraseñas, utilizar funciones diseñadas específicamente (Argon2, bcrypt)</li>
                                                                <li>Incorporar salt y pepper en aplicaciones de hashing de contraseñas</li>
                                                                <li>Considerar funciones hash con salida extendida (384/512 bits) para seguridad a largo plazo</li>
                                                                <li>Implementar sistemas de monitoreo para detectar intentos de explotación</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Selección de Algoritmos</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiCpu className="mr-2 text-primary" />
                                                                Algoritmos Recomendados por Caso de Uso
                                                            </h4>
                                                            <div className="overflow-x-auto">
                                                                <table className="table w-full text-sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Caso de Uso</th>
                                                                            <th>Recomendación</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>Integridad de archivos</td>
                                                                            <td>SHA-256, BLAKE2b, SHA3-256</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Firmas digitales</td>
                                                                            <td>SHA-384, SHA-512, SHA3-384</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Almacenamiento de contraseñas</td>
                                                                            <td>Argon2id, bcrypt, PBKDF2-HMAC-SHA512</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>HMAC</td>
                                                                            <td>HMAC-SHA256, HMAC-SHA512</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Blockchain/criptomonedas</td>
                                                                            <td>SHA-256, BLAKE2b, Keccak</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Entornos de recursos limitados</td>
                                                                            <td>BLAKE2s, SHA-256</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Protección a largo plazo</td>
                                                                            <td>SHA-512, SHA3-512</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Técnicas Avanzadas de Protección</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiRepeat className="mr-2 text-accent" />
                                                                Hash Concatenado
                                                            </h4>
                                                            <p className="text-sm">
                                                                Utiliza múltiples algoritmos hash independientes y concatena los resultados:
                                                            </p>
                                                            <div className="bg-base-300 p-2 rounded-md text-xs mt-2 font-mono">
                                                                // Ejemplo en pseudocódigo<br />
                                                                hash_final = SHA256(mensaje) + ":" + SHA3_256(mensaje)<br />
                                                                <br />
                                                                // Incluso si un algoritmo se rompe, el otro mantiene la seguridad
                                                            </div>
                                                            <p className="text-sm mt-2">
                                                                Esta técnica proporciona seguridad incluso si uno de los algoritmos es comprometido,
                                                                y es especialmente útil para sistemas críticos y datos de larga duración.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiKey className="mr-2 text-info" />
                                                                Hash Keyed (HMAC)
                                                            </h4>
                                                            <p className="text-sm">
                                                                Incorpora una clave secreta en el proceso de hash, proporcionando
                                                                autenticación además de integridad:
                                                            </p>
                                                            <div className="bg-base-300 p-2 rounded-md text-xs mt-2 font-mono">
                                                                // HMAC combina una clave con el mensaje<br />
                                                                hmac = HMAC(key, mensaje, SHA256)<br />
                                                                <br />
                                                                // Incluso con colisiones, un atacante necesitaría la clave
                                                            </div>
                                                            <p className="text-sm mt-2">
                                                                HMAC añade una capa de seguridad ya que, incluso si se encuentra una colisión,
                                                                el atacante necesitaría conocer la clave secreta para explotarla.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Verificación de Integridad Segura</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">Implementación Robusta de Verificación</h4>
                                                    <p className="text-sm mb-3">
                                                        Para la distribución segura de software y verificación de integridad:
                                                    </p>
                                                    <ol className="list-decimal list-inside text-sm space-y-1">
                                                        <li>Generar hashes usando algoritmos modernos (mínimo SHA-256)</li>
                                                        <li>Distribuir los valores hash a través de un canal seguro, separado del contenido</li>
                                                        <li>Firmar digitalmente los hashes con claves privadas seguras</li>
                                                        <li>Publicar los hashes en múltiples ubicaciones (sitio web HTTPS, repositorios Git seguros)</li>
                                                        <li>Utilizar Certificados de Transparencia para hash importantes</li>
                                                        <li>Implementar verificación automática en herramientas y clientes</li>
                                                    </ol>
                                                    <div className="bg-base-300 p-2 rounded-md text-xs mt-3 font-mono">
                                                        # Ejemplo de verificación robusta (Linux)<br />
                                                        # 1. Descarga el archivo y su firma<br />
                                                        wget https://example.com/downloads/file.tar.gz<br />
                                                        wget https://example.com/downloads/file.tar.gz.sha256<br />
                                                        wget https://example.com/downloads/file.tar.gz.sha256.sig<br />
                                                        <br />
                                                        # 2. Verifica la firma de los hash<br />
                                                        gpg --verify file.tar.gz.sha256.sig file.tar.gz.sha256<br />
                                                        <br />
                                                        # 3. Verifica el hash del archivo<br />
                                                        sha256sum -c file.tar.gz.sha256
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Consideraciones Futuras</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                La seguridad criptográfica es un campo en constante evolución. Para mantenerse protegido:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Diseñar sistemas con "agilidad criptográfica" - capacidad para actualizar algoritmos fácilmente</li>
                                                                <li>Seguir las recomendaciones de organismos como NIST, BSI, o ENISA</li>
                                                                <li>Monitorear avances en computación cuántica y posibles amenazas emergentes</li>
                                                                <li>Participar en comunidades de seguridad para mantenerse informado</li>
                                                                <li>Considerar la implementación gradual de algoritmos post-cuánticos cuando estén estandarizados</li>
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
                                            onClick={() => handleVulnerabilityChange('mitm')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: MITM
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleVulnerabilityChange('padding-oracle')}
                                        >
                                            Siguiente: Padding Oracle <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Padding Oracle Content */}
                        {currentVulnerability === 'padding-oracle' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Ataques Padding Oracle</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        Un ataque Padding Oracle es una técnica criptográfica que explota la forma en que un sistema
                                                        responde a mensajes cifrados con padding incorrecto. Esta vulnerabilidad permite a un atacante
                                                        descifrar datos sin conocer la clave secreta, rompiendo la confidencialidad de los datos cifrados
                                                        a través de un proceso iterativo que aprovecha las fugas de información sobre la validez del padding.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Contexto y Fundamentos</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">Cifrado por bloques:</span> Algoritmos como AES operan en bloques de tamaño fijo (p.ej., 16 bytes)</li>
                                                        <li><span className="font-medium">Padding:</span> Técnica para completar los datos hasta un múltiplo del tamaño del bloque</li>
                                                        <li><span className="font-medium">Modos de operación:</span> CBC (Cipher Block Chaining) es especialmente vulnerable</li>
                                                        <li><span className="font-medium">Oracle:</span> Un sistema que revela (incluso indirectamente) si el padding de un mensaje cifrado es válido</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">El Problema del Padding</h3>
                                                    <p className="mb-4">
                                                        El estándar de padding más común es PKCS#7, donde el valor del byte de relleno es igual al número de bytes añadidos:
                                                    </p>
                                                    <div className="overflow-x-auto mb-4">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Bytes faltantes</th>
                                                                    <th>Padding PKCS#7</th>
                                                                    <th>Ejemplo (bloque de 16 bytes)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1 byte</td>
                                                                    <td>01</td>
                                                                    <td>"AAAAAAAAAAAAA<span className="bg-primary/20">01</span>"</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>2 bytes</td>
                                                                    <td>02 02</td>
                                                                    <td>"AAAAAAAAAAAA<span className="bg-primary/20">02 02</span>"</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>3 bytes</td>
                                                                    <td>03 03 03</td>
                                                                    <td>"AAAAAAAAAAA<span className="bg-primary/20">03 03 03</span>"</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>...</td>
                                                                    <td>...</td>
                                                                    <td>...</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>16 bytes (bloque completo)</td>
                                                                    <td>10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10</td>
                                                                    <td><span className="bg-primary/20">10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10</span></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <p className="text-sm mb-4">
                                                        Durante el descifrado, el sistema verifica que el padding sea válido. Si no lo es,
                                                        puede producir un error o comportamiento distintivo - esta es la "filtración" de
                                                        información que el ataque explota.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Impacto y Vulnerabilidades</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">Descifrado de datos:</span> Permite recuperar mensajes cifrados sin conocer la clave</li>
                                                        <li><span className="font-medium">Compromisos de seguridad:</span> Datos confidenciales, tokens de sesión, contraseñas cifradas</li>
                                                        <li><span className="font-medium">Bypass de autenticación:</span> Puede permitir alterar mensajes cifrados para cambiar su significado</li>
                                                        <li><span className="font-medium">Afecta a diversas implementaciones:</span> Aplicaciones web, servicios de autenticación, tokens encriptados</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiAlertTriangle className="text-warning" />
                                                                Casos Notables
                                                            </h3>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li><span className="font-medium">ASP.NET (2010):</span> Afectó a todas las versiones, permitiendo descifrar ViewState</li>
                                                                <li><span className="font-medium">Java Server Faces:</span> Problema similar al de ASP.NET en implementaciones de JSF</li>
                                                                <li><span className="font-medium">OpenSSL (CVE-2016-2107):</span> Vulnerabilidad Padding Oracle en conexiones AES-CBC</li>
                                                                <li><span className="font-medium">ROBOT (2017):</span> Ataque de Padding Oracle contra implementaciones TLS (RSA PKCS#1)</li>
                                                                <li><span className="font-medium">Netflix/Spring Security:</span> Vulnerabilidad en tokens de autenticación cifrados</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiEye className="text-error" />
                                                                ¿Qué revela un Oracle?
                                                            </h3>
                                                            <p className="text-sm">
                                                                Un "padding oracle" puede manifestarse de diversas formas:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li>Mensajes de error específicos</li>
                                                                <li>Diferencias en tiempos de respuesta</li>
                                                                <li>Códigos de estado HTTP distintos</li>
                                                                <li>Cambios en el contenido de las respuestas</li>
                                                                <li>Comportamiento diferente ante padding válido vs. inválido</li>
                                                            </ul>
                                                            <p className="text-sm mt-2">
                                                                Incluso diferencias muy sutiles pueden ser suficientes para realizar el ataque.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de Ataques Padding Oracle</h2>

                                            <h3 className="text-xl font-bold mb-3">Fundamentos del Cifrado CBC</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-bold">Cipher Block Chaining (CBC)</h4>
                                                            <p className="text-sm mb-2">
                                                                El modo CBC es particularmente vulnerable a ataques de padding oracle. Funciona de la siguiente manera:
                                                            </p>
                                                            <ol className="list-decimal list-inside text-sm space-y-1">
                                                                <li>Cada bloque de texto plano se combina (XOR) con el bloque cifrado anterior</li>
                                                                <li>El primer bloque usa un vector de inicialización (IV)</li>
                                                                <li>Esta dependencia entre bloques propaga errores y permite manipulaciones específicas</li>
                                                            </ol>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">Descifrado en CBC</h4>
                                                            <p className="text-sm mb-2">
                                                                Durante el descifrado en CBC:
                                                            </p>
                                                            <ol className="list-decimal list-inside text-sm space-y-1">
                                                                <li>Se descifra cada bloque con la clave</li>
                                                                <li>Se aplica XOR con el bloque cifrado anterior (o IV para el primer bloque)</li>
                                                                <li>Se verifica el padding del resultado final</li>
                                                                <li>Si el padding es inválido, se produce un error o comportamiento diferente</li>
                                                            </ol>
                                                            <p className="text-sm mt-2">
                                                                <span className="font-medium">Importante:</span> La verificación de padding ocurre después del descifrado,
                                                                permitiendo que un atacante influya en el texto plano resultante mediante manipulaciones del texto cifrado.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Mecánica del Ataque</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base">Algoritmo Básico del Ataque</h4>
                                                    <p className="text-sm mb-3">
                                                        El atacante trabaja con pares de bloques cifrados (C<sub>i-1</sub>, C<sub>i</sub>). Para un cifrado de 16 bytes por bloque:
                                                    </p>
                                                    <ol className="list-decimal list-inside text-sm space-y-1">
                                                        <li>El atacante crea un bloque modificado C'<sub>i-1</sub> alterando bytes específicos</li>
                                                        <li>Envía el par (C'<sub>i-1</sub>, C<sub>i</sub>) al sistema</li>
                                                        <li>El sistema descifra C<sub>i</sub> obteniendo un valor intermedio I</li>
                                                        <li>Luego calcula P'<sub>i</sub> = I ⊕ C'<sub>i-1</sub></li>
                                                        <li>Verifica si P'<sub>i</sub> tiene un padding válido</li>
                                                        <li>La respuesta (éxito/error) proporciona información que el atacante aprovecha</li>
                                                    </ol>
                                                    <p className="text-sm mt-3">
                                                        El atacante realiza modificaciones sistemáticas, generalmente empezando con el último byte del bloque
                                                        y trabajando hacia atrás, descifrando un byte a la vez.
                                                    </p>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Proceso Paso a Paso</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="text-sm mb-3">
                                                        Para descifrar el último byte de un bloque, el ataque procede así:
                                                    </p>
                                                    <ol className="list-decimal list-inside text-sm space-y-1">
                                                        <li>El atacante modifica el último byte del bloque anterior (C<sub>i-1</sub>) probando todos los valores posibles (0-255)</li>
                                                        <li>Cuando encuentra un valor que produce padding válido, sabe que el byte descifrado es 0x01</li>
                                                        <li>Puede calcular el valor intermedio I para ese byte: I = 0x01 ⊕ C'<sub>i-1</sub>[último byte]</li>
                                                        <li>Conociendo I, puede calcular el byte de texto plano: P<sub>i</sub>[último byte] = I ⊕ C<sub>i-1</sub>[último byte]</li>
                                                        <li>Ahora trabaja en el penúltimo byte, modificando C<sub>i-1</sub> para obtener un padding válido de 0x02 0x02</li>
                                                        <li>El proceso continúa hacia atrás hasta descifrar todo el bloque</li>
                                                    </ol>

                                                    <div className="bg-base-300 p-3 rounded-md text-xs mt-3 font-mono">
                                                        # Ejemplo simplificado para descifrar el último byte:<br />
                                                        <br />
                                                        # Bloques cifrados originales<br />
                                                        C₁ = [a1, a2, a3, ..., a16]<br />
                                                        C₂ = [b1, b2, b3, ..., b16]<br />
                                                        <br />
                                                        # Para cada posible valor x (0-255):<br />
                                                        # 1. Crear C'₁ modificando el último byte<br />
                                                        C'₁ = [a1, a2, a3, ..., a15, x]<br />
                                                        <br />
                                                        # 2. Enviar (C'₁, C₂) al oracle<br />
                                                        # 3. Si oracle indica padding válido:<br />
                                                        #    Sabemos que el último byte descifrado es 0x01<br />
                                                        #    Calculamos el valor intermedio: I₁₆ = 0x01 ⊕ x<br />
                                                        #    Calculamos el byte de texto plano: P₁₆ = I₁₆ ⊕ a16<br />
                                                        <br />
                                                        # 4. Repetir para bytes anteriores...
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Herramientas para Padding Oracle</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Herramienta</th>
                                                            <th>Descripción</th>
                                                            <th>Uso Típico</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>PadBuster</td>
                                                            <td>Herramienta de línea de comandos para explotar vulnerabilidades de Padding Oracle</td>
                                                            <td>Aplicaciones web, tokens cifrados</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Poracle</td>
                                                            <td>Framework Python para ataques Padding Oracle</td>
                                                            <td>Pruebas de concepto, investigación</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Burp Suite Intruder</td>
                                                            <td>Funcionalidad de la herramienta de pruebas de penetración</td>
                                                            <td>Testing manual de vulnerabilidades</td>
                                                        </tr>
                                                        <tr>
                                                            <td>POET (Padding Oracle Exploit Tool)</td>
                                                            <td>Herramienta automatizada de Java para pruebas de Padding Oracle</td>
                                                            <td>Evaluación de seguridad automatizada</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Variaciones y Complejidades</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                Los ataques reales de Padding Oracle pueden ser más complejos:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>El oráculo puede ser "ruidoso" con respuestas inconsistentes</li>
                                                                <li>Pueden requerirse métodos estadísticos para determinar las respuestas correctas</li>
                                                                <li>Las implementaciones pueden tener contramedidas parciales</li>
                                                                <li>El número de solicitudes necesarias puede ser alto (aproximadamente 256 por byte)</li>
                                                                <li>Limitaciones de tasa y otros controles pueden obstaculizar el ataque</li>
                                                                <li>Algunos sistemas utilizan variaciones de padding estándar</li>
                                                            </ul>
                                                            <p className="mt-1">
                                                                A pesar de estas dificultades, los ataques siguen siendo prácticos en muchos escenarios reales.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'protection' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Protección Contra Ataques Padding Oracle</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Mitigaciones Fundamentales</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiShield className="mr-2 text-success" />
                                                                Estrategias Principales
                                                            </h4>
                                                            <ul className="list-disc list-inside">
                                                                <li><span className="font-medium">Usar AEAD:</span> Implement cifrados autenticados con datos asociados (GCM, CCM)</li>
                                                                <li><span className="font-medium">Validación de MAC:</span> Verificar integridad antes de descifrar</li>
                                                                <li><span className="font-medium">Respuestas constantes:</span> No revelar diferencias entre errores de padding</li>
                                                                <li><span className="font-medium">Validación retrasada:</span> Continuar procesamiento aunque haya errores</li>
                                                                <li><span className="font-medium">Aleatorización:</span> Agregar elementos aleatorios para dificultar análisis</li>
                                                                <li><span className="font-medium">Rotación de claves:</span> Cambiar claves regularmente</li>
                                                                <li><span className="font-medium">Limitar intentos:</span> Restringir número de operaciones fallidas</li>
                                                                <li><span className="font-medium">Monitoreo:</span> Detectar patrones de comportamiento indicativos de ataque</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Algoritmos y Modos Seguros</h3>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiCpu className="mr-2 text-primary" />
                                                                Recomendaciones Criptográficas
                                                            </h4>
                                                            <div className="overflow-x-auto">
                                                                <table className="table w-full text-sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Tipo</th>
                                                                            <th>Recomendado</th>
                                                                            <th>Evitar</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>Cifrado Simétrico</td>
                                                                            <td>AES-GCM, AES-CCM, ChaCha20-Poly1305</td>
                                                                            <td>AES-CBC sin MAC, DES, 3DES</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Modo de Operación</td>
                                                                            <td>GCM, CCM, SIV, EAX</td>
                                                                            <td>ECB, CBC sin autenticación</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Autenticación</td>
                                                                            <td>HMAC, Poly1305, GMAC</td>
                                                                            <td>Checksums simples, CRC, algoritmos hash no MAC</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Construcción</td>
                                                                            <td>Encrypt-then-MAC, AEAD</td>
                                                                            <td>MAC-then-Encrypt, Encrypt-and-MAC</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Implementación</td>
                                                                            <td>Bibliotecas criptográficas actualizadas</td>
                                                                            <td>Implementaciones propias, código heredado</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">AEAD: La Solución Preferida</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="text-sm mb-3">
                                                        Los modos AEAD (Authenticated Encryption with Associated Data) representan la mejor solución contra los ataques Padding Oracle:
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-bold text-sm">Características AEAD</h4>
                                                            <ul className="list-disc list-inside text-sm space-y-1">
                                                                <li>Proveen confidencialidad e integridad en una sola operación</li>
                                                                <li>Verifican autenticidad antes de iniciar el descifrado</li>
                                                                <li>Sin necesidad de implementar protocolos MAC separados</li>
                                                                <li>Resistentes a manipulaciones del texto cifrado</li>
                                                                <li>Permiten incluir datos adicionales autenticados pero no cifrados</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm">Implementación con AES-GCM</h4>
                                                            <pre className="bg-base-300 p-2 rounded-md text-xs mt-1 font-mono overflow-x-auto">
                                                                {`// Ejemplo de código (pseudocódigo)
// Cifrado
key = generateSecureRandomKey(256)
iv = generateSecureRandomIV(12)
aad = "datos autenticados p
// AES-GCM integra cifrado y autenticación
[ciphertext, authTag] = AES_GCM_Encrypt(key, iv, plaintext, aad)
storedData = iv + aad + ciph
// Descifrado
[iv, aad, ciphertext, authTag] = parseStored
// Verificación y descifrado en una operación atómica
try {
plaintext = AES_GCM_Decrypt(key, iv, ciphertext, aad, authTag)
} catch (AuthenticationError) {
// Respuesta genérica que no revela información
return "Error de validación"
}`}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Mitigación con CBC</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="text-sm mb-3">
                                                        Si debe usar CBC por compatibilidad, implemente Encrypt-then-MAC:
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-bold text-sm">Pasos para Encrypt-then-MAC</h4>
                                                            <ol className="list-decimal list-inside text-sm space-y-1">
                                                                <li>Cifrar el mensaje con CBC</li>
                                                                <li>Generar un MAC (HMAC) del texto cifrado completo (incluyendo IV)</li>
                                                                <li>Almacenar/transmitir: IV + Texto Cifrado + MAC</li>
                                                                <li>Para descifrar, primero verificar el MAC</li>
                                                                <li>Solo proceder con el descifrado si el MAC es válido</li>
                                                                <li>Usar claves diferentes para cifrado y MAC</li>
                                                            </ol>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm">Manejo de Errores Seguro</h4>
                                                            <p className="text-sm mb-2">
                                                                Implementar respuestas genéricas que no revelen información:
                                                            </p>
                                                            <pre className="bg-base-300 p-2 rounded-md text-xs mt-1 font-mono overflow-x-auto">
                                                                {`// Pseudocódigo de manejo seguro
function decrypt(ciphertext, iv, mac) {
// 1. Verificar MAC antes de cualquier otra operación
calculatedMac = HMAC(macKey, 
// 2. Comparación resistente a timing attacks
if (!constantTimeEquals(calculatedMac, mac)) {
    return standardErrorResponse()

// 3. Descifrar
try {
    plaintext = AES_CBC_Decrypt(encKey, iv, ciphertext)
    // 4. Validar padding en tiempo constante
    if (!validatePaddingConstantTime(plaintext)) {
    return standardErrorResponse()
    }
    return removePadding(plaintext)
} catch (Exception) {
    return standardErrorResponse()
}
}`}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Ejemplo de Código Seguro</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="tabs mb-4">
                                                        <a className="tab tab-lifted tab-active">JavaScript</a>
                                                        <a className="tab tab-lifted">Python</a>
                                                        <a className="tab tab-lifted">Java</a>
                                                    </div>
                                                    <pre className="bg-base-300 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                                        {`// Ejemplo de implementación segura en Node.js
const crypto = requ
// Función para cifrar datos de manera segura
function encryptData(data, encKey, macKey) {
// Generar IV aleatorio
const iv = crypto.ra
// Crear cipher con AES-GCM (AEAD)
const cipher = crypto.createCipheriv('aes-256-gcm'
// Opcional: Agregar datos autenticados que no serán cifrados
const aad = Buffer.from('datos adicionales');
ciphe
// Cifrar los datos
let encrypted = cipher.update(data, 'utf8');
encrypted = Buffer.concat([encrypted, cip
// Obtener el tag de autenticación
const authTag = cipher
// Combinar los elementos en un búfer
const result = Buffer.concat([
    iv,
    Buffer.from([aad.length]), // Longitud de AAD para facilitar parseo
    aad,
    encrypted,
    authTag

return result.toString('base64');

// Función para descifrar datos de manera segura
function decryptData(encryptedBase64, encKey, macKey) {
try {
    const data = Buffer.from(encryptedBase
    // Extraer los componentes
    const iv = data.slice(0, 16);
    const aadLength = data[16];
    const aad = data.slice(17, 17 + aadLength);
    const encrypted = data.slice(17 + aadLength, data.length - 16);
    const authTag = data.slice(data
    // Crear decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', encKey, iv);
    decipher.setAAD(aad);
    decipher.setAut
    // Descifrar
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decip
    return decrypted.toString('utf8');
} catch (err) {
    // Respuesta genérica que no revela información sobre el error
    console.error('Error interno:', err.message);
    return null;
}
}`}
                                                    </pre>

                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Auditoría y Verificación</h3>
                                                        <div className="text-sm">
                                                            <p>
                                                                Para verificar que tu aplicación no es vulnerable a ataques de Padding Oracle:
                                                            </p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Realizar pruebas de penetración específicas para Padding Oracle</li>
                                                                <li>Verificar todas las respuestas de error para asegurar que son uniformes</li>
                                                                <li>Implementar pruebas automatizadas que intenten manipular datos cifrados</li>
                                                                <li>Utilizar herramientas de análisis estático para identificar patrones vulnerables</li>
                                                                <li>Ejecutar pruebas de tiempo para detectar fugas de información por canales laterales</li>
                                                                <li>Establecer un programa de bug bounty o revisiones de seguridad periódicas</li>
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
                                            onClick={() => handleVulnerabilityChange('hash-collisions')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: Colisiones Hash
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
                                    ) : (
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
                                    <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Seguridad y Vulnerabilidades</h2>
                                    <p className="text-lg mb-6">Has dominado los conceptos fundamentales sobre vulnerabilidades criptográficas importantes y las técnicas para protegerte contra ellas.</p>

                                    <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                                                <FiCrosshair className="h-5 w-5" />
                                                Analista de Vulnerabilidades
                                            </div>
                                        </div>
                                        <p>Has demostrado comprensión sólida sobre ataques MITM, colisiones en funciones hash y vulnerabilidades de Padding Oracle, así como sus contramedidas.</p>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4">Conocimientos adquiridos</h3>
                                    <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 space-y-2">
                                        <li>Funcionamiento y peligros de los ataques de hombre en el medio (MITM)</li>
                                        <li>Técnicas de explotación y protección contra spoofing ARP y DNS</li>
                                        <li>Propiedades de seguridad de las funciones hash y sus vulnerabilidades</li>
                                        <li>Impacto de las colisiones y ataques de preimagen en sistemas criptográficos</li>
                                        <li>Mecanismo de los ataques de Padding Oracle y su mitigación</li>
                                        <li>Implementación de cifrado autenticado (AEAD) para evitar vulnerabilidades</li>
                                        <li>Mejores prácticas de seguridad para sistemas criptográficos modernos</li>
                                    </ul>

                                    <div className="alert alert-info shadow-lg mb-6 text-left">
                                        <div>
                                            <FiHelpCircle className="w-6 h-6" />
                                            <div>
                                                <h3 className="font-bold">Próximos pasos</h3>
                                                <p>Para continuar tu formación en seguridad, te recomendamos explorar los módulos de "Criptoanálisis Avanzado", "Hardening y Auditoría de Sistemas" o "Evaluación de Seguridad en Aplicaciones Web". También podrías interesarte en cursos sobre técnicas ofensivas como "Pentesting en Entornos Criptográficos".</p>
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