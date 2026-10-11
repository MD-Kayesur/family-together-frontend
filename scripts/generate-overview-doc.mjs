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
  BorderStyle,
  AlignmentType,
  ShadingType,
} from 'docx';

async function generateOverviewDocument() {
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
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: '🌲 FamilyRoots Platform - Comprehensive Architecture & System Overview',
                bold: true,
                size: 36,
                color: '1E3A8A',
              }),
            ],
          }),

          // Subtitle / Metadata
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'End-to-End System Deep-Dive: Backend (NestJS 11 + Prisma 7 + PostgreSQL + Redis) & Frontend (Next.js 16 + React 19 + RTK Query)',
                italics: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),

          // Divider
          new Paragraph({
            text: '_________________________________________________________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            style: 'default',
          }),

          // 1. Executive Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '1. Executive Summary & Product Vision',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'FamilyRoots ("Family Together") is an enterprise-grade, privacy-first, multi-generational digital sanctuary and lineage management platform. Designed to bridge historical heritage with modern interactive experiences, the platform enables families to preserve their ancestry, map biological and legal kinships, secure milestone memories (stories and high-resolution photo galleries), organize events with RSVP tracking, and manage private legal documents in an encrypted vault.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: 'The solution is split into two specialized decoupled codebases: ',
              }),
              new TextRun({
                text: 'family-together-backend',
                bold: true,
              }),
              new TextRun({
                text: ' (a robust NestJS REST API micro-monolith with multi-schema PostgreSQL persistence and Redis session cache) and ',
              }),
              new TextRun({
                text: 'family-together-frontend',
                bold: true,
              }),
              new TextRun({
                text: ' (a bleeding-edge Next.js 16 App Router application with React 19, Redux Toolkit Query cache, and custom 2D canvas lineage renderers).',
              }),
            ],
          }),

          // 2. High-Level Architecture
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. High-Level Architecture & Ecosystem Interaction',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'The architecture follows a strictly decoupled client-server model secured by HTTP-only cookies and Bearer JWT authorization tokens:',
              }),
            ],
          }),

          // Architecture Comparison Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Layer / Component', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Technology / Libraries', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Primary Responsibilities', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Frontend Web App', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Next.js 16 (App Router), React 19, TailwindCSS v4, Redux Toolkit, RTK Query, Lucide Icons' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Interactive UI, canvas tree rendering, route guard redirects, responsive layouts, optimistic UI cache' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Backend REST API', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'NestJS 11, Express, TypeScript, Passport JWT, Nodemailer, Swagger OpenAPI' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Auth & session lifecycle, RBAC enforcement, business domain services, email notifications, 100MB file payloads' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Database Layer', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'PostgreSQL, Prisma ORM 7 (@prisma/adapter-pg, multi-schema modular files)' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Relational data persistence, lineage graph mapping, cascade constraints, indexed person deduplication' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'In-Memory Cache & Store', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Redis (ioredis)' })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Token blacklist, active session tracking, OTP email codes, high-throughput caching' })],
                  }),
                ],
              }),
            ],
          }),

          // 3. Backend Deep Dive
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: '3. Backend Deep Dive (family-together-backend)',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: '3.1 Modular Prisma 7 Multi-Schema Architecture', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'The backend database is structured into 5 cohesive Prisma domain schema files located in prisma/schema/ instead of a single unwieldy file:',
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'base.prisma: ', bold: true }),
              new TextRun({ text: 'Core identity models (User, Session, PasswordResetToken, EmailVerificationToken). Handles credentials, status (ACTIVE, PENDING, SUSPENDED), email verification timestamps, and active sessions.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'family.prisma: ', bold: true }),
              new TextRun({ text: 'Sanctuary container (Family) and membership junction (FamilyMember). Establishes family roles (OWNER, ADMIN, MEMBER, VIEWER) and ownership audit fields.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'person.prisma: ', bold: true }),
              new TextRun({ text: 'Decoupled lineage profiles (Person). Decoupled from user accounts so historical ancestors who will never sign in can still exist in the tree. Includes PersonClaim and PersonAlias for nicknames.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'relationship.prisma: ', bold: true }),
              new TextRun({ text: 'Bidirectional lineage engine (Relationship, RelationshipType). Connects fromPersonId and toPersonId with categorization (BIOLOGICAL, MARITAL, ADOPTIVE) and inverse relationship traversal.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'vault.prisma: ', bold: true }),
              new TextRun({ text: 'Media and assets domain (Memory, Event, Document, Invitation). Supports multi-image carousels, legal file attachments up to 100MB, RSVP event calendars, and invite status tracking.' }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 250, after: 100 },
            children: [new TextRun({ text: '3.2 Modular Domain Organization & Sub-Services', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'The backend separates controller, DTO, and business logic cleanly across sub-domains under src/family/ and src/auth/:',
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Members Service (members/): ', bold: true }),
              new TextRun({ text: 'Handles relative creation, updates, and deduplication. Includes search endpoint (/family/members/search) to link existing Person profiles without creating duplicates. When an email is supplied, automatically provisions an active user account and triggers a Nodemailer invitation.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Memories Service (memories/): ', bold: true }),
              new TextRun({ text: 'Manages multi-photo story cards, tagging relatives, and privacy filtering. Supports mediaUrls array with backward compatibility for legacy mediaUrl.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Relationships Service (relationships/): ', bold: true }),
              new TextRun({ text: 'Validates and binds tree connections, ensuring parent-child, spouse, and sibling links maintain relational integrity.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Events Service (events/): ', bold: true }),
              new TextRun({ text: 'CRUD operations for family gatherings, reunions, and memorial dates, complete with pagination and search filtering.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Documents Service (documents/): ', bold: true }),
              new TextRun({ text: 'Secure archive vault supporting multi-file attachments (fileUrls / files) with payload body parsing configured up to 100MB in main.ts.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Invitations Service (invitations/): ', bold: true }),
              new TextRun({ text: 'Magic links, RSVP statuses, and member onboarding token management.' }),
            ],
          }),

          // 4. Frontend Deep Dive
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: '4. Frontend Deep Dive (family-together-frontend)',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'The frontend is powered by Next.js 16 (App Router) and React 19, delivering exceptional speed, zero-flicker server navigation, and rich client-side animations. The UI uses the "Kinship Modern" design system with TailwindCSS v4.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: '4.1 Dashboard Routing & Role Redirection Architecture', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'The application resolves user authorization upon login and routes users dynamically:',
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '/owner-dashboard: ', bold: true }),
              new TextRun({ text: 'Sanctuary creators hub. Includes visual family tree, members directory with deduplication, relationship builder, multi-photo memories carousel, event calendar, document vault, invitations, activity heatmap, and settings.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '/admin-dashboard: ', bold: true }),
              new TextRun({ text: 'Platform administration hub for ADMIN and SUPER_ADMIN. Offers system diagnostics, node health metrics, user account moderation, analytics, activity audit logs, and super-admin master controls.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '/user-dashboard: ', bold: true }),
              new TextRun({ text: 'Member & Viewer sanctuary portal. Provides read/write access to family milestones, personal branch tree exploration, memory uploads, and personal profile security.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '/ (Landing Page): ', bold: true }),
              new TextRun({ text: 'Public showcase featuring interactive family tree preview canvas (LandingFamilyTreeCanvas.tsx), live demo nodes, product benefits, interactive FAQs, and pricing tiers.' }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 250, after: 100 },
            children: [new TextRun({ text: '4.2 Interactive Family Tree Visual Canvas Engine', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'A highlight of the platform is the custom HTML5 Canvas & SVG tree renderer (InteractiveFamilyTreeCanvas.tsx & LandingFamilyTreeCanvas.tsx). Features include:',
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Infinite pan and zoom with fluid physics and coordinate clamping.' })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Automatic generational tiering (Great-Grandparents -> Grandparents -> Parents -> Children -> Grandchildren).' })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Interactive relative cards displaying photo badges, life dates, occupations, and relation tags.' })],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: 'Dynamic spouse and child branch lines rendered with Bézier curved connectors.' })],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 250, after: 100 },
            children: [new TextRun({ text: '4.3 Redux Toolkit & RTK Query Architecture', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'State management and server synchronization are coordinated using Redux Toolkit and RTK Query:',
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'familyApi (src/redux/api/familyApi.ts): ', bold: true }),
              new TextRun({ text: 'Comprehensive API slice managing sanctuary data, member queries, memories, events, relationships, documents, and invitations with fine-grained tag invalidation (Sanctuary, Member, Memory, Event, Document, Invitation).' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'authApi & authSlice: ', bold: true }),
              new TextRun({ text: 'Handles login, token caching, logout session termination, and user role persistence across page refreshes.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'adminApi: ', bold: true }),
              new TextRun({ text: 'Provides real-time system metrics, throughput counters, user suspension mutations, and audit log polling.' }),
            ],
          }),

          // 5. Security & Isolation
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: '5. Privacy, Security & Data Sovereignty Principles',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Strict Sanctuary Isolation: ', bold: true }),
              new TextRun({ text: 'Queries are scoped by familyId and userId. Members of one family cannot view or query assets of another family.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Dual Token Auth Pipeline: ', bold: true }),
              new TextRun({ text: 'Short-lived access tokens backed by rotating refresh tokens stored with bcrypt hashing in PostgreSQL and instant revocation capability in Redis.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Comprehensive Audit Logs: ', bold: true }),
              new TextRun({ text: 'Every addition, relation update, and invitation dispatch is tracked with timestamped author identities and rendered via interactive GitHub-style heatmaps.' }),
            ],
          }),

          // 6. Summary Comparison Table
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: '6. Summary Comparison Matrix',
                bold: true,
                size: 28,
                color: '1E3A8A',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Feature Dimension', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Backend (NestJS API)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Frontend (Next.js 16)', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Port / Local URL' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'http://localhost:8000 (or 5000 / 3000)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'http://localhost:3000' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'API Documentation' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Swagger UI at /api/docs and /docs' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Integrated RTK Query Client' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Primary Workflows' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'JWT Auth, RBAC Guards, Prisma 7 Multi-Schema Queries, Nodemailer Notifications' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Canvas Tree Engine, Owner/Admin/User Dashboards, Media Vault Slider, Add Member Deduplication' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Payload Limits' })] }),
                  new TableCell({ children: [new Paragraph({ text: '100MB body limit for bulk uploads' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Chunked multi-file attachment handler' })] }),
                ],
              }),
            ],
          }),

          // Footer note
          new Paragraph({
            spacing: { before: 400 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Generated by Antigravity IDE • FamilyRoots Engineering Architecture System',
                italics: true,
                size: 18,
                color: '94A3B8',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  // Write .docx to both projects
  const backendDocxPath = path.resolve('d:/Projects/family-together-backend/FamilyRoots_Platform_Comprehensive_Overview.docx');
  const frontendDocxPath = path.resolve('d:/Projects/family-together-frontend/FamilyRoots_Platform_Comprehensive_Overview.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);
  console.log('Successfully wrote .docx files to both projects!');

  // Also write formatted .doc files (Word-compatible formatted document) to both projects
  const markdownContent = `# 🌲 FamilyRoots Platform - Comprehensive Architecture & System Overview

> **System Name:** FamilyRoots Platform ("Family Together")  
> **Backend Repository:** \`family-together-backend\` (NestJS 11 + Prisma 7 + PostgreSQL + Redis)  
> **Frontend Repository:** \`family-together-frontend\` (Next.js 16 + React 19 + RTK Query + TailwindCSS v4)  
> **Status:** Production-Ready Multi-Role Family Sanctuary & Administrative Platform  

---

## 📌 1. Executive Summary & Product Vision

**FamilyRoots ("Family Together")** is an enterprise-grade, privacy-first, multi-generational digital sanctuary and lineage management platform. Designed to bridge historical heritage with modern interactive experiences, the platform enables families to preserve their ancestry, map biological and legal kinships, secure milestone memories (stories and high-resolution photo galleries), organize events with RSVP tracking, and manage private legal documents in an encrypted vault.

The solution is decoupled into two specialized codebases:
1. **\`family-together-backend\`**: A high-performance NestJS REST API micro-monolith with multi-schema PostgreSQL persistence and Redis session cache.
2. **\`family-together-frontend\`**: A modern Next.js 16 App Router application with React 19, Redux Toolkit Query cache, and custom 2D canvas lineage renderers.

---

## 🏗️ 2. High-Level Architecture & Ecosystem Interaction

\`\`\`
                               ┌──────────────────────────────────────────────┐
                               │           Next.js 16 (App Router)            │
                               │      React 19 + TypeScript + Tailwind v4     │
                               │        Redux Toolkit (RTK Query Cache)       │
                               │  Interactive Family Tree Canvas (HTML5/SVG)  │
                               └──────────────────────┬───────────────────────┘
                                                      │ REST APIs (Bearer JWT / Cookies)
                               ┌──────────────────────▼───────────────────────┐
                               │              NestJS 11 Backend               │
                               │  Express + Passport JWT + Nodemailer Emails  │
                               │       Swagger OpenAPI at /api/docs           │
                               └──────────┬───────────────────────────┬───────┘
                                          │                           │
                        ┌─────────────────▼─────────┐      ┌──────────▼──────────┐
                        │   PostgreSQL Database     │      │    Redis Server     │
                        │ Prisma ORM 7 Multi-Schema │      │  Token Blacklist &  │
                        │ (base, family, person,    │      │   Session Cache     │
                        │  relationship, vault)     │      └─────────────────────┘
                        └───────────────────────────┘
\`\`\`

### Technology Matrix:
| Layer / Component | Technology & Libraries | Primary Responsibilities |
| :--- | :--- | :--- |
| **Frontend Web App** | Next.js 16 (App Router), React 19, TailwindCSS v4, Redux Toolkit, RTK Query, Lucide Icons | Interactive UI, canvas tree rendering, route guard redirects, responsive layouts, optimistic UI cache |
| **Backend REST API** | NestJS 11, Express, TypeScript, Passport JWT, Nodemailer, Swagger OpenAPI | Auth & session lifecycle, RBAC enforcement, business domain services, email notifications, 100MB file payloads |
| **Database Layer** | PostgreSQL, Prisma ORM 7 (\`@prisma/adapter-pg\`, multi-schema modular files) | Relational data persistence, lineage graph mapping, cascade constraints, indexed person deduplication |
| **In-Memory Cache** | Redis (\`ioredis\`) | Token blacklist, active session tracking, OTP email codes, high-throughput caching |

---

## ⚙️ 3. Backend Deep Dive (\`family-together-backend\`)

### 3.1 Modular Prisma 7 Multi-Schema Architecture
Located in \`prisma/schema/\`, the database schema is divided into 5 modular domain files:
* **\`base.prisma\`**: User credentials, role enum (\`SUPER_ADMIN\`, \`ADMIN\`, \`OWNER\`, \`MEMBER\`, \`VIEWER\`, \`USER\`), status (\`ACTIVE\`, \`PENDING\`, \`SUSPENDED\`), session tokens, password reset tokens, and email verification tokens.
* **\`family.prisma\`**: The \`Family\` entity and \`FamilyMember\` junction linking persons to families with roles (\`OWNER\`, \`ADMIN\`, \`MEMBER\`, \`VIEWER\`).
* **\`person.prisma\`**: The decoupled \`Person\` model containing ancestry records (birth date, death date, alive status, birthplace, occupation, bio, photo). Includes \`PersonClaim\` for claiming unassigned nodes and \`PersonAlias\` for nicknames.
* **\`relationship.prisma\`**: The \`Relationship\` and \`RelationshipType\` models connecting \`fromPersonId\` and \`toPersonId\` with categories (\`BIOLOGICAL\`, \`MARITAL\`, \`ADOPTIVE\`) and inverse codes.
* **\`vault.prisma\`**: Media and assets: \`Memory\` (supports multiple photo URLs), \`Event\` (family calendar & RSVPs), \`Document\` (legal files with 100MB payload limit), and \`Invitation\` (magic invite tracking).

### 3.2 Modular Domain Sub-Services (\`src/family/\`)
* **Members (\`members/\`)**: Relative CRUD, real-time search & deduplication (\`/family/members/search?q=...\`), profile linking without duplicate creation, and automatic user account provisioning with email notification.
* **Memories (\`memories/\`)**: Multi-photo memory albums (\`mediaUrls\`, \`photoCount\`), tagging, and privacy isolation.
* **Relationships (\`relationships/\`)**: Kinship validation, parent-child, spouse, sibling linking.
* **Events (\`events/\`)**: Scheduling, calendar coordination, pagination, and keyword search.
* **Documents (\`documents/\`)**: Encrypted document vault supporting multi-file attachments and 100MB body limits.
* **Invitations (\`invitations/\`)**: Join requests, magic token generation, and role granting.

### 3.3 Swagger Documentation & Security
* Swagger OpenAPI live at \`/api/docs\` and \`/docs\`.
* RBAC Guards enforcing permissions across endpoints.
* Dual token pipeline: Short-lived access JWT + Refresh token with Redis invalidation.

---

## 🎨 4. Frontend Deep Dive (\`family-together-frontend\`)

### 4.1 Dashboard Routing & Role-Based Redirection
* **\`/\` (Landing Page)**: Hero section, interactive preview family tree canvas (\`LandingFamilyTreeCanvas.tsx\`), feature demonstrations, testimonials, interactive FAQ, pricing table.
* **\`/owner-dashboard\`**: Sanctuary Manager:
  * \`/owner-dashboard\`: Sanctuary stats, member count, pending invites, memory counts, recent activity.
  * \`/owner-dashboard/tree\`: Interactive canvas-based dynamic family tree (\`InteractiveFamilyTreeCanvas.tsx\`) with pan, zoom, generation layers.
  * \`/owner-dashboard/members\`: Member directory, live search & deduplication preview modal.
  * \`/owner-dashboard/relationships\`: Kinship relationship builder and matrix.
  * \`/owner-dashboard/memories\`: Vault gallery with multi-image carousels and full-screen lightbox.
  * \`/owner-dashboard/events\`: Family calendar, RSVP tracker, pagination & search filters.
  * \`/owner-dashboard/documents\`: Categorized legal & archive document vault.
  * \`/owner-dashboard/invitations\`: Magic link invitation tracker.
  * \`/owner-dashboard/activity\`: Sanctuary activity audit log with GitHub-style green contribution heatmap.
  * \`/owner-dashboard/settings\` & \`/owner-dashboard/profile\`: Sanctuary branding and account preferences.
* **\`/admin-dashboard\`**: Platform Administration:
  * Overview: System metrics, node health, throughput counters.
  * \`/admin-dashboard/users\`: Cross-tenant user moderation, status toggling, role assignment.
  * \`/admin-dashboard/analytics\`: Growth charts, conversion metrics, storage usage.
  * \`/admin-dashboard/activity\`: Global activity audit log.
  * \`/admin-dashboard/super\`: Super Admin controls, database backup triggers, master keys.
* **\`/user-dashboard\`**: Member & Viewer Portal:
  * Personalized branch view, memory sharing feed, family event calendar, and profile credentials.

### 4.2 State Management with Redux Toolkit & RTK Query
* **\`familyApi\`**: Real-time caching, query polling, and optimistic tag invalidation for sanctuary, members, memories, events, relationships, documents, and invitations.
* **\`authApi\` & \`authSlice\`**: JWT token storage, user session sync, and automatic redirect handling.
* **\`adminApi\`**: Administrative metrics and audit feeds.

---

## 🛡️ 5. Security, Privacy & Data Sovereignty Guarantees

1. **Strict Family Isolation**: All database queries are filtered by \`familyId\` and authenticated user sessions to prevent data leakage between families.
2. **Payload Protection**: Express body parsers configured up to 100MB for high-resolution historical documents, safeguarded by CORS and cookie security headers.
3. **Decoupled Ancestor Records**: Deceased or non-digital ancestors exist as independent \`Person\` nodes without requiring active user accounts.

---

## 📊 6. Summary Comparison Matrix

| Feature Dimension | Backend (\`family-together-backend\`) | Frontend (\`family-together-frontend\`) |
| :--- | :--- | :--- |
| **Framework** | NestJS v11 + Express + TypeScript | Next.js v16 (App Router) + React 19 + TypeScript |
| **Port / Default URL** | http://localhost:8000 (or 5000 / 3000) | http://localhost:3000 |
| **Persistence / Cache** | PostgreSQL (Prisma 7 Multi-Schema) + Redis | Redux Toolkit Query (In-Memory Client Cache) |
| **Documentation** | Swagger OpenAPI at \`/api/docs\` & \`/docs\` | Full inline architectural guides |
| **Special Features** | Person deduplication, auto-credential provisioning, 100MB body limits | Interactive 2D Canvas tree, GitHub activity heatmap, photo lightbox |

---
*Generated by Antigravity IDE • FamilyRoots Engineering Architecture System*
`;

  const backendDocPath = path.resolve('d:/Projects/family-together-backend/FamilyRoots_Platform_Comprehensive_Overview.doc');
  const frontendDocPath = path.resolve('d:/Projects/family-together-frontend/FamilyRoots_Platform_Comprehensive_Overview.doc');
  fs.writeFileSync(backendDocPath, markdownContent, 'utf-8');
  fs.writeFileSync(frontendDocPath, markdownContent, 'utf-8');
  console.log('Successfully wrote .doc files to both projects!');
}

generateOverviewDocument().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
