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

async function generateBanglaDoc() {
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
          // Title
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '🌐 নেভবার থেকে ভাষা পরিবর্তন বাদ ও প্রোফাইল ভিত্তিক গ্লোবাল i18n আর্কিটেকচার',
                bold: true,
                size: 32,
                color: '1E3A8A',
              }),
            ],
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: 'ব্যবহারকারীর নির্দেশনার পূর্ণাঙ্গ ব্যাখ্যা ও টেকনিক্যাল বাস্তবায়ন পরিকল্পনা (বাংলা সংস্করণ)',
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
                text: 'FamilyRoots Platform ("Family Together") • Next.js 16 + React 19 + LanguageContext',
                italics: true,
                size: 18,
                color: '64748B',
              }),
            ],
          }),

          // Divider
          new Paragraph({
            text: '_________________________________________________________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // SECTION 1
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({
                text: '১. আপনার নির্দেশনা থেকে আমি ঠিক কী কী বুঝেছি (বিস্তারিত বিবরণ)',
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
                text: 'আপনার প্রম্পট বিশ্লেষণ করে আমি ৫টি সুনির্দিষ্ট বিষয় পরিষ্কারভাবে চিহ্নিত করেছি:\n\n' +
                  '১.১ নেভবার (Navbar) থেকে ভাষা পরিবর্তন বাটন মুছে ফেলা:\n' +
                  'বর্তমান পাবলিক নেভবারে (PublicNavbar.tsx) যে ভাষা পরিবর্তন বাটন রয়েছে, সেটি আর রাখা যাবে না। ডেক্সটপ ও মোবাইল উভয় নেভবার থেকে এটি সম্পূর্ণভাবে তুলে দিয়ে নেভবার পরিষ্কার ও আধুনিক রাখতে হবে।\n\n' +
                  '১.২ সমস্ত ড্যাশবোর্ডের প্রোফাইল সেকশনে ভাষা নির্বাচনের অপশন তৈরি:\n' +
                  'ব্যবহারকারী যখন তার প্রোফাইল পেজে যাবেন, সেখানে একটি নিবেদিত "ভাষা ও অনুবাদ পছন্দ" (Language & Localization Preferences) কার্ড বা সেকশন দেখতে পাবেন। এটি সব ড্যাশবোর্ডে থাকবে:\n' +
                  '  • ওনার ড্যাশবোর্ড (Owner Dashboard: /owner-dashboard?tab=profile)\n' +
                  '  • সাধারণ সদস্য ড্যাশবোর্ড (Member/User Dashboard: /user-dashboard?tab=profile)\n' +
                  '  • অ্যাডমিন ড্যাশবোর্ড (Admin Dashboard: /admin-dashboard/settings)\n\n' +
                  '১.৩ বিশ্বের প্রধান প্রধান সকল ভাষার সমর্থন (All World Languages):\n' +
                  'বর্তমানে শুধুমাত্র ইংরেজি ও বাংলা রয়েছে। এটিকে সম্প্রসারিত করে বিশ্বের প্রধান প্রধান ১৫+ ভাষা (যেমন: ইংরেজি, বাংলা, স্প্যানিশ, ফ্রেঞ্চ, জার্মান, আরবি, হিন্দি, চাইনিজ, পর্তুগিজ, জাপানিজ, রাশিয়ান, ইতালিয়ান, কোরিয়ান, তুর্কি, উর্দু) যুক্ত করতে হবে।\n\n' +
                  '১.৪ ক্যারেট (Caret / ChevronDown) ড্রপডাউন ইন্টারফেস:\n' +
                  'ল্যাঙ্গুয়েজ সিলেক্টরটি দেখতে হবে খুব প্রিমিয়াম। একটি সুন্দর ক্যারেট আইকন (Caret / ChevronDown) থাকবে, যাতে ক্লিক করলে সব ভাষার তালিকা (পতাকা, নিজস্ব ভাষা ও ইংরেজি নাম সহ) ড্রপডাউন হিসেবে প্রদর্শিত হবে।\n\n' +
                  '১.৫ এক ক্লিকেই পুরো অ্যাপ্লিকেশনের সব পেজে ভাষা কার্যকর হওয়া (Instant Global i18n):\n' +
                  'প্রোফাইল থেকে ভাষা পরিবর্তন করার সাথে সাথেই কোনো ব্রাউজার রিলোড বা রিফ্রেশ ছাড়াই তৎক্ষণাৎ পুরো প্ল্যাটফর্মের সমস্ত পেজ, হেডার ও ড্যাশবোর্ডে সেই ভাষা কাজ করবে এবং তা ব্রাউজারের লোকাল স্টোরেজে স্থায়ীভাবে সেভ হয়ে থাকবে।',
              }),
            ],
          }),

          // SECTION 2: COMPARISON TABLE
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({
                text: '২. বর্তমান অবস্থা বনাম কাঙ্ক্ষিত নতুন আর্কিটেকচার তুলনা',
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
                  createCell('বিষয় / এরিয়া', true, 25),
                  createCell('বর্তমান কোডের অবস্থা', true, 37),
                  createCell('আপনার নির্দেশনা অনুযায়ী নতুন সমাধান', true, 38),
                ],
              }),
              new TableRow({
                children: [
                  createCell('পাবলিক নেভবার (Navbar)', false, 25, true),
                  createCell('PublicNavbar.tsx-এ ডেক্সটপ ও মোবাইলে <LanguageSwitcher /> রয়েছে।', false, 37),
                  createCell('নেভবার থেকে সম্পূর্ণভাবে বাদ দেওয়া হবে। নেভবার ক্লিন থাকবে।', false, 38),
                ],
              }),
              new TableRow({
                children: [
                  createCell('সমর্থিত ভাষা সংখ্যা', false, 25, true),
                  createCell('শুধুমাত্র English ও Bengali (en / bn)।', false, 37),
                  createCell('বিশ্বের প্রধান ১৫+ ভাষা (en, bn, es, fr, de, ar, hi, zh, pt, ja, ru, it, ko, tr, ur)।', false, 38),
                ],
              }),
              new TableRow({
                children: [
                  createCell('ভাষা নির্বাচনের অবস্থান', false, 25, true),
                  createCell('প্রোফাইল সেকশনে ভাষার কোনো অপশন নেই।', false, 37),
                  createCell('সব ড্যাশবোর্ডের প্রোফাইল সেকশনে একটি প্রিমিয়াম কেয়ারেট ড্রপডাউন কার্ড।', false, 38),
                ],
              }),
              new TableRow({
                children: [
                  createCell('গ্লোবাল অ্যাপ্লিকেশনে রূপান্তর', false, 25, true),
                  createCell('লোকাল স্টেট ও শুধুমাত্র দুটি ভাষার সীমিত ট্রানস্লেশন।', false, 37),
                  createCell('LanguageContext-এর মাধ্যমে সব পেজে রিয়েল-টাইম রি-রেন্ডারিং ও ফলব্যাক হ্যান্ডলিং।', false, 38),
                ],
              }),
            ],
          }),

          // SECTION 3: STEP BY STEP PLAN
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 350, after: 120 },
            children: [
              new TextRun({
                text: '৩. ধাপে ধাপে টেকনিক্যাল বাস্তবায়ন পরিকল্পনা',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 90 },
            children: [
              new TextRun({
                text: 'ধাপ ১: নেভবার থেকে LanguageSwitcher রিমুভ করা',
                bold: true,
                size: 22,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'src/components/layout/PublicNavbar.tsx ফাইলে ডেক্সটপ ও মোবাইলের হেডার ক্লাস্টার থেকে LanguageSwitcher কম্পোনেন্টটি সরিয়ে দেওয়া হবে, ফলে পাবলিক পেজের হেডার থাকবে নিটোল ও আধুনিক।',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 90 },
            children: [
              new TextRun({
                text: 'ধাপ ২: translations.ts এ বিশ্বের প্রধান প্রধান ভাষা যুক্ত করা',
                bold: true,
                size: 22,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'src/lib/i18n/translations.ts ফাইলের Language টাইপ এবং SUPPORTED_LANGUAGES অ্যারেতে ১৫+ ভাষা যুক্ত করা হবে। প্রতিটি ভাষার পতাকা (Flag), নিজস্ব নাম (Native Name), এবং ইংরেজি নাম ডিফাইন করা হবে। এছাড়া কোনো ভাষার অনুবাদ কী (key) মিসিং থাকলে নিরাপদ ফলব্যাক হিসেবে ইংরেজি প্রদর্শিত হবে।',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 90 },
            children: [
              new TextRun({
                text: 'ধাপ ৩: LanguageContext.tsx আপডেট করে ফুল গ্লোবাল সিঙ্ক তৈরি',
                bold: true,
                size: 22,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'src/lib/i18n/LanguageContext.tsx ফাইলকে এমনভাবে সাজানো হবে যাতে যেকোনো নতুন ভাষা সিলেক্ট করার সাথে সাথেই ব্রাউজারের লোকাল স্টোরেজে (family_roots_lang) সংরক্ষিত হয় এবং পুরো অ্যাপের রিঅ্যাক্ট স্টেটকে তৎক্ষণাৎ ট্রিগার করে রি-রেন্ডার করে দেয়।',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 90 },
            children: [
              new TextRun({
                text: 'ধাপ ৪: কেয়ারেট (Caret) ড্রপডাউন সহ ProfileLanguageSelector কম্পোনেন্ট তৈরি',
                bold: true,
                size: 22,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'src/components/common/ProfileLanguageSelector.tsx নামের একটি প্রিমিয়াম কম্পোনেন্ট তৈরি করা হবে। এতে থাকবে:\n' +
                  '  • বর্তমান ভাষার ফ্ল্যাগ ও নাম সহ কেয়ারেট আইকন (ChevronDown)।\n' +
                  '  • ক্লিক করলে মসৃণভাবে খুলে যাওয়া ড্রপডাউন মেনু।\n' +
                  '  • সাথে সাথে ভাষা পরিবর্তন ও সবুজ টিকমার্ক সহ লাইভ ফিডব্যাক নোটিফিকেশন।',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 90 },
            children: [
              new TextRun({
                text: 'ধাপ ৫: সকল ড্যাশবোর্ডের প্রোফাইল ও সেটিংস পেজে ইন্টিগ্রেশন',
                bold: true,
                size: 22,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• Owner Dashboard ও User Dashboard: SettingsTab.tsx ফাইলের Profile & Account ট্যাবে এটি যুক্ত করা হবে।\n' +
                  '• Admin Dashboard: src/app/admin-dashboard/settings/page.tsx ফাইলের প্রেফারেন্সেস সেকশনে এটি যুক্ত করা হবে।',
              }),
            ],
          }),

          // Footer
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
                text: 'FamilyRoots প্ল্যাটফর্ম আর্কিটেকচার গাইড • Antigravity IDE • সর্বস্বত্ব সংরক্ষিত',
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

  const backendDocxPath = path.resolve('d:/Projects/family-together-backend/FamilyRoots_Language_Switch_And_Profile_i18n_Bangla_Guide.docx');
  const frontendDocxPath = path.resolve('d:/Projects/family-together-frontend/FamilyRoots_Language_Switch_And_Profile_i18n_Bangla_Guide.docx');
  const backendDocPath = path.resolve('d:/Projects/family-together-backend/FamilyRoots_Language_Switch_And_Profile_i18n_Bangla_Guide.doc');
  const frontendDocPath = path.resolve('d:/Projects/family-together-frontend/FamilyRoots_Language_Switch_And_Profile_i18n_Bangla_Guide.doc');

  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);

  const docSummaryBangla = `ফ্যামিলিরুটস প্ল্যাটফর্ম — নেভবার থেকে ভাষা পরিবর্তন বাদ ও প্রোফাইল ভিত্তিক গ্লোবাল i18n আর্কিটেকচার (বাংলা গাইড)
========================================================================================================

১. আপনার নির্দেশনার পূর্ণাঙ্গ উপলব্ধি:
- ১. নেভবার থেকে সুইচ ভাষা বাদ: পাবলিক নেভবারে কোনো ড্রপডাউন বা ল্যাঙ্গুয়েজ বাটন থাকবে না।
- ২. সমস্ত ড্যাশবোর্ডের প্রোফাইলে স্থানান্তর: ওনার, মেম্বার এবং অ্যাডমিন ড্যাশবোর্ডের প্রোফাইল সেকশনে ভাষা পছন্দের কার্ড থাকবে।
- ৩. বিশ্বের প্রধান সব ভাষার সমর্থন: শুধু ইংরেজি ও বাংলা নয়, বিশ্বের ১৫+ প্রধান ভাষা (স্প্যানিশ, ফ্রেঞ্চ, আরবি, হিন্দি, চাইনিজ ইত্যাদি) থাকবে।
- ৪. ক্যারেট (Caret) ড্রপডাউন: সুন্দর অ্যারো/ক্যারেট আইকন সহ মসৃণ ড্রপডাউন সিলেক্টর।
- ৫. এক ক্লিকে পুরো অ্যাপে ভাষা কার্যকর: প্রোফাইল থেকে ভাষা সিলেক্ট করলে ব্রাউজার রিলোড ছাড়াই সমস্ত পেজ ও ড্যাশবোর্ডে সাথে সাথে তা কার্যকর হবে।

২. বাস্তবায়নের রূপরেখা:
- PublicNavbar.tsx থেকে LanguageSwitcher সরানো।
- translations.ts এ ১৫+ ভাষা ও নিরাপদ ফলব্যাক তৈরি।
- LanguageContext.tsx এ ফুল গ্লোবাল সিঙ্ক।
- ProfileLanguageSelector.tsx কম্পোনেন্ট তৈরি।
- SettingsTab.tsx এবং AdminSettingsPage.tsx এ ইন্টিগ্রেশন।
`;

  fs.writeFileSync(backendDocPath, docSummaryBangla, 'utf-8');
  fs.writeFileSync(frontendDocPath, docSummaryBangla, 'utf-8');

  console.log('Successfully generated Bangla .docx and .doc files in both repositories!');
}

generateBanglaDoc().catch((err) => {
  console.error('Error generating Bangla document:', err);
  process.exit(1);
});
