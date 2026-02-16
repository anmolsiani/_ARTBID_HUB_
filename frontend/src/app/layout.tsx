'use client'

import { useEffect } from 'react';
// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import useAuthStore from '@/store/useAuthStore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>ArtBid Hub - Discover, Share & Trade Amazing Art</title>
                <meta name="description" content="Join the creative community where artists and collectors connect, share, and trade exceptional artwork." />
            </head>
            <body className={inter.className}>
                <Toaster position="top-right" />
                <div className="aurora" />
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
