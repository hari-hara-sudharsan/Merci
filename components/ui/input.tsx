import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, iconPosition = "left", ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {/* Label */}
                {label && (
                    <label className="block text-sm font-medium text-foreground">
                        {label}
                    </label>
                )}

                {/* Input wrapper */}
                <div className="relative">
                    {/* Icon on left */}
                    {icon && iconPosition === "left" && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}

                    {/* Input field */}
                    <input
                        type={type}
                        className={cn(
                            "input-field",
                            icon && iconPosition === "left" && "pl-10",
                            icon && iconPosition === "right" && "pr-10",
                            error && "border-red-500 focus:ring-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {/* Icon on right */}
                    {icon && iconPosition === "right" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-sm text-red-600 animate-slide-up">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
