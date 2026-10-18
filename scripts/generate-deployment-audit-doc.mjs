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

async function generateDeploymentAuditDoc() {
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
                text: '🚀 FamilyRoots Production Deployment & Hosting Services Audit Report',
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
                text: 'Comprehensive Audit: Previous & Current Deployment Status on Vercel, Render Investigation, Cloud Database (Neon Postgres), and Live Production Endpoints',
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
                text: '1. Executive Summary & Direct Answer',
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
                text: 'YES, this project HAS been previously deployed and is actively deployed on VERCEL! Both the Frontend and Backend are currently LIVE on the internet. There is NO active or past deployment on Render (render.com).',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Service Component', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Hosting Platform', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Live URL / Endpoint', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Current Status', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Frontend Web App' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Vercel (Next.js 16)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'https://family-together-eta.vercel.app' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '200 OK (LIVE)' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Backend REST API' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Vercel Serverless (NestJS)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'https://family-together-backend.vercel.app' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '200 OK (LIVE)' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Swagger API Docs' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Vercel Serverless' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'https://family-together-backend.vercel.app/api/docs' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '200 OK (LIVE)' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cloud Database' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Neon Serverless PostgreSQL (AWS)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ep-tiny-bar-az5kqldq-pooler.c-3.ap-southeast-1.aws.neon.tech' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Connected & Active' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Render (render.com)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Render' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'None configured' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Not Deployed' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '2. Deep Codebase Evidence & Verification',
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
                text: '1. Vercel Project Metadata in Backend: The folder .vercel/project.json confirms explicit linkage to Vercel CLI with Project ID "prj_I1SGl9VUqrbxlYb8oyIz5maXeVEl", Org ID "team_Uqg1SBLyqkaMJ1Vcfpsg41mP", and Project Name "family-together-backend".',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: '2. Serverless Bootstrap (api/index.ts): The backend has a dedicated NestJS ExpressAdapter serverless entrypoint with Swagger routing and 100MB body limits specially designed for Vercel Serverless Functions.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: '3. Vercel Configuration (vercel.json): Configured with version 2, @vercel/node builder for api/index.ts, and catch-all routing /(.*) -> /api/index.ts.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: '4. Git Commit History: Commit abc846a ("feat(deploy): configure Vercel serverless deployment for NestJS backend") and commit 81be628 ("fix(urls): update frontend URL alias in backend to family-together-eta.vercel.app").',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '5. Frontend Deployment: The frontend is deployed at https://family-together-eta.vercel.app with automatic GitHub CI/CD integration upon pushing to origin main.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '3. Live HTTP Endpoint Status',
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
                text: '• https://family-together-eta.vercel.app -> HTTP 200 OK (Title: FamilyRoots - Private Digital Family Sanctuary)',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '• https://family-together-backend.vercel.app -> HTTP 200 OK (Redirects to Swagger API Docs)',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• https://family-together-backend.vercel.app/api/docs -> HTTP 200 OK (Swagger UI Interactive Documentation)',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('PROJECT_DEPLOYMENT_STATUS_AND_LIVE_SERVICES_AUDIT.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  const backendDocxPath = path.resolve('../family-together-backend/PROJECT_DEPLOYMENT_STATUS_AND_LIVE_SERVICES_AUDIT.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`Created Backend DOCX: ${backendDocxPath}`);

  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>FamilyRoots Production Deployment & Hosting Services Audit Report</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      .box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 15px 0; }
      .badge-success { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; background-color: #dcfce7; color: #166534; }
      .badge-none { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; background-color: #f1f5f9; color: #64748b; }
    </style>
  </head>
  <body>
    <h1>🚀 FamilyRoots Production Deployment & Hosting Services Audit Report</h1>
    <p><em>Comprehensive Audit: Previous & Current Deployment Status on Vercel, Render Investigation, Cloud Database (Neon Postgres), and Live Production Endpoints</em></p>
    <hr/>

    <h2>১. স্পষ্ট ও সংক্ষিপ্ত উত্তর (Direct Answer)</h2>
    <div class="box">
      <strong>হ্যাঁ (YES)!</strong> এই প্রজেক্টটি পূর্বে <strong>Vercel</strong>-এ ডিপ্লয় করা হয়েছে এবং বর্তমানেও <strong>Vercel-এ লাইভ সচল (200 OK)</strong> রয়েছে!<br/><br/>
      • <strong>Frontend:</strong> Vercel-এ লাইভ ডিপ্লয়েড: <code>https://family-together-eta.vercel.app</code><br/>
      • <strong>Backend API:</strong> Vercel Serverless-এ লাইভ ডিপ্লয়েড: <code>https://family-together-backend.vercel.app</code><br/>
      • <strong>Swagger Docs:</strong> Vercel-এ লাইভ: <code>https://family-together-backend.vercel.app/api/docs</code><br/>
      • <strong>Database:</strong> ক্লাউড Neon PostgreSQL (AWS Singapore)-এ কানেক্টেড।<br/>
      • <strong>Render (render.com):</strong> রেন্ডারে (Render) কোনো ডিপ্লয়মেন্ট নেই। কোনো <code>render.yaml</code> বা Render সার্ভিস কনফিগার করা হয়নি।
    </div>

    <h2>২. সার্ভিসের বিস্তারিত তালিকা ও লাইভ স্ট্যাটাস</h2>
    <table>
      <tr><th>সার্ভিস</th><th>প্ল্যাটফর্ম</th><th>লাইভ ইউআরএল (Live URL)</th><th>বর্তমান স্ট্যাটাস</th></tr>
      <tr><td><strong>Frontend App</strong></td><td>Vercel (Next.js 16)</td><td><code>https://family-together-eta.vercel.app</code></td><td><span class="badge-success">200 OK (LIVE)</span></td></tr>
      <tr><td><strong>Backend API</strong></td><td>Vercel Serverless (NestJS)</td><td><code>https://family-together-backend.vercel.app</code></td><td><span class="badge-success">200 OK (LIVE)</span></td></tr>
      <tr><td><strong>Swagger UI Docs</strong></td><td>Vercel Serverless</td><td><code>https://family-together-backend.vercel.app/api/docs</code></td><td><span class="badge-success">200 OK (LIVE)</span></td></tr>
      <tr><td><strong>Database</strong></td><td>Neon Serverless Postgres</td><td><code>ep-tiny-bar-...aws.neon.tech</code></td><td><span class="badge-success">Connected</span></td></tr>
      <tr><td><strong>Render</strong></td><td>Render.com</td><td>নেই (None)</td><td><span class="badge-none">Not Deployed</span></td></tr>
    </table>

    <h2>৩. কোডবেসে পাওয়া সুনির্দিষ্ট প্রমাণসমূহ (Codebase Evidence)</h2>
    <ul>
      <li><strong>.vercel/project.json (Backend):</strong> Vercel CLI দিয়ে প্রজেক্ট লিঙ্ক করা হয়েছিল (Project ID: <code>prj_I1SGl9VUqrbxlYb8oyIz5maXeVEl</code>, Name: <code>family-together-backend</code>)।</li>
      <li><strong>vercel.json (Backend):</strong> <code>@vercel/node</code> বিল্ডার কনফিগারেশন দিয়ে সমস্ত রিকোয়েস্ট <code>/api/index.ts</code> সার্ভারলেস হ্যান্ডলারে রাউট করা।</li>
      <li><strong>api/index.ts (Backend):</strong> Vercel Serverless ফাংশন বুটস্ট্র্যাপ করার জন্য ডেডিকেটেড কোড।</li>
      <li><strong>গিটহ্যাব কমিট হিস্ট্রি:</strong>
        <br/>• Commit <code>abc846a</code>: <em>"feat(deploy): configure Vercel serverless deployment for NestJS backend"</em>
        <br/>• Commit <code>81be628</code>: <em>"fix(urls): update frontend URL alias in backend to family-together-eta.vercel.app"</em>
      </li>
    </ul>
  </body>
  </html>
  `;

  const docPath = path.resolve('PROJECT_DEPLOYMENT_STATUS_AND_LIVE_SERVICES_AUDIT.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);

  const backendDocPath = path.resolve('../family-together-backend/PROJECT_DEPLOYMENT_STATUS_AND_LIVE_SERVICES_AUDIT.doc');
  fs.writeFileSync(backendDocPath, docHtml, 'utf8');
  console.log(`Created Backend DOC: ${backendDocPath}`);
}

generateDeploymentAuditDoc().catch(console.error);
