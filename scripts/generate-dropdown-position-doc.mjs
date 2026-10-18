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

async function generateDropdownPositionDoc() {
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
                text: '📍 Navbar Language Switcher Dropdown Popover Positioning Report',
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
                text: 'Implementation Report: Anchored Dropdown Popover Right Below the Navbar Language Button, Click-Outside Dismissal, and Compact Search & 4-Language Hierarchy',
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
                text: '1. User Request & Visual Positioning Analysis',
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
                text: 'The user indicated via screenshot that the language switcher should not open as a centered blocking fullscreen modal in the middle of the screen. Instead, it must open directly underneath the language button in the navbar (marked in the user\'s red rectangle), functioning as an anchored, floating dropdown popover.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '2. Popover Architecture & CSS Positioning',
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
                text: '• Relative Anchor Container: The trigger button is wrapped in a relative container (<div ref={containerRef} className="relative inline-block text-left">).',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: '• Absolute Anchored Dropdown: The popover panel is positioned at absolute right-0 top-full mt-2 w-80 sm:w-84 z-[100] with backdrop blur, rounded-2xl corners, and subtle shadows.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• Click-Outside Dismissal: An event listener on mousedown and touchstart listens outside containerRef and smoothly dismisses the popover when the user clicks anywhere else.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '3. Content Structure Matching Wireframe',
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
                text: '1. Search Input Field (Above): Positioned at the top of the popover with autofocus and instant query filtering.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '2. Horizontal Divider: Subtle border line separating search from the selection list.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '3. 4 Default Languages (Below): When search is empty, displays strictly 🇺🇸 English, 🇧🇩 বাংলা, 🇪🇸 Español, and 🇸🇦 العربية.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '4. Dynamic Filter: When typing, searches across all 25 supported languages and shows the exact matching language(s).',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: '4. Verification Summary',
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
                text: '✓ Anchored Dropdown Alignment: Verified directly underneath the navbar language button.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '✓ Click-outside dismissal & Escape key listeners verified.',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '✓ TypeScript Typecheck (npx tsc --noEmit): Passed with 0 errors.',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.resolve('LANGUAGE_DROPDOWN_POPOVER_POSITIONING_REPORT.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`Created DOCX: ${docxPath}`);

  const backendDocxPath = path.resolve('../family-together-backend/LANGUAGE_DROPDOWN_POPOVER_POSITIONING_REPORT.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`Created Backend DOCX: ${backendDocxPath}`);

  const docHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Navbar Language Switcher Dropdown Popover Positioning Report</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
      h2 { color: #0f172a; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
      th { background-color: #1e3a8a; color: #ffffff; }
      code { background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      .box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 15px 0; }
      .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; background-color: #dcfce7; color: #166534; }
    </style>
  </head>
  <body>
    <h1>📍 Navbar Language Switcher Dropdown Popover Positioning Report</h1>
    <p><em>Implementation Report: Anchored Dropdown Popover Right Below the Navbar Language Button, Click-Outside Dismissal, and Compact Search & 4-Language Hierarchy</em></p>
    <hr/>

    <h2>১. ব্যবহারকারীর লাল চিহ্নিত নির্দেশিকা (Red Box Positioning)</h2>
    <div class="box">
      <strong>রিকোয়েস্ট:</strong> ব্যবহারকারী স্ক্রিনশট দিয়ে দেখিয়েছেন যে ল্যাঙ্গুয়েজ মডালটি স্ক্রিনের মাঝখানে ফুলস্ক্রিন ডায়ালগ আকারে না এসে, নেভবারের <code>[ 🌐 ES Español ]</code> বাটনের ঠিক নিচে (ড্রপডাউন পপওভার হিসেবে) প্রদর্শিত হতে হবে।
    </div>

    <h2>২. পজিশনিং ও টেকনিক্যাল ইমপ্লিমেন্টেশন</h2>
    <ul>
      <li><strong>অ্যাঙ্কর কন্টেইনার:</strong> <code>relative inline-block text-left</code> দিয়ে বাটনের সাপেক্ষে অ্যাঙ্কর করা হয়েছে।</li>
      <li><strong>ড্রপডাউন পপওভার:</strong> <code>absolute right-0 top-full mt-2 w-80 sm:w-84 z-[100]</code> ক্লাস দিয়ে ঠিক বাটনের নিচে সুন্দর ড্রপডাউন হিসেবে নামিয়ে আনা হয়েছে।</li>
      <li><strong>ক্লিক-আউটসাইড হ্যান্ডলার:</strong> বাইরে ক্লিক করলে স্বয়ংক্রিয়ভাবে ড্রপডাউন বন্ধ হয়ে যাওয়ার জন্য <code>useEffect</code> মাউস ও টাচ ইভেন্ট লিসেনার সেট করা হয়েছে।</li>
      <li><strong>লেআউট অক্ষুণ্ণ:</strong> উপরে সার্চ ফিল্ড, মাঝে ডিভাইডার রেখা, নিচে ডিফল্ট ৪টি মূল ভাষা এবং সার্চ করলে ফিল্টার রেজাল্ট।</li>
    </ul>

    <h2>৩. কোয়ালিটি নিশ্চয়তা</h2>
    <p><span class="badge">TypeScript: 0 Errors</span> সমস্ত কোড সম্পূর্ণ টাইপসেফ এবং নেক্সট.জেএস ১৬ সার্ভারে 200 OK রেসপন্স দিচ্ছে।</p>
  </body>
  </html>
  `;

  const docPath = path.resolve('LANGUAGE_DROPDOWN_POPOVER_POSITIONING_REPORT.doc');
  fs.writeFileSync(docPath, docHtml, 'utf8');
  console.log(`Created DOC: ${docPath}`);

  const backendDocPath = path.resolve('../family-together-backend/LANGUAGE_DROPDOWN_POPOVER_POSITIONING_REPORT.doc');
  fs.writeFileSync(backendDocPath, docHtml, 'utf8');
  console.log(`Created Backend DOC: ${backendDocPath}`);
}

generateDropdownPositionDoc().catch(console.error);
