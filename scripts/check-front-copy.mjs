import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGETS = [
  'src/components',
  'src/lib/pdf-tools',
  'src/lib/pdf-resources',
];
const BANNED = [
  /funnel to paid tools/i,
  /target keyword/i,
  /internal-link equity/i,
  /top-of-funnel/i,
  /upsell/i,
  /paid tool/i,
  /close the loop/i,
  /lead-in/i,
  /routing users/i,
  /main offer/i,
  /review workflow/i,
];
const offenders = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) {
      const text = fs.readFileSync(full, 'utf8');
      for (const pattern of BANNED) {
        if (pattern.test(text)) offenders.push({ file: full, pattern: pattern.toString() });
      }
    }
  }
}

for (const target of TARGETS) {
  const full = path.join(ROOT, target);
  if (fs.existsSync(full)) walk(full);
}

if (offenders.length > 0) {
  console.error('Front-facing copy check failed:');
  for (const offender of offenders) console.error(`- ${offender.file} matched ${offender.pattern}`);
  process.exit(1);
}

console.log('Front-facing copy check passed.');
