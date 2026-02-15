import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'ArtBid Hub - Social Art Platform',
    description: 'Discover, share, and trade amazing art. Join the creative community.',
    keywords: ['art', 'gallery', 'social', 'auction', 'AI art', 'digital art'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
}
