'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Search,
    Send,
    MoreVertical,
    Phone,
    Video,
    Image as ImageIcon,
    Smile,
    Paperclip,
    User,
    Circle,
    ArrowLeft,
    Sparkles,
    Users,
    MessageCircle,
    Plus,
    X,
    Settings,
    Shield
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useChatStore from '@/store/useChatStore'
import useAuthStore from '@/store/useAuthStore'
import { socketService } from '@/lib/socket'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/AuthModal'

export default function MessengerPage() {
    const { user, isAuthenticated, isLoading } = useAuthStore()
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            setAuthModalOpen(true)
        }
    }, [isLoading, isAuthenticated])

    const {
        conversations,
        activeConversation,
        messages,
        fetchConversations,
        fetchMessages,
        sendMessage,
        addMessage,
        createGroup
    } = useChatStore()

    const [activeTab, setActiveTab] = useState<'dm' | 'group' | 'all'>('all')
    const [newMessage, setNewMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [showGroupModal, setShowGroupModal] = useState(false)
    const [showMemberSidebar, setShowMemberSidebar] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchConversations()

        // Socket listeners
        socketService.on('new_message', (message) => {
            addMessage(message)
        })

        socketService.on('user_typing', (data) => {
            if (data.conversationId === activeConversation && data.userId !== user?.id) {
                setIsTyping(data.isTyping)
            }
        })

        return () => {
            socketService.off('new_message')
            socketService.off('user_typing')
        }
    }, [activeConversation])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeConversation) return

        const activeConv = conversations.find((c: any) => c._id === activeConversation)
        const recipientId = activeConv?.participants.find((p: any) => p._id !== user?.id)?._id

        // Handle group send vs DM send
        if (activeConv?.isGroup) {
            // For group, we send to the conversationId room
            await sendMessage(activeConversation, newMessage) // Simplified for UI development
        } else if (recipientId) {
            await sendMessage(recipientId, newMessage)
        }

        setNewMessage('')
        socketService.emit('typing', { conversationId: activeConversation, userId: user?.id, isTyping: false })
    }

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)
        socketService.emit('typing', {
            conversationId: activeConversation,
            userId: user?.id,
            isTyping: e.target.value.length > 0
        })
    }

    const filteredConversations = conversations.filter((c: any) => {
        const matchesSearch = c.participants.some((p: any) =>
            p.username.toLowerCase().includes(searchQuery.toLowerCase()) && p._id !== user?.id
        ) || (c.isGroup && c.groupName?.toLowerCase().includes(searchQuery.toLowerCase()))

        if (activeTab === 'dm') return matchesSearch && !c.isGroup
        if (activeTab === 'group') return matchesSearch && c.isGroup
        return matchesSearch
    })

    const activeChat = conversations.find((c: any) => c._id === activeConversation)
    const otherParticipant = activeChat?.participants.find((p: any) => p._id !== user?.id)

    return (
        <div className="h-screen bg-[#020617] text-white flex pt-16 overflow-hidden relative">
            {/* Left Sidebar: Conversations */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col glass backdrop-blur-3xl z-20 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-black tracking-tight">Messages</h1>
                        <button
                            onClick={() => setShowGroupModal(true)}
                            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all group"
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-white/5 rounded-2xl mb-8 border border-white/5">
                        <TabBtn active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All</TabBtn>
                        <TabBtn active={activeTab === 'dm'} onClick={() => setActiveTab('dm')}>DMs</TabBtn>
                        <TabBtn active={activeTab === 'group'} onClick={() => setActiveTab('group')}>Groups</TabBtn>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1 pb-6">
                    {filteredConversations.map((conv: any) => {
                        const other = conv.participants.find((p: any) => p._id !== user?.id)
                        const isActive = activeConversation === conv._id

                        return (
                            <button
                                key={conv._id}
                                onClick={() => fetchMessages(conv._id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${isActive ? 'bg-primary/20 border-white/10 shadow-lg' : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 glass-dark flex items-center justify-center">
                                        {conv.isGroup ? (
                                            <Users size={24} className="text-primary" />
                                        ) : (
                                            <img src={other?.profileImage || `https://i.pravatar.cc/150?u=${other?._id}`} alt={other?.username} />
                                        )}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#020617] rounded-full ${conv.isGroup ? 'bg-blue-500' : 'bg-green-500'}`} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm truncate max-w-[120px]">
                                            {conv.isGroup ? conv.groupName : other?.username}
                                        </span>
                                        <span className="text-[10px] text-white/40 font-black uppercase">2m ago</span>
                                    </div>
                                    <p className="text-xs text-white/50 line-clamp-1 font-medium">
                                        {conv.lastMessage?.text || 'New creative workspace...'}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Right Side: Chat Window */}
            <div className={`flex-1 flex flex-col relative ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 glass backdrop-blur-3xl z-10">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => fetchMessages(null)}
                                    className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-all"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 glass-dark flex items-center justify-center">
                                        {activeChat?.isGroup ? (
                                            <Users size={20} className="text-primary" />
                                        ) : (
                                            <img src={otherParticipant?.profileImage || `https://i.pravatar.cc/150?u=${otherParticipant?._id}`} alt="" />
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-4 border-[#020617] rounded-full ${activeChat?.isGroup ? 'bg-blue-500' : 'bg-green-500'}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">
                                        {activeChat?.isGroup ? activeChat.groupName : otherParticipant?.username}
                                    </h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                        {activeChat?.isGroup ? `${activeChat.participants.length} Active Artists` : 'Active Now'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <IconButton icon={<Phone size={18} />} />
                                <IconButton icon={<Video size={18} />} />
                                <div className="w-px h-6 bg-white/10 mx-2" />
                                <IconButton
                                    onClick={() => setShowMemberSidebar(!showMemberSidebar)}
                                    icon={<MoreVertical size={18} />}
                                />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/5">
                            {messages.map((msg: any, i: number) => {
                                const isMe = msg.senderId?._id === user?.id
                                return (
                                    <motion.div
                                        key={msg._id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[70%] group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-1">
                                                    <img src={`https://i.pravatar.cc/100?u=${msg.senderId?._id}`} alt="" />
                                                </div>
                                            )}
                                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                {activeChat?.isGroup && !isMe && (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 ml-1">{msg.senderId?.username}</span>
                                                )}
                                                <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl relative ${isMe
                                                    ? 'bg-pixlr-gradient text-white rounded-tr-none'
                                                    : 'glass border border-white/5 text-white rounded-tl-none'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2 px-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 glass border-t border-white/5 bg-white/[0.01]">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                                <IconButton icon={<Plus size={20} />} />
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        placeholder="Add to the conversation..."
                                        value={newMessage}
                                        onChange={handleTyping}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all text-sm font-bold"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <Smile className="text-white/20 hover:text-primary transition-colors cursor-pointer" size={20} />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className={`p-4 rounded-2xl transition-all shadow-2xl ${newMessage.trim() ? 'bg-pixlr-gradient text-white scale-105 active:scale-95' : 'bg-white/5 text-white/20 cursor-not-allowed'
                                        }`}
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>

                        {/* Member Sidebar */}
                        <AnimatePresence>
                            {showMemberSidebar && (
                                <motion.div
                                    initial={{ x: 300 }}
                                    animate={{ x: 0 }}
                                    exit={{ x: 300 }}
                                    className="absolute inset-y-0 right-0 w-80 glass-dark border-l border-white/10 z-30 p-8 backdrop-blur-3xl shadow-2xl"
                                >
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-black">Members</h3>
                                        <button onClick={() => setShowMemberSidebar(false)}><X size={20} /></button>
                                    </div>

                                    <div className="space-y-6">
                                        {activeChat?.participants.map((p: any) => (
                                            <div key={p._id} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <img src={`https://i.pravatar.cc/100?u=${p._id}`} className="w-10 h-10 rounded-xl" alt="" />
                                                    <div>
                                                        <div className="text-sm font-bold">{p.username}</div>
                                                        <div className="text-[10px] text-white/40 font-black uppercase">Active Creator</div>
                                                    </div>
                                                </div>
                                                {p.role === 'admin' && <Shield size={14} className="text-primary" />}
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full mt-12 py-4 rounded-2xl border border-white/10 glass font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">
                                        View Group Gallery
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-48 h-48 relative mb-12">
                            <div className="absolute inset-0 bg-pixlr-gradient blur-3xl opacity-20 rounded-full animate-pulse-slow" />
                            <div className="relative w-full h-full glass border border-white/10 rounded-[3rem] flex items-center justify-center">
                                <MessageCircle size={84} className="text-primary" />
                            </div>
                        </div>
                        <h2 className="text-5xl font-black mb-6 tracking-tight">Studio <span className="text-gradient">Relay</span></h2>
                        <p className="max-w-md text-white/40 font-medium text-lg leading-relaxed mb-12">
                            A workspace for elite digital creators. Start a private dialogue or form a collective to dominate the billboard.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowGroupModal(true)} className="px-10 py-5 btn-pixlr font-black text-sm uppercase tracking-widest flex items-center gap-3">
                                <Users size={18} /> New Group
                            </button>
                            <button onClick={() => setActiveTab('dm')} className="px-10 py-5 glass border border-white/10 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/5">
                                Search DMs
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* New Group Modal */}
            <AnimatePresence>
                {showGroupModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowGroupModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-12 glass-dark border border-white/10 rounded-[3.5rem]"
                        >
                            <h2 className="text-3xl font-black mb-8">Form a <span className="text-gradient">Collective</span></h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Collective Name</label>
                                    <input
                                        type="text" placeholder="Creative Visionaries"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Description</label>
                                    <textarea
                                        placeholder="What is this collective's focus?" rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm resize-none"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        toast.success('Collective logic initialized!')
                                        setShowGroupModal(false)
                                    }}
                                    className="w-full py-5 btn-pixlr rounded-2xl font-black text-sm uppercase tracking-widest"
                                >
                                    Initialize Group <Sparkles className="inline ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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

function TabBtn({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-primary text-white shadow-xl' : 'text-white/30 hover:text-white'
                }`}
        >
            {children}
        </button>
    )
}

function IconButton({ icon, onClick }: { icon: React.ReactNode, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="p-3.5 rounded-2xl glass border border-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white group"
        >
            <span className="group-hover:scale-110 transition-transform block">
                {icon}
            </span>
        </button>
    )
}
