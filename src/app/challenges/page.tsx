"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
    FiLock,
    FiAward,
    FiClock,
    FiFilter,
    FiCheckCircle,
    FiStar,
    FiUsers,
    FiCalendar,
    FiSearch,
    FiChevronDown,
    FiChevronUp,
    FiArrowRight,
    FiCpu,
    FiKey,
    FiShield,
    FiCode,
    FiHash,
    FiDatabase
} from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

import { motion } from "framer-motion";

export default function CryptographyChallenges() {
    // Estado para los filtros
    const [filters, setFilters] = useState({
        difficulty: "all",
        category: "all",
        status: "all",
        search: ""
    });

    // Estado para mostrar/ocultar filtros en móvil
    const [showFilters, setShowFilters] = useState(false);

    // Estado para ordenar
    const [sortBy, setSortBy] = useState("newest");

    // Mock de datos de desafíos
    const [challenges, setChallenges] = useState([
        {
            id: 1,
            title: "Caesar Cipher Breaker",
            description: "Break a message encrypted with the Caesar cipher without knowing the key.",
            difficulty: "beginner",
            category: "classical",
            completions: 1245,
            totalAttempts: 2890,
            points: 100,
            timeEstimate: "30 min",
            status: "completed",
            dateAdded: "2023-04-15",
            icon: <FiKey className="w-6 h-6" />
        },
        {
            id: 2,
            title: "AES Key Recovery",
            description: "Recover an AES encryption key from a series of plaintext-ciphertext pairs.",
            difficulty: "advanced",
            category: "symmetric",
            completions: 342,
            totalAttempts: 1567,
            points: 350,
            timeEstimate: "2 hours",
            status: "available",
            dateAdded: "2023-04-28",
            icon: <FiLock className="w-6 h-6" />
        },
        {
            id: 3,
            title: "Hash Collision Finder",
            description: "Find a collision in a simplified hash function to understand vulnerability concepts.",
            difficulty: "intermediate",
            category: "hashing",
            completions: 567,
            totalAttempts: 1298,
            points: 200,
            timeEstimate: "1 hour",
            status: "available",
            dateAdded: "2023-05-10",
            icon: <FiHash className="w-6 h-6" />
        },
        {
            id: 4,
            title: "RSA Factorization Challenge",
            description: "Factor a small RSA modulus to recover the private key and decrypt a message.",
            difficulty: "advanced",
            category: "asymmetric",
            completions: 189,
            totalAttempts: 876,
            points: 400,
            timeEstimate: "3 hours",
            status: "available",
            dateAdded: "2023-05-22",
            icon: <FiShield className="w-6 h-6" />
        },
        {
            id: 5,
            title: "Vigenère Cipher Analysis",
            description: "Determine the key length and break a Vigenère cipher using frequency analysis.",
            difficulty: "intermediate",
            category: "classical",
            completions: 678,
            totalAttempts: 1432,
            points: 250,
            timeEstimate: "1.5 hours",
            status: "completed",
            dateAdded: "2023-06-05",
            icon: <FiKey className="w-6 h-6" />
        },
        {
            id: 6,
            title: "Secure Password Storage",
            description: "Implement a secure password storage system using salting and hashing.",
            difficulty: "intermediate",
            category: "authentication",
            completions: 432,
            totalAttempts: 987,
            points: 250,
            timeEstimate: "1.5 hours",
            status: "available",
            dateAdded: "2023-06-18",
            icon: <FiDatabase className="w-6 h-6" />
        },
        {
            id: 7,
            title: "Elliptic Curve Point Multiplication",
            description: "Implement efficient point multiplication on an elliptic curve for cryptographic applications.",
            difficulty: "expert",
            category: "asymmetric",
            completions: 98,
            totalAttempts: 543,
            points: 500,
            timeEstimate: "4 hours",
            status: "available",
            dateAdded: "2023-07-01",
            icon: <FiCpu className="w-6 h-6" />
        },
        {
            id: 8,
            title: "Padding Oracle Attack",
            description: "Exploit a padding oracle vulnerability to decrypt a message without knowing the key.",
            difficulty: "advanced",
            category: "attacks",
            completions: 156,
            totalAttempts: 789,
            points: 400,
            timeEstimate: "3 hours",
            status: "available",
            dateAdded: "2023-07-14",
            icon: <FiCode className="w-6 h-6" />
        },
        {
            id: 9,
            title: "One-Time Pad Implementation",
            description: "Implement a secure one-time pad system and understand its perfect secrecy properties.",
            difficulty: "beginner",
            category: "symmetric",
            completions: 876,
            totalAttempts: 1345,
            points: 150,
            timeEstimate: "45 min",
            status: "completed",
            dateAdded: "2023-07-27",
            icon: <FiLock className="w-6 h-6" />
        },
        {
            id: 10,
            title: "Digital Signature Verification",
            description: "Implement and verify digital signatures using RSA and understand their security properties.",
            difficulty: "intermediate",
            category: "asymmetric",
            completions: 345,
            totalAttempts: 876,
            points: 300,
            timeEstimate: "2 hours",
            status: "available",
            dateAdded: "2023-08-09",
            icon: <FiShield className="w-6 h-6" />
        },
        {
            id: 11,
            title: "Blockchain Proof-of-Work",
            description: "Implement a simple proof-of-work algorithm similar to what Bitcoin uses.",
            difficulty: "advanced",
            category: "blockchain",
            completions: 234,
            totalAttempts: 678,
            points: 350,
            timeEstimate: "2.5 hours",
            status: "available",
            dateAdded: "2023-08-22",
            icon: <FiDatabase className="w-6 h-6" />
        },
        {
            id: 12,
            title: "Homomorphic Encryption Basics",
            description: "Implement a simple homomorphic encryption scheme and perform operations on encrypted data.",
            difficulty: "expert",
            category: "advanced-concepts",
            completions: 87,
            totalAttempts: 432,
            points: 500,
            timeEstimate: "4 hours",
            status: "available",
            dateAdded: "2023-09-04",
            icon: <FiCpu className="w-6 h-6" />
        },
        {
            id: 13,
            title: "Substitution Cipher Solver",
            description: "Create an algorithm to automatically solve simple substitution ciphers.",
            difficulty: "intermediate",
            category: "classical",
            completions: 456,
            totalAttempts: 987,
            points: 250,
            timeEstimate: "1.5 hours",
            status: "available",
            dateAdded: "2023-09-17",
            icon: <FiKey className="w-6 h-6" />
        },
        {
            id: 14,
            title: "Side-Channel Attack Simulation",
            description: "Simulate a timing attack against a naive implementation of RSA.",
            difficulty: "advanced",
            category: "attacks",
            completions: 123,
            totalAttempts: 567,
            points: 400,
            timeEstimate: "3 hours",
            status: "available",
            dateAdded: "2023-09-30",
            icon: <FiCode className="w-6 h-6" />
        },
        {
            id: 15,
            title: "Zero-Knowledge Proof Implementation",
            description: "Implement a simple zero-knowledge proof protocol to prove knowledge without revealing it.",
            difficulty: "expert",
            category: "advanced-concepts",
            completions: 76,
            totalAttempts: 345,
            points: 500,
            timeEstimate: "4 hours",
            status: "available",
            dateAdded: "2023-10-13",
            icon: <FiShield className="w-6 h-6" />
        },
        {
            id: 16,
            title: "Secure Random Number Generation",
            description: "Implement and test a cryptographically secure random number generator.",
            difficulty: "intermediate",
            category: "foundations",
            completions: 345,
            totalAttempts: 789,
            points: 250,
            timeEstimate: "1.5 hours",
            status: "available",
            dateAdded: "2023-10-26",
            icon: <FiHash className="w-6 h-6" />
        },
        {
            id: 17,
            title: "TLS Handshake Analysis",
            description: "Analyze a TLS handshake and identify the cryptographic operations involved.",
            difficulty: "intermediate",
            category: "protocols",
            completions: 234,
            totalAttempts: 654,
            points: 300,
            timeEstimate: "2 hours",
            status: "available",
            dateAdded: "2023-11-08",
            icon: <FiLock className="w-6 h-6" />
        },
        {
            id: 18,
            title: "Quantum Key Distribution Simulation",
            description: "Simulate the BB84 quantum key distribution protocol and understand its security properties.",
            difficulty: "expert",
            category: "quantum",
            completions: 65,
            totalAttempts: 321,
            points: 500,
            timeEstimate: "4 hours",
            status: "available",
            dateAdded: "2023-11-21",
            icon: <FiCpu className="w-6 h-6" />
        },
        {
            id: 19,
            title: "Password Cracking Challenge",
            description: "Crack a series of increasingly difficult password hashes using various techniques.",
            difficulty: "intermediate",
            category: "authentication",
            completions: 432,
            totalAttempts: 876,
            points: 300,
            timeEstimate: "2 hours",
            status: "available",
            dateAdded: "2023-12-04",
            icon: <FiKey className="w-6 h-6" />
        },
        {
            id: 20,
            title: "Secure Multi-Party Computation",
            description: "Implement a simple secure multi-party computation protocol for privacy-preserving calculations.",
            difficulty: "expert",
            category: "advanced-concepts",
            completions: 54,
            totalAttempts: 298,
            points: 500,
            timeEstimate: "4 hours",
            status: "available",
            dateAdded: "2023-12-17",
            icon: <FiShield className="w-6 h-6" />
        }
    ]);

    // Filtrar desafíos basados en los filtros seleccionados
    const filteredChallenges = challenges.filter(challenge => {
        // Filtro de búsqueda
        if (filters.search && !challenge.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !challenge.description.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // Filtro de dificultad
        if (filters.difficulty !== "all" && challenge.difficulty !== filters.difficulty) {
            return false;
        }

        // Filtro de categoría
        if (filters.category !== "all" && challenge.category !== filters.category) {
            return false;
        }

        // Filtro de estado
        if (filters.status !== "all" && challenge.status !== filters.status) {
            return false;
        }

        return true;
    });

    // Ordenar desafíos
    const sortedChallenges = [...filteredChallenges].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            case "oldest":
                return new Date(a.dateAdded) - new Date(b.dateAdded);
            case "easiest":
                return getDifficultyValue(a.difficulty) - getDifficultyValue(b.difficulty);
            case "hardest":
                return getDifficultyValue(b.difficulty) - getDifficultyValue(a.difficulty);
            case "popular":
                return b.completions - a.completions;
            default:
                return 0;
        }
    });

    // Función auxiliar para convertir dificultad a valor numérico para ordenar
    function getDifficultyValue(difficulty) {
        switch (difficulty) {
            case "beginner": return 1;
            case "intermediate": return 2;
            case "advanced": return 3;
            case "expert": return 4;
            default: return 0;
        }
    }

    // Función para obtener la etiqueta de dificultad
    const getDifficultyBadge = (difficulty) => {
        switch (difficulty) {
            case "beginner":
                return <span className="badge badge-success badge-sm">Principiante</span>;
            case "intermediate":
                return <span className="badge badge-info badge-sm">Intermedio</span>;
            case "advanced":
                return <span className="badge badge-warning badge-sm">Avanzado</span>;
            case "expert":
                return <span className="badge badge-error badge-sm">Experto</span>;
            default:
                return null;
        }
    };

    // Función para obtener el icono de estado
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <FiCheckCircle className="text-success" />;
            case "in-progress":
                return <FiClock className="text-warning" />;
            default:
                return null;
        }
    };

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar cambios en la búsqueda
    const handleSearchChange = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    // Manejar cambios en el ordenamiento
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    // Limpiar todos los filtros
    const clearFilters = () => {
        setFilters({
            difficulty: "all",
            category: "all",
            status: "all",
            search: ""
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {/* Encabezado */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">Desafíos de Criptografía</h1>
                        <p className="text-base-content/70 max-w-2xl mx-auto">
                            Pon a prueba tus conocimientos con nuestra colección de desafíos criptográficos.
                            Desde cifrados clásicos hasta criptografía cuántica, hay retos para todos los niveles.
                        </p>
                    </div>

                    {/* Estadísticas */}
                    <div className="stats shadow w-full mb-8">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <FiAward className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Total de Desafíos</div>
                            <div className="stat-value text-primary">{challenges.length}</div>
                            <div className="stat-desc">Desde principiante hasta experto</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <FiUsers className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Participantes</div>
                            <div className="stat-value text-secondary">2,845</div>
                            <div className="stat-desc">↗︎ 14% más que el mes pasado</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <FaTrophy className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Completados</div>
                            <div className="stat-value text-accent">12,456</div>
                            <div className="stat-desc">Soluciones enviadas</div>
                        </div>
                    </div>

                    {/* Barra de búsqueda y filtros para móvil */}
                    <div className="flex flex-col md:hidden mb-6 gap-4">
                        <div className="form-control">
                            <div className="input-group w-full">
                                <input
                                    type="text"
                                    placeholder="Buscar desafíos..."
                                    className="input input-bordered w-full"
                                    value={filters.search}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-square">
                                    <FiSearch className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <button
                            className="btn btn-outline w-full flex justify-between items-center"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <span className="flex items-center">
                                <FiFilter className="mr-2" /> Filtros
                            </span>
                            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {showFilters && (
                            <div className="card bg-base-100 shadow-xl p-4 mt-2">
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Dificultad</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        name="difficulty"
                                        value={filters.difficulty}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">Todas las dificultades</option>
                                        <option value="all">Todas las dificultades</option>
                                        <option value="beginner">Principiante</option>
                                        <option value="intermediate">Intermedio</option>
                                        <option value="advanced">Avanzado</option>
                                        <option value="expert">Experto</option>
                                    </select>
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Categoría</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">Todas las categorías</option>
                                        <option value="classical">Criptografía Clásica</option>
                                        <option value="symmetric">Criptografía Simétrica</option>
                                        <option value="asymmetric">Criptografía Asimétrica</option>
                                        <option value="hashing">Funciones Hash</option>
                                        <option value="authentication">Autenticación</option>
                                        <option value="protocols">Protocolos</option>
                                        <option value="blockchain">Blockchain</option>
                                        <option value="quantum">Criptografía Cuántica</option>
                                        <option value="attacks">Ataques Criptográficos</option>
                                        <option value="advanced-concepts">Conceptos Avanzados</option>
                                        <option value="foundations">Fundamentos</option>
                                    </select>
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Estado</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="available">Disponible</option>
                                        <option value="completed">Completado</option>
                                        <option value="in-progress">En progreso</option>
                                    </select>
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Ordenar por</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={sortBy}
                                        onChange={handleSortChange}
                                    >
                                        <option value="newest">Más recientes</option>
                                        <option value="oldest">Más antiguos</option>
                                        <option value="easiest">Más fáciles primero</option>
                                        <option value="hardest">Más difíciles primero</option>
                                        <option value="popular">Más populares</option>
                                    </select>
                                </div>

                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={clearFilters}
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Filtros para escritorio */}
                        <div className="hidden md:block w-64 flex-shrink-0">
                            <div className="card bg-base-100 shadow-xl sticky top-4">
                                <div className="card-body">
                                    <h2 className="card-title text-xl flex items-center">
                                        <FiFilter className="mr-2" /> Filtros
                                    </h2>

                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Buscar</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Buscar desafíos..."
                                            className="input input-bordered w-full"
                                            value={filters.search}
                                            onChange={handleSearchChange}
                                        />
                                    </div>

                                    <div className="divider my-2"></div>

                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Dificultad</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            name="difficulty"
                                            value={filters.difficulty}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="all">Todas las dificultades</option>
                                            <option value="beginner">Principiante</option>
                                            <option value="intermediate">Intermedio</option>
                                            <option value="advanced">Avanzado</option>
                                            <option value="expert">Experto</option>
                                        </select>
                                    </div>

                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Categoría</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            name="category"
                                            value={filters.category}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="all">Todas las categorías</option>
                                            <option value="classical">Criptografía Clásica</option>
                                            <option value="symmetric">Criptografía Simétrica</option>
                                            <option value="asymmetric">Criptografía Asimétrica</option>
                                            <option value="hashing">Funciones Hash</option>
                                            <option value="authentication">Autenticación</option>
                                            <option value="protocols">Protocolos</option>
                                            <option value="blockchain">Blockchain</option>
                                            <option value="quantum">Criptografía Cuántica</option>
                                            <option value="attacks">Ataques Criptográficos</option>
                                            <option value="advanced-concepts">Conceptos Avanzados</option>
                                            <option value="foundations">Fundamentos</option>
                                        </select>
                                    </div>

                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Estado</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            name="status"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="all">Todos los estados</option>
                                            <option value="available">Disponible</option>
                                            <option value="completed">Completado</option>
                                            <option value="in-progress">En progreso</option>
                                        </select>
                                    </div>

                                    <div className="divider my-2"></div>

                                    <div className="form-control mb-4">
                                        <label className="label">
                                            <span className="label-text">Ordenar por</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={sortBy}
                                            onChange={handleSortChange}
                                        >
                                            <option value="newest">Más recientes</option>
                                            <option value="oldest">Más antiguos</option>
                                            <option value="easiest">Más fáciles primero</option>
                                            <option value="hardest">Más difíciles primero</option>
                                            <option value="popular">Más populares</option>
                                        </select>
                                    </div>

                                    <button
                                        className="btn btn-outline w-full"
                                        onClick={clearFilters}
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Lista de desafíos */}
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    {filteredChallenges.length} {filteredChallenges.length === 1 ? 'Desafío' : 'Desafíos'} encontrados
                                </h2>

                                <div className="hidden md:block">
                                    <select
                                        className="select select-bordered select-sm"
                                        value={sortBy}
                                        onChange={handleSortChange}
                                    >
                                        <option value="newest">Más recientes</option>
                                        <option value="oldest">Más antiguos</option>
                                        <option value="easiest">Más fáciles primero</option>
                                        <option value="hardest">Más difíciles primero</option>
                                        <option value="popular">Más populares</option>
                                    </select>
                                </div>
                            </div>

                            {filteredChallenges.length === 0 ? (
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body items-center text-center py-12">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="text-xl font-bold mb-2">No se encontraron desafíos</h3>
                                        <p className="text-base-content/70 mb-4">
                                            No hay desafíos que coincidan con tus filtros actuales.
                                        </p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={clearFilters}
                                        >
                                            Limpiar filtros
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {sortedChallenges.map((challenge) => (
                                        <motion.div
                                            key={challenge.id}
                                            className="card bg-base-100 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <div className="card-body p-0">
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Icono y dificultad */}
                                                    <div className={`p-6 flex flex-col items-center justify-center md:w-48 ${challenge.difficulty === "beginner"
                                                            ? "bg-success/10"
                                                            : challenge.difficulty === "intermediate"
                                                                ? "bg-info/10"
                                                                : challenge.difficulty === "advanced"
                                                                    ? "bg-warning/10"
                                                                    : "bg-error/10"
                                                        }`}>
                                                        <div className={`p-4 rounded-full mb-3 ${challenge.difficulty === "beginner"
                                                                ? "bg-success/20 text-success"
                                                                : challenge.difficulty === "intermediate"
                                                                    ? "bg-info/20 text-info"
                                                                    : challenge.difficulty === "advanced"
                                                                        ? "bg-warning/20 text-warning"
                                                                        : "bg-error/20 text-error"
                                                            }`}>
                                                            {challenge.icon}
                                                        </div>
                                                        {getDifficultyBadge(challenge.difficulty)}
                                                        <div className="mt-3 text-center">
                                                            <div className="font-bold">{challenge.points}</div>
                                                            <div className="text-xs text-base-content/70">puntos</div>
                                                        </div>
                                                    </div>

                                                    {/* Contenido principal */}
                                                    <div className="flex-1 p-6">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="card-title text-xl mb-2 flex items-center">
                                                                {challenge.title}
                                                                {challenge.status === "completed" && (
                                                                    <span className="ml-2 text-success">
                                                                        <FiCheckCircle />
                                                                    </span>
                                                                )}
                                                            </h3>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-base-content/70 flex items-center">
                                                                    <FiClock className="mr-1" />
                                                                    {challenge.timeEstimate}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <p className="text-base-content/70 mb-4">{challenge.description}</p>

                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            <span className="badge">
                                                                {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1).replace('-', ' ')}
                                                            </span>
                                                            <span className="badge badge-outline flex items-center gap-1">
                                                                <FiUsers className="h-3 w-3" />
                                                                {challenge.completions} completados
                                                            </span>
                                                            <span className="badge badge-outline flex items-center gap-1">
                                                                <FiCalendar className="h-3 w-3" />
                                                                {new Date(challenge.dateAdded).toLocaleDateString()}
                                                            </span>
                                                        </div>

                                                        <div className="card-actions justify-end mt-4">
                                                            {challenge.status === "completed" ? (
                                                                <button className="btn btn-outline">
                                                                    Ver solución
                                                                </button>
                                                            ) : (
                                                                <button className="btn btn-primary">
                                                                    Iniciar desafío
                                                                    <FiArrowRight className="ml-2" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Paginación */}
                            <div className="flex justify-center mt-8">
                                <div className="btn-group">
                                    <button className="btn btn-outline">«</button>
                                    <button className="btn btn-outline btn-active">1</button>
                                    <button className="btn btn-outline">2</button>
                                    <button className="btn btn-outline">3</button>
                                    <button className="btn btn-outline">»</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de desafío destacado */}
                    <div className="mt-12 mb-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <FiStar className="text-warning mr-2" /> Desafío Destacado
                        </h2>

                        <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden">
                            <figure className="lg:w-1/3 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="p-6 rounded-full bg-primary/10 inline-block mb-4">
                                        <FiShield className="w-16 h-16 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">500 puntos</h3>
                                    <div className="badge badge-lg badge-error">Experto</div>
                                </div>
                            </figure>
                            <div className="card-body lg:w-2/3">
                                <h2 className="card-title text-2xl">Quantum Key Distribution Simulation</h2>
                                <p className="mb-4">
                                    Sumérgete en el fascinante mundo de la criptografía cuántica. En este desafío, simularás el protocolo BB84 para la distribución cuántica de claves y comprenderás por qué es teóricamente inmune a los ataques de interceptación.
                                </p>
                                <p className="mb-6">
                                    Aprenderás sobre los principios de la mecánica cuántica que hacen posible este protocolo y cómo se puede utilizar para detectar la presencia de un espía en el canal de comunicación.
                                </p>

                                <div className="flex flex-wrap gap-3 mb-6">
                                    <div className="badge badge-outline">Criptografía Cuántica</div>
                                    <div className="badge badge-outline">Seguridad Teórica</div>
                                    <div className="badge badge-outline">Protocolo BB84</div>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center">
                                        <FiClock className="mr-1" />
                                        <span>4 horas estimadas</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiUsers className="mr-1" />
                                        <span>65 completados</span>
                                    </div>
                                </div>

                                <div className="card-actions justify-end">
                                    <button className="btn btn-outline">Más información</button>
                                    <button className="btn btn-primary">
                                        Aceptar desafío
                                        <FiArrowRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de ayuda */}
                    <div className="alert shadow-lg mb-8">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h3 className="font-bold">¿Necesitas ayuda?</h3>
                                <div className="text-sm">
                                    Si te quedas atascado en un desafío, puedes consultar las pistas o unirte a nuestro foro de discusión.
                                </div>
                            </div>
                        </div>
                        <div className="flex-none">
                            <button className="btn btn-sm btn-ghost">Foro</button>
                            <button className="btn btn-sm btn-primary">Recursos</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p>© 2023 CryptoLearn - Desafíos actualizados mensualmente</p>
                </div>
            </footer>
        </div>
    );
}