"use client";
import { useState, useEffect, use } from 'react';
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
            console.log('Challenge loaded:', exampleChallenge);
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

        fetchChallenge();
    }, []);

    useEffect(() => {
        setChallenge(exampleChallenge);
        setCode(exampleChallenge.starterCode[language] || '');
        setLoading(false);
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

const Chacha20 = {
    id: "chacha20-implementation",
    title: "Implementación de ChaCha20",
    description: "<p>El <strong>ChaCha20</strong> es un algoritmo de cifrado de flujo moderno diseñado por Daniel J. Bernstein en 2008. Es una evolución del algoritmo Salsa20 y se ha convertido en un estándar popular utilizado en TLS, SSH y otros protocolos de seguridad debido a su velocidad y seguridad.</p><p>A diferencia de los cifrados por bloques como AES, ChaCha20 es un cifrado de flujo que genera un flujo de bits pseudoaleatorio (keystream) que se combina con el texto plano mediante XOR para producir el texto cifrado.</p><p>En este desafío, implementarás una versión simplificada del algoritmo ChaCha20 que incluirá:</p><ul><li>La función quarterround, pieza fundamental del algoritmo</li><li>La generación del estado inicial usando clave, nonce y contador</li><li>La función principal de cifrado/descifrado</li></ul><p>Esta implementación te permitirá comprender los principios de los cifrados de flujo modernos y las operaciones ARX (Adición, Rotación, XOR) que son la base de muchos algoritmos criptográficos actuales.</p>",
    difficulty: "intermedio",
    category: "simetrica",
    completions: 289,
    totalAttempts: 876,
    points: 280,
    timeEstimate: "2 horas",
    status: "disponible",
    dateAdded: "2023-09-18",
    icon: "FiLock",
    examples: [
        {
            input: "Texto: 'Hola', Clave: '0123456789ABCDEF0123456789ABCDEF', Nonce: '0001020304050607', Contador: 1",
            output: "Texto cifrado (hex): '6e9972c3c9fb34fe'",
            explanation: "El algoritmo ChaCha20 genera un keystream basado en la clave, nonce y contador, que luego se combina con 'Hola' mediante XOR para producir el texto cifrado."
        },
        {
            input: "Texto cifrado (hex): '6e9972c3c9fb34fe', Clave: '0123456789ABCDEF0123456789ABCDEF', Nonce: '0001020304050607', Contador: 1",
            output: "Texto descifrado: 'Hola'",
            explanation: "El proceso de descifrado es idéntico al cifrado: se genera el mismo keystream y se aplica XOR con el texto cifrado para recuperar el texto original."
        }
    ],
    constraints: [
        "Debes implementar la función quarterround tal como se define en el RFC 8439.",
        "El estado ChaCha20 debe ser una matriz de 4x4 palabras de 32 bits.",
        "La clave debe ser de 256 bits (32 bytes), el nonce de 64 bits (8 bytes) y el contador de 32 bits.",
        "La implementación debe manejar correctamente la conversión entre bytes y palabras de 32 bits.",
        "No está permitido usar bibliotecas de criptografía que implementen directamente ChaCha20."
    ],
    hint: "La función quarterround aplica la operación ARX (Add, Rotate, XOR) a cuatro palabras de 32 bits. Se utiliza 20 veces (de ahí el nombre ChaCha20) en cada bloque. Recuerda que las operaciones son módulo 2^32 y que las rotaciones son circulares. Para probar tu implementación, puedes usar vectores de prueba disponibles en el RFC 8439.",
    expectedOutput: {
        encrypted: "8ad5a08fa32ced3c843965d125a7cef0fa5fa33c21c7b512",
        decrypted: "Criptografia simetrica moderna"
    },
    inputData: {
        text: "Criptografia simetrica moderna",
        key: "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
        nonce: "0001020304050607",
        counter: 1
    },
    starterCode: {
        python: `def uint32(val):
            """Asegura que un valor sea un entero de 32 bits sin signo (módulo 2^32)"""
    return val & 0xFFFFFFFF

def rotl32(v, c):
            """Rotación circular a la izquierda de un entero de 32 bits"""
    return uint32((v << c) | (v >> (32 - c)))

def quarterround(a, b, c, d):
            """
    Aplica la función quarterround de ChaCha20 a cuatro valores enteros de 32 bits.

            Args:
        a, b, c, d: Enteros de 32 bits
        
    Returns:
            Tupla con los cuatro valores después de aplicar quarterround
    """
    # Tu implementación aquí
    # Recuerda seguir la definición del RFC 8439:
    # a += b; d ^= a; d <<<= 16;
    # c += d; b ^= c; b <<<= 12;
    # a += b; d ^= a; d <<<= 8;
    # c += d; b ^= c; b <<<= 7;
return a, b, c, d

def chacha20_block(key, counter, nonce):
"""
    Genera un bloque de keystream ChaCha20.

    Args:
key: Bytes - Clave de 32 bytes(256 bits)
counter: Int - Contador de 32 bits
nonce: Bytes - Nonce de 8 bytes(64 bits)

Returns:
Bytes - Un bloque de 64 bytes de keystream
"""
    # Tu implementación aquí
    # 1. Inicializa el estado con las constantes, clave, contador y nonce
    # 2. Crea una copia del estado inicial
    # 3. Aplica las 20 rondas(10 rondas dobles) al estado
    # 4. Suma el estado resultante con el estado inicial(módulo 2 ^ 32)
    # 5. Convierte el resultado a bytes y devuélvelo
return bytes(64)  # Reemplaza con tu implementación

def chacha20_encrypt(texto, key, counter, nonce):
"""
    Cifra o descifra un texto usando ChaCha20.

    Args:
texto: String o Bytes - Texto a cifrar / descifrar
key: Bytes o String hex - Clave de 32 bytes(256 bits)
counter: Int - Contador inicial de 32 bits
nonce: Bytes o String hex - Nonce de 8 bytes(64 bits)

Returns:
Bytes - Texto cifrado / descifrado como bytes
"""
    # Tu implementación aquí
    # 1. Convierte los parámetros al formato adecuado si es necesario
    # 2. Genera bloques de keystream según sea necesario
    # 3. Aplica XOR entre el texto y el keystream
    # 4. Devuelve el resultado
return bytes(len(texto))  # Reemplaza con tu implementación

# NO MODIFICAR ESTA PARTE
def bytes_to_hex(b):
"""Convierte bytes a una cadena hexadecimal"""
return b.hex()

def hex_to_bytes(h):
"""Convierte una cadena hexadecimal a bytes"""
return bytes.fromhex(h)

# Prueba de cifrado y descifrado
texto_plano = "Criptografia simetrica moderna"
clave = hex_to_bytes("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f")
nonce = hex_to_bytes("0001020304050607")
contador = 1

# Cifrado
texto_bytes = texto_plano.encode('utf-8')
cifrado = chacha20_encrypt(texto_bytes, clave, contador, nonce)
print(f"Texto cifrado (hex): {bytes_to_hex(cifrado)}")

# Descifrado(mismo proceso que cifrado debido a la naturaleza XOR)
descifrado = chacha20_encrypt(cifrado, clave, contador, nonce)
print(f"Texto descifrado: {descifrado.decode('utf-8')}")`
    },
    javascript: `function uint32(val) {
    /**
     * Asegura que un valor sea un entero de 32 bits sin signo (módulo 2^32)
     */
    return val >>> 0;  // Operador >>> convierte a entero sin signo de 32 bits
}

function rotl32(v, c) {
    /**
     * Rotación circular a la izquierda de un entero de 32 bits
     */
    v = uint32(v);
    return uint32((v << c) | (v >>> (32 - c)));
}

function quarterround(a, b, c, d) {
    /**
     * Aplica la función quarterround de ChaCha20 a cuatro valores enteros de 32 bits.
     * 
     * @param {number} a - Entero de 32 bits
     * @param {number} b - Entero de 32 bits
     * @param {number} c - Entero de 32 bits
     * @param {number} d - Entero de 32 bits
     * @returns {Array} - Array con los cuatro valores después de aplicar quarterround
     */
    // Tu implementación aquí
    // Recuerda seguir la definición del RFC 8439:
    // a += b; d ^= a; d <<<= 16;
    // c += d; b ^= c; b <<<= 12;
    // a += b; d ^= a; d <<<= 8;
    // c += d; b ^= c; b <<<= 7;
    return [a, b, c, d];
}

function chacha20Block(key, counter, nonce) {
    /**
     * Genera un bloque de keystream ChaCha20.
     * 
     * @param {Uint8Array} key - Clave de 32 bytes (256 bits)
     * @param {number} counter - Contador de 32 bits
     * @param {Uint8Array} nonce - Nonce de 8 bytes (64 bits)
     * @returns {Uint8Array} - Un bloque de 64 bytes de keystream
     */
    // Tu implementación aquí
    // 1. Inicializa el estado con las constantes, clave, contador y nonce
    // 2. Crea una copia del estado inicial
    // 3. Aplica las 20 rondas (10 rondas dobles) al estado
    // 4. Suma el estado resultante con el estado inicial (módulo 2^32)
    // 5. Convierte el resultado a bytes y devuélvelo
    return new Uint8Array(64);  // Reemplaza con tu implementación
}

function chacha20Encrypt(texto, key, counter, nonce) {
    /**
     * Cifra o descifra un texto usando ChaCha20.
     * 
     * @param {Uint8Array|string} texto - Texto a cifrar/descifrar
     * @param {Uint8Array|string} key - Clave de 32 bytes (256 bits)
     * @param {number} counter - Contador inicial de 32 bits
     * @param {Uint8Array|string} nonce - Nonce de 8 bytes (64 bits)
     * @returns {Uint8Array} - Texto cifrado/descifrado como bytes
     */
    // Tu implementación aquí
    // 1. Convierte los parámetros al formato adecuado si es necesario
    // 2. Genera bloques de keystream según sea necesario
    // 3. Aplica XOR entre el texto y el keystream
    // 4. Devuelve el resultado
    
    // Asegúrate de que 'texto' sea Uint8Array
    if (typeof texto === 'string') {
        texto = new TextEncoder().encode(texto);
    }
    
    return new Uint8Array(texto.length);  // Reemplaza con tu implementación
}

// NO MODIFICAR ESTA PARTE
function bytesToHex(bytes) {
    /**
     * Convierte Uint8Array a una cadena hexadecimal
     */
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBytes(hex) {
    /**
     * Convierte una cadena hexadecimal a Uint8Array
     */
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i/2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

// Prueba de cifrado y descifrado
const textoPlano = "Criptografia simetrica moderna";
const clave = hexToBytes("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f");
const nonce = hexToBytes("0001020304050607");
const contador = 1;

// Cifrado
const textoBytes = new TextEncoder().encode(textoPlano);
const cifrado = chacha20Encrypt(textoBytes, clave, contador, nonce);
console.log("Texto cifrado (hex): " + bytesToHex(cifrado));

// Descifrado (mismo proceso que cifrado debido a la naturaleza XOR)
const descifrado = chacha20Encrypt(cifrado, clave, contador, nonce);
console.log("Texto descifrado: " + new TextDecoder().decode(descifrado));`
}


const hash = {
    id: "sha256-implementation",
    title: "Implementación de SHA-256",
    description: "<p>Las <strong>funciones hash criptográficas</strong> son componentes fundamentales en la seguridad informática. Transforman datos de entrada de cualquier tamaño en una huella digital de tamaño fijo, siendo prácticamente imposible encontrar dos entradas diferentes que produzcan la misma salida.</p><p>El algoritmo SHA-256 (Secure Hash Algorithm 256-bit) es una de las funciones hash más utilizadas actualmente en aplicaciones como firma digital, blockchain, almacenamiento seguro de contraseñas y verificación de integridad.</p><p>En este desafío, implementarás una versión de SHA-256 desde cero, lo que te permitirá:</p><ul><li>Comprender el funcionamiento interno de los algoritmos hash modernos</li><li>Familiarizarte con las operaciones bit a bit utilizadas en criptografía</li><li>Aplicar principios de difusión y confusión de Shannon</li></ul><p>Al finalizar, tendrás una comprensión más profunda de cómo las funciones hash proporcionan propiedades de seguridad como resistencia a colisiones y preimágenes.</p>",
    difficulty: "intermedio",
    category: "hash",
    completions: 243,
    totalAttempts: 615,
    points: 300,
    timeEstimate: "2.5 horas",
    status: "disponible",
    dateAdded: "2023-11-30",
    icon: "FiHash",
    examples: [
        {
            input: "Entrada: 'abc'",
            output: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
            explanation: "SHA-256 procesa la entrada 'abc' y produce este valor hash de 256 bits (representado como 64 caracteres hexadecimales)."
        },
        {
            input: "Entrada: '' (cadena vacía)",
            output: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            explanation: "El hash SHA-256 de una cadena vacía es un ejemplo importante de valor inicial en muchas aplicaciones."
        }
    ],
    constraints: [
        "Debes implementar SHA-256 siguiendo la especificación del NIST FIPS 180-4.",
        "No puedes usar bibliotecas que implementen directamente el algoritmo SHA-256.",
        "Tu implementación debe manejar correctamente entradas de cualquier longitud.",
        "El resultado debe ser presentado como una cadena hexadecimal de 64 caracteres."
    ],
    hint: "El algoritmo SHA-256 se puede dividir en varias etapas: preparación del mensaje (padding), división en bloques de 512 bits, inicialización de valores de hash, procesamiento de bloques con funciones de compresión, y producción del digest final. Las operaciones bit a bit clave son rotaciones, shifts, XOR, AND y OR. Es útil implementar primero las funciones auxiliares (Ch, Maj, Σ0, Σ1, σ0, σ1) y luego construir sobre ellas.",
    expectedOutput: "593e91dab71b51969f3c6ea95bcac3ffc3b1aca9d91c966b0761a1c68be7f87f",
    inputData: "Fundamentos de criptografia aplicada",
    starterCode: {
        python: `def rotr(x, n, size=32):
    """Rotación circular a la derecha de x por n bits, asumiendo que x tiene 'size' bits."""
    return ((x >> n) | (x << (size - n))) & ((1 << size) - 1)

def sha256(message):
    """
    Implementa el algoritmo SHA-256 desde cero.
    
    Args:
        message (str): El mensaje a hashear
        
    Returns:
        str: El hash SHA-256 como string hexadecimal de 64 caracteres
    """
    # Constantes de SHA-256 (primeros 32 bits de las partes fraccionarias de las raíces cúbicas de los primeros 64 números primos)
    K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]
    
    # Valores iniciales de hash (primeros 32 bits de las partes fraccionarias de las raíces cuadradas de los primeros 8 primos)
    h0 = 0x6a09e667
    h1 = 0xbb67ae85
    h2 = 0x3c6ef372
    h3 = 0xa54ff53a
    h4 = 0x510e527f
    h5 = 0x9b05688c
    h6 = 0x1f83d9ab
    h7 = 0x5be0cd19
    
    # Tu implementación aquí
    # 1. Preprocesamiento del mensaje (padding)
    # 2. Dividir el mensaje en bloques de 512 bits
    # 3. Inicializar los valores del hash
    # 4. Procesar cada bloque
    # 5. Producir el hash final
    
    # Funciones auxiliares que puedes implementar:
    # def ch(x, y, z): return (x & y) ^ (~x & z)
    # def maj(x, y, z): return (x & y) ^ (x & z) ^ (y & z)
    # def sigma0(x): return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22)
    # def sigma1(x): return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25)
    # def gamma0(x): return rotr(x, 7) ^ rotr(x, 18) ^ (x >> 3)
    # def gamma1(x): return rotr(x, 17) ^ rotr(x, 19) ^ (x >> 10)
    
    # Resultado final como string hexadecimal
    return "resultado_del_hash_en_hexadecimal"

# NO MODIFICAR ESTA PARTE
mensaje = "Fundamentos de criptografia aplicada"
print(sha256(mensaje))`,
        javascript: `function rotr(x, n, size = 32) {
    /**
     * Rotación circular a la derecha de x por n bits, asumiendo que x tiene 'size' bits.
     */
    return ((x >>> n) | (x << (size - n))) & ((1 << size) - 1);
}

function sha256(message) {
    /**
     * Implementa el algoritmo SHA-256 desde cero.
     * 
     * @param {string} message - El mensaje a hashear
     * @return {string} El hash SHA-256 como string hexadecimal de 64 caracteres
     */
    // Constantes de SHA-256 (primeros 32 bits de las partes fraccionarias de las raíces cúbicas de los primeros 64 números primos)
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    
    // Valores iniciales de hash (primeros 32 bits de las partes fraccionarias de las raíces cuadradas de los primeros 8 primos)
    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;
    
    // Tu implementación aquí
    // 1. Preprocesamiento del mensaje (padding)
    // 2. Dividir el mensaje en bloques de 512 bits
    // 3. Inicializar los valores del hash
    // 4. Procesar cada bloque
    // 5. Producir el hash final
    
    // Funciones auxiliares que puedes implementar:
    // function ch(x, y, z) { return (x & y) ^ (~x & z); }
    // function maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); }
    // function sigma0(x) { return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22); }
    // function sigma1(x) { return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25); }
    // function gamma0(x) { return rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3); }
    // function gamma1(x) { return rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10); }
    
    // Resultado final como string hexadecimal
    return "resultado_del_hash_en_hexadecimal";
}

// NO MODIFICAR ESTA PARTE
const mensaje = "Fundamentos de criptografia aplicada";
console.log(sha256(mensaje));`
    }
}
