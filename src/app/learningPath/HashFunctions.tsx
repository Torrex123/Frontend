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
    FiHelpCircle,
    FiCheckCircle,
    FiX,
    FiCode,
    FiHash,
    FiDatabase,
    FiCpu,
    FiAlertTriangle,
    FiSearch,
    FiUserCheck,
    FiLink,
    FiInfo,
} from 'react-icons/fi';
import { FaFingerprint } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import CodeEditor from '../components/CodeEditor';
import { useSearchParams, useRouter } from 'next/navigation';
import { startSubModule, getSubModule, completeSubModule, completeModule } from '../../../api/api';

type HashType = 'sha1' | 'sha2';
type ProgressStage = 'learning' | 'quiz' | 'practical' | 'completed';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

export default function HashFunctions() {
    const [currentHashFunction, setCurrentHashFunction] = useState<HashType>('sha1');
    const [progress, setProgress] = useState<number>(0);
    const [stage, setStage] = useState<ProgressStage>('learning');
    const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
    const [quizPassed, setQuizPassed] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('info');
    const [questionsAnswered, setQuestionsAnswered] = useState<number[]>([]);
    const [practicalCompleted, setPracticalCompleted] = useState<boolean>(false);
    /*
    const [testsPassed, setTestsPassed] = useState(false);
    const [testResults, setTestResults] = useState(null);
    */
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            question: "¿Cuál es la principal característica de una función hash criptográfica?",
            options: [
                "Es reversible con una clave secreta",
                "Produce una salida de longitud fija independientemente del tamaño de entrada",
                "Siempre produce el mismo resultado para cualquier entrada",
                "Consume muy pocos recursos computacionales"
            ],
            correctAnswer: "Produce una salida de longitud fija independientemente del tamaño de entrada"
        },
        {
            id: 2,
            question: "¿Cuál es el tamaño de salida (digest) de SHA-1?",
            options: [
                "128 bits",
                "160 bits",
                "256 bits",
                "512 bits"
            ],
            correctAnswer: "160 bits"
        },
        {
            id: 3,
            question: "¿Por qué SHA-1 se considera inseguro para muchas aplicaciones modernas?",
            options: [
                "Es demasiado lento para ser práctico",
                "Su código fuente no está disponible públicamente",
                "Se han demostrado colisiones prácticas",
                "Solo funciona en sistemas operativos antiguos"
            ],
            correctAnswer: "Se han demostrado colisiones prácticas"
        },
        {
            id: 4,
            question: "¿Cuál de las siguientes NO es una variante de SHA-2?",
            options: [
                "SHA-224",
                "SHA-256",
                "SHA-384",
                "SHA-128"
            ],
            correctAnswer: "SHA-128"
        },
        {
            id: 5,
            question: "¿Cuál es una aplicación común de las funciones hash en seguridad?",
            options: [
                "Cifrado de datos confidenciales",
                "Almacenamiento seguro de contraseñas",
                "Generación de claves asimétricas",
                "Descifrado de mensajes"
            ],
            correctAnswer: "Almacenamiento seguro de contraseñas"
        }
    ]);
    interface Submodule {
        id: string;
        title: string;
        status: string;
        place: number;
        // add other properties if needed
    }
    const [submoduleList, setSubmoduleList] = useState<Submodule[]>([]);
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        let newProgress = 0;

        if (currentHashFunction === 'sha1') newProgress = 0;
        else if (currentHashFunction === 'sha2') newProgress = 50;

        if (stage === 'quiz') newProgress = 80;
        else if (stage === 'practical') newProgress = 90;
        else if (stage === 'completed') newProgress = 100;

        setProgress(newProgress);
    }, [currentHashFunction, stage]);

    useEffect(() => {
        const moduleId = params.get('id');
        const fetchSubModule = async () => {
            try {
                const response = await getSubModule(moduleId as string);
                const submodules = response.data.data;
                setSubmoduleList(submodules);

                const validTitles: HashType[] = ['sha1', 'sha2'];
                const sorted = [...submodules].sort((a, b) => a.place - b.place);

                let targetSubmodule = sorted.findLast((sub) => sub.status === 'en-progreso');
                if (!targetSubmodule) {
                    targetSubmodule = sorted.find((sub) => sub.status === 'no-iniciado');
                }

                if (targetSubmodule && validTitles.includes(targetSubmodule.title)) {
                    setCurrentHashFunction(targetSubmodule.title as HashType);
                } else {
                    setCurrentHashFunction('sha1');
                }
            } catch (error) {
                console.error('Error fetching submodule data:', error);
            }
        };

        fetchSubModule();
    }, []);


    const handleAnswerQuestion = (questionId: number, answer: string) => {
        const updatedQuestions = questions.map(q =>
            q.id === questionId ? { ...q, userAnswer: answer } : q
        );
        setQuestions(updatedQuestions);
        if (!questionsAnswered.includes(questionId)) {
            setQuestionsAnswered([...questionsAnswered, questionId]);
        }
    };

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

    const handleResetQuiz = () => {
        const resetQuestions = questions.map(q => ({ ...q, userAnswer: undefined }));
        setQuestions(resetQuestions);
        setQuestionsAnswered([]);
        setQuizSubmitted(false);
    };

    const handleSubmitPractical = () => {
        setPracticalCompleted(true);
        const completed = async () => {
            try {
                const moduleId = params.get('id');
                await completeModule(moduleId as string);
            } catch{
                throw new Error('Error completing module');
            }
        }
        setStage('completed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        completed();
        confetti({
            particleCount: 250,
            spread: 80,
            origin: { y: 0.6 },
        });
    };

    const handleHashFunctionChange = (hashFunction: HashType) => {
        const previousSection = currentHashFunction;

        setCurrentHashFunction(hashFunction);
        setActiveTab('info');

        try {
            const previousSubmodule = submoduleList.find((s) => s.title === previousSection);
            if (previousSubmodule?.id) {
                completeSubModule(previousSubmodule.id);
            } else {
                console.warn('Previous submodule not found for section:', previousSection);
            }

            const currentSubmodule = submoduleList.find((s) => s.title === hashFunction);
            if (currentSubmodule?.id) {
                startSubModule(currentSubmodule.id);
            } else {
                console.warn('Current submodule not found for section:', hashFunction);
            }
        } catch (error) {
            console.error('Error handling submodule transition:', error);
        }
    };

    const handleStartQuiz = () => {
        setStage('quiz');
    };

    const handleReturnToDashboard = () => {
        router.push('/home');
    };

    const runTests = async () => { }

    return (
        <div className="min-h-screen flex flex-col bg-base-100">
            {/* Module Header */}
            <header className="bg-base-200 py-6 shadow-md">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center">Funciones Hash Criptográficas</h1>

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
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentHashFunction === 'sha1' ? 'border-primary bg-primary text-primary-content' : progress >= 40 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FiHash className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">SHA-1</span>
                            </div>

                            <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                                    style={{ width: progress >= 40 ? '100%' : '0%' }}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentHashFunction === 'sha2' ? 'border-primary bg-primary text-primary-content' : progress >= 80 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                                    <FaFingerprint className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">SHA-2</span>
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
                {/* Learning Stage - Display content based on current hash function */}
                {stage === 'learning' && (
                    <div className="max-w-4xl mx-auto">
                        {/* Hash Function Navigation Tabs */}
                        <div className="tabs tabs-boxed mb-6 justify-center">
                            <button
                                className={`tab ${currentHashFunction === 'sha1' ? 'tab-active' : ''}`}
                                onClick={() => handleHashFunctionChange('sha1')}
                            >
                                SHA-1
                            </button>
                            <button
                                className={`tab ${currentHashFunction === 'sha2' ? 'tab-active' : ''}`}
                                onClick={() => handleHashFunctionChange('sha2')}
                            >
                                SHA-2
                            </button>
                        </div>

                        {/* Content Tabs for current hash function */}
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

                        {/* SHA-1 Content */}
                        {currentHashFunction === 'sha1' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">SHA-1 (Secure Hash Algorithm 1)</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        SHA-1 (Secure Hash Algorithm 1) es una función hash criptográfica diseñada por la Agencia de Seguridad Nacional de Estados Unidos (NSA)
                                                        y publicada en 1995 por el Instituto Nacional de Estándares y Tecnología (NIST). Durante muchos años fue uno de los algoritmos hash
                                                        más utilizados en todo tipo de aplicaciones de seguridad.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Produce un valor hash de 160 bits (20 bytes)</li>
                                                        <li>Puede procesar mensajes de hasta 2^64 - 1 bits de longitud</li>
                                                        <li>Basado en principios similares a los de los algoritmos MD4 y MD5</li>
                                                        <li>Diseñado para ser computacionalmente eficiente</li>
                                                        <li>Originalmente considerado seguro para aplicaciones criptográficas</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Estado Actual y Vulnerabilidades</h3>
                                                    <p className="mb-4">
                                                        Aunque SHA-1 fue ampliamente utilizado, con el tiempo se han identificado importantes vulnerabilidades:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>En 2005, se publicaron ataques teóricos que debilitaron significativamente su seguridad</li>
                                                        <li>En 2017, Google anunció la primera colisión práctica de SHA-1 (ataque "SHAttered")</li>
                                                        <li>Actualmente se considera obsoleto para la mayoría de los usos criptográficos</li>
                                                        <li>Ha sido reemplazado por SHA-2 y SHA-3 en aplicaciones que requieren seguridad</li>
                                                        <li>La mayoría de los estándares y regulaciones de seguridad ya no permiten su uso</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiAlertTriangle className="text-warning" />
                                                                Obsolescencia
                                                            </h3>
                                                            <p className="text-sm">
                                                                En 2017, el proyecto "SHAttered" demostró la primera colisión práctica de SHA-1, confirmando su vulnerabilidad. Esto llevó a:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li>Los navegadores dejaron de aceptar certificados SSL/TLS firmados con SHA-1</li>
                                                                <li>Git comenzó a mostrar advertencias sobre los commits verificados con SHA-1</li>
                                                                <li>Muchas organizaciones implementaron políticas para migrar a SHA-2</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiHash className="text-primary" />
                                                                Representación Típica
                                                            </h3>
                                                            <p className="text-sm mb-2">
                                                                SHA-1 generalmente se representa como una cadena hexadecimal de 40 caracteres:
                                                            </p>
                                                            <div className="bg-base-300 p-2 rounded-md text-xs font-mono break-all">
                                                                2fd4e1c67a2d28fced849ee1bb76e7391b93eb12
                                                            </div>
                                                            <p className="text-xs mt-2 text-base-content/70">
                                                                Este es el hash SHA-1 de la cadena "The quick brown fox jumps over the lazy dog"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de SHA-1</h2>

                                            <h3 className="text-xl font-bold mb-3">Estructura y Funcionamiento</h3>
                                            <p className="mb-4">
                                                SHA-1 es un algoritmo de hash que procesa mensajes en bloques de 512 bits y produce un digest de 160 bits.
                                                Su funcionamiento se basa en una estructura Merkle–Damgård con una función de compresión que utiliza operaciones lógicas.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Proceso General</h4>
                                                        <ol className="list-decimal list-inside space-y-1">
                                                            <li>Preprocesamiento del mensaje (padding)</li>
                                                            <li>Dividir el mensaje en bloques de 512 bits</li>
                                                            <li>Inicializar los valores de hash (5 valores de 32 bits)</li>
                                                            <li>Procesar cada bloque con la función de compresión</li>
                                                            <li>Combinar los resultados para generar el hash final</li>
                                                        </ol>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">Operaciones Básicas</h4>
                                                        <p className="mb-2">
                                                            SHA-1 utiliza las siguientes operaciones:
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            <li>Rotaciones de bits a la izquierda</li>
                                                            <li>Operaciones lógicas (AND, OR, XOR, NOT)</li>
                                                            <li>Adición modular de enteros de 32 bits</li>
                                                            <li>Cuatro funciones no lineales según la ronda</li>
                                                            <li>Expansión del bloque de 512 bits a 80 palabras de 32 bits</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Estructura de Rondas</h3>
                                            <p className="mb-4">
                                                SHA-1 procesa cada bloque de mensaje a través de 80 rondas organizadas en 4 etapas de 20 rondas cada una.
                                            </p>

                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Etapa</th>
                                                            <th>Rondas</th>
                                                            <th>Función</th>
                                                            <th>Constante</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>0-19</td>
                                                            <td><code>f(x,y,z) = (x AND y) OR ((NOT x) AND z)</code></td>
                                                            <td>0x5A827999</td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td>20-39</td>
                                                            <td><code>f(x,y,z) = x XOR y XOR z</code></td>
                                                            <td>0x6ED9EBA1</td>
                                                        </tr>
                                                        <tr>
                                                            <td>3</td>
                                                            <td>40-59</td>
                                                            <td><code>f(x,y,z) = (x AND y) OR (x AND z) OR (y AND z)</code></td>
                                                            <td>0x8F1BBCDC</td>
                                                        </tr>
                                                        <tr>
                                                            <td>4</td>
                                                            <td>60-79</td>
                                                            <td><code>f(x,y,z) = x XOR y XOR z</code></td>
                                                            <td>0xCA62C1D6</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Pseudocódigo Simplificado</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <pre className="bg-base-300 p-3 rounded-md text-sm overflow-x-auto">
                                                        {`// Inicialización
h0 = 0x67452301
h1 = 0xEFCDAB89
h2 = 0x98BADCFE
h3 = 0x10325476
h4 = 0xC3D2E1F0

// Procesamiento por bloques
for each 512-bit block of padded message
    break block into sixteen 32-bit big-endian words w[0..15]
    
    // Expansión del mensaje
    for i from 16 to 79
        w[i] = (w[i-3] XOR w[i-8] XOR w[i-14] XOR w[i-16]) leftrotate 1
    
    // Inicializar variables de trabajo
    a = h0, b = h1, c = h2, d = h3, e = h4
    
    // Rondas principales
    for i from 0 to 79
        if 0 ≤ i ≤ 19 then
            f = (b AND c) OR ((NOT b) AND d)
            k = 0x5A827999
        else if 20 ≤ i ≤ 39 then
            f = b XOR c XOR d
            k = 0x6ED9EBA1
        else if 40 ≤ i ≤ 59 then
            f = (b AND c) OR (b AND d) OR (c AND d)
            k = 0x8F1BBCDC
        else if 60 ≤ i ≤ 79 then
            f = b XOR c XOR d
            k = 0xCA62C1D6
        
        temp = (a leftrotate 5) + f + e + k + w[i]
        e = d
        d = c
        c = b leftrotate 30
        b = a
        a = temp
    
    // Actualizar valores hash
    h0 = h0 + a
    h1 = h1 + b
    h2 = h2 + c
    h3 = h3 + d
    h4 = h4 + e

// Resultado final
digest = h0 concatenate h1 concatenate h2 concatenate h3 concatenate h4`}
                                                    </pre>
                                                </div>
                                            </div>

                                            <div className="alert alert-warning shadow-lg">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Vulnerabilidades Técnicas</h3>
                                                        <div className="text-sm">
                                                            SHA-1 es vulnerable a ataques de colisión debido a debilidades en su función de compresión y el número limitado de rondas.
                                                            La primera colisión real (ataque SHAttered) utilizó una técnica de ataque de punto fijo que aprovecha propiedades matemáticas
                                                            específicas de SHA-1 para encontrar dos mensajes diferentes que producen el mismo hash.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de SHA-1</h2>

                                            <div className="alert alert-warning shadow-lg mb-6">
                                                <div>
                                                    <FiAlertTriangle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Advertencia de Seguridad</h3>
                                                        <div className="text-sm">
                                                            SHA-1 se considera obsoleto para usos criptográficos. Este contenido se proporciona con fines educativos
                                                            y para entender sistemas heredados. Para nuevas aplicaciones o actualizaciones, se recomienda utilizar SHA-256 o superior.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Usos Históricos</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiShield className="mr-2 text-primary" />
                                                                Seguridad Digital
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">TLS/SSL:</span> Certificados digitales y firmas (hasta 2017)</li>
                                                                <li><span className="font-medium">PGP/GPG:</span> Verificación de integridad en comunicaciones seguras</li>
                                                                <li><span className="font-medium">IPsec:</span> Autenticación en comunicaciones de red seguras</li>
                                                                <li><span className="font-medium">SSH:</span> Verificación de claves host en versiones antiguas</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="card bg-base-100 shadow-md h-full">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiCode className="mr-2 text-secondary" />
                                                                Control de Versiones
                                                            </h4>
                                                            <p className="mb-3">
                                                                SHA-1 aún se utiliza en algunos sistemas de control de versiones, siendo Git el más notable:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li>Identificación de commits y contenido</li>
                                                                <li>Detección de cambios en archivos</li>
                                                                <li>Verificación de integridad del repositorio</li>
                                                            </ul>
                                                            <p className="mt-2 text-sm">
                                                                Git ha comenzado a implementar SHA-256 en versiones nuevas, pero mantiene compatibilidad con SHA-1.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Aplicaciones No Criptográficas</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="mb-4">
                                                        SHA-1 aún puede ser adecuado para aplicaciones que no requieren seguridad criptográfica fuerte:
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiDatabase className="mr-2 text-accent" />
                                                                Deduplicación de Datos
                                                            </h4>
                                                            <p className="text-sm">
                                                                Identificación de archivos duplicados en sistemas de almacenamiento.
                                                                Las colisiones son extremadamente raras en uso normal sin intención maliciosa.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiFileText className="mr-2 text-info" />
                                                                Checksums de Archivos
                                                            </h4>
                                                            <p className="text-sm">
                                                                Verificación de integridad para detectar corrupción accidental (no maliciosa)
                                                                en transferencias o almacenamiento.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiSearch className="mr-2 text-success" />
                                                                Búsqueda Rápida
                                                            </h4>
                                                            <p className="text-sm">
                                                                Como clave de índice en estructuras de datos, donde las colisiones pueden manejarse
                                                                mediante verificación adicional.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Migración desde SHA-1</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-lg">Recomendaciones para la Transición</h4>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Uso original de SHA-1</th>
                                                                    <th>Alternativa recomendada</th>
                                                                    <th>Consideraciones</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Almacenamiento de contraseñas</td>
                                                                    <td>Argon2, bcrypt, PBKDF2</td>
                                                                    <td>Usar funciones diseñadas específicamente para contraseñas</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Certificados digitales</td>
                                                                    <td>SHA-256 o superior</td>
                                                                    <td>La mayoría de CAs ya no emiten certificados basados en SHA-1</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Firmas digitales</td>
                                                                    <td>SHA-256 o superior</td>
                                                                    <td>Las firmas SHA-1 ya no son confiables para verificación</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>HMAC-SHA1</td>
                                                                    <td>HMAC-SHA256</td>
                                                                    <td>HMAC-SHA1 todavía es relativamente seguro, pero mejor migrar por precaución</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-6">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleHashFunctionChange('sha2')}
                                        >
                                            Siguiente: SHA-2 <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SHA-2 Content */}
                        {currentHashFunction === 'sha2' && (
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {activeTab === 'info' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">SHA-2 (Secure Hash Algorithm 2)</h2>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="md:w-2/3">
                                                    <p className="mb-4">
                                                        SHA-2 (Secure Hash Algorithm 2) es una familia de funciones hash criptográficas diseñadas por la Agencia de Seguridad Nacional
                                                        de Estados Unidos (NSA) y publicadas por el NIST en 2001. SHA-2 surgió como sucesor de SHA-1 para ofrecer mayor seguridad
                                                        criptográfica y resistencia a ataques.
                                                    </p>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Familia de Algoritmos</h3>
                                                    <p className="mb-3">
                                                        SHA-2 no es un único algoritmo, sino una familia que incluye varias variantes con diferentes tamaños de salida:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li><span className="font-medium">SHA-224:</span> Produce un hash de 224 bits (28 bytes)</li>
                                                        <li><span className="font-medium">SHA-256:</span> Produce un hash de 256 bits (32 bytes)</li>
                                                        <li><span className="font-medium">SHA-384:</span> Produce un hash de 384 bits (48 bytes)</li>
                                                        <li><span className="font-medium">SHA-512:</span> Produce un hash de 512 bits (64 bytes)</li>
                                                        <li><span className="font-medium">SHA-512/224 y SHA-512/256:</span> Variantes truncadas de SHA-512</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Características Principales</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Mayor resistencia a colisiones que SHA-1</li>
                                                        <li>Arquitectura mejorada con más rondas y mejores funciones de mezcla</li>
                                                        <li>Tamaños de salida más grandes para mayor seguridad</li>
                                                        <li>SHA-256 y SHA-512 son las variantes más utilizadas</li>
                                                        <li>Estándar aprobado por FIPS (Federal Information Processing Standards)</li>
                                                        <li>Ampliamente adoptado en protocolos y aplicaciones de seguridad modernos</li>
                                                    </ul>

                                                    <h3 className="text-xl font-bold mt-6 mb-2">Estado de Seguridad Actual</h3>
                                                    <p className="mb-3">
                                                        A diferencia de SHA-1, la familia SHA-2 sigue siendo considerada segura para todos los usos criptográficos:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>No se han encontrado ataques prácticos que comprometan su seguridad</li>
                                                        <li>La seguridad teórica sigue siendo sólida tras más de 20 años de análisis</li>
                                                        <li>Es el estándar de facto para la mayoría de aplicaciones de seguridad actuales</li>
                                                        <li>Se espera que mantenga su seguridad durante muchos años más</li>
                                                    </ul>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <div className="card bg-base-100 shadow-lg mb-6">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiKey className="text-primary" />
                                                                SHA-256 vs SHA-512
                                                            </h3>
                                                            <p className="text-sm">
                                                                Las dos variantes principales de SHA-2 difieren en:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm mt-2">
                                                                <li><span className="font-medium">Tamaño de palabra:</span> 32 bits (SHA-256) vs 64 bits (SHA-512)</li>
                                                                <li><span className="font-medium">Número de rondas:</span> 64 en ambos</li>
                                                                <li><span className="font-medium">Rendimiento:</span> SHA-512 es a menudo más rápido en procesadores de 64 bits</li>
                                                                <li><span className="font-medium">Tamaño de salida:</span> 256 bits vs 512 bits</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="card bg-base-100 shadow-lg">
                                                        <div className="card-body">
                                                            <h3 className="card-title flex items-center gap-2">
                                                                <FiHash className="text-secondary" />
                                                                Ejemplo de SHA-256
                                                            </h3>
                                                            <p className="text-sm mb-2">
                                                                SHA-256 produce una cadena hexadecimal de 64 caracteres:
                                                            </p>
                                                            <div className="bg-base-300 p-2 rounded-md text-xs font-mono break-all">
                                                                d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592
                                                            </div>
                                                            <p className="text-xs mt-2 text-base-content/70">
                                                                Este es el hash SHA-256 de la cadena &apos;The quick brown fox jumps over the lazy dog&apos;
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'technical' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Detalles Técnicos de SHA-2</h2>

                                            <h3 className="text-xl font-bold mb-3">Arquitectura y Estructura</h3>
                                            <p className="mb-4">
                                                La familia SHA-2 se basa en una estructura Merkle–Damgård con una función de compresión que utiliza un diseño de red de sustitución-permutación.
                                                Las diferentes variantes comparten el mismo diseño general pero operan con diferentes tamaños de palabra y constantes.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">SHA-256</h4>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            <li>Opera con palabras de 32 bits</li>
                                                            <li>Procesa bloques de 512 bits</li>
                                                            <li>Estado interno de 256 bits (8 palabras de 32 bits)</li>
                                                            <li>64 rondas de procesamiento</li>
                                                            <li>8 valores constantes de inicialización</li>
                                                            <li>64 constantes de ronda derivadas de raíces cúbicas de primos</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="card bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <h4 className="card-title text-base">SHA-512</h4>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            <li>Opera con palabras de 64 bits</li>
                                                            <li>Procesa bloques de 1024 bits</li>
                                                            <li>Estado interno de 512 bits (8 palabras de 64 bits)</li>
                                                            <li>80 rondas de procesamiento</li>
                                                            <li>8 valores constantes de inicialización</li>
                                                            <li>80 constantes de ronda derivadas de raíces cúbicas de primos</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Procesamiento de Bloques en SHA-256</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <h4 className="card-title text-base mb-3">Pasos del Algoritmo</h4>
                                                    <ol className="list-decimal list-inside space-y-1">
                                                        <li>Preprocesamiento del mensaje:
                                                            <ul className="list-disc list-inside ml-6 text-sm">
                                                                <li>Agregar un bit &apos;1&apos; al final del mensaje</li>
                                                                <li>Agregar bits &apos;0&apos; hasta que la longitud sea congruente con 448 módulo 512</li>
                                                                <li>Agregar la longitud original del mensaje como un entero de 64 bits</li>
                                                            </ul>
                                                        </li>
                                                        <li className="mt-2">Inicializar los valores de hash con constantes predefinidas (H0...H7)</li>
                                                        <li>Para cada bloque de 512 bits:
                                                            <ul className="list-disc list-inside ml-6 text-sm">
                                                                <li>Crear un programa de mensajes de 64 entradas de 32 bits</li>
                                                                <li>Las primeras 16 entradas se toman directamente del bloque actual</li>
                                                                <li>Las 48 entradas restantes se calculan mediante una fórmula de expansión</li>
                                                                <li>Inicializar variables de trabajo (a-h) con los valores de hash actuales</li>
                                                                <li>Realizar 64 rondas de compresión, actualizando las variables de trabajo</li>
                                                                <li>Sumar las variables de trabajo a los valores de hash actuales</li>
                                                            </ul>
                                                        </li>
                                                        <li className="mt-2">Concatenar los valores de hash finales (H0...H7) para producir el digest</li>
                                                    </ol>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Operaciones Fundamentales</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <p className="mb-3">
                                                        SHA-2 utiliza una serie de funciones y operaciones para su cálculo:
                                                    </p>
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Operación</th>
                                                                    <th>Descripción</th>
                                                                    <th>Notación (para SHA-256)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Rotación Derecha</td>
                                                                    <td>Rotar bits hacia la derecha</td>
                                                                    <td><code>ROTR^n(x) = (x &gt;&gt;&gt; n) | (x &lt;&lt; (32-n))</code></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Desplazamiento Derecho</td>
                                                                    <td>Desplazar bits hacia la derecha</td>
                                                                    <td><code>SHR^n(x) = x &gt;&gt;&gt; n</code></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Función Ch</td>
                                                                    <td>Función de elección (choose)</td>
                                                                    <td><code>Ch(x,y,z) = (x & y) ^ (~x & z)</code></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Función Maj</td>
                                                                    <td>Función de mayoría</td>
                                                                    <td><code>Maj(x,y,z) = (x & y) ^ (x & z) ^ (y & z)</code></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Sigma Mayúscula 0</td>
                                                                    <td>Función de mezcla</td>
                                                                    <td><code>Σ0(x) = ROTR^2(x) ^ ROTR^13(x) ^ ROTR^22(x)</code></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Sigma Mayúscula 1</td>
                                                                    <td>Función de mezcla</td>
                                                                    <td><code>Σ1(x) = ROTR^6(x) ^ ROTR^11(x) ^ ROTR^25(x)</code></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Sigma Minúscula 0</td>
                                                                    <td>Función para expansión de mensaje</td>
                                                                    <td><code>σ0(x) = ROTR^7(x) ^ ROTR^18(x) ^ SHR^3(x)</code></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Sigma Minúscula 1</td>
                                                                    <td>Función para expansión de mensaje</td>
                                                                    <td><code>σ1(x) = ROTR^17(x) ^ ROTR^19(x) ^ SHR^10(x)</code></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiInfo className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">Mejoras sobre SHA-1</h3>
                                                        <div className="text-sm">
                                                            SHA-2 mejora significativamente la seguridad sobre SHA-1 mediante:
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>Mayor tamaño de salida (resistencia a colisiones)</li>
                                                                <li>Mayor número de rondas</li>
                                                                <li>Mejores funciones de mezcla no lineal</li>
                                                                <li>Expansión de mensaje más compleja</li>
                                                                <li>Constantes adicionales para prevenir ataques de canal lateral</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'applications' && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-4">Aplicaciones de SHA-2</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Seguridad Digital</h3>
                                                    <div className="card bg-base-100 shadow-md">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiLock className="mr-2 text-primary" />
                                                                Infraestructura de Clave Pública (PKI)
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">Certificados digitales:</span> Todos los certificados TLS/SSL modernos utilizan SHA-256 para firmas</li>
                                                                <li><span className="font-medium">Firmas de código:</span> Verificación de integridad en aplicaciones y actualizaciones</li>
                                                                <li><span className="font-medium">Autenticación de documentos:</span> Firmas digitales legalmente vinculantes</li>
                                                                <li><span className="font-medium">Timestamping:</span> Sellado de tiempo para verificación de existencia</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Autenticación y Verificación</h3>
                                                    <div className="card bg-base-100 shadow-md">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiUserCheck className="mr-2 text-secondary" />
                                                                Seguridad de Credenciales
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">Almacenamiento de contraseñas:</span> Combinado con funciones de derivación de claves como PBKDF2</li>
                                                                <li><span className="font-medium">Tokens de autenticación:</span> Generación de tokens JWT y similares</li>
                                                                <li><span className="font-medium">HMAC-SHA256:</span> Verificación de integridad con clave secreta</li>
                                                                <li><span className="font-medium">Autenticación de API:</span> Firmas de solicitudes en APIs seguras</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Tecnologías Blockchain</h3>
                                                    <div className="card bg-base-100 shadow-md">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiLink className="mr-2 text-accent" />
                                                                Criptomonedas y Smart Contracts
                                                            </h4>
                                                            <p className="mb-3">
                                                                SHA-256 es fundamental en varias tecnologías blockchain:
                                                            </p>
                                                            <ul className="list-disc list-inside">
                                                                <li><span className="font-medium">Bitcoin:</span> Utiliza SHA-256 en su algoritmo de prueba de trabajo</li>
                                                                <li><span className="font-medium">Direcciones de criptomonedas:</span> Derivación de direcciones a partir de claves públicas</li>
                                                                <li><span className="font-medium">Árboles de Merkle:</span> Verificación eficiente de transacciones</li>
                                                                <li><span className="font-medium">Smart contracts:</span> Verificación de datos y cálculo de identificadores</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold mb-3">Verificación de Integridad</h3>
                                                    <div className="card bg-base-100 shadow-md">
                                                        <div className="card-body">
                                                            <h4 className="card-title text-lg flex items-center">
                                                                <FiFileText className="mr-2 text-info" />
                                                                Integridad de Datos
                                                            </h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                <li><span className="font-medium">Descargas de software:</span> Verificación de integridad de paquetes</li>
                                                                <li><span className="font-medium">Archivos forenses:</span> Preservación de evidencia digital</li>
                                                                <li><span className="font-medium">Backups:</span> Validación de copias de seguridad</li>
                                                                <li><span className="font-medium">Sistemas de archivos:</span> ZFS y otros utilizan SHA-256 para detectar corrupción</li>
                                                                <li><span className="font-medium">Deduplicación:</span> Identificación de archivos duplicados en almacenamiento</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Consideraciones de Implementación</h3>
                                            <div className="card bg-base-100 shadow-md mb-6">
                                                <div className="card-body">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiCpu className="mr-2 text-primary" />
                                                                Optimización de Rendimiento
                                                            </h4>

                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>En CPUs de 64 bits, SHA-512 puede ser más rápido que SHA-256</li>
                                                                <li>Muchos procesadores modernos tienen instrucciones específicas para SHA-256</li>
                                                                <li>La implementación en hardware puede ser órdenes de magnitud más rápida</li>
                                                            </ul>

                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiShield className="mr-2 text-secondary" />
                                                                Consideraciones de Seguridad
                                                            </h4>

                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>SHA-256 es suficiente para la mayoría de aplicaciones</li>
                                                                <li>Para seguridad a largo plazo (10+ años), considerar SHA-512</li>
                                                                <li>Para contraseñas, siempre combinar con sal y una función de derivación</li>
                                                            </ul>

                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold flex items-center">
                                                                <FiCode className="mr-2 text-accent" />
                                                                Estándares y Conformidad
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm">
                                                                <li>FIPS 180-4 define formalmente SHA-2</li>
                                                                <li>NIST SP 800-57 recomienda SHA-256 o superior</li>
                                                                <li>PCI DSS requiere SHA-2 para el sector financiero</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3">Selección de Variantes</h3>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Variante</th>
                                                            <th>Tamaño de Salida</th>
                                                            <th>Usos Recomendados</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>SHA-224</td>
                                                            <td>224 bits</td>
                                                            <td>Aplicaciones con restricciones de espacio que requieren más seguridad que SHA-1</td>
                                                        </tr>
                                                        <tr>
                                                            <td>SHA-256</td>
                                                            <td>256 bits</td>
                                                            <td>Estándar de facto para la mayoría de aplicaciones modernas</td>
                                                        </tr>
                                                        <tr>
                                                            <td>SHA-384</td>
                                                            <td>384 bits</td>
                                                            <td>Mayor seguridad para datos sensibles, común en TLS de alta seguridad</td>
                                                        </tr>
                                                        <tr>
                                                            <td>SHA-512</td>
                                                            <td>512 bits</td>
                                                            <td>Máxima seguridad para datos críticos y aplicaciones de larga duración</td>
                                                        </tr>
                                                        <tr>
                                                            <td>SHA-512/256</td>
                                                            <td>256 bits</td>
                                                            <td>Rendimiento mejorado en procesadores de 64 bits con tamaño de salida reducido</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="alert alert-info shadow-lg">
                                                <div>
                                                    <FiHelpCircle className="w-6 h-6" />
                                                    <div>
                                                        <h3 className="font-bold">¿SHA-2 o SHA-3?</h3>
                                                        <div className="text-sm">
                                                            <p>Aunque SHA-3 es más reciente (estandarizado en 2015), SHA-2 sigue siendo ampliamente utilizado y considerado seguro.
                                                                Ambos son recomendados por NIST.</p>
                                                            <ul className="list-disc list-inside mt-1">
                                                                <li>SHA-2 tiene mayor adopción y soporte en hardware y software</li>
                                                                <li>SHA-3 utiliza una construcción esponja (Keccak) completamente diferente</li>
                                                                <li>SHA-3 fue diseñado como &apos;plan B&apos; en caso de que SHA-2 fuera comprometido</li>
                                                                <li>Para la mayoría de las aplicaciones actuales, SHA-256 sigue siendo una elección excelente</li>
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
                                            onClick={() => handleHashFunctionChange('sha1')}
                                        >
                                            <FiArrowRight className="mr-2 rotate-180" /> Anterior: SHA-1
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
                                    <button className="btn btn-outline" onClick={() => {
                                        setStage('learning');
                                        setActiveTab('info');
                                    }
                                    }>
                                        <FiArrowRight className="mr-2 rotate-180" /> Volver a la lección
                                    </button>
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
                                <h2 className="card-title text-2xl mb-6">Ejercicio Práctico: Verificación de Integridad con SHA-1</h2>

                                {practicalCompleted ? (
                                    <div className="alert alert-success mb-6">
                                        <FiCheckCircle className="w-6 h-6" />
                                        <span>¡Excelente trabajo! Tu implementación ha pasado todas las pruebas.</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6 space-y-4">
                                            <p>
                                                En este ejercicio implementarás un sistema de verificación de integridad utilizando SHA-1 en Python.
                                                Aunque SHA-1 se considera obsoleto para aplicaciones de seguridad modernas, es útil para
                                                comprender los conceptos fundamentales de las funciones hash.
                                            </p>

                                            <div className="alert alert-info">
                                                <div>
                                                    <h3 className="font-bold">Objetivo:</h3>
                                                    <p>Crear un sistema en Python que verifique la integridad de un mensaje mediante su hash SHA-1.</p>
                                                </div>
                                            </div>

                                            <div className="bg-base-300 p-4 rounded-lg">
                                                <h3 className="font-bold mb-2">Requisitos:</h3>
                                                <ol className="list-decimal list-inside space-y-2">
                                                    <li>Implementa una función <code className="bg-base-100 px-1 rounded">calcular_sha1(mensaje)</code> que calcule el hash SHA-1 de un mensaje dado y lo devuelva en formato hexadecimal.</li>
                                                    <li>Implementa una función <code className="bg-base-100 px-1 rounded">verificar_integridad(mensaje, hash_guardado)</code> que compruebe si el hash calculado del mensaje coincide con el hash guardado y devuelva True o False.</li>
                                                    <li>Utiliza la biblioteca <code className="bg-base-100 px-1 rounded">hashlib</code> de Python para calcular los hashes SHA-1.</li>
                                                    <li>Asegúrate de manejar correctamente los tipos de datos (strings y bytes).</li>
                                                </ol>
                                            </div>

                                            <div className="alert alert-warning">
                                                <div>
                                                    <h3 className="font-bold">Nota:</h3>
                                                    <p>Las pruebas automáticas verificarán que tu código funcione correctamente con los datos de prueba.
                                                        No modifiques los nombres de las funciones ni su comportamiento esperado.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2">Código inicial:</h3>
                                            <CodeEditor
                                                isModule={true}
                                                value={`import hashlib

# Implementa la función para calcular el hash SHA-1 de un mensaje
def calcular_sha1(mensaje):
    # Tu código aquí
    pass

# Implementa la función para verificar la integridad de un mensaje
def verificar_integridad(mensaje, hash_guardado):
    # Tu código aquí
    pass

# Ejemplos de uso (no modificar)
def prueba_sistema():
    mensaje1 = "Hola, este es un mensaje de prueba"
    mensaje2 = "Hola, este es un mensaje de prueba modificado"
    hash_original = "0e8ec52a4f2fd6676ff85ce8b972842b4951e4bd"
    
    print(f"Hash calculado para mensaje1: {calcular_sha1(mensaje1)}")
    print(f"¿Integridad del mensaje1 verificada?: {verificar_integridad(mensaje1, hash_original)}")
    print(f"¿Integridad del mensaje2 verificada?: {verificar_integridad(mensaje2, hash_original)}")

# No modifiques esta línea, se usa para las pruebas
if __name__ == "__main__":
    prueba_sistema()
`}

                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between mt-8">
                                    <div>
                                        <button className="btn btn-outline" onClick={() => setStage('quiz')}>
                                            <FiArrowRight className="mr-2 rotate-180" /> Volver al cuestionario
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-accent"
                                            onClick={runTests}
                                            disabled={practicalCompleted}
                                        >
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
                                    <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Funciones Hash Criptográficas</h2>
                                    <p className="text-lg mb-6">Has demostrado un excelente entendimiento de las funciones hash SHA-1 y SHA-2, así como sus aplicaciones prácticas en seguridad de la información.</p>

                                    <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                                                <FiHash className="h-5 w-5" />
                                                Especialista en Funciones Hash
                                            </div>
                                        </div>
                                        <p>Has demostrado conocimiento avanzado sobre las funciones hash criptográficas y habilidades para implementar soluciones de seguridad basadas en ellas.</p>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4">Conocimientos adquiridos</h3>
                                    <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 space-y-2">
                                        <li>Fundamentos de las funciones hash criptográficas</li>
                                        <li>Arquitectura y funcionamiento interno de SHA-1 y SHA-2</li>
                                        <li>Estado de seguridad actual y vulnerabilidades conocidas</li>
                                        <li>Aplicaciones prácticas en sistemas de seguridad</li>
                                        <li>Implementación de soluciones basadas en hash para problemas de seguridad comunes</li>
                                    </ul>

                                    <div className="alert alert-info shadow-lg mb-6 text-left">
                                        <div>
                                            <FiHelpCircle className="w-6 h-6" />
                                            <div>
                                                <h3 className="font-bold">Próximos pasos</h3>
                                                <p>Para ampliar tus conocimientos en criptografía, te recomendamos explorar el módulo &apos;Funciones Hash Avanzadas&apos; donde conocerás SHA-3, BLAKE2 y otras funciones modernas, o el módulo &apos;Firmas Digitales&apos; para profundizar en la aplicación de funciones hash en esquemas de firma y verificación.</p>
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
