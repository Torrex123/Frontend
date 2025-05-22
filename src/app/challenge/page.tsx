"use client";
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeftIcon,
    LockClosedIcon,
    CheckCircleIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    InformationCircleIcon,
    LightBulbIcon,
} from '@heroicons/react/24/solid';
import { FiAward } from 'react-icons/fi';
import Toast from '../components/Notification';
import { useParams } from 'next/navigation';

interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    points: number;
    timeEstimate: string;
    hint: string;
    examples: Array<{
        input: string;
        output: string;
        explanation?: string;
    }>;
    constraints: string[];
    expectedOutput: string;
    inputData: string;
    starterCode: {
        [key: string]: string;
    };
    completions: number;
    totalAttempts: number;
}

export default function ChallengePage() {
    const params = useParams();
    const challengeId = params?.id as string || 'caesar-cipher';

    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [outputType, setOutputType] = useState('info');
    const [language, setLanguage] = useState('python');
    const [showHint, setShowHint] = useState(false);
    const [showDescription, setShowDescription] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [showCompletionScreen, setShowCompletionScreen] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('La respuesta no es correcta. Por favor, revisa tu código.');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load the specific challenge based on the ID from the backend
    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                setLoading(true);
                // Fetch challenge data from your API
                const response = await fetch(`/api/challenges/${challengeId}`);

                if (!response.ok) {
                    throw new Error('Challenge not found');
                }

                const data = await response.json();
                setChallenge(data);
                setCode(data.starterCode[language] || '');
                setLoading(false);
            } catch (error) {
                console.error('Error loading challenge:', error);
                setLoading(false);
            }
        };

        if (challengeId) {
            fetchChallenge();
        }
        // setChallenge(exampleChallenge);
        // setCode(exampleChallenge.starterCode[language] || '');
    }, [challengeId]);

    useEffect(() => {
        setChallenge(vigenere);
    } , []);

    // Start/stop timer
    useEffect(() => {
        if (challenge && !isSolved) {
            const interval = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);
            setTimerInterval(interval);
        }

        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [challenge, isSolved]);

    // Handle code change
    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };

    // Handle output change from the code editor
    const handleOutputChange = (newOutput: string, newOutputType: string) => {
        setOutput(newOutput);
        setOutputType(newOutputType);
    };

    // Handle language selection change
    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);

        // Update the code with the starter code of the selected language
        if (challenge && challenge.starterCode[newLanguage]) {
            setCode(challenge.starterCode[newLanguage]);
        }
    };

    // Submit solution to backend for verification
    const handleSubmit = async () => {
        if (!challenge || isSolved || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Send the solution to the backend
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    challengeId: challenge.id,
                    code: code,
                    language: language,
                    timeSpent: timeSpent
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // If the solution is correct
                if (data.correct) {
                    setIsSolved(true);
                    setOutputType('success');
                    setOutput(data.output || 'Tu solución es correcta!');
                    setShowError(false);

                    // Stop the timer
                    if (timerInterval) clearInterval(timerInterval);

                    // Show completion screen after a delay
                    setTimeout(() => {
                        setShowCompletionScreen(true);
                    }, 1500);
                } else {
                    // If the solution is incorrect
                    setOutputType('error');
                    setOutput(data.output || 'Tu solución no es correcta');
                    setShowError(true);
                    setErrorMessage(data.message || 'La respuesta no es correcta. Por favor, revisa tu código.');
                }
            } else {
                // If there was a server error
                setOutputType('error');
                setOutput('Error al verificar la solución: ' + (data.message || 'Error del servidor'));
                setShowError(true);
                setErrorMessage('Error al verificar la solución. Por favor, intenta de nuevo más tarde.');
            }
        } catch (error) {
            console.error('Error submitting solution:', error);
            setOutputType('error');
            setOutput('Error al enviar la solución');
            setShowError(true);
            setErrorMessage('Error de conexión. Por favor, verifica tu conexión a internet.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle returning to dashboard
    const handleReturnToDashboard = () => {
        window.location.href = '/challenges';
    };

    // Format time in minutes and seconds
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] gap-4">
                    <InformationCircleIcon className="h-16 w-16 text-error" />
                    <h2 className="text-2xl font-bold">Desafío no encontrado</h2>
                    <p>El desafío que buscas no existe o ha sido removido.</p>
                    <Link href="/challenges" className="btn btn-primary">
                        Ver todos los desafíos
                    </Link>
                </div>
            </div>
        );
    }

    // Achievement screen when the challenge is completed
    if (showCompletionScreen) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            className="card bg-base-200 shadow-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="card-body text-center px-6 sm:px-12">
                                <div className="py-10">
                                    <motion.div
                                        className="text-9xl mb-6 text-success mx-auto"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: 360 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <FiAward className="mx-auto" />
                                    </motion.div>

                                    <h2 className="text-4xl font-extrabold mb-4 text-base-content">
                                        ¡Felicidades! Has completado el desafío <span className="text-primary">{challenge.title}</span>
                                    </h2>

                                    <p className="text-lg text-base-content/80 mb-8 max-w-2xl mx-auto">
                                        Has dominado este reto de criptografía y demostrado tus habilidades técnicas.
                                    </p>

                                    <div className="my-10 p-6 bg-base-200 rounded-xl shadow-lg max-w-lg mx-auto border border-base-300">
                                        <p className="text-lg">
                                            Has ganado{' '}
                                            <span className="font-bold text-primary">
                                                {challenge.points || 100} puntos
                                            </span>{' '}
                                            por completar este desafío en <span className="font-semibold">{formatTime(timeSpent)}</span>.
                                        </p>
                                    </div>

                                    <div className="mt-10">
                                        <button className="btn btn-primary btn-lg px-8 py-3 text-lg" onClick={handleReturnToDashboard}>
                                            Volver al Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header with navigation and title */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center gap-2">
                        <Link href="/challenges" className="btn btn-circle btn-outline btn-sm">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                            {challenge.title}
                            <div className={`badge ${challenge.difficulty === 'principiante' ? 'badge-success' :
                                challenge.difficulty === 'intermedio' ? 'badge-warning' : 'badge-error'
                                }`}>
                                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                            </div>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-base-200 px-3 py-1 rounded-lg">
                            <ClockIcon className="h-5 w-5 text-primary" />
                            <span className="font-mono">{formatTime(timeSpent)}</span>
                        </div>

                        {isSolved && (
                            <div className="flex items-center gap-1 text-success bg-success/10 px-3 py-1 rounded-lg">
                                <CheckCircleIcon className="h-5 w-5" />
                                <span>Resuelto</span>
                            </div>
                        )}

                        <button
                            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                            onClick={handleSubmit}
                            disabled={isSolved || isSubmitting}
                        >
                            {isSolved ? 'Resuelto' : isSubmitting ? 'Verificando...' : 'Verificar solución'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Challenge description panel */}
                    <div className="col-span-1 flex flex-col gap-4">
                        {/* Challenge description */}
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="card-title flex items-center gap-2">
                                        <LockClosedIcon className="h-5 w-5 text-primary" />
                                        Descripción
                                    </h2>
                                    <button
                                        onClick={() => setShowDescription(!showDescription)}
                                        className="btn btn-sm btn-circle btn-ghost"
                                    >
                                        {showDescription ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                                    </button>
                                </div>

                                {showDescription && (
                                    <div className="mt-3">
                                        <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: challenge.description }} />

                                        {challenge.examples && challenge.examples.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="font-bold text-lg mb-2">Ejemplos:</h3>
                                                {challenge.examples.map((example, index) => (
                                                    <div key={index} className="mb-3 bg-base-300 p-3 rounded-lg">
                                                        <p className="mb-1"><strong>Input:</strong> <code>{example.input}</code></p>
                                                        <p className="mb-1"><strong>Output:</strong> <code>{example.output}</code></p>
                                                        {example.explanation && (
                                                            <p><strong>Explicación:</strong> {example.explanation}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {challenge.constraints && challenge.constraints.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="font-bold text-lg mb-2">Restricciones:</h3>
                                                <ul className="list-disc list-inside">
                                                    {challenge.constraints.map((constraint, index) => (
                                                        <li key={index} className="mb-1">{constraint}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hint for the challenge */}
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="card-title flex items-center gap-2">
                                        <LightBulbIcon className="h-5 w-5 text-primary" />
                                        Pista
                                    </h2>
                                    <button
                                        onClick={() => setShowHint(!showHint)}
                                        className="btn btn-sm btn-ghost"
                                    >
                                        {showHint ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>

                                {showHint && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-3 bg-base-300 p-3 rounded-lg"
                                    >
                                        <p>{challenge.hint}</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Challenge details */}
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body p-4">
                                <h2 className="card-title flex items-center gap-2 mb-4">
                                    <InformationCircleIcon className="h-5 w-5 text-primary" />
                                    Detalles del desafío
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Categoría:</span>
                                        <span className="badge">{challenge.category === 'clasica' ? 'Criptografía Clásica' : challenge.category}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Tiempo estimado:</span>
                                        <span>{challenge.timeEstimate}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Puntos:</span>
                                        <span className="font-semibold">{challenge.points}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Completados:</span>
                                        <span>{challenge.completions} de {challenge.totalAttempts} intentos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Code editor panel */}
                    <div className="col-span-1 lg:col-span-2">
                        {/* Code editor */}
                        <CodeEditor
                            onCodeChange={handleCodeChange}
                            onOutputChange={handleOutputChange}
                            onLanguageChange={handleLanguageChange}
                            initialCode={code}
                            initialLanguage={language}
                        />

                        {/* Button to advance to the achievement screen */}
                        {isSolved && !showCompletionScreen && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={() => setShowCompletionScreen(true)}
                                    className="btn btn-primary btn-lg"
                                >
                                    Continuar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Toast */}
                <Toast
                    show={showError}
                    setShow={setShowError}
                    type="error"
                    message={errorMessage}
                />
            </main>
        </div>
    );
}

const exampleChallenge = {
    id: "caesar-cipher",
    title: "Descifrando César",
    description: "<p>El <strong>cifrado César</strong> es una de las técnicas de cifrado más simples y conocidas. Es un tipo de cifrado por sustitución en el que cada letra del texto plano es reemplazada por otra letra que se encuentra un número fijo de posiciones más adelante en el alfabeto.</p><p>Por ejemplo, con un desplazamiento de 3, la A sería sustituida por la D, la B se convertiría en E, y así sucesivamente.</p><p>En este desafío, recibirás un mensaje cifrado con el cifrado César. Tu tarea es implementar un algoritmo que pruebe todos los posibles desplazamientos (del 1 al 25) y encuentre el mensaje original.</p><p>El mensaje original estará en español y debe tener sentido.</p>",
    difficulty: "principiante",
    category: "clasica",
    completions: 987,
    totalAttempts: 1456,
    points: 100,
    timeEstimate: "30 min",
    status: "disponible",
    dateAdded: "2023-06-10",
    icon: "FiKey",
    examples: [
        {
            input: "HZ JYPWAVNYHmph LZ MHZJPUHUAL",
            output: "LA CRIPTOGRAFía ES FASCINANTE",
            explanation: "El mensaje estaba cifrado con un desplazamiento de 7 letras."
        },
        {
            input: "CEVR GP IV",
            output: "HOLA MI PC",
            explanation: "El mensaje estaba cifrado con un desplazamiento de 5 letras."
        }
    ],
    constraints: [
        "El mensaje cifrado solo contendrá letras (mayúsculas y minúsculas), espacios y signos de puntuación.",
        "La solución debe probar todos los desplazamientos posibles (1-25).",
        "El mensaje descifrado debe estar en español y tener sentido."
    ],
    hint: "Para cada posible desplazamiento (1-25), descifra el mensaje y verifica si parece español válido. Puedes detectar palabras comunes como 'el', 'la', 'es', 'en', etc. para identificar el mensaje correcto.",
    expectedOutput: "la criptografía es fascinante",
    inputData: "HZ JYPWAVNYHmph LZ MHZJPUHUAL",
    starterCode: {
        python: `def descifrar_cesar(mensaje_cifrado):
    """
    Función que prueba todos los desplazamientos posibles (1-25) del cifrado César
    y retorna el mensaje descifrado que tenga más sentido en español.
    
    Args:
        mensaje_cifrado (str): El mensaje cifrado
    
    Returns:
        str: El mensaje descifrado
    """
    # Tu código aquí
    
    # Recuerda que debes probar todos los desplazamientos posibles
    # e identificar cuál produce un mensaje con sentido en español
    
    # Ejemplo de cómo probar un desplazamiento específico (desplazamiento = 3)
    # mensaje_descifrado = ""
    # for caracter in mensaje_cifrado:
    #     if caracter.isalpha():
    #         ascii_offset = 65 if caracter.isupper() else 97
    #         # Fórmula para descifrar: (c - k) % 26
    #         descifrado = chr((ord(caracter) - ascii_offset - 3) % 26 + ascii_offset)
    #         mensaje_descifrado += descifrado
    #     else:
    #         mensaje_descifrado += caracter
    
    # Puedes devolver el mensaje descifrado que consideres correcto
    return "mensaje descifrado"

# NO MODIFICAR ESTA PARTE
mensaje_cifrado = "HZ JYPWAVNYHmph LZ MHZJPUHUAL"
print(descifrar_cesar(mensaje_cifrado))`,
        javascript: `function descifrarCesar(mensajeCifrado) {
    /**
     * Función que prueba todos los desplazamientos posibles (1-25) del cifrado César
     * y retorna el mensaje descifrado que tenga más sentido en español.
     * 
     * @param {string} mensajeCifrado - El mensaje cifrado
     * @return {string} El mensaje descifrado
     */
    // Tu código aquí
    
    // Recuerda que debes probar todos los desplazamientos posibles
    // e identificar cuál produce un mensaje con sentido en español
    
    // Ejemplo de cómo probar un desplazamiento específico (desplazamiento = 3)
    // let mensajeDescifrado = "";
    // for (let i = 0; i < mensajeCifrado.length; i++) {
    //     const caracter = mensajeCifrado[i];
    //     if (/[a-zA-Z]/.test(caracter)) {
    //         const esMayuscula = caracter === caracter.toUpperCase();
    //         const asciiOffset = esMayuscula ? 65 : 97;
    //         // Fórmula para descifrar: (c - k) % 26
    //         const codigoDescifrado = (caracter.charCodeAt(0) - asciiOffset - 3 + 26) % 26 + asciiOffset;
    //         mensajeDescifrado += String.fromCharCode(codigoDescifrado);
    //     } else {
    //         mensajeDescifrado += caracter;
    //     }
    // }
    
    // Puedes devolver el mensaje descifrado que consideres correcto
    return "mensaje descifrado";
}

// NO MODIFICAR ESTA PARTE
const mensajeCifrado = "HZ JYPWAVNYHmph LZ MHZJPUHUAL";
console.log(descifrarCesar(mensajeCifrado));`
    }
}

const vigenere = {
    id: "integrity-verification",
    title: "Verificación de Integridad",
    description: "<p>La <strong>verificación de integridad</strong> es un proceso fundamental en ciberseguridad que permite determinar si un archivo o mensaje ha sido modificado.</p><p>Las funciones hash criptográficas como MD5, SHA-1 o SHA-256 crean una 'huella digital' única para cada archivo. Si incluso un bit del archivo cambia, el hash resultante será completamente diferente.</p><p>En este desafío, implementarás un verificador de integridad que:</p><ul><li>Calcule el hash MD5 de un archivo de texto</li><li>Compare el hash calculado con un valor de referencia</li><li>Determine si el archivo ha sido modificado</li></ul><p>Esto es esencial para detectar alteraciones en archivos críticos, verificar descargas de software, y asegurar que los mensajes no han sido manipulados durante la transmisión.</p>",
    difficulty: "principiante",
    category: "hash",
    completions: 765,
    totalAttempts: 1234,
    points: 120,
    timeEstimate: "45 min",
    status: "disponible",
    dateAdded: "2023-07-05",
    icon: "FiFileText",
    examples: [
        {
            input: "archivo: 'mensaje.txt' (contenido: 'Hola mundo!'), hash_esperado: '86fb269d190d2c85f6e0468ceca42a20'",
            output: "INTEGRIDAD VERIFICADA - El hash coincide",
            explanation: "El hash MD5 de 'Hola mundo!' es '86fb269d190d2c85f6e0468ceca42a20', por lo que la verificación es exitosa."
        },
        {
            input: "archivo: 'datos.txt' (contenido: 'Información confidencial'), hash_esperado: 'd41d8cd98f00b204e9800998ecf8427e'",
            output: "INTEGRIDAD COMPROMETIDA - El hash no coincide",
            explanation: "El hash esperado corresponde a un archivo vacío, pero el archivo contiene texto, por lo que la verificación falla."
        }
    ],
    constraints: [
        "Debes usar el algoritmo MD5 para generar el hash (aunque en la práctica se recomienda SHA-256 o mejor).",
        "El programa debe manejar archivos de texto y calcular su hash.",
        "La salida debe indicar claramente si la integridad se mantiene o está comprometida.",
        "Debes implementar el cálculo del hash sin usar funciones específicas que realicen toda la tarea automáticamente."
    ],
    hint: "Puedes calcular el hash MD5 byte a byte, pero la mayoría de lenguajes tienen bibliotecas para hacerlo. En Python, puedes usar la biblioteca 'hashlib', y en JavaScript puedes usar el objeto 'crypto' del entorno Node.js. Recuerda que MD5 procesa el archivo como una secuencia de bytes, no como texto, así que presta atención a la codificación.",
    expectedOutput: "INTEGRIDAD VERIFICADA - El hash coincide",
    inputData: {
        fileContent: "Criptografía y seguridad informática son fundamentales para proteger datos sensibles.",
        expectedHash: "5d8eb6980fa9f835d62a1e691ada46d6"
    },
    starterCode: {
        python: `def verificar_integridad(contenido_archivo, hash_esperado):
    """
    Verifica la integridad de un archivo comparando su hash MD5 con un valor esperado.
    
    Args:
        contenido_archivo (str): El contenido del archivo a verificar
        hash_esperado (str): El hash MD5 esperado en formato hexadecimal
    
    Returns:
        str: Mensaje indicando si la integridad está verificada o comprometida
    """
    # Tu código aquí
    
    # 1. Calcula el hash MD5 del contenido del archivo
    # Pista: Puedes usar la biblioteca hashlib
    # import hashlib
    # md5_hash = hashlib.md5()
    # md5_hash.update(contenido_archivo.encode('utf-8'))
    # hash_calculado = md5_hash.hexdigest()
    
    # 2. Compara el hash calculado con el hash esperado
    
    # 3. Retorna el mensaje apropiado
    return "Resultado de la verificación"

# NO MODIFICAR ESTA PARTE
contenido = "Criptografía y seguridad informática son fundamentales para proteger datos sensibles."
hash_esperado = "5d8eb6980fa9f835d62a1e691ada46d6"
print(verificar_integridad(contenido, hash_esperado))`,
        javascript: `function verificarIntegridad(contenidoArchivo, hashEsperado) {
    /**
     * Verifica la integridad de un archivo comparando su hash MD5 con un valor esperado.
     * 
     * @param {string} contenidoArchivo - El contenido del archivo a verificar
     * @param {string} hashEsperado - El hash MD5 esperado en formato hexadecimal
     * @return {string} Mensaje indicando si la integridad está verificada o comprometida
     */
    // Tu código aquí
    
    // 1. Calcula el hash MD5 del contenido del archivo
    // Pista: En Node.js puedes usar el módulo crypto
    // const crypto = require('crypto');
    // const md5Hash = crypto.createHash('md5');
    // md5Hash.update(contenidoArchivo);
    // const hashCalculado = md5Hash.digest('hex');
    
    // 2. Compara el hash calculado con el hash esperado
    
    // 3. Retorna el mensaje apropiado
    return "Resultado de la verificación";
}

// NO MODIFICAR ESTA PARTE
const contenido = "Criptografía y seguridad informática son fundamentales para proteger datos sensibles.";
const hashEsperado = "5d8eb6980fa9f835d62a1e691ada46d6";
console.log(verificarIntegridad(contenido, hashEsperado));`
    }
}


