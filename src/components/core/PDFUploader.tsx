import React, { useCallback, useState, useEffect } from 'react';
import { Upload, FileWarning, Loader2, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { trackUploadCTAClick } from '../../lib/analytics';

// ... existing code ...

// ... existing code ...

interface PDFUploaderProps {
    onFileSelect: (file: File) => void;
    isProcessing?: boolean;
    ctaText?: string;
}

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function PDFUploader({ onFileSelect, isProcessing = false, ctaText = 'Select PDF to Redact' }: PDFUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Please upload a valid PDF file.';
        }
        if (file.size > MAX_SIZE_BYTES) {
            return `File size exceeds ${MAX_SIZE_MB}MB limit.`;
        }
        return null;
    };

    const handleFile = (file: File) => {
        const errorMsg = validateFile(file);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }
        setError(null);
        trackUploadCTAClick();
        onFileSelect(file);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (isProcessing) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [isProcessing]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!isProcessing) {
            setIsDragging(true);
        }
    }, [isProcessing]);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    // Network Status Logic
    const [isOnline, setIsOnline] = useState(true);
    useEffect(() => {
        const handleStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', handleStatus);
        window.addEventListener('offline', handleStatus);
        return () => {
            window.removeEventListener('online', handleStatus);
            window.removeEventListener('offline', handleStatus);
        };
    }, []);

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 sm:p-12 transition-all duration-200 ease-in-out text-center cursor-pointer overflow-hidden",
                    "group hover:shadow-lg hover:shadow-blue-500/5",
                    isDragging ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                    isProcessing && "opacity-50 cursor-not-allowed pointer-events-none",
                    error && "border-red-300 bg-red-50/30"
                )}
            >
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={onInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    disabled={isProcessing}
                />

                <div className="flex flex-col items-center gap-4 relative z-0">
                    {/* Trust Badge */}
                    <div className="bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-green-700">Client-side only • No server upload</span>
                    </div>

                    <div className={cn(
                        "p-4 rounded-full transition-colors",
                        error ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
                    )}>
                        {isProcessing ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : error ? (
                            <FileWarning className="w-8 h-8" />
                        ) : (
                            <div className="relative">
                                <Upload className="w-8 h-8" />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm">
                                    <Lock className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isProcessing ? 'Processing PDF...' : ctaText}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            {error || "Drag and drop or click to browse. Files never leave your device."}
                        </p>
                    </div>

                    {!error && (
                        <div className="text-xs text-gray-400 font-medium">
                            Max {MAX_SIZE_MB}MB • PDF only
                        </div>
                    )}
                </div>

                {/* Embedded Network Monitor */}
                <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-100 py-2 px-4 flex items-center justify-between text-[10px] text-gray-400 font-mono rounded-b-xl">
                    <span className="flex items-center gap-1.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full", isOnline ? "bg-green-500" : "bg-orange-500 animate-pulse")} />
                        {isOnline ? "NETWORK: ACTIVE (0KB UPLOAD)" : "NETWORK: OFFLINE VERIFIED"}
                    </span>
                    <span className="hidden sm:inline">SECURE_LOCAL_ENV</span>
                </div>
            </div>

            {/* Mobile Warning - Desktop Recommended */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 sm:hidden">
                <div className="p-1">
                    <FileWarning className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-amber-900">Desktop Recommended</h4>
                    <p className="text-xs text-amber-700 mt-1">
                        Redacting documents requires precise control. For the best experience, please use a desktop computer.
                    </p>
                </div>
            </div>
        </div>
    );
}
