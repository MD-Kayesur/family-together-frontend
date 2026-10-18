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
                text: '🔐 Firebase & OAuth Authentication Status Audit Report',
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
                text: 'Technical Audit: Verification of Firebase Presence, OAuth/Social Login Analysis, and Active Custom JWT/Prisma Architecture',
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
                text: '1. Executive Summary',
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
                text: '• Firebase Process: NOT active. Although "firebase": "^12.18.0" is listed in frontend dependencies, it is completely unused in the application codebase (no Firebase Auth, no Firestore, no config).\n' +
                      '• OAuth System: NONE. There is no Google, Facebook, GitHub, or OAuth 2.0 social login implemented in either the frontend or backend.\n' +
                      '• Active Auth Engine: Custom NestJS JWT Authentication with Bcrypt password hashing, PostgreSQL/Prisma database storage, HTTP-only cookies, and Nodemailer SMTP email verification.',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Feature', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Status in Project', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Technical Details', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Firebase Auth' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '❌ Not Used' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Package installed in package.json, but 0 imports or configs in src/' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'OAuth / Social Login' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '❌ Not Implemented' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'No Google, Facebook, or OAuth2 strategies configured' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Custom JWT Auth' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '✅ Active & Primary' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'NestJS @nestjs/jwt, passport-jwt, bcryptjs, HTTP-only cookie' })] })] }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('FIREBASE_AND_OAUTH_AUTHENTICATION_STATUS_REPORT.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  const backendDocxPath = path.resolve('../family-together-backend/FIREBASE_AND_OAUTH_AUTHENTICATION_STATUS_REPORT.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`Created Backend DOCX: ${backendDocxPath}`);

  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Firebase & OAuth Authentication Status Audit Report</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      .box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 15px 0; }
      .badge-no { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; background-color: #fee2e2; color: #991b1b; }
      .badge-yes { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; background-color: #dcfce7; color: #166534; }
    </style>
  </head>
  <body>
    <h1>🔐 Firebase & OAuth Authentication Status Audit Report</h1>
    <p><em>Technical Audit: Verification of Firebase Presence, OAuth/Social Login Analysis, and Active Custom JWT/Prisma Architecture</em></p>
    <hr/>

    <h2>১. সরাসরি উত্তর (Direct Answer)</h2>
    <div class="box">
      ১. <strong>Firebase Process:</strong> <span class="badge-no">না (NO)</span> — ফ্রন্টএন্ডের <code>package.json</code>-এ <code>firebase</code> প্যাকেজটি ইন্সটল করা থাকলেও প্রোজেক্টের কোডে (src) ফায়ারবেসের কোনো ব্যবহার, কনফিগারেশন বা ফায়ারবেস অথেন্টিকেশন নেই।<br/><br/>
      ২. <strong>OAuth System (Google/Facebook Login):</strong> <span class="badge-no">না (NO)</span> — এই প্রোজেক্টে কোনো OAuth বা সোশ্যাল লগইন (যেমন Google Login, Facebook Login ইত্যাদি) যুক্ত করা নেই।<br/><br/>
      ৩. <strong>প্রোজেক্টে কী অথেন্টিকেশন ব্যবহার হচ্ছে?</strong> <span class="badge-yes">Custom JWT + Bcrypt</span> — নিজস্ব নেস্টজেএস (NestJS) ব্যাকএন্ডে <code>@nestjs/jwt</code>, <code>passport-jwt</code>, <code>bcryptjs</code>, পোস্টগ্রেস্কিউএল ডেটাবেস এবং Nodemailer SMTP ভেরিফিকেশন দিয়ে সম্পূর্ণ কাস্টম সিকিউর অথেন্টিকেশন সিস্টেম তৈরি করা আছে।
    </div>
  </body>
  </html>
  `;

  const docPath = path.resolve('FIREBASE_AND_OAUTH_AUTHENTICATION_STATUS_REPORT.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);

  const backendDocPath = path.resolve('../family-together-backend/FIREBASE_AND_OAUTH_AUTHENTICATION_STATUS_REPORT.doc');
  fs.writeFileSync(backendDocPath, docHtml, 'utf8');
  console.log(`Created Backend DOC: ${backendDocPath}`);
}

generateDoc().catch(console.error);
