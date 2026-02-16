'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, User, LogOut, Settings, LayoutDashboard, Upload, MessageCircle, Palette, Sparkles } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/explore?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleProtectedLink = (e, href) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setAuthModalOpen(true);
        } else {
            setMobileMenuOpen(false);
        }
    };

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-dark h-16 shadow-2xl' : 'bg-transparent h-20'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 20, scale: 1.1 }}
                                className="p-2 rounded-xl bg-pixlr-gradient shadow-lg shadow-primary/20"
                            >
                                <Palette className="w-6 h-6 text-white" />
                            </motion.div>
                            <span className="text-2xl font-black text-gradient group-hover:opacity-80 transition-opacity tracking-tighter">
                                ArtBid Hub
                            </span>
                        </Link>

                        {/* Desktop Search */}
                        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-12">
                            <div className="relative w-full group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search creative art..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-2.5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all backdrop-blur-md text-sm font-medium"
                                />
                            </div>
                        </form>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <NavLink href="/explore" active={pathname === '/explore'}>Explore</NavLink>
                            <NavLink href="/ai-generator" active={pathname === '/ai-generator'} onClick={(e) => handleProtectedLink(e, '/ai-generator')}>
                                <span className="flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-primary" />
                                    AI Studio
                                </span>
                            </NavLink>
                            <NavLink href="/messages" active={pathname === '/messages'} onClick={(e) => handleProtectedLink(e, '/messages')}>Messages</NavLink>
                        </div>

                        {/* Auth & Profile */}
                        <div className="hidden md:flex items-center gap-6 ml-8">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-3 p-1 pr-4 glass rounded-full hover:bg-white/20 transition-all border-white/10"
                                    >
                                        <div className="w-9 h-9 bg-pixlr-gradient rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                            {user?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span className="font-bold text-sm text-white/90">{user?.username}</span>
                                    </motion.button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setUserMenuOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-4 w-60 glass-dark border border-white/10 rounded-3xl shadow-3xl py-3 z-50 backdrop-blur-3xl overflow-hidden"
                                                >
                                                    <div className="px-6 py-4 border-b border-white/5 mb-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Current Artist</p>
                                                        <p className="font-bold text-sm truncate">{user?.displayName || user?.username}</p>
                                                    </div>
                                                    <DropdownItem href="/dashboard" icon={<LayoutDashboard size={18} />}>Dashboard</DropdownItem>
                                                    <DropdownItem href={`/profile/${user?.username}`} icon={<User size={18} />}>My Profile</DropdownItem>
                                                    <DropdownItem href="/upload" icon={<Upload size={18} />}>Upload Art</DropdownItem>
                                                    <DropdownItem href="/settings" icon={<Settings size={18} />}>Settings</DropdownItem>
                                                    <hr className="my-2 border-white/5" />
                                                    <button
                                                        onClick={() => { setUserMenuOpen(false); logout(); }}
                                                        className="w-full flex items-center gap-3 px-6 py-3 text-destructive hover:bg-destructive/10 transition-all font-bold text-sm"
                                                    >
                                                        <LogOut size={18} />
                                                        Logout
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href="/login" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors px-4">
                                        Log In
                                    </Link>
                                    <Link href="/register" className="btn-pixlr text-sm uppercase tracking-widest py-3 px-8">
                                        Join Hub
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl glass hover:bg-white/20 transition-all border-white/10"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden glass-dark border-t border-white/5 overflow-hidden"
                        >
                            <div className="px-6 py-10 space-y-8">
                                <form onSubmit={handleSearch} className="mb-10">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="text"
                                            placeholder="Search creative art..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                                        />
                                    </div>
                                </form>

                                <MobileLink href="/explore" onClick={() => setMobileMenuOpen(false)}>Explore</MobileLink>
                                <MobileLink href="/ai-generator" onClick={(e) => handleProtectedLink(e, '/ai-generator')}>AI Studio</MobileLink>
                                <MobileLink href="/messages" onClick={(e) => handleProtectedLink(e, '/messages')}>Messages</MobileLink>
                                <MobileLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileLink>

                                <div className="pt-10 border-t border-white/5 space-y-4">
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="block w-full text-center py-5 glass rounded-2xl font-black text-sm uppercase tracking-widest"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => { setMobileMenuOpen(false); logout(); }}
                                                className="w-full py-5 text-destructive font-black text-sm uppercase tracking-widest text-center"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Link href="/login" className="py-5 glass rounded-2xl font-black text-sm uppercase tracking-widest text-center">
                                                Log In
                                            </Link>
                                            <Link href="/register" className="btn-pixlr py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-center">
                                                Join Hub
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
}

function NavLink({ href, children, active, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative group overflow-hidden font-black text-[11px] uppercase tracking-widest transition-colors duration-300 ${active ? 'text-primary' : 'text-white/70 hover:text-white'
                }`}
        >
            <span className="block">{children}</span>
            <span className={`absolute bottom-0 left-0 h-0.5 bg-pixlr-gradient transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
        </Link>
    );
}

function DropdownItem({ href, icon, children }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest opacity-80 hover:opacity-100 group"
        >
            <span className="text-primary group-hover:scale-110 transition-transform">{icon}</span>
            {children}
        </Link>
    );
}

function MobileLink({ href, onClick, children }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block text-3xl font-black text-gradient hover:opacity-70 transition-opacity tracking-tight"
        >
            {children}
        </Link>
    );
}

