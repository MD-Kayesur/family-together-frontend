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

async function generateRedisDoc() {
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
                text: '🔴 Redis Caching Architecture & Implementation in FamilyRoots',
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
                text: 'প্রজেক্টে Redis ব্যবহারের উদ্দেশ্য, Fail-Open রেসিলিয়েন্ট আর্কিটেকচার, ioredis ইন্টিগ্রেশন এবং ফলব্যাক স্ট্র্যাটেজি ব্যাখ্যা',
                italics: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),

          // Highlight Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'EFF6FF', type: ShadingType.CLEAR, color: 'auto' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 2, color: 'BFDBFE' },
                      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'BFDBFE' },
                      left: { style: BorderStyle.SINGLE, size: 6, color: '2563EB' },
                      right: { style: BorderStyle.SINGLE, size: 2, color: 'BFDBFE' },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'REDIS STATUS IN PROJECT: ', bold: true, color: '1E3A8A' }),
                          new TextRun({
                            text: 'হ্যাঁ, ব্যাকএন্ডে Redis সার্ভিস সম্পূর্ণ তৈরি এবং কনফিগার করা হয়েছে (ioredis + NestJS Global Module)। এটি একটি আধুনিক "Fail-Open" প্যাটার্নে কাজ করে—যদি সার্ভারে Redis ইনস্টল থাকে তবে এটি ক্যাশ হিসেবে কাজ করে, আর Redis না থাকলে অ্যাপ কোনো এরর বা ক্র্যাশ ছাড়াই সরাসরি PostgreSQL থেকে ডেটা আনে।',
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

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 1
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '১. প্রজেক্টে Redis কেন এবং কীভাবে যুক্ত করা হয়েছে?',
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
                text: 'ফ্যামিলি ট্রি এবং রিলেশনশিপ ম্যাট্রিক্সের ডেটা সাধারণ টেবিলের চেয়ে অনেক জটিল (Directed Graph)। বারবার পুরো ফ্যামিলি ট্রি জেনারেট করলে ডেটাবেসের উপর অতিরিক্ত লোড পড়ে। এই সমস্যা সমাধানের জন্য NestJS ব্যাকএন্ডে ioredis লাইব্রেরি ব্যবহার করে একটি নিবেদিত RedisService তৈরি করা হয়েছে।',
              }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'লোকেশন: ', bold: true }),
              new TextRun({ text: 'src/redis/redis.service.ts এবং src/redis/redis.module.ts', font: 'Consolas' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'রেজিস্ট্রেশন: ', bold: true }),
              new TextRun({ text: 'src/app.module.ts-এ গ্লোবাল মডিউল হিসেবে ইমপোর্ট করা।' }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 2: Fail-Open Architecture
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '২. "Fail-Open" রেসিলিয়েন্ট আর্কিটেকচার (কেন অ্যাপ ক্র্যাশ করে না?)',
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
                text: 'অধিকাংশ ডেভেলপার Redis কানেক্ট করার সময় সাধারণ ক্লায়েন্ট ব্যবহার করে, যার ফলে যদি লোকাল কম্পিউটারে Redis ইনস্টল না থাকে বা সার্ভার ডাউন থাকে, পুরো NestJS ব্যাকএন্ড বুট হতেই ক্র্যাশ করে।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'FamilyRoots প্রজেক্টে এন্টারপ্রাইজ "Fail-Open" প্যাটার্ন ইমপ্লিমেন্ট করা হয়েছে:',
              }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'lazyConnect: true — ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'NestJS স্টার্টআপের সময় কানেকশন ব্লক করে না।' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'connectTimeout: 3000ms & maxRetriesPerRequest: 1 — ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: '৩ সেকেন্ডের মধ্যে রেসপন্স না পেলে স্টার্টআপ হ্যাং হওয়া বন্ধ করে।' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'গেস্টিং ফলব্যাক মেকানিজম — ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'যদি Redis সার্ভার না থাকে, get() মেথড সরাসরি null রিটার্ন করে এবং একটি ওয়ার্নিং লগ দেয়, যার ফলে সার্ভিসটি সরাসরি PostgreSQL ডেটাবেস থেকে ডেটা ফেচ করে কাজ চালিয়ে যায়।' }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 3: Available Methods
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৩. RedisService-এর গুরুত্বপূর্ণ মেথডসমূহ',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          // Methods Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'মেথড', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'প্যারামিটার', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'কাজ ও বৈশিষ্ট্য', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'get<T>(key)', font: 'Consolas', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'key: string' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Redis থেকে ক্যাশ ডেটা ফেচ করে অটোমেটিক JSON পার্স করে দেয়। কানেকশন না থাকলে null রিটার্ন করে।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'set(key, value, ttl)', font: 'Consolas', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'key, value, ttlSeconds?' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'JSON স্ট্রিং বানিয়ে ডেটা ক্যাশে সেভ করে। ঐচ্ছিক TTL দিয়ে অটোমেটিক এক্সপায়ারি নির্ধারণ করা যায়।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'del(key)', font: 'Consolas', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'key: string | string[]' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'নির্দিষ্ট ক্যাশ কি ডিলিট বা ইনভ্যালিডেট করে।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'delByPattern(pattern)', font: 'Consolas', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'pattern: string' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'নন-ব্লকিং scanStream ব্যবহার করে নির্দিষ্ট প্যাটার্নের (যেমন family:123:*) সব ক্যাশ একবারে মুছে ফেলে।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'isHealthy()', font: 'Consolas', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '—' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Redis কানেকশন এই মুহূর্তে অ্যাক্টিভ কিনা তা বুলিয়ান (true/false) দিয়ে জানায়।' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 4: Configuration
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৪. এনভায়রনমেন্ট ভেরিয়েবল কনফিগারেশন (.env)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `# লোকাল Redis বা ক্লাউড Redis (Upstash / AWS ElastiCache) কনফিগারেশন:
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_URL=""               # রিমোট ক্লাউড ইউআরএল (যেমন: rediss://default:pass@xxx.upstash.io:6379)
REDIS_ENABLED="true"       # ক্যাশিং চালু বা বন্ধ করার সুইচ (false দিলে নিষ্ক্রিয় থাকে)`,
                font: 'Consolas',
                size: 20,
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 5: Conclusion
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '৫. সারসংক্ষেপ',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'প্রজেক্টে Redis-এর সম্পূর্ণ আর্কিটেকচার অত্যন্ত সুপরিকল্পিতভাবে প্রস্তুত করা আছে। আপনি চাইলে লোকাল ডকার বা ক্লাউডে Redis চালিয়ে সরাসরি মিলিসেকেন্ড লেভেলে ফ্যামিলি ট্রি ক্যাশ করতে পারবেন, আর যদি Redis চালু নাও থাকে তাহলেও প্রজেক্টের কোনো ফিচার ব্যাহত হবে না।',
                bold: true,
                color: '1E3A8A',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const frontendDocPath = path.resolve('REDIS_CACHE_ARCHITECTURE_AND_IMPLEMENTATION_EXPLANATION.doc');
  const frontendDocxPath = path.resolve('REDIS_CACHE_ARCHITECTURE_AND_IMPLEMENTATION_EXPLANATION.docx');
  const backendDocPath = path.resolve('../family-together-backend/REDIS_CACHE_ARCHITECTURE_AND_IMPLEMENTATION_EXPLANATION.doc');
  const backendDocxPath = path.resolve('../family-together-backend/REDIS_CACHE_ARCHITECTURE_AND_IMPLEMENTATION_EXPLANATION.docx');

  fs.writeFileSync(frontendDocPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);
  console.log(`✅ Saved Frontend Docs: ${frontendDocPath}`);

  fs.writeFileSync(backendDocPath, buffer);
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`✅ Saved Backend Docs: ${backendDocPath}`);
}

generateRedisDoc().catch(console.error);
