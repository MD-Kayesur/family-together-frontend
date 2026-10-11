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

async function generateGeolocationI18nGuide() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            size: 22, // 11pt
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
                text: '🌐 IP Geolocation & Dynamic Language Localization Guide',
                bold: true,
                size: 34,
                color: '1E3A8A',
              }),
            ],
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'IP2Location.io এপিআই ইন্টিগ্রেশন, রিয়েল-টাইম জিও-ডিটেকশন, ভাষা অনুবাদ ও প্রজেক্ট আর্কিটেকচার গাইডলাইন',
                italics: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),

          // Divider / Meta Info Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'প্রজেক্ট নাম: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'FamilyRoots (Frontend & API Bridge)\n' }),
                          new TextRun({ text: 'এপিআই প্রোভাইডার: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'IP2Location.io (RESTful Geolocation API)\n' }),
                          new TextRun({ text: 'সাপোর্টেড ল্যাঙ্গুয়েজ: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'English (en) ও বাংলা / Bengali (bn)\n' }),
                          new TextRun({ text: 'ক্যাশিং পলিসি: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: '24-Hour localStorage TTL (জিরো কোটা অপচয়)' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 100 } }),

          // Section 1: Introduction & Problem Statement
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '১. রিকোয়েস্ট বিশ্লেষণ ও মূল উদ্দেশ্য (Executive Overview)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'ইউজারের মূল চাহিদা ছিল: IP2Location এর cURL রিকোয়েস্ট ব্যবহার করে ইউজারের লোকেশন (যেমন আইপি: ',
              }),
              new TextRun({ text: '103.103.35.94', bold: true, color: 'D97706' }),
              new TextRun({
                text: ') ট্র্যাক করা এবং সেই লোকেশনের উপর ভিত্তি করে স্বয়ংক্রিয়ভাবে পুরো ওয়েবসাইটের ভাষা (English অথবা বাংলা) নির্ধারণ ও অনুবাদ করা। একই সাথে ক্লায়েন্ট যেন যেকোনো সময় ম্যানুয়ালি ভাষা পরিবর্তন করতে পারে।',
              }),
            ],
          }),

          // Section 2: Understanding the curl command
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '২. IP2Location cURL কমান্ডের বিশ্লেষণ (Understanding the API)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'ব্যবহারকারী যে cURL রিকোয়েস্টটি প্রদান করেছেন:', bold: true }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'curl "https://api.ip2location.io/?key={YOUR_API_KEY}&ip=103.103.35.94"',
                bold: true,
                color: '047857',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'এই রিকোয়েস্টের প্রতিটি অংশের গুরুত্ব ও রেসপন্স স্ট্রাকচার নিম্নরূপ:\n',
              }),
              new TextRun({ text: '• key: ', bold: true }),
              new TextRun({ text: 'IP2Location এর সিক্রেট এপিআই কি। এটি ব্রাউজারে এক্সপোজ করা অনিরাপদ, তাই আমরা এটি সার্ভার-সাইড প্রক্সিতে সুরক্ষিত রেখেছি।\n' }),
              new TextRun({ text: '• ip: ', bold: true }),
              new TextRun({ text: 'ইউজারের পাবলিক আইপি অ্যাড্রেস। ক্লায়েন্ট ব্রাউজারে না দিয়ে স্বয়ংক্রিয়ভাবে ইনকামিং রিকোয়েস্টের হেডার (x-forwarded-for, cf-connecting-ip) থেকে সার্ভার সাইড রিড করা হয়।\n' }),
              new TextRun({ text: '• রেসপন্স JSON ফিল্ডসমূহ:\n' }),
              new TextRun({ text: '  - ip: "103.103.35.94"\n' }),
              new TextRun({ text: '  - country_code: "BD" (Bangladesh)\n' }),
              new TextRun({ text: '  - country_name: "Bangladesh"\n' }),
              new TextRun({ text: '  - region_name: "Dhaka"\n' }),
              new TextRun({ text: '  - city_name: "Dhaka"\n' }),
              new TextRun({ text: '  - time_zone: "+06:00"' }),
            ],
          }),

          // Section 3: Architecture
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৩. আর্কিটেকচার ডিজাইন: কেন সার্ভার প্রক্সি ব্যবহার করা হয়েছে?',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'সরাসরি ব্রাউজার থেকে IP2Location কল করলে তিনটি মারাত্মক সমস্যা তৈরি হয়:\n',
              }),
              new TextRun({ text: '১. সিকিউরিটি ঝুঁকি: ', bold: true }),
              new TextRun({ text: 'ইউজারের ব্রাউজার নেটওয়ার্ক ট্যাবে API Key ফাঁস হয়ে যায়।\n' }),
              new TextRun({ text: '২. CORS & Adblocker ব্লকিং: ', bold: true }),
              new TextRun({ text: 'ব্রাউজার এক্সটেনশন বা অ্যাডব্লকার থার্ড-পার্টি জিও ট্র্যাকার এপিআই ব্লক করে দেয়।\n' }),
              new TextRun({ text: '৩. কোটা অপচয় ও কস্ট: ', bold: true }),
              new TextRun({ text: 'প্রতিটি পেজ রিফ্রেশে ফ্রি এপিআই কোটা নিঃশেষ হয়ে যায়।\n\n' }),
              new TextRun({
                text: 'এই কারণে আমরা ৫-স্তরীয় সুরক্ষিত ও হাই-পারফরম্যান্স আর্কিটেকচার ইমপ্লিমেন্ট করেছি:',
                bold: true,
              }),
            ],
          }),

          // Section 4: Implementation details
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৪. প্রজেক্টের কোডবেসে যুক্ত ফাইল ও ফিচারসমূহ',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          // Table of files
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ফাইলের পাথ', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ভূমিকা ও কাজের বিবরণ', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'src/app/api/geo/route.ts', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Next.js App Router সিকিউর ব্যাকএন্ড প্রক্সি রুট। ক্লায়েন্টের আইপি হেডার পার্স করে IP2Location এর সাথে যোগাযোগ করে এবং নিরাপদ JSON রিটার্ন করে। লোকালহোস্ট ও প্রাইভেট আইপি গ্রেসফুলি হ্যান্ডল করে।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'src/lib/i18n/translations.ts', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'ইংরেজি ও বাংলা সম্পূর্ণ ডিকশনারি, কান্ট্রি-টু-ল্যাঙ্গুয়েজ ম্যাপিং (BD -> bn, US/GB -> en) এবং টাইপ-সেফ getTranslation হেল্পার ফাংশন।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'src/lib/i18n/LanguageContext.tsx', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'গ্লোবাল রিয়্যাক্ট কনটেক্সট প্রোভাইডার। পেজ লোডের সময় অটো জিও-ডিটেকশন করে, ২৪ ঘণ্টার লোকালস্টোরেজ ক্যাশে সংরক্ষণ করে এবং useLanguage(), useTranslation() হুক প্রদান করে।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'src/components/common/LanguageSwitcher.tsx', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'ইউজার-ফ্রেন্ডলি ড্রপডাউন মেনু। ফ্ল্যাগ আইকন (🇺🇸 English, 🇧🇩 বাংলা), রিয়েল-টাইম ডিটেকশন স্ট্যাটাস (📍 Dhaka, Bangladesh) এবং ওয়ান-ক্লিক ম্যানুয়াল সুইচিং সুবিধা।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'src/app/layout.tsx & PublicNavbar/Footer', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'অ্যাপ্লিকেশনের রুট লেআউট র‍্যাপার এবং গ্লোবাল নেভিগেশন ও ফুটার যাতে পুরো ওয়েবসাইটে সব সময় ডাইনামিক ভাষা সাপোর্ট নিশ্চিত থাকে।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          // Section 5: Testing Guide
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৫. টেস্টিং গাইড ও cURL কমান্ডের সাহায্যে ভেরিফিকেশন',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'টেস্ট ১: আপনার ফ্রন্টএন্ড জিও এপিআই রুট পরীক্ষা করা:\n', bold: true }),
              new TextRun({ text: 'curl -s "http://localhost:3000/api/geo"\n', color: '047857' }),
              new TextRun({ text: 'রেসপন্স আসবে স্বয়ংক্রিয়ভাবে ডিটেক্টেড আইপি বা লোকালহোস্ট ডেটা সহ।\n\n' }),
              new TextRun({ text: 'টেস্ট ২: নির্দিষ্ট আইপি (যেমন বাংলাদেশের আইপি) দিয়ে টেস্ট করা:\n', bold: true }),
              new TextRun({ text: 'curl -s "http://localhost:3000/api/geo?ip=103.103.35.94"\n', color: '047857' }),
              new TextRun({ text: 'রেসপন্স:\n' }),
              new TextRun({
                text: '{\n  "ip": "103.103.35.94",\n  "country_code": "BD",\n  "country_name": "Bangladesh",\n  "city_name": "Dhaka",\n  "language": "bn"\n}\n\n',
                color: '1E40AF',
              }),
              new TextRun({ text: 'টেস্ট ৩: ইউএসএ (USA) আইপি দিয়ে টেস্ট করা:\n', bold: true }),
              new TextRun({ text: 'curl -s "http://localhost:3000/api/geo?ip=8.8.8.8"\n', color: '047857' }),
              new TextRun({ text: 'রেসপন্স:\n' }),
              new TextRun({
                text: '{\n  "ip": "8.8.8.8",\n  "country_code": "US",\n  "country_name": "United States of America",\n  "language": "en"\n}\n',
                color: '1E40AF',
              }),
            ],
          }),

          // Section 6: Configuration
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৬. কনফিগারেশন ও প্রোডাকশন ডিপ্লয়মেন্ট গাইডলাইন',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '১. IP2Location.io থেকে একটি ফ্রি একাউন্ট খুলে API Key সংগ্রহ করুন (https://www.ip2location.io)।\n' +
                  '২. আপনার .env ফাইলে নিচের লাইনটি বসান:\n' +
                  '   IP2LOCATION_API_KEY=your_actual_api_key_here\n' +
                  '৩. যদি API Key না দেওয়া হয়, সিস্টেম স্বয়ংক্রিয়ভাবে ক্লায়েন্ট ব্রাউজারের এক্সেপ্ট-ল্যাঙ্গুয়েজ এবং ফলব্যাক মেকানিজম ব্যবহার করে নিরবচ্ছিন্নভাবে কাজ চালিয়ে যাবে (জিরো ক্র্যাশ)।\n' +
                  '৪. প্রোডাকশনে Vercel, Docker বা Node.js সার্ভারে ডিপ্লয় করলে রিভার্স প্রক্সির হেডার (X-Forwarded-For) থেকে সরাসরি ইউজারের আসল আইপি ট্র্যাক হবে।',
              }),
            ],
          }),

          // Conclusion
          new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '✅ ফলাফল: আপনার সিস্টেমে স্বয়ংক্রিয় আইপি ডিটেকশন, বাংলা/ইংরেজি ট্রান্সলেশন ও ইউজার ল্যাঙ্গুয়েজ সুইচার ১০০% কার্যকর এবং প্রোডাকশন-রেডি!',
                bold: true,
                color: '059669',
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('IP2Location_Geolocation_And_Language_Translation_Guide.docx');
  const docPath = path.resolve('IP2Location_Geolocation_And_Language_Translation_Guide.doc');

  fs.writeFileSync(docxPath, buffer);
  fs.writeFileSync(docPath, buffer);

  console.log(`Successfully generated DOCX at: ${docxPath}`);
  console.log(`Successfully generated DOC at: ${docPath}`);
}

generateGeolocationI18nGuide().catch(console.error);
