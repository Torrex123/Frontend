"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaRegSmileBeam } from "react-icons/fa";
import { BiMessageCheck, BiSolidChat , BiMessageRounded, 
    BiMessageSquareCheck, BiSolidMessageRoundedDetail, BiSolidMessageAltAdd, BiMessageRoundedDots } from "react-icons/bi";
import Navbar from "../components/Navbar";
import Link from 'next/link';


const SignUpPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nickName: '',
        email: '',
        password: '',
    });

    const validateForm = () => {
        if (formData.nickName === '') {
            alert('Nickname is required');
            return false;
        }

    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);  
    }

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="flex-grow grid lg:grid-cols-2 min-h-0">
                {/* Left side */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                    <div className="w-full max-w-md space-y-8">
                        {/* Logo / Image */}
                        <div className="flex justify-center">
                            <BiMessageCheck className="text-4xl" />
                        </div>

                        <h1 className="text-3xl font-bold text-center">Create Account</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nickname Field */}
                            <div>
                                <label htmlFor="nickName" className="block text-sm font-medium">Nickname</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        id="nickName"
                                        name="nickName"
                                        value={formData.nickName}
                                        onChange={(e) => setFormData({ ...formData, nickName: e.target.value })}
                                        className="input input-bordered w-full mt-1 px-4 py-2 pl-10 sm:text-sm"
                                        placeholder="Enter your nickname"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input input-bordered w-full mt-1 px-4 py-2 pl-10 sm:text-sm"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="input input-bordered w-full mt-1 px-4 py-2 pl-10 sm:text-sm"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary w-full">
                                Sign Up
                            </button>
                        </form>

                        {/* Already have an account? */}
                        <p className="text-sm text-center text-gray-400">
                            Already have an account? &nbsp;
                            <Link href="/" className="text-primary hover:text-primary-focus font-medium transition-all duration-300 ease-in-out">
                            Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Side - Abstract Design */}
                <div className="hidden lg:flex items-center justify-center p-10 relative overflow-hidden">
                    {/* Abstract Floating Elements - Staggered Pulse Animations */}
                    <div className="absolute top-5 left-10 w-32 h-32 bg-primary/30 backdrop-blur-xl rounded-full shadow-lg animate-pulse [animation-delay:0.2s]"></div>
                    <div className="absolute bottom-10 right-10 w-20 h-20 bg-secondary/40 backdrop-blur-md rounded-lg shadow-md animate-pulse [animation-delay:0.4s]"></div>
                    <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-accent/30 backdrop-blur-2xl rounded-full shadow-xl animate-pulse [animation-delay:0.6s]"></div>
                    <div className="absolute bottom-10 left-16 w-24 h-24 bg-neutral/20 backdrop-blur-xl rounded-full opacity-50 animate-pulse [animation-delay:0.8s]"></div>
                    <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-primary/20 backdrop-blur-2xl rounded-full shadow-xl animate-pulse [animation-delay:0.1s]"></div>

                    {/* Additional Shapes with Delayed Pulses */}
                    <div className="absolute top-16 right-28 w-28 h-28 border border-primary/50 rounded-full animate-pulse [animation-delay:1s]"></div>
                    <div className="absolute bottom-24 left-24 w-40 h-40 border border-primary rounded-lg rotate-12 animate-pulse [animation-delay:1.2s]"></div>
                    <div className="absolute top-3/4 left-1/3 w-14 h-14 bg-base-200/50 backdrop-blur-md rounded-full opacity-70 animate-pulse [animation-delay:1.4s]"></div>
                    <div className="absolute top-24 right-1/3 w-40 h-40 border border-secondary rounded-lg rotate-12 animate-pulse [animation-delay:1.2s]"></div>

                    {/* New Extra Floating Figures */}
                    <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-error/40 backdrop-blur-xl rounded-full shadow-md animate-pulse [animation-delay:1.6s]"></div>
                    <div className="absolute bottom-5 right-3/2 w-12 h-12 bg-success/40 backdrop-blur-md rounded-lg shadow-md animate-pulse [animation-delay:1.8s]"></div>

                    {/* React Icons for Extra Detail */}
                    <BiMessageRounded className="absolute top-3/4 left-1/3 text-[56px] text-primary opacity-20 animate-pulse [animation-delay:2s]" />
                    <FaRegSmileBeam className="absolute top-20 right-10 text-[48px] text-secondary opacity-30 animate-pulse [animation-delay:2.2s]" />
                    <BiMessageSquareCheck className="absolute bottom-16 left-20 text-[52px] text-accent opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <BiSolidMessageRoundedDetail className="absolute bottom-1/4 left-55 text-[152px] text-accent opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <BiSolidChat className="absolute bottom-1/4 right-12 text-[72px] text-primary/50 opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <BiSolidMessageAltAdd className="absolute bottom-2/4 right-8 text-[72px] text-secondary/50 opacity-25 animate-pulse [animation-delay:2.5s]" />
                    <BiMessageRoundedDots className="absolute bottom-2/4 left-8 text-[72px] text-accent/80 opacity-25 animate-pulse [animation-delay:2.5s]" />


                    {/* Motivational Text */}
                    <div className="relative text-center p-8 ">
                        <h2 className="text-5xl font-bold">Connect & Communicate</h2>
                        <p className="mt-4 text-lg ">Join our secure and fast messaging platform today.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;