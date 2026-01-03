const TESTIMONIALS = [
    {
        name: "Sarah J.",
        role: "Real Estate Agent",
        text: "I disconnected my WiFi just to check—it genuinely works offline. Perfect for client bank statements.",
        verified: true
    },
    {
        name: "Michael R.",
        role: "Small Business Owner",
        text: "Finally a tool that doesn't ask me to upload my tax returns to some random server. 10/10 for privacy.",
        verified: true
    },
    {
        name: "David K.",
        role: "Legal Assistant",
        text: "We used to manually print and marker redactions. This is faster and actually secure.",
        verified: true
    },
    {
        name: "Dr. Emily T.",
        role: "Private Practice",
        text: "HIPAA compliance is my nightmare. Knowing files never leave the browser makes this usable for me.",
        verified: true
    },
    {
        name: "Alex M.",
        role: "Tenant",
        text: "Redacted my SSN from rental apps in seconds. No account needed, just drag and drop.",
        verified: true
    }
];

export function TrustMarquee() {
    return (
        <div className="w-full overflow-hidden bg-gray-50 border-y border-gray-100 py-8">
            <div className="max-w-7xl mx-auto relative">

                <div className="flex gap-6 animate-scroll mask-fade-sides">
                    {/* Double the list for infinite seamless loop */}
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 w-80 bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-semibold text-gray-900">{item.name}</div>
                                {item.verified && (
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                                        Verified User
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.role}</div>
                            <p className="text-sm text-gray-600 leading-relaxed">"{item.text}"</p>
                        </div>
                    ))}
                </div>

                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
            </div>

            <style>{`
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                /* Pause on hover */
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
