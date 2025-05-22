"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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
    FiKey,
    FiShield,
    FiCode,
    FiGrid,
    FiActivity,
    FiFileText
} from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import { ReactElement } from "react";

// Function to render the icons dynamically from string representations
interface IconMap {
    [key: string]: ReactElement;
}

const renderIcon = (iconString: string): ReactElement => {
    // This function converts icon strings like "<FiKey className='w-6 h-6' />" to actual JSX
    // A simple approach for demo purposes - in production, you might use a different method
    switch (iconString.replace(/<|className='w-6 h-6' \/>/g, '').trim()) {
        case "FiKey":
            return <FiKey className="w-6 h-6" />;
        case "FiFileText":
            return <FiFileText className="w-6 h-6" />;
        case "FiCode":
            return <FiCode className="w-6 h-6" />;
        case "FiLock":
            return <FiLock className="w-6 h-6" />;
        case "FiGrid":
            return <FiGrid className="w-6 h-6" />;
        case "FiActivity":
            return <FiActivity className="w-6 h-6" />;
        default:
            return <FiKey className="w-6 h-6" />;
    }
};

export default function CryptographyChallenges() {
    // State for filters
    const [filters, setFilters] = useState({
        difficulty: "all",
        category: "all",
        status: "all",
        search: ""
    });

    // State for showing/hiding filters on mobile
    const [showFilters, setShowFilters] = useState(false);

    // State for sorting
    const [sortBy, setSortBy] = useState("newest");

    // Challenge type definition
    interface Challenge {
        id: number;
        title: string;
        description: string;
        difficulty: string;
        category: string;
        completions: number;
        totalAttempts: number;
        points: number;
        timeEstimate: string;
        status: string;
        dateAdded: string;
        icon: string;
    }

    // State for challenges
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    // State for loading
    const [loading, setLoading] = useState(true);

    // Fetch challenges from the database
    useEffect(() => {
        // This would be replaced with actual API call in production
        const fetchChallenges = async () => {
            try {
                setLoading(true);

                // In a real application, you would fetch data from your database
                // const response = await fetch('/api/challenges');
                // const data = await response.json();

                // For now, we'll use the mock data
                const mockChallenges = [
                    {
                        id: 1,
                        title: "Descifrando César",
                        description: "Descifra un mensaje codificado con el cifrado César sin conocer la clave de desplazamiento.",
                        difficulty: "principiante",
                        category: "clasica",
                        completions: 987,
                        totalAttempts: 1456,
                        points: 100,
                        timeEstimate: "30 min",
                        status: "disponible",
                        dateAdded: "2023-06-10",
                        icon: "FiKey",
                    },
                    {
                        id: 2,
                        title: "Verificación de Integridad",
                        description: "Aprende a utilizar funciones hash básicas para verificar la integridad de archivos.",
                        difficulty: "principiante",
                        category: "hash",
                        completions: 765,
                        totalAttempts: 1234,
                        points: 120,
                        timeEstimate: "45 min",
                        status: "disponible",
                        dateAdded: "2023-07-05",
                        icon: "FiFileText",
                    },
                    {
                        id: 3,
                        title: "Ataque al Cifrado Vigenère",
                        description: "Realiza un ataque de frecuencia al cifrado Vigenère para recuperar la clave y el mensaje original.",
                        difficulty: "intermedio",
                        category: "clasica",
                        completions: 432,
                        totalAttempts: 987,
                        points: 250,
                        timeEstimate: "1.5 horas",
                        status: "disponible",
                        dateAdded: "2023-08-12",
                        icon: "FiCode",
                    },
                    {
                        id: 4,
                        title: "Implementación de ChaCha20",
                        description: "Implementa una versión simplificada del algoritmo de cifrado simétrico ChaCha20.",
                        difficulty: "intermedio",
                        category: "simetrica",
                        completions: 289,
                        totalAttempts: 876,
                        points: 280,
                        timeEstimate: "2 horas",
                        status: "disponible",
                        dateAdded: "2023-09-18",
                        icon: "FiLock",
                    },
                    {
                        id: 5,
                        title: "Colisiones en Funciones Hash",
                        description: "Genera colisiones en una función hash debilitada utilizando el ataque del cumpleaños.",
                        difficulty: "experto",
                        category: "hash",
                        completions: 124,
                        totalAttempts: 576,
                        points: 450,
                        timeEstimate: "3 horas",
                        status: "disponible",
                        dateAdded: "2023-10-25",
                        icon: "FiGrid",
                    },
                    {
                        id: 6,
                        title: "Criptoanálisis de Salsa20",
                        description: "Realiza un ataque de canal lateral contra una implementación vulnerable de Salsa20.",
                        difficulty: "experto",
                        category: "simetrica",
                        completions: 78,
                        totalAttempts: 435,
                        points: 500,
                        timeEstimate: "4 horas",
                        status: "disponible",
                        dateAdded: "2023-11-30",
                        icon: "FiActivity",
                    }
                ];

                setChallenges(mockChallenges);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching challenges:", error);
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    // Filter challenges based on selected filters
    const filteredChallenges = challenges.filter(challenge => {
        // Search filter
        if (filters.search && !challenge.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !challenge.description.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // Difficulty filter
        if (filters.difficulty !== "all" && challenge.difficulty !== filters.difficulty) {
            return false;
        }

        // Category filter
        if (filters.category !== "all" && challenge.category !== filters.category) {
            return false;
        }

        // Status filter
        if (filters.status !== "all" && challenge.status !== filters.status) {
            return false;
        }

        return true;
    });

    // Sort challenges
    const sortedChallenges = [...filteredChallenges].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            case "oldest":
                return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
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

    // Helper function to convert difficulty to numeric value for sorting
    function getDifficultyValue(difficulty: string) {
        switch (difficulty) {
            case "principiante": return 1;
            case "intermedio": return 2;
            case "experto": return 3;
            default: return 0;
        }
    }

    // Function to get difficulty badge
    const getDifficultyBadge = (difficulty: string) => {
        switch (difficulty) {
            case "principiante":
                return <span className="badge badge-success badge-sm">Principiante</span>;
            case "intermedio":
                return <span className="badge badge-info badge-sm">Intermedio</span>;
            case "experto":
                return <span className="badge badge-error badge-sm">Experto</span>;
            default:
                return null;
        }
    };

    // Function to get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completado":
                return <FiCheckCircle className="text-success" />;
            case "en-progreso":
                return <FiClock className="text-warning" />;
            default:
                return null;
        }
    };

    // Handle filter changes
    interface FilterChangeEvent extends React.ChangeEvent<HTMLSelectElement> {}

    interface Filters {
        difficulty: string;
        category: string;
        status: string;
        search: string;
    }

    const handleFilterChange = (e: FilterChangeEvent) => {
        const { name, value } = e.target;
        setFilters((prev: Filters) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle search changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    // Handle sort changes
    const handleSortChange = (e: FilterChangeEvent) => {
        setSortBy(e.target.value);
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            difficulty: "all",
            category: "all",
            status: "all",
            search: ""
        });
    };

    // Get total participation count across all challenges
    const getTotalParticipations = () => {
        return challenges.reduce((total, challenge) => total + challenge.totalAttempts, 0);
    };

    // Get total completions across all challenges
    const getTotalCompletions = () => {
        return challenges.reduce((total, challenge) => total + challenge.completions, 0);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">Desafíos de Criptografía</h1>
                        <p className="text-base-content/70 max-w-2xl mx-auto">
                            Pon a prueba tus conocimientos con nuestra colección de desafíos criptográficos.
                            Desde cifrados clásicos hasta criptografía cuántica, hay retos para todos los niveles.
                        </p>
                    </div>

                    {/* Statistics */}
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
                            <div className="stat-value text-secondary">{loading ? "..." : getTotalParticipations()}</div>
                            <div className="stat-desc">↗︎ 14% más que el mes pasado</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <FaTrophy className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Completados</div>
                            <div className="stat-value text-accent">{loading ? "..." : getTotalCompletions()}</div>
                            <div className="stat-desc">Soluciones enviadas</div>
                        </div>
                    </div>

                    {/* Search bar and filters for mobile */}
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
                                        <option value="principiante">Principiante</option>
                                        <option value="intermedio">Intermedio</option>
                                        <option value="experto">Experto</option>
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
                                        <option value="clasica">Criptografía Clásica</option>
                                        <option value="simetrica">Criptografía Simétrica</option>
                                        <option value="hash">Funciones Hash</option>
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
                        {/* Filters for desktop */}
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
                                            <option value="principiante">Principiante</option>
                                            <option value="intermedio">Intermedio</option>
                                            <option value="experto">Experto</option>
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
                                            <option value="clasica">Criptografía Clásica</option>
                                            <option value="simetrica">Criptografía Simétrica</option>
                                            <option value="hash">Funciones Hash</option>
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

                        {/* Challenges list */}
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

                            {loading ? (
                                // Loading state
                                <div className="flex justify-center items-center py-12">
                                    <div className="loading loading-spinner loading-lg"></div>
                                </div>
                            ) : filteredChallenges.length === 0 ? (
                                // No results state
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
                                // Challenge cards
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
                                                    {/* Icon and difficulty */}
                                                    <div className={`p-6 flex flex-col items-center justify-center md:w-48 ${challenge.difficulty === "principiante"
                                                            ? "bg-success/10"
                                                            : challenge.difficulty === "intermedio"
                                                                ? "bg-info/10"
                                                                : "bg-error/10"
                                                        }`}>
                                                        <div className={`p-4 rounded-full mb-3 ${challenge.difficulty === "principiante"
                                                                ? "bg-success/20 text-success"
                                                                : challenge.difficulty === "intermedio"
                                                                    ? "bg-info/20 text-info"
                                                                    : "bg-error/20 text-error"
                                                            }`}>
                                                            {renderIcon(challenge.icon)}
                                                        </div>
                                                        {getDifficultyBadge(challenge.difficulty)}
                                                        <div className="mt-3 text-center">
                                                            <div className="font-bold">{challenge.points}</div>
                                                            <div className="text-xs text-base-content/70">puntos</div>
                                                        </div>
                                                    </div>

                                                    {/* Main content */}
                                                    <div className="flex-1 p-6">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="card-title text-xl mb-2 flex items-center">
                                                                {challenge.title}
                                                                {challenge.status === "completado" && (
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
                                                                {challenge.category === "clasica"
                                                                    ? "Criptografía Clásica"
                                                                    : challenge.category === "simetrica"
                                                                        ? "Criptografía Simétrica"
                                                                        : "Funciones Hash"}
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
                                                            {challenge.status === "completado" ? (
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

                            {/* Pagination */}
                            {!loading && filteredChallenges.length > 0 && (
                                <div className="flex justify-center mt-8">
                                    <div className="btn-group">
                                        <button className="btn btn-outline">«</button>
                                        <button className="btn btn-outline btn-active">1</button>
                                        <button className="btn btn-outline">»</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Featured challenge section */}
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
                                <h2 className="card-title text-2xl">Criptoanálisis de Salsa20</h2>
                                <p className="mb-4">
                                    Sumérgete en el fascinante mundo de la criptografía simétrica moderna. En este desafío, realizarás un ataque
                                    de canal lateral contra una implementación vulnerable del algoritmo Salsa20.
                                </p>
                                <p className="mb-6">
                                    Aprenderás sobre los principios de los ataques de tiempo y cómo las implementaciones incorrectas pueden
                                    comprometer incluso los algoritmos más seguros desde el punto de vista teórico.
                                </p>

                                <div className="flex flex-wrap gap-3 mb-6">
                                    <div className="badge badge-outline">Criptografía Simétrica</div>
                                    <div className="badge badge-outline">Análisis de Seguridad</div>
                                    <div className="badge badge-outline">Ataque de Canal Lateral</div>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center">
                                        <FiClock className="mr-1" />
                                        <span>4 horas estimadas</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiUsers className="mr-1" />
                                        <span>78 completados</span>
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

                    {/* Help section */}
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