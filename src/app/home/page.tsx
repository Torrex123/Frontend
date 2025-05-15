"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useThemeStore } from "../store/themeStore";
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
    FiTrendingUp
} from "react-icons/fi";
import { motion } from "framer-motion";
import { loadUserHome } from "../../../api/api";



export default function UserHome() {

    const [user, setUser] = useState({
        name: "Alex",
        progress: 35,
        completedModules: 2,
        totalModules: 8,
        lastActivity: "2 days ago",
        streak: 5,
        level: "Intermediate",
        badges: ["Quick Learner", "Consistent", "Problem Solver"]
    });

    // Mock learning modules (replace with data from your DB)
    const [modules, setModules] = useState([
        {
            id: 1,
            title: "Introduction to Cryptography",
            description: "Learn the basics of cryptography and its importance in modern security.",
            level: "Beginner",
            duration: "2 hours",
            progress: 100,
            status: "completed",
            icon: <FiLock className="w-6 h-6" />
        },
        {
            id: 2,
            title: "Symmetric Key Cryptography",
            description: "Explore symmetric encryption algorithms and their applications.",
            level: "Beginner",
            duration: "3 hours",
            progress: 100,
            status: "completed",
            icon: <FiKey className="w-6 h-6" />
        },
        {
            id: 3,
            title: "Asymmetric Key Cryptography",
            description: "Understand public-key cryptography and its role in secure communications.",
            level: "Intermediate",
            duration: "4 hours",
            progress: 45,
            status: "in-progress",
            icon: <FiShield className="w-6 h-6" />
        },
        {
            id: 4,
            title: "Hash Functions & Digital Signatures",
            description: "Learn about cryptographic hash functions and how digital signatures work.",
            level: "Intermediate",
            duration: "3 hours",
            progress: 0,
            status: "locked",
            icon: <FiCode className="w-6 h-6" />
        },
        {
            id: 5,
            title: "Cryptographic Protocols",
            description: "Explore TLS, SSL, and other protocols that secure the internet.",
            level: "Advanced",
            duration: "5 hours",
            progress: 0,
            status: "locked",
            icon: <FiServer className="w-6 h-6" />
        },
        {
            id: 6,
            title: "Blockchain Cryptography",
            description: "Understand the cryptographic foundations of blockchain technology.",
            level: "Advanced",
            duration: "6 hours",
            progress: 0,
            status: "locked",
            icon: <FiCpu className="w-6 h-6" />
        }
    ]);

    // Load user data from API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await loadUserHome();
                if (response) {
                    console.log("User data loaded successfully:", response);
                }
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        };

        fetchUserData();
    }, []);

    // Mock recommended next steps
    const [recommendations, setRecommendations] = useState([
        {
            id: 1,
            title: "Continue Asymmetric Key Cryptography",
            description: "You're 45% through this module. Keep going!",
            type: "module",
            moduleId: 3
        },
        {
            id: 2,
            title: "Weekly Challenge: Break the Code",
            description: "Test your skills with this week's cryptography challenge.",
            type: "challenge"
        },
        {
            id: 3,
            title: "Join the Community Discussion",
            description: "Share your insights on the latest encryption standards.",
            type: "community"
        }
    ]);

    // Time-based greeting
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    // Function to get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return <span className="badge badge-success">Completed</span>;
            case "in-progress":
                return <span className="badge badge-info">In Progress</span>;
            case "locked":
                return <span className="badge badge-outline">Locked</span>;
            default:
                return null;
        }
    };

    // Function to get level badge
    const getLevelBadge = (level) => {
        switch (level) {
            case "Beginner":
                return <span className="badge badge-primary badge-sm">Beginner</span>;
            case "Intermediate":
                return <span className="badge badge-secondary badge-sm">Intermediate</span>;
            case "Advanced":
                return <span className="badge badge-accent badge-sm">Advanced</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="card bg-base-100 shadow-xl mb-8">
                        <div className="card-body">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{greeting}, {user.name}!</h1>
                                    <p className="text-base-content/70">
                                        Welcome back to your cryptography learning journey. You're making great progress!
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <div className="stats shadow">
                                        <div className="stat">
                                            <div className="stat-figure text-primary">
                                                <FiAward className="w-6 h-6" />
                                            </div>
                                            <div className="stat-title">Level</div>
                                            <div className="stat-value text-primary">{user.level}</div>
                                            <div className="stat-desc">Keep learning to advance</div>
                                        </div>

                                        <div className="stat">
                                            <div className="stat-figure text-secondary">
                                                <FiTrendingUp className="w-6 h-6" />
                                            </div>
                                            <div className="stat-title">Streak</div>
                                            <div className="stat-value text-secondary">{user.streak} days</div>
                                            <div className="stat-desc">Last active {user.lastActivity}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Overview */}
                    <div className="card bg-base-100 shadow-xl mb-8">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">Your Learning Progress</h2>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="mb-2 flex justify-between items-center">
                                        <span className="text-sm font-medium">Overall Progress</span>
                                        <span className="text-sm font-medium">{user.progress}%</span>
                                    </div>
                                    <progress
                                        className="progress progress-primary w-full"
                                        value={user.progress}
                                        max="100"
                                    ></progress>
                                    <p className="mt-2 text-sm text-base-content/70">
                                        You've completed {user.completedModules} of {user.totalModules} modules
                                    </p>
                                </div>

                                <div className="divider md:divider-horizontal"></div>

                                <div className="flex-1">
                                    <h3 className="font-medium mb-3">Your Achievements</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.badges.map((badge, index) => (
                                            <div key={index} className="badge badge-lg gap-2">
                                                <FiAward className="h-4 w-4" />
                                                {badge}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Next Steps */}
                    <h2 className="text-2xl font-bold mb-4">Recommended Next Steps</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {recommendations.map((item) => (
                            <motion.div
                                key={item.id}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="card-body">
                                    <h3 className="card-title text-lg">
                                        {item.type === "module" && <FiPlayCircle className="text-primary" />}
                                        {item.type === "challenge" && <FiBarChart2 className="text-secondary" />}
                                        {item.type === "community" && <FiBookmark className="text-accent" />}
                                        {item.title}
                                    </h3>
                                    <p className="text-base-content/70">{item.description}</p>
                                    <div className="card-actions justify-end mt-4">
                                        <button className="btn btn-primary btn-sm">
                                            {item.type === "module" ? "Continue" : "View"}
                                            <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Learning Modules */}
                    <h2 className="text-2xl font-bold mb-4">Your Learning Path</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                className={`card bg-base-100 shadow-xl transition-all ${module.status === "locked" ? "opacity-70" : ""
                                    }`}
                            >
                                <div className="card-body">
                                    <div className="flex items-start">
                                        <div className={`p-3 rounded-lg mr-4 ${module.status === "completed"
                                                ? "bg-success/10 text-success"
                                                : module.status === "in-progress"
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

                                            {module.status !== "locked" && (
                                                <>
                                                    <div className="w-full bg-base-200 rounded-full h-2.5 mb-2">
                                                        <div
                                                            className={`h-2.5 rounded-full ${module.status === "completed" ? "bg-success" : "bg-info"
                                                                }`}
                                                            style={{ width: `${module.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span>{module.progress}% complete</span>
                                                        {module.status === "completed" && (
                                                            <span className="flex items-center text-success">
                                                                <FiCheckCircle className="mr-1" /> Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end mt-4">
                                        {module.status === "locked" ? (
                                            <button className="btn btn-outline btn-disabled">
                                                <FiLock className="mr-2" /> Locked
                                            </button>
                                        ) : module.status === "completed" ? (
                                            <button className="btn btn-outline">
                                                Review
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary">
                                                {module.progress > 0 ? "Continue" : "Start"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
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

                    {/* Upcoming Events */}
                    <div className="card bg-base-100 shadow-xl mb-8">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">Upcoming Events</h2>

                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Event</th>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="font-bold">Cryptography in Web3</div>
                                                <div className="text-sm opacity-70">Expert webinar with Dr. Jane Smith</div>
                                            </td>
                                            <td>May 15, 2023<br /><span className="badge badge-ghost badge-sm">2:00 PM EST</span></td>
                                            <td>Webinar</td>
                                            <td>
                                                <button className="btn btn-xs btn-primary">Register</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-bold">Quantum Cryptography Workshop</div>
                                                <div className="text-sm opacity-70">Hands-on workshop</div>
                                            </td>
                                            <td>May 22, 2023<br /><span className="badge badge-ghost badge-sm">All day</span></td>
                                            <td>Workshop</td>
                                            <td>
                                                <button className="btn btn-xs btn-primary">Register</button>
                                            </td>
                                        </tr>
                                        <tr>

                                            <td>
                                                <div className="font-bold">Quantum Cryptography Workshop</div>
                                                <div className="text-sm opacity-70">Hands-on workshop</div>
                                            </td>
                                            <td>May 22, 2023<br /><span className="badge badge-ghost badge-sm">All day</span></td>
                                            <td>Workshop</td>
                                            <td>
                                                <button className="btn btn-xs btn-primary">Register</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-bold">Cryptography Hackathon</div>
                                                <div className="text-sm opacity-70">Build secure applications</div>
                                            </td>
                                            <td>June 5-7, 2023<br /><span className="badge badge-ghost badge-sm">Virtual</span></td>
                                            <td>Hackathon</td>
                                            <td>
                                                <button className="btn btn-xs btn-outline">Join Waitlist</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="card-actions justify-center mt-4">
                                <button className="btn btn-outline btn-sm">
                                    View All Events
                                </button>
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
                                <h3 className="font-bold">Learning Tip</h3>
                                <div className="text-sm">
                                    Consistent practice is key to mastering cryptography. Try to dedicate at least 30 minutes daily to your studies.
                                </div>
                            </div>
                        </div>
                        <div className="flex-none">
                            <button className="btn btn-sm btn-ghost">Dismiss</button>
                            <button className="btn btn-sm btn-primary">More Tips</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p>© 2023 CryptoLearn - Empowering secure digital futures through education</p>
                </div>
            </footer>
        </div>
    );
}