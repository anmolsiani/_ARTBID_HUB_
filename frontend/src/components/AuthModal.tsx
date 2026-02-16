'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, LogIn, UserPlus, Palette } from 'lucide-react'
import Link from 'next/link'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message?: string
}

export default function AuthModal({
    isOpen,
    onClose,
    title = "Unlock Your Creative Potential",
    message = "Sign in to access advanced studio tools, collaborate with artists, and build your digital legacy."
}: AuthModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] px-4"
                    >
                        <div className="glass-dark border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -z-10" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 blur-[80px] -z-10" />

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ rotate: -20, scale: 0.5 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    className="w-20 h-20 bg-pixlr-gradient rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-primary/20"
                                >
                                    <Palette size={40} className="text-white" />
                                </motion.div>

                                <h2 className="text-3xl font-black mb-4 tracking-tight text-white">{title}</h2>
                                <p className="text-white/40 font-medium mb-12 leading-relaxed">
                                    {message}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Link
                                        href="/login"
                                        className="btn-pixlr py-5 px-8 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest shadow-xl"
                                    >
                                        <LogIn size={20} />
                                        Log In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="glass border border-white/10 hover:bg-white/10 py-5 px-8 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest text-white transition-all shadow-xl"
                                    >
                                        <UserPlus size={20} />
                                        Sign Up
                                    </Link>
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
                                    <Sparkles size={16} className="text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Joining is free & instant</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
