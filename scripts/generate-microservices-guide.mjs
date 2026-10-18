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

async function generateMicroservicesGuide() {
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
                text: '🏗️ Architectural Decision: Do You Need Microservices for FamilyRoots?',
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
                text: 'Comprehensive Engineering Evaluation: Modular Monolith vs. Distributed Microservices, Cost Analysis, Operational Overhead, and Scaling Strategy',
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

          // Section 1: Executive Answer
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '1. এক্সিকিউটিভ সামারি ও চূড়ান্ত সিদ্ধান্ত (Executive Verdict)',
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
                text: 'সরাসরি উত্তর: আপনার এই প্রজেক্টের জন্য এখন মাইক্রোসার্ভিস (Microservices) এর একেবারেই কোনো প্রয়োজন নেই!\n',
                bold: true,
                size: 24,
                color: 'DC2626',
              }),
              new TextRun({
                text: 'বর্তমানে মাইক্রোসার্ভিস আর্কিটেকচারে যাওয়া হবে একটি চরম Over-engineering এবং প্রজেক্টের জন্য মারাত্মক ভুল সিদ্ধান্ত (Anti-Pattern)। আপনার বর্তমান NestJS ব্যাকএন্ড ইতিমধ্যে বিশ্বমানের "Modular Monolith" (মডিউলার মনোলিথ) প্যাটার্নে গঠিত, যা মাইক্রোসার্ভিসের সমস্ত সুবিধা দেয় কিন্তু মাইক্রোসার্ভিসের কোনো জটিলতা বা অতিরিক্ত খরচ তৈরি করে না।\n\n' +
                  'এমনকি Amazon Prime Video এবং Shopify-এর মতো বিলিয়ন ডলারের কোম্পানিগুলো মাইক্রোসার্ভিসের অতিরিক্ত খরচ ও জটিলতা এড়াতে আবার মনোলিথ আর্কিটেকচারে ফিরে এসেছে এবং ক্লাউড খরচ ৯০% কমিয়ে এনেছে!',
              }),
            ],
          }),

          // Section 2: Comparison Table
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. তুলনামূলক বিশ্লেষণ: মডিউলার মনোলিথ বনাম মাইক্রোসার্ভিস (Direct Comparison)',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'মূল বিষয় (Metric)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'আপনার বর্তমান NestJS Modular Monolith', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'মাইক্রোসার্ভিস (Distributed Microservices)', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ডেভেলপমেন্ট স্পিড', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'অত্যন্ত দ্রুত (১০ গুণ দ্রুত)। নতুন ফিচার ১ দিনে লাইভ করা যায়।' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'খুবই ধীরগতির। সার্ভিসগুলোর মধ্যে API কন্ট্রাক্ট, gRPC এবং নেটওয়ার্কিং সামলাতেই সময় নষ্ট হয়।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'হোস্টিং ও ক্লাউড খরচ', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'কম খরচে চালানো যায় ($১০-$২৫/মাস)। একটি স্ট্যান্ডার্ড VPS-এ লাখ লাখ রিকোয়েস্ট হ্যান্ডেল করতে পারে।' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'অত্যধিক ব্যয়বহুল ($২০০-$৫০০+/মাস)। Kubernetes, Service Mesh, Kafka, একাধিক সার্ভার লাগে।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ডাটাবেস ট্রানজেকশন (ACID)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Prisma $transaction দিয়ে এক নিমিষে শতভাগ নিরাপদ ও নিখুঁত রোলব্যাক নিশ্চিত।' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'অত্যন্ত জটিল। Distributed Transaction, Saga Pattern ও Eventual Consistency সামলাতে গিয়ে ডাটা মিসম্যাচ হয়।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'রিয়েলটাইম পারফরম্যান্স', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'মেমরির ভেতরে সরাসরি কল (Microseconds latency)। Socket.IO সুপার ফাস্ট।' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'সার্ভিসগুলোর মাঝে নেটওয়ার্ক হপ (HTTP/REST latency) যুক্ত হয়ে গতি কমে যায়।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ডিবাগিং ও মনিটরিং', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'খুবই সহজ। একটি কনসোলে পুরো অ্যাপ্লিকেশনের এরর স্ট্যাক-ট্রেস দেখা যায়।' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'কঠিন। Distributed Tracing (Jaeger, Zipkin) ছাড়া কোথায় বাগ হয়েছে বোঝা যায় না।' })] })] }),
                ],
              }),
            ],
          }),

          // Section 3: Why NestJS Modular Monolith is the Gold Standard
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3. আপনার বর্তমান NestJS ব্যাকএন্ড কেন গোল্ড স্ট্যান্ডার্ড? (Why You Are in the Sweet Spot)',
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
                text: 'আপনার বর্তমান ব্যাকএন্ডটি এমনভাবে আর্কিটেক্ট করা হয়েছে যাতে মাইক্রোসার্ভিসের সমস্ত সুবিধা কোড লেভেলে বিদ্যমান:\n\n' +
                  '১. ডোমেইন আইসোলেশন (Clean Module Separation):\n' +
                  '   • AuthModule: প্রমাণীকরণ, রিফ্রেশ টোকেন, কুকি ও নিরাপত্তা পরিচালনা করে।\n' +
                  '   • FamilyModule: ফ্যামিলি ট্রি, মেম্বারস, রিয়েলটাইম চ্যাট ও মেমোরিজ হ্যান্ডেল করে।\n' +
                  '   • BillingModule: স্ট্রাইপ সাবস্ক্রিপশন, ইনভয়েস ও মেম্বারশিপ প্ল্যান সামলায়।\n' +
                  '   • RedisModule: ক্যাশিং এবং Socket.IO মাল্টি-ইনস্ট্যান্স স্কেলিং হ্যান্ডেল করে।\n\n' +
                  '২. মাল্টি-ফাইল প্রিজমা স্কিমা (Modular Schema Architecture):\n' +
                  '   • আপনি ইতিমধ্যে `prisma/schema/` ফোল্ডারে `base.prisma`, `family.prisma`, `chat.prisma`, `billing.prisma`, `vault.prisma` আলাদা আলাদা ফাইলে ভাগ করেছেন। এটি মাইক্রোসার্ভিসের মতোই সম্পূর্ণ মডিউলার ডাটাবেস ডিজাইন।\n\n' +
                  '৩. হরাইজন্টাল স্কেলেবিলিটি (Effortless Horizontal Scaling):\n' +
                  '   • যদি ভবিষ্যতে ট্রাফিক ১ কোটি ইউজারও ছাড়িয়ে যায়, আপনাকে কোড পরিবর্তন করতে হবে না। আপনি শুধু Nginx বা ক্লাউড লোড-ব্যালেন্সারের পেছনে আপনার এই NestJS অ্যাপের ৪টি বা ৮টি ইনস্ট্যান্স রান করাবেন। Redis ইতিমধ্যে যুক্ত থাকায় সমস্ত সকেট কানেকশন ও ক্যাশ মুহূর্তেই সিঙ্ক হবে!',
              }),
            ],
          }),

          // Section 4: When do people actually need Microservices?
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '4. মাইক্রোসার্ভিস আসলে কাদের প্রয়োজন? (The Real Truth Behind Microservices)',
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
                text: 'সফটওয়্যার ইঞ্জিনিয়ারিংয়ের কিংবদন্তি মার্টিন ফাওলার (Martin Fowler) এর মূল নীতি হলো:\n',
                bold: true,
              }),
              new TextRun({
                text: '"Don\'t even consider microservices unless you have a monolith that has become too large to maintain."\n\n',
                italics: true,
                color: '475569',
              }),
              new TextRun({
                text: 'মাইক্রোসার্ভিস টেকনিক্যাল স্কেলিংয়ের চেয়ে মূলত "অর্গানাইজেশনাল স্কেলিং" এর জন্য ব্যবহৃত হয়:\n' +
                  '• যখন একটি কোম্পানিতে ২০০ থেকে ৫০০ জন সফটওয়্যার ইঞ্জিনিয়ার থাকে এবং তারা একই গিট রিপোজিটরিতে কোড পুশ করতে গিয়ে কনফ্লিক্ট তৈরি করে।\n' +
                  '• তখন টিমগুলোকে আলাদা করতে একেক টিমের হাতে একেকটি সার্ভিস দেওয়া হয়।\n\n' +
                  'কিন্তু ১ জন ডেভেলপার বা একটি ছোট ইঞ্জিনিয়ারিং টিমের জন্য মাইক্রোসার্ভিস তৈরি করা মানে নিজের পায়ে নিজে কুড়াল মারা। আপনার সময় চলে যাবে সার্ভার মেনটেইনেন্সে, ফিচার ডেভেলপমেন্ট থেমে যাবে।',
              }),
            ],
          }),

          // Section 5: The Winning Strategy: Hybrid Worker Pattern
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '5. ভবিষ্যতের জন্য সঠিক কৌশল: হাইব্রিড ওয়ার্কার প্যাটার্ন (The Winning Strategy)',
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
                text: 'ভবিষ্যতে যদি কোনো একটি কাজ অনেক বেশি সিপিইউ ব্যবহার করে (যেমন: বড় ভিডিও কম্প্রেস করা বা এআই ফেস রিকগনিশন), তখন পুরো অ্যাপ্লিকেশনে মাইক্রোসার্ভিস আনতে হয় না।\n' +
                  'আমরা শুধু একটি ব্যাকগ্রাউন্ড ওয়ার্কার (BullMQ + Redis Worker) ব্যবহার করব। কোর অ্যাপ্লিকেশন সবসময় মনোলিথ থাকবে, আর ভারী কাজগুলো ব্যাকগ্রাউন্ড কিউ (Queue) দিয়ে আলাদা হয়ে যাবে।\n\n' +
                  'এটিই হলো বিশ্বের শীর্ষ টেক কোম্পানিগুলোর প্রমাণিত ও সর্বাধিক সফল স্থাপত্য কৌশল।',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('MICROSERVICES_VS_MODULAR_MONOLITH_ARCHITECTURAL_DECISION_GUIDE.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  // Companion .doc file
  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Microservices vs Modular Monolith Architectural Decision Guide</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      .box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 18px; margin: 15px 0; }
      .highlight { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 15px 0; }
    </style>
  </head>
  <body>
    <h1>🏗️ Architectural Decision: Do You Need Microservices for FamilyRoots?</h1>
    <p><em>Comprehensive Engineering Evaluation: Modular Monolith vs. Distributed Microservices, Cost Analysis, and Scaling Strategy</em></p>
    <hr/>

    <h2>১. সরাসরি উত্তর: আপনার কি মাইক্রোসার্ভিস দরকার?</h2>
    <div class="box">
      <strong style="color: #b91c1c; font-size: 18px;">চূড়ান্ত রায়: না, আপনার এখন মাইক্রোসার্ভিসের একেবারেই কোনো প্রয়োজন নেই!</strong>
      <p>এই মুহূর্তে মাইক্রোসার্ভিসে যাওয়া হবে একটি চরম Over-engineering এবং অপচয়। আপনার বর্তমান NestJS ব্যাকএন্ড একটি বিশ্বমানের <strong>Modular Monolith</strong> প্যাটার্নে সাজানো, যা মাইক্রোসার্ভিসের চেয়ে ১০ গুণ দ্রুত কাজ করে এবং ক্লাউড খরচ ৯০% কম রাখে।</p>
    </div>

    <h2>২. তুলনামূলক বিশ্লেষণ</h2>
    <table>
      <tr><th>বিষয়</th><th>আপনার বর্তমান NestJS Modular Monolith</th><th>মাইক্রোসার্ভিস</th></tr>
      <tr><td>ডেভেলপমেন্ট স্পিড</td><td>১০ গুণ দ্রুত। ফিচার সহজেই ডেপ্লয় করা যায়।</td><td>খুব ধীরগতি। সার্ভিস নেটওয়ার্কিং সামলাতেই সময় যায়।</td></tr>
      <tr><td>হোস্টিং খরচ</td><td>$১০ - $২৫ / মাস (একটি সিঙ্গেল ভিপিএস যথেষ্ট)</td><td>$২০০ - $৫০০+ / মাস (Kubernetes, Kafka ইত্যাদি লাগে)</td></tr>
      <tr><td>ডাটাবেস ট্রানজেকশন</td><td>Prisma $transaction দিয়ে নিখুঁত ও সহজ</td><td>Distributed Transactions (Saga pattern) অত্যন্ত জটিল</td></tr>
      <tr><td>পারফরম্যান্স</td><td>মেমরির ভেতর দ্রুত কল (Microsecond latency)</td><td>নেটওয়ার্ক হপ যুক্ত হয়ে লেটেন্সি বেড়ে যায়</td></tr>
    </table>

    <div class="highlight">
      <strong>বিগ টেক বাস্তব উদাহরণ:</strong> Amazon Prime Video তাদের মাইক্রোসার্ভিস বাদ দিয়ে আবার মনোলিথে ফিরে এসেছে এবং এর ফলে তাদের ক্লাউড খরচ <strong>৯০% কমে গেছে</strong>! Shopify প্রতি বছর $১০০ বিলিয়নের বেশি ট্রানজেকশন তাদের মনোলিথ দিয়েই সফলভাবে হ্যান্ডেল করে।
    </div>
  </body>
  </html>
  `;

  const docPath = path.resolve('MICROSERVICES_VS_MODULAR_MONOLITH_ARCHITECTURAL_DECISION_GUIDE.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);
}

generateMicroservicesGuide().catch(console.error);
