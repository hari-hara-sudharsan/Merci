"use client";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    fullScreen?: boolean;
}

export default function LoadingSpinner({
    size = "md",
    text,
    fullScreen = false,
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-6 w-6 border-2",
        md: "h-12 w-12 border-2",
        lg: "h-16 w-16 border-3",
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
            />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
}
