"use client";
import { useState, useEffect} from 'react';
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
import { useSearchParams } from 'next/navigation';
import { getChallengeInfo, executeChallenge } from '../../../api/api';

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
    const params = useSearchParams();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [showHint, setShowHint] = useState(false);
    const [showDescription, setShowDescription] = useState(true);
    const [isSolved, setIsSolved] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [showCompletionScreen, setShowCompletionScreen] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('La respuesta no es correcta. Por favor, revisa tu código.');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const challengeId = params.get('id');

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallengeInfo(challengeId as string);
                if (response.success) {
                    setChallenge(response.data.data);
                    setCode(response.data.data.starterCode[language]);
                    setLoading(false);
                }
                else {
                    setLoading(false);
                    setChallenge(null);
                }
            } catch (error) {
                console.error('Error fetching challenge:', error);
                setLoading(false);
                setChallenge(null);
            }
        };

        fetchChallenge();
    }, []);

    useEffect(() => {
        let interval = null;
        if (challenge && !isSolved) {
            interval = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [challenge, isSolved]);


    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);

        if (challenge && challenge.starterCode[newLanguage]) {
            setCode(challenge.starterCode[newLanguage]);
        }
    };

    const handleSubmit = async () => {

        setIsSubmitting(true);
        try {
            if (!challengeId) {
                setShowError(true);
                setErrorMessage('No se encontró el ID del desafío.');
                setIsSubmitting(false);
                return;
            }

            const response = await executeChallenge(challengeId as string, code, language);
            console.log('Response:', response);
            if (response.success) {
                setIsSolved(true);
                setShowCompletionScreen(true);
            } else {
                setShowError(true);
                setErrorMessage(response.error?.data?.details?.output);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error executing challenge:', error);
            setShowError(true);
            setErrorMessage('Error al ejecutar el desafío. Por favor, revisa tu código.');
            setIsSubmitting(false);
        }
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
                                            Volver a los desafíos
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
                            onLanguageChange={handleLanguageChange}
                            initialCode={code}
                            initialLanguage={language}
                            onCodeChange={(code: string) => setCode(code)}
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