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

async function generateConversationDoc() {
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
                text: '💬 Realtime Family Conversation System & Role Permissions Guide',
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
                text: 'Full Technical & Business Logic Explanation: Who Can Chat with Whom, Facebook Messenger-Style Relatives Verification, Socket.IO Realtime Flow, and Database Architecture',
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

          // Section 1: Introduction in Bangla & English
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '1. কে কার সাথে Conversation (Chat) করতে পারবে? (Who Can Message Whom?)',
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
                text: 'আমাদের FamilyRoots সিস্টেমে মেসেজিং ফেসবুক মেসেঞ্জারের মতো স্মার্ট ফ্যামিলি কানেকশন লজিক এবং রোল-বেসড সিকিউরিটির মাধ্যমে পরিচালিত হয়। চ্যাট সার্ভিসে (chat.service.ts -> canInitiateMessage) ৪টি প্রধান নিয়ম প্রযোজ্য:',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'নিয়ম (Rule)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'প্রযোজ্য ইউজার ও রোল', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'মেসেজিং পারমিশন লজিক ও কারণ', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rule 1: Owner Protection', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'MEMBER -> OWNER' })] })] }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'সাধারণ MEMBER সরাসরি OWNER-কে নতুন 1-on-1 ডিরেক্ট মেসেজ পাঠাতে পারবে না (Restricted)। উদ্দেশ্য: স্যান্কচুয়ারি ওনার হলেন ফ্যামিলি অ্যাডমিনিস্ট্রেটর; ওনারকে যেন সবাই অপ্রয়োজনীয় মেসেজে স্প্যাম না করে। তবে গ্রুপ চ্যানেল (Sanctuary Circle)-এ সবাই ওনারের সাথে আলোচনা করতে পারবে।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rule 2: Owner Authority', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'OWNER / SUPER_ADMIN -> ANY MEMBER' })] })] }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'OWNER বা SUPER_ADMIN পরিবারের যেকোনো সদস্যকে সরাসরি মেসেজ পাঠাতে পারেন। ওনার একবার মেসেজ পাঠালে থ্রেড তৈরি হয়ে যায় এবং মেম্বারও তখন রিপ্লাই দিতে পারে।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rule 3: Creator Tracking', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Who Added Whom (createdById)' })] })] }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'যদি ইউজার A ইউজার B-কে ইনভাইট/অ্যাড করে থাকে অথবা ইউজার B ইউজার A-কে ফ্যামিলিতে যুক্ত করে থাকে (sender.createdById === recipient.id || recipient.createdById === sender.id), তারা স্বাভাবিকভাবেই কানেক্টেড এবং যেকোনো সময় সরাসরি চ্যাট করতে পারবে।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rule 4: Family Tree Link', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Active Relatives in Tree' })] })] }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'ফেসবুক ফ্রেন্ডশিপের মতো: যদি দুজন মেম্বারের মধ্যে ফ্যামিলি ট্রিতে ACTIVE রিলেশনশিপ (পিতামাতা-সন্তান, স্বামী-স্ত্রী, ভাই-বোন ইত্যাদি) থাকে, তারা ভেরিফায়েড আত্মীয় হিসেবে একে অপরকে সরাসরি মেসেজ করতে পারবে।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rule 5: Family Isolation', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Strict Family Scoping' })] })] }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'এক পরিবারের মেম্বার কখনোই অন্য পরিবারের মেম্বারকে মেসেজ পাঠাতে বা দেখতে পারবে না। সব কনভারসেশন familyId দ্বারা কঠোরভাবে আইসোলেটেড।',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Section 2: How Conversation Works
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. Conversation কীভাবে হচ্ছে? (Realtime Socket.IO & Database Flow)',
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
                text: 'কনভারসেশন সিস্টেমটি ৩টি স্তরে কাজ করে:\n',
                bold: true,
              }),
              new TextRun({
                text: '১. ডেটাবেস স্তর (PostgreSQL & Prisma Schema):\n' +
                  '   • Conversation টেবিল: কনভারসেশন আইডি, ফ্যামিলি আইডি, টাইপ (DIRECT/GROUP), শেষ মেসেজ ও টাইমস্ট্যাম্প ধারণ করে।\n' +
                  '   • ConversationParticipant টেবিল: কনভারসেশনে কারা অংশ নিচ্ছে এবং কার কয়টি আনরিড (unread) মেসেজ আছে তা ট্র্যাক করে।\n' +
                  '   • ChatMessage টেবিল: প্রতিটি পাঠানো টেক্সট, ছবি বা ফাইল, প্রেরকের আইডি এবং মেসেজের স্ট্যাটাস (SENT, DELIVERED, READ) সংরক্ষণ করে।\n\n' +
                  '২. রিয়েল-টাইম সকেট সংযোগ (Socket.IO Gateway - chat.gateway.ts):\n' +
                  '   • ক্লায়েন্ট যখন ড্যাশবোর্ডে লগইন করে, ফ্রন্টএন্ড Socket.IO ক্লায়েন্ট স্বয়ংক্রিয়ভাবে ব্যাকএন্ডে (পোর্ট ৮০০০) কানেক্ট হয়।\n' +
                  '   • ব্যবহারকারী তার নিজস্ব রুম `user_${userId}` এবং ফ্যামিলি রুম `family_${familyId}`-এ জয়েন করে।\n' +
                  '   • যখন কোনো চ্যাট ওপেন করা হয়, ফ্রন্টএন্ড থেকে `join_conversation` ইভেন্ট পাঠিয়ে `conv_${conversationId}` রুমে প্রবেশ করে।\n\n' +
                  '৩. লাইভ মেসেজিং ও টাইপিং নোটিফিকেশন:\n' +
                  '   • সেন্ডার মেসেজ লিখে সেন্ড বাটন চাপলে ক্লায়েন্ট `send_message` ইভেন্ট পাঠায়।\n' +
                  '   • ব্যাকএন্ড তাৎক্ষণিকভাবে মেসেজটি ডেটাবেসে সেভ করে এবং ওই কনভারসেশন রুমে যুক্ত থাকা সবার ব্রাউজারে `new_message` ইভেন্ট ব্রডকাস্ট করে (০.১ সেকেন্ডের মধ্যে লাইভ দেখতে পায়)।\n' +
                  '   • রিসিভার যদি তখন অন্য পেইজেও থাকে, তার পার্সোনাল রুমে নোটিফিকেশন পৌঁছায় এবং অপঠিত কাউন্টার (unreadCount badge) বেড়ে যায়।\n' +
                  '   • কিবোর্ডে টাইপ করার সাথে সাথে `typing` ইভেন্ট যায় এবং বিপরীত প্রান্তে "... is typing" এনিমেশন দেখায়।\n' +
                  '   • মেসেজ পড়া হলে `mark_read` ইভেন্টের মাধ্যমে ব্লু টিক (read receipt) আপডেট হয়।',
              }),
            ],
          }),

          // Section 3: Summary Table of Channels
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3. ফ্যামিলিতে কনভারসেশনের প্রকারভেদ (Conversation Types)',
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
                    shading: { type: ShadingType.CLEAR, fill: '047857' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'টাইপ (Type)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '047857' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'চ্যানেলের নাম / উদাহরণ', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '047857' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'কারা অংশগ্রহণ করতে পারে?', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'GROUP CHANNEL', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sanctuary Circle (সার্বজনীন ফ্যামিলি চ্যাট)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'পরিবারের ওনার এবং সমস্ত মেম্বাররা একসাথে ফ্যামিলি নিউজ, অ্যানাউন্সমেন্ট ও স্মৃতি শেয়ার করতে পারে।' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'DIRECT (1-on-1)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ব্যক্তিগত আত্মীয় চ্যাট (যেমন: ভাই-বোন, পিতা-পুত্র)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ফ্যামিলি ট্রিতে যুক্ত সক্রিয় আত্মীয় বা অ্যাডকারী মেম্বারদের মধ্যে ১-অন-১ সম্পূর্ণ এন্ড-টু-এন্ড সিকিউর চ্যাট।' })] })] }),
                ],
              }),
            ],
          }),

          // Section 4: Code File References
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '4. কোড ফাইল রেফারেন্স (Direct Source Code References)',
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
                text: '১. ব্যাকএন্ড পারমিশন ও লজিক: src/family/chat/chat.service.ts (canInitiateMessage & getOrCreateDirectConversation)\n' +
                  '২. ব্যাকএন্ড রিয়েল-টাইম ওয়েবসকেট: src/family/chat/chat.gateway.ts (join_conversation, send_message, typing, mark_read)\n' +
                  '৩. ব্যাকএন্ড কন্ট্রোলার ও এন্ডপয়েন্ট: src/family/chat/chat.controller.ts (/family/chat/conversations, /family/chat/messages)\n' +
                  '৪. ফ্রন্টএন্ড মেসেজিং ইন্টারফেস: src/components/dashboard/tabs/MessagesTab.tsx (লাইভ চ্যাট উইন্ডো, ড্রপডাউন, রিঅ্যাকশন, অনলাইন স্ট্যাটাস)\n' +
                  '৫. ফ্রন্টএন্ড RTK Query API: src/redux/api/chatApi.ts',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('CONVERSATION_FLOW_ROLES_PERMISSIONS_AND_REALTIME_ARCHITECTURE.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  // Companion .doc file
  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Realtime Family Conversation System & Role Permissions Guide</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      ul { padding-left: 20px; }
      li { margin-bottom: 8px; }
      .highlight { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 15px 0; }
    </style>
  </head>
  <body>
    <h1>💬 Realtime Family Conversation System & Role Permissions Guide</h1>
    <p><em>Full Technical & Business Logic Explanation: Who Can Chat with Whom, Facebook Messenger-Style Relatives Verification, Socket.IO Realtime Flow, and Database Architecture</em></p>
    <hr/>

    <h2>১. কে কার সাথে Conversation (Chat) করতে পারবে?</h2>
    <div class="highlight">
      <strong>মূল নিয়মাবলি (canInitiateMessage লজিক):</strong>
      <ol>
        <li><strong>সরাসরি Owner-কে মেসেজ রেস্ট্রিক্টেড:</strong> সাধারণ Member সরাসরি Sanctuary Owner-কে ১-অন-১ নতুন মেসেজ পাঠাতে পারে না, যাতে ওনার স্প্যামিং থেকে মুক্ত থাকেন। মেম্বাররা ওনারের সাথে <strong>Sanctuary Circle</strong> গ্রুপ চ্যানেলে কথা বলতে পারে।</li>
        <li><strong>Owner / SuperAdmin-এর পূর্ণ অধিকার:</strong> Owner বা SuperAdmin পরিবারের যেকোনো মেম্বারকে সরাসরি মেসেজ পাঠাতে পারেন। ওনার একবার মেসেজ শুরু করলে তখন মেম্বারও পাল্টা মেসেজ পাঠাতে পারে।</li>
        <li><strong>Who Added Whom (অ্যাডকারী কানেকশন):</strong> যদি ইউজার A ইউজার B-কে ফ্যামিলিতে যুক্ত করে থাকে (বা B A-কে), তারা সরাসরি মেসেজ করতে পারবে।</li>
        <li><strong>ফ্যামিলি ট্রিতে অ্যাক্টিভ রিলেশনশিপ (Active Relatives):</strong> ফেসবুকের ফ্রেন্ডশিপ লজিকের মতো—যদি দুজন মেম্বারের মধ্যে ফ্যামিলি ট্রিতে কোনো সক্রিয় রিলেশনশিপ (পিতামাতা-সন্তান, ভাই-বোন, স্পাউস) থাকে, তবে তারা সরাসরি চ্যাট করতে পারবে।</li>
        <li><strong>ফ্যামিলি আইসোলেশন:</strong> অন্য কোনো পরিবারের মেম্বারের সাথে কোনো চ্যাট সম্ভব নয় (কঠোরভাবে familyId দ্বারা সুরক্ষিত)।</li>
      </ol>
    </div>

    <h2>২. Conversation কীভাবে হচ্ছে? (How it works under the hood)</h2>
    <ul>
      <li><strong>PostgreSQL Database Schema:</strong> <code>Conversation</code> (চ্যাট থ্রেড), <code>ConversationParticipant</code> (অংশগ্রহণকারী ও আনরিড কাউন্ট), এবং <code>ChatMessage</code> (টেক্সট, ছবি, টাইমস্ট্যাম্প ও রিড স্ট্যাটাস)।</li>
      <li><strong>Socket.IO Realtime Gateway:</strong> ব্রাউজার কানেক্ট হওয়ার সাথে সাথে ইউজার <code>user_{id}</code> এবং <code>family_{id}</code> রুমে যুক্ত হয়। চ্যাট ওপেন করলে <code>conv_{conversationId}</code> রুমে জয়েন করে।</li>
      <li><strong>মেসেজ ট্রান্সফার ফ্লো:</strong> সেন্ডার মেসেজ লিখলে ব্যাকএন্ড ডেটাবেসে সেভ করে এবং সাথে সাথে <code>new_message</code> ইভেন্ট দিয়ে ব্রডকাস্ট করে। ০.১ সেকেন্ডে রিসিভারের স্ক্রিনে মেসেজ চলে আসে।</li>
      <li><strong>টাইপিং ও রিড রিসিপ্ট:</strong> কিবোর্ডে চাপলে <code>user_typing</code> ইভেন্ট গিয়ে "... is typing" দেখায় এবং চ্যাট দেখলে <code>mark_read</code> ইভেন্ট গিয়ে আনরিড কাউন্টার ০ করে দেয়।</li>
    </ul>

    <h2>৩. কোড ফাইল রেফারেন্স</h2>
    <table>
      <tr><th>ফাইল</th><th>দায়িত্ব</th></tr>
      <tr><td><code>src/family/chat/chat.service.ts</code></td><td>কানেকশন অনুমোদন লজিক (canInitiateMessage), থ্রেড তৈরি ও মেসেজ সেভ।</td></tr>
      <tr><td><code>src/family/chat/chat.gateway.ts</code></td><td>রিয়েলটাইম Socket.IO রুম ও লাইভ ইভেন্ট হ্যান্ডলার।</td></tr>
      <tr><td><code>src/components/dashboard/tabs/MessagesTab.tsx</code></td><td>ফ্রন্টএন্ড লাইভ চ্যাট ইউজার ইন্টারফেস।</td></tr>
    </table>
  </body>
  </html>
  `;

  const docPath = path.resolve('CONVERSATION_FLOW_ROLES_PERMISSIONS_AND_REALTIME_ARCHITECTURE.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);
}

generateConversationDoc().catch(console.error);
