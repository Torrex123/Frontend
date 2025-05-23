"use client";
import { useState, useEffect} from 'react';
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
  FiUserCheck,
  FiAlertTriangle,
  FiCalendar,
  FiDatabase,
  FiHash
} from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { startSubModule, getSubModule, completeSubModule, completeModule } from '../../../api/api';

type SectionType = 'intro' | 'history' | 'concepts' | 'applications';
type ProgressStage = 'learning' | 'quiz' | 'completed';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

export default function FundamentalsCryptography() {
  const [currentSection, setCurrentSection] = useState<SectionType>('intro');
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<ProgressStage>('learning');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('content');
  const [questionsAnswered, setQuestionsAnswered] = useState<number[]>([]);
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "¿Cuál es el objetivo principal de la criptografía?",
      options: [
        "Ocultar la existencia de un mensaje",
        "Proteger la confidencialidad, integridad y autenticidad de la información",
        "Crear algoritmos complejos",
        "Romper códigos secretos"
      ],
      correctAnswer: "Proteger la confidencialidad, integridad y autenticidad de la información"
    },
    {
      id: 2,
      question: "¿Qué es la criptografía de clave simétrica?",
      options: [
        "Un sistema donde la clave de cifrado es diferente a la de descifrado",
        "Un sistema donde se usan múltiples claves para cifrar",
        "Un sistema donde se usa la misma clave para cifrar y descifrar",
        "Un sistema que no utiliza claves"
      ],
      correctAnswer: "Un sistema donde se usa la misma clave para cifrar y descifrar"
    },
    {
      id: 3,
      question: "¿Cuál es una de las principales ventajas de la criptografía asimétrica?",
      options: [
        "Es más rápida que la criptografía simétrica",
        "No requiere el intercambio seguro de claves secretas",
        "Utiliza menos recursos computacionales",
        "Es inmune a todos los ataques"
      ],
      correctAnswer: "No requiere el intercambio seguro de claves secretas"
    },
    {
      id: 4,
      question: "¿Qué es un hash criptográfico?",
      options: [
        "Un tipo de cifrado reversible",
        "Una función que transforma datos de cualquier tamaño en una cadena de bits de longitud fija",
        "Una clave secreta compartida",
        "Un algoritmo para generar números aleatorios"
      ],
      correctAnswer: "Una función que transforma datos de cualquier tamaño en una cadena de bits de longitud fija"
    },
    {
      id: 5,
      question: "¿Cuál de los siguientes NO es un principio básico de la seguridad de la información?",
      options: [
        "Confidencialidad",
        "Integridad",
        "Disponibilidad",
        "Complejidad"
      ],
      correctAnswer: "Complejidad"
    }
  ]);
  const params = useSearchParams();
  interface Submodule {
    id: string;
    title: string;
    status: string;
    place: number;
  }
  
  const [submoduleList, setSubmoduleList] = useState<Submodule[]>([]);

  useEffect(() => {
    let newProgress = 0;

    if (currentSection === 'intro') newProgress = 0;
    else if (currentSection === 'history') newProgress = 25;
    else if (currentSection === 'concepts') newProgress = 50;
    else if (currentSection === 'applications') newProgress = 75;
    // Adjust based on stage
    if (stage === 'quiz') newProgress = 90;
    else if (stage === 'completed') newProgress = 100;

    setProgress(newProgress);
  }, [currentSection, stage]);

  useEffect(() => {
    const moduleId = params.get('id');
    const fetchSubModule = async () => {
      try {
        const response = await getSubModule(moduleId as string);
        const submodules = response.data.data;
        setSubmoduleList(submodules);

        const validTitles: SectionType[] = ['intro', 'history', 'concepts', 'applications'];
        const sorted = [...submodules].sort((a, b) => a.place - b.place);

        let targetSubmodule = sorted.findLast((sub) => sub.status === 'en-progreso');
        if (!targetSubmodule) {
          targetSubmodule = sorted.find((sub) => sub.status === 'no-iniciado');
        }

        if (targetSubmodule && validTitles.includes(targetSubmodule.title)) {
          setCurrentSection(targetSubmodule.title as SectionType);
        } else {
          setCurrentSection('intro');
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

    const completed = async () => {
      try {
        const moduleId = params.get('id');
        await completeModule(moduleId as string);
      } catch (error) {
        throw new Error('Error completing module');
      }
    }

    if (allCorrect) {
      setStage('completed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      completed();
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        scalar: 1.2,
      });
    }
  };

  const handleResetQuiz = () => {
    const resetQuestions = questions.map(q => ({ ...q, userAnswer: undefined }));
    setQuestions(resetQuestions);
    setQuestionsAnswered([]);
    setQuizSubmitted(false);
  };

  const handleSectionChange = (section: SectionType) => {

    const previousSection = currentSection;

    setCurrentSection(section);
    setActiveTab('content');

    try {
      const previousSubmodule = submoduleList.find((s) => s.title === previousSection);
      if (previousSubmodule?.id) {
        completeSubModule(previousSubmodule.id);
      } else {
        console.warn('Previous submodule not found for section:', previousSection);
      }

      const currentSubmodule = submoduleList.find((s) => s.title === section);
      if (currentSubmodule?.id) {
        startSubModule(currentSubmodule.id);
      } else {
        console.warn('Current submodule not found for section:', section);
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

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Module Header */}
      <header className="bg-base-200 py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Fundamentos de la Criptografía</h1>

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
                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentSection === 'intro' ? 'border-primary bg-primary text-primary-content' : progress >= 20 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                  <FiBookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1">Introducción</span>
              </div>

              <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                  style={{ width: progress >= 20 ? '100%' : '0%' }}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentSection === 'history' ? 'border-primary bg-primary text-primary-content' : progress >= 40 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                  <FiCalendar className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1">Historia</span>
              </div>

              <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                  style={{ width: progress >= 40 ? '100%' : '0%' }}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentSection === 'concepts' ? 'border-primary bg-primary text-primary-content' : progress >= 60 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                  <FiKey className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1">Conceptos</span>
              </div>

              <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                  style={{ width: progress >= 60 ? '100%' : '0%' }}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentSection === 'applications' ? 'border-primary bg-primary text-primary-content' : progress >= 80 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                  <FiGlobe className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1">Aplicaciones</span>
              </div>

              <div className="flex-1 h-0.5 mx-2 bg-base-300 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                  style={{ width: progress >= 90 ? '100%' : '0%' }}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${stage === 'completed' ? 'border-success bg-success text-success-content' : stage === 'quiz' ? 'border-primary bg-primary text-primary-content' : 'border-base-300 bg-base-100'}`}>
                  <FiAward className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1">Completado</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Learning Stage - Display content based on current section */}
        {stage === 'learning' && (
          <div className="max-w-4xl mx-auto">
            {/* Section Navigation Tabs */}
            <div className="tabs tabs-boxed mb-6 justify-center">
              <button
                className={`tab ${currentSection === 'intro' ? 'tab-active' : ''}`}
                onClick={() => handleSectionChange('intro')}
              >
                Introducción
              </button>
              <button
                className={`tab ${currentSection === 'history' ? 'tab-active' : ''}`}
                onClick={() => handleSectionChange('history')}
              >
                Historia
              </button>
              <button
                className={`tab ${currentSection === 'concepts' ? 'tab-active' : ''}`}
                onClick={() => handleSectionChange('concepts')}
              >
                Conceptos Básicos
              </button>
              <button
                className={`tab ${currentSection === 'applications' ? 'tab-active' : ''}`}
                onClick={() => handleSectionChange('applications')}
              >
                Aplicaciones
              </button>
            </div>

            {/* Content Tabs for current section */}
            <div className="tabs mb-4">
              <button
                className={`tab tab-bordered ${activeTab === 'content' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                Contenido
              </button>
              <button
                className={`tab tab-bordered ${activeTab === 'summary' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Resumen
              </button>
            </div>

            {/* Introduction Section Content */}
            {currentSection === 'intro' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  {activeTab === 'content' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Introducción a la Criptografía</h2>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-2/3">
                          <p className="mb-4">
                            La criptografía es la ciencia y el arte de la comunicación segura en presencia de terceros. Su nombre proviene del griego <em>kryptós</em> (oculto) y <em>graphé</em> (grafo o escritura), literalmente "escritura oculta".
                          </p>
                          <p className="mb-4">
                            En su forma más básica, la criptografía busca proteger la información mediante su transformación a un formato ilegible para aquellos que no posean la clave o el conocimiento necesario para revertir dicha transformación.
                          </p>

                          <h3 className="text-xl font-bold mt-6 mb-2">Propósitos fundamentales</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="card bg-base-100 shadow-sm">
                              <div className="card-body p-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-primary/10 p-2 rounded-full">
                                    <FiLock className="w-5 h-5 text-primary" />
                                  </div>
                                  <h4 className="card-title text-base">Confidencialidad</h4>
                                </div>
                                <p className="text-sm mt-2">
                                  Garantizar que la información sólo sea accesible para las personas autorizadas.
                                </p>
                              </div>
                            </div>

                            <div className="card bg-base-100 shadow-sm">
                              <div className="card-body p-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-secondary/10 p-2 rounded-full">
                                    <FiCheck className="w-5 h-5 text-secondary" />
                                  </div>
                                  <h4 className="card-title text-base">Integridad</h4>
                                </div>
                                <p className="text-sm mt-2">
                                  Asegurar que la información no ha sido alterada durante su almacenamiento o transmisión.
                                </p>
                              </div>
                            </div>

                            <div className="card bg-base-100 shadow-sm">
                              <div className="card-body p-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-accent/10 p-2 rounded-full">
                                    <FiUserCheck className="w-5 h-5 text-accent" />
                                  </div>
                                  <h4 className="card-title text-base">Autenticación</h4>
                                </div>
                                <p className="text-sm mt-2">
                                  Verificar la identidad del remitente y confirmar que realmente es quien dice ser.
                                </p>
                              </div>
                            </div>

                            <div className="card bg-base-100 shadow-sm">
                              <div className="card-body p-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-info/10 p-2 rounded-full">
                                    <FiFileText className="w-5 h-5 text-info" />
                                  </div>
                                  <h4 className="card-title text-base">No repudio</h4>
                                </div>
                                <p className="text-sm mt-2">
                                  Impedir que el emisor pueda negar haber enviado el mensaje o realizado una acción.
                                </p>
                              </div>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold mt-6 mb-2">Diferencia entre Criptografía y Criptología</h3>
                          <p className="mb-4">
                            Aunque a menudo se usan indistintamente, conviene diferenciar estos términos:
                          </p>
                          <div className="overflow-x-auto">
                            <table className="table w-full">
                              <thead>
                                <tr>
                                  <th>Criptografía</th>
                                  <th>Criptología</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Se enfoca en el diseño de algoritmos para cifrar información</td>
                                  <td>Ciencia más amplia que engloba tanto la criptografía como el criptoanálisis</td>
                                </tr>
                                <tr>
                                  <td>Desarrolla métodos para proteger la información</td>
                                  <td>Incluye también el estudio de cómo romper esos métodos de protección</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="md:w-1/3">
                          <div className="card bg-base-100 shadow-lg mb-6">
                            <div className="card-body">
                              <h3 className="card-title flex items-center gap-2">
                                <FiHelpCircle className="text-primary" />
                                ¿Por qué es importante?
                              </h3>
                              <p className="mb-4">
                                En la era digital, la criptografía se ha vuelto esencial para:
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Proteger datos sensibles</li>
                                <li>Garantizar transacciones seguras</li>
                                <li>Preservar la privacidad</li>
                                <li>Asegurar comunicaciones</li>
                                <li>Verificar identidades digitales</li>
                              </ul>
                            </div>
                          </div>

                          <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                              <h3 className="card-title flex items-center gap-2">
                                <FiAlertTriangle className="text-warning" />
                                Conceptos erróneos comunes
                              </h3>
                              <div className="space-y-3 mt-2">
                                <div>
                                  <p className="font-bold">Mito: La criptografía hace que la información sea 100% segura.</p>
                                  <p className="text-sm">Realidad: Ningún sistema es completamente infalible. La seguridad depende de muchos factores, incluyendo la implementación correcta.</p>
                                </div>
                                <div>
                                  <p className="font-bold">Mito: Si el algoritmo es secreto, es más seguro.</p>
                                  <p className="text-sm">Realidad: Los mejores sistemas siguen el Principio de Kerckhoffs: la seguridad debe residir en la clave, no en el secreto del algoritmo.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  {activeTab === 'summary' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Resumen - Introducción a la Criptografía</h2>

                      <div className="alert bg-base-100 shadow-lg mb-6">
                        <div>
                          <FiCheckCircle className="text-success flex-shrink-0 w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">Puntos clave aprendidos</h3>
                            <div className="text-sm">
                              En esta sección has aprendido los conceptos fundamentales que definen la criptografía y su importancia en el mundo digital.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th>Concepto</th>
                              <th>Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="font-medium">Definición de criptografía</td>
                              <td>Ciencia y arte de la comunicación segura en presencia de terceros.</td>
                            </tr>
                            <tr>
                              <td className="font-medium">Objetivos principales</td>
                              <td>Confidencialidad, integridad, autenticación y no repudio.</td>
                            </tr>
                            <tr>
                              <td className="font-medium">Diferencia con criptología</td>
                              <td>La criptografía se centra en proteger información, mientras que la criptología incluye también el análisis para romper esa protección.</td>
                            </tr>
                            <tr>
                              <td className="font-medium">Principio de Kerckhoffs</td>
                              <td>La seguridad debe residir en la clave, no en el secreto del algoritmo.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="alert alert-info mt-6">
                        <div>
                          <FiArrowRight className="w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">Próximos temas</h3>
                            <div className="text-sm">
                              En la siguiente sección exploraremos la rica historia de la criptografía, desde sus orígenes en la antigüedad hasta las técnicas modernas.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card-actions justify-end mt-6">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSectionChange('history')}
                    >
                      Siguiente: Historia de la Criptografía <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* History Section Content */}
            {currentSection === 'history' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  {activeTab === 'content' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Historia de la Criptografía</h2>

                      <p className="mb-6">
                        La historia de la criptografía es tan antigua como la necesidad humana de comunicarse de forma segura. A lo largo de los siglos, ha evolucionado desde métodos simples de sustitución hasta complejos algoritmos matemáticos.
                      </p>

                      <div className="space-y-8">
                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-2">
                              <FiCalendar className="text-primary w-5 h-5" />
                            </div>
                            Antigüedad (1900 a.C. - 500 d.C.)
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Los primeros métodos criptográficos conocidos datan del Antiguo Egipto, donde los escribas utilizaban jeroglíficos no estándar para ocultar el significado de inscripciones.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Principales innovaciones:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Escítala espartana (siglo V a.C.):</span> Primer dispositivo criptográfico para transposición.</li>
                                <li><span className="font-medium">Cifrado César (siglo I a.C.):</span> Julio César utilizaba un cifrado de sustitución simple para sus comunicaciones militares.</li>
                                <li><span className="font-medium">Cifrado por sustitución monoalfabética:</span> Los romanos desarrollaron varios métodos basados en este principio.</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">¿Sabías que?</h4>
                                <p className="text-sm">
                                  El término "cifrado" proviene del árabe "sifr" (صفر), que significa "cero" o "vacío". Esta palabra también es el origen de "cero" y "cifra" en español.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-2">
                              <FiCalendar className="text-primary w-5 h-5" />
                            </div>
                            Edad Media y Renacimiento (500 - 1500)
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Durante este período, el mundo árabe lideró los avances en criptoanálisis, mientras que en Europa las técnicas criptográficas se desarrollaron principalmente en ámbitos diplomáticos.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Desarrollos clave:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Al-Kindi (siglo IX):</span> Desarrolló técnicas de análisis de frecuencia para descifrar mensajes.</li>
                                <li><span className="font-medium">Cifrados polialfabéticos:</span> Leon Battista Alberti (1467) inventó el primer cifrado polialfabético, utilizando múltiples alfabetos cifrantes.</li>
                                <li><span className="font-medium">Disco de Alberti:</span> Primer dispositivo mecánico de cifrado que utilizaba dos discos giratorios.</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">El criptoanálisis nace</h4>
                                <p className="text-sm">
                                  Al-Kindi escribió "Un manuscrito sobre el desciframiento de mensajes criptográficos", considerado el primer trabajo sobre el análisis de frecuencia para romper cifrados.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-2">
                              <FiCalendar className="text-primary w-5 h-5" />
                            </div>
                            Era Moderna Temprana (1500 - 1900)
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Este período vio una explosión de innovaciones criptográficas, especialmente en Europa, donde la diplomacia y las guerras impulsaron el desarrollo de métodos más seguros.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Avances destacados:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Cifrado Vigenère (1553):</span> Blaise de Vigenère popularizó un cifrado polialfabético que permaneció inviolable durante 300 años.</li>
                                <li><span className="font-medium">Nomencladores:</span> Combinación de códigos y cifrados utilizada ampliamente en comunicaciones diplomáticas.</li>
                                <li><span className="font-medium">Telégrafo y códigos comerciales:</span> Con la llegada del telégrafo, surgieron nuevos códigos para transmisiones eficientes.</li>
                                <li><span className="font-medium">Máquinas cifradoras tempranas:</span> A finales del siglo XIX aparecieron las primeras máquinas para cifrar mensajes automáticamente.</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Cifrado inviolable</h4>
                                <p className="text-sm">
                                  El cifrado Vigenère fue conocido como "le chiffre indéchiffrable" (el cifrado indescifrable) hasta que Friedrich Kasiski publicó un método para romperlo en 1863.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-2">
                              <FiCalendar className="text-primary w-5 h-5" />
                            </div>
                            Guerras Mundiales (1900 - 1945)
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Las dos Guerras Mundiales representaron un punto de inflexión en la criptografía. La necesidad de comunicaciones seguras durante los conflictos aceleró enormemente el desarrollo de esta disciplina.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Innovaciones críticas:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Máquina Enigma:</span> Utilizada por Alemania durante la Segunda Guerra Mundial, representó un gran avance en cifrado mecánico.</li>
                                <li><span className="font-medium">Proyecto Ultra:</span> El esfuerzo aliado para descifrar los mensajes de Enigma sentó las bases de la criptografía moderna.</li>
                                <li><span className="font-medium">SIGABA/M-134-C:</span> Máquina de cifrado estadounidense que nunca fue comprometida durante la guerra.</li>
                                <li><span className="font-medium">Cifrado de Vernam (One-time pad):</span> El único cifrado teóricamente irrompible, fue utilizado para comunicaciones de alta seguridad.</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Alan Turing y Bletchley Park</h4>
                                <p className="text-sm">
                                  Los criptógrafos de Bletchley Park, liderados por Alan Turing, desarrollaron la primera computadora electrónica programable, Colossus, para descifrar los códigos alemanes, acortando la guerra aproximadamente dos años.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-2">
                              <FiCalendar className="text-primary w-5 h-5" />
                            </div>
                            Era Moderna y Digital (1945 - Presente)
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Con la llegada de las computadoras, la criptografía experimentó una revolución que cambió su naturaleza, pasando de ser un arte a convertirse en una ciencia matemática rigurosa.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Hitos importantes:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">DES (1975):</span> Primer estándar de cifrado moderno ampliamente adoptado, desarrollado por IBM y la NSA.</li>
                                <li><span className="font-medium">Criptografía de clave pública (1976):</span> Whitfield Diffie y Martin Hellman proponen el concepto revolucionario de criptografía asimétrica.</li>
                                <li><span className="font-medium">RSA (1977):</span> Primer algoritmo de clave pública práctico, que sigue siendo ampliamente utilizado hoy en día.</li>
                                <li><span className="font-medium">AES (2001):</span> Estándar actual de cifrado simétrico, seleccionado mediante un concurso internacional.</li>
                                <li><span className="font-medium">Criptografía de curva elíptica:</span> Proporciona seguridad equivalente a RSA con claves más cortas.</li>
                                <li><span className="font-medium">Blockchain (2008):</span> La tecnología detrás de Bitcoin abre nuevas aplicaciones para conceptos criptográficos.</li>
                                <li><span className="font-medium">Criptografía post-cuántica:</span> Desarrollo de algoritmos resistentes a los ataques de computadoras cuánticas.</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg mb-4">
                                <h4 className="font-bold mb-2">La democratización de la criptografía</h4>
                                <p className="text-sm">
                                  Hasta la década de 1970, la criptografía fuerte era dominio exclusivo de gobiernos y militares. La publicación de algoritmos como DES y RSA permitió su uso civil y comercial, no sin controversia y resistencia gubernamental.
                                </p>
                              </div>
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Crypto Wars</h4>
                                <p className="text-sm">
                                  En los años 90, se libraron las "Guerras de la Criptografía" entre gobiernos que querían restringir la criptografía fuerte y los defensores de la privacidad que abogaban por su disponibilidad pública.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  {activeTab === 'summary' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Resumen - Historia de la Criptografía</h2>

                      <div className="alert bg-base-100 shadow-lg mb-6">
                        <div>
                          <FiCheckCircle className="text-success flex-shrink-0 w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">Puntos clave aprendidos</h3>
                            <div className="text-sm">
                              Esta sección te ha proporcionado una visión general de cómo ha evolucionado la criptografía a lo largo del tiempo, desde sus orígenes antiguos hasta la era digital moderna.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="timeline">
                        <div className="timeline-item">
                          <div className="timeline-item-tail"></div>
                          <div className="timeline-item-head bg-primary"></div>
                          <div className="timeline-item-content">
                            <div className="font-bold">Antigüedad (1900 a.C. - 500 d.C.)</div>
                            <p>Primeros métodos: jeroglíficos no estándar, escítala espartana, cifrado César</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-item-tail"></div>
                          <div className="timeline-item-head bg-primary"></div>
                          <div className="timeline-item-content">
                            <div className="font-bold">Edad Media y Renacimiento (500 - 1500)</div>
                            <p>Análisis de frecuencia por Al-Kindi, primeros cifrados polialfabéticos</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-item-tail"></div>
                          <div className="timeline-item-head bg-primary"></div>
                          <div className="timeline-item-content">
                            <div className="font-bold">Era Moderna Temprana (1500 - 1900)</div>
                            <p>Cifrado Vigenère, nomencladores, primeras máquinas cifradoras</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-item-tail"></div>
                          <div className="timeline-item-head bg-primary"></div>
                          <div className="timeline-item-content">
                            <div className="font-bold">Guerras Mundiales (1900 - 1945)</div>
                            <p>Enigma, Proyecto Ultra, nacimiento de la computación moderna</p>
                          </div>
                        </div>

                        <div className="timeline-item">
                          <div className="timeline-item-tail"></div>
                          <div className="timeline-item-head bg-primary"></div>
                          <div className="timeline-item-content">
                            <div className="font-bold">Era Digital (1945 - Presente)</div>
                            <p>DES, criptografía de clave pública (RSA), AES, blockchain, criptografía post-cuántica</p>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-info mt-6">
                        <div>
                          <FiArrowRight className="w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">¿Qué sigue?</h3>
                            <div className="text-sm">
                              En la próxima sección exploraremos los conceptos básicos de la criptografía moderna, incluyendo cifrados simétricos, asimétricos y funciones hash.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card-actions justify-between mt-6">
                    <button
                      className="btn btn-outline"
                      onClick={() => handleSectionChange('intro')}
                    >
                      <FiArrowRight className="mr-2 rotate-180" /> Anterior: Introducción
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSectionChange('concepts')}
                    >
                      Siguiente: Conceptos Básicos <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Concepts Section Content */}
            {currentSection === 'concepts' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  {activeTab === 'content' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Conceptos Básicos de Criptografía</h2>

                      <p className="mb-6">
                        La criptografía moderna se basa en principios matemáticos sólidos y se divide en varias categorías principales. En esta sección, exploraremos los conceptos fundamentales que conforman la base de los sistemas criptográficos actuales.
                      </p>

                      <div className="space-y-8">
                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-2">
                              <FiKey className="text-primary w-5 h-5" />
                            </div>
                            Criptografía Simétrica
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Los cifrados simétricos utilizan la misma clave para el cifrado y el descifrado. Son rápidos y eficientes, pero requieren que ambas partes compartan previamente la clave secreta de forma segura.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Características principales:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Utiliza la misma clave para cifrar y descifrar</li>
                                <li>Muy eficiente para grandes volúmenes de datos</li>
                                <li>Presenta el desafío de la distribución segura de claves</li>
                                <li>Típicamente las claves son de 128, 192 o 256 bits</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Tipos de cifrados simétricos:</h4>
                              <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                  <thead>
                                    <tr>
                                      <th>Tipo</th>
                                      <th>Descripción</th>
                                      <th>Ejemplos</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Cifrados de bloque</td>
                                      <td>Operan sobre bloques de datos de tamaño fijo</td>
                                      <td>AES, DES, 3DES, Blowfish</td>
                                    </tr>
                                    <tr>
                                      <td>Cifrados de flujo</td>
                                      <td>Operan bit a bit o byte a byte</td>
                                      <td>RC4, ChaCha20, A5/1</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">El estándar AES</h4>
                                <p className="text-sm">
                                  El Advanced Encryption Standard (AES) es el algoritmo de cifrado simétrico más utilizado actualmente. Seleccionado por el NIST en 2001, sigue siendo considerado seguro y es utilizado por gobiernos, bancos y aplicaciones web.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Modos de operación</h4>
                                <p className="text-sm">
                                  Los cifrados de bloque utilizan diferentes modos de operación (ECB, CBC, CTR, GCM) que afectan significativamente a la seguridad del sistema.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-secondary/10 p-2 rounded-full mr-2">
                              <FiKey className="text-secondary w-5 h-5" />
                            </div>
                            Criptografía Asimétrica (Clave Pública)
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Los sistemas de clave pública utilizan un par de claves matemáticamente relacionadas: una clave pública que puede compartirse libremente y una clave privada que debe mantenerse en secreto. Lo que se cifra con una clave solo puede descifrarse con la otra.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Características principales:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Utiliza dos claves diferentes (pública y privada)</li>
                                <li>Resuelve el problema de la distribución de claves</li>
                                <li>Significativamente más lento que la criptografía simétrica</li>
                                <li>Permite funcionalidades como firmas digitales y autenticación</li>
                                <li>Basado en problemas matemáticos computacionalmente difíciles</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Algoritmos comunes:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">RSA:</span> Basado en la factorización de números primos grandes</li>
                                <li><span className="font-medium">DSA:</span> Algoritmo de Firma Digital</li>
                                <li><span className="font-medium">ECC:</span> Criptografía de Curva Elíptica, ofrece seguridad equivalente con claves más cortas</li>
                                <li><span className="font-medium">Diffie-Hellman:</span> Permite el intercambio de claves sobre un canal inseguro</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">La revolución de la clave pública</h4>
                                <p className="text-sm">
                                  Desarrollada por Whitfield Diffie y Martin Hellman en 1976, la criptografía asimétrica revolucionó el campo al permitir comunicaciones seguras sin necesidad de compartir previamente un secreto.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">¿Sabías que?</h4>
                                <p className="text-sm">
                                  GCHQ, la agencia de inteligencia británica, había desarrollado conceptos similares a RSA y Diffie-Hellman años antes, pero se mantuvieron clasificados hasta 1997.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-accent/10 p-2 rounded-full mr-2">
                              <FiHash className="text-accent w-5 h-5" />
                            </div>
                            Funciones Hash Criptográficas
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Las funciones hash transforman datos de tamaño arbitrario en una cadena de bits de longitud fija, creando una "huella digital" única del mensaje original. A diferencia de los cifrados, las funciones hash no son reversibles.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Propiedades esenciales:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Unidireccionalidad:</span> Es computacionalmente inviable calcular el mensaje original a partir del hash</li>
                                <li><span className="font-medium">Resistencia a colisiones:</span> Es difícil encontrar dos mensajes diferentes con el mismo hash</li>
                                <li><span className="font-medium">Efecto avalancha:</span> Un pequeño cambio en el mensaje produce un hash completamente diferente</li>
                                <li><span className="font-medium">Determinismo:</span> El mismo mensaje siempre produce el mismo hash</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Aplicaciones comunes:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Verificación de integridad de archivos</li>
                                <li>Almacenamiento seguro de contraseñas</li>
                                <li>Firmas digitales</li>
                                <li>Pruebas de trabajo (blockchain)</li>
                                <li>Estructuras de datos (tablas hash)</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Algoritmos hash populares</h4>
                                <ul className="text-sm space-y-1">
                                  <li><span className="font-medium">MD5:</span> 128 bits (obsoleto, vulnerable)</li>
                                  <li><span className="font-medium">SHA-1:</span> 160 bits (obsoleto, vulnerable)</li>
                                  <li><span className="font-medium">SHA-256/SHA-512:</span> Parte de la familia SHA-2</li>
                                  <li><span className="font-medium">SHA-3:</span> El estándar más reciente</li>
                                  <li><span className="font-medium">BLAKE2/BLAKE3:</span> Alternativas rápidas y seguras</li>
                                </ul>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Ejemplo visual</h4>
                                <p className="text-sm">
                                  {`"Hola" → SHA-256 → 
                                  e633f4fc79badea1dc5db970c...`}
                                </p>
                                <p className="text-sm mt-2">
                                  {`"Holi" → SHA-256 → 
                                  198676f9e8a91c1e6b81e7b37...`}
                                </p>
                                <p className="text-sm font-medium mt-2 text-info">
                                  ¡Un solo carácter cambiado produce un hash completamente diferente!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-info/10 p-2 rounded-full mr-2">
                              <FiFileText className="text-info w-5 h-5" />
                            </div>
                            Firma Digital
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Las firmas digitales combinan funciones hash y criptografía asimétrica para proporcionar autenticidad, integridad y no repudio en las comunicaciones digitales.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Proceso de firma digital:</h4>
                              <ol className="list-decimal list-inside space-y-1">
                                <li>Se calcula el hash del mensaje original</li>
                                <li>El hash se cifra con la clave privada del remitente (firma)</li>
                                <li>El mensaje y la firma se envían al destinatario</li>
                                <li>El destinatario descifra la firma con la clave pública del remitente</li>
                                <li>El destinatario calcula el hash del mensaje recibido</li>
                                <li>Si ambos hash coinciden, la firma es válida</li>
                              </ol>

                              <h4 className="font-bold mt-4 mb-2">Usos comunes:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Autenticación de software y actualizaciones</li>
                                <li>Contratos electrónicos</li>
                                <li>Certificados digitales</li>
                                <li>Correo electrónico seguro</li>
                                <li>Transacciones bancarias</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Algoritmos de firma digital</h4>
                                <ul className="text-sm space-y-1">
                                  <li><span className="font-medium">RSA-PSS:</span> Basado en el cifrado RSA</li>
                                  <li><span className="font-medium">DSA:</span> Digital Signature Algorithm</li>
                                  <li><span className="font-medium">ECDSA:</span> Basado en curvas elípticas</li>
                                  <li><span className="font-medium">EdDSA:</span> Edwards-curve Digital Signature Algorithm</li>
                                </ul>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">PGP y GPG</h4>
                                <p className="text-sm">
                                  Pretty Good Privacy (PGP) y su implementación libre GNU Privacy Guard (GPG) son herramientas populares para firmas digitales y cifrado de correo electrónico, basadas en estos principios.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-warning/10 p-2 rounded-full mr-2">
                              <FiShield className="text-warning w-5 h-5" />
                            </div>
                            Infraestructura de Clave Pública (PKI)
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                La PKI es un conjunto de roles, políticas y procedimientos necesarios para crear, gestionar, distribuir, usar, almacenar y revocar certificados digitales, proporcionando un marco para la criptografía de clave pública.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Componentes principales:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Autoridad de Certificación (CA):</span> Emite y verifica certificados digitales</li>
                                <li><span className="font-medium">Autoridad de Registro (RA):</span> Verifica identidades antes de la emisión del certificado</li>
                                <li><span className="font-medium">Certificados X.509:</span> Estándar para certificados de clave pública</li>
                                <li><span className="font-medium">Lista de Revocación de Certificados (CRL):</span> Lista de certificados que ya no son válidos</li>
                                <li><span className="font-medium">Protocolo OCSP:</span> Permite verificar el estado de los certificados en tiempo real</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Aplicaciones de PKI:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>HTTPS y TLS/SSL para sitios web seguros</li>
                                <li>Firma de código para software</li>
                                <li>Autenticación de cliente en redes</li>
                                <li>Sistemas de correo electrónico seguro</li>
                                <li>Tarjetas inteligentes y documentos de identidad</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">¿Qué es un certificado digital?</h4>
                                <p className="text-sm">
                                  Un certificado digital es un documento electrónico que contiene la clave pública de una entidad junto con información sobre su identidad. Está firmado por una autoridad de certificación confiable, lo que garantiza su autenticidad.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">El candado en tu navegador</h4>
                                <p className="text-sm">
                                  Cuando ves el icono de candado en la barra de direcciones de tu navegador, estás interactuando con una PKI que verifica la autenticidad del sitio web mediante certificados.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Resumen - Conceptos Básicos de Criptografía</h2>

                      <div className="alert bg-base-100 shadow-lg mb-6">
                        <div>
                          <FiCheckCircle className="text-success flex-shrink-0 w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">Puntos clave aprendidos</h3>
                            <div className="text-sm">
                              Esta sección te ha proporcionado una comprensión de los bloques fundamentales de la criptografía moderna y cómo se utilizan para construir sistemas seguros.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th>Concepto</th>
                              <th>Características principales</th>
                              <th>Ejemplos</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="font-medium">Criptografía Simétrica</td>
                              <td>Usa la misma clave para cifrar y descifrar, rápida, eficiente</td>
                              <td>AES, DES, ChaCha20</td>
                            </tr>
                            <tr>
                              <td className="font-medium">Criptografía Asimétrica</td>
                              <td>Par de claves (pública/privada), más lenta pero resuelve distribución de claves</td>
                              <td>RSA, ECC, Diffie-Hellman</td>
                            </tr>
                            <tr>
                              <td className="font-medium">Funciones Hash</td>
                              <td>Unidireccionales, huella digital de datos, resistentes a colisiones</td>
                              <td>SHA-256, SHA-3, BLAKE2</td>
                            </tr>
                            <tr>
                              <td className="font-medium">Firma Digital</td>
                              <td>Autenticidad, integridad, no repudio</td>
                              <td>RSA-PSS, ECDSA, EdDSA</td>
                            </tr>
                            <tr>
                              <td className="font-medium">PKI</td>
                              <td>Gestión de certificados y confianza</td>
                              <td>HTTPS, Certificados X.509</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card bg-base-100 shadow-sm">
                          <div className="card-body p-4">
                            <h3 className="card-title text-base">Principios generales a recordar:</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              <li>Nunca implementes tus propios algoritmos criptográficos para uso en producción</li>
                              <li>La fortaleza de un sistema es determinada por su eslabón más débil</li>
                              <li>Los sistemas híbridos (combinando simétrica y asimétrica) aprovechan lo mejor de ambos mundos</li>
                              <li>La criptografía es sólo una parte de la seguridad general de un sistema</li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-sm">
                          <div className="card-body p-4">
                            <h3 className="card-title text-base">Aplicaciones comunes:</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              <li>Cifrado de comunicaciones (TLS/SSL)</li>
                              <li>Autenticación segura</li>
                              <li>Sistemas de firma electrónica</li>
                              <li>Almacenamiento seguro de contraseñas</li>
                              <li>Verificación de integridad de software</li>
                              <li>Tecnologías blockchain</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-info mt-6">
                        <div>
                          <FiArrowRight className="w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">¿Qué sigue?</h3>
                            <div className="text-sm">
                              En la próxima sección exploraremos las aplicaciones prácticas de la criptografía en el mundo real, desde la seguridad web hasta las criptomonedas.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card-actions justify-between mt-6">
                    <button
                      className="btn btn-outline"
                      onClick={() => handleSectionChange('history')}
                    >
                      <FiArrowRight className="mr-2 rotate-180" /> Anterior: Historia
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSectionChange('applications')}
                    >
                      Siguiente: Aplicaciones <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Section Content */}
            {currentSection === 'applications' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  {activeTab === 'content' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Aplicaciones de la Criptografía</h2>

                      <p className="mb-6">
                        La criptografía está presente en casi todos los aspectos de nuestra vida digital moderna. En esta sección, exploraremos algunas de las aplicaciones más importantes y cómo los conceptos criptográficos se implementan en soluciones prácticas.
                      </p>

                      <div className="space-y-8">
                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-2">
                              <FiGlobe className="text-primary w-5 h-5" />
                            </div>
                            Seguridad en Internet
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                La seguridad en la web depende fundamentalmente de protocolos criptográficos que aseguran las comunicaciones entre navegadores y servidores.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">TLS/SSL:</h4>
                              <p className="mb-3">
                                Transport Layer Security (TLS) y su predecesor Secure Sockets Layer (SSL) son protocolos que proporcionan comunicaciones seguras en Internet.
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Autenticación:</span> Verifica la identidad del servidor (y opcionalmente del cliente)</li>
                                <li><span className="font-medium">Confidencialidad:</span> Cifra los datos transmitidos</li>
                                <li><span className="font-medium">Integridad:</span> Detecta cualquier manipulación de datos</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">HTTPS:</h4>
                              <p className="mb-3">
                                HTTP sobre TLS/SSL asegura las comunicaciones web y es indicado por el candado en la barra de direcciones del navegador.
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Protege contra ataques de intermediarios (man-in-the-middle)</li>
                                <li>Asegura transacciones, inicios de sesión y datos sensibles</li>
                                <li>Es un factor de posicionamiento en buscadores</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">¿Cómo funciona un handshake TLS?</h4>
                                <ol className="text-sm list-decimal list-inside space-y-1">
                                  <li>El cliente envía un "hello" con los cifrados que soporta</li>
                                  <li>El servidor responde con su certificado y cifrados seleccionados</li>
                                  <li>El cliente verifica el certificado y genera una clave de sesión</li>
                                  <li>La clave se cifra con la clave pública del servidor</li>
                                  <li>Ambas partes derivan claves simétricas para la sesión</li>
                                  <li>La comunicación continúa cifrada con estas claves</li>
                                </ol>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">¿Sabías que?</h4>
                                <p className="text-sm">
                                  Las versiones antiguas de SSL (1.0, 2.0, 3.0) y TLS 1.0/1.1 se consideran inseguras y han sido desaprobadas. Los estándares actuales recomiendan usar TLS 1.2 o superior.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-secondary/10 p-2 rounded-full mr-2">
                              <FiUser className="text-secondary w-5 h-5" />
                            </div>
                            Autenticación y Gestión de Identidad
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                La criptografía es fundamental para verificar identidades en el mundo digital y proteger las credenciales de acceso.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Almacenamiento seguro de contraseñas:</h4>
                              <p className="mb-3">
                                Las contraseñas nunca deben almacenarse en texto plano. En su lugar:
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Funciones Hash + Salt:</span> Se aplica una función hash a la contraseña junto con un valor aleatorio único (salt)</li>
                                <li><span className="font-medium">Funciones de derivación de claves (KDF):</span> Argon2, PBKDF2, bcrypt añaden características como factor de trabajo ajustable</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Autenticación multi-factor (MFA):</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">TOTP/HOTP:</span> Contraseñas de un solo uso basadas en tiempo o contadores (Google Authenticator)</li>
                                <li><span className="font-medium">WebAuthn/FIDO2:</span> Estándares para autenticación mediante llaves de seguridad física</li>
                                <li><span className="font-medium">Certificados de cliente:</span> Autenticación mediante criptografía de clave pública</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">El problema de "olvidé mi contraseña"</h4>
                                <p className="text-sm">
                                  Dado que el almacenamiento adecuado de contraseñas es unidireccional (mediante hash), es matemáticamente imposible recuperar la contraseña original. Por eso los sitios web seguros ofrecen restablecer la contraseña en lugar de recuperarla.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Single Sign-On (SSO)</h4>
                                <p className="text-sm">
                                  Sistemas como OAuth 2.0, OpenID Connect y SAML utilizan tokens cifrados para permitir a los usuarios acceder a múltiples servicios con una sola autenticación, balanceando seguridad y conveniencia.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-accent/10 p-2 rounded-full mr-2">
                              <FiDatabase className="text-accent w-5 h-5" />
                            </div>
                            Blockchain y Criptomonedas
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                La tecnología blockchain representa una de las aplicaciones más innovadoras de la criptografía moderna, sirviendo como base para criptomonedas y contratos inteligentes.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Componentes criptográficos esenciales:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Funciones hash:</span> SHA-256 en Bitcoin se utiliza para crear identificadores únicos de bloques y transacciones</li>
                                <li><span className="font-medium">Criptografía de curva elíptica:</span> Utilizada para generar pares de claves públicas/privadas para carteras digitales</li>
                                <li><span className="font-medium">Firmas digitales:</span> Verifican la propiedad y autorizan transacciones</li>
                                <li><span className="font-medium">Proof of Work:</span> Mecanismo de consenso basado en funciones hash con dificultad ajustable</li>
                                <li><span className="font-medium">Merkle Trees:</span> Estructuras de datos que permiten verificaciones eficientes</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Funcionamiento básico:</h4>
                              <ol className="list-decimal list-inside space-y-1">
                                <li>Las transacciones se firman con claves privadas</li>
                                <li>Las transacciones validadas se agrupan en bloques</li>
                                <li>Los bloques se enlazan criptográficamente formando una cadena</li>
                                <li>La cadena se distribuye entre múltiples nodos para descentralización</li>
                                <li>El consenso se logra mediante pruebas criptográficas (PoW, PoS)</li>
                              </ol>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Más allá de las criptomonedas</h4>
                                <p className="text-sm">
                                  Aunque Bitcoin fue la primera aplicación práctica, blockchain se utiliza ahora para contratos inteligentes, tokenización de activos, registro de propiedad, cadenas de suministro, votación electrónica y muchas otras aplicaciones que requieren transparencia e inmutabilidad.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">¿Sabías que?</h4>
                                <p className="text-sm">
                                  La identidad de Satoshi Nakamoto, creador de Bitcoin, sigue siendo un misterio. El proyecto combinó elementos criptográficos existentes (firmas digitales, funciones hash, proof of work) de manera innovadora para resolver el problema del doble gasto sin una autoridad central.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-info/10 p-2 rounded-full mr-2">
                              <FiLock className="text-info w-5 h-5" />
                            </div>
                            Cifrado de Datos y Comunicaciones
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Proteger la información en reposo (almacenada) y en tránsito (durante transmisión) es una aplicación fundamental de la criptografía.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Mensajería segura:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Cifrado de extremo a extremo (E2EE):</span> Solo los participantes pueden leer los mensajes</li>
                                <li><span className="font-medium">Signal Protocol:</span> Implementa Perfect Forward Secrecy y deniability</li>
                                <li><span className="font-medium">Aplicaciones:</span> WhatsApp, Signal, Telegram (chats secretos)</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Cifrado de almacenamiento:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Cifrado completo de disco:</span> BitLocker, FileVault, LUKS</li>
                                <li><span className="font-medium">Cifrado a nivel de archivo:</span> PGP, EFS, VeraCrypt</li>
                                <li><span className="font-medium">Bases de datos cifradas:</span> Protección de datos sensibles</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Redes privadas virtuales (VPN):</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Crean túneles cifrados a través de redes públicas</li>
                                <li>Protocolos: OpenVPN, WireGuard, IPsec</li>
                                <li>Proporcionan confidencialidad, integridad y autenticación</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Perfect Forward Secrecy</h4>
                                <p className="text-sm">
                                  Esta propiedad garantiza que, incluso si una clave privada a largo plazo se ve comprometida, las sesiones pasadas no pueden ser descifradas. Se logra mediante el uso de claves efímeras generadas para cada sesión.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Metadatos: el talón de Aquiles</h4>
                                <p className="text-sm">
                                  Aunque el cifrado protege el contenido, a menudo los metadatos (quién habla con quién, cuándo, con qué frecuencia) quedan expuestos. Tecnologías como las redes onion (Tor) intentan abordar este problema mediante múltiples capas de cifrado y enrutamiento aleatorio.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-warning/10 p-2 rounded-full mr-2">
                              <FiFileText className="text-warning w-5 h-5" />
                            </div>
                            Documentos Electrónicos y Firmas Digitales
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                La criptografía ha transformado procesos legales y empresariales al permitir la verificación de documentos electrónicos y la realización de transacciones remotas.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Firmas electrónicas avanzadas:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Garantizan autenticidad, integridad y no repudio</li>
                                <li>Están respaldadas por marcos legales (eIDAS en Europa, ESIGN Act en EE.UU.)</li>
                                <li>Utilizan certificados digitales emitidos por autoridades reconocidas</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Sellos de tiempo:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Demuestran que un documento existía en un momento específico</li>
                                <li>Utilizan firmas digitales de autoridades de sellado de tiempo</li>
                                <li>Son esenciales para contratos y propiedad intelectual</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Notarización digital:</h4>
                              <p>Combina firmas digitales, sellos de tiempo y a veces blockchain para crear registros verificables e inmutables de documentos importantes.</p>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Valor legal</h4>
                                <p className="text-sm">
                                  En muchos países, las firmas electrónicas tienen el mismo valor legal que las manuscritas, siempre que cumplan ciertos requisitos técnicos y procedimentales. Esto ha facilitado enormemente los negocios digitales y reducido el uso de papel.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">PDF firmados digitalmente</h4>
                                <p className="text-sm">
                                  Los documentos PDF pueden incluir firmas digitales basadas en certificados que verifican la identidad del firmante y garantizan que el documento no ha sido modificado desde la firma.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Resumen - Aplicaciones de la Criptografía</h2>

                      <div className="alert bg-base-100 shadow-lg mb-6">
                        <div>
                          <FiCheckCircle className="text-success flex-shrink-0 w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">Puntos clave aprendidos</h3>
                            <div className="text-sm">
                              Esta sección ha explorado cómo los principios criptográficos se aplican en soluciones prácticas que utilizamos diariamente.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title text-lg">Seguridad en Internet</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              <li>TLS/SSL asegura comunicaciones web</li>
                              <li>HTTPS protege sitios web y transacciones</li>
                              <li>Certificados digitales verifican identidades</li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title text-lg">Autenticación y Gestión de Identidad</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              <li>Almacenamiento seguro de contraseñas mediante hash y salt</li>
                              <li>Autenticación multi-factor (MFA) para seguridad adicional</li>
                              <li>Single Sign-On para gestión simplificada de identidades</li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title text-lg">Blockchain y Criptomonedas</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              <li>Utiliza hash, firmas digitales y criptografía de curva elíptica</li>
                              <li>Proporciona inmutabilidad y descentralización</li>
                              <li>Aplicaciones más allá de las criptomonedas: contratos inteligentes, registros, etc.</li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title text-lg">Cifrado de Datos y Comunicaciones</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              <li>Mensajería con cifrado de extremo a extremo</li>
                              <li>Cifrado de almacenamiento para proteger datos en reposo</li>
                              <li>VPNs para comunicaciones seguras en redes públicas</li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md md:col-span-2">
                          <div className="card-body">
                            <h3 className="card-title text-lg">Documentos Electrónicos y Firmas Digitales</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              <li>Las firmas digitales proporcionan autenticidad, integridad y no repudio</li>
                              <li>Los sellos de tiempo verifican la existencia de documentos en momentos específicos</li>
                              <li>La notarización digital combina múltiples técnicas para crear registros verificables</li>
                              <li>Marcos legales como eIDAS dan valor jurídico a estas tecnologías</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-info mt-6">
                        <div>
                          <FiArrowRight className="w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">¿Qué sigue?</h3>
                            <div className="text-sm">
                              En la próxima sección exploraremos las consideraciones éticas y legales relacionadas con la criptografía, incluyendo privacidad, regulaciones y el debate sobre el acceso gubernamental.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card-actions justify-between mt-6">
                    <button
                      className="btn btn-outline"
                      onClick={() => handleSectionChange('concepts')}
                    >
                      <FiArrowRight className="mr-2 rotate-180" /> Anterior: Conceptos Básicos
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
                <p className="mb-6">Responde correctamente todas las preguntas para completar el módulo de Fundamentos de la Criptografía. Puedes intentarlo tantas veces como necesites.</p>

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
                  <div>
                    <button className="btn btn-outline" onClick={() => {
                      setStage('learning');
                      setActiveTab('content');

                    }
                    }>
                      <FiArrowRight className="mr-2 rotate-180" /> Volver a la lección
                    </button>
                  </div>
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
                      <FiCheckCircle className="mr-2" /> Evaluación completada con éxito
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
        }

        {/* Completion Stage */}
        {
          stage === 'completed' && (
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
                    <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Fundamentos de la Criptografía</h2>
                    <p className="text-lg mb-6">Has adquirido una comprensión sólida de los conceptos fundamentales, la historia y las aplicaciones de la criptografía, así como sus implicaciones éticas y legales.</p>

                    <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                      <div className="flex items-center justify-center mb-4">
                        <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                          <FiKey className="h-5 w-5" />
                          Criptógrafo Principiante
                        </div>
                      </div>
                      <p>Has demostrado un conocimiento fundamental de los principios criptográficos y su aplicación en el mundo moderno.</p>
                    </div>

                    <h3 className="text-xl font-bold mb-4">¿Qué has aprendido?</h3>
                    <ul className="list-disc list-inside text-left max-w-md mx-auto mb-6 space-y-2">
                      <li>Principios fundamentales de la criptografía</li>
                      <li>Evolución histórica de las técnicas criptográficas</li>
                      <li>Diferencias entre cifrado simétrico y asimétrico</li>
                      <li>Funciones hash y firmas digitales</li>
                      <li>Aplicaciones prácticas en la vida cotidiana</li>
                      <li>Desafíos éticos y legales en el uso de la criptografía</li>
                    </ul>

                    <div className="alert alert-info shadow-lg mb-6 text-left">
                      <div>
                        <FiHelpCircle className="w-6 h-6" />
                        <div>
                          <h3 className="font-bold">Próximos pasos</h3>
                          <p>¿Interesado en profundizar más? Te recomendamos continuar con el módulo "Criptografía Clásica" para explorar técnicas históricas con enfoque práctico, o "Criptografía Moderna" para adentrarte en algoritmos contemporáneos.</p>
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
          )
        }
      </main >

      {/* Footer */}
      < footer className="bg-base-200 text-center py-4 border-t border-base-300" >
        <p>© 2025 CryptoPlayground</p>
      </footer >
    </div >
  );
}