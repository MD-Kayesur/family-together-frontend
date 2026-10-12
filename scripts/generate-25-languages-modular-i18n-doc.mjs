import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType,
  BorderStyle,
} from 'docx';

async function generateModularDoc() {
  const tableBorderLight = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
  };

  const createCell = (text, isHeader = false, widthPercent = 25, isBold = false) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: isHeader
        ? { fill: '1E3A8A', type: ShadingType.CLEAR }
        : { fill: 'FFFFFF', type: ShadingType.CLEAR },
      borders: tableBorderLight,
      children: [
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({
              text,
              bold: isHeader || isBold,
              size: isHeader ? 20 : 19,
              color: isHeader ? 'FFFFFF' : '1E293B',
              font: 'Segoe UI',
            }),
          ],
        }),
      ],
    });
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            size: 22,
            color: '1E293B',
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '🌐 ২৫টি বিশ্বভাষা ও মডুলার i18n লোকেল আর্কিটেকচার গাইড',
                bold: true,
                size: 32,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: 'FamilyRoots Platform: 25 World Languages with Dedicated Locale Files Architecture',
                bold: true,
                size: 22,
                color: '0D9488',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'মডুলার ফাইল স্ট্রাকচার: src/lib/i18n/locales/ (en.ts, bn.ts, es.ts ... tl.ts)',
                italics: true,
                size: 18,
                color: '64748B',
              }),
            ],
          }),

          new Paragraph({
            text: '_________________________________________________________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({
                text: '১. ২৫টি বিশ্বভাষার পূর্ণাঙ্গ তালিকা (25 Supported World Languages)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('ক্রম ও কোড', true, 20),
                  createCell('ভাষা ও স্থানীয় নাম', true, 35),
                  createCell('লোকেল ফাইল পাথ', true, 45),
                ],
              }),
              new TableRow({ children: [createCell('1. en (🇺🇸)', false, 20, true), createCell('English (English)', false, 35), createCell('src/lib/i18n/locales/en.ts', false, 45)] }),
              new TableRow({ children: [createCell('2. bn (🇧🇩)', false, 20, true), createCell('Bengali (বাংলা)', false, 35), createCell('src/lib/i18n/locales/bn.ts', false, 45)] }),
              new TableRow({ children: [createCell('3. es (🇪🇸)', false, 20, true), createCell('Spanish (Español)', false, 35), createCell('src/lib/i18n/locales/es.ts', false, 45)] }),
              new TableRow({ children: [createCell('4. fr (🇫🇷)', false, 20, true), createCell('French (Français)', false, 35), createCell('src/lib/i18n/locales/fr.ts', false, 45)] }),
              new TableRow({ children: [createCell('5. de (🇩🇪)', false, 20, true), createCell('German (Deutsch)', false, 35), createCell('src/lib/i18n/locales/de.ts', false, 45)] }),
              new TableRow({ children: [createCell('6. ar (🇸🇦 RTL)', false, 20, true), createCell('Arabic (العربية)', false, 35), createCell('src/lib/i18n/locales/ar.ts', false, 45)] }),
              new TableRow({ children: [createCell('7. hi (🇮🇳)', false, 20, true), createCell('Hindi (हिन्दी)', false, 35), createCell('src/lib/i18n/locales/hi.ts', false, 45)] }),
              new TableRow({ children: [createCell('8. zh (🇨🇳)', false, 20, true), createCell('Chinese (简体中文)', false, 35), createCell('src/lib/i18n/locales/zh.ts', false, 45)] }),
              new TableRow({ children: [createCell('9. pt (🇧🇷)', false, 20, true), createCell('Portuguese (Português)', false, 35), createCell('src/lib/i18n/locales/pt.ts', false, 45)] }),
              new TableRow({ children: [createCell('10. ja (🇯🇵)', false, 20, true), createCell('Japanese (日本語)', false, 35), createCell('src/lib/i18n/locales/ja.ts', false, 45)] }),
              new TableRow({ children: [createCell('11. ru (🇷🇺)', false, 20, true), createCell('Russian (Русский)', false, 35), createCell('src/lib/i18n/locales/ru.ts', false, 45)] }),
              new TableRow({ children: [createCell('12. it (🇮🇹)', false, 20, true), createCell('Italian (Italiano)', false, 35), createCell('src/lib/i18n/locales/it.ts', false, 45)] }),
              new TableRow({ children: [createCell('13. ko (🇰🇷)', false, 20, true), createCell('Korean (한국어)', false, 35), createCell('src/lib/i18n/locales/ko.ts', false, 45)] }),
              new TableRow({ children: [createCell('14. tr (🇹🇷)', false, 20, true), createCell('Turkish (Türkçe)', false, 35), createCell('src/lib/i18n/locales/tr.ts', false, 45)] }),
              new TableRow({ children: [createCell('15. ur (🇵🇰 RTL)', false, 20, true), createCell('Urdu (اردو)', false, 35), createCell('src/lib/i18n/locales/ur.ts', false, 45)] }),
              new TableRow({ children: [createCell('16. id (🇮🇩)', false, 20, true), createCell('Indonesian (Bahasa Indonesia)', false, 35), createCell('src/lib/i18n/locales/id.ts', false, 45)] }),
              new TableRow({ children: [createCell('17. ms (🇲🇾)', false, 20, true), createCell('Malay (Bahasa Melayu)', false, 35), createCell('src/lib/i18n/locales/ms.ts', false, 45)] }),
              new TableRow({ children: [createCell('18. vi (🇻🇳)', false, 20, true), createCell('Vietnamese (Tiếng Việt)', false, 35), createCell('src/lib/i18n/locales/vi.ts', false, 45)] }),
              new TableRow({ children: [createCell('19. th (🇹🇭)', false, 20, true), createCell('Thai (ไทย)', false, 35), createCell('src/lib/i18n/locales/th.ts', false, 45)] }),
              new TableRow({ children: [createCell('20. nl (🇳🇱)', false, 20, true), createCell('Dutch (Nederlands)', false, 35), createCell('src/lib/i18n/locales/nl.ts', false, 45)] }),
              new TableRow({ children: [createCell('21. pl (🇵🇱)', false, 20, true), createCell('Polish (Polski)', false, 35), createCell('src/lib/i18n/locales/pl.ts', false, 45)] }),
              new TableRow({ children: [createCell('22. sv (🇸🇪)', false, 20, true), createCell('Swedish (Svenska)', false, 35), createCell('src/lib/i18n/locales/sv.ts', false, 45)] }),
              new TableRow({ children: [createCell('23. el (🇬🇷)', false, 20, true), createCell('Greek (Ελληνικά)', false, 35), createCell('src/lib/i18n/locales/el.ts', false, 45)] }),
              new TableRow({ children: [createCell('24. fa (🇮🇷 RTL)', false, 20, true), createCell('Persian (فارسی)', false, 35), createCell('src/lib/i18n/locales/fa.ts', false, 45)] }),
              new TableRow({ children: [createCell('25. tl (🇵🇭)', false, 20, true), createCell('Filipino (Tagalog)', false, 35), createCell('src/lib/i18n/locales/tl.ts', false, 45)] }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 350, after: 120 },
            children: [
              new TextRun({
                text: '২. মডুলার আর্কিটেকচার ও ডিরেক্টরি সংগঠন',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: '• প্রতিটি ভাষার জন্য আলাদা ফাইল: src/lib/i18n/locales/ ডিরেক্টরিতে প্রতিটি ভাষার আলাদা ফাইল রয়েছে (যেমন en.ts-এ সম্পূর্ণ ইংরেজি, bn.ts-এ সম্পূর্ণ বাংলা)।\n' +
                  '• টাইপ-সেফটি ও শেয়ার্ড ইন্টারফেস: types.ts ফাইলে TranslationDictionary সংজ্ঞায়িত করা হয়েছে।\n' +
                  '• সেন্ট্রাল ব্যারেলে একত্রীকরণ: index.ts সব ফাইলকে ইমপোর্ট করে translations অবজেক্ট তৈরি করে।\n' +
                  '• নিরবচ্ছিন্ন ইন্টিগ্রেশন: translations.ts এবং ProfileLanguageSelector.tsx স্বয়ংক্রিয়ভাবে ২৫টি ভাষাকে ড্রপডাউনে লোড করে।',
              }),
            ],
          }),

          new Paragraph({
            text: '_________________________________________________________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'FamilyRoots 25 Languages Modular Architecture • Antigravity IDE • সর্বস্বত্ব সংরক্ষিত',
                italics: true,
                size: 18,
                color: '94A3B8',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const backendDocxPath = path.resolve('d:/Projects/family-together-backend/FamilyRoots_25_Languages_Modular_i18n_Architecture_Guide.docx');
  const frontendDocxPath = path.resolve('d:/Projects/family-together-frontend/FamilyRoots_25_Languages_Modular_i18n_Architecture_Guide.docx');
  const backendDocPath = path.resolve('d:/Projects/family-together-backend/FamilyRoots_25_Languages_Modular_i18n_Architecture_Guide.doc');
  const frontendDocPath = path.resolve('d:/Projects/family-together-frontend/FamilyRoots_25_Languages_Modular_i18n_Architecture_Guide.doc');

  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);

  const docSummary = `ফ্যামিলিরুটস প্ল্যাটফর্ম — ২৫টি বিশ্বভাষা ও মডুলার i18n লোকেল আর্কিটেকচার গাইড
========================================================================================

১. সমর্থিত ২৫টি ভাষা:
1. en (English) - src/lib/i18n/locales/en.ts
2. bn (বাংলা) - src/lib/i18n/locales/bn.ts
3. es (Español) - src/lib/i18n/locales/es.ts
4. fr (Français) - src/lib/i18n/locales/fr.ts
5. de (Deutsch) - src/lib/i18n/locales/de.ts
6. ar (العربية - RTL) - src/lib/i18n/locales/ar.ts
7. hi (हिन्दी) - src/lib/i18n/locales/hi.ts
8. zh (简体中文) - src/lib/i18n/locales/zh.ts
9. pt (Português) - src/lib/i18n/locales/pt.ts
10. ja (日本語) - src/lib/i18n/locales/ja.ts
11. ru (Русский) - src/lib/i18n/locales/ru.ts
12. it (Italiano) - src/lib/i18n/locales/it.ts
13. ko (한국어) - src/lib/i18n/locales/ko.ts
14. tr (Türkçe) - src/lib/i18n/locales/tr.ts
15. ur (اردو - RTL) - src/lib/i18n/locales/ur.ts
16. id (Bahasa Indonesia) - src/lib/i18n/locales/id.ts
17. ms (Bahasa Melayu) - src/lib/i18n/locales/ms.ts
18. vi (Tiếng Việt) - src/lib/i18n/locales/vi.ts
19. th (ไทย) - src/lib/i18n/locales/th.ts
20. nl (Nederlands) - src/lib/i18n/locales/nl.ts
21. pl (Polski) - src/lib/i18n/locales/pl.ts
22. sv (Svenska) - src/lib/i18n/locales/sv.ts
23. el (Ελληνικά) - src/lib/i18n/locales/el.ts
24. fa (فارسی - RTL) - src/lib/i18n/locales/fa.ts
25. tl (Tagalog) - src/lib/i18n/locales/tl.ts

২. মডুলার আর্কিটেকচার:
- প্রতিটি ভাষার আলাদা ফাইল রয়েছে src/lib/i18n/locales/ ডিরেক্টরিতে।
- index.ts দিয়ে সেন্ট্রালি লোড করা হচ্ছে।
- tsc --noEmit সফলভাবে পাস করেছে (০ ত্রুটি)।
`;

  fs.writeFileSync(backendDocPath, docSummary, 'utf-8');
  fs.writeFileSync(frontendDocPath, docSummary, 'utf-8');

  console.log('Successfully generated 25 Languages Modular i18n Architecture Guide!');
}

generateModularDoc().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
