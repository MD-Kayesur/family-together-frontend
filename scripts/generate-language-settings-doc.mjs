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

async function generateExplanationDoc() {
  const tableBorderLight = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
  };

  const createCell = (text, isHeader = false, widthPercent = 25, isBold = false) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: isHeader
        ? { fill: '1E3A8A', type: ShadingType.CLEAR }
        : { fill: 'FFFFFF', type: ShadingType.CLEAR },
      borders: tableBorderLight,
      children: [
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({
              text,
              bold: isHeader || isBold,
              size: isHeader ? 20 : 19,
              color: isHeader ? 'FFFFFF' : '1E293B',
              font: 'Segoe UI',
            }),
          ],
        }),
      ],
    });
  };

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
          // Document Header / Title
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '🌐 Language Switcher Removal from Navbar & Profile-Based Global i18n Architecture',
                bold: true,
                size: 34,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Detailed Technical Explanation & Step-by-Step Implementation Plan Based on User Prompt',
                bold: true,
                size: 22,
                color: '0D9488',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 350 },
            children: [
              new TextRun({
                text: 'FamilyRoots Platform • Next.js 16 + React 19 + TypeScript • LanguageContext & Global Localization',
                italics: true,
                size: 18,
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

          // SECTION 1: WHAT WAS UNDERSTOOD
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({
                text: '1. What I Understood from Your Prompt (Exact Breakdown)',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: 'Based on your prompt, here is the exact 4-part requirement breakdown:\n\n' +
                  '1. Remove Language Switcher from Navbar ("in navber no need ot keep switch language so solve htis"):\n' +
                  '   The public navigation bar (PublicNavbar.tsx) should no longer contain any language selector or dropdown. This cleans up the header UI on both desktop and mobile screens.\n\n' +
                  '2. Move Language Settings to Profile Section in ALL Dashboards ("create a secon in profile seciton all dashbord"):\n' +
                  '   In the Profile / Settings view across every dashboard (Owner Dashboard, Member/User Dashboard, and Admin Dashboard), we need to create a dedicated, beautifully styled "Language & Localization Preferences" card/section.\n\n' +
                  '3. Support All World Languages with a Caret Dropdown ("keep that serocn keep in all owrld langage adn keep like caerrt only language"):\n' +
                  '   Instead of only English and Bengali, the system must support major world languages (English, Bengali, Spanish, French, German, Arabic, Hindi, Chinese, Portuguese, Japanese, Russian, Italian, Korean, Turkish, Urdu, etc.). The selector should feature a sleek dropdown with a caret icon (ChevronDown) showing the language flag, native name, and English name.\n\n' +
                  '4. Instant Global Translation Across All Pages ("adn when will select a laugae then will worthc all ange so now create 18n process"):\n' +
                  '   When a user selects a language from their profile, it must immediately update the global application state (LanguageContext), persist to localStorage, and reactively switch translations across ALL public pages and dashboard screens.',
              }),
            ],
          }),

          // SECTION 2: CURRENT AUDIT & GAPS
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({
                text: '2. Current Codebase Audit & Architectural Gaps',
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
                  createCell('Area', true, 25),
                  createCell('Current Implementation', true, 37),
                  createCell('Required Target State', true, 38),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Public Navbar', false, 25, true),
                  createCell('PublicNavbar.tsx imports and renders <LanguageSwitcher /> in both desktop & mobile headers.', false, 37),
                  createCell('Remove <LanguageSwitcher /> completely from PublicNavbar.tsx. Clean, uncluttered header.', false, 38),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Supported Languages', false, 25, true),
                  createCell('translations.ts only defines Language = "en" | "bn" (English & Bengali).', false, 37),
                  createCell('Expand translations.ts with 15+ world languages (en, bn, es, fr, de, ar, hi, zh, pt, ja, ru, it, ko, tr, ur) and translation dictionaries with safe fallback.', false, 38),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Dashboard Profile Sections', false, 25, true),
                  createCell('SettingsTab.tsx has Profile, Sanctuary, Security tabs, but NO language selection section. AdminSettingsPage has no language section.', false, 37),
                  createCell('Embed a dedicated "Preferred Display Language" card with a modern Caret Dropdown in SettingsTab (Owner & User) and AdminSettingsPage (Admin).', false, 38),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Global Application Sync', false, 25, true),
                  createCell('LanguageContext.tsx supports en/bn only and relies on IP geolocation auto-switching.', false, 37),
                  createCell('LanguageContext supports all world languages, prioritizes profile selection, updates localStorage, and re-renders all UI strings.', false, 38),
                ],
              }),
            ],
          }),

          // SECTION 3: STEP-BY-STEP IMPLEMENTATION PLAN
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 350, after: 120 },
            children: [
              new TextRun({
                text: '3. Step-by-Step Technical Implementation Plan',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'Step 1: Expand translations.ts with World Languages & Dictionaries',
                bold: true,
                size: 24,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Update src/lib/i18n/translations.ts to include:\n' +
                  '• Languages: English (en), Bengali (bn), Spanish (es), French (fr), German (de), Arabic (ar), Hindi (hi), Chinese (zh), Portuguese (pt), Japanese (ja), Russian (ru), Italian (it), Korean (ko), Turkish (tr), Urdu (ur).\n' +
                  '• Metadata: code, name, nativeName, flag, direction (ltr/rtl).\n' +
                  '• Robust getTranslation() function: looks up keys in selected language; if undefined, gracefully falls back to English (en).',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'Step 2: Update LanguageContext.tsx to Support Global Locales',
                bold: true,
                size: 24,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Update src/lib/i18n/LanguageContext.tsx so that:\n' +
                  '• It recognizes any valid world language code from localStorage.\n' +
                  '• setLanguage() immediately updates the state, stores in localStorage ("family_roots_lang"), and triggers reactive re-renders across all active components.\n' +
                  '• Maintains backward compatibility with geolocation suggestions without overriding explicit user choices.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'Step 3: Remove LanguageSwitcher from PublicNavbar.tsx',
                bold: true,
                size: 24,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• Remove <LanguageSwitcher /> from desktop cluster in PublicNavbar.tsx.\n' +
                  '• Remove <LanguageSwitcher /> from mobile navigation cluster in PublicNavbar.tsx.\n' +
                  '• Retain the ThemeToggle and navigation links, keeping the header pristine and lightweight.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'Step 4: Create Reusable ProfileLanguageSelector Component with Caret',
                bold: true,
                size: 24,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Create src/components/common/ProfileLanguageSelector.tsx featuring:\n' +
                  '• Sleek modern card design matching Kinship Modern aesthetics.\n' +
                  '• Dropdown selector with a Caret icon (ChevronDown) showing the current flag, native language name, and English label.\n' +
                  '• Search filter or scrollable list with all 15+ world languages.\n' +
                  '• Live feedback checkmark, instant application, and toast confirmation.\n' +
                  '• Location detection insight badge (e.g. "Auto-detected based on IP").',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'Step 5: Integrate into ALL Dashboard Profile & Settings Pages',
                bold: true,
                size: 24,
                color: '0D9488',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• Owner Dashboard & User/Member Dashboard: Add ProfileLanguageSelector directly inside SettingsTab.tsx under the "Profile & Account" section.\n' +
                  '• Admin Dashboard: Add ProfileLanguageSelector inside src/app/admin-dashboard/settings/page.tsx under a dedicated "Display & Localization" section.',
              }),
            ],
          }),

          // SECTION 4: VERIFICATION PLAN
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 350, after: 120 },
            children: [
              new TextRun({
                text: '4. Verification & Testing Workflow',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '1. Inspect PublicNavbar at http://localhost:3000 to verify no language switcher appears on desktop or mobile.\n' +
                  '2. Navigate to Owner Dashboard Profile (/owner-dashboard?tab=profile) and User Dashboard Profile (/user-dashboard?tab=profile) to test the new caret dropdown selector.\n' +
                  '3. Select multiple languages (e.g., Spanish, Bengali, French, Arabic, Hindi) and verify that public pages and dashboard headers reflect the change immediately without reload.\n' +
                  '4. Verify Admin Dashboard Settings (/admin-dashboard/settings) contains the same selector and functions reliably.',
              }),
            ],
          }),

          // Footer Notice
          new Paragraph({
            text: '_________________________________________________________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'FamilyRoots Platform Architecture Documentation • Antigravity IDE • All Rights Reserved',
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

  const backendDocxPath = path.resolve('d:/Projects/family-together-backend/Language_Switch_Architecture_And_Profile_i18n_Implementation_Plan.docx');
  const frontendDocxPath = path.resolve('d:/Projects/family-together-frontend/Language_Switch_Architecture_And_Profile_i18n_Implementation_Plan.docx');
  const backendDocPath = path.resolve('d:/Projects/family-together-backend/Language_Switch_Architecture_And_Profile_i18n_Implementation_Plan.doc');
  const frontendDocPath = path.resolve('d:/Projects/family-together-frontend/Language_Switch_Architecture_And_Profile_i18n_Implementation_Plan.doc');

  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);

  const docSummaryText = `Language Switcher Removal from Navbar & Profile-Based Global i18n Architecture
=====================================================================================
Platform: FamilyRoots ("Family Together")
Date: October 2026
Documentation: Detailed Implementation Explanation

1. What Was Understood from Your Prompt:
- 1. Remove Language Switcher from Navbar: Clean up PublicNavbar.tsx so no language button or dropdown is in the header.
- 2. Create Language Section in Profile Across ALL Dashboards: Put the language settings into the Profile/Settings page of Owner, User/Member, and Admin dashboards.
- 3. Support All World Languages with Caret Dropdown: Expand language choices to major world languages (English, Bengali, Spanish, French, German, Arabic, Hindi, Chinese, Portuguese, Japanese, Russian, etc.) with a clean caret dropdown (ChevronDown).
- 4. Full i18n Process Working on All Pages: When a language is selected, it immediately updates the global state, persists to localStorage, and updates all pages across the app.

2. Step-by-Step Implementation Roadmap:
- Step 1: Update translations.ts with 15+ world languages and safe English fallback.
- Step 2: Update LanguageContext.tsx to accept and persist any world language.
- Step 3: Remove <LanguageSwitcher /> from PublicNavbar.tsx (desktop and mobile).
- Step 4: Build ProfileLanguageSelector component with caret dropdown and flag indicators.
- Step 5: Integrate into SettingsTab.tsx (Owner & User) and AdminSettingsPage.tsx (Admin).
- Step 6: Verify end-to-end reactivity across all pages.
`;

  fs.writeFileSync(backendDocPath, docSummaryText, 'utf-8');
  fs.writeFileSync(frontendDocPath, docSummaryText, 'utf-8');

  console.log('Successfully generated Language_Switch_Architecture_And_Profile_i18n_Implementation_Plan files!');
}

generateExplanationDoc().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
