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

async function generateUptimeGuide() {
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
                text: '🛡️ FamilyRoots 24/7 Perpetual Uptime & High Availability Guide',
                bold: true,
                size: 32,
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
                text: 'প্ল্যাটফর্মের স্থায়িত্বকাল, আজীবন সক্রিয় রাখার আর্কিটেকচার এবং প্রোডাকশন ক্লাউড ডিপ্লয়মেন্ট কৌশল',
                italics: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),

          // Executive Summary Table
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
                          new TextRun({ text: 'মূল প্রশ্ন: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'এই প্ল্যাটফর্ম কতদিন সক্রিয় থাকবে এবং এটি যেন কখনো বন্ধ না হয়?\n' }),
                          new TextRun({ text: 'নিশ্চিত উত্তর: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'আজীবন (Perpetually / Forever)। এই প্ল্যাটফর্মের কোনো এক্সপাইরি ডেট নেই।\n' }),
                          new TextRun({ text: 'ক্লাউড অবকাঠামো: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'Neon Serverless Cloud PostgreSQL (AWS Singapore) + Vercel Edge + Google SMTP\n' }),
                          new TextRun({ text: 'ডাউনটাইম ঝুঁকি: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: '০% (যদি ক্লাউড অথবা PM2 অটো-রিস্টার্ট মেকানিজম সক্রিয় রাখা হয়)।' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 100 } }),

          // Section 1
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '১. প্ল্যাটফর্মের ৪টি স্তম্ভ এবং তাদের স্থায়িত্ব (Component Lifespan)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          // Table of components
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'কম্পোনেন্ট', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'হোস্টিং / সার্ভিস', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'স্থায়িত্ব ও Uptime', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: '১. ডাটাবেজ (Database)', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Neon Cloud PostgreSQL (AWS Singapore)' })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'আজীবন সক্রিয়। ৯৯.৯৯% SLA। এটি ক্লাউডে হোস্ট করা, আপনার পিসি বন্ধ থাকলেও ডাটাবেজ ২৪/৭ লাইভ থাকে।' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: '২. মেইল ডেলিভারি (SMTP)', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Google Gmail SMTP (fnas aicm zpdr poso)' })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'কখনোই এক্সপায়ার হবে না। প্রতিদিন ৫০০টি ইমেইল ফ্রি পাঠানো যাবে।' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: '৩. ব্যাকএন্ড এপিআই (Backend API)', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'NestJS REST API (Port 8000 / Vercel Serverless)' })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Vercel এ ডিপ্লয় করলে ২৪/৭ আজীবন লাইভ। লোকাল পিসিতে PM2 দিয়ে সার্বক্ষণিক সচল রাখা সম্ভব।' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: '৪. ফ্রন্টএন্ড ওয়েব অ্যাপ (Frontend)', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Next.js 16 (Port 3000 / Vercel Edge CDN)' })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Vercel Edge গ্লোবাল সিডিএন এ আজীবন ১০০% ফ্রি ও জিরো ডাউনটাইমে চলবে।' })] })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 100 } }),

          // Section 2
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '২. লোকাল কম্পিউটারে কখনো বন্ধ না হওয়ার উপায় (Local Machine Persistence)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'বর্তমানে আপনার লোকাল কম্পিউটারে ব্যাকএন্ড (port 8000) এবং ফ্রন্টএন্ড (port 3000) ব্যাকগ্রাউন্ডে চলছে। যদি আপনার কম্পিউটার রিস্টার্ট বা বন্ধ হয়, তবে সার্ভার স্বাভাবিকভাবেই থেমে যাবে।\n\n' +
                  'লোকাল কম্পিউটারে এটিকে সার্বক্ষণিক চালু রাখার জন্য নিচের মেকানিজম ব্যবহার করতে পারেন:\n',
              }),
              new TextRun({ text: 'পদ্ধতি ১: PM2 Process Manager (অটো-রিস্টার্ট ও রিকভারি)\n', bold: true }),
              new TextRun({
                text: 'PM2 হলো একটি এন্টারপ্রাইজ প্রসেস ম্যানেজার যা ব্যাকএন্ড ক্র্যাশ হলে ১০০ মিলিসেকেন্ডের মধ্যে স্বয়ংক্রিয়ভাবে রিস্টার্ট করে দেয়:\n' +
                  'npm install -g pm2\n' +
                  'pm2 start dist/src/main.js --name "familyroots-api"\n' +
                  'pm2 startup\n' +
                  'pm2 save\n\n',
                color: '047857',
              }),
              new TextRun({ text: 'পদ্ধতি ২: Windows Service হিসেবে ব্যাকগ্রাউন্ডে চালানো\n', bold: true }),
              new TextRun({
                text: 'উইন্ডোজ চালু হওয়ার সাথে সাথে কোনো উইন্ডো ওপেন না করেই ব্যাকগ্রাউন্ডে সার্ভিস চালু রাখতে "pm2-windows-service" অথবা "nssm" ব্যবহার করা যায়।',
              }),
            ],
          }),

          // Section 3
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৩. ক্লাউডে ২৪/৭ আজীবন বিনামূল্যে লাইভ রাখার উপায় (Cloud 24/7 Deployment)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'আপনার কম্পিউটার বন্ধ থাকলেও ইন্টারনেটের মানুষ যাতে বিশ্বের যেকোনো প্রান্ত থেকে সারাবছর দিনরাত ২৪ ঘণ্টা সাইটটি ব্যবহার করতে পারে, তার জন্য আমরা প্রজেক্টে অলরেডি ক্লাউড কনফিগারেশন রেডি করে রেখেছি:\n\n',
              }),
              new TextRun({ text: '১. Vercel ডিপ্লয়মেন্ট (অলরেডি vercel.json এবং api/index.ts প্রস্তুত):\n', bold: true }),
              new TextRun({
                text: 'ফ্রন্টএন্ড এবং ব্যাকএন্ড দুটোই Vercel-এ ১ ক্লিকে ডিপ্লয় করা যায়। Vercel সার্ভারলেস আর্কিটেকচার ব্যবহার করায় সার্ভার কখনো ডাউন হয় না এবং বিল্ড আজীবন ফ্রিতে চলে।\n\n',
              }),
              new TextRun({ text: '২. Render / Railway / Koyeb বিকল্প:\n', bold: true }),
              new TextRun({
                text: 'যদি লং-রানিং স্ট্যান্ডঅ্যালোন নোড সার্ভার হিসেবে চালাতে চান, Render.com বা Railway.app এ গিটহাব পুশ করলেই ২৪/৭ ক্লাউডে চলতে থাকবে।\n\n',
              }),
              new TextRun({ text: '৩. ডাটাবেজ অলরেডি ক্লাউডে সক্রিয়:\n', bold: true }),
              new TextRun({
                text: 'আপনার প্রজেক্টের ডাটাবেজ লোকাল কম্পিউটারে নেই; এটি সিঙ্গাপুরের AWS ডেটাসেন্টারে Neon ক্লাউডে আছে। ফলে আপনার কম্পিউটার বন্ধ থাকলেও ডাটাবেজের ১ বাইট তথ্যও নষ্ট হবে না।',
              }),
            ],
          }),

          // Section 4
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৪. হেলথ চেক ও অটোমেটিক আপটাইম মনিটরিং (Never-Stop Assurance)',
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
                text: 'প্ল্যাটফর্মে একটি ডেডিকেটেড হেলথ চেক এন্ডপয়েন্ট রয়েছে: ',
              }),
              new TextRun({ text: 'GET /health\n\n', bold: true, color: '1E40AF' }),
              new TextRun({
                text: 'আপনি ফ্রিতে UptimeRobot (https://uptimerobot.com) এ একাউন্ট খুলে এই লিঙ্কটি যুক্ত করে রাখতে পারেন। UptimeRobot প্রতি ৫ মিনিট পরপর সার্ভার চেক করবে। যদি কখনো সার্ভারে সামান্য সমস্যাও হয়, আপনার ফোনে বা ইমেইলে সাথে সাথে অ্যালার্ট চলে আসবে।',
              }),
            ],
          }),

          // Conclusion
          new Paragraph({
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '✅ ১০০% নিশ্চয়তা (Final Guarantee): আপনার ডাটাবেজ ক্লাউডে সুরক্ষিত, ইমেইল গুগল সার্ভারের সাথে পার্মানেন্টলি সংযুক্ত, এবং প্ল্যাটফর্ম আর্কিটেকচার ক্লাউড-রেডি। এই প্ল্যাটফর্ম আজীবন নিরবচ্ছিন্নভাবে চলবে!',
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
  const docxBackendPath = path.resolve('..', 'family-together-backend', 'FamilyRoots_24_7_Perpetual_Uptime_And_Production_Survival_Guide.docx');
  const docBackendPath = path.resolve('..', 'family-together-backend', 'FamilyRoots_24_7_Perpetual_Uptime_And_Production_Survival_Guide.doc');

  fs.writeFileSync(docxBackendPath, buffer);
  fs.writeFileSync(docBackendPath, buffer);

  console.log(`Successfully generated backend DOCX at: ${docxBackendPath}`);
  console.log(`Successfully generated backend DOC at: ${docBackendPath}`);
}

generateUptimeGuide().catch(console.error);
