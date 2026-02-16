'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye } from 'lucide-react';
import { useState } from 'react';

export default function ArtCard({ art }) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(art?.likes || 0);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    // Fallback for missing image
    const imageUrl = art?.image || art?.images?.[0] || '/placeholder-art.jpg';
    const title = art?.title || 'Untitled';
    const artist = art?.artist?.username || art?.username || 'Unknown Artist';
    const price = art?.price;
    const views = art?.views || 0;

    return (
        <Link href={`/art/${art?._id || art?.id}`} className="group cursor-pointer block">
            <div className="relative overflow-hidden rounded-2xl border border-border hover:border-primary transition-all duration-300 hover:shadow-xl bg-card">
                {/* Image */}
                <div className="aspect-square relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                    {imageUrl !== '/placeholder-art.jpg' ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl">🎨</div>
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>

                    {/* Like button */}
                    <button
                        onClick={handleLike}
                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                    >
                        <Heart
                            className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                        />
                    </button>

                    {/* Type badge */}
                    {art?.type && (
                        <div className="absolute top-3 left-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${art.type === 'ai'
                                    ? 'bg-purple-500/90 text-white'
                                    : 'bg-blue-500/90 text-white'
                                }`}>
                                {art.type === 'ai' ? '🤖 AI Generated' : '✋ Human Made'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 truncate group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 truncate">
                        by {artist}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {likes}
                            </span>
                            {views > 0 && (
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {views}
                                </span>
                            )}
                        </div>
                        {price && (
                            <span className="text-lg font-bold text-primary">
                                ${price}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
