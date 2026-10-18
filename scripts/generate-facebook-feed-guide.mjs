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

async function generateFacebookFeedGuide() {
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
                text: '📱 Facebook-Style Private Family Feed & Like System: Feasibility & Architecture Guide',
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
                text: 'Strategic & Architectural Analysis: Do You Need It? Can You Do It? And What Guidelines Should You Follow?',
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

          // Section 1: Direct Answers to User Questions
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '1. মূল তিনটি প্রশ্নের সরাসরি উত্তর (Direct Answers to Core Questions)',
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
                text: 'প্রশ্ন ১: আমার কি এই প্রসেস আনা দরকার? (Do I need it?)\n',
                bold: true,
                color: '1E3A8A',
                size: 24,
              }),
              new TextRun({
                text: '✅ হ্যাঁ, তবে হুবহু পাবলিক ফেসবুক নয়, বরং একটি "Private Family Heritage Wall / Social Feed" হিসেবে আনা অত্যন্ত লাভজনক!\n',
                bold: true,
              }),
              new TextRun({
                text: '• সাধারণ ফ্যামিলি ট্রি অ্যাপস (যেমন শুধু ডায়াগ্রাম) মানুষ বছরে ১-২ বারের বেশি খুলে দেখে না।\n' +
                  '• কিন্তু যদি সেখানে একটি প্রাইভেট ফ্যামিলি ফিড থাকে যেখানে আত্মীয়রা ছবি পোস্ট করতে পারে, পুরনো স্মৃতি শেয়ার করতে পারে এবং বাকিরা লাভ রিয়্যাক্ট (❤️) ও কমেন্ট দিতে পারে—তাহলে মানুষ প্রতি সপ্তাহে অ্যাপটি ব্যবহার করবে। এতে ইউজার এনগেজমেন্ট ও রিটেনশন ১০ গুণ বেড়ে যাবে।\n\n',
              }),
              new TextRun({
                text: 'প্রশ্ন ২: আমি কি এটা করতে পারব? (Can I do it?)\n',
                bold: true,
                color: '1E3A8A',
                size: 24,
              }),
              new TextRun({
                text: '✅ ১০০% পারবেন! এবং আপনার প্রোজেক্টের ৭০% কাজ ইতিমধ্যে তৈরি করাই আছে!\n',
                bold: true,
              }),
              new TextRun({
                text: '• আপনার ইতিমধ্যে Memory মডেল, মাল্টি-ইমেজ আপলোড, PostgreSQL ডেটাবেস এবং familyId আইসোলেশন রয়েছে।\n' +
                  '• আপনার ইতিমধ্যে Socket.IO লাইভ পোর্ট ৮০০০-এ রানিং আছে, যা দিয়ে ইনস্ট্যান্ট লাইভ লাইক কাউন্টার ও রিয়েলটাইম কমেন্ট দেখানো খুব সহজ।\n\n',
              }),
              new TextRun({
                text: 'প্রশ্ন ৩: আমাকে কি কোনো নিয়ম বা আর্কিটেকচার ফলো করতে হবে? (Do I follow anything?)\n',
                bold: true,
                color: '1E3A8A',
                size: 24,
              }),
              new TextRun({
                text: '✅ হ্যাঁ! ফেসবুকের মতো পোস্ট-লাইক ফিচার বানাতে হলে ৪টি সুনির্দিষ্ট প্রফেশনাল আর্কিটেকচারাল নিয়ম অবশ্যই মানতে হবে (নিচে বিস্তারিত আলোচনা করা হলো)।',
              }),
            ],
          }),

          // Section 2: Facebook vs Private Family Feed
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. পাবলিক ফেসবুক বনাম প্রাইভেট ফ্যামিলি ফিড (Strategic Comparison)',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'বৈশিষ্ট্য (Feature)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'সাধারণ ফেসবুক (Public Facebook)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'আমাদের ফ্যামিলি ফিড (FamilyRoots Wall)', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'প্রাইভেসি ও অডিয়েন্স', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'পাবলিক বা অপরিচিত মানুষ দেখতে পারে। প্রাইভেসি রিস্ক অনেক বেশি।' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '১০০% প্রাইভেট। শুধুমাত্র ওই নির্দিষ্ট ফ্যামিলির ভেরিফায়েড সদস্যরা দেখতে পারবে।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'কনটেন্টের ধরন', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'বিজ্ঞাপন, মিম, ভাইরাল নিউজ, পলিটিক্স।' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'পারিবারিক অর্জন, শিশুর জন্মদিন, বিয়ের স্মৃতি, পুরনো আর্কাইভ ছবি, ফ্যামিলি মিটআপ।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'রিয়্যাকশন স্টাইল', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Like, Haha, Sad, Angry (ট্রোলিং বা নেতিবাচক ভাব থাকে)।' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Family Warmth: ❤️ Love, 🙏 Blessings, 🎉 Celebrate, 👴 Legacy/Memory।' })] })] }),
                ],
              }),
            ],
          }),

          // Section 3: Technical Blueprint to Follow
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3. আপনার যা যা ফলো করতে হবে (The 4 Rules You Must Follow)',
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
                text: 'নিয়ম ১: কঠোর ফ্যামিলি আইসোলেশন (Strict Family Scoping)\n',
                bold: true,
              }),
              new TextRun({
                text: 'প্রতিটি পোস্ট, লাইক এবং কমেন্ট অবশ্যই `familyId` এর সাথে সম্পর্কিত হতে হবে। এক ফ্যামিলির কোনো মেম্বার অন্য ফ্যামিলির পোস্টে লাইক বা কমেন্ট করা তো দূরের কথা, দেখতেও পারবে না।\n\n',
              }),
              new TextRun({
                text: 'নিয়ম ২: অপটিমিস্টিক ইউআই (Optimistic UI for Snappy Feedback)\n',
                bold: true,
              }),
              new TextRun({
                text: 'ফেসবুকের সবচেয়ে বড় শক্তি হলো স্পিড। কেউ হার্ট আইকনে ক্লিক করলে সাথে সাথে হার্টটি লাল/পিংক হবে এবং লাইক কাউন্ট ১ বাড়বে (অপেক্ষা না করে)। ব্যাকএন্ডে রিকোয়েস্ট ফেইল করলে পূর্বের অবস্থায় ফিরে যাবে।\n\n',
              }),
              new TextRun({
                text: 'নিয়ম ৩: ইউনিক লাইক সীমাবদ্ধতা (1 Like Per User Per Post)\n',
                bold: true,
              }),
              new TextRun({
                text: 'ডেটাবেসে `@@unique([memoryId, userId])` কনস্ট্রেইন্ট থাকতে হবে, যাতে একজন ইউজার একটাই লাইক দিতে পারে। পুনরায় ক্লিক করলে লাইক রিমুভ (Toggle Like) হবে।\n\n',
              }),
              new TextRun({
                text: 'নিয়ম ৪: রিয়েল-টাইম সকেট সিনক্রোনাইজেশন (Socket.IO Broadcast)\n',
                bold: true,
              }),
              new TextRun({
                text: 'পরিবারের অন্য কোনো ভাই বা বোন যখন নিউ ইয়র্ক বা লন্ডনে বসে লাইক দিবে, ঢাকায় থাকা পরিবারের সবার স্ক্রিনে পেজ রিফ্রেশ ছাড়াই লাইক সংখ্যা সাথে সাথে বেড়ে যাবে।',
              }),
            ],
          }),

          // Section 4: Implementation Blueprint
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '4. ডেটাবেস স্কিমা ও ইমপ্লিমেন্টেশন ব্লুপ্রিন্ট (Database Schema & API Design)',
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
                text: 'আমাদের `prisma/schema/vault.prisma` ফাইলে নিম্নোক্ত দুটি মডেল যুক্ত করলেই সম্পূর্ণ সিস্টেম কার্যকর হবে:\n\n',
              }),
              new TextRun({
                text: 'model MemoryLike {\n' +
                  '  id        String   @id @default(uuid())\n' +
                  '  memoryId  String   @map("memory_id")\n' +
                  '  userId    String   @map("user_id")\n' +
                  '  type      String   @default("HEART") // HEART, CELEBRATE, BLESSING\n' +
                  '  createdAt DateTime @default(now()) @map("created_at")\n' +
                  '  memory    Memory   @relation(fields: [memoryId], references: [id], onDelete: Cascade)\n' +
                  '  @@unique([memoryId, userId])\n' +
                  '  @@map("memory_likes")\n' +
                  '}\n\n' +
                  'model MemoryComment {\n' +
                  '  id        String   @id @default(uuid())\n' +
                  '  memoryId  String   @map("memory_id")\n' +
                  '  userId    String   @map("user_id")\n' +
                  '  userName  String   @map("user_name")\n' +
                  '  avatarUrl String?  @map("avatar_url")\n' +
                  '  content   String   @db.Text\n' +
                  '  createdAt DateTime @default(now()) @map("created_at")\n' +
                  '  memory    Memory   @relation(fields: [memoryId], references: [id], onDelete: Cascade)\n' +
                  '  @@map("memory_comments")\n' +
                  '}\n',
                font: 'Consolas',
                size: 19,
              }),
            ],
          }),

          // Section 5: Resume & Full-Stack Showcase Value
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '5. রেজিউমে ও ক্যারিয়ারে এর প্রভাব (Resume Impact for Full Stack Engineer)',
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
                text: 'আপনি যদি ইন্টারভিউয়ারকে বলতে পারেন:\n' +
                  '• "I built a Private Family Social Feed with optimistic UI updates, WebSocket live like-counters, nested comments, and strict tenant privacy isolation."\n' +
                  'তাহলে সাধারণ CRUD অ্যাপের তুলনায় এই প্রোজেক্টকে টেকনিক্যালি অনেক বেশি পরিণত, স্কেলেবল এবং প্রফেশনাল মনে হবে। এটি আপনার ফুল-স্ট্যাক ইঞ্জিনিয়ারিং দক্ষতা বহুগুণে বাড়িয়ে তুলবে!',
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('FACEBOOK_LIKE_FAMILY_FEED_FEASIBILITY_AND_ARCHITECTURE_GUIDE.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  // Companion .doc file
  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Facebook-Style Private Family Feed Feasibility & Architecture Guide</title>
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
    <h1>📱 Facebook-Style Private Family Feed & Like System: Feasibility & Architecture Guide</h1>
    <p><em>Strategic & Architectural Analysis: Do You Need It? Can You Do It? And What Guidelines Should You Follow?</em></p>
    <hr/>

    <h2>১. আপনার ৩টি প্রশ্নের সরাসরি উত্তর</h2>
    <div class="box">
      <p><strong>১. আমার কি এটা করা দরকার? (Do I need it?)</strong><br/>
      <strong>উত্তর:</strong> হ্যাঁ! তবে সাধারণ পাবলিক ফেসবুক নয়, বরং একটি <strong>"Private Family Wall / Heritage Feed"</strong> হিসেবে আনা অত্যন্ত কার্যকর। সাধারণ ফ্যামিলি ট্রিতে ইউজার বছরে ১-২ বার আসে, কিন্তু ফিড ও লাইক থাকলে মানুষ প্রতি সপ্তাহে ছবি ও স্মৃতি শেয়ার করতে বারবার ফিরে আসবে (১০ গুণ ইউজার এনগেজমেন্ট)।</p>

      <p><strong>২. আমি কি করতে পারি? (Can I do it?)</strong><br/>
      <strong>উত্তর:</strong> <span class="badge">১০০% সম্ভব!</span> আপনার ইতিমধ্যে Memory টেবিল, মাল্টি-ইমেজ আপলোড, PostgreSQL ডেটাবেস এবং Socket.IO লাইভ পোর্ট ৮০০০-এ তৈরি আছে। ফলে এটি খুব দ্রুত এবং ক্লিনভাবে বাস্তবায়ন করা সম্ভব।</p>

      <p><strong>৩. আমি কি কিছু ফলো করব? (Do I follow anything?)</strong><br/>
      <strong>উত্তর:</strong> হ্যাঁ, ৪টি গুরুত্বপূর্ণ আর্কিটেকচারাল নিয়ম মানতে হবে:
      <ul>
        <li><strong>Strict Family Scoping:</strong> কোনো পোস্ট বা লাইক যেন অন্য ফ্যামিলির কেউ দেখতে না পারে (কঠোর familyId চেক)।</li>
        <li><strong>Optimistic UI:</strong> লাইক বাটনে চাপার সাথে সাথে ইনস্ট্যান্ট হার্ট অ্যানিমেশন ও সংখ্যা পরিবর্তন (জিরো ল্যাগ)।</li>
        <li><strong>Unique Like Constraint:</strong> ১ জন ইউজার প্রতি পোস্টে ১টি লাইক দিতে পারবে (টগল ফাংশনালিটি)।</li>
        <li><strong>Socket.IO Broadcast:</strong> কেউ লাইক বা কমেন্ট করলে অন্য সদস্যদের পেজ রিফ্রেশ ছাড়াই সাথে সাথে আপডেট হওয়া।</li>
      </ul>
      </p>
    </div>

    <h2>২. পাবলিক ফেসবুক বনাম আমাদের প্রাইভেট ফ্যামিলি ফিড</h2>
    <table>
      <tr><th>ফিচার</th><th>পাবলিক ফেসবুক</th><th>আমাদের FamilyRoots ফ্যামিলি ফিড</th></tr>
      <tr><td>অডিয়েন্স</td><td>পাবলিক, অপরিচিত মানুষ</td><td>১০০% ভেরিফায়েড পরিবারের সদস্য</td></tr>
      <tr><td>কনটেন্ট</td><td>বিজ্ঞাপন, মিম, নিউজ</td><td>শিশুর জন্মদিন, বিয়ের স্মৃতি, পুরনো পারিবারিক ঐতিহ্য</td></tr>
      <tr><td>রিয়্যাকশন</td><td>Like, Haha, Sad, Angry</td><td>Family Warmth: ❤️ Love, 🙏 Blessings, 🎉 Celebrate</td></tr>
    </table>

    <h2>৩. প্রয়োজনীয় ডেটাবেস মডেল (Prisma Schema)</h2>
    <pre><code>model MemoryLike {
  id        String   @id @default(uuid())
  memoryId  String   @map("memory_id")
  userId    String   @map("user_id")
  type      String   @default("HEART")
  createdAt DateTime @default(now()) @map("created_at")

  memory    Memory   @relation(fields: [memoryId], references: [id], onDelete: Cascade)
  @@unique([memoryId, userId])
  @@map("memory_likes")
}

model MemoryComment {
  id        String   @id @default(uuid())
  memoryId  String   @map("memory_id")
  userId    String   @map("user_id")
  userName  String   @map("user_name")
  avatarUrl String?  @map("avatar_url")
  content   String   @db.Text
  createdAt DateTime @default(now()) @map("created_at")

  memory    Memory   @relation(fields: [memoryId], references: [id], onDelete: Cascade)
  @@map("memory_comments")
}</code></pre>
  </body>
  </html>
  `;

  const docPath = path.resolve('FACEBOOK_LIKE_FAMILY_FEED_FEASIBILITY_AND_ARCHITECTURE_GUIDE.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);
}

generateFacebookFeedGuide().catch(console.error);
