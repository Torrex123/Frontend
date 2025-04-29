"use client"
import styles from "./page.module.css";
import Link from "next/link";
import Navbar from "./components/navbar";
import {
    BiSolidChat, BiMessageRounded,
    BiMessageSquareCheck, BiSolidMessageRoundedDetail,
    BiSolidMessageAltAdd, BiMessageRoundedDots
} from "react-icons/bi";
import { FaUser, FaEnvelope, FaLock, FaRegSmileBeam, FaLockOpen} from "react-icons/fa";
import { RiLock2Fill } from "react-icons/ri";
import { MdLockOutline } from "react-icons/md";
import { useState } from "react";

export default function Home() {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nickName: '',
        email: '',
        password: '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    }


    return (
        <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
            <Navbar />
            {/* Main Content */}
            <div className="flex-grow grid lg:grid-cols-2 min-h-0">
                {/* Left side */}
                <div className="flex flex-col justify-center items-center p-4 sm:p-8 md:p-12">
                    <div className="w-full max-w-md space-y-6 transition-all duration-300">
                        {/* Logo / Image */}
                        <div className="flex justify-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
                                <FaUser className="text-2xl sm:text-3xl text-primary" />
                            </div>
                        </div>
    
                        <h1 className="text-2xl sm:text-3xl font-bold text-center mt-4 sm:mt-6">Welcome Back!</h1>
                        <p className="text-center text-base-content/70 -mt-1 sm:-mt-2">Sign in to continue learning</p>
    
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mt-6 sm:mt-8">
                            {/* Email Field */}
                            <div className="form-control">
                                <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-200 focus:border-primary transition-all duration-300"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
    
                            {/* Password Field */}
                            <div className="form-control">
                                <div className="flex justify-between items-center mb-1.5">
                                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60">
                                        <FaLock />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="input input-bordered w-full pl-10 pr-12 bg-base-200/50 focus:bg-base-200 focus:border-primary transition-all duration-300"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-base-content/60 hover:text-primary transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "HIDE" : "SHOW"}
                                    </button>
                                </div>
                            </div>
    
                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-4 sm:mt-6 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Login
                            </button>
                        </form>
    
                        {/* Sign Up Link */}
                        <div className="divider text-xs text-base-content/50 my-4 sm:my-6">OR CONTINUE WITH</div>
    
                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <button className="btn btn-outline btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button className="btn btn-outline btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill="#1877F2" />
                                </svg>
                                Facebook
                            </button>
                        </div>
    
                        {/* Sign Up Link */}
                        <p className="text-sm text-center text-base-content/70 mt-4 sm:mt-6">
                            No Account? No Problem!&nbsp;
                            <Link href="/SignUp" className="text-primary hover:text-primary-focus font-medium transition-all duration-300 ease-in-out">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
    
                {/* Right Side - Abstract Design */}
                <div className="hidden lg:flex items-center justify-center p-6 relative overflow-hidden">
                    {/* Abstract Floating Elements - Staggered Pulse Animations */}
                    <div className="absolute top-5 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-primary/30 backdrop-blur-xl rounded-full shadow-lg animate-pulse [animation-delay:0.2s]"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-secondary/40 backdrop-blur-md rounded-lg shadow-md animate-pulse [animation-delay:0.4s]"></div>
                    <div className="absolute top-1/4 right-1/4 w-36 h-36 sm:w-48 sm:h-48 bg-accent/30 backdrop-blur-2xl rounded-full shadow-xl animate-pulse [animation-delay:0.6s]"></div>
                    <div className="absolute bottom-10 left-16 w-20 h-20 sm:w-24 sm:h-24 bg-neutral/20 backdrop-blur-xl rounded-full opacity-50 animate-pulse [animation-delay:0.8s]"></div>
                    <div className="absolute top-3/4 right-1/4 w-36 h-36 sm:w-48 sm:h-48 bg-primary/20 backdrop-blur-2xl rounded-full shadow-xl animate-pulse [animation-delay:0.1s]"></div>
    
                    {/* Additional Shapes with Delayed Pulses */}
                    <div className="absolute top-16 right-28 w-20 h-20 sm:w-28 sm:h-28 border border-primary/50 rounded-full animate-pulse [animation-delay:1s]"></div>
                    <div className="absolute bottom-24 left-24 w-32 h-32 sm:w-40 sm:h-40 border border-primary rounded-lg rotate-12 animate-pulse [animation-delay:1.2s]"></div>
                    <div className="absolute top-3/4 left-1/3 w-10 h-10 sm:w-14 sm:h-14 bg-base-200/50 backdrop-blur-md rounded-full opacity-70 animate-pulse [animation-delay:1.4s]"></div>
                    <div className="absolute top-24 right-1/3 w-32 h-32 sm:w-40 sm:h-40 border border-secondary rounded-lg rotate-12 animate-pulse [animation-delay:1.2s]"></div>
    
                    {/* New Extra Floating Figures */}
                    <div className="absolute top-1/3 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-error/40 backdrop-blur-xl rounded-full shadow-md animate-pulse [animation-delay:1.6s]"></div>
                    <div className="absolute bottom-5 right-3/2 w-10 h-10 sm:w-12 sm:h-12 bg-success/40 backdrop-blur-md rounded-lg shadow-md animate-pulse [animation-delay:1.8s]"></div>
    
                    {/* React Icons for Extra Detail */}
                    <BiMessageRounded className="absolute top-3/4 left-1/3 text-[40px] sm:text-[56px] text-primary opacity-20 animate-pulse [animation-delay:2s]" />
                    <FaRegSmileBeam className="absolute top-20 right-10 text-[36px] sm:text-[48px] text-secondary opacity-30 animate-pulse [animation-delay:2.2s]" />
                    <BiMessageSquareCheck className="absolute bottom-16 left-20 text-[40px] sm:text-[52px] text-accent opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <BiSolidMessageRoundedDetail className="absolute bottom-1/4 left-55 text-[120px] sm:text-[152px] text-accent opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <BiSolidChat className="absolute bottom-1/4 right-12 text-[56px] sm:text-[72px] text-primary/50 opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <BiSolidMessageAltAdd className="absolute bottom-2/4 right-8 text-[56px] sm:text-[72px] text-secondary/50 opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <BiMessageRoundedDots className="absolute bottom-2/4 left-8 text-[56px] sm:text-[72px] text-accent/80 opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <FaLockOpen className="absolute bottom-2/4 left-45 top-32 text-[56px] sm:text-[72px] text-accent/80 opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <RiLock2Fill className="absolute bottom-1/4 right-53 text-[56px] sm:text-[72px] text-secondary/50 opacity-25 animate-pulse [animation-delay:1.5s]" />
                    <MdLockOutline className="absolute bottom-1/3 left-16 text-[56px] sm:text-[72px] text-secondary/50 opacity-25 animate-pulse [animation-delay:1.5s]" />
                    {/* Motivational Text */}
                    <div className="relative text-center p-6 sm:p-8">
                        <h2 className="text-3xl sm:text-5xl font-bold">Decode the Future of Security!</h2>
                        <p className="mt-2 sm:mt-4 text-base sm:text-lg">Master cryptography in a fun, interactive way—one puzzle at a time!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
