import React from 'react';
import { Header } from '../core/Header';
import { ScannerUI } from './ScannerUI';

export const AuditorPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">PDF Redaction Auditor</h1>
                    <p className="text-slate-600 mb-8">
                        The "Second Opinion" for your secure documents. Scan for ghost text, metadata leaks, and hidden layers.
                    </p>
                    {/* Components will go here */}
                    <ScannerUI />
                </div>
            </main>
        </div>
    );
};
