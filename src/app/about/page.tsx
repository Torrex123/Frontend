"use client";

import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
    FiBook,
    FiAward,
    FiGithub,
    FiMail,
    FiCalendar,
    FiShield,
} from "react-icons/fi";

export default function About() {
    // Fade-in animation for sections
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestra Historia</h1>
                        <p className="text-base-content/80 max-w-3xl mx-auto text-lg">
                            Descubre cómo nació este proyecto educativo para transformar
                            el aprendizaje de la criptografía en una experiencia dinámica y accesible.
                        </p>
                    </motion.div>

                    {/* Origin */}
                    <motion.div
                        className="card bg-base-100 shadow-xl mb-12 overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="card-body p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="bg-primary/10 p-8 md:w-1/3 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="bg-primary/20 p-6 rounded-full inline-block mb-4">
                                            <FiBook className="w-12 h-12 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Proyecto Académico</h3>
                                        <div className="badge badge-primary">Trabajo Fin de Grado</div>
                                    </div>
                                </div>

                                <div className="p-8 md:w-2/3">
                                    <h2 className="text-2xl font-bold mb-4">Génesis del Proyecto</h2>
                                    <p className="mb-4">
                                        Esta plataforma educativa nació como un Proyecto de Fin de Grado desarrollado por dos estudiantes de la
                                        <span className="font-semibold"> Universidad del Norte </span>, dentro del pregrado en Ingeniería de Sistemas.
                                    </p>
                                    <p className="mb-6">
                                        <span className="font-semibold">Edgar Torres</span> y <span className="font-semibold">Juan Vargas</span>
                                        ,inspirados por sus propias dificultades al aprender estos conceptos complejos,
                                        decidieron crear una solución que transformara el aprendizaje de la criptografía en una experiencia más accesible, interactiva y práctica.
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-2 text-primary" />
                                            <span>Iniciado en 2025</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiAward className="mr-2 text-primary" />
                                            <span>Proyecto Final</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Why criptography? */}
                    <motion.div
                        className="card bg-base-100 shadow-xl mb-12"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4 flex items-center">
                                <FiShield className="mr-2 text-secondary" /> ¿Por qué la Criptografía?
                            </h2>

                            <p className="mb-4">
                                En la era digital actual, la criptografía se ha convertido en la columna vertebral de la seguridad de la información.
                                Va mucho más allá del simple cifrado de mensajes. La criptografía es esencial para:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-base-200/50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Protección de la Privacidad</h3>
                                    <p className="text-base-content/70">
                                        Salvaguardar las comunicaciones personales y la información sensible de miradas indiscretas.
                                    </p>
                                </div>

                                <div className="bg-base-200/50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Comercio Electrónico Seguro</h3>
                                    <p className="text-base-content/70">
                                        Facilitar transacciones financieras seguras y proteger la información de pago.
                                    </p>
                                </div>

                                <div className="bg-base-200/50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Autenticación Digital</h3>
                                    <p className="text-base-content/70">
                                        Verificar identidades en línea y garantizar que los documentos digitales sean auténticos.
                                    </p>
                                </div>

                                <div className="bg-base-200/50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Blockchain y Criptomonedas</h3>
                                    <p className="text-base-content/70">
                                        Sustentar tecnologías emergentes que están transformando industrias enteras.
                                    </p>
                                </div>
                            </div>

                            <p>
                                A pesar de su importancia, la criptografía sigue siendo un campo complejo y, a menudo, inaccesible para muchos.
                                Nuestra plataforma busca cambiar esto, convirtiendo conceptos abstractos en conocimientos prácticos
                                mediante un enfoque interactivo y gamificado.
                            </p>
                        </div>
                    </motion.div>

                    {/* Methodology */}
                    <motion.div
                        className="card bg-base-100 shadow-xl mb-12"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">Nuestra Metodología Educativa</h2>

                            <p className="mb-6">
                                Nuestro enfoque pedagógico combina:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex items-start">
                                    <div className="bg-success/10 p-3 rounded-full mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Aprendizaje Teórico-Práctico</h3>
                                        <p className="text-base-content/70">
                                            Cada concepto teórico va acompañado de ejercicios prácticos que refuerzan el aprendizaje.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-info/10 p-3 rounded-full mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Aprendizaje Progresivo</h3>
                                        <p className="text-base-content/70">
                                            Estructura secuencial que permite dominar conceptos básicos antes de avanzar a temas más complejos.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-warning/10 p-3 rounded-full mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Desafíos</h3>
                                        <p className="text-base-content/70">
                                            Problemas basados en conceptos reales que preparan a los estudiantes para aplicaciones prácticas.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-secondary/10 p-3 rounded-full mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h4M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Editor de código</h3>
                                        <p className="text-base-content/70">
                                            Un entorno interactivo para escribir, probar y analizar algoritmos criptográficos en tiempo real.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* Contribution */}
                    <motion.div
                        className="card bg-primary text-primary-content shadow-xl mb-8"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">¿Quieres contribuir?</h2>
                            <p className="mb-6">
                                Este proyecto es de código abierto.
                                Si deseas contribuir con contenido, correcciones o nuevas funcionalidades, ¡nos encantaría contar contigo!
                            </p>

                            <div className="card-actions justify-end">
                                <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="btn">
                                    <FiGithub className="mr-2" /> Ver en GitHub
                                </a>
                                <a href="mailto:contact@yourproject.com" className="btn btn-outline">
                                    <FiMail className="mr-2" /> Contactar
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-base-300 text-base-content">
                <div>
                    <p className="mt-4">© 2023 CryptoPlayground - Un Proyecto de Fin de Grado de la Universidad del Norte</p>
                </div>
            </footer>
        </div>
    );
}