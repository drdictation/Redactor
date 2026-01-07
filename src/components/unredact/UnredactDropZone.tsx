import React, { useCallback, useState } from 'react';
import { Terminal, AlertTriangle, Skull } from 'lucide-react';
import { clsx } from 'clsx';

interface UnredactDropZoneProps {
    onFileSelect: (file: File) => void;
    isScanning?: boolean;
}

/**
 * Dark-themed dropzone for the Unredact Forensics page.
 * Styled as a "hacker terminal" with green accents.
 */
export const UnredactDropZone: React.FC<UnredactDropZoneProps> = ({ onFileSelect, isScanning }) => {
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
            setError('ERROR: Invalid file format. PDF required.');
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
                "border-2 border-dashed rounded-lg p-10 text-center font-mono",
                "bg-black/50 backdrop-blur-sm",
                isDragOver
                    ? "border-green-400 bg-green-950/30 scale-[1.01] shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    : "border-green-700/50 hover:border-green-500 hover:bg-green-950/20",
                isScanning && "opacity-50 pointer-events-none"
            )}
        >
            <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInput}
                disabled={isScanning}
            />

            <div className="flex flex-col items-center gap-5">
                {/* Terminal Icon */}
                <div className={clsx(
                    "w-20 h-20 rounded-lg flex items-center justify-center transition-all",
                    "border border-green-700/50",
                    isDragOver
                        ? "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                        : "bg-green-950/30 text-green-600 group-hover:bg-green-900/30 group-hover:text-green-400"
                )}>
                    {error ? (
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    ) : (
                        <Skull className="w-10 h-10" />
                    )}
                </div>

                {/* Text Content */}
                <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-green-400">
                        {error ? (
                            <span className="text-red-400">{error}</span>
                        ) : (
                            <>
                                <span className="text-green-500">&gt;</span> Simulate Un-Redact Attack
                            </>
                        )}
                    </h3>
                    <p className="text-green-600/80 max-w-md mx-auto text-sm leading-relaxed">
                        Drop your redacted PDF here. We'll attempt common "unredact" techniques
                        to check if hidden text can be recovered. <span className="text-green-400">100% client-side.</span>
                    </p>
                </div>

                {/* CTA Button */}
                <div className="mt-2 flex flex-col items-center gap-3">
                    <span className={clsx(
                        "inline-flex items-center px-6 py-3 rounded-lg text-sm font-bold transition-all",
                        "bg-green-600 text-black",
                        "group-hover:bg-green-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]",
                        "transform group-hover:-translate-y-0.5"
                    )}>
                        <Terminal className="w-4 h-4 mr-2" />
                        Run Vulnerability Scan
                    </span>
                    <span className="text-xs text-green-700">or drag and drop • PDF files only</span>
                </div>
            </div>
        </div>
    );
};
