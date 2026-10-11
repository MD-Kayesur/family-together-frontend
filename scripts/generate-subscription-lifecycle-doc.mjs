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

async function generateLifecycleDocument() {
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
                text: '💳 Subscription Lifecycle, Upgrade Triggers & Payment Flow Guide',
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
                text: 'Comprehensive Explanation of When Users Upgrade, Business Triggers, End-to-End Payment Flow & Database Fulfillment',
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
                          new TextRun({ text: 'Subject: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'When does a user take a subscription, and how does the complete workflow operate?' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Platforms Covered: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'family-together-backend (NestJS 11 + Stripe SDK) & family-together-frontend (Next.js 16)' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Subscription Tiers: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'Free Sanctuary (500MB, 25 members) -> Heritage Pro (50GB, 150 members) -> Dynasty Unlimited (500GB, 10k members)' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 150 } }),

          // Section 1: When Does a User Subscribe?
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '1. When Does a User Take a Subscription? (The 4 Key Triggers)',
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
                text: 'Users do not need to purchase a subscription immediately upon signup. Every new family starts with a ',
              }),
              new TextRun({
                text: 'Free Sanctuary Plan',
                bold: true,
                color: '0F172A',
              }),
              new TextRun({
                text: ' (500 MB storage and up to 25 members). A Sanctuary Owner is motivated to upgrade to a paid subscription under four specific scenarios:',
              }),
            ],
          }),

          // Triggers Subsections
          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Trigger 1: Cloud Storage Vault Exhaustion (The 500 MB Cap)\n', bold: true, color: 'DC2626' }),
              new TextRun({
                text: 'As family members upload high-resolution historical photos, birth certificates, video clips, and scanned documents, the sanctuary storage counter approaches 500 MB. When usage reaches 80% (400 MB) or 100% (500 MB), the dashboard alerts the Owner that upload capacity is full and prompts an upgrade to Heritage Pro (50 GB).',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Trigger 2: Family Tree Growth Beyond 25 Members (The Lineage Cap)\n', bold: true, color: 'DC2626' }),
              new TextRun({
                text: 'The Free tier accommodates up to 25 relatives. When a growing family tree attempts to invite its 26th member (e.g. inviting extended cousins, in-laws, or second-generation relatives), the invitation system notifies the Owner that the 25-member ceiling has been reached, requiring an upgrade to Heritage Pro (up to 150 members) or Dynasty Unlimited (unlimited).',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Trigger 3: Genealogical Research & GEDCOM Data Migration\n', bold: true, color: '2563EB' }),
              new TextRun({
                text: 'Dedicated family historians who have already built complex family trees on third-party platforms (Ancestry.com, MyHeritage, FamilySearch) want to import their entire lineage in one click using standard .GED files. GEDCOM import and high-resolution printable tree poster generation (SVG/PDF) are premium features available on Dynasty Unlimited ($24.99/mo).',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Trigger 4: Voluntary Proactive Upgrade for Generational Peace of Mind\n', bold: true, color: '059669' }),
              new TextRun({
                text: 'Many family patriarchs and matriarchs choose to upgrade immediately after creating their sanctuary to lock in the 17% annual discount ($99/year instead of $119.88/year) and ensure uninterrupted, high-definition memory archiving from day one.',
              }),
            ],
          }),

          // Section 2: Step-by-Step Payment & Fulfillment Workflow
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '2. Step-by-Step: What Happens When a User Takes a Subscription?',
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
                text: 'The end-to-end upgrade lifecycle connects the Next.js frontend, NestJS backend, Neon PostgreSQL multi-schema database, and Stripe payment gateway through six seamless steps:',
              }),
            ],
          }),

          // Steps
          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Step 1: Plan Selection & Pricing Interval Choice\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'The Owner opens /owner-dashboard/billing. They inspect the live storage meter and compare tiers. They toggle between "Monthly" and "Yearly (Save 17%)". They select "Heritage Pro" ($9.99/mo) and click "Upgrade to Heritage Pro".',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Step 2: Frontend Mutation & Checkout Session Request\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'The frontend executes the RTK Query mutation createCheckoutSession({ tier: "HERITAGE_PRO", interval: "MONTHLY" }). This sends a POST /billing/checkout request with the authenticated user credentials and family context.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Step 3: Backend Validation & Stripe Session Creation\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'BillingService verifies that the requesting user is the Sanctuary Owner or Administrator. In Production mode, it calls stripe.checkout.sessions.create() with recurring subscription parameters and metadata. In local Sandbox mode, it simulates an instant approval and prepares the return URL.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Step 4: Secure Checkout on Stripe Hosted Page\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'The browser is redirected to Stripe\'s PCI-compliant hosted checkout portal. The Owner enters their payment method (Credit card, Apple Pay, Google Pay). Sensitive card data never touches your application servers.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Step 5: Webhook Verification & PostgreSQL Database Fulfillment\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'Upon successful transaction, Stripe broadcasts a checkout.session.completed webhook to POST /billing/webhook. The backend verifies the cryptographic signature (stripe-signature) and updates the Neon PostgreSQL subscriptions table: tier is set to HERITAGE_PRO, storageLimitMb expands to 51,200 MB, maxMembersLimit expands to 150, and stripeCustomerId is securely stored.',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Step 6: Real-Time UI Reflection Across All Family Members\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'The Owner is redirected back to /owner-dashboard/billing?status=success. RTK Query invalidates the Subscription tag, instantly refreshing the storage bar to reflect the new 50 GB capacity. Concurrently, all family members in /user-dashboard now have unrestricted access to upload high-definition photo albums and videos without encountering quota blocks.',
              }),
            ],
          }),

          // Section 3: Comparison Table
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3. Subscription Tier Comparison & Economic Model',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Plan Dimension', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Free Sanctuary', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Heritage Pro (Most Popular)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Dynasty Unlimited', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Monthly Price', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '$0.00 / mo' })] }),
                  new TableCell({ children: [new Paragraph({ text: '$9.99 / mo' })] }),
                  new TableCell({ children: [new Paragraph({ text: '$24.99 / mo' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Yearly Price (Save 17%)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '$0.00 / yr' })] }),
                  new TableCell({ children: [new Paragraph({ text: '$99.00 / yr' })] }),
                  new TableCell({ children: [new Paragraph({ text: '$249.00 / yr' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Encrypted Vault Storage', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '500 MB' })] }),
                  new TableCell({ children: [new Paragraph({ text: '50 GB (51,200 MB)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '500 GB (512,000 MB)' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Family Members Quota', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Up to 25 members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Up to 150 members' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Unlimited (10,000+ members)' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'GEDCOM Data Import/Export', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '❌ No' })] }),
                  new TableCell({ children: [new Paragraph({ text: '❌ No' })] }),
                  new TableCell({ children: [new Paragraph({ text: '✅ Full .ged format support' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Target User Type', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: 'New small families' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Active multi-branch families' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Genealogists & large dynasties' })] }),
                ],
              }),
            ],
          }),

          // Section 4: What Happens if a User Cancels?
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '4. What Happens if a User Cancels Their Subscription?',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Grace Period & Data Preservation:\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'If an Owner clicks "Stripe Customer Portal" and cancels their subscription, Stripe sets cancelAtPeriodEnd = true. The family retains their 50 GB or 500 GB storage until the end of the billing cycle. Even after downgrading to Free, existing memories and documents are never deleted; the family simply enters a read-only upload pause until storage is cleaned or a plan is renewed.',
              }),
            ],
          }),

          // Conclusion
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'Conclusion: ',
                bold: true,
                color: '059669',
              }),
              new TextRun({
                text: 'The subscription model balances generous free onboarding with frictionless monetization triggers, ensuring zero billing friction for invited family members while providing robust, predictable SaaS revenue from sanctuary owners.',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const backendDocxPath = path.resolve('..', 'family-together-backend', 'When_And_How_Users_Subscribe_Lifecycle_Explanation.docx');
  const frontendDocxPath = path.resolve('.', 'When_And_How_Users_Subscribe_Lifecycle_Explanation.docx');

  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);

  // Write markdown .doc file
  const docContent = `# 💳 Subscription Lifecycle, Upgrade Triggers & Payment Flow Guide

> **Core Question Answered:** When does a user take a subscription, and how does the complete workflow operate?  
> **Platforms Covered:** \`family-together-backend\` (NestJS 11 + Stripe SDK) & \`family-together-frontend\` (Next.js 16)  
> **Subscription Tiers:** Free Sanctuary (500MB, 25 members) ➔ Heritage Pro (50GB, 150 members) ➔ Dynasty Unlimited (500GB, 10k members)  

---

## 📌 1. When Does a User Take a Subscription? (The 4 Triggers)

Every newly registered family begins on the **Free Sanctuary Plan** with 500 MB storage and up to 25 members at zero cost. A user (Sanctuary Owner) takes a paid subscription under four distinct conditions:

### 🚨 Trigger 1: Cloud Storage Vault Exhaustion (The 500 MB Cap)
* **What happens:** As family members upload high-resolution historical photos, audio oral histories, videos, and scanned documents, the sanctuary storage counter approaches 500 MB.
* **The Action:** At 80% (400 MB) and 100% (500 MB), the dashboard alerts the Owner that upload capacity is full and prompts an upgrade to **Heritage Pro (50 GB)**.

### 👥 Trigger 2: Family Tree Growth Beyond 25 Members (The Lineage Cap)
* **What happens:** The Free tier accommodates up to 25 family members.
* **The Action:** When the family tree expands and the Owner tries to invite relative #26 (uncles, aunts, cousins, in-laws), the system informs them that they have reached the 25-member ceiling, requiring an upgrade to **Heritage Pro (up to 150 members)** or **Dynasty Unlimited (unlimited)**.

### 🧬 Trigger 3: Genealogical Research & GEDCOM Data Migration
* **What happens:** Serious genealogists or family historians who have existing trees on Ancestry.com, MyHeritage, or FamilySearch want to import their entire lineage in one click using standard \`.ged\` files.
* **The Action:** Full GEDCOM import and high-res printable poster generation (SVG/PDF) are unlocked exclusively on the **Dynasty Unlimited** tier ($24.99/mo).

### 🎁 Trigger 4: Voluntary Proactive Upgrade for Generational Peace of Mind
* **What happens:** Many family owners choose to upgrade immediately upon sanctuary creation to lock in the **17% annual discount** ($99/year instead of $119.88/year) and ensure high-definition memory archiving from day one.

---

## 🔄 2. Step-by-Step: What Happens When a User Takes a Subscription?

The end-to-end upgrade lifecycle connects the Next.js frontend, NestJS backend, Neon PostgreSQL database, and Stripe payment gateway through six steps:

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Owner as Sanctuary Owner
    participant FE as Next.js 16 Frontend
    participant BE as NestJS 11 Backend
    participant DB as Neon PostgreSQL
    participant Stripe as Stripe Gateway

    Owner->>FE: Opens /owner-dashboard/billing & selects Heritage Pro ($9.99/mo)
    FE->>BE: POST /billing/checkout { tier: 'HERITAGE_PRO', interval: 'MONTHLY' }
    BE->>BE: Validates Owner permissions & generates Stripe session
    BE->>Stripe: stripe.checkout.sessions.create()
    Stripe-->>BE: Returns checkout URL (https://checkout.stripe.com/...)
    BE-->>FE: Returns { url, sessionId }
    FE->>Owner: Redirects to Stripe hosted checkout page
    Owner->>Stripe: Enters card / Apple Pay & completes payment
    Stripe->>BE: POST /billing/webhook (checkout.session.completed)
    BE->>DB: Updates Subscription (tier: HERITAGE_PRO, limit: 51,200 MB, status: ACTIVE)
    Stripe-->>FE: Redirects to /owner-dashboard/billing?status=success
    FE->>FE: RTK Query invalidates cache -> Storage expands to 50 GB instantly!
\`\`\`

1. **Step 1: Plan Selection & Interval Toggle**:  
   The Owner visits \`/owner-dashboard/billing\`. They compare plans, toggle between Monthly and Yearly (Save 17%), and click **"Upgrade to Heritage Pro"**.
2. **Step 2: Frontend API Call**:  
   The frontend fires RTK Query mutation \`createCheckoutSession({ tier: 'HERITAGE_PRO', interval: 'MONTHLY' })\` to \`POST /billing/checkout\`.
3. **Step 3: Backend Session Generation**:  
   \`BillingService\` validates that the requester is the Sanctuary Owner. In production mode, it creates a hosted Stripe Checkout session. In development sandbox mode, it directly upgrades the database and provides the return URL.
4. **Step 4: Secure Checkout on Stripe**:  
   The user enters credit card or Apple Pay details on Stripe's PCI-compliant hosted checkout portal.
5. **Step 5: Webhook & Neon PostgreSQL Fulfillment**:  
   Stripe broadcasts \`checkout.session.completed\` to \`POST /billing/webhook\`. The backend verifies the cryptographic signature and updates PostgreSQL:
   * \`tier\`: \`HERITAGE_PRO\`
   * \`status\`: \`ACTIVE\`
   * \`storageLimitMb\`: \`51200\` (50 GB)
   * \`maxMembersLimit\`: \`150\`
   * \`stripeCustomerId\`: \`cus_xxx\`
6. **Step 6: Real-Time UI Reflection Across All Family Members**:  
   The browser returns to \`/owner-dashboard/billing?status=success\`. RTK Query invalidates the cache, immediately displaying the 50 GB storage bar. All family members can now upload high-resolution media without quota limits.

---

## 📊 3. Subscription Tier Comparison & Economic Model

| Plan Dimension | Free Sanctuary | Heritage Pro *(Most Popular)* | Dynasty Unlimited |
| :--- | :--- | :--- | :--- |
| **Monthly Price** | $0.00 / mo | **$9.99 / mo** | **$24.99 / mo** |
| **Yearly Price (Save 17%)** | $0.00 / yr | **$99.00 / yr** | **$249.00 / yr** |
| **Encrypted Vault Storage** | 500 MB | **50 GB (51,200 MB)** | **500 GB (512,000 MB)** |
| **Member Limit** | Up to 25 members | **Up to 150 members** | **Unlimited (10,000+)** |
| **GEDCOM Data Migration** | ❌ No | ❌ No | **✅ Full .ged file support** |
| **Printable Tree Posters** | ❌ No | Standard | **✅ High-Res SVG & PDF** |
| **Target Audience** | New small families | Active growing families | Genealogists & large dynasties |

---

## 🛡️ 4. What Happens if a User Cancels?

* **Grace Period:** If an Owner clicks **"Stripe Customer Portal"** and cancels their subscription, Stripe sets \`cancelAtPeriodEnd = true\`. The family retains full 50 GB or 500 GB access until the current billing cycle expires.
* **Data Preservation:** Even after downgrading to Free, **existing family photos and memories are NEVER deleted**. The sanctuary simply enters a temporary upload freeze until storage is cleared or the subscription is renewed.

---
*Generated by Antigravity IDE • FamilyRoots Subscription Lifecycle Analysis*
`;

  const backendDocPath = path.resolve('..', 'family-together-backend', 'When_And_How_Users_Subscribe_Lifecycle_Explanation.doc');
  const frontendDocPath = path.resolve('.', 'When_And_How_Users_Subscribe_Lifecycle_Explanation.doc');

  fs.writeFileSync(backendDocPath, docContent, 'utf-8');
  fs.writeFileSync(frontendDocPath, docContent, 'utf-8');

  console.log('✅ Generated Subscription Lifecycle Documents successfully:');
  console.log(' -', backendDocxPath);
  console.log(' -', backendDocPath);
  console.log(' -', frontendDocxPath);
  console.log(' -', frontendDocPath);
}

generateLifecycleDocument().catch(console.error);
