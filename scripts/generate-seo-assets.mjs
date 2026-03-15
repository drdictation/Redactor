import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const files = [
  'src/lib/landingCopy.ts',
  'src/lib/pdf-tools/catalog.ts',
  'src/lib/pdf-resources/catalog.ts',
];
const routePattern = /path:\s*'([^']+)'/g;
const routes = new Set(['/']);

for (const file of files) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  for (const match of text.matchAll(routePattern)) {
    routes.add(match[1]);
  }
}

const now = new Date().toISOString().slice(0, 10);
const sorted = [...routes].sort();
const toPriority = (route) => {
  if (route === '/') return '1.0';
  if (route === '/tools' || route === '/auditor') return '0.9';
  if (route.startsWith('/tools/')) return '0.8';
  if (route.startsWith('/use-cases/') || route.startsWith('/guides/')) return '0.7';
  return '0.8';
};
const toFreq = (route) => {
  if (route === '/' || route === '/tools') return 'weekly';
  if (route.startsWith('/tools/')) return 'weekly';
  return 'monthly';
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sorted.map((route) => `  <url>\n    <loc>https://reactpdf.app${route === '/' ? '' : route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${toFreq(route)}</changefreq>\n    <priority>${toPriority(route)}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;

fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml);
console.log(`Generated sitemap with ${sorted.length} routes.`);
