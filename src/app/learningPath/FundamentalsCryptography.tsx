"use client";
import { useState, useEffect } from 'react';
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
  FiServer,
  FiUserCheck,
  FiAlertTriangle,
  FiCode,
  FiCalendar,
  FiClock,
  FiDatabase,
  FiEye,
  FiFileText as FiDocument,
  FiHash
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

// Types for our application
type SectionType = 'intro' | 'history' | 'concepts' | 'applications' | 'ethics';
type ProgressStage = 'learning' | 'quiz' | 'completed';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

export default function FundamentalsCryptography() {
  // State management
  const [currentSection, setCurrentSection] = useState<SectionType>('intro');
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<ProgressStage>('learning');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('content');
  const [questionsAnswered, setQuestionsAnswered] = useState<number[]>([]);

  // Quiz state
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

  // Update progress based on current section and stage
  useEffect(() => {
    let newProgress = 0;

    // Base progress on current section
    if (currentSection === 'intro') newProgress = 0;
    else if (currentSection === 'history') newProgress = 20;
    else if (currentSection === 'concepts') newProgress = 40;
    else if (currentSection === 'applications') newProgress = 60;
    else if (currentSection === 'ethics') newProgress = 80;

    // Adjust based on stage
    if (stage === 'quiz') newProgress = 90;
    else if (stage === 'completed') newProgress = 100;

    setProgress(newProgress);
  }, [currentSection, stage]);

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
        // Here you would send the achievement to the database

        //add confetti effect
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 },
          scalar: 1.2,
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

  // Navigate between different sections
  const handleSectionChange = (section: SectionType) => {
    setCurrentSection(section);
    setActiveTab('content');
  };

  // Navigate to the quiz when all sections are reviewed
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
                  style={{ width: progress >= 80 ? '100%' : '0%' }}
                ></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${currentSection === 'ethics' ? 'border-primary bg-primary text-primary-content' : progress >= 90 ? 'border-primary bg-primary-content text-primary' : 'border-base-300 bg-base-100'}`}>
                  <FiShield className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1">Ética</span>
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
              <button
                className={`tab ${currentSection === 'ethics' ? 'tab-active' : ''}`}
                onClick={() => handleSectionChange('ethics')}
              >
                Ética y Legalidad
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
                className={`tab tab-bordered ${activeTab === 'resources' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                Recursos Adicionales
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
                            La criptografía es la ciencia y el arte de la comunicación segura en presencia de terceros. Su nombre proviene del griego <em>kryptós</em> (oculto) y <em>graphein</em> (escritura), literalmente "escritura oculta".
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

                  {activeTab === 'resources' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Recursos Adicionales - Introducción</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiBookOpen className="text-primary mr-2" />
                              Libros recomendados
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <div className="badge badge-primary mt-1">Básico</div>
                                <span>"Criptografía para principiantes" - Simon Singh</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="badge badge-secondary mt-1">Intermedio</div>
                                <span>"Serious Cryptography" - Jean-Philippe Aumasson</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="badge badge-accent mt-1">Avanzado</div>
                                <span>"Handbook of Applied Cryptography" - A. Menezes, P. van Oorschot, S. Vanstone</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiGlobe className="text-secondary mr-2" />
                              Recursos en línea
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Cryptography I - Curso de Coursera por Dan Boneh</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Khan Academy - Criptografía básica</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>CrypTool - Software educativo para criptografía</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiCode className="text-accent mr-2" />
                              Herramientas prácticas
                            </h3>
                            <p className="mt-2">
                              Si deseas experimentar con conceptos básicos de criptografía, puedes utilizar estas herramientas:
                            </p>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>CyberChef - "La navaja suiza de la ciberseguridad"</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Cryptii - Conversión y codificación online</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiDocument className="text-info mr-2" />
                              Documentos históricos
                            </h3>
                            <p className="mt-2">
                              Documentos históricos relevantes para entender el desarrollo de la criptografía:
                            </p>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"The Codebreakers" - David Kahn (Historia comprensiva)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"La cryptographie militaire" - Auguste Kerckhoffs (1883)</span>
                              </li>
                            </ul>
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

                  {activeTab === 'resources' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Recursos Adicionales - Historia de la Criptografía</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiBookOpen className="text-primary mr-2" />
                              Lecturas recomendadas
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"The Code Book" - Simon Singh (Historia accesible de la criptografía)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"The Codebreakers" - David Kahn (La obra definitiva sobre la historia criptográfica)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Crypto" - Steven Levy (Sobre la revolución de la clave pública)</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiGlobe className="text-secondary mr-2" />
                              Documentales y películas
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"The Imitation Game" (2014) - Sobre Alan Turing y el descifrado de Enigma</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Breaking the Code" - Documental de la BBC sobre Bletchley Park</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Cryptography: The Key to Digital Security" - Khan Academy</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiCalendar className="text-accent mr-2" />
                              Museos y sitios históricos
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Museo de Bletchley Park (Reino Unido) - Centro de descifrado durante la Segunda Guerra Mundial</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Museo Nacional de Criptografía (Estados Unidos) - Historia de la criptografía americana</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Museo de la Guerra (Londres) - Exhibiciones sobre criptografía militar</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiServer className="text-info mr-2" />
                              Recursos interactivos
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Simulador de Enigma online - Experimenta con una máquina Enigma virtual</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Cryptii - Herramienta online para probar cifrados históricos</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Proyecto Gutenberg - Textos históricos sobre criptografía</span>
                              </li>
                            </ul>
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
                                  "Hola" → SHA-256 → 4f09daa9d95bcb166a302407a0e0babe6c3c891da4def77a...
                                </p>
                                <p className="text-sm mt-2">
                                  "Holi" → SHA-256 → cd6357efdd966de8c0cb2f876cc89ec74ce35f0968e1195...
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

                  {activeTab === 'resources' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Recursos Adicionales - Conceptos Básicos</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiBookOpen className="text-primary mr-2" />
                              Material de estudio
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Cryptography Engineering" - Ferguson, Schneier & Kohno</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Introduction to Modern Cryptography" - Katz & Lindell</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Understanding Cryptography" - Paar & Pelzl</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiGlobe className="text-secondary mr-2" />
                              Cursos en línea
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Cryptography I & II - Coursera (Universidad de Stanford)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Introduction to Cryptography - Udemy</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Cryptography and Information Theory - Codecademy</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiCode className="text-accent mr-2" />
                              Bibliotecas y herramientas
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>OpenSSL - Conjunto de herramientas criptográficas de código abierto</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Libsodium - Biblioteca moderna con API sencilla</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>CrypTool - Software educativo para criptografía</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiServer className="text-info mr-2" />
                              Recursos interactivos
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Cryptohack - Plataforma de desafíos criptográficos</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>CryptoKait - Visualizaciones de algoritmos criptográficos</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Wolfram Demonstrations - Demostraciones interactivas de conceptos</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-info mt-6">
                        <div>
                          <FiHelpCircle className="w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">Tip de aprendizaje</h3>
                            <div className="text-sm">
                              La mejor forma de entender los conceptos criptográficos es combinando la teoría con ejercicios prácticos. Intenta implementar algunos algoritmos básicos o utiliza herramientas interactivas para visualizar su funcionamiento.
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

                  {activeTab === 'resources' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Recursos Adicionales - Aplicaciones Prácticas</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiGlobe className="text-primary mr-2" />
                              Seguridad Web
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>OWASP - Organización de seguridad web</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"HTTPS Everywhere" - Extensión para navegadores</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>SSL Labs - Herramienta para analizar implementaciones TLS</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiDatabase className="text-secondary mr-2" />
                              Blockchain y Criptomonedas
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Mastering Bitcoin" - Andreas M. Antonopoulos</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Blockchain Demo - Demostración visual de blockchain</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Bitcoin Whitepaper - El documento original de Satoshi Nakamoto</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiLock className="text-accent mr-2" />
                              Mensajería Segura
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Signal - Aplicación de mensajería con E2EE</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Documentación técnica del protocolo Signal</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>GnuPG - Implementación libre de OpenPGP</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiFileText className="text-info mr-2" />
                              Firmas Digitales
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>DocuSign - Plataforma de firma electrónica</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Regulación eIDAS - Marco legal europeo para firmas electrónicas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>DigiCert - Autoridad de certificación para firmas digitales</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="card bg-base-100 shadow-md mt-6">
                        <div className="card-body">
                          <h3 className="card-title">
                            <FiCode className="text-primary mr-2" />
                            Herramientas y bibliotecas para desarrolladores
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="table w-full">
                              <thead>
                                <tr>
                                  <th>Nombre</th>
                                  <th>Lenguaje/Plataforma</th>
                                  <th>Descripción</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>OpenSSL</td>
                                  <td>C, multiplataforma</td>
                                  <td>Biblioteca criptográfica completa de código abierto</td>
                                </tr>
                                <tr>
                                  <td>Libsodium</td>
                                  <td>C, bindings múltiples</td>
                                  <td>Biblioteca moderna con API fácil de usar</td>
                                </tr>
                                <tr>
                                  <td>Web Crypto API</td>
                                  <td>JavaScript</td>
                                  <td>API criptográfica para navegadores web</td>
                                </tr>
                                <tr>
                                  <td>Bouncy Castle</td>
                                  <td>Java / C#</td>
                                  <td>Implementación de algoritmos criptográficos</td>
                                </tr>
                                <tr>
                                  <td>PyCA/cryptography</td>
                                  <td>Python</td>
                                  <td>Biblioteca criptográfica para Python</td>
                                </tr>
                              </tbody>
                            </table>
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
                      onClick={() => handleSectionChange('ethics')}
                    >
                      Siguiente: Ética y Legalidad <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Ethics Section Content */}
            {currentSection === 'ethics' && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  {activeTab === 'content' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Ética y Legalidad en Criptografía</h2>

                      <p className="mb-6">
                        La criptografía plantea importantes cuestiones éticas y legales relacionadas con la privacidad, la seguridad nacional y el acceso a la información. En esta sección, exploraremos estos dilemas y los debates actuales.
                      </p>

                      <div className="space-y-8">
                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-2">
                              <FiEye className="text-primary w-5 h-5" />
                            </div>
                            Privacidad vs. Seguridad Nacional
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Uno de los debates más intensos en torno a la criptografía se centra en el equilibrio entre la privacidad individual y la seguridad nacional.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">El debate sobre las "puertas traseras":</h4>
                              <p className="mb-3">
                                Algunos gobiernos han propuesto que los sistemas criptográficos deberían incluir mecanismos de acceso especial para las autoridades, argumentando que es necesario para combatir el terrorismo y el crimen.
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-base-200 p-3 rounded-lg">
                                  <h5 className="font-bold text-sm mb-1">Argumentos a favor:</h5>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    <li>Ayuda a prevenir y resolver crímenes graves</li>
                                    <li>Permite actuar contra amenazas terroristas</li>
                                    <li>Facilita la recuperación de evidencia digital</li>
                                  </ul>
                                </div>
                                <div className="bg-base-200 p-3 rounded-lg">
                                  <h5 className="font-bold text-sm mb-1">Argumentos en contra:</h5>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    <li>Debilita la seguridad para todos los usuarios</li>
                                    <li>No puede garantizarse que solo las autoridades accedan</li>
                                    <li>Puede ser explotado por actores maliciosos</li>
                                  </ul>
                                </div>
                              </div>

                              <h4 className="font-bold mt-4 mb-2">Casos emblemáticos:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Apple vs. FBI (2016):</span> Disputa sobre el desbloqueo del iPhone de un terrorista</li>
                                <li><span className="font-medium">Crypto Wars (años 90):</span> Batalla legal sobre la exportación de criptografía fuerte</li>
                                <li><span className="font-medium">Snowden (2013):</span> Revelaciones sobre programas de vigilancia masiva</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">El consenso técnico</h4>
                                <p className="text-sm">
                                  La gran mayoría de expertos en seguridad y criptografía coinciden en que no es posible crear "puertas traseras" que solo puedan ser utilizadas por actores autorizados. Cualquier debilidad introducida intencionalmente podría ser descubierta y explotada por atacantes.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Alternativas propuestas</h4>
                                <p className="text-sm">
                                  En lugar de debilitar la criptografía, algunos expertos proponen mejorar las capacidades de análisis forense, utilizar metadatos disponibles legalmente, y desarrollar mejores habilidades de inteligencia humana.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-secondary/10 p-2 rounded-full mr-2">
                              <FiFileText className="text-secondary w-5 h-5" />
                            </div>
                            Marco Legal y Regulaciones
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Las leyes y regulaciones sobre criptografía varían significativamente entre países, reflejando diferentes posturas sobre privacidad, seguridad y control gubernamental.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Panorama regulatorio global:</h4>
                              <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                  <thead>
                                    <tr>
                                      <th>Enfoque</th>
                                      <th>Descripción</th>
                                      <th>Ejemplos de países</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Liberal</td>
                                      <td>Uso libre de criptografía con pocas restricciones</td>
                                      <td>EE.UU., Canadá, la mayoría de la UE</td>
                                    </tr>
                                    <tr>
                                      <td>Moderado</td>
                                      <td>Se permite su uso pero con ciertas limitaciones</td>
                                      <td>Brasil, Israel, Japón</td>
                                    </tr>
                                    <tr>
                                      <td>Restrictivo</td>
                                      <td>Uso controlado, posible obligación de entregar claves</td>
                                      <td>Rusia, China, algunos países de Oriente Medio</td>
                                    </tr>
                                    <tr>
                                      <td>Muy restrictivo</td>
                                      <td>Prohibición o control estricto del uso de criptografía</td>
                                      <td>Corea del Norte, ciertos estados autoritarios</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              <h4 className="font-bold mt-4 mb-2">Regulaciones específicas:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Regulaciones de exportación:</span> Control sobre la exportación de tecnología criptográfica</li>
                                <li><span className="font-medium">Leyes de entrega de claves:</span> Obligación legal de proporcionar claves de descifrado a las autoridades</li>
                                <li><span className="font-medium">Estándares nacionales:</span> Algunos países imponen el uso de algoritmos específicos</li>
                                <li><span className="font-medium">Protección de datos:</span> Regulaciones como GDPR que exigen cifrado para datos personales</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">El Acuerdo de Wassenaar</h4>
                                <p className="text-sm">
                                  Este acuerdo internacional controla la exportación de armas y bienes de doble uso, incluyendo tecnología criptográfica. Ha sido criticado por impedir el desarrollo de soluciones de seguridad globales y limitar la investigación.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Leyes de entrega de claves</h4>
                                <p className="text-sm">
                                  En países como el Reino Unido (RIPA) y Australia, existen leyes que pueden obligar a las personas a entregar claves de descifrado bajo amenaza de prisión. Esto plantea preocupaciones sobre el derecho a no autoincriminarse.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-accent/10 p-2 rounded-full mr-2">
                              <FiShield className="text-accent w-5 h-5" />
                            </div>
                            Responsabilidades Éticas en Criptografía
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                Los profesionales e investigadores en criptografía enfrentan dilemas éticos únicos debido al potencial impacto social de su trabajo.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Dilemas éticos comunes:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">Divulgación de vulnerabilidades:</span> ¿Cuándo y cómo revelar fallos descubiertos en algoritmos o implementaciones?</li>
                                <li><span className="font-medium">Desarrollo de herramientas de doble uso:</span> La misma tecnología puede proteger a disidentes o facilitar actividades ilícitas</li>
                                <li><span className="font-medium">Investigación en criptoanálisis:</span> ¿Es ético trabajar en romper sistemas de seguridad?</li>
                                <li><span className="font-medium">Equilibrio entre usabilidad y seguridad:</span> Sistemas extremadamente seguros pero difíciles de usar pueden terminar siendo menos seguros en la práctica</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Principios éticos propuestos:</h4>
                              <ol className="list-decimal list-inside space-y-1">
                                <li><span className="font-medium">Transparencia:</span> Los sistemas criptográficos deberían ser abiertos al escrutinio público</li>
                                <li><span className="font-medium">Divulgación responsable:</span> Informar a los desarrolladores antes de hacer públicas las vulnerabilidades</li>
                                <li><span className="font-medium">Proporcionalidad:</span> Considerar si los beneficios de una tecnología superan sus posibles daños</li>
                                <li><span className="font-medium">Accesibilidad:</span> La seguridad debe estar disponible para todos, no solo para quienes pueden pagarla</li>
                                <li><span className="font-medium">Educación:</span> Promover la comprensión pública de la criptografía y sus implicaciones</li>
                              </ol>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">El Principio de Kerckhoffs desde una perspectiva ética</h4>
                                <p className="text-sm">
                                  Este principio, que establece que la seguridad debe residir en la clave y no en el secreto del algoritmo, tiene también una dimensión ética: promueve la transparencia y permite el escrutinio público, lo que generalmente conduce a sistemas más seguros para todos.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Criptografía para la justicia social</h4>
                                <p className="text-sm">
                                  En regímenes opresivos, la criptografía puede ser una herramienta esencial para defensores de derechos humanos, periodistas y activistas. Esto destaca su rol como tecnología de empoderamiento y no solo de protección de datos.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-base-100 rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-bold mb-3 flex items-center">
                            <div className="bg-info/10 p-2 rounded-full mr-2">
                              <FiClock className="text-info w-5 h-5" />
                            </div>
                            Desafíos Futuros
                          </h3>

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                              <p className="mb-3">
                                La criptografía enfrenta varios desafíos importantes en el horizonte que tendrán implicaciones éticas y legales significativas.
                              </p>
                              <h4 className="font-bold mt-4 mb-2">Computación cuántica:</h4>
                              <p className="mb-3">
                                Las computadoras cuánticas podrían romper muchos de los sistemas criptográficos actuales, creando un escenario donde:
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Información cifrada hoy podría ser descifrada en el futuro ("harvest now, decrypt later")</li>
                                <li>Se necesita una transición global a algoritmos post-cuánticos</li>
                                <li>Existe un riesgo de desigualdad en el acceso a protección criptográfica segura</li>
                                <li>Surgen preguntas sobre quién tendrá acceso a capacidades de descifrado cuántico</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Regulaciones emergentes:</h4>
                              <p className="mb-3">
                                El panorama regulatorio continúa evolucionando, con tendencias como:
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Mayor presión para regular criptomonedas y tecnologías blockchain</li>
                                <li>Debates sobre la soberanía digital y el cifrado como parte de la seguridad nacional</li>
                                <li>Posibles conflictos entre legislaciones nacionales en un mundo digital global</li>
                                <li>Tensión entre regulaciones de privacidad (como GDPR) y demandas de acceso gubernamental</li>
                              </ul>

                              <h4 className="font-bold mt-4 mb-2">Inteligencia artificial y criptografía:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>IA aplicada al criptoanálisis podría descubrir nuevas vulnerabilidades</li>
                                <li>Preocupaciones sobre el uso de IA para generar ataques personalizados</li>
                                <li>Posibilidades de nuevos sistemas criptográficos diseñados o mejorados por IA</li>
                              </ul>
                            </div>
                            <div className="md:w-1/3">
                              <div className="bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Criptografía post-cuántica</h4>
                                <p className="text-sm">
                                  El NIST está liderando esfuerzos para estandarizar algoritmos resistentes a ataques cuánticos. En 2022, seleccionó varios candidatos para la estandarización, incluyendo CRYSTALS-Kyber para cifrado y CRYSTALS-Dilithium para firmas digitales. La transición a estos algoritmos será un desafío técnico y logístico mundial.
                                </p>
                              </div>

                              <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">El dilema de la preservación histórica</h4>
                                <p className="text-sm">
                                  La criptografía plantea preguntas sobre la preservación de la historia digital. Si los datos cifrados se vuelven inaccesibles (por pérdida de claves o tecnologías obsoletas), podríamos perder partes significativas de nuestra historia digital. ¿Cómo balanceamos la privacidad con la preservación del conocimiento para futuras generaciones?
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Recursos Adicionales - Ética y Legalidad</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiBookOpen className="text-primary mr-2" />
                              Lecturas recomendadas
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Data and Goliath" - Bruce Schneier</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Privacy in the Modern Age" - Marc Rotenberg et al.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>"Ethical and Social Issues in the Information Age" - Joseph Migga Kizza</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiGlobe className="text-secondary mr-2" />
                              Organizaciones relevantes
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Electronic Frontier Foundation (EFF) - Defiende libertades civiles en el mundo digital</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Privacy International - Organización global por el derecho a la privacidad</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Center for Democracy & Technology - Políticas tecnológicas con enfoque en derechos</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiDocument className="text-accent mr-2" />
                              Documentos y casos importantes
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Caso Apple vs. FBI (2016) - Documentos judiciales y análisis</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Bernstein v. Department of Justice - Caso sobre libertad de expresión y código criptográfico</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Declaración de derechos de cifrado - Propuesta de principios para proteger el cifrado</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                          <div className="card-body">
                            <h3 className="card-title">
                              <FiClock className="text-info mr-2" />
                              Desafíos futuros y preparación
                            </h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>NIST Post-Quantum Cryptography Standardization - Estado del proceso</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Quantum Computing Report - Seguimiento de avances en computación cuántica</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <FiArrowRight className="mt-1 text-primary flex-shrink-0" />
                                <span>Center for Responsible AI - Investigación sobre ética en IA y seguridad</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="card bg-base-100 shadow-md mt-6">
                        <div className="card-body">
                          <h3 className="card-title flex items-center">
                            <FiAlertTriangle className="text-warning mr-2" />
                            Recursos para debates éticos
                          </h3>
                          <p className="mt-2">
                            Las siguientes preguntas pueden servir como punto de partida para debates sobre ética en criptografía:
                          </p>
                          <ul className="mt-4 space-y-3">
                            <li className="p-3 bg-base-200 rounded-lg">
                              <p className="font-medium">¿Deberían existir límites legales a la criptografía? Si es así, ¿quién debería determinarlos?</p>
                            </li>
                            <li className="p-3 bg-base-200 rounded-lg">
                              <p className="font-medium">¿Tienen los ciudadanos un derecho fundamental al cifrado fuerte, o deben aceptarse compromisos por razones de seguridad nacional?</p>
                            </li>
                            <li className="p-3 bg-base-200 rounded-lg">
                              <p className="font-medium">¿Cuál es la responsabilidad de los desarrolladores de tecnología criptográfica respecto a los posibles usos maliciosos de sus creaciones?</p>
                            </li>
                            <li className="p-3 bg-base-200 rounded-lg">
                              <p className="font-medium">En un mundo con computación cuántica, ¿cómo podemos asegurar un acceso equitativo a protección criptográfica?</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div>
                      <h2 className="card-title text-2xl mb-4">Resumen - Ética y Legalidad en Criptografía</h2>

                      <div className="alert bg-base-100 shadow-lg mb-6">
                        <div>
                          <FiCheckCircle className="text-success flex-shrink-0 w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">Puntos clave aprendidos</h3>
                            <div className="text-sm">
                              Esta sección ha explorado las complejas dimensiones éticas, legales y sociales que rodean a la criptografía en el mundo moderno.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th>Área</th>
                              <th>Consideraciones principales</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="font-medium">Privacidad vs. Seguridad</td>
                              <td>
                                <ul className="list-disc list-inside">
                                  <li>Debate sobre "puertas traseras" y acceso gubernamental</li>
                                  <li>Casos emblemáticos como Apple vs. FBI</li>
                                  <li>Dilema entre derechos individuales y seguridad colectiva</li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="font-medium">Marco Legal</td>
                              <td>
                                <ul className="list-disc list-inside">
                                  <li>Variación significativa entre enfoques regulatorios por países</li>
                                  <li>Regulaciones de exportación y acuerdos internacionales</li>
                                  <li>Leyes de entrega de claves y sus implicaciones</li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="font-medium">Responsabilidades Éticas</td>
                              <td>
                                <ul className="list-disc list-inside">
                                  <li>Divulgación responsable de vulnerabilidades</li>
                                  <li>Tecnologías de doble uso y sus implicaciones</li>
                                  <li>Principios éticos propuestos para profesionales</li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="font-medium">Desafíos Futuros</td>
                              <td>
                                <ul className="list-disc list-inside">
                                  <li>Impacto de la computación cuántica</li>
                                  <li>Evolución de marcos regulatorios</li>
                                  <li>Intersección entre IA y criptografía</li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="alert alert-info mt-6">
                        <div>
                          <FiArrowRight className="w-6 h-6 mr-2" />
                          <div>
                            <h3 className="font-bold">Reflexión final</h3>
                            <div className="text-sm">
                              La criptografía no es solo una disciplina técnica, sino una tecnología con profundas implicaciones sociales y políticas. Como profesionales o usuarios, debemos considerar estas dimensiones más amplias y participar en los debates que darán forma a su futuro.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card-actions justify-between mt-6">
                    <button
                      className="btn btn-outline"
                      onClick={() => handleSectionChange('applications')}
                    >
                      <FiArrowRight className="mr-2 rotate-180" /> Anterior: Aplicaciones
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
                  <h2 className="text-3xl font-bold mb-4">¡Felicidades! Has completado el módulo de Fundamentos de la Criptografía</h2>
                  <p className="text-lg mb-6">Has adquirido una comprensión sólida de los conceptos fundamentales, la historia y las aplicaciones de la criptografía, así como sus implicaciones éticas y legales.</p>

                  <div className="my-8 p-6 bg-base-100 rounded-lg max-w-md mx-auto">
                    <h3 className="text-xl font-bold mb-4">Logro Desbloqueado</h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="badge badge-lg p-4 gap-2 bg-primary text-primary-content">
                        <FiKey className="h-5 w-5" />
                        Criptógrafo Iniciado
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
        )}
      </main>

      {/* Footer */}
      <footer className="bg-base-200 text-center py-4 border-t border-base-300">
        <p>© 2025 CryptoPlayground</p>
      </footer>
    </div>
  );
}