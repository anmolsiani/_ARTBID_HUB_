'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, Users, User, ArrowRight, Sparkles, Crown, UserPlus, MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { userAPI } from '@/lib/api'
import useAuthStore from '@/store/useAuthStore'
import toast from 'react-hot-toast'

export default function SearchPage() {
    const { user: currentUser, isAuthenticated } = useAuthStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const debounceSearch = useCallback(
        debounce(async (query: string) => {
            if (query.trim().length < 1) {
                setResults([])
                setSearched(false)
                return
            }
            setLoading(true)
            setSearched(true)
            try {
                const response = await userAPI.searchUsers(query)
                setResults(response.data.users || [])
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 400),
        []
    )

    useEffect(() => {
        debounceSearch(searchQuery)
    }, [searchQuery, debounceSearch])

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-16 px-4 md:px-8">
            {/* Background Effects */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] pointer-events-none z-0" />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="px-3 py-1 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                            Discover Artists
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Find <span className="text-gradient">Creative People</span>
                    </h1>
                    <p className="text-white/40 font-medium max-w-md mx-auto">
                        Search by username to discover artists, developers, and collectors on ArtBid Hub.
                    </p>
                </motion.div>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                >
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all text-lg font-bold placeholder:text-white/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(''); setResults([]); setSearched(false); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-all"
                            >
                                <X size={20} className="text-white/30" />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                        >
                            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white/30 font-bold text-sm">Searching...</p>
                        </motion.div>
                    )}

                    {!loading && searched && results.length === 0 && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center glass border border-white/5 rounded-[3rem]"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={40} className="text-white/20" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">No users found</h3>
                            <p className="text-white/40 font-medium">Try a different username or check the spelling.</p>
                        </motion.div>
                    )}

                    {!loading && results.length > 0 && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-6 ml-2">
                                {results.length} {results.length === 1 ? 'result' : 'results'} found
                            </p>

                            {results.map((u: any, i: number) => (
                                <motion.div
                                    key={u._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={`/profile/${u.username}`}
                                        className="flex items-center gap-5 p-6 glass border border-white/5 rounded-3xl hover:bg-white/10 hover:border-white/10 transition-all group"
                                    >
                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-2xl bg-pixlr-gradient p-0.5 shadow-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <div className="w-full h-full rounded-[0.85rem] overflow-hidden bg-[#020617] flex items-center justify-center">
                                                {u.avatar && u.avatar !== 'https://res.cloudinary.com/demo/image/upload/avatar-default.png' ? (
                                                    <img src={u.avatar} alt={u.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-black text-gradient">
                                                        {u.username?.[0]?.toUpperCase() || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-black truncate group-hover:text-primary transition-colors">
                                                    {u.displayName || u.username}
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-full glass text-[9px] font-black uppercase tracking-widest text-primary border border-primary/20 flex-shrink-0">
                                                    {u.role === 'developer' ? 'Dev' : u.role === 'admin' ? 'Admin' : 'Artist'}
                                                </span>
                                            </div>
                                            <p className="text-white/40 font-bold text-sm mb-2">@{u.username}</p>
                                            {u.bio && (
                                                <p className="text-white/30 text-xs font-medium line-clamp-1">{u.bio}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                                                <span>{u.followersCount || 0} followers</span>
                                                <span>{u.followingCount || 0} following</span>
                                            </div>
                                        </div>

                                        {/* Action Arrow */}
                                        <ArrowRight size={20} className="text-white/10 group-hover:text-primary transition-colors flex-shrink-0 group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!loading && !searched && (
                        <motion.div
                            key="initial"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center"
                        >
                            <div className="w-32 h-32 relative mx-auto mb-8">
                                <div className="absolute inset-0 bg-pixlr-gradient blur-3xl opacity-20 rounded-full animate-pulse-slow" />
                                <div className="relative w-full h-full glass border border-white/10 rounded-[2rem] flex items-center justify-center">
                                    <Search size={64} className="text-primary" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black mb-3">Start typing to search</h3>
                            <p className="text-white/40 font-medium mb-8">Find artists and creators by their username</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout | null = null
    return ((...args: any[]) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }) as any
}
