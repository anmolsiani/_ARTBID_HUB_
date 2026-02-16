'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { artAPI } from '@/lib/api';
import ArtCard from '@/components/ArtCard';
import {
    Search,
    SlidersHorizontal,
    X,
    LayoutGrid,
    Zap,
    Palette,
    Clock,
    TrendingUp,
    ChevronDown,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function ExploreContent() {
    const searchParams = useSearchParams();
    const [arts, setArts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        type: searchParams.get('type') || 'all',
        category: 'all',
        sort: 'latest',
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        fetchArts();
    }, [filters.type, filters.sort, filters.category]);

    const fetchArts = async () => {
        try {
            setLoading(true);
            const params = {
                ...(filters.search && { search: filters.search }),
                ...(filters.type !== 'all' && { type: filters.type }),
                ...(filters.category !== 'all' && { category: filters.category }),
                sort: filters.sort
            };
            const response = await artAPI.getAll(params);
            setArts(response.data || []);
        } catch (error) {
            console.error('Error fetching arts:', error);
            toast.error('Failed to load artworks');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchArts();
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 px-4 md:px-8 lg:px-12 pb-20 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#7c3aed0a_0%,transparent_50%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
                {/* Sidebar Filters */}
                <motion.aside
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`lg:w-80 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
                >
                    <div className="glass border border-white/5 rounded-[2.5rem] p-8 sticky top-28">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <Filter size={18} className="text-primary" />
                                Workshop Filters
                            </h3>
                            <button className="lg:hidden" onClick={() => setShowFilters(false)}>
                                <X size={20} className="text-white/40" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="mb-8">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-xs font-bold"
                                />
                            </div>
                        </form>

                        {/* Creation Type */}
                        <div className="space-y-4 mb-10">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Creation Source</label>
                            <div className="grid grid-cols-1 gap-2">
                                <FilterToggle
                                    active={filters.type === 'all'}
                                    label="All Origins"
                                    icon={<LayoutGrid size={16} />}
                                    onClick={() => setFilters(p => ({ ...p, type: 'all' }))}
                                />
                                <FilterToggle
                                    active={filters.type === 'ai'}
                                    label="AI Synthetic"
                                    icon={<Zap size={16} />}
                                    onClick={() => setFilters(p => ({ ...p, type: 'ai' }))}
                                />
                                <FilterToggle
                                    active={filters.type === 'human'}
                                    label="Human Mastery"
                                    icon={<Palette size={16} />}
                                    onClick={() => setFilters(p => ({ ...p, type: 'human' }))}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-4 mb-10">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Artistic Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(p => ({ ...p, category: e.target.value }))}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 outline-none"
                            >
                                <option value="all">Everywhere</option>
                                <option value="abstract">Abstract</option>
                                <option value="cyberpunk">Cyberpunk</option>
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Curation Order</label>
                            <div className="flex flex-wrap gap-2">
                                <SortBtn
                                    active={filters.sort === 'latest'}
                                    label="Newest"
                                    onClick={() => setFilters(p => ({ ...p, sort: 'latest' }))}
                                />
                                <SortBtn
                                    active={filters.sort === 'popular'}
                                    label="Trending"
                                    onClick={() => setFilters(p => ({ ...p, sort: 'popular' }))}
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setFilters({ search: '', type: 'all', category: 'all', sort: 'latest', minPrice: '', maxPrice: '' })}
                            className="w-full mt-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Reset Laboratory
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-2">Explore the <span className="text-gradient">Unknown.</span></h2>
                            <p className="text-white/40 font-medium">Curation of {arts.length} exceptional digital assets.</p>
                        </div>
                        <button
                            className="lg:hidden p-4 rounded-2xl glass border border-white/5 transition-all"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-[3/4] rounded-[3rem] bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : arts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AnimatePresence>
                                {arts.map((art: any, i: number) => (
                                    <motion.div
                                        key={art._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <ArtCard art={art} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="py-24 text-center glass border border-white/5 rounded-[3rem]">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={40} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">The canvas is empty</h3>
                            <p className="text-white/40 font-medium mb-8">No results match your current workshop configuration.</p>
                            <button
                                onClick={() => setFilters(p => ({ ...p, search: '', type: 'all', category: 'all' }))}
                                className="btn-pixlr px-10 py-4 font-black uppercase tracking-widest text-sm"
                            >
                                Expand Search
                            </button>
                        </div>
                    )}

                    {arts.length > 0 && !loading && (
                        <div className="mt-16 flex justify-center">
                            <button className="px-12 py-5 glass border border-white/10 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95">
                                Load More Inspirations
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div className="h-screen bg-[#020617] flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
            <ExploreContent />
        </Suspense>
    )
}

function FilterToggle({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${active
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                }`}
        >
            <span className={active ? 'text-primary' : 'text-white/20'}>{icon}</span>
            <span className="text-xs font-bold">{label}</span>
        </button>
    )
}

function SortBtn({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/20 hover:text-white'
                }`}
        >
            {label}
        </button>
    )
}
