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

async function generateAuthRedirectDocumentation() {
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
                text: '🛡️ Authenticated Route Redirection & Zero-Flash Dashboard Architecture',
                bold: true,
                size: 34,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 350 },
            children: [
              new TextRun({
                text: 'Comprehensive Technical Documentation on Server-Side Edge Proxy, Role-Based URL Redirection, and History Protection',
                italics: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),

          new Paragraph({
            text: '_________________________________________________________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // Section 1: Executive Summary & Problem Solved
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '1. Executive Summary & Problem Definition',
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
                text: 'In modern web applications, when an authenticated user manually types auth routes such as ',
              }),
              new TextRun({ text: '/login', bold: true, color: '2563EB' }),
              new TextRun({ text: ', ' }),
              new TextRun({ text: '/signin', bold: true, color: '2563EB' }),
              new TextRun({ text: ', or ' }),
              new TextRun({ text: '/signup', bold: true, color: '2563EB' }),
              new TextRun({
                text: ' into their browser URL address bar, showing them login or registration forms provides a poor user experience. Worse, if client-side redirects execute after initial component render, users experience a distracting "Flash of Unauthenticated Content" (FOUC).',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'We have implemented a dual-layer zero-flash protection architecture: an Edge Server Proxy (Next.js 16 convention) that intercepts requests at the HTTP header level, and an instant client-side short-circuit component guard that utilizes router.replace to avoid browser back-button trapping.',
              }),
            ],
          }),

          // Section 2: Architectural Layers
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. Multi-Layer Redirection & Protection Stack',
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
                text: 'The solution is structured into four coordinated architectural tiers:',
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
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Layer / Component', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'File Location', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Mechanism & Responsibilities', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Tier 1: Edge Proxy', bold: true }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'src/proxy.ts' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Next.js 16 proxy convention. Inspects cookies before page render. Returns HTTP 307 redirect immediately to the exact role dashboard. Zero HTML downloaded.',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Tier 2: Server Route', bold: true }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'src/app/login/page.tsx' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Direct route handler for /login. Reads cookieStore. If authenticated, redirects directly to role dashboard. If unauthenticated guest, redirects to /signin.',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Tier 3: Cookie Sync', bold: true }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'src/redux/slices/authSlice.ts' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Synchronizes is_authenticated and user_role lightweight cookies during login, store rehydration, profile updates, and cleans them on logout.',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Tier 4: Client Guards', bold: true }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'src/app/signin/page.tsx\nsrc/app/signup/page.tsx' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Instant early-return guard: suppresses form rendering completely if isAuthenticated is true. Replaces history state via router.replace to prevent back-button loops.',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Section 3: Role-to-Dashboard Resolution
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3. Role-Based Destination Matrix',
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
                text: 'The redirection targets are strictly governed by user roles according to roleUtils:',
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
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'User Role', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '047857' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Redirect Destination', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '047857' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Dashboard Description & Capabilities', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'OWNER', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: '/owner-dashboard', bold: true, color: '2563EB' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Family Sanctuary Manager: family tree editor, billing, member management, invite links.' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ADMIN / SUPER_ADMIN', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: '/admin-dashboard', bold: true, color: '2563EB' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'System Administration: audit logs, platform analytics, user & family moderation.' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'USER / MEMBER', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: '/user-dashboard', bold: true, color: '2563EB' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Sanctuary Member Experience: family memories, events, private messages, personal profile.' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'VIEWER / Unauthenticated', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: '/ (or /signin)', bold: true, color: '64748B' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Landing page and public read-only pages; redirected to /signin if attempting protected action.' })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Section 4: Live Verification & Proof of Zero-Flash
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '4. Live Verification & Test Results',
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
                text: 'The architecture was verified directly against the live Next.js development server (port 3001) using cURL header inspections:',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Test 1: Authenticated OWNER visits /signin:\n', bold: true }),
              new TextRun({ text: 'curl.exe -I -s "http://localhost:3001/signin" -H "Cookie: is_authenticated=true; user_role=OWNER"\n', font: 'Consolas', size: 19 }),
              new TextRun({ text: 'Result: ', bold: true, color: '059669' }),
              new TextRun({ text: 'HTTP/1.1 307 Temporary Redirect -> location: /owner-dashboard (0ms flash, no HTML sent)\n\n' }),

              new TextRun({ text: 'Test 2: Authenticated USER visits /signin:\n', bold: true }),
              new TextRun({ text: 'curl.exe -I -s "http://localhost:3001/signin" -H "Cookie: is_authenticated=true; user_role=USER"\n', font: 'Consolas', size: 19 }),
              new TextRun({ text: 'Result: ', bold: true, color: '059669' }),
              new TextRun({ text: 'HTTP/1.1 307 Temporary Redirect -> location: /user-dashboard\n\n' }),

              new TextRun({ text: 'Test 3: Authenticated ADMIN visits /signin:\n', bold: true }),
              new TextRun({ text: 'curl.exe -I -s "http://localhost:3001/signin" -H "Cookie: is_authenticated=true; user_role=ADMIN"\n', font: 'Consolas', size: 19 }),
              new TextRun({ text: 'Result: ', bold: true, color: '059669' }),
              new TextRun({ text: 'HTTP/1.1 307 Temporary Redirect -> location: /admin-dashboard\n\n' }),

              new TextRun({ text: 'Test 4: Authenticated user visits /login:\n', bold: true }),
              new TextRun({ text: 'curl.exe -I -s "http://localhost:3001/login" -H "Cookie: is_authenticated=true; user_role=OWNER"\n', font: 'Consolas', size: 19 }),
              new TextRun({ text: 'Result: ', bold: true, color: '059669' }),
              new TextRun({ text: 'HTTP/1.1 307 Temporary Redirect -> location: /owner-dashboard\n\n' }),

              new TextRun({ text: 'Test 5: Unauthenticated guest visits /signin:\n', bold: true }),
              new TextRun({ text: 'curl.exe -I -s "http://localhost:3001/signin"\n', font: 'Consolas', size: 19 }),
              new TextRun({ text: 'Result: ', bold: true, color: '059669' }),
              new TextRun({ text: 'HTTP/1.1 200 OK (Sign-in form loads normally for unauthenticated guests)\n\n' }),

              new TextRun({ text: 'Test 6: Full TypeScript compilation:\n', bold: true }),
              new TextRun({ text: 'npx tsc --noEmit\n', font: 'Consolas', size: 19 }),
              new TextRun({ text: 'Result: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Exit code 0 (Zero errors across all files and components)\n' }),
            ],
          }),

          // Section 5: Conclusion
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '5. Summary of Benefits & Best Practices',
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
                text: '1. Zero Flash (No FOUC): Authenticated users never see the login form when typing auth URLs in their browser bar.\n',
                bold: true,
              }),
              new TextRun({
                text: '2. Clean Browser History: Using router.replace prevents the login URL from being added to the session history, eliminating back-button redirect loops.\n',
                bold: true,
              }),
              new TextRun({
                text: '3. Next.js 16 Standard: Implemented using the modern proxy.ts convention instead of deprecated middleware.ts.\n',
                bold: true,
              }),
              new TextRun({
                text: '4. Immediate Role Routing: Instantly resolves the precise dashboard (Owner, Admin, Member) matching the user\'s authorization.',
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('AUTHENTICATED_ROUTE_PROTECTION_AND_DASHBOARD_REDIRECT_GUIDE.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  // Also create a companion .doc file
  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Authenticated Route Redirection & Dashboard Architecture Guide</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 30px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
      .success { background-color: #dcfce7; color: #166534; }
    </style>
  </head>
  <body>
    <h1>🛡️ Authenticated Route Redirection & Zero-Flash Dashboard Architecture</h1>
    <p><em>Comprehensive Technical Documentation on Server-Side Edge Proxy, Role-Based URL Redirection, and History Protection</em></p>
    <hr/>
    <h2>1. Executive Summary & Problem Solved</h2>
    <p>When an authenticated user enters <code>/login</code>, <code>/signin</code>, or <code>/signup</code> in their browser address bar, this architecture ensures they are immediately and seamlessly redirected to their role-specific dashboard with <strong>zero flash of unauthenticated login forms</strong>.</p>
    
    <h2>2. Multi-Layer Redirection Stack</h2>
    <table>
      <tr><th>Layer</th><th>File</th><th>Description</th></tr>
      <tr><td>Edge Proxy</td><td><code>src/proxy.ts</code></td><td>Next.js 16 convention. Inspects cookies before render. Returns HTTP 307 redirect immediately.</td></tr>
      <tr><td>Server Route</td><td><code>src/app/login/page.tsx</code></td><td>Server Component for /login. Redirects authenticated users directly to role dashboard.</td></tr>
      <tr><td>Cookie Sync</td><td><code>src/redux/slices/authSlice.ts</code></td><td>Maintains lightweight <code>is_authenticated</code> and <code>user_role</code> cookies across auth lifecycle.</td></tr>
      <tr><td>Client Guard</td><td><code>src/app/signin/page.tsx</code> & <code>src/app/signup/page.tsx</code></td><td>Short-circuits rendering if authenticated, replaces history using <code>router.replace</code>.</td></tr>
    </table>

    <h2>3. Destination Matrix by Role</h2>
    <table>
      <tr><th>Role</th><th>Destination</th><th>Description</th></tr>
      <tr><td><strong>OWNER</strong></td><td><code>/owner-dashboard</code></td><td>Family Sanctuary Manager: family tree editor, billing, member management.</td></tr>
      <tr><td><strong>ADMIN / SUPER_ADMIN</strong></td><td><code>/admin-dashboard</code></td><td>System Administration: audit logs, platform analytics, moderation.</td></tr>
      <tr><td><strong>USER / MEMBER</strong></td><td><code>/user-dashboard</code></td><td>Family Member Sanctuary: memories, events, private messages, profile.</td></tr>
    </table>

    <h2>4. Live Verification Results</h2>
    <p><span class="badge success">PASS</span> <strong>cURL /signin (OWNER)</strong>: <code>HTTP/1.1 307 Temporary Redirect -> /owner-dashboard</code></p>
    <p><span class="badge success">PASS</span> <strong>cURL /signin (USER)</strong>: <code>HTTP/1.1 307 Temporary Redirect -> /user-dashboard</code></p>
    <p><span class="badge success">PASS</span> <strong>cURL /signin (ADMIN)</strong>: <code>HTTP/1.1 307 Temporary Redirect -> /admin-dashboard</code></p>
    <p><span class="badge success">PASS</span> <strong>cURL /signin (Guest)</strong>: <code>HTTP/1.1 200 OK (Loads signin form)</code></p>
    <p><span class="badge success">PASS</span> <strong>TypeScript Verification</strong>: <code>npx tsc --noEmit</code> exited with code 0 (zero errors).</p>
  </body>
  </html>
  `;

  const docPath = path.resolve('AUTHENTICATED_ROUTE_PROTECTION_AND_DASHBOARD_REDIRECT_GUIDE.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);
}

generateAuthRedirectDocumentation().catch(console.error);
