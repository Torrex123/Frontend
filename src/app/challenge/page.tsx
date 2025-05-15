"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
    BeakerIcon,
    LightBulbIcon,
    XCircleIcon
} from '@heroicons/react/24/solid';
import { FiAward } from 'react-icons/fi';
import Toast from '../components/Notification';

export default function ChallengePage() {
    const searchParams = useSearchParams();
    const challengeId = 'caesar-cipher'

    const [challenge, setChallenge] = useState<any>(null);
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

    // Load the specific challenge based on the ID of the URL
    useEffect(() => {
        if (challengeId) {
            const selectedChallenge = challengesData.find(c => c.id === challengeId);
            if (selectedChallenge) {
                setChallenge(selectedChallenge);
                setCode(selectedChallenge.starterCode[language as keyof typeof selectedChallenge.starterCode] || '');
            }
        }
        setLoading(false);
    }, [challengeId]);

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

    // Check solution when sending the code
    useEffect(() => {
        if (isSubmitted && challenge) {
            // Check if the output contains the expected solution
            const normalizedOutput = output.trim().toLowerCase();
            const normalizedExpected = challenge.expectedOutput.trim().toLowerCase();

            if (normalizedOutput.includes(normalizedExpected)) {
                setIsSolved(true);
                if (timerInterval) clearInterval(timerInterval);
                setOutputType('success');
                setShowError(false);


                setTimeout(() => {
                    setShowCompletionScreen(true);
                }, 1500);
            } else {
                setOutputType('error');
                setShowError(true);
            }

            setIsSubmitted(false);
        }
    }, [isSubmitted, output, challenge]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };

    const handleOutputChange = (newOutput: string, newOutputType: string) => {
        setOutput(newOutput);
        setOutputType(newOutputType);
    };

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);

        // Update the code with the starter code of the selected language
        if (challenge && challenge.starterCode[newLanguage]) {
            setCode(challenge.starterCode[newLanguage]);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const handleReturnToDashboard = () => {
        window.location.href = '/challenges';
    };

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
                                        Has dominado este reto de programación y demostrado tus habilidades técnicas.
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
                            <div className={`badge ${challenge.difficulty === 'Easy' ? 'badge-success' :
                                challenge.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'
                                }`}>
                                {challenge.difficulty}
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
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={isSolved}
                        >
                            {isSolved ? 'Resuelto' : 'Verificar solución'}
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
                                                {challenge.examples.map((example: any, index: number) => (
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
                                                    {challenge.constraints.map((constraint: string, index: number) => (
                                                        <li key={index} className="mb-1">{constraint}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Track for the challenge */}
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
                    </div>

                    {/* Code editor panel */}
                    <div className="col-span-1 lg:col-span-2">
                        {/* Code editor */}
                        <CodeEditor
                            onCodeChange={handleCodeChange}
                            onOutputChange={handleOutputChange}
                            onLanguageChange={handleLanguageChange}
                            initialCode={challenge.starterCode[language] || ''}
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
                    message="La respuesta no es correcta. Por favor, revisa tu código."
                />
            </main>
        </div>
    );
}

// /data/challengesData.ts

const challengesData = [
    {
        id: "caesar-cipher",
        title: "Caesar Cipher Breaker",
        difficulty: "Easy",
        category: "Classical Ciphers",
        points: 500,
        description: `
      <p>El cifrado César es una de las técnicas de cifrado más simples y conocidas. Es un tipo de cifrado por sustitución en el que cada letra del texto plano es reemplazada por otra letra que se encuentra un número fijo de posiciones más adelante en el alfabeto.</p>
      
      <p>Por ejemplo, con un desplazamiento de 3 posiciones:</p>
      <ul>
        <li>La letra 'A' se cifra como 'D'</li>
        <li>La letra 'B' se cifra como 'E'</li>
        <li>La letra 'Z' se cifra como 'C'</li>
      </ul>
      
      <p>En este desafío, debes implementar una función que descifre un mensaje cifrado con César, probando todos los posibles desplazamientos (1-25) y devolviendo el texto original más probable.</p>
      
      <p>Para simplificar, asumiremos que el mensaje está en inglés y que el texto descifrado contendrá palabras comunes en inglés como "THE", "AND", "THAT", etc.</p>
    `,
        examples: [
            {
                input: "KHOOR ZRUOG",
                output: "HELLO WORLD",
                explanation: "El mensaje está cifrado con un desplazamiento de 3 letras."
            },
            {
                input: "YMFY NX HTWWJHY",
                output: "THAT IS CORRECT",
                explanation: "El mensaje está cifrado con un desplazamiento de 5 letras."
            }
        ],
        constraints: [
            "El mensaje sólo contiene letras mayúsculas (A-Z) y espacios.",
            "La longitud del mensaje está entre 1 y 1000 caracteres."
        ],
        hint: "Puedes probar todos los 25 posibles desplazamientos y utilizar alguna heurística (como contar la frecuencia de letras comunes en inglés) para determinar cuál es la solución más probable.",
        starterCode: {
            python: `def break_caesar(encrypted_message):
    """
    Implementa la función para romper el cifrado César.
    Args:
        encrypted_message (str): El mensaje cifrado con César
    Returns:
        str: El mensaje descifrado más probable
    """
    # Tu código aquí
    pass

# Ejemplo de uso
encrypted = "KHOOR ZRUOG"
decrypted = break_caesar(encrypted)
print(f"Mensaje cifrado: {encrypted}")
print(f"Mensaje descifrado: {decrypted}")`
        },
        expectedOutput: "HELLO WORLD"
    },
    {
        id: "vigenere-cipher",
        title: "Vigenère Cipher Decryptor",
        difficulty: "Medium",
        category: "Classical Ciphers",
        description: `
      <p>El cifrado Vigenère es un método de cifrado que utiliza una serie de diferentes cifrados César basados en las letras de una palabra clave. Es un cifrado por sustitución polialfabética simple.</p>
      
      <p>En este desafío, debes implementar una función que descifre un mensaje cifrado con Vigenère, conociendo la clave utilizada para cifrarlo.</p>
      
      <p>El cifrado Vigenère funciona de la siguiente manera:</p>
      <ol>
        <li>Se elige una palabra clave (por ejemplo, "KEY")</li>
        <li>Para cifrar, se repite la clave hasta que tenga la longitud del mensaje</li>
        <li>Cada letra del mensaje se desplaza según el valor numérico de la letra correspondiente de la clave (A=0, B=1, ..., Z=25)</li>
      </ol>
      
      <p>Por ejemplo, para cifrar "HELLO" con la clave "KEY":</p>
      <pre>Mensaje:  H E L L O
Clave:    K E Y K E
Valor num: 10 4 24 10 4
Cifrado:  R I J V S</pre>
      
      <p>Tu tarea es implementar la función de descifrado, que realiza el proceso inverso.</p>
    `,
        examples: [
            {
                input: "Mensaje cifrado: 'RIJVS', Clave: 'KEY'",
                output: "HELLO",
                explanation: "Para descifrar, restamos el valor numérico de cada letra de la clave de la letra correspondiente del mensaje cifrado."
            }
        ],
        constraints: [
            "El mensaje sólo contiene letras mayúsculas (A-Z) y espacios.",
            "La clave sólo contiene letras mayúsculas (A-Z).",
            "Los espacios en el mensaje no están cifrados."
        ],
        hint: "Para descifrar, necesitas restar el valor de la letra de la clave del valor de la letra cifrada, y asegurarte de manejar correctamente el wrap-around del alfabeto.",
        starterCode: {
            python: `def decrypt_vigenere(encrypted_message, key):
    """
    Implementa la función para descifrar un mensaje cifrado con Vigenère.
    Args:
        encrypted_message (str): El mensaje cifrado
        key (str): La clave utilizada para cifrar el mensaje
    Returns:
        str: El mensaje descifrado
    """
    # Tu código aquí
    pass

# Ejemplo de uso
encrypted = "RIJVS"
key = "KEY"
decrypted = decrypt_vigenere(encrypted, key)
print(f"Mensaje cifrado: {encrypted}")
print(f"Clave: {key}")
print(f"Mensaje descifrado: {decrypted}")`
        },
        expectedOutput: "HELLO"
    }
    // Agrega más desafíos aquí
];