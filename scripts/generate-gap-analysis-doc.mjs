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

async function generateGapAnalysisDocument() {
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
                text: '🔍 Backend APIs Gap Analysis & Complete Frontend Integration Architecture',
                bold: true,
                size: 34,
                color: '1E3A8A',
              }),
            ],
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 350 },
            children: [
              new TextRun({
                text: 'Comprehensive Audit of Backend Endpoints, Gap Identification, and Complete Frontend Integration (RTK Query & UI Surfaces)',
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
          }),

          // 1. Executive Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '1. Executive Summary & Objective',
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
                text: 'A full-stack inspection of both the backend (family-together-backend) and frontend (family-together-frontend) repositories was executed to identify every backend REST API created, verify its integration status in the frontend, identify gaps where endpoints were defined on the server but missing or disconnected on the client, and implement the necessary RTK Query endpoints and frontend UI surfaces to achieve 100% full-stack parity.',
              }),
            ],
          }),

          // 2. Comprehensive Backend Endpoints Catalog & Status
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. Complete Backend APIs Inventory & Frontend Status Matrix',
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
                text: 'The table below details all 51 backend API endpoints across 10 functional controller domains and their integration state in the Next.js frontend application:',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Domain / Controller', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'HTTP Method & Route', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Initial Status', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Resolved Integration', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              // Auth Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/signup' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'signUp in authApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/signin' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'signIn in authApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/refresh' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GAP (Missing in RTK)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Implemented: useRefreshTokenMutation' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/logout' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'logout in authApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/logout-all' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GAP (Missing in RTK & UI)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Implemented: useLogoutAllMutation in SettingsTab UI' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /auth/me' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getProfile in authApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /auth/sessions' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GAP (Missing in RTK & UI)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Implemented: useGetSessionsQuery in SettingsTab UI' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/verify-email' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'verifyEmail in authApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/resend-verification' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'resendVerification in authApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/forgot-password' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'forgotPassword in authApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/reset-password' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GAP (Missing in RTK & No Page)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Implemented: useResetPasswordMutation + /reset-password page' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /auth/change-password' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'changePassword in authApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Auth' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'PATCH /auth/profile' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'updateProfile in authApi.ts' })] }),
                ],
              }),

              // Users Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Users' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /users' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'createUser in adminApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Users' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /users' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getUsersList in adminApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Users' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /users/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GAP (Missing in RTK)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Implemented: useGetUserByIdQuery in adminApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Users' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'PATCH /users/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'updateUserRole in adminApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Users' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'DELETE /users/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'deleteUser in adminApi.ts' })] }),
                ],
              }),

              // Family Sanctuary Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Sanctuary' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/sanctuary' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getSanctuary in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Sanctuary' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'PATCH /family/update' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'updateFamilyDetails in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Sanctuary' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/activity-logs' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getActivityLogs in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Sanctuary' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'PATCH /family/settings' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'updateSanctuarySettings in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Sanctuary' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/admin/stats' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getAdminStats in adminApi.ts' })] }),
                ],
              }),

              // Members Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getMembers in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/members/search' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'searchMembers in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /family/members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'addMember in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'PATCH /family/members/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'updateMember in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'DELETE /family/members/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'deleteMember in familyApi.ts' })] }),
                ],
              }),

              // Memories Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Memories' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/memories' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getMemories in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Memories' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/memories/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getMemoryById in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Memories' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /family/memories' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'addMemory in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Memories' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'PATCH /family/memories/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'updateMemory in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Memories' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'DELETE /family/memories/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'deleteMemory in familyApi.ts' })] }),
                ],
              }),

              // Events Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Events' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/events' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getEvents in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Events' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/events/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getEventById in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Events' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /family/events' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'addEvent in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Events' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'PATCH /family/events/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'updateEvent in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Events' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'DELETE /family/events/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'deleteEvent in familyApi.ts' })] }),
                ],
              }),

              // Relationships Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Relationships' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/relationships' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getRelationships in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Relationships' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /family/relationships' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'addRelationship in familyApi.ts' })] }),
                ],
              }),

              // Documents Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Documents' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/documents' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getDocuments in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Documents' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /family/documents' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'addDocument in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Documents' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /family/documents/multiple' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'addMultipleDocuments in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Documents' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'DELETE /family/documents/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'deleteDocument in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Documents' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'DELETE /family/documents' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'deleteAllDocuments in familyApi.ts' })] }),
                ],
              }),

              // Invitations Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Invitations' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/invitations' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getInvitations in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Invitations' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /family/invitations/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'getInvitationById in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Invitations' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'POST /family/invitations' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'addInvitation in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Invitations' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'PATCH /family/invitations/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'updateInvitationStatus in familyApi.ts' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Invitations' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'DELETE /family/invitations/:id' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Connected' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'deleteInvitation in familyApi.ts' })] }),
                ],
              }),

              // Health Domain
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Health' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GET /health' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GAP (Mocked in Super Admin)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Implemented: useGetSystemHealthQuery in SuperAdminDashboard' })] }),
                ],
              }),
            ],
          }),

          // 3. Detailed Implementations Made
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: '3. Detailed Implementations & Architectural Solutions',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: '3.1 Active Sessions & Multi-Device Logout (GET /auth/sessions & POST /auth/logout-all)', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Backend capability in src/auth/services/session.service.ts tracks every device token session in PostgreSQL with Redis revoking. We added UserSessionRecord interface, useGetSessionsQuery, and useLogoutAllMutation in src/redux/api/authApi.ts. In src/components/dashboard/tabs/SettingsTab.tsx, we integrated an Active Sessions card displaying user agents, IP addresses, expiration times, current session indicators, and a one-click Log Out All Other Devices action.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: '3.2 Dedicated Password Reset Portal (POST /auth/reset-password)', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'While forgotPassword was present, resetPassword mutation and its dedicated page were missing. We added ResetPasswordRequest and useResetPasswordMutation to authApi.ts and created src/app/reset-password/page.tsx with token extraction from URL searchParams, password validation, and direct sign-in redirection upon success.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: '3.3 Live Backend Health Telemetry (GET /health)', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Super Admin telemetry previously displayed mock uptime and latency statistics. We added SystemHealthResponse and useGetSystemHealthQuery in src/redux/api/adminApi.ts and wired it into src/app/admin-dashboard/super/page.tsx with 30-second live polling, operational status badge, service identifier, and manual refresh triggers.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: '3.4 User Lookup by ID & Refresh Token Endpoints', bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Added useGetUserByIdQuery (GET /users/:id) to adminApi.ts and useRefreshTokenMutation (POST /auth/refresh) to authApi.ts to ensure all backend administrative and authentication endpoints are accessible to client modules.',
              }),
            ],
          }),

          // 4. Verification & Testing
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: '4. Verification & TypeScript Typecheck Results',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'All new endpoints, types, and component hooks compile cleanly under Next.js 16 and TypeScript with strict type checking. RTK Query tag invalidations guarantee automatic cache synchronization across the user session.',
              }),
            ],
          }),

          // Footer
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
  const backendDocxPath = path.resolve('d:/Projects/family-together-backend/Backend_APIs_Gap_Analysis_And_Frontend_Integration_Guide.docx');
  const frontendDocxPath = path.resolve('d:/Projects/family-together-frontend/Backend_APIs_Gap_Analysis_And_Frontend_Integration_Guide.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);
  console.log('Successfully wrote gap analysis .docx files to both projects!');

  // Also write formatted .doc files
  const markdownContent = `# 🔍 Backend APIs Gap Analysis & Complete Frontend Integration Architecture

> **Platform:** FamilyRoots ("Family Together")  
> **Backend Repository:** \`family-together-backend\` (NestJS 11 + Prisma 7 + PostgreSQL + Redis)  
> **Frontend Repository:** \`family-together-frontend\` (Next.js 16 + React 19 + RTK Query)  
> **Audit Date:** October 2026  
> **Status:** 100% Full-Stack API Integration Parity Achieved  

---

## 📌 1. Executive Summary & Objective

A complete end-to-end audit was conducted between **\`family-together-backend\`** and **\`family-together-frontend\`** to catalog every REST API endpoint created in the backend, assess its integration in the frontend client, identify missing endpoints and UI disconnects, and implement the necessary RTK Query mutations/queries and user interface surfaces.

All identified gaps have now been implemented, connected, and verified.

---

## 📊 2. Complete Backend APIs Inventory & Resolution Matrix

| Controller Domain | HTTP Method & Route | Initial Frontend State | Resolution & Integrated Frontend Code |
| :--- | :--- | :--- | :--- |
| **Auth** | \`POST /auth/signup\` | ✅ Integrated | \`useSignUpMutation\` in \`authApi.ts\` & \`/signup\` |
| **Auth** | \`POST /auth/signin\` | ✅ Integrated | \`useSignInMutation\` in \`authApi.ts\` & \`/signin\` |
| **Auth** | \`POST /auth/refresh\` | ⚠️ **GAP: Missing in RTK** | ✅ **Implemented \`useRefreshTokenMutation\` in \`authApi.ts\`** |
| **Auth** | \`POST /auth/logout\` | ✅ Integrated | \`useLogoutMutation\` in \`authApi.ts\` |
| **Auth** | \`POST /auth/logout-all\` | ❌ **GAP: Missing in RTK & UI** | ✅ **Implemented \`useLogoutAllMutation\` & Active Sessions card in \`SettingsTab.tsx\`** |
| **Auth** | \`GET /auth/me\` | ✅ Integrated | \`useGetProfileQuery\` in \`authApi.ts\` |
| **Auth** | \`GET /auth/sessions\` | ❌ **GAP: Missing in RTK & UI** | ✅ **Implemented \`useGetSessionsQuery\` & Connected Devices UI in \`SettingsTab.tsx\`** |
| **Auth** | \`POST /auth/verify-email\` | ✅ Integrated | \`useVerifyEmailMutation\` in \`authApi.ts\` & Email OTP modal |
| **Auth** | \`POST /auth/resend-verification\`| ✅ Integrated | \`useResendVerificationMutation\` in \`authApi.ts\` |
| **Auth** | \`POST /auth/forgot-password\` | ✅ Integrated | \`useForgotPasswordMutation\` in \`authApi.ts\` |
| **Auth** | \`POST /auth/reset-password\` | ❌ **GAP: Missing in RTK & No Page** | ✅ **Implemented \`useResetPasswordMutation\` & new \`/reset-password\` page** |
| **Auth** | \`POST /auth/change-password\` | ✅ Integrated | \`useChangePasswordMutation\` in \`SettingsTab.tsx\` |
| **Auth** | \`PATCH /auth/profile\` | ✅ Integrated | \`useUpdateProfileMutation\` in \`SettingsTab.tsx\` |
| **Users** | \`POST /users\` | ✅ Integrated | \`useCreateUserMutation\` in \`adminApi.ts\` |
| **Users** | \`GET /users\` | ✅ Integrated | \`useGetUsersListQuery\` in \`adminApi.ts\` & \`/admin-dashboard/users\` |
| **Users** | \`GET /users/:id\` | ⚠️ **GAP: Missing in RTK** | ✅ **Implemented \`useGetUserByIdQuery\` in \`adminApi.ts\`** |
| **Users** | \`PATCH /users/:id\` | ✅ Integrated | \`useUpdateUserRoleMutation\` in \`adminApi.ts\` |
| **Users** | \`DELETE /users/:id\` | ✅ Integrated | \`useDeleteUserMutation\` in \`adminApi.ts\` |
| **Sanctuary** | \`GET /family/sanctuary\` | ✅ Integrated | \`useGetSanctuaryQuery\` in \`familyApi.ts\` |
| **Sanctuary** | \`PATCH /family/update\` | ✅ Integrated | \`useUpdateFamilyDetailsMutation\` in \`familyApi.ts\` |
| **Sanctuary** | \`GET /family/activity-logs\` | ✅ Integrated | \`useGetActivityLogsQuery\` in \`familyApi.ts\` & Activity heatmap |
| **Sanctuary** | \`PATCH /family/settings\` | ✅ Integrated | \`useUpdateSanctuarySettingsMutation\` in \`SettingsTab.tsx\` |
| **Sanctuary** | \`GET /family/admin/stats\` | ✅ Integrated | \`useGetAdminStatsQuery\` in \`adminApi.ts\` |
| **Members** | \`GET /family/members\` | ✅ Integrated | \`useGetMembersQuery\` with pagination & search in \`familyApi.ts\` |
| **Members** | \`GET /family/members/search\` | ✅ Integrated | \`useSearchMembersQuery\` for real-time deduplication |
| **Members** | \`POST /family/members\` | ✅ Integrated | \`useAddMemberMutation\` in \`AddMemberModal.tsx\` |
| **Members** | \`PATCH /family/members/:id\` | ✅ Integrated | \`useUpdateMemberMutation\` in \`familyApi.ts\` |
| **Members** | \`DELETE /family/members/:id\` | ✅ Integrated | \`useDeleteMemberMutation\` in \`familyApi.ts\` |
| **Memories** | \`GET /family/memories\` | ✅ Integrated | \`useGetMemoriesQuery\` with user privacy isolation |
| **Memories** | \`GET /family/memories/:id\` | ✅ Integrated | \`useGetMemoryByIdQuery\` in \`familyApi.ts\` |
| **Memories** | \`POST /family/memories\` | ✅ Integrated | \`useAddMemoryMutation\` (multi-photo uploads) |
| **Memories** | \`PATCH /family/memories/:id\` | ✅ Integrated | \`useUpdateMemoryMutation\` in \`familyApi.ts\` |
| **Memories** | \`DELETE /family/memories/:id\` | ✅ Integrated | \`useDeleteMemoryMutation\` in \`familyApi.ts\` |
| **Events** | \`GET /family/events\` | ✅ Integrated | \`useGetEventsQuery\` with status filtering & pagination |
| **Events** | \`GET /family/events/:id\` | ✅ Integrated | \`useGetEventByIdQuery\` in \`familyApi.ts\` |
| **Events** | \`POST /family/events\` | ✅ Integrated | \`useAddEventMutation\` in \`EventsTab.tsx\` |
| **Events** | \`PATCH /family/events/:id\` | ✅ Integrated | \`useUpdateEventMutation\` in \`familyApi.ts\` |
| **Events** | \`DELETE /family/events/:id\` | ✅ Integrated | \`useDeleteEventMutation\` in \`familyApi.ts\` |
| **Relationships** | \`GET /family/relationships\` | ✅ Integrated | \`useGetRelationshipsQuery\` in \`familyApi.ts\` |
| **Relationships** | \`POST /family/relationships\`| ✅ Integrated | \`useAddRelationshipMutation\` in \`familyApi.ts\` |
| **Documents** | \`GET /family/documents\` | ✅ Integrated | \`useGetDocumentsQuery\` with category filtering |
| **Documents** | \`POST /family/documents\` | ✅ Integrated | \`useAddDocumentMutation\` in \`DocumentsTab.tsx\` |
| **Documents** | \`POST /family/documents/multiple\`| ✅ Integrated | \`useAddMultipleDocumentsMutation\` (100MB batch payloads) |
| **Documents** | \`DELETE /family/documents/:id\` | ✅ Integrated | \`useDeleteDocumentMutation\` in \`familyApi.ts\` |
| **Documents** | \`DELETE /family/documents\` | ✅ Integrated | \`useDeleteAllDocumentsMutation\` (sanctuary archive purge) |
| **Invitations** | \`GET /family/invitations\` | ✅ Integrated | \`useGetInvitationsQuery\` in \`InvitationsTab.tsx\` |
| **Invitations** | \`GET /family/invitations/:id\`| ✅ Integrated | \`useGetInvitationByIdQuery\` in \`familyApi.ts\` |
| **Invitations** | \`POST /family/invitations\` | ✅ Integrated | \`useAddInvitationMutation\` in \`familyApi.ts\` |
| **Invitations** | \`PATCH /family/invitations/:id\`| ✅ Integrated| \`useUpdateInvitationStatusMutation\` in \`familyApi.ts\` |
| **Invitations** | \`DELETE /family/invitations/:id\`| ✅ Integrated| \`useDeleteInvitationMutation\` in \`familyApi.ts\` |
| **Health** | \`GET /health\` | ⚠️ **GAP: Mocked Telemetry** | ✅ **Implemented \`useGetSystemHealthQuery\` & wired to Super Admin Dashboard** |

---

## 🛠️ 3. Detailed Implementations Made

### 1. Active Device Sessions & Multi-Device Logout (\`GET /auth/sessions\` & \`POST /auth/logout-all\`)
* **Endpoint Wiring:** Added \`getSessions\` query and \`logoutAll\` mutation to [\`src/redux/api/authApi.ts\`](file:///d:/Projects/family-together-frontend/src/redux/api/authApi.ts).
* **UI Integration:** Integrated an **Active Sessions & Device Management** card in [\`src/components/dashboard/tabs/SettingsTab.tsx\`](file:///d:/Projects/family-together-frontend/src/components/dashboard/tabs/SettingsTab.tsx) under the Security tab. Shows authenticated browser sessions, IP addresses, user-agent details, expiration dates, and a **"Log Out All Other Devices"** trigger that terminates all sessions across Redis and PostgreSQL.

### 2. Dedicated Password Reset Portal (\`POST /auth/reset-password\`)
* **Endpoint Wiring:** Added \`resetPassword\` mutation to [\`src/redux/api/authApi.ts\`](file:///d:/Projects/family-together-frontend/src/redux/api/authApi.ts).
* **UI Integration:** Created new page [\`src/app/reset-password/page.tsx\`](file:///d:/Projects/family-together-frontend/src/app/reset-password/page.tsx). Extracts \`token\` from URL params, handles password validation, displays confirmation alerts, and automatically directs users to sign in.

### 3. Live System Telemetry (\`GET /health\`)
* **Endpoint Wiring:** Added \`getSystemHealth\` query to [\`src/redux/api/adminApi.ts\`](file:///d:/Projects/family-together-frontend/src/redux/api/adminApi.ts).
* **UI Integration:** Connected to [\`src/app/admin-dashboard/super/page.tsx\`](file:///d:/Projects/family-together-frontend/src/app/admin-dashboard/super/page.tsx) with a 30-second live polling interval, live service identifier (\`family-together-backend\`), backend status indicator, and manual refresh button.

### 4. Admin User Lookup & Token Rotation
* Added \`getUserById\` to \`adminApi.ts\` (\`GET /users/:id\`).
* Added \`refreshToken\` mutation to \`authApi.ts\` (\`POST /auth/refresh\`).

---

## ✅ 4. Verification & Assurance

* **Type Safety:** Full TypeScript type definitions created (\`UserSessionRecord\`, \`ResetPasswordRequest\`, \`RefreshTokenRequest\`, \`SystemHealthResponse\`).
* **Cache Integrity:** RTK Query tags (\`Sessions\`, \`User\`, \`Auth\`, \`UsersList\`) properly synchronized and invalidated upon mutations.
* **UI Resilience:** Loading spinners, error alerts, and confirmation dialogs ensure smooth user experiences.

---
*Generated by Antigravity IDE • FamilyRoots Engineering Architecture System*
`;

  const backendDocPath = path.resolve('d:/Projects/family-together-backend/Backend_APIs_Gap_Analysis_And_Frontend_Integration_Guide.doc');
  const frontendDocPath = path.resolve('d:/Projects/family-together-frontend/Backend_APIs_Gap_Analysis_And_Frontend_Integration_Guide.doc');
  fs.writeFileSync(backendDocPath, markdownContent, 'utf-8');
  fs.writeFileSync(frontendDocPath, markdownContent, 'utf-8');
  console.log('Successfully wrote gap analysis .doc files to both projects!');
}

generateGapAnalysisDocument().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
