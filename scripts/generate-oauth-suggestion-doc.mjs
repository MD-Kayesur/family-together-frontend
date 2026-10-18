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

async function generateOAuthSuggestionDoc() {
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
                text: '🎯 Recommended OAuth 2.0 (Google & Facebook) Integration Strategy & Implementation Guide',
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
                text: 'Strategic Recommendation: Native NestJS Passport OAuth Flow, Credential Setup Guide (Google Cloud & Meta for Developers), Prisma Schema Extension, and Frontend UI Integration',
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
                text: '1. What We Recommend (The Best Industry Approach)',
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
                text: 'We strongly recommend implementing Native NestJS Passport OAuth 2.0 (using passport-google-oauth20 and passport-facebook). Since your backend already utilizes PassportModule and JwtStrategy, adding Google and Facebook strategies is seamless, 100% secure, and aligns with enterprise architectures like Spotify and Airbnb.',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Stage', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Deliverables & Architecture', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'User / Developer Action', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Phase 1: Backend Setup', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Install passport-google-oauth20 & passport-facebook.\nUpdate Prisma schema with provider and providerId.\nAdd GoogleStrategy, FacebookStrategy, and AuthController endpoints.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Automated by AI pair programmer.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Phase 2: Frontend UI', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Add "Continue with Google" and "Continue with Facebook" buttons on /signin and /signup pages with official SVG logos and responsive styling.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Automated by AI pair programmer.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Phase 3: Credentials', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Obtain Client ID & Secret from Google Cloud Console and Meta for Developers.' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Free 2-minute setup by User via developer consoles.' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '2. Complete Google & Facebook Credential Setup Guide',
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
                text: 'A. Google Cloud Console (Free, 2 Minutes):\n' +
                      '1. Go to https://console.cloud.google.com/apis/credentials\n' +
                      '2. Create a Project named "FamilyRoots".\n' +
                      '3. Click "Create Credentials" -> "OAuth Client ID" -> Application type: "Web application".\n' +
                      '4. Add Authorized Redirect URIs:\n' +
                      '   - http://localhost:8000/api/auth/google/callback (Local Development)\n' +
                      '   - https://family-together-backend.vercel.app/api/auth/google/callback (Production)\n' +
                      '5. Copy the Client ID and Client Secret into your backend .env file:\n' +
                      '   GOOGLE_CLIENT_ID=your_google_client_id\n' +
                      '   GOOGLE_CLIENT_SECRET=your_google_client_secret',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'B. Meta / Facebook Developers (Free, 3 Minutes):\n' +
                      '1. Go to https://developers.facebook.com/apps\n' +
                      '2. Click "Create App" -> "Authenticate and request data from users with Facebook Login".\n' +
                      '3. In Facebook Login Settings, add Valid OAuth Redirect URIs:\n' +
                      '   - http://localhost:8000/api/auth/facebook/callback\n' +
                      '   - https://family-together-backend.vercel.app/api/auth/facebook/callback\n' +
                      '4. Copy App ID and App Secret into your backend .env file:\n' +
                      '   FACEBOOK_APP_ID=your_facebook_app_id\n' +
                      '   FACEBOOK_APP_SECRET=your_facebook_app_secret',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '3. What Happens If Credentials Are Not Added Yet?',
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
                text: 'We will write the code with graceful fallbacks. If GOOGLE_CLIENT_ID or FACEBOOK_APP_ID is not yet configured in .env, the server starts normally without crashing, and clicking the social button provides a clear, helpful notification instructing the admin to provide the credentials. Once you paste the keys into .env, it works instantly!',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('RECOMMENDED_OAUTH_INTEGRATION_PLAN_AND_STEP_BY_STEP_GUIDE.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  const backendDocxPath = path.resolve('../family-together-backend/RECOMMENDED_OAUTH_INTEGRATION_PLAN_AND_STEP_BY_STEP_GUIDE.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`Created Backend DOCX: ${backendDocxPath}`);

  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Recommended OAuth 2.0 (Google & Facebook) Integration Strategy & Implementation Guide</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      .box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 15px 0; }
      .step { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin: 10px 0; }
    </style>
  </head>
  <body>
    <h1>🎯 Recommended OAuth 2.0 (Google & Facebook) Integration Strategy & Implementation Guide</h1>
    <p><em>Strategic Recommendation: Native NestJS Passport OAuth Flow, Credential Setup Guide (Google Cloud & Meta for Developers), Prisma Schema Extension, and Frontend UI Integration</em></p>
    <hr/>

    <h2>১. আমাদের সুস্পষ্ট পরামর্শ (Our Direct Recommendation)</h2>
    <div class="box">
      <strong>পরামর্শ:</strong> আমরা সম্পূর্ণ কোডবেস এমনভাবে তৈরি করে দেব যাতে <strong>NestJS Passport OAuth 2.0</strong> আর্কিটেকচার অনুযায়ী Google ও Facebook লগইন সিস্টেম সরাসরি সক্রিয় হয়ে যায়।<br/><br/>
      আমাদের ব্যাকএন্ডে ইতোমধ্যে <code>PassportModule</code> ও <code>JwtStrategy</code> সক্রিয় রয়েছে। তাই এতে <code>GoogleStrategy</code> ও <code>FacebookStrategy</code> যুক্ত করা সবচেয়ে পরিচ্ছন্ন এবং পারফেক্ট সমাধান।
    </div>

    <h2>২. বাস্তবায়নের রূপরেখা (Implementation Roadmap)</h2>
    <div class="step">
      <strong>ধাপ ১: ব্যাকএন্ড স্ট্র্যাটেজি ও Prisma স্কিমা</strong><br/>
      • Prisma <code>User</code> মডেলে <code>provider</code> ও <code>providerId</code> যুক্ত করা।<br/>
      • <code>passport-google-oauth20</code> এবং <code>passport-facebook</code> ইন্সটল করে স্ট্র্যাটেজি ফাইল তৈরি করা।<br/>
      • <code>auth.service.ts</code>-এ গুগল/ফেসবুক প্রোফাইল থেকে ইউজার খোঁজা বা নতুন ইউজার তৈরি করে JWT কুকি ইস্যু করা।
    </div>

    <div class="step">
      <strong>ধাপ ২: ফ্রন্টএন্ড UI সোশ্যাল বাটন</strong><br/>
      • <code>/signin</code> ও <code>/signup</code> পেজে অফিসিয়াল লোগোসহ <strong>"Continue with Google"</strong> এবং <strong>"Continue with Facebook"</strong> বাটন বসানো।
    </div>

    <div class="step">
      <strong>ধাপ ৩: ফ্রি API Keys (Client ID ও Secret) সেটআপ</strong><br/>
      • <strong>Google:</strong> Google Cloud Console থেকে OAuth Client ID ও Secret সংগ্রহ করে ব্যাকএন্ড <code>.env</code> ফাইলে পেস্ট করা।<br/>
      • <strong>Facebook:</strong> Meta Developers Console থেকে App ID ও Secret সংগ্রহ করা।
    </div>
  </body>
  </html>
  `;

  const docPath = path.resolve('RECOMMENDED_OAUTH_INTEGRATION_PLAN_AND_STEP_BY_STEP_GUIDE.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);

  const backendDocPath = path.resolve('../family-together-backend/RECOMMENDED_OAUTH_INTEGRATION_PLAN_AND_STEP_BY_STEP_GUIDE.doc');
  fs.writeFileSync(backendDocPath, docHtml, 'utf8');
  console.log(`Created Backend DOC: ${backendDocPath}`);
}

generateOAuthSuggestionDoc().catch(console.error);
