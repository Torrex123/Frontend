"use client";
import { useState, useEffect, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import {
    FiBook,
    FiAward,
    FiClock,
    FiLock,
    FiShield,
    FiKey,
    FiCode,
    FiServer,
    FiCpu,
    FiCheckCircle,
    FiPlayCircle,
    FiArrowRight,
    FiBarChart2,
    FiBookmark,
    FiTrendingUp,
    FiSettings,
    FiUser,
    FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { loadUserHome, fetchUserProfile } from "../../../api/api";
import useAuth from "../hooks/UseAuth";

type Module = {
    id: string;
    title: string;
    description: string;
    status: string;
    level: string;
    duration: string;
    progress: number;
    icon?: ReactNode;
};

export default function UserHome() {
    const [modules, setModules] = useState<Module[]>([]);
    const [userData, setUserData] = useState({
        username: "",
        profileImage: "",
        level: "Principiante",
        achievements: [],
        streaks: 0,
        globalProgress: 0,
        createdAt: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useAuth();

    const moduleIcons = {
        fundamentals: <FiBook className="w-6 h-6" />,
        classical: <FiKey className="w-6 h-6" />,
        symmetric: <FiLock className="w-6 h-6" />,
        asymmetric: <FiShield className="w-6 h-6" />,
        hashing: <FiCode className="w-6 h-6" />,
        protocols: <FiServer className="w-6 h-6" />,
        blockchain: <FiCpu className="w-6 h-6" />
    };

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        const fetchModuleData = async () => {
            setIsLoading(true);
            try {
                const modulesResponse = await loadUserHome();
                console.log("Modules Response:", modulesResponse);
                if (modulesResponse) {
                    const modulesWithIcons = modulesResponse.data.data.map((module: { id: string; }) => ({
                        ...module,
                        icon: moduleIcons[module.id as keyof typeof moduleIcons] || <FiBook className="w-6 h-6" />
                    }));
                    setModules(modulesWithIcons);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchUserData = async () => {
            try {
                const userResponse = await fetchUserProfile();
                console.log("User Response:", userResponse);
                if (userResponse) {
                    setUserData({
                        username: userResponse.data.data.username,
                        profileImage: userResponse.data.data.profileImage,
                        level: userResponse.data.data.level,
                        achievements: userResponse.data.data.achievements,
                        streaks: userResponse.data.data.streaks,
                        globalProgress: userResponse.data.data.globalProgress,
                        createdAt: userResponse.data.data.createdAt,
                    });
                }
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        }

        fetchModuleData();
        fetchUserData();

    }, []);

    // Time-based greeting
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Buenos días");
        else if (hour < 18) setGreeting("Buenas tardes");
        else setGreeting("Buenas noches");
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completado":
                return <span className="badge badge-success">Completado</span>;
            case "en-progreso":
                return <span className="badge badge-info">En Progreso</span>;
            case "no-iniciado":
                return <span className="badge badge-outline">No Iniciado</span>;
            case "bloqueado":
                return <span className="badge badge-outline">Bloqueado</span>;
            default:
                return <span className="badge badge-outline">No Iniciado</span>;
        }
    };

    const getLevelBadge = (level: string | number | bigint | boolean | ReactElement<unknown, string> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string > | Iterable<ReactNode> | null | undefined> | null | undefined) => {
        switch (level) {
            case "Principiante":
                return <span className="badge badge-primary badge-sm">Principiante</span>;
            case "Intermedio":
                return <span className="badge badge-secondary badge-sm">Intermedio</span>;
            case "Avanzado":
                return <span className="badge badge-accent badge-sm">Avanzado</span>;
            default:
                return <span className="badge badge-primary badge-sm">{level}</span>;
        }
    };

    // Calculate completed modules
    const completedModules = modules.filter(module => module.status === "completado").length;

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-base-200">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4">Cargando tu dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-base-200">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Acceso Denegado</h1>
                    <p className="mt-4">Por favor, inicia sesión para acceder a tu dashboard.</p>
                    <Link href="/" className="btn btn-primary mt-4">Iniciar Sesión</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section with Profile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="card bg-base-100 shadow-xl mb-8 overflow-hidden"
                    >
                        <div className="relative">
                            <div className="h-28 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"></div>
                            <div className="absolute top-14 left-8">
                                <div className="avatar">
                                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-lg overflow-hidden">
                                        {userData.profileImage ? (
                                            <img
                                                src={userData.profileImage}
                                                alt={userData.username}
                                                className="w-24 h-24 object-cover rounded-full"
                                            />
                                        ) : (
                                            <div className="bg-primary/20 w-full h-full flex items-center justify-center">
                                                <FiUser className="w-10 h-10 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body pt-14 sm:pt-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="sm:ml-24 md:ml-28">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h1 className="text-3xl font-bold">{greeting}, {userData.username}!</h1>
                                        {getLevelBadge(userData.level)}
                                    </div>
                                    <p className="text-base-content/70 max-w-md">
                                        Bienvenido de nuevo a tu viaje de aprendizaje en criptografía.
                                        {userData.streaks > 0 && <span className="font-medium"> ¡Llevas {userData.streaks} días seguidos aprendiendo!</span>}
                                    </p>
                                    <div className="mt-2 text-sm text-base-content/60 flex items-center">
                                        <FiCalendar className="mr-1" />
                                        Miembro desde {new Date(userData.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                    <Link href="/settings" className="btn btn-sm btn-outline gap-2">
                                        <FiSettings className="w-4 h-4" />
                                        Perfil
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {userData.streaks >= 7 && (
                            <div className="bg-gradient-to-r from-warning/20 to-warning/10 p-2 px-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FiTrendingUp className="text-warning" />
                                    <span className="text-sm font-medium">¡Racha imparable de {userData.streaks} días!</span>
                                </div>
                                <div className="badge badge-warning">+ 50 XP diarios</div>
                            </div>
                        )}
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="mb-8"
                    >
                        <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
                            <div className="stat">
                                <div className="stat-figure text-primary">
                                    <FiAward className="w-6 h-6" />
                                </div>
                                <div className="stat-title">Nivel</div>
                                <div className="stat-value text-primary">{userData.level}</div>
                                <div className="stat-desc">Sigue aprendiendo para avanzar</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    <FiTrendingUp className="w-6 h-6" />
                                </div>
                                <div className="stat-title">Racha</div>
                                <div className="stat-value text-secondary">{userData.streaks} días</div>
                                <div className="stat-desc">¡Mantén tu racha diaria!</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-accent">
                                    <FiBarChart2 className="w-6 h-6" />
                                </div>
                                <div className="stat-title">Progreso Global</div>
                                <div className="stat-value text-accent">{userData.globalProgress}%</div>
                                <div className="stat-desc">
                                    {completedModules} de {modules.length} módulos completados
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Achievements Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="card bg-base-100 shadow-xl mb-8"
                    >
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">
                                <FiAward className="mr-2" />
                                Tus Logros
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {userData.achievements && userData.achievements.length > 0 ? (
                                    userData.achievements.map((achievement, index) => (
                                        <div key={index} className="badge badge-lg gap-2 p-3 bg-base-200 shadow-sm hover:bg-primary hover:text-primary-content transition-colors duration-300">
                                            <FiAward className="h-4 w-4" />
                                            {achievement}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-base-content/70">
                                        Aún no has desbloqueado ningún logro. ¡Completa módulos para ganar insignias!
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="card bg-base-100 shadow-xl mb-8"
                    >
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">
                                <FiBarChart2 className="mr-2" />
                                Tu Progreso de Aprendizaje
                            </h2>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="mb-2 flex justify-between items-center">
                                        <span className="text-sm font-medium">Progreso Global</span>
                                        <span className="text-sm font-medium">{userData.globalProgress}%</span>
                                    </div>
                                    <div className="w-full bg-base-200 rounded-full h-4 mb-2">
                                        <div
                                            className="h-4 rounded-full bg-gradient-to-r from-primary to-secondary"
                                            style={{ width: `${userData.globalProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="mt-2 text-sm text-base-content/70">
                                        Has completado {completedModules} de {modules.length} módulos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Learning Modules */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="text-2xl font-bold mb-4 flex items-center"
                    >
                        <FiBook className="mr-2" />
                        Tu Ruta de Aprendizaje
                    </motion.h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {modules.map((module, index) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                                className={`card bg-base-100 shadow-xl transition-all hover:shadow-2xl ${module.status === "bloqueado" ? "opacity-70" : ""
                                    }`}
                            >
                                <div className="card-body">
                                    <div className="flex items-start">
                                        <div className={`p-3 rounded-lg mr-4 ${module.status === "completado"
                                            ? "bg-success/10 text-success"
                                            : module.status === "en-progreso"
                                                ? "bg-info/10 text-info"
                                                : "bg-base-200 text-base-content/70"
                                            }`}>
                                            {module.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="card-title text-lg">{module.title}</h3>
                                                {getStatusBadge(module.status)}
                                            </div>
                                            <p className="text-base-content/70 my-2">{module.description}</p>

                                            <div className="flex flex-wrap items-center gap-3 mt-3 mb-4">
                                                {getLevelBadge(module.level)}
                                                <div className="flex items-center text-sm text-base-content/70">
                                                    <FiClock className="mr-1" />
                                                    {module.duration}
                                                </div>
                                            </div>

                                            {module.status !== "bloqueado" && (
                                                <>
                                                    <div className="w-full bg-base-200 rounded-full h-2.5 mb-2">
                                                        <div
                                                            className={`h-2.5 rounded-full ${module.status === "completado" ? "bg-success" : "bg-info"
                                                                }`}
                                                            style={{ width: `${module.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span>{module.progress}% completado</span>
                                                        {module.status === "completado" && (
                                                            <span className="flex items-center text-success">
                                                                <FiCheckCircle className="mr-1" /> Completado
                                                            </span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end mt-4">
                                        {module.status === "bloqueado" ? (
                                            <button className="btn btn-outline btn-disabled">
                                                <FiLock className="mr-2" /> Bloqueado
                                            </button>
                                        ) : module.status === "completado" ? (
                                            <button className="btn btn-outline">
                                                <FiBookmark className="mr-2" /> Repasar
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary">
                                                {module.progress > 0 ? (
                                                    <><FiPlayCircle className="mr-2" /> Continuar</>
                                                ) : (
                                                    <><FiArrowRight className="mr-2" /> Comenzar</>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Community & Resources */}
                    <div className="card bg-base-100 shadow-xl mb-8">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">Community & Resources</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col items-center text-center p-4 border border-base-300 rounded-box">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <FiBook className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-bold mb-2">Resource Library</h3>
                                    <p className="text-base-content/70 mb-4">
                                        Access our comprehensive collection of cryptography resources.
                                    </p>
                                    <button className="btn btn-sm btn-outline mt-auto">
                                        Browse Library
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center p-4 border border-base-300 rounded-box">
                                    <div className="bg-secondary/10 p-4 rounded-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold mb-2">Discussion Forum</h3>
                                    <p className="text-base-content/70 mb-4">
                                        Join the conversation with fellow cryptography enthusiasts.
                                    </p>
                                    <button className="btn btn-sm btn-outline mt-auto">
                                        Join Discussion
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center p-4 border border-base-300 rounded-box">
                                    <div className="bg-accent/10 p-4 rounded-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold mb-2">Weekly Challenges</h3>
                                    <p className="text-base-content/70 mb-4">
                                        Test your skills with our weekly cryptography challenges.
                                    </p>
                                    <button className="btn btn-sm btn-outline mt-auto">
                                        View Challenges
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Learning Tips */}
                    <div className="alert shadow-lg mb-8">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h3 className="font-bold">Tip de aprendizaje</h3>
                                <div className="text-sm">
                                    La práctica constante es clave para dominar la criptografía. Dedica tiempo cada día a repasar y practicar lo aprendido.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Footer */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p>© 2025 CryptoPlayground - Todos los derechos reservados</p>
                </div>
            </footer>
        </div>
    );
}