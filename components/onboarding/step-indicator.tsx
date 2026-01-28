"use client";

import { CheckCircle2 } from "lucide-react";

interface Step {
    number: number;
    title: string;
    description?: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden md:flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${step.number < currentStep
                                        ? "bg-primary border-primary"
                                        : step.number === currentStep
                                            ? "bg-primary border-primary"
                                            : "bg-white border-border"
                                    }`}
                            >
                                {step.number < currentStep ? (
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                ) : (
                                    <span
                                        className={`text-lg font-bold ${step.number === currentStep
                                                ? "text-white"
                                                : "text-muted-foreground"
                                            }`}
                                    >
                                        {step.number}
                                    </span>
                                )}
                            </div>

                            {/* Step Label */}
                            <div className="mt-3 text-center">
                                <p
                                    className={`text-sm font-semibold ${step.number <= currentStep
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    {step.title}
                                </p>
                                {step.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {step.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-4 mb-8">
                                <div
                                    className={`h-full transition-all ${step.number < currentStep ? "bg-primary" : "bg-border"
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                <div className="flex items-center gap-2 mb-4">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center flex-1">
                            {/* Mini Step Circle */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step.number < currentStep
                                        ? "bg-primary border-primary"
                                        : step.number === currentStep
                                            ? "bg-primary border-primary"
                                            : "bg-white border-border"
                                    }`}
                            >
                                {step.number < currentStep ? (
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                ) : (
                                    <span
                                        className={`text-xs font-bold ${step.number === currentStep
                                                ? "text-white"
                                                : "text-muted-foreground"
                                            }`}
                                    >
                                        {step.number}
                                    </span>
                                )}
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-2">
                                    <div
                                        className={`h-full transition-all ${step.number < currentStep ? "bg-primary" : "bg-border"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Current Step Info */}
                <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                        {steps[currentStep - 1]?.title}
                    </p>
                    {steps[currentStep - 1]?.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {steps[currentStep - 1]?.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
