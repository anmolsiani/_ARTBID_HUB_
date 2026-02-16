'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Palette, Sparkles, CheckCircle2 } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const redirect = searchParams.get('redirect') || '/dashboard';
            router.push(redirect);
        }
    }, [isAuthenticated, router, searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!validateEmail(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const result = await login({
                email: formData.email,
                password: formData.password,
            });

            if (result.success) {
                toast.success('Authentication successful! Initializing workbench...');
                const redirect = searchParams.get('redirect') || '/dashboard';
                router.push(redirect);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex overflow-hidden">
            {/* Left Side: Art Showcase */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&q=80"
                        className="w-full h-full object-cover opacity-60"
                        alt="Art Showcase"
                    />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-primary/20" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <Link href="/" className="flex items-center gap-2 group w-fit">
                        <div className="p-2 rounded-xl bg-pixlr-gradient group-hover:scale-110 transition-transform">
                            <Palette size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">ArtBid Hub</span>
                    </Link>

                    <div className="max-w-lg">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm mb-4">
                                <Sparkles size={16} />
                                <span>Artist of the Month</span>
                            </div>
                            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
                                "The canvas is a <br />
                                <span className="text-gradient">limitless horizon.</span>"
                            </h2>
                            <p className="text-white/60 text-lg font-medium">
                                Join our global network of over 100,000 digital artists and collectors today.
                            </p>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-4 py-6 border-t border-white/10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-bold text-white/50">+10k artists joined this week</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="mb-12">
                        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 group w-fit">
                            <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold text-white/50">Back to Home</span>
                        </Link>
                        <h1 className="text-4xl font-black mb-4">Welcome Back</h1>
                        <p className="text-white/40 font-medium">Continue your artistic journey on ArtBid Hub</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-white/30">Password</label>
                                <Link href="/forgot-password" title="Coming Soon" className="text-xs font-black text-primary hover:text-white transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-1">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-primary focus:ring-primary/50 cursor-pointer"
                            />
                            <label htmlFor="rememberMe" className="text-sm font-bold text-white/40 cursor-pointer select-none">
                                Remember this device for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${loading
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-pixlr-gradient text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Log In to Studio</span>
                                    <CheckCircle2 size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-white/40 font-medium">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary font-black hover:text-white transition-colors ml-1">
                                Create Art Account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                        <SocialBtn icon={<GoogleIcon />} label="Google" />
                        <SocialBtn icon={<AppleIcon />} label="Apple" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

function SocialBtn({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex-1 py-4 px-6 rounded-2xl glass border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-bold group">
            <span className="group-hover:scale-110 transition-transform">{icon}</span>
            <span className="text-sm">{label}</span>
        </button>
    )
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#EA4335" d="M5.26628571,9.76457143 L2.01257143,7.24285714 C4.012,3.22657143 8.12,0.5 12,0.5 C15.232,0.5 18.068,1.572 20.264,3.372 L17.032,6.472 C15.656,5.336 13.98,4.712 12,4.712 C8.9,4.712 6.18,6.804 5.26628571,9.76457143 Z" />
            <path fill="#FBBC05" d="M12,19.288 C13.98,19.288 15.656,18.664 17.032,17.528 L20.264,20.628 C18.068,22.428 15.232,23.5 12,23.5 C8.12,23.5 4.012,20.7734286 2.01257143,16.7571429 L5.26628571,14.2354286 C6.18,17.196 8.9,19.288 12,19.288 Z" />
            <path fill="#4285F4" d="M22.56,12.25 C22.56,11.47 22.49,10.72 22.36,10 L12,10 L12,14.26 L17.92,14.26 C17.66,15.63 16.88,16.79 15.71,17.57 L15.71,17.57 L18.9637143,20.0917143 C20.9631429,18.07 22.1622857,15.2514286 22.1622857,11.9028571 C22.1622857,11.5165714 22.1285714,11.1302857 22.0611429,10.744 L22.56,12.25 Z" />
            <path fill="#34A853" d="M12,23.5 C15.232,23.5 18.068,22.428 20.264,20.628 L17.032,17.528 C15.656,18.664 13.98,19.288 12,19.288 C8.9,19.288 6.18,17.196 5.26628571,14.2354286 L2.01257143,16.7571429 C4.012,20.7734286 8.12,23.5 12,23.5 Z" />
        </svg>
    )
}

function AppleIcon() {
    return (
        <svg viewBox="0 0 256 315" className="w-5 h-5 fill-current">
            <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.197 63.623-.335.936-6.588 22.476-21.577 44.407-12.922 18.919-26.33 37.752-47.477 38.144-20.785.391-27.42-12.339-51.192-12.339-23.772 0-31.144 12.023-50.817 12.753-20.403.73-35.912-20.245-48.974-39.065-26.7-38.487-47.113-108.727-19.49-156.554 13.676-23.732 38.163-38.775 64.654-39.141 20.358-.39 39.544 13.682 52.022 13.682 12.479 0 35.845-16.814 60.55-14.332 10.334.428 39.363 4.14 58.05 31.428-1.493.924-34.614 20.147-34.212 59.832l.278 1.962zM155.727 44.524c11.02-13.344 18.434-31.9 16.402-50.404-15.894.636-35.093 10.552-46.49 23.75-10.22 11.758-19.146 30.697-16.702 48.747 17.72 1.378 35.812-8.818 46.79-22.093z" />
        </svg>
    )
}
