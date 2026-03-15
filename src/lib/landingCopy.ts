import { PDF_TOOL_ROUTE_CONFIG } from './pdf-tools/catalog';

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
    uniqueContent?: {
        title: string;
        paragraphs: string[];
        faq?: Array<{ question: string; answer: string }>;
    };
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
    '/': {
        path: '/',
        primarySearchIntent: 'General PDF Redaction',
        h1: 'Your "Redacted" PDF Is Probably Still Leaking Data.',
        securityHero: 'We scan, detect, and permanently destroy hidden text.',
        subhead: 'Most tools draw black boxes but leave the original text underneath. Upload your file — we\'ll check for hidden data and export a forensics-proof copy.',
        items: [
            { title: 'Hidden Text Detection', text: 'We scan for copy-pasteable text hiding under black boxes.' },
            { title: 'Forensics-Proof Export', text: 'Every page is rasterized into flat images. No text layers to extract, no redactions to reverse.' },
            { title: 'We Can\'t See It', text: 'Processing happens on your device. Zero server uploads.' },
        ],
        howThisWorks: 'Upload your PDF. We scan for hidden leaks, then let you redact and export a properly sanitized copy.',
        trustSignals: 'Bank-Level Privacy • Hidden Text Detection • Zero Knowledge',
        ctaText: 'Check My PDF for Leaks',
        metaTitle: 'ReactPDF | Your Redacted PDF Is Leaking Data',
        metaDescription: 'Most PDF redaction tools leave hidden text behind. Upload your file to check for leaks and export a forensics-proof copy. 100% private, client-side.',
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
        uniqueContent: {
            title: 'Why Redacting Bank Statements Matters for Loan Applications',
            paragraphs: [
                'When applying for a mortgage, rental, or business loan, lenders require proof of income and financial stability. Bank statements are the gold standard for this verification—but they also contain highly sensitive information that goes far beyond what lenders actually need to see.',
                'Your bank statement reveals your full account number, your total wealth, every transaction you\'ve made, and patterns about your spending habits. A landlord doesn\'t need to know you spent $200 at a casino or that you subscribe to certain services. A mortgage broker doesn\'t need your full account number—they only need to verify your income deposits.',
                'The risk of sharing unredacted bank statements is significant. Real estate offices, mortgage brokers, and property management companies are frequent targets for data breaches. Once your full bank statement is in someone\'s email, you lose control over where that data ends up. Account numbers can be used for fraudulent ACH transfers, and spending patterns can be used for social engineering attacks.',
                'Professional redaction solves this problem by permanently destroying the sensitive data while leaving the verification information intact. Unlike simply drawing a black box in Preview or Word—which leaves the underlying text intact and copyable—proper redaction flattens the document into an image-based PDF where the original text no longer exists.',
                'Our tool is specifically designed for financial document redaction. It processes your bank statement entirely in your browser, meaning we never see your financial data. The output is a lender-accepted PDF that proves your income while protecting your privacy.'
            ],
            faq: [
                { question: 'Will lenders accept a redacted bank statement?', answer: 'Yes. Most lenders accept redacted statements as long as the key information (account holder name, dates, and deposit amounts) remains visible. We recommend confirming specific requirements with your lender before submitting.' },
                { question: 'What should I redact on a bank statement?', answer: 'At minimum, redact your full account number (you can leave the last 4 digits visible), your total balance, and any transactions unrelated to the proof of income you\'re providing. Always leave deposit amounts and dates visible.' }
            ]
        }
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
        uniqueContent: {
            title: 'Protecting Your Identity When Applying for Rentals',
            paragraphs: [
                'Rental applications are identity theft goldmines. They typically require your full Social Security Number, bank account details, employment history, previous addresses, and sometimes even copies of your ID and pay stubs. All of this information, bundled together, is exactly what criminals need to steal your identity.',
                'The problem is how this information gets handled. Most rental applications are emailed as PDFs or printed forms that get scanned. Real estate agents often store these on personal laptops, in unencrypted email accounts, or in filing cabinets that multiple people can access. Property management companies are frequent targets for data breaches, and a single breach can expose thousands of applicants\' complete personal information.',
                'The legal reality is that landlords and agents are required to collect this information, but they often have minimal security practices. Many agents share applications with property owners via email, forward them to background check services, and keep copies "just in case." Each copy multiplies your exposure.',
                'Smart applicants redact their sensitive information before submission. You can provide your SSN with the middle digits blacked out (XXX-XX-1234), which is sufficient for most background checks. You can redact full account numbers from bank statements while leaving deposit amounts visible. You can obscure parts of your driver\'s license number while still proving your identity.',
                'The key is using permanent redaction—not just drawing black boxes over text. Standard PDF annotations can be removed, revealing the original text. Our tool flattens your documents into image-based PDFs where the redacted text is physically destroyed and cannot be recovered.'
            ],
            faq: [
                { question: 'Can I redact my SSN and still pass a background check?', answer: 'Yes. Many background check services only need the last 4 digits of your SSN, or they\'ll request the full number through a secure portal. Ask your landlord if partial SSN is acceptable before submitting.' },
                { question: 'What if my landlord specifically asks for unredacted documents?', answer: 'You can offer to show originals in person while providing redacted copies for their files. This proves authenticity while limiting your digital exposure.' }
            ]
        }
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
        uniqueContent: {
            title: 'The Hidden Dangers of Sharing Passport Scans',
            paragraphs: [
                'Your passport is your most valuable identity document. It contains your full legal name, date of birth, nationality, a high-quality photograph, your unique passport number, and a machine-readable zone (MRZ) that encodes all of this data in a format designed for computer scanning. When you email a passport scan, you\'re potentially giving criminals everything they need to clone your identity.',
                'Passport fraud is a sophisticated industry. With a high-resolution scan of your passport\'s data page, criminals can create fraudulent documents for illegal immigration, open financial accounts in your name, or sell your identity data on dark web marketplaces. The MRZ code at the bottom of your passport is particularly valuable—it\'s designed to be machine-readable and contains checksums that prove authenticity.',
                'Hotels, visa offices, travel agents, and employers routinely request passport scans via email. These requests are often legitimate, but the problem is how these scans are stored and transmitted. Once your passport scan is in someone else\'s system, you have no control over its security. One data breach at a hotel chain could expose millions of passport scans.',
                'The solution is to redact the most sensitive elements before sharing. You can hide your passport number (leaving perhaps the last few digits visible), obscure the MRZ code entirely, and even blur your photograph if identity verification isn\'t required. The recipient still gets proof that you have a valid passport and can verify your name and nationality, but criminals can\'t use the scan to clone your identity.',
                'Critical: Standard PDF markup tools like Mac Preview\'s "Redact" feature often only draw black boxes over the image—the original data remains underneath and can be recovered by removing the annotation layer. True redaction requires flattening the document so the hidden data is physically destroyed.'
            ],
            faq: [
                { question: 'What parts of my passport should I redact?', answer: 'At minimum, redact the full passport number and the entire MRZ code (the two lines at the bottom). Depending on the use case, you may also want to blur your photograph and hide your date of birth.' },
                { question: 'Will hotels and visa offices accept a redacted passport scan?', answer: 'Many will accept it for initial verification, but may request the original for in-person check-in. When in doubt, ask the requesting party what specific information they need to see.' }
            ]
        }
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
        uniqueContent: {
            title: 'Protecting Your Immigration Status When Sharing Documents',
            paragraphs: [
                'Immigration documents contain some of the most sensitive information about your legal status, including receipt numbers, A-numbers (Alien Registration Numbers), case numbers, and detailed status history. While employers legitimately need to verify your right to work, they don\'t need—and shouldn\'t have—access to your complete immigration file.',
                'The risk of over-sharing immigration documents extends beyond identity theft. Case numbers can be used to look up your status in public databases. Receipt numbers reveal your application timeline and history. Status details can be used for discrimination or to report you to authorities if your status later changes. Once this information is in an HR file or company database, you lose control over who accesses it.',
                'Employment verification under I-9 requirements is straightforward: employers need to verify identity and work authorization, not collect your immigration history. You can provide proof of work authorization with sensitive numbers redacted. Visa stamps and approval notices can be shared with case-specific numbers obscured while still proving your right to work.',
                'For visa holders, redaction is also important when sharing documents with landlords, banks, or other third parties who request proof of legal presence. These parties need to confirm you\'re authorized to be in the country—they don\'t need your complete immigration file that could be used against you if circumstances change.',
                'When redacting immigration documents, focus on obscuring receipt numbers, A-numbers, case identifiers, and any detailed status history. Leave your name, photograph (if applicable), and the "valid for employment" or equivalent authorization statement visible. Our tool ensures these redactions are permanent and cannot be reversed.'
            ],
            faq: [
                { question: 'What information can employers legally require from my visa?', answer: 'For I-9 purposes, employers need to verify your identity and work authorization. They can examine your visa but should not photocopy or retain sensitive case numbers beyond what\'s required for the I-9 form.' },
                { question: 'Can USCIS numbers be used to look up my status?', answer: 'Yes. Receipt numbers and A-numbers can often be used to check case status in public databases. Redacting these numbers prevents unauthorized parties from tracking your immigration history.' }
            ]
        }
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
        uniqueContent: {
            title: 'Why Your Driver\'s License Number is a Fraud Target',
            paragraphs: [
                'Your driver\'s license is one of the most frequently requested identity documents, and it\'s also one of the most dangerous to share fully. Unlike your SSN (which can be partially hidden), your driver\'s license contains multiple data points that together create a complete identity package: your full legal name, date of birth, photograph, home address, physical description, and a unique license number that\'s linked to government databases.',
                'The driver\'s license number is particularly valuable to fraudsters. In many states, this number can be used to access your driving record, create fake IDs, or verify identity for fraudulent transactions. Combined with your address and DOB from the same document, criminals have everything needed to answer security questions, apply for credit in your name, or create synthetic identities.',
                'Many businesses request ID scans for legitimate purposes—age verification, identity confirmation for professional services, compliance requirements. The problem is that they often keep these scans far longer than necessary and with minimal security. That convenience store scan for age verification, that law firm\'s "copy for our files," that property manager\'s application database—all become potential breach points.',
                'Smart redaction lets you verify what needs to be verified while protecting what doesn\'t need to be shared. For age verification, your photo, name, and DOB are sufficient—the license number and address are irrelevant. For identity confirmation, your name and photo suffice—your address is unnecessary. By redacting strategically, you provide proof of identity without creating a complete fraud package.',
                'The key distinction is between visual redaction and true redaction. Drawing a black box in an image editor or PDF tool often leaves the original data underneath, recoverable with basic PDF manipulation tools. Our redaction tool flattens the image so that redacted data is physically destroyed and cannot be recovered by any means.'
            ],
            faq: [
                { question: 'What should I redact on my driver\'s license?', answer: 'Focus on the license number (the unique identifier), your full address, and any barcodes or machine-readable codes. Leave your name, photo, and date of birth visible if needed for the verification purpose.' },
                { question: 'Is a redacted ID legally valid for age verification?', answer: 'For most commercial age verifications (bars, stores, online services), a redacted ID showing your photo, name, and DOB is sufficient. For government or regulated purposes, you may need to show the original in person.' }
            ]
        }
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
        uniqueContent: {
            title: 'Protecting Your Income Information and Tax IDs',
            paragraphs: [
                'Financial documents like pay stubs, tax returns, W-2s, and 1099s are required for countless life events: mortgage applications, apartment rentals, car loans, business partnerships, and employment verification. These documents prove your income and employment—but they also expose your most sensitive financial data to parties who don\'t need all of it.',
                'Your tax ID (SSN in the US, TFN in Australia, SIN in Canada) is the master key to your financial identity. With this number, criminals can file fraudulent tax returns in your name, open credit accounts, or commit employment fraud. Tax IDs appear on virtually every financial document, yet the recipients rarely need the full number for their purposes.',
                'Salary information is another sensitive category. While proving income is often necessary, revealing your exact compensation can have unintended consequences. In salary negotiations, revealing previous pay anchors you to that number. In rental applications, showing high income can invite higher demands. In business partnerships, it reveals your financial position. Strategic redaction lets you prove income ranges without exposing exact figures.',
                'The security of financial documents in third-party hands is questionable at best. Mortgage brokers, landlords, employers, and HR departments store these documents in various systems with varying security. A single breach at any of these entities exposes your complete financial identity. The 2017 Equifax breach, for example, exposed the financial data of 147 million people.',
                'When redacting financial documents, consider who needs to see what. A landlord needs to verify stable income—not your employer\'s tax ID or your year-to-date earnings. A mortgage broker needs to confirm income amounts—not your company\'s payroll details or your deduction choices. By redacting strategically, you provide proof of financial qualifications while minimizing exposure.'
            ],
            faq: [
                { question: 'What should I redact from a W-2 or tax return?', answer: 'At minimum, redact your full SSN (leaving the last 4 digits), your employer\'s EIN, and any information not relevant to what you\'re proving. For income verification, leave wage amounts visible but consider redacting withholding details.' },
                { question: 'Will lenders accept redacted tax documents?', answer: 'Many lenders will accept redacted documents for initial verification, but may require IRS transcripts or signed 4506-T forms for final approval. Redacted docs are often sufficient for pre-qualification and preliminary processing.' }
            ]
        }
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
        uniqueContent: {
            title: 'Professional Redaction for Legal and Confidential Documents',
            paragraphs: [
                'Legal documents require a higher standard of redaction than consumer documents. Whether you\'re preparing documents for discovery, sharing contracts with redacted pricing, protecting client identities in case studies, or complying with protective orders, improper redaction can have serious legal and financial consequences.',
                'The legal industry has learned this lesson repeatedly. High-profile cases have been derailed when supposedly redacted information was recovered from court filings. The Paul Manafort case famously exposed the defendant\'s lawyers had used simple black highlighting that could be removed with copy-paste. Similar failures have occurred in FOIA responses, settlement disclosures, and corporate filings.',
                'Proper legal redaction requires "burning in" the redaction so that the underlying text is permanently destroyed. This is different from overlay redaction, which simply draws a shape over the text while leaving the original data intact in the PDF structure. Professional redaction tools flatten the document, converting text to images where the redacted content no longer exists.',
                'Settlement agreements commonly require confidentiality of specific terms while allowing the existence of the agreement to be disclosed. This creates a common redaction use case: sharing a settlement agreement with dollar figures, specific claims, or party identities redacted while leaving the general structure and non-confidential terms visible.',
                'For discovery and litigation support, our tool provides professional-grade redaction without cloud upload. This is critical for privileged materials, confidential business information, and protected health information that cannot be uploaded to third-party servers. All processing happens locally in your browser, meaning we have zero access to your documents and we retain nothing.'
            ],
            faq: [
                { question: 'Is this redaction sufficient for court filings?', answer: 'Our redaction permanently removes text by converting the document to flattened images. This meets the technical requirement for permanent redaction in legal filings. However, always verify specific court requirements and consider having your IT or litigation support team verify the redaction before filing.' },
                { question: 'How can I verify the redaction is permanent?', answer: 'After exporting, try to select text in the redacted areas—you shouldn\'t be able to select anything. You can also open the PDF in a text editor and search for the redacted content. With proper flattening, the text simply won\'t exist in the file.' }
            ]
        }
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
        uniqueContent: {
            title: 'Safe Handling of Medical Records and Protected Health Information',
            paragraphs: [
                'Medical records are among the most sensitive documents you\'ll ever handle. They contain Protected Health Information (PHI) including diagnoses, treatment histories, prescription records, and provider notes that reveal intimate details about your health. HIPAA and similar regulations exist because this information can be used for discrimination, embarrassment, or fraud.',
                'There are legitimate reasons to share medical records: insurance claims, disability applications, legal proceedings, second opinions, or proving vaccination status. In each case, you may need to share some information while protecting other details that aren\'t relevant to the request.',
                'For insurance purposes, you might share proof of treatment dates without revealing specific diagnoses. For disability applications, you might share relevant conditions while redacting unrelated health history. For legal matters, you might need to prove medical expenses without exposing your complete health record to all parties.',
                'The privacy risk of medical records extends beyond the obvious. Health insurers, employers, and others can use health information for decisions that affect you—even if such use is technically illegal, enforcement is difficult. Once your complete medical history is in someone\'s database, you lose control over how it\'s used and who might access it through breaches.',
                'Medical record redaction requires particular care because you\'re often dealing with scanned documents, fax transmissions, and complex formats. Our tool handles these by converting everything to high-quality images with the redacted content permanently destroyed. Because all processing happens in your browser, we never access your PHI—making this approach inherently HIPAA-friendly for individual use.'
            ],
            faq: [
                { question: 'Is using this tool HIPAA compliant?', answer: 'For individual use with your own medical records, this tool is inherently privacy-protective because no data is transmitted to any server. For covered entities handling patient records, additional organizational policies and procedures may be required for HIPAA compliance.' },
                { question: 'What medical information should I redact?', answer: 'Focus on information not needed for your specific purpose. Common redactions include: patient identifiers (name, DOB, MRN) when sharing for research, specific diagnoses when sharing for treatment dates only, and provider identifiers when they\'re not relevant to your claim.' }
            ]
        }
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
    const config = ROUTE_CONFIG[normalizedPath] || PDF_TOOL_ROUTE_CONFIG[normalizedPath];

    // 3. Fallback (Soft 404 Safeguard)
    return config || ROUTE_CONFIG['/'];
}
