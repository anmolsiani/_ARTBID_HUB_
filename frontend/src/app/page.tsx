'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    Palette, Users, Sparkles, TrendingUp, ChevronRight, Play, Star, Plus, Lock
} from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import useAuthStore from '@/store/useAuthStore'
import AuthModal from '@/components/AuthModal'

export default function HomePage() {
    const [scrolled, setScrolled] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const router = useRouter()
    const { isAuthenticated } = useAuthStore()
    const heroRef = useRef(null)
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const y2 = useTransform(scrollY, [0, 500], [0, -150])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const featuredArt = [
        { id: 1, title: 'Abstract Sunrise', artist: 'Sarah Chen', price: '$299', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', size: 'large' },
        { id: 2, title: 'Digital Dreams', artist: 'Alex Rivera', price: '$499', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', size: 'small' },
        { id: 3, title: 'Neon Nights', artist: 'Maya Johnson', price: '$399', image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&q=80', size: 'medium' },
        { id: 4, title: 'Ocean Depths', artist: 'Chris Park', price: '$349', image: 'https://images.unsplash.com/photo-1454117096348-e4abbebe002c?w=800&q=80', size: 'medium' },
        { id: 5, title: 'Golden Hour', artist: 'Emma Davis', price: '$449', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80', size: 'large' },
        { id: 6, title: 'Cosmic Energy', artist: 'Jordan Lee', price: '$599', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80', size: 'small' },
    ]

    const features = [
        { icon: <Sparkles />, title: 'AI Art Studio', desc: 'Create stunning AI art with text-to-image studio.', color: 'from-purple-500 to-indigo-500' },
        { icon: <Palette />, title: 'Curated Gallery', desc: 'Browse the worlds finest human-made creations.', color: 'from-pink-500 to-rose-500' },
        { icon: <TrendingUp />, title: 'Live Auctions', desc: 'Bid on exclusive pieces in real-time auctions.', color: 'from-blue-500 to-cyan-500' },
        { icon: <Users />, title: 'Art Community', desc: 'Connect with artists and collectors globaly.', color: 'from-emerald-500 to-teal-500' },
    ]

    const handleProtectedNavigation = (e: React.MouseEvent, href: string) => {
        if (!isAuthenticated) {
            e.preventDefault()
            setAuthModalOpen(true)
        } else {
            router.push(href)
        }
    }

    return (
        <div className="relative overflow-hidden bg-[#020617] selection:bg-primary selection:text-white">
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />

                {/* Floating Elements */}
                <motion.div style={{ y: y1 }} className="absolute top-1/4 left-10 hidden xl:block z-0">
                    <HeroCard image={featuredArt[0].image} rotate={-10} offset={20} />
                </motion.div>
                <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-10 hidden xl:block z-0">
                    <HeroCard image={featuredArt[2].image} rotate={12} offset={-20} />
                </motion.div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-6 py-2 rounded-full glass border border-white/10 text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-8 shadow-2xl">
                            The Future of Creative Expression
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[1.1] tracking-tighter">
                            Create. Edit. <br />
                            <span className="text-gradient">Share Your Art.</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
                    >
                        Experience the worlds leading creative community. <br className="hidden md:block" />
                        Built for artists, fueled by AI, loved by creators.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    >
                        <button
                            onClick={(e) => handleProtectedNavigation(e, '/ai-generator')}
                            className="btn-pixlr py-5 px-12 text-sm font-black uppercase tracking-widest group shadow-2xl"
                        >
                            Start Creating Free
                            <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <Link href="/explore" className="px-12 py-5 font-black text-sm uppercase tracking-widest glass rounded-full hover:bg-white/10 transition-all border-white/10">
                            Explore Gallery
                        </Link>
                    </motion.div>
                </div>

                {/* Background Artcards (Mobile/Tablet Version) */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 xl:hidden opacity-30 pointer-events-none">
                    <HeroCard image={featuredArt[1].image} rotate={-5} />
                    <HeroCard image={featuredArt[4].image} rotate={5} />
                </div>
            </section>


            {/* Features Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Built for Every Creator</h2>
                        <p className="text-xl text-muted-foreground font-medium">Professional tools, intuitive interface.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="glass-dark p-8 rounded-3xl border border-white/5 group relative overflow-hidden"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                                <p className="text-muted-foreground font-medium mb-6">{feature.desc}</p>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <Star className="w-12 h-12" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Generator Preview */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-6">
                                <Sparkles size={16} /> AI Synthetic Studio
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                                Dream it, <br />
                                <span className="text-gradient">Generate it.</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-10 font-medium leading-relaxed max-w-xl">
                                Our neural engine understands the nuance of art. From cyberpunk landscapes to renaissance portraits, create masterpiece-level assets with simple text.
                            </p>

                            {/* Interactive Preview Controls */}
                            <div className="space-y-6 glass-dark p-8 rounded-[2.5rem] border border-white/10 mb-10 shadow-2xl">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Text Prompt</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Imagine something legendary..."
                                            disabled
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none opacity-60 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {['Realistic', 'Abstract', 'Cyberpunk', 'Oil Painting'].map(style => (
                                        <div key={style} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20">
                                            {style}
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            setAuthModalOpen(true);
                                        } else {
                                            router.push('/ai-generator');
                                        }
                                    }}
                                    className="w-full btn-pixlr py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
                                >
                                    {!isAuthenticated && <Lock size={18} className="text-white/60" />}
                                    {isAuthenticated ? 'Enter AI Studio' : 'Sign in to Unlock'}
                                    <Sparkles size={18} />
                                </motion.button>
                            </div>

                            <div className="flex items-center gap-4 text-white/40 font-bold text-sm">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-white/10" />
                                    ))}
                                </div>
                                Joined by 2,400+ creators this hour
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 w-full relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="glass p-3 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                                <div className="aspect-[4/5] rounded-[2.8rem] overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                        alt="AI Art Preview"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="glass-dark p-6 rounded-2xl border border-white/10 backdrop-blur-2xl">
                                            <p className="text-sm font-medium text-white/80 leading-relaxed italic">
                                                "A futuristic goddess made of liquid chrome and starlight, 8k resolution, cinematic lighting..."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Metadata */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute -top-6 -right-6 glass p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl"
                            >
                                <div className="w-10 h-10 rounded-xl bg-pixlr-gradient flex items-center justify-center text-white">
                                    <Sparkles size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Status</div>
                                    <div className="text-xs font-bold">Engine Optimal</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Masonry-Style Gallery */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black mb-4">Explore Community</h2>
                            <p className="text-xl text-muted-foreground font-medium">Trending human-made and AI art from our global creators.</p>
                        </div>
                        <Link href="/explore" className="px-8 py-4 font-bold glass rounded-full hover:bg-white/10 transition-all">
                            View Full Gallery
                        </Link>
                    </div>

                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                        {featuredArt.map((art, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative break-inside-avoid rounded-3xl overflow-hidden border border-white/5 bg-white/5"
                            >
                                <img src={art.image} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" alt={art.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-8 flex flex-col justify-end">
                                    <h3 className="text-2xl font-black mb-1">{art.title}</h3>
                                    <p className="text-white/60 mb-4 font-bold">by {art.artist}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-primary">{art.price}</span>
                                        <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global CTA */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="relative p-12 md:p-24 rounded-[4rem] overflow-hidden bg-pixlr-gradient text-center"
                    >
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-8xl font-black mb-8 leading-none">Ready to unleash <br />your creativity?</h2>
                            <p className="text-xl md:text-2xl font-medium mb-12 opacity-90 max-w-2xl mx-auto">Join 100K+ artists and collectors in the most vibrant art hub on the planet.</p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link href="/register" className="px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:bg-secondary hover:text-white transition-all shadow-2xl">
                                    Join ArtBid Hub
                                </Link>
                                <Link href="/about" className="px-12 py-6 bg-black/20 text-white border border-white/20 rounded-full font-black text-xl hover:bg-black/40 transition-all">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Social Proof */}
            <div className="py-20 border-t border-white/5 glass">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    <div>
                        <div className="text-4xl font-black text-gradient">100K+</div>
                        <div className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Active Creators</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gradient">500K+</div>
                        <div className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Artworks Shared</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gradient">1M+</div>
                        <div className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Monthly Views</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-gradient">$2M+</div>
                        <div className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Artist Earnings</div>
                    </div>
                </div>
            </div>

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
    )
}

function HeroCard({ image, rotate, offset = 0 }: { image: string, rotate: number, offset?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-64 h-80 rounded-[2.5rem] overflow-hidden glass p-3 border border-white/10 shadow-2xl relative"
            style={{ x: offset }}
        >
            <div className="w-full h-full rounded-[2rem] overflow-hidden">
                <img src={image} className="w-full h-full object-cover" alt="Hero Art" />
            </div>
        </motion.div>
    )
}
