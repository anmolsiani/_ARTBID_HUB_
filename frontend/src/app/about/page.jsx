import Link from 'next/link';
import { Mail, Users, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Hero */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    About ArtBid Hub
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    We're building the world's most creative community where artists, collectors, and enthusiasts connect, share, and trade exceptional artwork.
                </p>
            </div>

            {/* Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        To democratize art discovery and trade by creating a platform where everyone can explore, create, and collect amazing artwork. We believe art should be accessible to all, and artists should have the tools to share their creativity with the world.
                    </p>
                </div>
                <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        To become the go-to platform for art enthusiasts worldwide, fostering a vibrant community where creativity thrives, artists get recognized, and collectors discover hidden gems. We're blending human creativity with AI innovation to push the boundaries of what's possible.
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Community</h3>
                        <p className="text-sm text-muted-foreground">
                            Connect with artists and collectors worldwide
                        </p>
                    </div>
                    <div className="text-center p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">AI Art Generator</h3>
                        <p className="text-sm text-muted-foreground">
                            Create stunning AI-generated artwork
                        </p>
                    </div>
                    <div className="text-center p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Marketplace</h3>
                        <p className="text-sm text-muted-foreground">
                            Buy and sell art securely
                        </p>
                    </div>
                    <div className="text-center p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Real-time Chat</h3>
                        <p className="text-sm text-muted-foreground">
                            Message artists and collectors instantly
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-12 text-white mb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold mb-2">10K+</div>
                        <div className="text-white/80">Artists</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold mb-2">50K+</div>
                        <div className="text-white/80">Artworks</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold mb-2">100K+</div>
                        <div className="text-white/80">Community Members</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold mb-2">$2M+</div>
                        <div className="text-white/80">Traded Volume</div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4 max-w-3xl mx-auto">
                    {[
                        {
                            q: 'Is ArtBid Hub free to use?',
                            a: 'Yes! Creating an account, uploading artwork, and browsing the gallery is completely free. We only take a small commission on sales.',
                        },
                        {
                            q: 'How does the AI art generator work?',
                            a: 'Our AI uses state-of-the-art machine learning models to generate unique artwork based on your text prompts. Simply describe what you want, and watch the magic happen!',
                        },
                        {
                            q: 'Can I sell my artwork on ArtBid Hub?',
                            a: 'Absolutely! You can set prices for your artwork and sell directly to collectors through our secure platform.',
                        },
                        {
                            q: 'How do I get started?',
                            a: 'Simply create a free account, complete your profile, and start uploading your artwork or exploring the gallery!',
                        },
                    ].map((faq, index) => (
                        <details key={index} className="bg-card border border-border rounded-xl p-6">
                            <summary className="font-semibold cursor-pointer">{faq.q}</summary>
                            <p className="mt-3 text-muted-foreground">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-secondary/50 rounded-2xl p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Become part of the creative revolution. Upload your art, connect with amazing artists, and discover incredible artwork.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/register"
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/50"
                    >
                        Get Started Free
                    </Link>
                    <Link
                        href="/explore"
                        className="px-8 py-3 bg-secondary border border-border rounded-full font-semibold hover:bg-secondary/80 transition-all"
                    >
                        Explore Gallery
                    </Link>
                </div>
            </div>
        </div>
    );
}
