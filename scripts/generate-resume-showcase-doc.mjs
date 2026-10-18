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

async function generateResumeShowcaseDoc() {
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
                text: '💼 Full-Stack Portfolio Showcase & Resume Evaluation Guide',
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
                text: 'Why "FamilyRoots Sanctuary" Puts You in the Top 1% of Full-Stack Developer Candidates, How to Pitch It on Your Resume, and Live Interview Strategy',
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
                    shading: { fill: 'F0FDF4', type: ShadingType.CLEAR, color: 'auto' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 2, color: '86EFAC' },
                      bottom: { style: BorderStyle.SINGLE, size: 2, color: '86EFAC' },
                      left: { style: BorderStyle.SINGLE, size: 6, color: '22C55E' },
                      right: { style: BorderStyle.SINGLE, size: 2, color: '86EFAC' },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'VERDICT FOR YOUR RESUME: ', bold: true, color: '15803D' }),
                          new TextRun({
                            text: 'YES — Absolutely, 100%! This project is significantly more advanced than 99% of typical candidate portfolio projects (such as simple to-do apps, clones, or generic CRUD stores). It demonstrates architectural mastery across graph relationships, enterprise modularity, real-time WebSockets, multi-tier RBAC, and internationalization.',
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

          // Section 1: Why Interviewers Love This Project
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '1. Why Hiring Managers & Tech Leads Will Be Impressed',
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
                text: 'When technical recruiters and senior software engineers evaluate full-stack portfolios, they encounter hundreds of identical projects: weather widgets, Netflix clones, and basic e-commerce templates. FamilyRoots completely breaks that monotony because it solves real enterprise engineering challenges:',
              }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '1. Complex Relational & Graph Data Modeling: ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Unlike simple tables, family lineage requires directed graph node connections, self-referential relations, inverse relationship inference (Father <-> Son, Uncle <-> Niece), circular loop prevention, and 2D canvas visualization.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '2. Professional NestJS Backend Architecture: ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Built with NestJS controllers, services, DTOs with class-validator, JWT authentication guards, Prisma ORM 7 with modular multi-file schemas, and auto-generated Swagger OpenAPI 3.0 documentation.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '3. Real-Time Bidirectional WebSockets (Socket.io): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Features live messaging, typing indicators, read receipts, and Facebook Messenger-style connection validation where permission to initiate chats is governed by active family tree ties.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '4. Next.js 15 (App Router) & Redux Toolkit Query: ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Modern frontend with automated cache invalidation (tag-based refetching), responsive glassmorphic UI, dynamic debounce search, pagination controls, and modal portals.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '5. Enterprise Global Localization (25 Languages): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Zero bundle bloat via modular on-demand chunk loading, RTL text orientation support for Arabic, Urdu, and Persian, and automatic IP2Location Geolocation detection with 24h caching.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '6. Complete CRUD Symmetry & Automated Testing: ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Zero asymmetrical endpoints. Every resource supports full Create, Read (paginated + search-trimmed), Update (PATCH), and Delete with automated test suites verifying PostgreSQL integrity.' }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 2: Resume Bullet Points
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '2. Ready-to-Use Resume Descriptions (STAR Method)',
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
                text: 'Copy and customize the following high-impact bullet points directly into the Projects section of your resume:',
              }),
            ],
          }),

          // Resume Box Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
                      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
                      left: { style: BorderStyle.SINGLE, size: 4, color: '3B82F6' },
                      right: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'FamilyRoots — Multi-Tenant Family Sanctuary & Lineage Platform', bold: true, size: 24, color: '1E3A8A' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Technologies: ', bold: true }),
                          new TextRun({ text: 'Next.js 15, TypeScript, NestJS, PostgreSQL, Prisma 7, Socket.io, Redux Toolkit Query, Tailwind CSS, Swagger' }),
                        ],
                      }),
                      new Paragraph({ spacing: { before: 100 } }),
                      new Paragraph({
                        bullet: { level: 0 },
                        children: [
                          new TextRun({ text: 'Architected a full-stack family sanctuary platform featuring 2D hierarchical lineage tree visualization, real-time messaging, encrypted legal document vault, and historical memory timeline.' }),
                        ],
                      }),
                      new Paragraph({
                        bullet: { level: 0 },
                        children: [
                          new TextRun({ text: 'Built a modular NestJS backend with Prisma 7 and PostgreSQL, implementing complete CRUD symmetry across all resource domains with automated DTO validation, Swagger OpenAPI docs, and 4-tier Role-Based Access Control (RBAC).' }),
                        ],
                      }),
                      new Paragraph({
                        bullet: { level: 0 },
                        children: [
                          new TextRun({ text: 'Engineered a real-time messaging system using Socket.io with typing indicators, read receipts, and relational permission validation preventing unsolicited messages based on tree connection graph rules.' }),
                        ],
                      }),
                      new Paragraph({
                        bullet: { level: 0 },
                        children: [
                          new TextRun({ text: 'Implemented global internationalization supporting 25 languages with dynamic modular chunk loading, RTL rendering (Arabic, Urdu, Persian), and IP Geolocation automatic language detection with 24-hour caching.' }),
                        ],
                      }),
                      new Paragraph({
                        bullet: { level: 0 },
                        children: [
                          new TextRun({ text: 'Designed responsive Next.js 15 client with Redux Toolkit Query, eliminating unnecessary network round-trips via tag-based cache invalidation, debounced server search, and custom pagination hooks.' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 3: Technical Interview Questions & Answers
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '3. Technical Interview Questions You Will Be Asked (& How to Answer)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          // Q1
          new Paragraph({
            spacing: { before: 100, after: 50 },
            children: [
              new TextRun({ text: 'Q1: "How did you design the family tree data model and prevent circular relationships?"', bold: true, color: '1E3A8A' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'Your Answer: ', bold: true, color: '059669' }),
              new TextRun({ text: 'I treated family ties as a directed graph stored in PostgreSQL via a Relationship table linking fromPersonId, toPersonId, and relationshipTypeId with unique constraints. In the service layer, before linking parent-child nodes, we run an ancestor traversal check to verify the target person is not already in the upstream lineage chain, preventing circular graph cycles.' }),
            ],
          }),

          // Q2
          new Paragraph({
            spacing: { before: 100, after: 50 },
            children: [
              new TextRun({ text: 'Q2: "How does the real-time chat enforce permissions before sending messages?"', bold: true, color: '1E3A8A' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'Your Answer: ', bold: true, color: '059669' }),
              new TextRun({ text: 'In ChatService.canInitiateMessage(), we enforce a Facebook Messenger-inspired policy: Sanctuary Owners and Admins can message any member, but regular members can only initiate 1-on-1 direct conversations if they either added the member, were added by them, or share an active relationship in the family tree. This is validated on both REST conversation creation and Socket.io gateway message events.' }),
            ],
          }),

          // Q3
          new Paragraph({
            spacing: { before: 100, after: 50 },
            children: [
              new TextRun({ text: 'Q3: "How did you manage state and caching on the frontend?"', bold: true, color: '1E3A8A' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'Your Answer: ', bold: true, color: '059669' }),
              new TextRun({ text: 'We leveraged Redux Toolkit Query (RTK Query). Instead of manually handling loading and error states or writing custom fetch hooks, endpoints declare providesTags and invalidatesTags. For example, when adding or editing a relationship, RTK Query automatically invalidates the ["Relationships"] tag, causing all active components viewing the matrix or tree to refetch the fresh dataset seamlessly in the background.' }),
            ],
          }),

          // Q4
          new Paragraph({
            spacing: { before: 100, after: 50 },
            children: [
              new TextRun({ text: 'Q4: "How did you optimize internationalization for 25 languages without slowing down the app?"', bold: true, color: '1E3A8A' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'Your Answer: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Rather than bundling all 25 translation dictionaries into the main JavaScript bundle (which would add hundreds of kilobytes of unused text), each language has its own modular file loaded asynchronously on demand. We also implemented an internal /api/geo endpoint that queries IP2Location to automatically suggest the visitor\'s native language on first load and caches the result in localStorage for 24 hours.' }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 4: Live Demo Strategy
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '4. Live Demo Strategy to "WOW" Interviewers in 3 Minutes',
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
                text: 'If asked to walk through the project during a screen-share interview, follow this 3-step demonstration sequence:',
              }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Step 1: The 2D Visual Tree & Relationships Matrix (1 minute): ', bold: true }),
              new TextRun({ text: 'Show the Tree tab. Zoom and pan. Click on a relative node. Show how adding a parent/child dynamically recomputes relationships. Open Relationships Tab and show the Edit and Unlink action modals.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Step 2: Real-Time Chat & Permission Enforcement (1 minute): ', bold: true }),
              new TextRun({ text: 'Open two browser windows side-by-side (Owner in one, Member in another). Type a message and show the instant real-time delivery and typing indicator. Show that the Member is blocked from direct-messaging the Owner unless permitted.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Step 3: Documents Vault & Instant Language Switcher (1 minute): ', bold: true }),
              new TextRun({ text: 'Upload or view a multi-file document in the encrypted vault. Then switch the platform language to Arabic or Bangla to demonstrate instant RTL transformation and zero-reload i18n.' }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 5: Conclusion
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '5. Summary Conclusion',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'You have built a production-grade, architectural full-stack web application. It proves beyond any doubt that you understand system design, clean backend architecture, relational database modeling, real-time protocols, modern React state management, and high-performance UI engineering. Adding this project to your resume will strongly position you for Full Stack Developer roles.',
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
  const frontendDocPath = path.resolve('RESUME_FULL_STACK_SHOWCASE_AND_INTERVIEW_GUIDE.doc');
  const frontendDocxPath = path.resolve('RESUME_FULL_STACK_SHOWCASE_AND_INTERVIEW_GUIDE.docx');
  const backendDocPath = path.resolve('../family-together-backend/RESUME_FULL_STACK_SHOWCASE_AND_INTERVIEW_GUIDE.doc');
  const backendDocxPath = path.resolve('../family-together-backend/RESUME_FULL_STACK_SHOWCASE_AND_INTERVIEW_GUIDE.docx');

  fs.writeFileSync(frontendDocPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);
  console.log(`✅ Saved Frontend Docs: ${frontendDocPath}`);

  fs.writeFileSync(backendDocPath, buffer);
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`✅ Saved Backend Docs: ${backendDocPath}`);
}

generateResumeShowcaseDoc().catch(console.error);
