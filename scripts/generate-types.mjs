import fs from 'fs';
import { enData } from './translations-master.mjs';

const typesPath = 'd:/Projects/family-together-frontend/src/lib/i18n/locales/types.ts';

let out = `export interface TranslationDictionary {\n  [key: string]: string | undefined;\n\n`;

for (const key of Object.keys(enData)) {
  out += `  "${key}"?: string;\n`;
}

out += `}\n\nexport type TranslationKey = keyof TranslationDictionary;\n`;

fs.writeFileSync(typesPath, out, 'utf8');
console.log('Generated types.ts with', Object.keys(enData).length, 'keys');
