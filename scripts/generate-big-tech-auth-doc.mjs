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

async function generateDoc() {
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
                text: '🏆 Big Tech & Industry Authentication Standards: Native OAuth 2.0 vs Firebase Analysis',
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
                text: 'In-Depth Architectural Analysis: What Enterprise Platforms (Spotify, Airbnb, Uber, Netflix, Canva, Discord) Use and Why Direct OAuth 2.0 is the Gold Standard over Firebase',
                italics: true,
                size: 21,
                color: '64748B',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '1. What Do Big-Level Platforms (Spotify, Airbnb, Netflix, Uber) Use?',
                bold: true,
                size: 26,
                color: '0F172A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'All large-scale, enterprise digital platforms use Direct OAuth 2.0 / OpenID Connect (OIDC) (Option A). None of them use Firebase for authentication.',
                bold: true,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Enterprise Platform', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Social Login Strategy', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Backend Token Engine', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Spotify' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Direct OAuth 2.0 (Google, Facebook, Apple)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Custom Microservice JWT & Secure Cookies' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Airbnb' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Direct OAuth 2.0 (Google, Apple, Facebook)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Custom Internal Identity Provider (IdP)' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Uber' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Direct OAuth 2.0 & OIDC' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Custom OAuth2 Authorization Server' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'GitHub / Canva / Discord' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Direct OAuth 2.0 Protocols' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Custom Session & Database Handlers' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '2. Why Big Companies Do NOT Use Firebase',
                bold: true,
                size: 26,
                color: '0F172A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: '• Vendor Lock-In: Firebase is a proprietary Google Cloud product. If you build your authentication on Firebase, migrating away or changing databases later is extremely difficult and costly.\n' +
                      '• Database Disconnect: Firebase stores users inside Google\'s internal cloud servers. In an enterprise relational app like FamilyRoots (with family trees, members, permissions, and roles), having user auth in Firebase and user relationships in PostgreSQL/Prisma creates a synchronization headache and double latency.\n' +
                      '• Inflexible Session Control: Firebase forces its own token format and client SDK lifecycle. With Native OAuth 2.0, your NestJS backend issues industry-standard HTTP-only cookies, custom JWT payloads, and strict role guards.\n' +
                      '• Who Firebase is for: Firebase is primarily designed for mobile indie apps (Flutter/React Native) or rapid hackathons and MVPs, not custom full-stack enterprise systems.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '3. Why Direct OAuth 2.0 (Option A) is the Definitive Choice for FamilyRoots',
                bold: true,
                size: 26,
                color: '0F172A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '1. 100% Free & Direct: Google and Facebook provide OAuth 2.0 directly to developers for free without any middleman fees.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '2. Complete Database Synergy: When a user signs in with Google or Facebook, NestJS immediately matches or creates the User record in your existing Neon PostgreSQL database via Prisma, maintaining full family tree relational integrity.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '3. Secure HTTP-Only Cookies: Uses your existing JWT authentication mechanism, avoiding XSS token theft vulnerabilities.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '4. Standard Industry Practice: This is the exact pattern used by the top tech companies in the world.',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('BIG_TECH_AUTHENTICATION_STANDARDS_OAUTH_VS_FIREBASE.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  const backendDocxPath = path.resolve('../family-together-backend/BIG_TECH_AUTHENTICATION_STANDARDS_OAUTH_VS_FIREBASE.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`Created Backend DOCX: ${backendDocxPath}`);

  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Big Tech & Industry Authentication Standards: Native OAuth 2.0 vs Firebase Analysis</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      .box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 15px 0; }
      .badge-rec { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; background-color: #dcfce7; color: #166534; }
    </style>
  </head>
  <body>
    <h1>🏆 Big Tech & Industry Authentication Standards: Native OAuth 2.0 vs Firebase Analysis</h1>
    <p><em>In-Depth Architectural Analysis: What Enterprise Platforms (Spotify, Airbnb, Uber, Netflix, Canva, Discord) Use and Why Direct OAuth 2.0 is the Gold Standard over Firebase</em></p>
    <hr/>

    <h2>১. ফেসবুক, নেটফ্লিক্স, স্পটিফাই বা বড় বড় প্ল্যাটফর্মগুলো কী ব্যবহার করে?</h2>
    <div class="box">
      <strong>উত্তর:</strong> বিশ্বের সমস্ত বড় বড় কোম্পানি ও এন্টারপ্রাইজ প্ল্যাটফর্ম (যেমন: Spotify, Airbnb, Uber, Netflix, Canva, Discord, GitHub) <strong>সরাসরি Direct OAuth 2.0 / OpenID Connect (পদ্ধতি ১ / Option A)</strong> ব্যবহার করে।<br/><br/>
      <strong>তারা কেউই ফায়ারবেস (Firebase) ব্যবহার করে না!</strong>
    </div>

    <h2>২. বড় কোম্পানিগুলো কেন ফায়ারবেস (Firebase) ব্যবহার করে না?</h2>
    <ul>
      <li><strong>ভেন্ডর লক-ইন (Vendor Lock-in):</strong> ফায়ারবেস গুগল ক্লাউডের একটি পণ্য। একবার ফায়ারবেসে পুরো ইউজার সিস্টেম বসালে পরবর্তীতে কখনো অন্য ক্লাউড বা সিস্টেমে মাইগ্রেট করা অত্যন্ত জটিল ও ব্যয়বহুল হয়ে যায়।</li>
      <li><strong>ডেটাবেসের স্বাধীনতা নষ্ট হওয়া:</strong> ফায়ারবেস ইউজারদের গুগলের সার্ভারে রাখে। আমাদের FamilyRoots-এ ইউজার, ফ্যামিলি ট্রি, মেম্বারদের সম্পর্ক, রোল—সবকিছু PostgreSQL ডেটাবেসে Prisma দিয়ে ম্যানেজ করা হচ্ছে। ফায়ারবেস ব্যবহার করলে ইউজার থাকবে গুগলে আর বাকি তথ্য থাকবে আপনার ডেটাবেসে, যা পারফরম্যান্স কমিয়ে দেয় এবং জটিলতা তৈরি করে।</li>
      <li><strong>টোকেন ও কুকি কন্ট্রোল:</strong> বড় কোম্পানিগুলো সবসময় তাদের নিজস্ব কাস্টম এনক্রিপ্টেড HTTP-only কুকি এবং JWT টোকেন জেনারেট করে যাতে তাদের সম্পূর্ণ নিয়ন্ত্রণ বজায় থাকে।</li>
      <li><strong>ফায়ারবেস কাদের জন্য?</strong> ফায়ারবেস সাধারণত মোবাইল অ্যাপ (Android/iOS) ডেভেলপারদের ছোটখাটো প্রজেক্ট, হ্যাকাথন বা দ্রুত MVP বানানোর জন্য ভালো।</li>
    </ul>

    <h2>৩. FamilyRoots-এর জন্য কোনটি সেরা?</h2>
    <p><strong>Option A (Native OAuth 2.0 via Passport.js)</strong> হলো ১০০% ইন্ডাস্ট্রি স্ট্যান্ডার্ড। এতে আপনার বিদ্যমান PostgreSQL ডেটাবেস, Prisma ORM এবং JWT কুকি সিস্টেমের সাথে গুগল ও ফেসবুক সরাসরি ইন্টিগ্রেট হবে—ঠিক যেমনটা স্পটিফাই বা এয়ারবিএনবি করে থাকে।</p>
  </body>
  </html>
  `;

  const docPath = path.resolve('BIG_TECH_AUTHENTICATION_STANDARDS_OAUTH_VS_FIREBASE.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);

  const backendDocPath = path.resolve('../family-together-backend/BIG_TECH_AUTHENTICATION_STANDARDS_OAUTH_VS_FIREBASE.doc');
  fs.writeFileSync(backendDocPath, docHtml, 'utf8');
  console.log(`Created Backend DOC: ${backendDocPath}`);
}

generateDoc().catch(console.error);
