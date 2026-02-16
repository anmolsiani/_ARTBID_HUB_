'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Palette, Sparkles, UserCircle, Code2, CheckCircle2, PartyPopper, Zap, Crown, MessageCircle, Wand2, X } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        acceptTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [registeredUsername, setRegisteredUsername] = useState('');

    useEffect(() => {
        if (isAuthenticated && !showThankYou) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router, showThankYou]);

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

    const validateUsername = (username: string) => {
        return /^[a-zA-Z0-9_]{3,}$/.test(username);
    };

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            toast.error('All fields are mandatory for your creative ID');
            return;
        }

        if (!validateUsername(formData.username)) {
            toast.error('Username must be at least 3 chars (alphanumeric/underscore)');
            return;
        }

        if (!validateEmail(formData.email)) {
            toast.error('Please enter a valid studio email');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Security requires at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Master password and confirmation do not match');
            return;
        }

        if (!formData.acceptTerms) {
            toast.error('Please accept our studio guidelines');
            return;
        }

        setLoading(true);
        try {
            const result = await register({
                username: formData.username.toLowerCase(),
                email: formData.email,
                password: formData.password,
                displayName: formData.username,
                role: formData.role,
            });

            if (result.success) {
                setRegisteredUsername(formData.username);
                setShowThankYou(true);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed. Try a different identity.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseThankYou = () => {
        setShowThankYou(false);
        router.push('/dashboard');
    };

    return (
        <>
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
                            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1200&q=80"
                            className="w-full h-full object-cover opacity-60"
                            alt="Art Showcase"
                        />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-transparent to-pink-500/20" />

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
                                <div className="flex items-center gap-2 text-pink-500 font-black uppercase tracking-widest text-sm mb-4">
                                    <Sparkles size={16} />
                                    <span>The Creative Revolution</span>
                                </div>
                                <h2 className="text-5xl font-black text-white mb-6 leading-tight">
                                    Unleash your <br />
                                    <span className="text-gradient">creative soul.</span>
                                </h2>
                                <p className="text-white/60 text-lg font-medium">
                                    Start your journey as a creator or developer in the world's most advanced art marketplace.
                                </p>
                            </motion.div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-sm font-bold text-white/50">Real-time collaboration enabled</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                                <span className="text-sm font-bold text-white/50">AI Studio V2.0 Access</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:py-24 relative overflow-y-auto custom-scrollbar">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 blur-[100px] pointer-events-none" />

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full max-w-md z-10 my-auto"
                    >
                        <div className="mb-10">
                            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 group w-fit">
                                <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-bold text-white/50">Back to Home</span>
                            </Link>
                            <h1 className="text-4xl font-black mb-4">Create Account</h1>
                            <p className="text-white/40 font-medium">Join the community of 100k+ digital visionaries</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <RoleCard
                                    icon={<UserCircle size={20} />}
                                    label="Artist"
                                    active={formData.role === 'user'}
                                    onClick={() => setFormData(p => ({ ...p, role: 'user' }))}
                                />
                                <RoleCard
                                    icon={<Code2 size={20} />}
                                    label="Developer"
                                    active={formData.role === 'developer'}
                                    onClick={() => setFormData(p => ({ ...p, role: 'developer' }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Username</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="johndoe"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium text-xs"
                                            required
                                        />
                                        <div className="flex gap-1 mt-2 px-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${passwordStrength >= level
                                                        ? (passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 4 ? 'bg-yellow-500' : 'bg-primary')
                                                        : 'bg-white/5'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Confirm</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium text-xs"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 ml-1 py-2">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    name="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className="w-5 h-5 mt-0.5 rounded-lg border-white/10 bg-white/5 text-primary focus:ring-primary/50 cursor-pointer"
                                    required
                                />
                                <label htmlFor="acceptTerms" className="text-xs font-bold text-white/40 cursor-pointer select-none leading-relaxed">
                                    I agree to the <Link href="/terms" className="text-primary hover:text-white underline decoration-white/10">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-white underline decoration-white/10">Privacy Policy</Link>.
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
                                        <span>Initializing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create My Account</span>
                                        <CheckCircle2 size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-white/40 font-medium">
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary font-black hover:text-white transition-colors ml-1">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Thank You Modal */}
            <AnimatePresence>
                {showThankYou && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 40 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[201] px-4"
                        >
                            <div className="glass-dark border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                {/* Decorative glows */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 blur-[80px] -z-10" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/30 blur-[80px] -z-10" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/20 blur-[60px] -z-10" />

                                <button
                                    onClick={handleCloseThankYou}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white z-10"
                                >
                                    <X size={24} />
                                </button>

                                <div className="p-12 text-center">
                                    {/* Animated icon */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                                        className="w-24 h-24 bg-pixlr-gradient rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-primary/30 relative"
                                    >
                                        <PartyPopper size={48} className="text-white" />
                                        {/* Confetti particles */}
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, x: 0, y: 0 }}
                                                animate={{
                                                    scale: [0, 1, 0],
                                                    x: [0, (Math.random() - 0.5) * 120],
                                                    y: [0, (Math.random() - 0.5) * 120],
                                                }}
                                                transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                                                className={`absolute w-2 h-2 rounded-full ${['bg-primary', 'bg-pink-500', 'bg-yellow-400', 'bg-blue-500', 'bg-green-400', 'bg-orange-400', 'bg-cyan-400', 'bg-red-400'][i]}`}
                                            />
                                        ))}
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-4xl font-black mb-3 tracking-tight text-white"
                                    >
                                        Thank You! 🎉
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-xl font-bold text-gradient mb-2"
                                    >
                                        Welcome to ArtBid Hub, {registeredUsername}!
                                    </motion.p>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-white/40 font-medium mb-10 leading-relaxed"
                                    >
                                        Your creative workspace is ready. Here&apos;s what&apos;s now unlocked for you:
                                    </motion.p>

                                    {/* Unlocked Features Grid */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="grid grid-cols-2 gap-3 mb-10"
                                    >
                                        <UnlockedFeature icon={<Wand2 size={20} />} label="AI Art Generator" color="bg-primary" />
                                        <UnlockedFeature icon={<MessageCircle size={20} />} label="Direct Messaging" color="bg-pink-500" />
                                        <UnlockedFeature icon={<Crown size={20} />} label="Art Gallery" color="bg-yellow-500" />
                                        <UnlockedFeature icon={<Zap size={20} />} label="Live Auctions" color="bg-blue-500" />
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        onClick={handleCloseThankYou}
                                        className="w-full py-5 btn-pixlr rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3"
                                    >
                                        Go to Dashboard <Sparkles size={20} />
                                    </motion.button>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={14} className="text-green-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">All features unlocked • No limits</span>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function RoleCard({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-4 rounded-2xl border transition-all flex items-center gap-3 flex-1 ${active
                ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10'
                : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10'
                }`}
        >
            <span className={active ? 'text-primary' : 'text-white/20'}>{icon}</span>
            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
        </button>
    )
}

function UnlockedFeature({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
    return (
        <div className="flex items-center gap-3 p-4 glass border border-white/5 rounded-2xl">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-lg text-white flex-shrink-0`}>
                {icon}
            </div>
            <span className="text-xs font-black text-white/80">{label}</span>
        </div>
    )
}
