"use client";

import { CheckCircle2 } from "lucide-react";
import { CHALLENGES } from "@/lib/constants";

interface ChallengesSelectorProps {
    selectedChallenges: string[];
    onChange: (challenges: string[]) => void;
    disabled?: boolean;
}

export default function ChallengesSelector({
    selectedChallenges,
    onChange,
    disabled,
}: ChallengesSelectorProps) {
    const handleToggle = (challengeId: string) => {
        if (disabled) return;

        if (selectedChallenges.includes(challengeId)) {
            onChange(selectedChallenges.filter((id) => id !== challengeId));
        } else {
            onChange([...selectedChallenges, challengeId]);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                    Select Your Business Challenges *
                </label>
                <p className="text-sm text-muted-foreground mb-4">
                    Choose all that apply. This helps us provide better insights.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CHALLENGES.map((challenge) => {
                    const isSelected = selectedChallenges.includes(challenge.id);

                    return (
                        <button
                            key={challenge.id}
                            type="button"
                            onClick={() => handleToggle(challenge.id)}
                            disabled={disabled}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${isSelected
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <div
                                    className={`mt-1 flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    {isSelected ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full border-2 border-current" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground mb-1">
                                        {challenge.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {challenge.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Selected Count */}
            {selectedChallenges.length > 0 && (
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                        ✓ {selectedChallenges.length} challenge{selectedChallenges.length !== 1 ? "s" : ""} selected
                    </p>
                </div>
            )}

            {/* Validation Message */}
            {selectedChallenges.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                    Please select at least one challenge to continue
                </p>
            )}
        </div>
    );
}
