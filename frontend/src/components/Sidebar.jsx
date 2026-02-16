'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, MessageCircle, Settings, User, Heart, FolderOpen } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';

export default function Sidebar({ className = '' }) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/upload', icon: Upload, label: 'Upload Art' },
        { href: '/messages', icon: MessageCircle, label: 'Messages' },
        { href: `/profile/${user?.username}`, icon: User, label: 'My Profile' },
        { href: '/dashboard/my-art', icon: FolderOpen, label: 'My Artworks' },
        { href: '/dashboard/favorites', icon: Heart, label: 'Favorites' },
        { href: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className={`w-64 bg-card border-r border-border p-6 ${className}`}>
            {/* User Info */}
            <div className="mb-8 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h3 className="font-semibold">{user?.username}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'hover:bg-secondary text-foreground'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
