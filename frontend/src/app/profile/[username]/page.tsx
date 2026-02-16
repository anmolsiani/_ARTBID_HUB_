'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    User, MapPin, Calendar, Link as LinkIcon, Twitter, Instagram, Globe,
    Heart, Eye, Palette, Users, Grid3X3, MessageCircle, Settings,
    ArrowLeft, ExternalLink, Sparkles, Crown, CheckCircle2, UserPlus, UserMinus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { userAPI } from '@/lib/api'
import useAuthStore from '@/store/useAuthStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
    const params = useParams()
    const router = useRouter()
    const username = params.username as string
    const { user: currentUser, isAuthenticated } = useAuthStore()

    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [activeTab, setActiveTab] = useState<'gallery' | 'likes' | 'about'>('gallery')

    const isOwnProfile = currentUser?.username === username

    useEffect(() => {
        if (username) {
            fetchProfile()
        }
    }, [username])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const response = await userAPI.getProfile(username)
            setProfile(response.data.user)
            if (currentUser && response.data.user.followers) {
                setIsFollowing(response.data.user.followers.some((f: any) =>
                    (typeof f === 'string' ? f : f._id || f) === currentUser.id
                ))
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error)
            toast.error('User not found')
        } finally {
            setLoading(false)
        }
    }

    const handleFollow = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to follow users')
            return
        }
        try {
            const response = await userAPI.follow(profile._id)
            setIsFollowing(response.data.isFollowing)
            setProfile((prev: any) => ({
                ...prev,
                followersCount: response.data.isFollowing
                    ? (prev.followersCount || 0) + 1
                    : Math.max((prev.followersCount || 0) - 1, 0)
            }))
            toast.success(response.data.message)
        } catch (error) {
            toast.error('Failed to update follow status')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/40 font-bold text-sm">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <User size={48} className="text-white/20" />
                    </div>
                    <h2 className="text-3xl font-black mb-3">User Not Found</h2>
                    <p className="text-white/40 font-medium mb-8">The profile you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/explore" className="btn-pixlr px-8 py-4 font-black text-sm uppercase tracking-widest">
                        Explore Artists
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-20 pb-16">
            {/* Background Effects */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] pointer-events-none z-0" />

            <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mb-8 text-white/40 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">Back</span>
                </motion.button>

                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass border border-white/10 rounded-[3rem] overflow-hidden mb-8"
                >
                    {/* Banner */}
                    <div className="h-48 md:h-56 relative overflow-hidden">
                        <div className="absolute inset-0 bg-pixlr-gradient opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
                        {/* Abstract pattern */}
                        <div className="absolute inset-0 opacity-20">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        width: `${80 + i * 40}px`,
                                        height: `${80 + i * 40}px`,
                                        left: `${10 + i * 15}%`,
                                        top: `${20 + (i % 2) * 30}%`,
                                        background: i % 2 === 0
                                            ? 'radial-gradient(circle, rgba(124,58,237,0.4), transparent)'
                                            : 'radial-gradient(circle, rgba(236,72,153,0.4), transparent)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="px-8 md:px-12 pb-10 -mt-16 relative">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                            {/* Avatar */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative"
                            >
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-pixlr-gradient p-1 shadow-2xl shadow-black/50">
                                    <div className="w-full h-full rounded-[1.3rem] overflow-hidden bg-[#020617] flex items-center justify-center">
                                        {profile.avatar && profile.avatar !== 'https://res.cloudinary.com/demo/image/upload/avatar-default.png' ? (
                                            <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl font-black text-gradient">
                                                {profile.username?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {profile.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-[#020617]">
                                        <CheckCircle2 size={14} className="text-white" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{profile.displayName || profile.username}</h1>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-white/40 font-bold">@{profile.username}</span>
                                            <span className="px-3 py-0.5 rounded-full glass text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                                                {profile.role === 'developer' ? 'Developer' : profile.role === 'admin' ? 'Admin' : 'Artist'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {profile.bio && (
                                    <p className="text-white/60 font-medium leading-relaxed max-w-xl mb-4">{profile.bio}</p>
                                )}

                                <div className="flex items-center gap-6 text-sm">
                                    <div className="text-center">
                                        <span className="text-2xl font-black">{profile.artworkCount || 0}</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Artworks</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="text-center">
                                        <span className="text-2xl font-black">{profile.followersCount || 0}</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Followers</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="text-center">
                                        <span className="text-2xl font-black">{profile.followingCount || 0}</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Following</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {isOwnProfile ? (
                                    <Link href="/settings" className="px-8 py-4 glass border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                        <Settings size={16} /> Edit Profile
                                    </Link>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleFollow}
                                            className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all ${isFollowing
                                                ? 'glass border border-white/10 text-white hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400'
                                                : 'bg-pixlr-gradient text-white shadow-xl shadow-primary/20 hover:scale-[1.02]'
                                                }`}
                                        >
                                            {isFollowing ? <><UserMinus size={16} /> Unfollow</> : <><UserPlus size={16} /> Follow</>}
                                        </button>
                                        <Link
                                            href="/messages"
                                            className="p-4 glass border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                                        >
                                            <MessageCircle size={18} className="text-primary" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Social Links */}
                {(profile.socialLinks?.twitter || profile.socialLinks?.instagram || profile.socialLinks?.portfolio) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-3 mb-8"
                    >
                        {profile.socialLinks?.twitter && (
                            <a href={`https://twitter.com/${profile.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-3 glass border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold">
                                <Twitter size={16} className="text-blue-400" /> @{profile.socialLinks.twitter}
                            </a>
                        )}
                        {profile.socialLinks?.instagram && (
                            <a href={`https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-3 glass border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold">
                                <Instagram size={16} className="text-pink-400" /> @{profile.socialLinks.instagram}
                            </a>
                        )}
                        {profile.socialLinks?.portfolio && (
                            <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-3 glass border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold">
                                <Globe size={16} className="text-green-400" /> Portfolio <ExternalLink size={12} />
                            </a>
                        )}
                    </motion.div>
                )}

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex p-1.5 bg-white/5 rounded-2xl mb-10 border border-white/5 w-fit"
                >
                    <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<Grid3X3 size={14} />} label="Gallery" />
                    <TabButton active={activeTab === 'likes'} onClick={() => setActiveTab('likes')} icon={<Heart size={14} />} label="Liked" />
                    <TabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={<User size={14} />} label="About" />
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-16 text-center glass border border-white/5 rounded-[3rem]"
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Palette size={40} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">
                                {isOwnProfile ? 'No artworks yet' : `${profile.displayName || profile.username} hasn't posted yet`}
                            </h3>
                            <p className="text-white/40 font-medium mb-8">
                                {isOwnProfile ? 'Start creating and upload your first masterpiece!' : 'Check back later for new creations.'}
                            </p>
                            {isOwnProfile && (
                                <Link href="/upload" className="btn-pixlr px-10 py-4 font-black uppercase tracking-widest text-sm">
                                    Upload Art
                                </Link>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'likes' && (
                        <motion.div
                            key="likes"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-16 text-center glass border border-white/5 rounded-[3rem]"
                        >
                            <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={40} className="text-pink-500" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">No liked artworks</h3>
                            <p className="text-white/40 font-medium">Like artworks to save them here.</p>
                        </motion.div>
                    )}

                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass border border-white/5 rounded-[3rem] p-10"
                        >
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <Sparkles className="text-primary" size={20} />
                                About {profile.displayName || profile.username}
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4  text-white/60">
                                    <User size={18} className="text-white/30" />
                                    <span className="font-medium">{profile.role === 'developer' ? 'Developer' : 'Digital Artist'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-white/60">
                                    <Calendar size={18} className="text-white/30" />
                                    <span className="font-medium">Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                                {profile.bio && (
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-white/60 font-medium leading-relaxed">{profile.bio}</p>
                                    </div>
                                )}
                                {!profile.bio && (
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-white/30 font-medium italic">No bio provided yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active
                ? 'bg-primary text-white shadow-xl'
                : 'text-white/30 hover:text-white hover:bg-white/5'
                }`}
        >
            {icon}
            {label}
        </button>
    )
}
