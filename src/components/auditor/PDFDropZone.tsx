import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface PDFDropZoneProps {
    onFileSelect: (file: File) => void;
    isScanning?: boolean;
}

export const PDFDropZone: React.FC<PDFDropZoneProps> = ({ onFileSelect, isScanning }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!isScanning) setIsDragOver(true);
    }, [isScanning]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        setError(null);

        if (isScanning) return;

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            onFileSelect(file);
        } else {
            setError('Please upload a valid PDF file.');
        }
    }, [isScanning, onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            onFileSelect(file);
        }
    }, [onFileSelect]);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
                "relative group cursor-pointer transition-all duration-300 ease-out",
                "border-2 border-dashed rounded-xl p-12 text-center",
                isDragOver ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50",
                isScanning && "opacity-50 pointer-events-none grayscale"
            )}
        >
            <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInput}
                disabled={isScanning}
            />

            <div className="flex flex-col items-center gap-4">
                <div className={clsx(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                    isDragOver ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                )}>
                    {error ? <AlertTriangle className="w-8 h-8 text-amber-500" /> : <Upload className="w-8 h-8" />}
                </div>

                <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {error ? <span className="text-red-500">{error}</span> : "Is your redaction actually safe?"}
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                        Drop your redacted PDF here. We'll scan every layer for hidden text,
                        metadata leaks, and anything that could expose sensitive information.
                    </p>
                </div>

                <div className="mt-4 flex flex-col items-center gap-3">
                    <span className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200 group-hover:bg-indigo-700 group-hover:shadow-indigo-300 transition-all transform group-hover:-translate-y-0.5">
                        <FileText className="w-4 h-4 mr-2" />
                        Scan My PDF for Leaks
                    </span>
                    <span className="text-xs text-slate-400">or drag and drop</span>
                </div>
            </div>
        </div>
    );
};
