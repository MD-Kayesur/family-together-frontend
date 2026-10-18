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
} from 'docx';

async function generateLanguageModalPricingDoc() {
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
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: '🌐 Navbar Language Switcher Modal & Pricing Page i18n Localization Report',
                bold: true,
                size: 32,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Complete Implementation Report: Root Cause of Pricing Page English Text, Global Language Switcher Modal, Search Filtering Across 25 Languages, and Default 4 Featured Languages',
                italics: true,
                size: 21,
                color: '64748B',
              }),
            ],
          }),

          new Paragraph({
            text: '_________________________________________________________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // Section 1: Root Cause Analysis
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '1. রুট কজ বিশ্লেষণ: জিও-লোকেশন কাজ করা সত্ত্বেও প্রাইসিং পেজ কেন ইংরেজিতে ছিল?',
                bold: true,
                size: 26,
                color: '0F172A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'ইউজারের স্ক্রিনশট ও সিস্টেমে লক্ষ্য করা গেছে যে নেভবার লিঙ্কগুলো (পরিচিতি, ফিচারের তালিকা, ইত্যাদি) স্বয়ংক্রিয়ভাবে বাংলায় অনুবাদ হলেও প্রাইসিং পেজের হিরো হেডিং, সাবটাইটেল এবং কার্ডগুলো ইংরেজিতে ছিল।\n\n',
              }),
              new TextRun({
                text: 'মূল কারণ (Root Cause):\n',
                bold: true,
              }),
              new TextRun({
                text: '• আমাদের `LanguageContext` এবং জিও-লোকেশন ইঞ্জিন নিখুঁতভাবে বাংলাদেশ ডিটেক্ট করে `currentLanguage: "bn"` সেট করেছিল (যার প্রমাণ নেভবারের বাংলা টেক্সট)।\n' +
                  '• কিন্তু `src/app/pricing/page.tsx` ফাইলে `useTranslation()` হুকটি একেবারেই ইমপোর্ট ও ব্যবহার করা হয়নি! সমস্ত হেডিং ("Simple, honest pricing for every family clan."), ব্যাজ ("Transparent Sanctuary Pricing"), এবং কার্ডের ফিচারগুলো সরাসরি হার্ডকোডেড ইংরেজিতে লেখা ছিল।\n\n' +
                  'সমাধান (Resolution):\n' +
                  '• আমরা `pricing/page.tsx`-এ `useTranslation()` যুক্ত করেছি এবং প্রতিটি টেক্সটকে ডাইনামিক `t("pricing.badge")`, `t("pricing.title")`, `t("pricing.freeTitle")` ইত্যাদিতে রূপান্তরিত করেছি।\n' +
                  '• `types.ts`, `en.ts` এবং `bn.ts` ফাইলগুলোতে সমস্ত প্রাইসিং কী (Pricing keys), প্ল্যান কম্প্যারিজন টেবিল এবং বিলিং FAQ-এর নিখুঁত বাংলা ও ইংরেজি অনুবাদ সন্নিবেশ করেছি।',
              }),
            ],
          }),

          // Section 2: Language Switcher Modal Architecture
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. নেভবার ল্যাঙ্গুয়েজ সুইচার বাটন ও সার্চ মডাল আর্কিটেকচার (Language Switcher Modal)',
                bold: true,
                size: 26,
                color: '0F172A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'ইউজারের নির্দেশ অনুযায়ী নেভবারে একটি নিবেদিত "Translate / Language Switcher" বাটন এবং হাই-এন্ড গ্লাস মরফিজম মডাল তৈরি করা হয়েছে (`src/components/common/LanguageSwitcherModal.tsx`):\n\n' +
                  '১. গ্লোবাল নেভবার ট্রিগার বাটন (Trigger Button):\n' +
                  '   • ডেস্কটপ এবং মোবাইল উভয় নেভবারেই থিম টগলের পাশে একটি আধুনিক বাটন যুক্ত করা হয়েছে।\n' +
                  '   • এতে গ্লোব আইকন, সক্রিয় ভাষার পতাকা (যেমন: 🇧🇩 বাংলা বা 🇺🇸 English) এবং ভাষার নাম প্রদর্শিত হয়।\n\n' +
                  '২. সার্চ ইনপুট ফিল্ড (Search Input Field):\n' +
                  '   • মডাল খোলার সাথে সাথে সার্চ বক্সে অটো-ফোকাস হয়।\n' +
                  '   • ইউজার যেকোনো ভাষায় সার্চ করতে পারেন (যেমন: "bengali", "বাংলা", "arabic", "es", "urdu")।\n' +
                  '   • রিয়েল-টাইমে ২৫টি সাপোর্টেড ভাষার তালিকা থেকে ফিল্টার হয়ে ইনস্ট্যান্ট রেজাল্ট দেখায়।\n\n' +
                  '৩. ডিফল্ট ৪টি প্রধান ভাষা (Default 4 Featured Languages - Quick Select):\n' +
                  '   • সার্চ খালি থাকা অবস্থায় উপরে সুন্দর ২x২ গ্রিডে ৪টি প্রধান ভাষা প্রমিনেন্টভাবে হাইলাইট থাকে:\n' +
                  '     ১. 🇺🇸 English (en)\n' +
                  '     ২. 🇧🇩 বাংলা - Bengali (bn)\n' +
                  '     ৩. 🇪🇸 Español - Spanish (es)\n' +
                  '     ৪. 🇸🇦 العربية - Arabic (ar)\n' +
                  '   • ১ ক্লিকেই যেকোনো প্রধান ভাষায় সুইচ করা যায়।\n\n' +
                  '৪. ২৫টি সম্পূর্ণ বিশ্বভাষা ও আরটিএল (RTL) সাপোর্ট:\n' +
                  '   • স্ক্রলযোগ্য তালিকায় পৃথিবীর ২৫টি স্বীকৃত ভাষা ফ্ল্যাগ ও নেটিভ নামসহ সাজানো রয়েছে।\n' +
                  '   • আরবি ও উর্দুর মতো ভাষার পাশে "RTL" ব্যাজ প্রদর্শিত হয় এবং সিলেক্ট করলে পুরো সাইটের ডিরেকশন rtl-এ রূপান্তরিত হয়।\n\n' +
                  '৫. জিও-লোকেশন ও অটো-ডিটেক্ট রিসেট (Auto-Detect Reset):\n' +
                  '   • মডালের ফুটারে ইউজারের ডিটেক্টেড লোকেশন (যেমন: "Dhaka, Bangladesh") দেখানো হয় এবং প্রয়োজনে ১-ক্লিকে আবার অটো-ডিটেক্টে ফিরে যাওয়ার বাটন রয়েছে।',
              }),
            ],
          }),

          // Section 3: Summary Table
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3. পরিবর্তিত ও নবনির্মিত কম্পোনেন্টসমূহ (Component Inventory)',
                bold: true,
                size: 26,
                color: '0F172A',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'কম্পোনেন্ট / ফাইল', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ফাইল লোকেশন', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'বাস্তবায়িত পরিবর্তন', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'LanguageSwitcherModal', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/components/common/LanguageSwitcherModal.tsx' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'নতুন মডাল: সার্চ ইনপুট, ৪টি ডিফল্ট ফিচারড ভাষা এবং ২৫টি বিশ্বভাষার লাইভ ফিল্টারিং।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PublicNavbar', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/components/layout/PublicNavbar.tsx' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ডেস্কটপ ও মোবাইল উভয় নেভবারেই Translate / Language Switcher বাটন স্থাপন।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PricingPage', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/app/pricing/page.tsx' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'সমস্ত হার্ডকোডেড ইংরেজি টেক্সটকে useTranslation() দিয়ে ডায়নামিক বহুভাষায় রূপান্তর।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'SanctuaryDashboardWrapper', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/components/dashboard/SanctuaryDashboardWrapper.tsx' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ড্যাশবোর্ড টপবারেও ল্যাঙ্গুয়েজ সুইচার বাটন স্থাপন যাতে মেম্বাররা ড্যাশবোর্ডেও ভাষা বদলাতে পারে।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Locale Dictionaries', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'types.ts, en.ts, bn.ts' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'প্রাইসিং হিরো, ৩টি প্ল্যান কার্ড, কম্প্যারিজন টেবিল এবং ৪টি FAQ-এর পূর্ণাঙ্গ অনুবাদ।' })] })] }),
                ],
              }),
            ],
          }),

          // Section 4: Verification
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '4. ভেরিফিকেশন ও কোয়ালিটি নিশ্চিতকরণ (Verification Results)',
                bold: true,
                size: 26,
                color: '0F172A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• TypeScript কম্পাইলেশন (npx tsc --noEmit): Exit code 0 (জিরো টাইপ এরর)।\n' +
                  '• জিও-লোকেশন ও পারসিস্টেন্স: লোকালস্টোরেজে `family_roots_lang` কি-এর মাধ্যমে ইউজারের ভাষা পছন্দ সংরক্ষিত থাকে।\n' +
                  '• লাইভ পেজ টেস্টিং: বাংলা সিলেক্ট করলে "স্বচ্ছ ও সাশ্রয়ী প্ল্যান, প্রতিটি বংশের জন্য", "ফ্রি স্যাংকচুয়ারি", "হেরিটেজ প্রো" এবং সমস্ত বিলিং প্রশ্নাবলী নির্ভুল বাংলায় প্রদর্শিত হয়।',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('LANGUAGE_SWITCHER_MODAL_AND_PRICING_I18N_AUDIT_REPORT.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  // Companion .doc file
  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Navbar Language Switcher Modal & Pricing Page i18n Localization Report</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      .box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 15px 0; }
      .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; background-color: #dcfce7; color: #166534; }
    </style>
  </head>
  <body>
    <h1>🌐 Navbar Language Switcher Modal & Pricing Page i18n Localization Report</h1>
    <p><em>Complete Implementation Report: Root Cause of Pricing Page English Text, Global Language Switcher Modal, Search Filtering Across 25 Languages, and Default 4 Featured Languages</em></p>
    <hr/>

    <h2>১. জিও-লোকেশন কাজ করা সত্ত্বেও প্রাইসিং পেজ কেন ইংরেজিতে ছিল?</h2>
    <div class="box">
      <strong>মূল কারণ:</strong> জিও-লোকেশন ইঞ্জিন ঠিকভাবেই ব্রাউজারের লোকেশন বাংলাদেশ ডিটেক্ট করে ভাষা বাংলায় সেট করেছিল। নেভবারের টেক্সটগুলো বাংলায় পরিবর্তিত হলেও <code>src/app/pricing/page.tsx</code> ফাইলে <code>useTranslation()</code> হুক ব্যবহার করা হয়নি এবং সমস্ত টেক্সট হার্ডকোডেড ইংরেজিতে ছিল।<br/><br/>
      <strong>সমাধান:</strong> আমরা <code>pricing/page.tsx</code>-কে সম্পূর্ণভাবে <code>useTranslation()</code> হুকের আওতায় নিয়ে এসেছি এবং <code>types.ts</code>, <code>en.ts</code>, ও <code>bn.ts</code>-এ প্রাইসিংয়ের সমস্ত হেডিং, কার্ড, ফিচার ও FAQ-এর পূর্ণাঙ্গ বাংলা অনুবাদ যুক্ত করেছি।
    </div>

    <h2>২. নেভবারে ল্যাঙ্গুয়েজ সুইচার বাটন ও সার্চ মডাল</h2>
    <ul>
      <li><strong>ট্রিগার বাটন:</strong> নেভবারে গ্লোব আইকনসহ ল্যাঙ্গুয়েজ সুইচার বাটন যুক্ত করা হয়েছে।</li>
      <li><strong>সার্চ ইনপুট ফিল্ড:</strong> মডালে তাৎক্ষণিক সার্চের জন্য সার্চ ইনপুট রয়েছে যা টাইপ করার সাথে সাথে ফিল্টার করে।</li>
      <li><strong>ডিফল্ট ৪টি প্রধান ভাষা:</strong> 🇺🇸 English, 🇧🇩 বাংলা, 🇪🇸 Español, 🇸🇦 العربية — সবার উপরে কুইক সিলেক্টে সাজানো।</li>
      <li><strong>২৫টি বিশ্বভাষা:</strong> সমস্ত ২৫টি ভাষায় সহজে সুইচ করার সুবিধা।</li>
    </ul>

    <h2>৩. পরিবর্তিত কম্পোনেন্টসমূহ</h2>
    <table>
      <tr><th>ফাইল</th><th>দায়িত্ব</th></tr>
      <tr><td><code>src/components/common/LanguageSwitcherModal.tsx</code></td><td>সার্চ ফিল্টার, ৪টি ডিফল্ট ভাষা ও ২৫টি বিশ্বভাষার ইন্টারেক্টিভ মডাল।</td></tr>
      <tr><td><code>src/components/layout/PublicNavbar.tsx</code></td><td>ডেস্কটপ ও মোবাইলে Translate বাটন প্রদর্শন।</td></tr>
      <tr><td><code>src/app/pricing/page.tsx</code></td><td>প্রাইসিং পেজের পূর্ণাঙ্গ ডায়নামিক অনুবাদ।</td></tr>
      <tr><td><code>src/components/dashboard/SanctuaryDashboardWrapper.tsx</code></td><td>ড্যাশবোর্ড টপবারে ল্যাঙ্গুয়েজ সুইচার বাটন যুক্ত।</td></tr>
    </table>
  </body>
  </html>
  `;

  const docPath = path.resolve('LANGUAGE_SWITCHER_MODAL_AND_PRICING_I18N_AUDIT_REPORT.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);
}

generateLanguageModalPricingDoc().catch(console.error);
