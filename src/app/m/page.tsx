'use client';

import { useState, useEffect } from 'react';
import {
    FiLock,
    FiUnlock,
    FiArrowRight,
    FiCheck,
    FiX,
    FiKey,
    FiShield,
    FiCpu,
    FiServer,
    FiFileText,
    FiCheckCircle,
    FiBookmark,
    FiAward,
    FiAlertTriangle,
    FiHelpCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import ThemeDropdown from '../components/ThemeDropDown';


// Main page component
export default function CryptographyFundamentalsModule() {
    // State management
    const [currentSection, setCurrentSection] = useState(0);
    const [progress, setProgress] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [showAnswerFeedback, setShowAnswerFeedback] = useState<boolean>(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
    const [achievementUnlocked, setAchievementUnlocked] = useState(false);

    // Module sections content
    const sections = [
        {
            id: 'intro',
            title: 'Introducción a la Criptografía',
            icon: <FiKey className="w-6 h-6" />,
            content: (
                <div className="space-y-4">
                    <p>
                        La <strong>criptografía</strong> es la ciencia y el arte de la comunicación segura en presencia de terceros.
                        Proviene del griego <em>kryptós</em> (oculto) y <em>graphein</em> (escritura), literalmente "escritura oculta".
                    </p>

                    <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Objetivos del módulo:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Comprender los conceptos fundamentales de la criptografía moderna</li>
                            <li>Aprender sobre los principios criptográficos esenciales</li>
                            <li>Entender la diferencia entre criptografía simétrica y asimétrica</li>
                            <li>Conocer las funciones hash y su importancia</li>
                            <li>Explorar aplicaciones prácticas de la criptografía</li>
                        </ul>
                    </div>

                    <p>
                        La criptografía es un campo esencial en el mundo digital actual, proporcionando las
                        herramientas fundamentales para proteger información sensible y garantizar comunicaciones
                        seguras a través de redes abiertas como internet.
                    </p>

                    <div className="alert alert-info shadow-lg">
                        <div>
                            <FiHelpCircle className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold">Nota importante</h3>
                                <div className="text-sm">
                                    Este módulo aborda los conceptos fundamentales de la criptografía moderna. Los cifrados
                                    clásicos como el cifrado César fueron cubiertos en el módulo "Cifrados Básicos".
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'principles',
            title: 'Principios Criptográficos',
            icon: <FiShield className="w-6 h-6" />,
            content: (
                <div className="space-y-4">
                    <p>
                        La criptografía moderna se basa en cuatro principios fundamentales que garantizan la
                        seguridad de la información:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg flex items-center">
                                    <span className="p-2 rounded-full bg-primary/20 text-primary mr-2">
                                        <FiLock className="w-5 h-5" />
                                    </span>
                                    Confidencialidad
                                </h3>
                                <p>
                                    Asegura que la información solo sea accesible para las personas autorizadas.
                                    Se logra mediante técnicas de cifrado que transforman datos legibles en formatos
                                    aparentemente aleatorios.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg flex items-center">
                                    <span className="p-2 rounded-full bg-secondary/20 text-secondary mr-2">
                                        <FiCheckCircle className="w-5 h-5" />
                                    </span>
                                    Integridad
                                </h3>
                                <p>
                                    Garantiza que la información no ha sido alterada durante su almacenamiento
                                    o transmisión. Las funciones hash criptográficas son clave para verificar
                                    la integridad de los datos.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg flex items-center">
                                    <span className="p-2 rounded-full bg-accent/20 text-accent mr-2">
                                        <FiKey className="w-5 h-5" />
                                    </span>
                                    Autenticación
                                </h3>
                                <p>
                                    Verifica la identidad de usuarios, sistemas o datos. Las firmas digitales
                                    y los certificados son mecanismos de autenticación ampliamente utilizados.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg flex items-center">
                                    <span className="p-2 rounded-full bg-info/20 text-info mr-2">
                                        <FiFileText className="w-5 h-5" />
                                    </span>
                                    No repudio
                                </h3>
                                <p>
                                    Impide que un remitente niegue haber enviado un mensaje. Se implementa
                                    principalmente mediante firmas digitales basadas en criptografía de clave pública.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-warning shadow-lg mt-4">
                        <div>
                            <FiAlertTriangle className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold">Consideración importante</h3>
                                <div className="text-sm">
                                    Estos principios deben ser implementados correctamente para garantizar la seguridad.
                                    Un solo principio comprometido puede poner en riesgo todo el sistema.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'symmetric',
            title: 'Criptografía Simétrica',
            icon: <FiKey className="w-6 h-6" />,
            content: (
                <div className="space-y-4">
                    <p>
                        La <strong>criptografía simétrica</strong>, también conocida como criptografía de clave secreta,
                        utiliza la misma clave para cifrar y descifrar información.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 my-6">
                        <div className="flex-1">
                            <div className="bg-base-200 p-4 rounded-lg h-full">
                                <h4 className="font-bold mb-3">Características principales</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <FiCheck className="text-success min-w-[20px] mt-1 mr-2" />
                                        <span>Algoritmos rápidos y eficientes para grandes volúmenes de datos</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-success min-w-[20px] mt-1 mr-2" />
                                        <span>Implementación relativamente sencilla</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-success min-w-[20px] mt-1 mr-2" />
                                        <span>Requiere claves de menor longitud para el mismo nivel de seguridad</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiX className="text-error min-w-[20px] mt-1 mr-2" />
                                        <span>Problema de distribución segura de claves</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiX className="text-error min-w-[20px] mt-1 mr-2" />
                                        <span>Escalabilidad limitada (n usuarios requieren n(n-1)/2 claves)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="card bg-base-100 shadow-xl h-full">
                                <div className="card-body">
                                    <h4 className="card-title text-lg">Algoritmos simétricos destacados</h4>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th>Algoritmo</th>
                                                    <th>Clave</th>
                                                    <th>Características</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>AES</td>
                                                    <td>128, 192, 256 bits</td>
                                                    <td>Estándar actual, muy seguro</td>
                                                </tr>
                                                <tr>
                                                    <td>DES</td>
                                                    <td>56 bits</td>
                                                    <td>Obsoleto, vulnerable</td>
                                                </tr>
                                                <tr>
                                                    <td>3DES</td>
                                                    <td>112, 168 bits</td>
                                                    <td>Más seguro que DES, pero lento</td>
                                                </tr>
                                                <tr>
                                                    <td>ChaCha20</td>
                                                    <td>256 bits</td>
                                                    <td>Rápido, usado en TLS</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-bold mb-3">Proceso de cifrado simétrico</h4>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <div className="text-center p-3 bg-base-100 rounded-lg">
                                <div className="font-bold">Mensaje original</div>
                                <div className="text-xs">Texto en claro</div>
                            </div>
                            <FiArrowRight className="hidden md:block" />
                            <div className="text-center p-3 bg-primary/10 rounded-lg">
                                <div className="font-bold">Algoritmo de cifrado</div>
                                <div className="text-xs mt-1">AES, ChaCha20, etc.</div>
                                <div className="badge badge-primary mt-2">Clave secreta</div>
                            </div>
                            <FiArrowRight className="hidden md:block" />
                            <div className="text-center p-3 bg-base-100 rounded-lg">
                                <div className="font-bold">Mensaje cifrado</div>
                                <div className="text-xs">Texto cifrado</div>
                            </div>
                            <FiArrowRight className="hidden md:block" />
                            <div className="text-center p-3 bg-primary/10 rounded-lg">
                                <div className="font-bold">Algoritmo de descifrado</div>
                                <div className="text-xs mt-1">AES, ChaCha20, etc.</div>
                                <div className="badge badge-primary mt-2">Misma clave</div>
                            </div>
                            <FiArrowRight className="hidden md:block" />
                            <div className="text-center p-3 bg-base-100 rounded-lg">
                                <div className="font-bold">Mensaje original</div>
                                <div className="text-xs">Texto en claro</div>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-info shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h3 className="font-bold">Aplicaciones comunes</h3>
                                <div className="text-sm">
                                    La criptografía simétrica se utiliza principalmente en el cifrado de datos en reposo,
                                    comunicaciones de alto rendimiento y dentro de protocolos como TLS (para la parte de
                                    cifrado de datos una vez establecida la conexión).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'asymmetric',
            title: 'Criptografía Asimétrica',
            icon: <FiUnlock className="w-6 h-6" />,
            content: (
                <div className="space-y-4">
                    <p>
                        La <strong>criptografía asimétrica</strong>, también conocida como criptografía de clave pública,
                        utiliza un par de claves matemáticamente relacionadas: una <em>clave pública</em> para cifrar y
                        una <em>clave privada</em> para descifrar.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 my-6">
                        <div className="flex-1">
                            <div className="bg-base-200 p-4 rounded-lg h-full">
                                <h4 className="font-bold mb-3">Características principales</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <FiCheck className="text-success min-w-[20px] mt-1 mr-2" />
                                        <span>Resuelve el problema de distribución de claves</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-success min-w-[20px] mt-1 mr-2" />
                                        <span>Permite implementar firmas digitales</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-success min-w-[20px] mt-1 mr-2" />
                                        <span>Proporciona no repudio</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-success min-w-[20px] mt-1 mr-2" />
                                        <span>Mejor escalabilidad (n usuarios requieren 2n claves)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiX className="text-error min-w-[20px] mt-1 mr-2" />
                                        <span>Algoritmos más lentos (100-1000 veces menos eficientes)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiX className="text-error min-w-[20px] mt-1 mr-2" />
                                        <span>Requiere claves más largas para el mismo nivel de seguridad</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="card bg-base-100 shadow-xl h-full">
                                <div className="card-body">
                                    <h4 className="card-title text-lg">Algoritmos asimétricos destacados</h4>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th>Algoritmo</th>
                                                    <th>Base de seguridad</th>
                                                    <th>Aplicaciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>RSA</td>
                                                    <td>Factorización</td>
                                                    <td>Cifrado, firmas digitales</td>
                                                </tr>
                                                <tr>
                                                    <td>ECC</td>
                                                    <td>Logaritmo discreto elíptico</td>
                                                    <td>Móviles, IoT, claves más cortas</td>
                                                </tr>
                                                <tr>
                                                    <td>Diffie-Hellman</td>
                                                    <td>Logaritmo discreto</td>
                                                    <td>Intercambio de claves</td>
                                                </tr>
                                                <tr>
                                                    <td>ElGamal</td>
                                                    <td>Logaritmo discreto</td>
                                                    <td>Cifrado, firmas digitales</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-bold mb-3">Proceso de cifrado asimétrico</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-base-100 rounded-lg">
                                <h5 className="font-bold mb-2 text-center">Cifrado</h5>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="text-center p-2 bg-base-200 rounded-lg w-full">
                                        <div className="font-bold">Mensaje original</div>
                                    </div>
                                    <FiArrowRight />
                                    <div className="text-center p-2 bg-secondary/10 rounded-lg w-full">
                                        <div className="font-bold">Algoritmo de cifrado</div>
                                        <div className="badge badge-secondary mt-1">Clave pública del receptor</div>
                                    </div>
                                    <FiArrowRight />
                                    <div className="text-center p-2 bg-base-200 rounded-lg w-full">
                                        <div className="font-bold">Mensaje cifrado</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-base-100 rounded-lg">
                                <h5 className="font-bold mb-2 text-center">Descifrado</h5>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="text-center p-2 bg-base-200 rounded-lg w-full">
                                        <div className="font-bold">Mensaje cifrado</div>
                                    </div>
                                    <FiArrowRight />
                                    <div className="text-center p-2 bg-primary/10 rounded-lg w-full">
                                        <div className="font-bold">Algoritmo de descifrado</div>
                                        <div className="badge badge-primary mt-1">Clave privada del receptor</div>
                                    </div>
                                    <FiArrowRight />
                                    <div className="text-center p-2 bg-base-200 rounded-lg w-full">
                                        <div className="font-bold">Mensaje original</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-info shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h3 className="font-bold">¿Sabías qué?</h3>
                                <div className="text-sm">
                                    En la práctica, los sistemas criptográficos modernos suelen combinar
                                    criptografía simétrica y asimétrica. Por ejemplo, TLS usa criptografía
                                    asimétrica para intercambiar una clave simétrica, que luego se utiliza para
                                    cifrar la comunicación real.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'hash',
            title: 'Funciones Hash Criptográficas',
            icon: <FiCpu className="w-6 h-6" />,
            content: (
                <div className="space-y-4">
                    <p>
                        Las <strong>funciones hash criptográficas</strong> son algoritmos matemáticos que transforman
                        datos de entrada de cualquier tamaño en una cadena de bits de tamaño fijo (resumen o digest),
                        diseñados para ser unidireccionales y resistentes a colisiones.
                    </p>

                    <div className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h3 className="card-title">Propiedades esenciales</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <div className="badge badge-primary p-3">1</div>
                                    <div>
                                        <strong>Unidireccionalidad (one-way):</strong> Debe ser computacionalmente inviable
                                        calcular la entrada original a partir del hash resultante.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="badge badge-primary p-3">2</div>
                                    <div>
                                        <strong>Resistencia a colisiones:</strong> Debe ser computacionalmente inviable
                                        encontrar dos mensajes diferentes que produzcan el mismo hash.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="badge badge-primary p-3">3</div>
                                    <div>
                                        <strong>Efecto avalancha:</strong> Un pequeño cambio en la entrada debe producir
                                        un cambio significativo en el hash resultante.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="badge badge-primary p-3">4</div>
                                    <div>
                                        <strong>Determinismo:</strong> La misma entrada siempre debe producir el mismo hash.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="badge badge-primary p-3">5</div>
                                    <div>
                                        <strong>Velocidad:</strong> El cálculo del hash debe ser rápido para cualquier entrada.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h4 className="card-title text-lg">Algoritmos hash comunes</h4>
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Algoritmo</th>
                                                <th>Tamaño (bits)</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>MD5</td>
                                                <td>128</td>
                                                <td>
                                                    <span className="badge badge-error">Inseguro</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>SHA-1</td>
                                                <td>160</td>
                                                <td>
                                                    <span className="badge badge-error">Deprecado</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>SHA-256</td>
                                                <td>256</td>
                                                <td>
                                                    <span className="badge badge-success">Seguro</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>SHA-3</td>
                                                <td>224-512</td>
                                                <td>
                                                    <span className="badge badge-success">Muy seguro</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>BLAKE2</td>
                                                <td>256-512</td>
                                                <td>
                                                    <span className="badge badge-success p-5">Seguro y rápido</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="card bg-base-200 shadow-md mb-4 flex-grow">
                                <div className="card-body">
                                    <h4 className="font-bold mb-3">Aplicaciones principales</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <FiCheckCircle className="text-success min-w-[20px] mt-1 mr-2" />
                                            <span><strong>Verificación de integridad:</strong> Detectar cambios en archivos y mensajes</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FiCheckCircle className="text-success min-w-[20px] mt-1 mr-2" />
                                            <span><strong>Almacenamiento de contraseñas:</strong> Nunca se almacenan en texto plano</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FiCheckCircle className="text-success min-w-[20px] mt-1 mr-2" />
                                            <span><strong>Firmas digitales:</strong> Se firma el hash del documento, no el documento completo</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FiCheckCircle className="text-success min-w-[20px] mt-1 mr-2" />
                                            <span><strong>Blockchain:</strong> Creación de cadenas de bloques y minería de criptomonedas</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FiCheckCircle className="text-success min-w-[20px] mt-1 mr-2" />
                                            <span><strong>Generación de identificadores únicos:</strong> Para archivos o conjuntos de datos</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <h4 className="font-bold">Ejemplo de valores hash (SHA-256)</h4>
                                    <div className="overflow-x-auto text-xs md:text-sm">
                                        <p className="mb-1"><strong>Entrada:</strong> "Hola"</p>
                                        <p className="font-mono bg-base-200 p-2 rounded mb-3 break-all">
                                            4d968b80d3b36d66c608cad9e9abe577a010e6533085d1c3a16f294d9785ed8a
                                        </p>
                                        <p className="mb-1"><strong>Entrada:</strong> "Hola."</p>
                                        <p className="font-mono bg-base-200 p-2 rounded break-all">
                                            cdb4ee2aea69cc6a83331bbe96dc2caa9a299d21329efb0336fc02a82e1839a8
                                        </p>
                                        <p className="text-xs text-base-content/70 mt-2">
                                            Nota cómo un pequeño cambio (un punto) genera un hash completamente diferente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-warning">
                        <div>
                            <FiAlertTriangle className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold">Importante: Colisiones</h3>
                                <div className="text-sm">
                                    Aunque matemáticamente siempre existen colisiones (por el principio del palomar),
                                    un buen algoritmo hash criptográfico hace prácticamente imposible encontrarlas.
                                    La obsolescencia de MD5 y SHA-1 se debe precisamente a que se encontraron métodos
                                    para generar colisiones de forma práctica.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'applications',
            title: 'Aplicaciones Prácticas',
            icon: <FiServer className="w-6 h-6" />,
            content: (
                <div className="space-y-4">
                    <p>
                        La criptografía está presente en casi todos los aspectos de nuestra vida digital. Veamos algunas
                        de las aplicaciones más importantes y cómo se utilizan los conceptos criptográficos que hemos aprendido.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                        <motion.div
                            className="card bg-base-100 shadow-xl"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="card-body">
                                <h3 className="card-title flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    HTTPS y TLS/SSL
                                </h3>
                                <p>
                                    Cuando visitas sitios web seguros (https://), estás utilizando TLS (Transport Layer Security).
                                    Este protocolo combina criptografía asimétrica para intercambiar claves y simétrica para cifrar
                                    los datos de la sesión.
                                </p>
                                <div className="card-actions mt-2">
                                    <div className="badge badge-outline">Clave pública</div>
                                    <div className="badge badge-outline">Clave simétrica</div>
                                    <div className="badge badge-outline">Certificados</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card bg-base-100 shadow-xl"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="card-body">
                                <h3 className="card-title flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Pagos electrónicos
                                </h3>
                                <p>
                                    Las transacciones con tarjetas de crédito y los sistemas de pago en línea utilizan
                                    cifrado para proteger la información financiera. Los datos de la tarjeta se cifran
                                    antes de ser transmitidos a través de internet.
                                </p>
                                <div className="card-actions mt-2">
                                    <div className="badge badge-outline">Cifrado</div>
                                    <div className="badge badge-outline">Tokenización</div>
                                    <div className="badge badge-outline">PCI DSS</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card bg-base-100 shadow-xl"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="card-body">
                                <h3 className="card-title flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Mensajería segura
                                </h3>
                                <p>
                                    Aplicaciones como Signal, WhatsApp y Telegram utilizan cifrado de extremo a extremo,
                                    lo que significa que solo el remitente y el destinatario pueden leer los mensajes.
                                </p>
                                <div className="card-actions mt-2">
                                    <div className="badge badge-outline">E2EE</div>
                                    <div className="badge badge-outline">Forward Secrecy</div>
                                    <div className="badge badge-outline">Diffie-Hellman</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card bg-base-100 shadow-xl"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="card-body">
                                <h3 className="card-title flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                    </svg>
                                    Bases de datos
                                </h3>
                                <p>
                                    El cifrado en bases de datos protege información sensible como datos personales,
                                    información médica o financiera, incluso si alguien obtiene acceso no autorizado a la base de datos.
                                </p>
                                <div className="card-actions mt-2">
                                    <div className="badge badge-outline">TDE</div>
                                    <div className="badge badge-outline">Cifrado de columnas</div>
                                    <div className="badge badge-outline">Datos en reposo</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card bg-base-100 shadow-xl"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="card-body">
                                <h3 className="card-title flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Autenticación
                                </h3>
                                <p>
                                    Los sistemas de inicio de sesión seguros utilizan hashes para almacenar contraseñas,
                                    mientras que los métodos modernos como la autenticación de dos factores (2FA) usan
                                    algoritmos criptográficos para generar códigos temporales.
                                </p>
                                <div className="card-actions mt-2">
                                    <div className="badge badge-outline">Hashing de contraseñas</div>
                                    <div className="badge badge-outline">2FA/MFA</div>
                                    <div className="badge badge-outline">TOTP</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card bg-base-100 shadow-xl"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="card-body">
                                <h3 className="card-title flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Blockchain
                                </h3>
                                <p>
                                    Las criptomonedas como Bitcoin y Ethereum se basan en tecnología blockchain,
                                    que utiliza funciones hash para enlazar bloques y
                                    criptografía de clave pública para asegurar transacciones y crear firmas digitales.
                                </p>
                                <div className="card-actions mt-2">
                                    <div className="badge badge-outline">Hash chains</div>
                                    <div className="badge badge-outline">Firmas digitales</div>
                                    <div className="badge badge-outline">Prueba de trabajo</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="card bg-base-200 p-6 shadow-md my-6">
                        <h3 className="font-bold text-xl mb-4">Criptografía del futuro: Amenazas y soluciones</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-base-100 p-4 rounded-lg">
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <FiAlertTriangle className="text-warning" />
                                    Amenazas emergentes
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="badge badge-warning mr-2 mt-1">1</span>
                                        <span><strong>Computación cuántica:</strong> Podría romper algoritmos como RSA y ECC mediante el algoritmo de Shor.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="badge badge-warning mr-2 mt-1">2</span>
                                        <span><strong>Ataques de implementación:</strong> Side-channel, timing attacks, cache attacks.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="badge badge-warning mr-2 mt-1">3</span>
                                        <span><strong>Avances matemáticos:</strong> Descubrimientos en la teoría de números que debilitan algoritmos actuales.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-base-100 p-4 rounded-lg">
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <FiShield className="text-success" />
                                    Soluciones en desarrollo
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="badge badge-success mr-2 mt-1">1</span>
                                        <span><strong>Criptografía post-cuántica:</strong> Algoritmos resistentes a la computación cuántica (CRYSTALS, FALCON, SPHINCS+).</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="badge badge-success mr-2 mt-1">2</span>
                                        <span><strong>Criptografía homomórfica:</strong> Permite computación sobre datos cifrados sin descifrarlos primero.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="badge badge-success mr-2 mt-1">3</span>
                                        <span><strong>Zero-knowledge proofs:</strong> Demostrar conocimiento de algo sin revelar el conocimiento en sí.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-info shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h3 className="font-bold">Consejo profesional</h3>
                                <div className="text-sm">
                                    Nunca intentes crear tu propio algoritmo criptográfico para uso en producción.
                                    Los mejores sistemas utilizan algoritmos estándar, bien probados y públicamente
                                    verificados, implementados en bibliotecas mantenidas profesionalmente.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
    ];

    // Quiz questions
    const quizQuestions = [
        {
            id: 1,
            question: "¿Cuáles son los cuatro principios fundamentales de la criptografía moderna?",
            options: [
                "Cifrado, Descifrado, Compresión y Transmisión",
                "Confidencialidad, Integridad, Autenticación y No repudio",
                "Secreto, Velocidad, Resistencia y Distribución",
                "Encriptación, Hashing, Firma digital y Certificación"
            ],
            correctAnswer: 1
        },
        {
            id: 2,
            question: "¿Cuál es la principal diferencia entre la criptografía simétrica y asimétrica?",
            options: [
                "La criptografía simétrica es más segura que la asimétrica",
                "La criptografía asimétrica solo se usa para cifrar datos pequeños",
                "La criptografía simétrica usa la misma clave para cifrar y descifrar, mientras que la asimétrica usa un par de claves relacionadas",
                "La criptografía simétrica solo funciona para comunicaciones en tiempo real"
            ],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "¿Cuál de las siguientes NO es una propiedad esencial de una función hash criptográfica?",
            options: [
                "Resistencia a colisiones",
                "Unidireccionalidad",
                "Reversibilidad para usuarios autorizados",
                "Efecto avalancha"
            ],
            correctAnswer: 1
        },
        {
            id: 4,
            question: "En un sistema de cifrado asimétrico, ¿qué clave se utiliza para cifrar un mensaje que será enviado a otra persona?",
            options: [
                "Tu clave privada",
                "Tu clave pública",
                "La clave pública del destinatario",
                "La clave privada del destinatario"
            ],
            correctAnswer: 1
        },
        {
            id: 5,
            question: "¿Por qué se considera inseguro crear e implementar algoritmos criptográficos propios para sistemas en producción?",
            options: [
                "Porque viola las leyes de propiedad intelectual",
                "Porque solo funcionarían en sistemas específicos",
                "Porque no han sido sometidos al escrutinio público y podrían contener vulnerabilidades no detectadas",
                "Porque son más lentos que los algoritmos estándar"
            ],
            correctAnswer: 1
        }
    ];

    // Update progress when changing sections
    useEffect(() => {
        // Calculate progress as percentage
        const newProgress = ((currentSection + 1) / (sections.length + (quizCompleted ? 0 : 1))) * 100;
        setProgress(newProgress);

        // Save progress to localStorage or API here
        // Example: saveProgress(currentSection, newProgress);
    }, [currentSection, quizCompleted]);

    // Handle completion of the module
    const handleCompleteModule = () => {
        // Calculate final score
        const correctAnswers = Object.entries(selectedAnswers).reduce((count, [questionId, answerIndex]) => {
            const question = quizQuestions.find(q => q.id === parseInt(questionId));
            if (question && question.correctAnswer === answerIndex) {
                return count + 1;
            }
            return count;
        }, 0);

        const allCorrect = correctAnswers === quizQuestions.length;

        if (allCorrect) {
            // All questions answered correctly
            setQuizCompleted(true);
            setAchievementUnlocked(true);

            // Trigger confetti effect
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Here send the achievement to database
            // Example: saveAchievement('cryptography-fundamentals-completed');
        } else {
            // Show error message if not all answers are correct
            alert(`Has respondido correctamente ${correctAnswers} de ${quizQuestions.length} preguntas. Debes responder todas las preguntas correctamente para completar el módulo.`);
        }
    };

    // Handle selecting answers in the quiz
    const handleSelectAnswer = (questionId: number, answerIndex: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex
        });
    };

    // Handle checking a specific answer
    const handleCheckAnswer = (questionId: number) => {
        const selectedAnswer = selectedAnswers[questionId];
        const question = quizQuestions.find(q => q.id === questionId);

        if (selectedAnswer !== undefined && question) {
            setShowAnswerFeedback(true);
            setIsAnswerCorrect(selectedAnswer === question.correctAnswer);

        }
    };

    // Navigation functions
    const goToNextSection = () => {
        if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
            window.scrollTo(0, 0);
        } else if (!quizStarted) {
            setQuizStarted(true);
            window.scrollTo(0, 0);
        }
    };

    const goToPreviousSection = () => {
        if (quizStarted && !quizCompleted) {
            setQuizStarted(false);
            window.scrollTo(0, 0);
        } else if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-base-100">
            <header className="bg-base-200 shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2">
                        <div className="flex items-center">
                            <FiLock className="w-8 h-8 text-primary mr-2" />
                            <h1 className="text-2xl font-bold">Fundamentos de la Criptografía</h1>
                        </div>

                        <div className="w-full md:w-1/3 flex items-center justify-between">
                            <div className="flex-grow mr-5"> 
                                <div className="flex items-center justify-between mb-1 w-full">
                                    <span className="text-sm">Progreso del módulo</span>
                                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                                </div>
                                <progress
                                    className="progress progress-primary w-full"
                                    value={progress}
                                    max="100"
                                ></progress>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-4xl mx-auto">
                    {!quizStarted ? (
                        // Content sections
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        {sections[currentSection].icon}
                                    </div>
                                    <h2 className="card-title text-2xl">{sections[currentSection].title}</h2>
                                </div>

                                {sections[currentSection].content}

                                <div className="card-actions justify-between mt-8">
                                    <button
                                        className={`btn btn-outline ${currentSection === 0 ? 'btn-disabled' : ''}`}
                                        onClick={goToPreviousSection}
                                        disabled={currentSection === 0}
                                    >
                                        Anterior
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={goToNextSection}
                                    >
                                        {currentSection === sections.length - 1 ? 'Ir al cuestionario' : 'Siguiente'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : !quizCompleted ? (
                        // Quiz section
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        <FiHelpCircle className="w-6 h-6" />
                                    </div>
                                    <h2 className="card-title text-2xl">Evaluación de conocimientos</h2>
                                </div>

                                <p className="mb-6">
                                    Para completar este módulo, responde correctamente las siguientes preguntas sobre
                                    los fundamentos de la criptografía. Debes responder todas las preguntas correctamente
                                    para obtener el logro.
                                </p>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm">Pregunta {currentQuestion + 1} de {quizQuestions.length}</span>
                                    </div>
                                    <progress
                                        className="progress progress-primary w-full"
                                        value={currentQuestion + 1}
                                        max={quizQuestions.length}
                                    ></progress>
                                </div>

                                <div className="space-y-6">
                                    <div className="card bg-base-200">
                                        <div className="card-body">
                                            <h3 className="text-lg font-bold mb-3">
                                                {quizQuestions[currentQuestion].question}
                                            </h3>

                                            <div className="space-y-3">
                                                {quizQuestions[currentQuestion].options.map((option, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedAnswers[quizQuestions[currentQuestion].id] === index
                                                            ? 'bg-primary/20 border border-primary'
                                                            : 'bg-base-100 hover:bg-base-300 border border-base-300'
                                                            }`}
                                                        onClick={() => handleSelectAnswer(quizQuestions[currentQuestion].id, index)}
                                                    >
                                                        <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${selectedAnswers[quizQuestions[currentQuestion].id] === index
                                                            ? 'bg-primary text-primary-content'
                                                            : 'bg-base-300'
                                                            }`}>
                                                            {selectedAnswers[quizQuestions[currentQuestion].id] === index && <FiCheck />}
                                                        </div>
                                                        <span>{option}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {showAnswerFeedback && (
                                                <div className={`alert ${isAnswerCorrect ? 'alert-success' : 'alert-error'} mt-4`}>
                                                    <div>
                                                        {isAnswerCorrect
                                                            ? <FiCheck className="w-6 h-6" />
                                                            : <FiX className="w-6 h-6" />
                                                        }
                                                        <span>{isAnswerCorrect ? '¡Correcto!' : 'Incorrecto. Intenta de nuevo.'}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-between mt-4">
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => handleCheckAnswer(quizQuestions[currentQuestion].id)}
                                                    disabled={selectedAnswers[quizQuestions[currentQuestion].id] === undefined}
                                                >
                                                    Verificar respuesta
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions justify-between mt-8">
                                    <div className="flex gap-2">
                                        <button
                                            className={`btn btn-outline ${currentQuestion === 0 ? 'btn-disabled' : ''}`}
                                            onClick={() => {
                                                currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)
                                                setShowAnswerFeedback(false);
                                            }}
                                            disabled={currentQuestion === 0}
                                        >
                                            Anterior
                                        </button>

                                        <button
                                            className={`btn btn-outline ${currentQuestion === quizQuestions.length - 1 ? 'btn-disabled' : ''}`}
                                            onClick={() => {
                                                if (currentQuestion < quizQuestions.length - 1) {
                                                    setCurrentQuestion(currentQuestion + 1);
                                                    setShowAnswerFeedback(false);
                                                }
                                            }}
                                            disabled={currentQuestion === quizQuestions.length - 1}
                                        >
                                            Siguiente
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-outline"
                                            onClick={goToPreviousSection}
                                        >
                                            Volver al material
                                        </button>

                                        <button
                                            className="btn btn-primary"
                                            onClick={handleCompleteModule}
                                            disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                                        >
                                            Finalizar cuestionario
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Completion screen
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="flex flex-col items-center gap-3 mb-6">
                                    <div className="bg-success/20 text-success p-6 rounded-full">
                                        <FiCheckCircle className="w-12 h-12" />
                                    </div>
                                    <h2 className="card-title text-2xl">¡Felicidades!</h2>
                                </div>

                                <p className="text-lg mb-6">
                                    Has completado exitosamente el módulo "Fundamentos de la Criptografía".
                                </p>

                                {achievementUnlocked && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="card bg-base-200 max-w-md mx-auto mb-8"
                                    >
                                        <div className="card-body text-center">
                                            <div className="flex justify-center mb-3">
                                                <FiAward className="w-16 h-16 text-primary" />
                                            </div>
                                            <h3 className="font-bold text-lg">Logro desbloqueado</h3>
                                            <p className="text-primary font-bold">Criptógrafo Fundamental</p>
                                            <p className="text-sm text-base-content/70">
                                                Has demostrado un sólido entendimiento de los conceptos fundamentales de la criptografía moderna.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="stat bg-base-200 rounded-box">
                                        <div className="stat-figure text-primary">
                                            <FiBookmark className="w-8 h-8" />
                                        </div>
                                        <div className="stat-title">Secciones completadas</div>
                                        <div className="stat-value text-primary">{sections.length}</div>
                                    </div>

                                    <div className="stat bg-base-200 rounded-box">
                                        <div className="stat-figure text-success">
                                            <FiCheckCircle className="w-8 h-8" />
                                        </div>
                                        <div className="stat-title">Preguntas correctas</div>
                                        <div className="stat-value text-success">{quizQuestions.length}</div>
                                    </div>

                                    <div className="stat bg-base-200 rounded-box">
                                        <div className="stat-figure text-secondary">
                                            <FiAward className="w-8 h-8" />
                                        </div>
                                        <div className="stat-title">Logros</div>
                                        <div className="stat-value text-secondary">1</div>
                                    </div>
                                </div>

                                <div className="card bg-base-200 mb-8">
                                    <div className="card-body">
                                        <h3 className="font-bold text-lg mb-2">¿Qué sigue?</h3>
                                        <p className="mb-4">
                                            Ahora que dominas los fundamentos de la criptografía, te recomendamos explorar estos módulos relacionados:
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className="card bg-base-100 shadow-md"
                                            >
                                                <div className="card-body">
                                                    <h4 className="card-title text-md">Criptografía Simétrica Avanzada</h4>
                                                    <p className="text-sm">Profundiza en los algoritmos modernos como AES y ChaCha20.</p>
                                                    <div className="card-actions justify-end mt-2">
                                                        <button className="btn btn-primary btn-sm">Explorar</button>
                                                    </div>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className="card bg-base-100 shadow-md"
                                            >
                                                <div className="card-body">
                                                    <h4 className="card-title text-md">Firmas Digitales y PKI</h4>
                                                    <p className="text-sm">Aprende sobre certificados, autoridades de certificación y firmas.</p>
                                                    <div className="card-actions justify-end mt-2">
                                                        <button className="btn btn-primary btn-sm">Explorar</button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions justify-center">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            // Here you would navigate to the course dashboard or next module
                                            // For now, just reset the state
                                            window.location.reload();
                                        }}
                                    >
                                        Volver al tablero de aprendizaje
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Module overview section */}
                    {!quizStarted && !quizCompleted && (
                        <div className="mt-8">
                            <h3 className="font-bold text-lg mb-4">Contenido del módulo</h3>
                            <ul className="steps steps-vertical lg:steps-horizontal w-full">
                                {sections.map((section, index) => (
                                    <li
                                        key={index}
                                        className={`step ${index <= currentSection ? 'step-primary' : ''} cursor-pointer`}
                                        onClick={() => setCurrentSection(index)}
                                    >
                                        {section.title}
                                    </li>
                                ))}
                                <li className={`step ${quizCompleted ? 'step-primary' : ''}`}>
                                    Evaluación
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-base-200 py-4 text-center text-sm text-base-content/80">
                <div className="container mx-auto px-4">
                    <p>© 2023 Plataforma Educativa de Criptografía - Todos los derechos reservados</p>
                </div>
            </footer>
        </div>
    );
}