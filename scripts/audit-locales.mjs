import fs from 'fs';
import path from 'path';

const dir = 'd:/Projects/family-together-frontend/src/lib/i18n/locales';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');
console.log('Total locale files:', files.length);

const enContent = fs.readFileSync(path.join(dir, 'en.ts'), 'utf8');
const enKeys = (enContent.match(/"([^"]+)":/g) || []).map(k => k.replace(/[" :]/g, ''));
console.log('EN total keys:', enKeys.length);

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const keys = (content.match(/"([^"]+)":/g) || []).map(k => k.replace(/[" :]/g, ''));
  const missing = enKeys.filter(k => !keys.includes(k));
  console.log(`${f}: ${keys.length} keys, missing from EN: ${missing.length ? missing.join(', ') : 'none'}`);
});
