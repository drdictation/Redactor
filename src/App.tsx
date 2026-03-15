import { Routes, Route } from 'react-router-dom';

import { Workspace } from './components/core/Workspace';
import { AuditorPage } from './components/auditor/AuditorPage';
import { UnredactPage } from './components/unredact/UnredactPage';
import { PDFToolPage } from './components/tools/PDFToolPage';
import { ToolsHubPage } from './components/tools/ToolsHubPage';
import { PDFResourcePage } from './components/tools/PDFResourcePage';
import { SEOEnforcer } from './components/core/SEOEnforcer';

// Check if we're on the audit subdomain
const isAuditSubdomain = typeof window !== 'undefined' &&
  window.location.hostname.startsWith('audit.');

function App() {
  // If on audit subdomain, show only the Auditor
  if (isAuditSubdomain) {
    return (
      <>
        <SEOEnforcer />
        <AuditorPage />
      </>
    );
  }

  // Otherwise, show the main redaction tool with routing
  return (
    <>
        <SEOEnforcer />
      <Routes>
        <Route path="/auditor" element={<AuditorPage />} />
        <Route path="/unredact" element={<UnredactPage />} />
        <Route path="/tools" element={<ToolsHubPage />} />
        <Route path="/tools/:slug" element={<PDFToolPage />} />
        <Route path="/guides/:slug" element={<PDFResourcePage />} />
        <Route path="/use-cases/:slug" element={<PDFResourcePage />} />
        <Route path="/" element={<Workspace />} />
        <Route path="*" element={<Workspace />} />
      </Routes>
    </>
  );
}

export default App;
