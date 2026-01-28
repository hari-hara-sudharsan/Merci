import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    // Base styles - interactive and animated
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wide transition-all duration-300 ease-in-out relative overflow-hidden border-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 group",
    {
        variants: {
            variant: {
                // Primary - Dark blue with white text
                primary:
                    "bg-primary text-white border-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50",

                // Secondary - White with primary border
                secondary:
                    "bg-white text-primary border-primary hover:bg-primary/5 hover:border-primary/80",

                // Accent - Bright blue
                accent:
                    "bg-accent text-white border-accent hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/50",

                // Outline - Transparent with border
                outline:
                    "bg-transparent text-primary border-primary hover:bg-primary hover:text-white",

                // Ghost - No border, subtle hover
                ghost:
                    "bg-transparent text-primary border-transparent hover:bg-primary/10",

                // Destructive - Red for dangerous actions
                destructive:
                    "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/50",
            },
            size: {
                sm: "text-sm px-4 py-2",
                md: "text-base px-6 py-3",
                lg: "text-lg px-8 py-4",
                xl: "text-xl px-10 py-5",
                icon: "p-3",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            loading = false,
            icon,
            iconPosition = "left",
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isDisabled}
                {...props}
            >
                {/* Animated background effect on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />

                {/* Loading spinner */}
                {loading && (
                    <svg
                        className="animate-spin h-5 w-5 z-10"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}

                {/* Icon on left */}
                {!loading && icon && iconPosition === "left" && (
                    <span className="z-10 transition-transform duration-300 group-hover:scale-110">
                        {icon}
                    </span>
                )}

                {/* Button text */}
                {children && (
                    <span className="z-10 relative">
                        {children}
                    </span>
                )}

                {/* Icon on right */}
                {!loading && icon && iconPosition === "right" && (
                    <span className="z-10 transition-transform duration-300 group-hover:translate-x-1">
                        {icon}
                    </span>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
