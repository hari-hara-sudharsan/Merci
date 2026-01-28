"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Target, CheckCircle2 } from "lucide-react";
import { CHALLENGES, INDUSTRIES } from "@/lib/constants";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        businessName: "",
        industry: "",
        description: "",

        // Step 2: Location
        address: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",

        // Step 3: Business Details
        yearEstablished: "",
        employeeCount: "",
        annualRevenue: "",

        // Step 4: Challenges
        challenges: [] as string[],
        goals: "",
    });

    const totalSteps = 4;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChallengeToggle = (challengeId: string) => {
        setFormData({
            ...formData,
            challenges: formData.challenges.includes(challengeId)
                ? formData.challenges.filter((c) => c !== challengeId)
                : [...formData.challenges, challengeId],
        });
    };

    const validateStep = (step: number): boolean => {
        setError("");

        switch (step) {
            case 1:
                if (!formData.businessName || !formData.industry) {
                    setError("Please fill in all required fields");
                    return false;
                }
                break;
            case 2:
                if (!formData.address || !formData.city || !formData.state || !formData.postalCode) {
                    setError("Please fill in all location fields");
                    return false;
                }
                break;
            case 3:
                // Optional fields, always valid
                break;
            case 4:
                if (formData.challenges.length === 0) {
                    setError("Please select at least one challenge");
                    return false;
                }
                break;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        setError("");
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/business/onboarding", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : undefined,
                    employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
                    annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Something went wrong");
                setLoading(false);
                return;
            }

            // Redirect to dashboard on success
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Business Information</h2>
                                <p className="text-sm text-muted-foreground">Tell us about your business</p>
                            </div>
                        </div>

                        <Input
                            label="Business Name *"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Enter your business name"
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Industry *
                            </label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select an industry</option>
                                {INDUSTRIES.map((industry) => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Description (Optional)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description of your business"
                                className="input-field min-h-[100px] resize-none"
                                maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.description.length}/500
                            </p>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Location</h2>
                                <p className="text-sm text-muted-foreground">Where is your business located?</p>
                            </div>
                        </div>

                        <Input
                            label="Address *"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street address"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="City *"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                            />

                            <Input
                                label="State *"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Country *"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                            />

                            <Input
                                label="Postal Code *"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="Postal code"
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Business Details</h2>
                                <p className="text-sm text-muted-foreground">Additional information (optional)</p>
                            </div>
                        </div>

                        <Input
                            label="Year Established"
                            name="yearEstablished"
                            type="number"
                            value={formData.yearEstablished}
                            onChange={handleChange}
                            placeholder="e.g., 2020"
                            min="1800"
                            max={new Date().getFullYear()}
                        />

                        <Input
                            label="Number of Employees"
                            name="employeeCount"
                            type="number"
                            value={formData.employeeCount}
                            onChange={handleChange}
                            placeholder="e.g., 10"
                            min="1"
                        />

                        <Input
                            label="Annual Revenue (₹)"
                            name="annualRevenue"
                            type="number"
                            value={formData.annualRevenue}
                            onChange={handleChange}
                            placeholder="e.g., 5000000"
                            min="0"
                        />
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Challenges & Goals</h2>
                                <p className="text-sm text-muted-foreground">What challenges are you facing?</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Select Your Challenges *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {CHALLENGES.map((challenge) => (
                                    <button
                                        key={challenge.id}
                                        type="button"
                                        onClick={() => handleChallengeToggle(challenge.id)}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${formData.challenges.includes(challenge.id)
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 ${formData.challenges.includes(challenge.id) ? "text-primary" : "text-muted-foreground"}`}>
                                                {formData.challenges.includes(challenge.id) ? (
                                                    <CheckCircle2 className="h-5 w-5" />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full border-2 border-current" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{challenge.label}</p>
                                                <p className="text-xs text-muted-foreground">{challenge.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">
                                Your Goals (Optional)
                            </label>
                            <textarea
                                name="goals"
                                value={formData.goals}
                                onChange={handleChange}
                                placeholder="What do you hope to achieve?"
                                className="input-field min-h-[100px] resize-none"
                                maxLength={1000}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.goals.length}/1000
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen gradient-bg py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {Math.round((currentStep / totalSteps) * 100)}% Complete
                        </span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Card */}
                <Card variant="glass">
                    <CardContent className="p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Step Content */}
                        {renderStep()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 1 || loading}
                            >
                                Back
                            </Button>

                            {currentStep < totalSteps ? (
                                <Button onClick={handleNext} disabled={loading}>
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} loading={loading} disabled={loading}>
                                    {loading ? "Submitting..." : "Complete Onboarding"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
