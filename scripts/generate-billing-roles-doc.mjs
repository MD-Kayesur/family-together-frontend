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

async function generateBillingRolesDocument() {
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
                text: '🛡️ Billing & Subscriptions Access Control & Architecture Guide',
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
                text: 'Comprehensive Role-Based Access Control (RBAC), Permission Matrix & Operational Architecture for FamilyRoots Billing Systems',
                italics: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Core Question Answered: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'Who can create, view, upgrade, and manage billing and subscriptions?' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Target Systems: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'family-together-backend (NestJS 11) & family-together-frontend (Next.js 16)' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Database Models: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'Subscription, Family, FamilyMember, User (Neon PostgreSQL)' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Architecture Principle: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'Sanctuary-Level Subscriptions with Owner Responsibility & Pooled Family Benefit' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 150 } }),

          // Section 1
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '1. Executive Summary: Who Can Manage Billing & Subscriptions?',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: 'In the FamilyRoots ("Family Together") architecture, billing is designed around a ',
              }),
              new TextRun({
                text: 'Sanctuary-Level Model',
                bold: true,
                color: '0F172A',
              }),
              new TextRun({
                text: ' rather than individual seat licenses. This means one family sanctuary has one shared subscription that provides pooled cloud storage (500 MB Free, 50 GB Pro, 500 GB Dynasty) and member caps for the entire extended family.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: 'Key Rule: ',
                bold: true,
                color: 'DC2626',
              }),
              new TextRun({
                text: 'Only Sanctuary OWNERS (the family creator) and System ADMINISTRATORS (SUPER_ADMIN / ADMIN) have financial authority to initiate checkout, purchase subscriptions, or alter payment methods. Invited family members (MEMBER / USER) and guests (VIEWER) never pay and cannot initiate financial transactions; they strictly enjoy the pooled storage and features provided by the Owner.',
              }),
            ],
          }),

          // Section 2: Roles Matrix Table
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. Role-Based Access Control (RBAC) Permission Matrix',
                bold: true,
                size: 26,
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
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'User Role', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'View Plans (Pricing)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'View Storage Usage', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Initiate Upgrade / Checkout', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Stripe Portal (Card / Invoices)', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'OWNER', bold: true, color: '059669' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (Full access)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (Live storage meter)' })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '✅ Full Authority (Initiates Stripe Checkout)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '✅ Full Access (Manage card & cancel)', bold: true })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ADMIN / SUPER_ADMIN', bold: true, color: '2563EB' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (System-wide)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (All Sanctuaries)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (Can override / grant upgrades)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (Billing administration)' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'MEMBER / USER', bold: true, color: 'D97706' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (Public Pricing)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (Can view family quota)' })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '❌ Forbidden (Hidden from UI & Blocked)', color: 'DC2626' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '❌ Forbidden (No access to payment)', color: 'DC2626' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'VIEWER', bold: true, color: '64748B' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Yes (Public Pricing)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '❌ No (Blocked from dashboards)' })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '❌ Forbidden', color: 'DC2626' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '❌ Forbidden', color: 'DC2626' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'STRIPE WEBHOOK', bold: true, color: '7C3AED' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: 'N/A' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'N/A' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Automated lifecycle event processor' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Cryptographically verified via signature' })] }),
                ],
              }),
            ],
          }),

          // Section 3: Technical Enforcement Layers
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3. The Four Defense Layers Enforcing Billing Security',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Layer 1: Frontend Navigation Filtering (SanctuaryDashboardWrapper.tsx)\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'In the sidebar navigation component, isOwnerOrAdmin determines whether the "Billing & Plans" link appears. Regular members (MEMBER/USER) navigating to /user-dashboard never see the billing link, preventing confusion or accidental clicks.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Layer 2: Frontend Route Guard (roleUtils.ts)\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'The canAccessRoute(pathname, role) utility strictly inspects navigation attempts. If a MEMBER or VIEWER manually types "/owner-dashboard/billing" into their browser URL bar, the route guard intercepts the request and redirects them to their permissible dashboard or home page.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Layer 3: Backend Controller & Guard Protection (billing.controller.ts)\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'All mutating billing endpoints (POST /billing/checkout and POST /billing/portal) require valid authentication and verify user ownership against the family sanctuary. Any attempt by an unauthenticated user or unauthorized member to trigger a checkout will result in a 401 Unauthorized or 403 Forbidden response.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Layer 4: Database Model Integrity (Neon PostgreSQL Multi-Schema)\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'The Subscription entity in PostgreSQL has a unique constraint on familyId (@unique). Each family can have exactly one active subscription, preventing duplicate billing. The userId field records the specific Family Owner responsible for the recurring subscription.',
              }),
            ],
          }),

          // Section 4: Operational Scenarios
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '4. Real-World Operational Scenarios',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Scenario A: Family Sanctuary Creation (Default Free Plan)\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'When a new user registers and initializes their family sanctuary, the backend automatically seeds a FREE subscription tier with 500 MB storage quota and 25 max members limit. No credit card is required.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Scenario B: Owner Upgrades to Heritage Pro ($9.99/mo)\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'The Family Owner navigates to /owner-dashboard/billing and clicks "Upgrade to Heritage Pro". The system initiates a Stripe Checkout session. Once payment completes (or in Sandbox mode), the family quota immediately expands to 50 GB (51,200 MB) and 100 member slots. Every family member can now upload large albums without ever paying a dime.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Scenario C: Storage Threshold Warning & Over-Quota Protection\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'The storage calculation engine dynamically aggregates document sizes and memory photo counts (2.5MB per doc, 1.2MB per photo). When storage reaches 100%, upload APIs reject new media until the Sanctuary Owner upgrades the subscription tier.',
              }),
            ],
          }),

          // Conclusion
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'Summary: ',
                bold: true,
                color: '059669',
              }),
              new TextRun({
                text: 'The billing system is designed for maximum security, ease of use, and frictionless family collaboration. The Sanctuary Owner handles the billing, while the entire family enjoys the sanctuary.',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const backendDocxPath = path.resolve('..', 'family-together-backend', 'Billing_And_Subscription_Roles_Permissions_Architecture_Explanation.docx');
  const frontendDocxPath = path.resolve('.', 'Billing_And_Subscription_Roles_Permissions_Architecture_Explanation.docx');

  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);

  // Also write the .doc markdown format
  const docContent = `# 🛡️ Billing & Subscriptions Access Control & Architecture Guide

> **Core Question Answered:** Who can create, view, upgrade, and manage billing and subscriptions?  
> **Target Systems:** \`family-together-backend\` (NestJS 11) & \`family-together-frontend\` (Next.js 16)  
> **Database Models:** \`Subscription\`, \`Family\`, \`FamilyMember\`, \`User\` (Neon PostgreSQL)  
> **Architecture Principle:** Sanctuary-Level Subscriptions with Owner Responsibility & Pooled Family Benefit  

---

## 📌 1. Executive Summary: Who Can Manage Billing?

In the FamilyRoots ("Family Together") architecture, billing is designed around a **Sanctuary-Level Model** rather than individual per-user subscriptions.

* **Only Sanctuary OWNERS (the family creator) and System ADMINISTRATORS (SUPER_ADMIN / ADMIN) have financial authority** to create checkout sessions, upgrade subscription tiers, change billing intervals, or access the Stripe Customer Portal.
* **Invited family members (MEMBER / USER) and guests (VIEWER) never pay.** They do not have access to billing controls, but they benefit from the pooled sanctuary storage (500 MB Free, 50 GB Pro, or 500 GB Dynasty) paid for by the Owner.

---

## 👥 2. Role-Based Access Control (RBAC) Permission Matrix

| User Role | View Pricing Plans | View Storage Quota | Initiate Stripe Upgrade | Stripe Customer Portal (Cards/Invoices) |
| :--- | :--- | :--- | :--- | :--- |
| **OWNER** | ✅ Yes (Full access) | ✅ Yes (Live storage meter) | ✅ **Full Authority** (Initiates Checkout) | ✅ **Full Access** (Update card, cancel plan) |
| **ADMIN / SUPER_ADMIN** | ✅ Yes (System-wide) | ✅ Yes (All Sanctuaries) | ✅ **Administrative Authority** (Can override/grant) | ✅ **Full Access** (Billing administration) |
| **MEMBER / USER** | ✅ Yes (Public pricing) | ✅ Yes (Views family quota) | ❌ **Forbidden** (Hidden from UI & blocked by API) | ❌ **Forbidden** (No access to payment methods) |
| **VIEWER** | ✅ Yes (Public pricing) | ❌ No (Blocked from dashboards) | ❌ **Forbidden** | ❌ **Forbidden** |
| **STRIPE WEBHOOK** | N/A | N/A | Automated processor for async lifecycle events | Cryptographically verified via signature |

---

## 🛡️ 3. The Four Defense Layers Enforcing Billing Security

### Layer 1: Frontend Navigation Filtering (\`SanctuaryDashboardWrapper.tsx\`)
In the sidebar navigation component, \`isOwnerOrAdmin\` determines whether the **"Billing & Plans"** tab appears. Regular members navigating to \`/user-dashboard\` never see the billing link, avoiding clutter and confusion.

### Layer 2: Frontend Route Guard (\`roleUtils.ts\`)
The \`canAccessRoute(pathname, role)\` utility inspects navigation attempts. If a \`MEMBER\` or \`VIEWER\` manually visits \`/owner-dashboard/billing\`, the route guard intercepts the request and redirects them to their permissible dashboard.

### Layer 3: Backend Controller & Guard Protection (\`billing.controller.ts\`)
All mutating billing endpoints (\`POST /billing/checkout\` and \`POST /billing/portal\`) require valid authentication and verify user ownership against the family sanctuary. Unauthorized requests receive \`401 Unauthorized\` or \`403 Forbidden\`.

### Layer 4: Database Model Integrity (\`Neon PostgreSQL Multi-Schema\`)
The \`Subscription\` entity in PostgreSQL has a unique constraint on \`familyId\` (\`@unique\`). Each family has exactly one active subscription, preventing duplicate billing. The \`userId\` field records the specific Family Owner responsible for the recurring subscription.

---

## 💡 4. Real-World Operational Scenarios

1. **Family Sanctuary Creation (Default Free Plan):**  
   When a user registers and initializes a family sanctuary, the backend automatically seeds a \`FREE\` subscription tier with 500 MB storage quota and 25 max members limit without requiring a credit card.

2. **Owner Upgrades to Heritage Pro ($9.99/mo):**  
   The Family Owner navigates to \`/owner-dashboard/billing\` and clicks **"Upgrade to Heritage Pro"**. The system initiates a Stripe Checkout session. Once payment completes (or in Sandbox mode), the family quota immediately expands to 50 GB (51,200 MB) and 100 member slots. Every family member can now upload large albums without paying.

3. **Storage Quota Enforcement:**  
   The storage calculation engine dynamically aggregates document sizes and memory photos (2.5MB per doc, 1.2MB per photo). When storage reaches 100%, upload APIs reject new media until the Sanctuary Owner upgrades the subscription tier.

---
*Generated by Antigravity IDE • FamilyRoots Architectural Access Control Analysis*
`;

  const backendDocPath = path.resolve('..', 'family-together-backend', 'Billing_And_Subscription_Roles_Permissions_Architecture_Explanation.doc');
  const frontendDocPath = path.resolve('.', 'Billing_And_Subscription_Roles_Permissions_Architecture_Explanation.doc');

  fs.writeFileSync(backendDocPath, docContent, 'utf-8');
  fs.writeFileSync(frontendDocPath, docContent, 'utf-8');

  console.log('✅ Generated Billing Roles & Permissions Documents successfully in both repositories:');
  console.log(' -', backendDocxPath);
  console.log(' -', backendDocPath);
  console.log(' -', frontendDocxPath);
  console.log(' -', frontendDocPath);
}

generateBillingRolesDocument().catch(console.error);
