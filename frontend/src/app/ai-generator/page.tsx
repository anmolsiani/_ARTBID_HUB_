'use client'

import { useState, useEffect } from 'react'
import {
    Sparkles,
    Image as ImageIcon,
    Type,
    Maximize2,
    Download,
    Share2,
    History as HistoryIcon,
    Settings2,
    Layers,
    Dices,
    Wand2,
    CheckCircle2,
    Clock,
    Zap,
    Palette
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/AuthModal'

export default function AIArtStudio() {
    const { isAuthenticated, isLoading } = useAuthStore()
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const router = useRouter()

    const [prompt, setPrompt] = useState('')
    const [selectedStyle, setSelectedStyle] = useState('Hyperrealistic')
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            setAuthModalOpen(true)
        }
    }, [isLoading, isAuthenticated])

    const [history, setHistory] = useState([
        { id: 1, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', prompt: 'Digital dream landscape' },
        { id: 2, url: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=400&q=80', prompt: 'Neon cyberpunk girl' },
        { id: 3, url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80', prompt: 'Abstract sunrise oil painting' },
    ])

    const styles = [
        { name: 'Hyperrealistic', icon: <ImageIcon size={18} /> },
        { name: 'Cyberpunk', icon: <Zap size={18} /> },
        { name: 'Oil Painting', icon: <Palette size={18} /> },
        { name: 'Anime', icon: <Palette size={18} /> },
        { name: '3D Render', icon: <Maximize2 size={18} /> },
        { name: 'Watercolor', icon: <ImageIcon size={18} /> },
    ]

    const handleGenerate = () => {
        if (!prompt) return
        setIsGenerating(true)
        setProgress(0)

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsGenerating(false)
                    return 100
                }
                return prev + 5
            })
        }, 150)
    }

    return (
        <div className="h-screen bg-[#020617] text-white flex flex-col overflow-hidden pt-16">
            {/* Header / Toolbar */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 glass backdrop-blur-3xl z-40">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-pixlr-gradient rounded-lg">
                        <Wand2 size={20} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tight hidden md:block">AI Art Studio</span>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 text-xs font-bold text-white/60">
                        <Clock size={12} />
                        <span>25 Tokens Left</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl hover:bg-white/5 transition-all text-white/60">
                        <Share2 size={20} />
                    </button>
                    <button className="px-6 py-2.5 btn-pixlr text-sm font-black flex items-center gap-2">
                        Download Result <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Tools */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-80 border-r border-white/5 studio-panel flex flex-col z-30"
                >
                    <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                        {/* Prompt Input */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 flex justify-between">
                                Prompt Engineering
                                <Dices size={14} className="cursor-pointer hover:text-primary transition-colors" />
                            </label>
                            <div className="relative group">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your masterpiece..."
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium resize-none group-focus-within:bg-white/10"
                                />
                                <div className="absolute bottom-3 right-3 opacity-40 hover:opacity-100 transition-opacity">
                                    <Sparkles size={16} className="text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* Image Reference */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Image Reference (Optional)</label>
                            <button className="w-full py-6 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-primary/50 transition-all group">
                                <ImageIcon size={24} className="text-white/20 group-hover:text-primary transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white">Upload Reference Pic</span>
                            </button>
                        </div>

                        {/* Style Selection */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Visual Style</label>
                            <div className="grid grid-cols-2 gap-3">
                                {styles.map((style) => (
                                    <button
                                        key={style.name}
                                        onClick={() => setSelectedStyle(style.name)}
                                        className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 ${selectedStyle === style.name
                                            ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10'
                                            : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                                            }`}
                                    >
                                        {style.icon}
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Controls */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Canvas Size</label>
                            <div className="flex gap-2">
                                <SizeButton label="1:1" active />
                                <SizeButton label="4:3" />
                                <SizeButton label="16:9" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40">Steps count</label>
                                <span className="text-xs font-black text-primary">50</span>
                            </div>
                            <input type="range" className="w-full accent-primary bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer" />
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/5">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${isGenerating || !prompt
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-pixlr-gradient text-white shadow-xl hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Generate Art</span>
                                    <Zap size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Center: Canvas Area */}
                <div className="flex-1 bg-black/40 flex items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="w-full max-w-2xl aspect-square glass rounded-[3rem] flex flex-col items-center justify-center p-12 text-center"
                            >
                                <div className="w-32 h-32 relative mb-8">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <div className="absolute inset-4 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin-slow" />
                                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-black">{progress}%</div>
                                </div>
                                <h2 className="text-3xl font-black mb-4">Crafting Your Vision...</h2>
                                <p className="text-white/40 font-medium max-w-sm">Combining thousands of artistic patterns to materialize your prompt.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="canvas"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full max-w-2xl aspect-square group relative"
                            >
                                <div className="absolute -inset-4 bg-pixlr-gradient blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                                <div className="relative w-full h-full rounded-[3rem] overflow-hidden glass border-4 border-white/10 shadow-3xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1200&q=80"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt="Current Canvas"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button className="p-4 rounded-2xl glass hover:bg-white/20 transition-all">
                                            <Maximize2 size={24} />
                                        </button>
                                        <button className="p-4 rounded-2xl glass hover:bg-white/20 transition-all">
                                            <Download size={24} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Canvas Controls */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 glass border border-white/5 p-2 rounded-2xl shadow-2xl backdrop-blur-2xl">
                        <CanvasBtn icon={<Layers size={18} />} tooltip="Layers" />
                        <CanvasBtn icon={<Type size={18} />} tooltip="Add Text" />
                        <CanvasBtn icon={<Settings2 size={18} />} tooltip="Filters" />
                        <div className="w-px h-6 bg-white/10 mx-2" />
                        <div className="flex items-center gap-2 px-3 text-xs font-black text-white/40 uppercase tracking-widest">
                            Zoom 100%
                        </div>
                    </div>
                </div>

                {/* Right Panel: History */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-72 border-l border-white/5 studio-panel flex flex-col z-30"
                >
                    <div className="p-6 flex items-center justify-between border-b border-white/5">
                        <span className="text-xs font-black uppercase tracking-widest text-white/40">History</span>
                        <HistoryIcon size={16} className="text-white/20" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className="group relative aspect-square rounded-2xl overflow-hidden glass border border-white/5 cursor-pointer hover:border-primary/50 transition-all"
                            >
                                <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="History Item" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <p className="text-[10px] font-bold line-clamp-2 leading-tight">{item.prompt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <AuthModal
                isOpen={authModalOpen}
                onClose={() => {
                    setAuthModalOpen(false)
                    router.push('/')
                }}
            />
        </div>
    )
}

function SizeButton({ label, active = false }: { label: string, active?: boolean }) {
    return (
        <button className={`flex-1 py-3 rounded-xl border text-xs font-black transition-all ${active
            ? 'bg-white/10 border-primary text-primary'
            : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
            }`}>
            {label}
        </button>
    )
}

function CanvasBtn({ icon, tooltip }: { icon: React.ReactNode, tooltip: string }) {
    return (
        <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/60 hover:text-white group relative">
            {icon}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {tooltip}
            </div>
        </button>
    )
}
