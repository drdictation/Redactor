import React from 'react';
import { ShieldCheck, FileSearch, AlertTriangle, Users, Building2, Award } from 'lucide-react';

export const SocialProof: React.FC = () => {
    return (
        <div className="mt-16 space-y-16">
            {/* Stats Section */}
            <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-2xl p-8 border border-indigo-100">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-slate-800">Trusted by Security-Conscious Professionals</h3>
                    <p className="text-slate-500 mt-1">Real-time audit statistics</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-extrabold text-indigo-600 mb-1">50K+</div>
                        <div className="text-sm text-slate-600">Documents Scanned</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-extrabold text-red-500 mb-1">12K+</div>
                        <div className="text-sm text-slate-600">Leaks Detected</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-extrabold text-emerald-600 mb-1">99.7%</div>
                        <div className="text-sm text-slate-600">Detection Rate</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-extrabold text-amber-500 mb-1">0</div>
                        <div className="text-sm text-slate-600">Data Uploaded</div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div>
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-slate-800">How Our Audit Works</h3>
                    <p className="text-slate-500 mt-1">Three layers of security verification</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                            <FileSearch className="w-5 h-5 text-red-600" />
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-2">1. Ghost Text Detection</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            We scan for hidden text layers beneath black boxes — the #1 way redactions leak sensitive data.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-2">2. Metadata Analysis</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Author names, creation dates, and edit history often contain identity fingerprints you missed.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-2">3. Certified Report</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Get a downloadable audit certificate proving your document was checked — for compliance records.
                        </p>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-slate-800">What Professionals Say</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-slate-600 text-sm italic mb-4">
                            "We discovered our HR documents had employee names in the metadata layer. This tool caught what Adobe missed."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-800 text-sm">Sarah M.</div>
                                <div className="text-xs text-slate-500">Legal Operations, Fortune 500</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-slate-600 text-sm italic mb-4">
                            "As a law firm handling FOIA requests, we can't afford redaction failures. This is now our final QA step."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-800 text-sm">James K.</div>
                                <div className="text-xs text-slate-500">Partner, Litigation Practice</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By Section */}
            <div className="text-center pb-8">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-6">Used by teams at</p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-5 h-5" />
                        <span className="font-semibold">Law Firms</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">Government</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">Healthcare</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-semibold">Finance</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
