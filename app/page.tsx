export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center gradient-bg">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-6xl font-display font-bold text-primary animate-fade-in">
                    Business Intelligence Platform
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
                    Analyze your business, visualize competitors in 3D, and get AI-powered insights to drive growth.
                </p>
                <div className="flex gap-4 justify-center animate-slide-up">
                    <a
                        href="/login"
                        className="btn-primary hover:scale-105"
                    >
                        Get Started
                    </a>
                    <a
                        href="/signup"
                        className="btn-secondary hover:scale-105"
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </main>
    );
}
