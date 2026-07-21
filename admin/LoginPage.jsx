'use client';

import React, { useState } from 'react';
import { Mail, Eye, EyeOff, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';   // ← Add this
import { useEffect } from 'react';
import { toast } from 'sonner';

const LoginPage = () => {
    const { isAuthenticated, isMaintenance, maintenancemessage, login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('admin@Kenyahouse.com');
    const [password, setPassword] = useState('anypassword');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentform, setCurrentForm] = useState('login');
    const navigate = useNavigate()

    const setForgotForm = () => {
        setCurrentForm('forgot')
    }

    // /check auth
    useEffect(() => {
        const checkAuth = () => {
            if (isAuthenticated && !isMaintenance) {
                navigate('/dashboard')
            }
        }

        checkAuth()
    }, [])
    // ← For redirection

    const sendRequestLink = (e) => {
        e.preventDefault()
        setIsLoading(true);
        try {


        } catch (error) {
            console.log("error sending link", error)
            setIsLoading(false)

        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');   // Clear previous error

        try {
            const result = await login(email, password);

            if (result?.success) {
                toast.success("✅ Login successful", { position: "top-right" });
                // setError("");
                setTimeout(() =>
                    navigate('/dashboard'), 1000)   // Redirect to dashboard
            }

        } catch (err) {
            console.error("Login failed:", err);
            toast.error("Invalid credentials. Please try again.", { position: "top-right" });
            // setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        setTimeout(() => setError(''), 3000)
    }

    return (
        <div className="min-h-screen w-full bg-zinc-950 flex">
            {
                error && <div className="absolute animate animate-fadein duration-500 bg-black text-white rounded-xl space-x-2 top-10 right-10 flex flex-row items-center px-4 py-2">
                    <p>{error}</p>
                    <button onClick={() => setError('')}><X size={25} className='text-white' /></button>
                </div>
            }
            {/* Left Panel - Visual / Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-zinc-900 to-black items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

                <div className="relative z-10 text-center px-12">
                    <div className="mx-auto w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8">
                        <span className="text-4xl font-bold text-black">N</span>
                    </div>
                    <h2 className="text-5xl font-semibold text-white tracking-tight mb-4">
                        Kenyahouse
                    </h2>
                    <p className="text-zinc-400 text-xl max-w-md mx-auto">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                <div className="absolute bottom-12 left-12 w-72 h-72 border border-white/10 rounded-full" />
                <div className="absolute top-12 right-20 w-40 h-40 border border-white/10 rounded-full" />
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex justify-center mb-10">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">N</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-center mb-10">
                        {/* {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )} */}

                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                            Hello, Welcome back 👋
                        </h1>
                        <p className="text-zinc-500">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {
                        currentform === 'login' ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700">Email</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-zinc-700">Password</label>
                                        <button onClick={() => setCurrentForm('forgot')} type="button" className="text-xs text-zinc-500 hover:text-black">
                                            Forgot password?
                                        </button>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black hover:bg-zinc-800 text-white py-3.5 rounded-2xl font-medium disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </button>
                            </form>
                        ) :
                            (
                                <form onSubmit={sendRequestLink} className="space-y-6">
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-700">Email</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600">
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-zinc-700"></label>
                                            <button
                                                onClick={() => setCurrentForm('login')}
                                                type="button" className="text-xs text-zinc-500 hover:text-black">
                                                Remember password?
                                            </button>
                                        </div>


                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-black hover:bg-zinc-800 text-white py-3.5 rounded-2xl font-medium disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending reset link...
                                            </>
                                        ) : (
                                            "Get reset Link"
                                        )}
                                    </button>
                                </form>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default LoginPage;