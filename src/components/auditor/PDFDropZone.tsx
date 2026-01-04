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

                <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        {error ? <span className="text-red-500">{error}</span> : "Drop your Redacted PDF here"}
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Standard redaction tools often leave 'Ghost Text' and hidden metadata.
                        <br />
                        Use our local-only scanner to audit your files before you hit send.
                    </p>
                </div>

                <div className="mt-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors">
                        <FileText className="w-4 h-4 mr-2" />
                        Select PDF
                    </span>
                </div>
            </div>
        </div>
    );
};
