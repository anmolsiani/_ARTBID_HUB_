'use client'

import { useState } from 'react'
import { Upload, X, Palette, Sparkles, Image as ImageIcon, ChevronRight, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { artAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function LibraryUploadPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Abstract',
        tags: '',
        isFree: true
    })

    const handleFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            setFile(file)
            const reader = new FileReader()
            reader.onload = (e) => setPreview(e.target?.result as string)
            reader.readAsDataURL(file)
        } else {
            toast.error('Please upload an image file')
        }
    }

    const onDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            toast.error('Please select an artwork to upload')
            return
        }

        setLoading(true)
        try {
            const data = new FormData()
            data.append('image', file)
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('category', formData.category)
            data.append('tags', formData.tags)
            data.append('isFree', String(formData.isFree))

            await artAPI.create(data)
            toast.success('Artwork contributed to the library!')
            router.push('/free-library')
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload artwork')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 px-4 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <span className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                        <Palette size={14} /> Contribute to Community
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Upload to <span className="text-gradient">Library</span></h1>
                    <p className="text-white/40 font-medium">Share your creations with the world. Assets will be available for free discovery.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Upload Zone */}
                    <div className="space-y-6">
                        <div
                            onDragEnter={onDrag}
                            onDragLeave={onDrag}
                            onDragOver={onDrag}
                            onDrop={onDrop}
                            className={`relative aspect-square rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer ${dragActive
                                ? 'border-primary bg-primary/5'
                                : preview ? 'border-transparent' : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} className="absolute inset-0 w-full h-full object-cover rounded-[3rem]" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-[3rem]">
                                        <button
                                            onClick={() => { setPreview(null); setFile(null); }}
                                            className="p-4 bg-red-500 rounded-full text-white shadow-xl hover:scale-110 transition-transform"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-pixlr-gradient rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-2xl">
                                        <Upload size={40} />
                                    </div>
                                    <h3 className="text-xl font-black mb-2">Drop your masterpiece</h3>
                                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Supports JPG, PNG (Max 10MB)</p>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                    />
                                </>
                            )}
                        </div>

                        <div className="glass-dark p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">License Status</span>
                                <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                            <p className="text-xs font-bold text-white/60 leading-relaxed">
                                By uploading, you agree to release this asset under the ArtBid Hub Creative License. Community users can download and use it for free with attribution.
                            </p>
                        </div>
                    </div>

                    {/* Right: metadata */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Artwork Title</label>
                            <input
                                type="text"
                                placeholder="Golden Hour in Cyberspace"
                                value={formData.title}
                                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold appearance-none cursor-pointer"
                            >
                                {['Abstract', 'Cyberpunk', 'Minimalist', 'Motivational', 'Nature', 'Business', 'Tech'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Description</label>
                            <textarea
                                placeholder="Tell the story behind this piece..."
                                value={formData.description}
                                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-4 p-4 glass-dark rounded-2xl border border-white/5">
                            <input
                                type="checkbox"
                                checked={formData.isFree}
                                onChange={(e) => setFormData(p => ({ ...p, isFree: e.target.checked }))}
                                className="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-primary focus:ring-primary/50 cursor-pointer"
                            />
                            <div className="flex-1">
                                <div className="text-xs font-black uppercase tracking-widest">Mark as Free Asset</div>
                                <div className="text-[10px] text-white/30 font-bold">Allow anyone to download for discovery</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${loading
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-pixlr-gradient text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Publishing to Library...
                                </>
                            ) : (
                                <>
                                    Finalize & Upload <Sparkles size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
