"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { isValidFileType, isValidFileSize, formatFileSize } from "@/lib/utils";

const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/msword", // .doc
    "application/vnd.ms-excel", // .xls
];

const MAX_FILE_SIZE_MB = 10;

interface UploadedFile {
    file: File;
    status: "pending" | "uploading" | "success" | "error";
    progress: number;
    error?: string;
}

export default function DocumentUpload() {
    const router = useRouter();
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const validateFile = (file: File): string | null => {
        if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
            return "Invalid file type. Please upload PDF, Word, or Excel files.";
        }
        if (!isValidFileSize(file, MAX_FILE_SIZE_MB)) {
            return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
        }
        return null;
    };

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;

        setError("");
        const newFiles: UploadedFile[] = [];

        Array.from(fileList).forEach((file) => {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }

            newFiles.push({
                file,
                status: "pending",
                progress: 0,
            });
        });

        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        handleFiles(e.dataTransfer.files);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            setError("Please upload at least one document");
            return;
        }

        setProcessing(true);
        setError("");

        try {
            // Upload files one by one
            for (let i = 0; i < files.length; i++) {
                const uploadedFile = files[i];

                // Update status to uploading
                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i ? { ...f, status: "uploading" as const } : f
                    )
                );

                const formData = new FormData();
                formData.append("file", uploadedFile.file);

                // Simulate upload progress
                const uploadPromise = fetch("/api/business/upload-document", {
                    method: "POST",
                    body: formData,
                });

                // Progress simulation
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += 10;
                    if (progress <= 90) {
                        setFiles((prev) =>
                            prev.map((f, idx) =>
                                idx === i ? { ...f, progress } : f
                            )
                        );
                    }
                }, 200);

                const response = await uploadPromise;
                clearInterval(progressInterval);

                if (!response.ok) {
                    const data = await response.json();
                    setFiles((prev) =>
                        prev.map((f, idx) =>
                            idx === i
                                ? { ...f, status: "error" as const, error: data.message || "Upload failed" }
                                : f
                        )
                    );
                    continue;
                }

                // Success
                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i ? { ...f, status: "success" as const, progress: 100 } : f
                    )
                );
            }

            // Check if all files uploaded successfully
            const allSuccess = files.every((f) => f.status === "success");

            if (allSuccess) {
                // Redirect to dashboard
                router.push("/dashboard");
                router.refresh();
            } else {
                setError("Some files failed to upload. Please try again.");
                setProcessing(false);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Upload Business Documents
                    </h1>
                    <p className="text-muted-foreground">
                        Upload your business documents and let AI extract the information
                    </p>
                </div>

                {/* Upload Area */}
                <Card variant="glass">
                    <CardContent className="p-8">
                        {/* Drag and Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${dragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Upload className="h-12 w-12 text-primary" />
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-foreground mb-1">
                                        Drop your files here
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        or click to browse
                                    </p>
                                </div>

                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    onChange={handleFileInput}
                                />

                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                >
                                    Browse Files
                                </Button>

                                <p className="text-xs text-muted-foreground">
                                    Supported: PDF, Word, Excel • Max {MAX_FILE_SIZE_MB}MB per file
                                </p>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Uploaded Files List */}
                        {files.length > 0 && (
                            <div className="mt-6 space-y-3">
                                <h3 className="font-semibold text-foreground">Uploaded Files</h3>

                                {files.map((uploadedFile, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
                                    >
                                        <FileText className="h-8 w-8 text-primary flex-shrink-0" />

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground truncate">
                                                {uploadedFile.file.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatFileSize(uploadedFile.file.size)}
                                            </p>

                                            {/* Progress Bar */}
                                            {uploadedFile.status === "uploading" && (
                                                <div className="mt-2">
                                                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-300"
                                                            style={{ width: `${uploadedFile.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error Message */}
                                            {uploadedFile.status === "error" && uploadedFile.error && (
                                                <p className="text-sm text-red-600 mt-1">{uploadedFile.error}</p>
                                            )}
                                        </div>

                                        {/* Status Icon */}
                                        <div className="flex-shrink-0">
                                            {uploadedFile.status === "pending" && (
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="p-1 hover:bg-muted rounded"
                                                >
                                                    <X className="h-5 w-5 text-muted-foreground" />
                                                </button>
                                            )}
                                            {uploadedFile.status === "uploading" && (
                                                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                            )}
                                            {uploadedFile.status === "success" && (
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            )}
                                            {uploadedFile.status === "error" && (
                                                <AlertCircle className="h-5 w-5 text-red-600" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        {files.length > 0 && (
                            <div className="mt-6 flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    loading={processing}
                                    disabled={processing}
                                    size="lg"
                                >
                                    {processing ? "Processing..." : "Process Documents"}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>
                        Our AI will analyze your documents and extract key business information automatically.
                    </p>
                </div>
            </div>
        </div>
    );
}
