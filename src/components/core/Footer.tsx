import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="mt-12 py-8 border-t border-gray-100 w-full animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <Link to="/tools" className="hover:text-gray-900 transition-colors">
                    All PDF Tools
                </Link>
                <Link to="/tools/remove-pdf-metadata" className="hover:text-gray-900 transition-colors">
                    Remove PDF Metadata
                </Link>
                <Link to="/tools/remove-pdf-comments" className="hover:text-gray-900 transition-colors">
                    Remove PDF Comments
                </Link>
                <Link to="/tools/remove-hidden-text" className="hover:text-gray-900 transition-colors">
                    Remove Hidden Text
                </Link>
                <Link to="/tools/scan-pdf-for-pii" className="hover:text-gray-900 transition-colors">
                    Scan PDF for PII
                </Link>
                <Link to="/tools/flatten-fillable-pdf" className="hover:text-gray-900 transition-colors">
                    Flatten Fillable PDF
                </Link>
                <Link to="/redact-bank-statement" className="hover:text-gray-900 transition-colors">
                    Redact Bank Statement
                </Link>
                <Link to="/redact-id" className="hover:text-gray-900 transition-colors">
                    Redact ID Document
                </Link>
                <Link to="/redact-visa" className="hover:text-gray-900 transition-colors">
                    Redact Visa
                </Link>
                <Link to="/redact-rental-application" className="hover:text-gray-900 transition-colors">
                    Redact Rental Application
                </Link>
                <Link to="/redact-passport" className="hover:text-gray-900 transition-colors">
                    Redact Passport
                </Link>
                <Link to="/redact-financial-documents" className="hover:text-gray-900 transition-colors">
                    Redact Financial Docs
                </Link>
                <Link to="/redact-legal-documents" className="hover:text-gray-900 transition-colors">
                    Redact Legal Docs
                </Link>
                <Link to="/redact-medical-records" className="hover:text-gray-900 transition-colors">
                    Redact Medical Records
                </Link>
            </div>
        </footer>
    );
}
