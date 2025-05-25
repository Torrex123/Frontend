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
import { FaCheckCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { getChallenges } from "../../../api/api";

const renderIcon = (iconString: string): ReactElement => {
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
    const [filters, setFilters] = useState({
        difficulty: "all",
        category: "all",
        status: "all",
        search: ""
    });
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("newest");

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
        createdAt: string;
        icon: string;
        userStatus: string;
    }
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchChallenges = async () => {

            try {
                const response = await getChallenges();
                console.log("Challenges response:", response);
                if (response.success) {
                    setChallenges(response.data.data);
                    setLoading(false);
                } else {
                    console.error("Error fetching challenges:", response.error);
                }

            } catch (error) {
                console.error("Error fetching challenges:", error);
            }
        }

        fetchChallenges();

    }, []);

    const filteredChallenges = challenges.filter(challenge => {
        if (filters.search && !challenge.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !challenge.description.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        if (filters.difficulty !== "all" && challenge.difficulty !== filters.difficulty) {
            return false;
        }

        if (filters.category !== "all" && challenge.category !== filters.category) {
            return false;
        }

        if (filters.status !== "all" && challenge.status !== filters.status) {
            return false;
        }

        return true;
    });

    const handleBackHome = () => {
        router.push("/home");
    }

    // Sort challenges
    const sortedChallenges = [...filteredChallenges].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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

    function getDifficultyValue(difficulty: string) {
        switch (difficulty) {
            case "principiante": return 1;
            case "intermedio": return 2;
            case "experto": return 3;
            default: return 0;
        }
    }

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

    interface Filters {
        difficulty: string;
        category: string;
        status: string;
        search: string;
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev: Filters) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const clearFilters = () => {
        setFilters({
            difficulty: "all",
            category: "all",
            status: "all",
            search: ""
        });
    };

    const getTotalParticipations = () => {
        return challenges.reduce((total, challenge) => total + challenge.totalAttempts, 0);
    };

    const getTotalCompletions = () => {
        return challenges.reduce((total, challenge) => total + challenge.completions, 0);
    };

    const handleChallengeClick = (challengeID: number) => {
        router.push(`/challenge?id=${encodeURIComponent(challengeID)}`);
    }

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
                            Hay retos para todos los niveles.
                        </p>
                        {/* Back button*/}
                        <button
                            onClick={handleBackHome}
                            className="flex gap-2 btn btn-primary btn-outline m-1 shadow-md text-left px-4 font-medium "
                        >
                            <IoMdArrowRoundBack className="h-5 w-5" />
                            <span>Volver</span>
                        </button>
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
                                                                {new Date(challenge.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span
                                                                className={`badge flex items-center gap-1 
                                                                ${challenge.userStatus === "completado" ? "badge-success" : "badge-neutral"}`}
                                                            >
                                                                <FaCheckCircle className="h-3 w-3" />
                                                                {challenge.userStatus === "completado" ? "Completado" : "No completado"}
                                                            </span>
                                                        </div>

                                                        <div className="card-actions justify-end mt-4">
                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={() => handleChallengeClick(challenge.id)}
                                                            >
                                                                {challenge.userStatus === "no-iniciado"
                                                                    ? "Iniciar desafío"
                                                                    : challenge.userStatus === "en-progreso"
                                                                        ? "Continuar desafío"
                                                                        : "Volver a hacer"
                                                                }
                                                                <FiArrowRight className="ml-2" />
                                                            </button>
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
                                    <h3 className="text-2xl font-bold mb-2">450 puntos</h3>
                                    <div className="badge badge-lg badge-warning">Experto</div>
                                </div>
                            </figure>
                            <div className="card-body lg:w-2/3">
                                <h2 className="card-title text-2xl">Simulación de Man-in-the-Middle</h2>
                                <p className="mb-4">
                                    Aprende cómo funciona un ataque Man-in-the-Middle (MITM) en un entorno controlado. En este desafío práctico, observarás
                                    cómo un atacante puede interceptar y modificar comunicaciones entre dos partes sin ser detectado.
                                </p>
                                <p className="mb-6">
                                    Entenderás los fundamentos de este tipo de ataque, su impacto en la seguridad de las comunicaciones y cómo prevenirlo
                                    usando cifrado y autenticación adecuados.
                                </p>

                                <div className="flex flex-wrap gap-3 mb-6">
                                    <div className="badge badge-outline">Criptografía Aplicada</div>
                                    <div className="badge badge-outline">Seguridad de Red</div>
                                    <div className="badge badge-outline">MITM</div>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center">
                                        <FiClock className="mr-1" />
                                        <span>2 horas estimadas</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiUsers className="mr-1" />
                                        <span>0 completados</span>
                                    </div>
                                </div>

                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary btn-disabled" disabled>
                                        Próximamente
                                        <FiArrowRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
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