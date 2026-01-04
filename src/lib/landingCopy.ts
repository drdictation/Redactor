export interface RouteConfig {
    path: string;
    primarySearchIntent: string; // Internal note for SEO intent
    h1: string;
    subhead: string;
    items: Array<{ title: string; text: string }>; // Renamed from whyThisMatters for flexibility
    howThisWorks: string;
    trustSignals: string;
    ctaText: string;
    metaTitle: string;
    metaDescription: string;
    securityHero?: string; // NEW: Big bold security statement
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
    '/': {
        path: '/',
        primarySearchIntent: 'General PDF Redaction',
        h1: 'Private PDF Redactor. Impossible to Reverse.',
        securityHero: 'We physically cannot see your files.',
        subhead: 'Permanently remove sensitive data. Unrecoverable flattening ensures your blacked-out text is gone forever.',
        items: [
            { title: 'Impossible to Reverse', text: 'Once redacted, the data is destroyed. It cannot be uncovered.' },
            { title: 'We Can\'t See It', text: 'Processing happens on your device. We have no server access.' },
            { title: 'No Account Needed', text: 'No signups. No tracking. Just secure redaction.' },
        ],
        howThisWorks: 'Load your PDF, destroy the data with permanent black boxes, and save a safe copy.',
        trustSignals: 'Bank-Level Privacy • Permanent Flattening • Zero Knowledge',
        ctaText: 'Select PDF to Redact Safely',
        metaTitle: 'ReactPDF | Impossible to Reverse Redaction Tool',
        metaDescription: 'Redact PDFs privately. We physically cannot see your files. Data is permanently destroyed and unrecoverable.',
    },
    '/redact-bank-statement': {
        path: '/redact-bank-statement',
        primarySearchIntent: 'Hide bank account numbers/balance',
        h1: 'Redact Bank Statements. Lender Accepted.',
        securityHero: 'Financial data never leaves your computer.',
        subhead: 'Hide balances and account numbers permanently. Accepted by mortgage brokers, landlords, and agents.',
        items: [
            { title: 'Lender Accepted', text: 'Create clean, professional proofs for applications.' },
            { title: 'Hide Your Wealth', text: 'Black out total balances while showing income deposits.' },
            { title: 'Bank-Level Privacy', text: 'Your financial history is never uploaded to any cloud.' },
        ],
        howThisWorks: 'Open statement, cover private figures, and download a hardened copy.',
        trustSignals: 'Accepted by Banks • Impossible to Reverse • 100% Private',
        ctaText: 'Redact Statement Now',
        metaTitle: 'Redact Bank Statements | Lender Accepted & Secure',
        metaDescription: 'Securely redact bank statements for loans and rentals. We cannot see your data. 100% private and permanent.',
    },
    '/redact-rental-application': {
        path: '/redact-rental-application',
        primarySearchIntent: 'Clean documents for rental application',
        h1: 'Redact Rental Apps. Protect Your ID.',
        securityHero: 'Don\'t let agents leak your SSN.',
        subhead: 'Real estate agents get hacked. Redact your SSN and bank details before you email your application.',
        items: [
            { title: 'Hide Your SSN', text: 'Prevent identity theft by permanently blocking your social.' },
            { title: 'Landlord Ready', text: 'Submit clean, professional documents that look official.' },
            { title: 'Prevent Leaks', text: 'Your data stays on your device, safe from email hacks.' },
        ],
        howThisWorks: 'Load application, block sensitive fields, and save a safe version for your agent.',
        trustSignals: 'Identity Theft Protection • Files Stay Local • Instant',
        ctaText: 'Redact Application Docs',
        metaTitle: 'Redact Rental Applications | Protect Your SSN',
        metaDescription: 'Safely redact rental applications. Block SSNs and bank info before emailing. We physically cannot see your files.',
    },
    '/redact-passport': {
        path: '/redact-passport',
        primarySearchIntent: 'Hide passport number/DOB',
        h1: 'Redact Passport Scans. Prevent Cloning.',
        securityHero: 'Identity documents stay in your hands.',
        subhead: 'Mask passport numbers and photos permanently. Send ID proofs without risking full identity theft.',
        items: [
            { title: 'Prevent Cloning', text: 'Hide the MRZ code so your passport can\'t be copied.' },
            { title: 'Travel Safe', text: 'Safe to email to hotels, agents, and visa offices.' },
            { title: 'Permanent', text: 'The hidden data is destroyed, not just covered.' },
        ],
        howThisWorks: 'Load scan, cover key details, and export a flattened image PDF.',
        trustSignals: 'Anti-Cloning • Zero Uploads • Irreversible',
        ctaText: 'Redact Passport Scan',
        metaTitle: 'Redact Passport Securely | Prevent Identity Theft',
        metaDescription: 'Redact passport numbers and IDs. We cannot see your documents. Prevent identity cloning with permanent redaction.',
    },
    '/redact-visa': {
        path: '/redact-visa',
        primarySearchIntent: 'Hide visa number/status details',
        h1: 'Redact Visa Docs. Protect Status.',
        securityHero: 'Immigration papers are strictly private.',
        subhead: 'Hide status details and case numbers permanently. Ensure your immigration history remains confidential.',
        items: [
            { title: 'Stop Tracking', text: 'Hide case numbers to prevent unauthorized lookups.' },
            { title: 'HR Safe', text: 'Share right-to-work proof without revealing full history.' },
            { title: 'Zero Risk', text: 'We physically cannot see or store your documents.' },
        ],
        howThisWorks: 'Select visa PDF, block private details, and save a flattened version.',
        trustSignals: 'Immigration Safe • No Server Uploads • Private',
        ctaText: 'Redact Visa Doc',
        metaTitle: 'Redact Visa Documents | Private & Secure',
        metaDescription: 'Redact sensitive info from visa documents. We cannot see your files. Zero risk of data leaks.',
    },
    '/redact-id': {
        path: '/redact-id',
        primarySearchIntent: 'Hide driver licence number/address',
        h1: 'Redact Driver\'s License. Stop Fraud.',
        securityHero: 'Your ID card is for your eyes only.',
        subhead: 'Obscure license numbers and addresses permanently. Verify your identity without handing over the keys to your life.',
        items: [
            { title: 'Mask License #', text: 'The #1 target for fraudsters—burn it out permanently.' },
            { title: 'Hide Your Home', text: 'Verify your name/age without revealing where you live.' },
            { title: 'Anti-Lift', text: 'Flattened images mean text cannot be copied or lifted.' },
        ],
        howThisWorks: 'Upload ID, draw boxes over number/address, and download a safe image.',
        trustSignals: 'Prevents Fraud • We Can\'t See It • Permanent',
        ctaText: 'Redact ID Card',
        metaTitle: 'Redact Driver\'s License | Prevent Fraud',
        metaDescription: 'Black out sensitive details on ID documents. We cannot see your files. Prevent identity theft with permanent redaction.',
    },
    '/redact-financial-documents': {
        path: '/redact-financial-documents',
        primarySearchIntent: 'Hide salary/tax file number',
        h1: 'Redact Tax & Financial Docs.',
        securityHero: 'Salary data stays confidential.',
        subhead: 'Hide income, TFN/SSN, and tax calculations permanently. Securely prepare documents for income verification.',
        items: [
            { title: 'Hide Salary', text: 'Prove employment without revealing your exact pay.' },
            { title: 'Mask Tax IDs', text: 'Redact SSN/TFN to prevent tax fraud.' },
            { title: 'Unrecoverable', text: 'Values are destroyed, not just hidden.' },
        ],
        howThisWorks: 'Import payslip, cover private figures, and export a secure image PDF.',
        trustSignals: 'Private Local Tool • No Financial Data Uploaded • Flattened',
        ctaText: 'Redact Financial Doc',
        metaTitle: 'Redact Payslips & Tax Forms | Secure',
        metaDescription: 'Redact tax returns and payslips. We cannot see your financial data. 100% private and permanent.',
    },
    '/redact-legal-documents': {
        path: '/redact-legal-documents',
        primarySearchIntent: 'Hide names/settlement amounts',
        h1: 'Redact Legal Contracts. Privileged.',
        securityHero: 'Privilege preserved. Zero leaks.',
        subhead: 'Hide names, dates, and settlement amounts permanently. Professional grade redaction for sensitive agreements.',
        items: [
            { title: 'Client Privilege', text: 'Ensure names are unreadable in shared copies.' },
            { title: 'Settlement Privacy', text: 'Redact amounts so text is gone forever.' },
            { title: 'Discovery Ready', text: 'Remove irrelevant info securely and permanently.' },
        ],
        howThisWorks: 'Load contract, black out clauses, and save as a flat image-based PDF.',
        trustSignals: 'Confidential • Zero Data Retention • Professional Grade',
        ctaText: 'Redact Legal Doc',
        metaTitle: 'Redact Legal Documents | Private & Secure',
        metaDescription: 'Securely redact legal contracts. We physically cannot see your files. Professional grade permanent redaction.',
    },
    '/redact-medical-records': {
        path: '/redact-medical-records',
        primarySearchIntent: 'Hide patient name/diagnosis',
        h1: 'Redact Medical Records (HIPAA)',
        securityHero: 'PHI never leaves this browser.',
        subhead: 'Hide patient names and diagnoses permanently. Your health records are processed on your device for absolute privacy.',
        items: [
            { title: 'HIPAA Safe', text: 'Ensure identifiers are completely destroyed.' },
            { title: 'Hide Diagnoses', text: 'Share proof of treatment without private details.' },
            { title: 'Provider Privacy', text: 'Redact doctor signatures/IDs securely.' },
        ],
        howThisWorks: 'Open record, destroy PII/PHI with black boxes, and export a non-selectable copy.',
        trustSignals: 'No Cloud Processing • HIPAA Friendly • Permanent',
        ctaText: 'Redact Medical Record',
        metaTitle: 'Redact Medical & Lab Records | HIPAA Safe',
        metaDescription: 'Black out sensitive patient info. We physically cannot see your records. 100% client-side privacy.',
    },
    '/auditor': {
        path: '/auditor',
        primarySearchIntent: 'Check if PDF redaction is leaking data',
        h1: 'Your Redactions are Leaking. We\'ll Prove It.',
        securityHero: 'Scan happens 100% in your browser.',
        subhead: 'Most PDF tools leave hidden text behind that anyone can copy. Drop your file—we\'ll find what they missed.',
        items: [
            { title: 'Find Ghost Text', text: 'Detect hidden text layers under black boxes.' },
            { title: 'Expose Metadata', text: 'Names, dates, and edits often leak in PDF metadata.' },
            { title: 'Zero Upload', text: 'Your file never leaves your device. 100% client-side.' },
        ],
        howThisWorks: 'Drop your PDF, we scan for hidden text and metadata leaks, and show you exactly what\'s exposed.',
        trustSignals: 'Zero Server Upload • Client-Side Only • Certified Reports',
        ctaText: 'Scan PDF for Leaks',
        metaTitle: 'PDF Redaction Auditor | Find Hidden Text Under Black Boxes',
        metaDescription: 'Your PDF redactions may be leaking data. Scan for hidden text and metadata that anyone can copy. 100% client-side, no uploads.',
    },
};

export function getRouteConfig(pathname: string): RouteConfig {
    // 1. Normalize: Remove ONE OR MORE trailing slashes regex (except for root '/')
    const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');

    // 2. Lookup
    const config = ROUTE_CONFIG[normalizedPath];

    // 3. Fallback (Soft 404 Safeguard)
    return config || ROUTE_CONFIG['/'];
}
