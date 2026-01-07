import React from 'react';
import { UnredactSEO } from './UnredactSEO';
import { UnredactScanner } from './UnredactScanner';
import { UnredactHowItWorks } from './UnredactHowItWorks';
import { UnredactFAQ } from './UnredactFAQ';
import { Shield, ExternalLink } from 'lucide-react';

/**
 * Main page component for the Unredact Forensics tool.
 * Dark terminal-inspired theme to differentiate from the main auditor.
 */
export const UnredactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
            <UnredactSEO />

            {/* Minimal Header */}
            <header className="border-b border-green-900/30 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <a href="/" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                            <Shield className="w-6 h-6" />
                            <span className="font-bold text-lg">ReactPDF</span>
                            <span className="text-xs text-green-600 font-mono">/ forensics</span>
                        </a>
                        <a
                            href="/auditor"
                            className="text-sm text-green-600 hover:text-green-400 transition-colors flex items-center gap-1"
                        >
                            Full Auditor Tool
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <UnredactScanner />
                    <UnredactHowItWorks />
                    <UnredactFAQ />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-green-900/30 bg-black/50 mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-green-700">
                        <p className="font-mono">
                            © {new Date().getFullYear()} ReactPDF. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 font-mono">
                            <a href="/" className="hover:text-green-400 transition-colors">
                                Redaction Tool
                            </a>
                            <a href="/auditor" className="hover:text-green-400 transition-colors">
                                Full Auditor
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
