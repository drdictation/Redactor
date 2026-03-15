import React from 'react';
import { Header } from '../core/Header';
import { ScannerUI } from './ScannerUI';
import { TrustBar } from './TrustBar';
import { SocialProof } from './SocialProof';
import { AuditorSEO } from './AuditorSEO';
import { PDFToolPromoSection } from '../tools/PDFToolPromoSection';

export const AuditorPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <AuditorSEO />
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <ScannerUI />
                    <PDFToolPromoSection
                        eyebrow="Quick fixes before audit"
                        title="Need a fast cleanup before the final audit?"
                        description="These in-browser utilities remove common PDF issues like metadata, comments, and editable form fields. They pass stronger internal-link equity from the auditor page while still routing users back into the full paid review when certainty matters."
                        toolIds={['metadata-stripper', 'comments-remover', 'hidden-text-remover', 'form-flattener']}
                    />
                    <SocialProof />
                </div>
            </main>
            <TrustBar />
        </div>
    );
};
