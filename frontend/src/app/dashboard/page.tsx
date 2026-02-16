'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/useAuthStore';
import {
    TrendingUp,
    Users,
    Heart,
    Eye,
    Upload,
    Sparkles,
    MessageCircle,
    ArrowRight,
    Palette,
    Zap,
    LayoutGrid,
    Search,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { artAPI } from '@/lib/api';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        artworks: 0,
        followers: 128,
        likes: 1543,
        views: 8421
    });
    const [recentArts, setRecentArts] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await artAPI.getAll({ user: user?._id, limit: 6 });
            setRecentArts(response.data || []);
            setStats(prev => ({ ...prev, artworks: response.data?.length || 0 }));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-12 px-4 md:px-8 lg:px-12">
            {/* Background Glows */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                                Artist Dashboard
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Welcome back, <span className="text-gradient">{user?.username}</span>!
                        </h1>
                        <p className="text-white/40 font-medium mt-2">Your creative empire is flourishing today.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-4 rounded-2xl glass border border-white/5 hover:bg-white/10 transition-all group relative">
                            <Bell size={20} className="text-white/60 group-hover:text-white" />
                            <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <Link href="/upload" className="btn-pixlr px-8 py-4 flex items-center gap-2 font-black text-sm uppercase tracking-widest">
                            Upload New Art <Upload size={18} />
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    <StatCard
                        title="Artworks"
                        value={stats.artworks}
                        change="+2"
                        icon={<Palette className="text-primary" size={24} />}
                        color="from-primary/20 to-purple-500/0"
                    />
                    <StatCard
                        title="Followers"
                        value={stats.followers}
                        change="+12"
                        icon={<Users className="text-blue-500" size={24} />}
                        color="from-blue-500/20 to-cyan-500/0"
                    />
                    <StatCard
                        title="Total Likes"
                        value={stats.likes}
                        change="+84"
                        icon={<Heart className="text-pink-500" size={24} />}
                        color="from-pink-500/20 to-rose-500/0"
                    />
                    <StatCard
                        title="Profile Views"
                        value={stats.views}
                        change="+243"
                        icon={<Eye className="text-yellow-500" size={24} />}
                        color="from-yellow-500/20 to-orange-500/0"
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Activity & Tools */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Quick Studio Tools */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass border border-white/5 rounded-[2.5rem] p-8"
                        >
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <Zap className="text-primary" size={20} />
                                Quick Tools
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <ToolItem
                                    href="/ai-generator"
                                    title="AI Art Laboratory"
                                    desc="Generate high-fidelity assets"
                                    icon={<Sparkles size={24} />}
                                    color="bg-primary"
                                />
                                <ToolItem
                                    href="/messages"
                                    title="Artist Circle"
                                    desc="Join global collaborations"
                                    icon={<MessageCircle size={24} />}
                                    color="bg-pink-500"
                                />
                                <ToolItem
                                    href="/explore"
                                    title="Infinite Gallery"
                                    desc="Discover trending inspirations"
                                    icon={<LayoutGrid size={24} />}
                                    color="bg-blue-500"
                                />
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass border border-white/5 rounded-[2.5rem] p-8"
                        >
                            <h3 className="text-xl font-black mb-6 flex items-center justify-between">
                                Activity Feed
                                <Link href="/notifications" className="text-xs text-primary font-bold uppercase tracking-widest hover:underline">View All</Link>
                            </h3>
                            <div className="space-y-6">
                                <ActivityItem user="Sarah Connor" action="liked your artwork" time="2m ago" />
                                <ActivityItem user="John Doe" action="followed you" time="15m ago" />
                                <ActivityItem user="ArtCollector" action="added CyberNeon to wishlist" time="1h ago" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Recent Artworks Masonry-style */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black">My Recent Creations</h2>
                            <Link href="/profile" className="flex items-center gap-2 text-sm font-black text-primary hover:text-white transition-colors group">
                                Manage Gallery <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : recentArts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {recentArts.map((art: any, i: number) => (
                                    <motion.div
                                        key={art._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass border border-white/10 shadow-2xl"
                                    >
                                        <img
                                            src={art.image}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            alt={art.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                        <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <h4 className="text-xl font-black mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{art.title}</h4>
                                            <div className="flex items-center gap-4 text-xs font-bold text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="flex items-center gap-1"><Eye size={12} /> {art.views || 0}</span>
                                                <span className="flex items-center gap-1"><Heart size={12} /> {art.likes?.length || 0}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center glass border border-white/5 rounded-[3rem]">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Palette size={40} className="text-primary" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">No creations found</h3>
                                <p className="text-white/40 font-medium mb-8">Your digital legacy starts with a single upload.</p>
                                <Link href="/upload" className="btn-pixlr px-10 py-4 font-black uppercase tracking-widest text-sm">
                                    Start Creating
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon, color }: { title: string, value: number | string, change: string, icon: React.ReactNode, color: string }) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative p-8 rounded-[2.5rem] glass border border-white/10 overflow-hidden group transition-all`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                        {icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black tracking-widest uppercase">
                        {change}
                    </span>
                </div>
                <h4 className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">{title}</h4>
                <p className="text-4xl font-black tabular-nums">{value}</p>
            </div>
        </motion.div>
    )
}

function ToolItem({ href, title, desc, icon, color }: { href: string, title: string, desc: string, icon: React.ReactNode, color: string }) {
    return (
        <Link href={href} className="flex items-center gap-5 p-4 rounded-3xl group hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-2xl shadow-black/40 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <h4 className="font-black text-sm group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-[11px] font-bold text-white/30">{desc}</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-white/10 group-hover:text-white transition-colors group-hover:translate-x-1" />
        </Link>
    )
}

function ActivityItem({ user, action, time }: { user: string, action: string, time: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/10 to-transparent flex items-center justify-center font-black text-xs">
                {user[0]}
            </div>
            <div className="flex-1">
                <p className="text-xs font-medium">
                    <span className="font-black text-white">{user}</span> {action}
                </p>
                <span className="text-[10px] font-black text-white/20 uppercase">{time}</span>
            </div>
        </div>
    )
}
