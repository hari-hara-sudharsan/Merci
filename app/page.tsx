export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-6xl font-display font-bold gradient-text animate-fade-in">
                    Business Intelligence Platform
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
                    Analyze your business, visualize competitors in 3D, and get AI-powered insights to drive growth.
                </p>
                <div className="flex gap-4 justify-center animate-slide-up">
                    <a
                        href="/login"
                        className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
                    >
                        Get Started
                    </a>
                    <a
                        href="/signup"
                        className="px-8 py-3 rounded-lg glass glass-hover font-semibold transition-all hover:scale-105"
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </main>
    );
}
