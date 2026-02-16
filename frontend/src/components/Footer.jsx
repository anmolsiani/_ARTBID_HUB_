import Link from 'next/link';
import { Palette, Facebook, Twitter, Instagram, Youtube, Mail, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="relative bg-[#020617] pt-24 pb-12 px-6 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 opacity-50" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-5 space-y-10">
                        <div>
                            <Link href="/" className="flex items-center gap-3 mb-6 group">
                                <div className="p-2.5 rounded-2xl bg-pixlr-gradient shadow-xl group-hover:rotate-12 transition-transform duration-500">
                                    <Palette className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-3xl font-black text-gradient tracking-tighter">ArtBid Hub</span>
                            </Link>
                            <p className="text-white/40 text-lg font-medium leading-relaxed max-w-md">
                                The world's premier destination for digital pioneers. Discover, build, and trade exceptional synthetic and human-made creations.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                <Sparkles size={14} /> Elite Newsletter
                            </h4>
                            <form className="relative max-w-md group">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full pl-6 pr-32 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-bold text-sm"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 bottom-2 px-6 bg-pixlr-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                >
                                    Join <Send size={12} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8">Workshop</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/explore">Global Gallery</FooterLink>
                                <FooterLink href="/ai-generator">AI Studio</FooterLink>
                                <FooterLink href="/explore?type=human">Human Mastery</FooterLink>
                                <FooterLink href="/auctions">Live Bidding</FooterLink>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8">Collective</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/about">Our Vision</FooterLink>
                                <FooterLink href="/blog">Studio Blog</FooterLink>
                                <FooterLink href="/help">Knowledge Hub</FooterLink>
                                <FooterLink href="/contact">Support</FooterLink>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8">Nexus</h4>
                            <div className="flex flex-wrap gap-4">
                                <SocialIcon icon={<Twitter size={18} />} />
                                <SocialIcon icon={<Instagram size={18} />} />
                                <SocialIcon icon={<Youtube size={18} />} />
                                <SocialIcon icon={<Mail size={18} />} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                        &copy; {new Date().getFullYear()} ArtBid Hub. Synthesized by Creative Minds.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Privacy Lexicon</Link>
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Protocol</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }) {
    return (
        <li>
            <Link href={href} className="text-sm font-bold text-white/60 hover:text-primary transition-all duration-300 flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ icon }) {
    return (
        <a href="#" className="w-12 h-12 glass border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1">
            {icon}
        </a>
    );
}
