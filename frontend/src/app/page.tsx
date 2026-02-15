export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-500">
            <div className="relative z-10 text-center px-6">
                <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
                    Welcome to <span className="text-yellow-300">ArtBid Hub</span>
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Discover, share, and trade amazing art. Join the creative community where artists and collectors connect.
                </p>
                <div className="flex gap-4 justify-center">
                    <a
                        href="/login"
                        className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-yellow-300 hover:text-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Get Started
                    </a>
                    <a
                        href="/explore"
                        className="px-8 py-3 bg-purple-600/30 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-purple-600/50 transition-all duration-300 border-2 border-white/50"
                    >
                        Explore Art
                    </a>
                </div>
            </div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>
        </div>
    )
}
