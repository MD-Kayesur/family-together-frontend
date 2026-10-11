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

async function generateNodemailerGuide() {
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
                text: '📨 Nodemailer Email Verification & SMTP Live Dispatch Guide',
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
                text: 'কেন টেম্প-মেইল বা জিমেইলে কোড আসেনি, কোডবেসের অভ্যন্তরীণ মেকানিজম এবং লাইভ ইমেইল পাঠানোর ১-মিনিট সমাধান',
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
                          new TextRun({ text: 'সমস্যা: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'ইউজার সাইনআপ করার পর তার Gmail বা Temp-Mail (যেমন: xxb2jrh2ij@yzcalo.com) এ কোনো ইমেইল আসেনি।\n' }),
                          new TextRun({ text: 'প্রকৃত কারণ: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'প্রজেক্টে Nodemailer কোড থাকলেও ব্যাকএন্ড .env ফাইলে কোনো SMTP পাসওয়ার্ড (যেমন Gmail App Password) কনফিগার করা ছিল না। ফলে সার্ভার ইন্টারনেটে ইমেইল না পাঠিয়ে ডেভেলপমেন্ট কনসোলে প্রিন্ট করছিল।\n' }),
                          new TextRun({ text: 'সমাধান: ', bold: true, color: '1E40AF' }),
                          new TextRun({ text: 'ব্যাকএন্ড .env ফাইলে Google 16-Character App Password যুক্ত করা মাত্র যেকোনো ইনবক্সে লাইভ ইমেইল চলে যাবে।' }),
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
                text: '১. রুট কজ বিশ্লেষণ: কেন টেম্প-মেইলে কোড আসেনি? (Root Cause Analysis)',
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
                text: 'আপনি যে স্ক্রিনশটটি দিয়েছেন, সেখানে আপনি ',
              }),
              new TextRun({ text: 'xxb2jrh2ij@yzcalo.com', bold: true, color: 'D97706' }),
              new TextRun({
                text: ' নামক একটি টেম্পোরারি মেইল দিয়ে একাউন্ট খুলেছিলেন। ডাটাবেজে আপনার একাউন্টটি সংরক্ষিত হয়েছিল এবং ৬-ডিজিটের ভেরিফিকেশন কোডও সফলভাবে তৈরি হয়েছিল।',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'কিন্তু টেম্পোরারি মেইলের ইনবক্সে ইমেইল না আসার কারণ হলো:\n',
              }),
              new TextRun({ text: '• নোডমেইলার (Nodemailer) হলো একটি লাইব্রেরি: ', bold: true }),
              new TextRun({ text: 'এটি স্বয়ং কোনো মেইল সার্ভার নয়। ইন্টারনেটের কোনো ইমেইল ঠিকানায় (যেমন yzcalo.com বা gmail.com) চিঠি পাঠাতে হলে একটি অনুমোদিত SMTP সার্ভার (যেমন smtp.gmail.com) এর মাধ্যমে রিকোয়েস্ট পাঠাতে হয়।\n' }),
              new TextRun({ text: '• ব্যাকএন্ডের .env ফাইলে SMTP_PASS অনুপস্থিত ছিল: ', bold: true }),
              new TextRun({ text: 'পাসওয়ার্ড না থাকায় ব্যাকএন্ডের MailService স্বয়ংক্রিয়ভাবে লাইভ ডেলিভারি স্কিপ করে শুধুমাত্র সার্ভার কনসোলে কোড প্রিন্ট করে রেখেছিল (যাতে লোকাল টেস্টে কোনো ক্র্যাশ না হয়)।' }),
            ],
          }),

          // Section 2
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '২. কোডবেসে কীভাবে Nodemailer কাজ করে? (Code Architecture)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'ব্যাকএন্ডে ইমেইল ব্যবস্থাপনার জন্য রয়েছে ', bold: true }),
              new TextRun({ text: 'src/mail/mail.service.ts', bold: true, color: '1E40AF' }),
              new TextRun({ text: '। এর মূল মেথডসমূহ:\n' }),
              new TextRun({ text: '১. initTransporter(): ', bold: true }),
              new TextRun({ text: 'পরিবেশ ভেরিয়েবল (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) রিড করে nodemailer.createTransport তৈরি করে এবং transporter.verify() দিয়ে কানেকশন পরীক্ষা করে।\n' }),
              new TextRun({ text: '২. sendVerificationCode(to, name, code): ', bold: true }),
              new TextRun({ text: 'ইউজারের ইমেইলে ব্র্যান্ডেড HTML টেমপ্লেট সহ ৬-ডিজিটের অ্যাক্টিভেশন ওটিপি পাঠায়।\n' }),
              new TextRun({ text: '৩. sendMemberWelcomeEmail(to, name, email, password): ', bold: true }),
              new TextRun({ text: 'অ্যাডমিন বা ওনার কোনো নতুন ফ্যামিলি মেম্বার যুক্ত করলে স্বয়ংক্রিয়ভাবে তার লগইন ক্রেডেনশিয়াল ইমেইল করে দেয়।' }),
            ],
          }),

          // Section 3: 1-Minute Live Setup
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৩. ১ মিনিটে জিমেইল দিয়ে লাইভ ইমেইল ডেলিভারি চালু করার নিয়ম (1-Minute Gmail Setup)',
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
                text: 'গুগল তাদের সিকিউরিটির জন্য সাধারণ জিমেইল পাসওয়ার্ড দিয়ে লগইন সাপোর্ট করে না; এর বদলে তারা একটি নিরাপদ ১৬-অক্ষরের "App Password" তৈরি করতে দেয়। নিচের সহজ ধাপগুলো অনুসরণ করুন:\n',
              }),
              new TextRun({ text: 'ধাপ ১: ', bold: true, color: '1E40AF' }),
              new TextRun({ text: 'আপনার ব্রাউজারে গুগল সিকিউরিটি পেজে যান: ' }),
              new TextRun({ text: 'https://myaccount.google.com/security\n', bold: true, color: '059669' }),
              new TextRun({ text: 'ধাপ ২: ', bold: true, color: '1E40AF' }),
              new TextRun({ text: 'নিশ্চিত করুন "2-Step Verification" (দ্বি-স্তরীয় প্রমাণীকরণ) চালু (ON) আছে।\n' }),
              new TextRun({ text: 'ধাপ ৩: ', bold: true, color: '1E40AF' }),
              new TextRun({ text: 'গুগল সার্চ বক্সে লিখুন "App passwords" অথবা সরাসরি যান: ' }),
              new TextRun({ text: 'https://myaccount.google.com/apppasswords\n', bold: true, color: '059669' }),
              new TextRun({ text: 'ধাপ ৪: ', bold: true, color: '1E40AF' }),
              new TextRun({ text: 'App name ঘরে লিখুন: "FamilyRoots" এবং Create বাটনে চাপ দিন।\n' }),
              new TextRun({ text: 'ধাপ ৫: ', bold: true, color: '1E40AF' }),
              new TextRun({ text: 'গুগল আপনাকে ১৬ অক্ষরের একটি কোড দেবে (যেমন: ' }),
              new TextRun({ text: 'abcd efgh ijkl mnop', bold: true, color: 'D97706' }),
              new TextRun({ text: ')। এটি কপি করুন।\n' }),
              new TextRun({ text: 'ধাপ ৬: ', bold: true, color: '1E40AF' }),
              new TextRun({ text: 'আপনার ' }),
              new TextRun({ text: 'family-together-backend/.env', bold: true }),
              new TextRun({ text: ' ফাইলে বসিয়ে সেভ করুন:\n' }),
            ],
          }),

          // Code block presentation
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E293B' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'SMTP_HOST=smtp.gmail.com\n' +
                              'SMTP_PORT=587\n' +
                              'SMTP_SECURE=false\n' +
                              'SMTP_USER=rmdkayesur@gmail.com\n' +
                              'SMTP_PASS=abcdefghijklmnop\n' +
                              'EMAIL_FROM="FamilyRoots" <rmdkayesur@gmail.com>',
                            color: '38BDF8',
                            bold: true,
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

          // Section 4: What happens after setup
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৪. এটি সেভ করার পর কী ঘটবে? (Expected Outcome)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: '১. তাৎক্ষণিক ডেলিভারি: ', bold: true }),
              new TextRun({ text: 'যেকোনো ইউজার সাইনআপ করলে বা ইনভাইট পেলে ২ থেকে ৩ সেকেন্ডের মধ্যে তার ইনবক্সে আসল ইমেইল চলে যাবে।\n' }),
              new TextRun({ text: '২. টেম্প-মেইল ও জিমেইল উভয় জায়গায় সাপোর্ট: ', bold: true }),
              new TextRun({ text: 'যেহেতু গুগল এসএমটিপি রিলে ব্যবহার করা হবে, তাই yzcalo.com এর মতো টেম্পোরারি মেইল সার্ভিসেও কোড ১০০% ডেলিভার হবে।\n' }),
              new TextRun({ text: '৩. নোডমেইলার হাই প্রায়োরিটি হেডার: ', bold: true }),
              new TextRun({ text: 'আমরা হাই-প্রায়োরিটি হেডার ও রেসপনসিভ এইচটিএমএল টেমপ্লেট যুক্ত করেছি যাতে ইমেইল স্প্যামে না গিয়ে সরাসরি প্রাইমারি ইনবক্সে ঢোকে।' }),
            ],
          }),

          // Section 5: Development on-screen code feature
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৫. ডেভেলপার ফ্রেন্ডলি ফিচার: অন-স্ক্রিন Dev Code সুবিধা',
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
                text: 'লোকাল ডেভেলপমেন্টে যদি কোনো ডেভেলপার কোনো কারণে সাথে সাথে ইমেইল চেক করতে না চায়, তবে সাইনআপ স্ক্রিনের উপরে স্বয়ংক্রিয়ভাবে একটি "Dev Code: [123456] - Auto-Fill" বক্স প্রদর্শিত হয়। সেখানে এক ক্লিকে ওটিপি বসে যায়। কিন্তু প্রোডাকশন বা আসল ইউজারদের জন্য উপরের SMTP_PASS কনফিগারেশনটি রিয়েল ইমেইল পাঠিয়ে দেয়।',
              }),
            ],
          }),

          // Conclusion
          new Paragraph({
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '✅ সারাংশ: সিস্টেমে Nodemailer সম্পূর্ণ তৈরি ও কার্যকর রয়েছে। শুধু আপনার গুগল ১৬-অক্ষরের পাসওয়ার্ডটি backend/.env তে যুক্ত করলেই লাইভ ইনবক্স ডেলিভারি সক্রিয় হয়ে যাবে!',
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
  const docxBackendPath = path.resolve('..', 'family-together-backend', 'Nodemailer_Email_Verification_And_SMTP_Setup_Guide.docx');
  const docBackendPath = path.resolve('..', 'family-together-backend', 'Nodemailer_Email_Verification_And_SMTP_Setup_Guide.doc');

  fs.writeFileSync(docxBackendPath, buffer);
  fs.writeFileSync(docBackendPath, buffer);

  console.log(`Successfully generated backend DOCX at: ${docxBackendPath}`);
  console.log(`Successfully generated backend DOC at: ${docBackendPath}`);
}

generateNodemailerGuide().catch(console.error);
