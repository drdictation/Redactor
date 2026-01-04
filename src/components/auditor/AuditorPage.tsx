import React from 'react';
import { Header } from '../core/Header';
import { ScannerUI } from './ScannerUI';
import { TrustBar } from './TrustBar';
import { SocialProof } from './SocialProof';
import { AuditorSEO } from './AuditorSEO';

export const AuditorPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <AuditorSEO />
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <ScannerUI />
                    <SocialProof />
                </div>
            </main>
            <TrustBar />
        </div>
    );
};
