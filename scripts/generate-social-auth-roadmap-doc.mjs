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

async function generateSocialAuthDoc() {
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
                text: '🔑 Social Authentication (Google & Facebook OAuth) Implementation Architecture & Roadmap',
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
                text: 'Complete Technical Guide: Architectural Solutions, Passport.js vs Firebase Comparison, Console Setup Steps, Prisma Schema Adjustments, and Full-Stack Integration Workflow',
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
                text: '1. Executive Summary & Architectural Options',
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
                text: 'To add Google and Facebook authentication to FamilyRoots, there are two battle-tested production approaches. Both integrate seamlessly with the existing NestJS backend and Next.js frontend.',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Approach', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'How It Works', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Pros & Cons', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Option A (Recommended): Native NestJS Passport OAuth', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Frontend redirects to /api/auth/google or /facebook. Google/Facebook redirects to backend callback, backend issues our system JWT token and sets HTTP-only cookie.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '✓ 100% control over JWT tokens & cookies.\n✓ Zero third-party service dependency or cost.\n✓ Directly integrates with Prisma User model.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Option B: Firebase Auth Popup Flow', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Frontend uses Firebase SDK signInWithPopup. Client receives Firebase ID token, sends it to backend POST /api/auth/social-login. Backend verifies with firebase-admin.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '✓ In-page popup dialog (no redirect).\n✕ Requires Firebase project setup and admin service account private key.' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '2. Step-by-Step Implementation Blueprint (Option A: Recommended Passport Flow)',
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
                text: 'Step 1: Obtain OAuth Credentials from Google & Meta\n' +
                      '• Google Cloud Console (https://console.cloud.google.com/apis/credentials):\n' +
                      '  Create OAuth 2.0 Client ID (Web Application).\n' +
                      '  Authorized redirect URI: http://localhost:8000/api/auth/google/callback and https://family-together-backend.vercel.app/api/auth/google/callback.\n' +
                      '• Meta for Developers (https://developers.facebook.com):\n' +
                      '  Create App -> Facebook Login -> Web.\n' +
                      '  Authorized redirect URI: http://localhost:8000/api/auth/facebook/callback.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Step 2: Update Prisma Schema (prisma/schema/base.prisma)\n' +
                      'Add provider ("google" | "facebook" | "local") and providerId to User model:\n' +
                      '  provider    String?   @default("local")\n' +
                      '  providerId  String?   @map("provider_id")',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Step 3: Backend Strategies & Controller Endpoints\n' +
                      '• Install: passport-google-oauth20, passport-facebook, @types/passport-google-oauth20.\n' +
                      '• Create GoogleStrategy extending PassportStrategy(Strategy, "google").\n' +
                      '• Create FacebookStrategy extending PassportStrategy(Strategy, "facebook").\n' +
                      '• In AuthController: add @Get("google") and @Get("google/callback"), handling user upsert, generating JWT, and redirecting with HTTP-only cookie.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Step 4: Frontend UI Social Login Buttons\n' +
                      'In src/app/signin/page.tsx and src/app/signup/page.tsx, add:\n' +
                      '• "Continue with Google" button -> window.location.href = `${API_URL}/api/auth/google`\n' +
                      '• "Continue with Facebook" button -> window.location.href = `${API_URL}/api/auth/facebook`\n' +
                      'Styled with official Google (multicolor G) and Meta (Facebook blue) brand assets and divider "or continue with".',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('GOOGLE_AND_FACEBOOK_OAUTH_IMPLEMENTATION_ROADMAP.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  const backendDocxPath = path.resolve('../family-together-backend/GOOGLE_AND_FACEBOOK_OAUTH_IMPLEMENTATION_ROADMAP.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`Created Backend DOCX: ${backendDocxPath}`);

  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Google & Facebook OAuth Implementation Architecture & Roadmap</title>
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
    <h1>🔑 Google & Facebook OAuth Implementation Architecture & Roadmap</h1>
    <p><em>Complete Technical Guide: Architectural Solutions, Passport.js vs Firebase Comparison, Console Setup Steps, Prisma Schema Adjustments, and Full-Stack Integration Workflow</em></p>
    <hr/>

    <h2>১. গুগল ও ফেসবুক লগইন যুক্ত করার ২টি প্রধান উপায়</h2>
    <div class="box">
      <strong>পদ্ধতি ১ <span class="badge-rec">(সুপারিশকৃত / Recommended):</span> নেটিভ NestJS Passport OAuth Flow</strong><br/>
      • <strong>পদ্ধতি:</strong> NestJS ব্যাকএন্ডে <code>passport-google-oauth20</code> এবং <code>passport-facebook</code> প্যাকেজ ব্যবহার করে সরাসরি OAuth2 ফ্লো সম্পন্ন করা।<br/>
      • <strong>সুবিধা:</strong> আমাদের বিদ্যমান Prisma ডেটাবেস ও JWT কুকি সিস্টেমের সাথে ১০০% ইন্টিগ্রেটেড। কোনো তৃতীয় পক্ষের সার্ভিসের ওপর নির্ভরশীল থাকতে হয় না।
    </div>

    <div class="box">
      <strong>পদ্ধতি ২: Firebase Authentication (Popup Method)</strong><br/>
      • <strong>পদ্ধতি:</strong> ফ্রন্টএন্ডে ফায়ারবেস SDK দিয়ে পপআপে গুগল/ফেসবুক লগইন করিয়ে ফায়ারবেস আইডি টোকেন ব্যাকএন্ডে পাঠিয়ে ভেরিফাই করা।<br/>
      • <strong>সুবিধা:</strong> ইন-পেজ পপআপ লগইন এক্সপেরিয়েন্স। তবে ফায়ারবেস কনসোলে সার্ভিস অ্যাকাউন্ট সেটআপের প্রয়োজন হয়।
    </div>

    <h2>২. পদ্ধতি ১ (NestJS Passport OAuth) বাস্তবায়নের ধাপসমূহ</h2>
    <ol>
      <li><strong>গুগল ও মেটা কনসোল থেকে ক্রেডেনশিয়াল সংগ্রহ:</strong>
        <ul>
          <li><strong>Google Cloud Console:</strong> OAuth Client ID ও Client Secret। রিডাইরেক্ট URI: <code>http://localhost:8000/api/auth/google/callback</code>।</li>
          <li><strong>Meta for Developers:</strong> App ID ও App Secret। রিডাইরেক্ট URI: <code>http://localhost:8000/api/auth/facebook/callback</code>।</li>
        </ul>
      </li>
      <li><strong>Prisma স্কিমা আপডেট:</strong> <code>User</code> মডেলে <code>provider</code> এবং <code>providerId</code> ফিল্ড যুক্ত করা (পাসওয়ার্ড ফিল্ড ইতোমধ্যেই অপশনাল রয়েছে)।</li>
      <li><strong>NestJS ব্যাকএন্ড স্ট্র্যাটেজি:</strong> <code>GoogleStrategy</code> ও <code>FacebookStrategy</code> তৈরি করে <code>/api/auth/google</code> ও <code>/api/auth/facebook</code> এন্ডপয়েন্ট তৈরি করা।</li>
      <li><strong>JWT কুকি ও ড্যাশবোর্ড রিডাইরেক্ট:</strong> লগইন সম্পন্ন হলে সিস্টেমের কাস্টম JWT টোকেন জেনারেট করে ফ্রন্টএন্ড ড্যাশবোর্ডে রিডাইরেক্ট করা।</li>
      <li><strong>ফ্রন্টএন্ড UI বাটন:</strong> সাইন-ইন ও সাইন-আপ পেজে অফিসিয়াল গুগল ও ফেসবুক বাটন যুক্ত করা।</li>
    </ol>
  </body>
  </html>
  `;

  const docPath = path.resolve('GOOGLE_AND_FACEBOOK_OAUTH_IMPLEMENTATION_ROADMAP.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);

  const backendDocPath = path.resolve('../family-together-backend/GOOGLE_AND_FACEBOOK_OAUTH_IMPLEMENTATION_ROADMAP.doc');
  fs.writeFileSync(backendDocPath, docHtml, 'utf8');
  console.log(`Created Backend DOC: ${backendDocPath}`);
}

generateSocialAuthDoc().catch(console.error);
