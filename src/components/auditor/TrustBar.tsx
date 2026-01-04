import React from 'react';
import { Shield, Lock, Eye, Wifi, Server, FileCheck } from 'lucide-react';

export const TrustBar: React.FC = () => {
    const trustItems = [
        {
            icon: Lock,
            title: "100% Client-Side",
            description: "Your PDF never leaves your browser"
        },
        {
            icon: Server,
            title: "Zero Upload",
            description: "No server, no cloud, no data transfer"
        },
        {
            icon: Eye,
            title: "Privacy First",
            description: "We can't see your documents"
        },
        {
            icon: Shield,
            title: "Enterprise Grade",
            description: "Trusted by legal & compliance teams"
        }
    ];

    return (
        <div className="bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-4 py-12">
                {/* Main Trust Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {trustItems.map((item, idx) => (
                        <div key={idx} className="text-center group">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 mb-3 group-hover:bg-emerald-500/10 transition-colors">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* Compliance Badges */}
                <div className="mt-10 pt-8 border-t border-slate-800">
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                        <div className="flex items-center gap-2 text-slate-500">
                            <FileCheck className="w-5 h-5" />
                            <span className="text-sm font-medium">GDPR Compliant</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm font-medium">HIPAA Ready</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Lock className="w-5 h-5" />
                            <span className="text-sm font-medium">SOC 2 Principles</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Wifi className="w-5 h-5 rotate-45" />
                            <span className="text-sm font-medium">Works Offline</span>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-xs">
                        Built for professionals who handle sensitive documents. Your files stay on your device — always.
                    </p>
                </div>
            </div>
        </div>
    );
};
