import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { enData } from './translations-master.mjs';
import { bnData, trData } from './translations-locales-p1.mjs';

const localesDir = 'd:/Projects/family-together-frontend/src/lib/i18n/locales';

const files = [
  'en', 'bn', 'es', 'fr', 'de', 'ar', 'hi', 'zh', 'pt', 'ja', 'ru', 'it', 'ko', 'tr', 'ur', 'id', 'ms', 'vi', 'th', 'nl', 'pl', 'sv', 'el', 'fa', 'tl'
];

// Special high-quality dictionaries already fully written
const dedicated = {
  bn: bnData,
  tr: trData,
};

for (const lang of files) {
  let baseDict = { ...enData };

  // 1. Try reading the previous commit's original translations for this language
  try {
    const raw = execSync(`git show HEAD:src/lib/i18n/locales/${lang}.ts`, { encoding: 'utf8' });
    const match = raw.match(/export const \w+: TranslationDictionary = \{([\s\S]*)\};/);
    if (match && match[1]) {
      const lines = match[1].split('\n');
      for (const line of lines) {
        const m = line.match(/"([^"]+)":\s*"([^"]+)"/);
        if (m) {
          baseDict[m[1]] = m[2];
        }
      }
    }
  } catch {
    // If no git history, default to enData
  }

  // 2. Overlay dedicated full translations if present
  if (dedicated[lang]) {
    baseDict = { ...baseDict, ...dedicated[lang] };
  }

  // 3. Write out file
  const targetPath = path.join(localesDir, `${lang}.ts`);
  let content = `import { TranslationDictionary } from "./types";\n\nexport const ${lang}: TranslationDictionary = {\n`;
  for (const [k, v] of Object.entries(baseDict)) {
    content += `  ${JSON.stringify(k)}: ${JSON.stringify(v)},\n`;
  }
  content += `};\n`;
  fs.writeFileSync(targetPath, content, 'utf8');
}

console.log('Merged and built all 25 locales with preserved native translations + complete master key schema!');
