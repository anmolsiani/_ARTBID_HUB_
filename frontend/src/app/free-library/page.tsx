'use client'

import { useState, useEffect } from 'react'
import { Search, Download, Eye, Tag, Grid, Layout, List, DownloadCloud, Sparkles, Filter, ChevronDown, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '@/store/useAuthStore'
import AuthModal from '@/components/AuthModal'
import { artAPI } from '@/lib/api'
import toast from 'react-hot-toast'

const categories = [
    'All Assets', 'Motivational', 'Nature', 'Abstract', 'Minimalist', 'Cyberpunk', 'Business', 'Tech'
]

export default function FreeLibraryPage() {
    const { isAuthenticated } = useAuthStore()
    const [assets, setAssets] = useState([])
    const [loading, setLoading] = useState(true)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All Assets')
    const [sortBy, setSortBy] = useState('latest')

    useEffect(() => {
        fetchAssets()
    }, [activeCategory, sortBy])

    const fetchAssets = async () => {
        try {
            setLoading(true)
            // Simulating API call for free assets
            // In a real app, we'd add isFree: true to params
            const response = await artAPI.getAll({
                category: activeCategory !== 'All Assets' ? activeCategory : undefined,
                sort: sortBy
            })
            // For now, filtering locally if backend doesn't support isFree yet
            // Assuming for the sake of UI demo that these are the free ones
            setAssets(response.data || [])
        } catch (error) {
            console.error('Error fetching assets:', error)
            toast.error('Failed to load library')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = (id: string) => {
        if (!isAuthenticated) {
            setAuthModalOpen(true)
            return
        }
        toast.success('Initializing secure download...')
        // Real download logic here
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative mb-16 p-12 rounded-[3.5rem] overflow-hidden">
                    <div className="absolute inset-0 bg-pixlr-gradient opacity-10 blur-3xl" />
                    <div className="absolute inset-0 border border-white/5 rounded-[3.5rem]" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <span className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                                <DownloadCloud size={14} /> Global Creative Commons
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black mb-4">Discovery <span className="text-gradient">Library</span></h1>
                            <p className="text-white/40 font-medium max-w-xl text-lg">
                                Access thousands of high-quality, professional assets for free. Curated by the community, powered by ArtBid Hub.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex -space-x-3 mb-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-white/10" />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#020617] glass-dark flex items-center justify-center text-[10px] font-black">
                                    +12K
                                </div>
                            </div>
                            <span className="text-xs font-bold text-white/30 lowercase">Assets downloaded every day</span>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto custom-scrollbar no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white/5 border border-white/5 rounded-2xl py-3 px-6 text-xs font-bold appearance-none cursor-pointer pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="latest">Newest</option>
                                <option value="popular">Popular</option>
                                <option value="downloads">Most Downloaded</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : assets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {assets.map((asset: any) => (
                                <AssetCard
                                    key={asset._id}
                                    asset={asset}
                                    onDownload={() => handleDownload(asset._id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-24 text-center glass-dark border border-white/5 rounded-[3.5rem]">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={40} className="text-primary" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">The library is quiet</h3>
                        <p className="text-white/40 font-medium">No free assets found matching your filters.</p>
                    </div>
                )}
            </div>

            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                title="Sign in to Download"
                message="Join the community to unlock unlimited free downloads and contribute to the global asset library."
            />
        </div>
    )
}

function AssetCard({ asset, onDownload }: { asset: any, onDownload: () => void }) {
    const { isAuthenticated } = useAuthStore()

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group glass-dark rounded-[2.5rem] overflow-hidden border border-white/5 relative"
        >
            <div className="aspect-[3/4] overflow-hidden relative">
                <img
                    src={asset.image || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={asset.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <div className="flex items-center justify-between">
                        <button className="flex-1 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                            <Eye size={14} /> Preview
                        </button>
                    </div>
                </div>

                {asset.isNew && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">New</div>
                )}
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-primary">
                        {asset.category || 'General'}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 flex items-center gap-1">
                        <Download size={8} /> 1.2k
                    </span>
                </div>
                <h3 className="font-black text-sm mb-4 truncate">{asset.title}</h3>

                <button
                    onClick={onDownload}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-all group/btn"
                >
                    {!isAuthenticated && <Lock size={14} className="text-white/40" />}
                    <Download size={14} className="group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Free Download</span>
                </button>
            </div>
        </motion.div>
    )
}
