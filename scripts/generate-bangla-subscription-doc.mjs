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

async function generateBanglaDocument() {
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
                text: '💳 ফ্যামিলিরুটস সাবস্ক্রিপশন ও বিলিং সিস্টেমের বিস্তারিত ব্যাখ্যা',
                bold: true,
                size: 32,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 350 },
            children: [
              new TextRun({
                text: 'কখন ইউজার সাবস্ক্রিপশন নিবেন, পেমেন্ট কীভাবে কাজ করে এবং ডাটাবেস ও ফ্রন্টএন্ডে কী পরিবর্তন ঘটে - সম্পূর্ণ বাংলা গাইড',
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
                          new TextRun({ text: 'মূল বিষয়: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'ইউজার কখন এবং কেন সাবস্ক্রিপশন কিনবেন ও পুরো প্রক্রিয়া কীভাবে কাজ করে।' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'সিস্টেম আর্কিটেকচার: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'স্যাঙ্কচুয়ারি লেভেল মডেল (পরিবারের প্রধান একবার পেমেন্ট করবেন, পুরো পরিবার ফ্রি ব্যবহার করবে)' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'প্ল্যানসমূহ: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'Free Sanctuary (500MB), Heritage Pro (50GB), Dynasty Unlimited (500GB)' }),
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
                text: '১. একজন ইউজার কখন সাবস্ক্রিপশন নিবেন? (৪টি মূল কারণ)',
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
                text: 'প্রতিটি নতুন পরিবার একাউন্ট খোলার পর একদম বিনামূল্যে ',
              }),
              new TextRun({
                text: 'Free Sanctuary প্ল্যান',
                bold: true,
                color: '0F172A',
              }),
              new TextRun({
                text: ' পায় (৫০০ মেগাবাইট স্টোরেজ এবং সর্বোচ্চ ২৫ জন সদস্য)। একজন ইউজার নিচের ৪টি পরিস্থিতিতে সাবস্ক্রিপশন আপগ্রেড করেন:',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ক. ক্লাউড স্টোরেজ ৫০০ এমবি শেষ হয়ে গেলে:\n', bold: true, color: 'DC2626' }),
              new TextRun({
                text: 'পরিবারের সদস্যরা যখন হাই-কোয়ালিটি ছবি, পুরনো দিনের স্মৃতি, ভিডিও ক্লিপ বা জরুরি দলিলের ফাইল আপলোড করতে থাকেন, তখন ফ্রি ৫০০ মেগাবাইট পূর্ণ হয়ে যায়। স্টোরেজ ৮০% বা ১০০% এ পৌঁছালে ওনার ড্যাশবোর্ডে সতর্কবার্তা দেখতে পান এবং ৫০ জিবি স্টোরেজের জন্য Heritage Pro ($9.99/মাস) প্ল্যানে আপগ্রেড করেন।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'খ. পরিবারের সদস্য সংখ্যা ২৫ জনের বেশি হয়ে গেলে:\n', bold: true, color: 'DC2626' }),
              new TextRun({
                text: 'ফ্রি প্ল্যানে সর্বোচ্চ ২৫ জন আত্মীয়কে যুক্ত করা যায়। কিন্তু পরিবার বড় হলে (চাচা, মামা, খালা, কাজিন, নাতি-নাতনি) যখন ২৬ তম সদস্যকে ইনভাইট করতে যান, সিস্টেম বলে মেম্বার লিমিট শেষ। তখন ১৫০ জন মেম্বারের জন্য Heritage Pro বা আনলিমিটেড মেম্বারের জন্য Dynasty Unlimited নিতে হয়।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'গ. প্রফেশনাল বংশলতিকা ফিচার (GEDCOM Import ও Poster Print):\n', bold: true, color: '2563EB' }),
              new TextRun({
                text: 'অনেকেই আগে Ancestry.com বা FamilySearch-এ বংশলতিকা বানিয়ে রেখেছেন। তারা সেই পুরো বংশলতিকা এক ক্লিকে .ged ফাইলের মাধ্যমে ইমপোর্ট করতে চান এবং দেয়ালে টানানোর মতো বড় পোস্টার (SVG/PDF) প্রিন্ট করতে চান। এটি Dynasty Unlimited ($24.99/মাস) প্ল্যানের বিশেষ ফিচার।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ঘ. বার্ষিক ১৭% ছাড় পেয়ে আগেভাগেই প্রো মেম্বার হওয়া:\n', bold: true, color: '059669' }),
              new TextRun({
                text: 'পরিবারের প্রধান (Family Owner) নিশ্চিন্তে হাই-ডেফিনিশন স্মৃতি আজীবনের জন্য সংরক্ষণ করতে শুরুতেই বাৎসরিক প্ল্যান ($99/বছর) নিয়ে নেন, যাতে বারবার রিনিউ করার ঝামেলা না থাকে।',
              }),
            ],
          }),

          // Section 2
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '২. সাবস্ক্রিপশন নেওয়ার সময় ধাপে ধাপে কী ঘটে? (সম্পূর্ণ টেকনিক্যাল ফ্লো)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ধাপ ১: ওনার প্ল্যান পছন্দ করেন\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'পরিবারের ওনার তার ড্যাশবোর্ডের "Billing & Plans" পেজে যান (/owner-dashboard/billing)। মাসিক বা বাৎসরিক টগল সিলেক্ট করে "Upgrade to Heritage Pro" বাটনে ক্লিক করেন।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ধাপ ২: ফ্রন্টএন্ড ব্যাকএন্ডে রিকোয়েস্ট পাঠায়\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'Next.js ফ্রন্টএন্ড RTK Query-এর মাধ্যমে POST /billing/checkout এপিআই কল করে। সাথে ওনারের ইউজার আইডি ও ফ্যামিলি আইডি পাঠানো হয়।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ধাপ ৩: ব্যাকএন্ড ও স্ট্রাইপ (Stripe) গেটওয়ে যোগাযোগ\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'NestJS ব্যাকএন্ড ভেরিফাই করে যে ইউজার সত্যিই ওনার। এরপর অফিসিয়াল Stripe SDK দিয়ে একটি নিরাপদ চেকআউট লিংক তৈরি করে ফ্রন্টএন্ডে পাঠিয়ে দেয়।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ধাপ ৪: ব্যবহারকারী কার্ড দিয়ে পেমেন্ট করেন\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'ইউজারের ব্রাউজার সরাসরি Stripe-এর নিরাপদ পেমেন্ট পেজে চলে যায়। সেখানে ক্রেডিট কার্ড বা অ্যাপল পে দিয়ে পেমেন্ট সম্পন্ন করেন। আমাদের সার্ভারে কোনো কার্ডের গোপন তথ্য আসে না, সম্পূর্ণ নিরাপত্তা স্ট্রাইপ নিশ্চিত করে।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ধাপ ৫: ডাটাবেসে তাৎক্ষণিক কোটা বৃদ্ধি\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'পেমেন্ট সফল হলে স্ট্রাইপ ওয়েবহুক ব্যাকএন্ডকে জানায়। ব্যাকএন্ড Neon PostgreSQL ডাটাবেসের subscriptions টেবিলে tier পরিবর্তন করে HERITAGE_PRO করে দেয় এবং storageLimitMb বাড়িয়ে ৫১,২০০ এমবি (৫০ জিবি) করে দেয়।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ধাপ ৬: পুরো পরিবার সাথে সাথে ৫০ জিবি ব্যবহার করতে পারে\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'পেমেন্ট শেষ করে ওনার ড্যাশবোর্ডে ফিরে আসেন এবং দেখতে পান স্টোরেজ বার সাথে সাথে ৫০ জিবি হয়ে গেছে। সবচেয়ে বড় সুবিধা হলো, পরিবারের বাকি সব মেম্বাররা কোনো টাকা না দিয়েই সাথে সাথে বড় বড় ফাইল ও ছবি আপলোড করতে পারেন।',
              }),
            ],
          }),

          // Section 3
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '৩. প্ল্যানসমূহের তুলনা (Pricing & Feature Table)',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'প্ল্যানের নাম', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'মূল্য (মাসিক / বাৎসরিক)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'স্টোরেজ লিমিট', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'সর্বোচ্চ সদস্য', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'বিশেষ ফিচার', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Free Sanctuary', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: 'ফ্রি ($০)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '৫০০ মেগাবাইট' })] }),
                  new TableCell({ children: [new Paragraph({ text: '২৫ জন' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'বেসিক ফ্যামিলি ট্রি ও মেমোরিজ' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Heritage Pro', bold: true, color: '059669' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '$9.99/মাস ($99/বছর)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '৫০ জিবি (51,200 MB)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '১৫০ জন' })] }),
                  new TableCell({ children: [new Paragraph({ text: '৪K মিডিয়া গ্যালারি, ব্যাচ আপলোড' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dynasty Unlimited', bold: true, color: '7C3AED' })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '$24.99/মাস ($249/বছর)' })] }),
                  new TableCell({ children: [new Paragraph({ text: '৫০০ জিবি (512,000 MB)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'আনলিমিটেড (১০,০০০+)' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GEDCOM ইমপোর্ট, বড় প্রিন্ট পোস্টার' })] }),
                ],
              }),
            ],
          }),

          // Section 4
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '৪. ইউজার সাবস্ক্রিপশন বাতিল (Cancel) করলে কী হবে?',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'গ্রেস পিরিয়ড ও ডেটা নিরাপত্তা:\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'ওনার যদি Stripe Portal থেকে সাবস্ক্রিপশন বাতিল করেন, তবে চলতি মাসের শেষ দিন পর্যন্ত তার পরিবার পুরো ৫০ জিবি সুবিধা ভোগ করতে পারবে। মাস শেষ হলে ফ্রি প্ল্যানে ফিরে গেলেও পরিবারের কোনো পুরনো ছবি বা স্মৃতি ডিলেট করা হবে না! শুধুমাত্র নতুন ফাইল আপলোড সাময়িক বিরতি থাকবে যতক্ষণ না আবার আপগ্রেড করা হয়।',
              }),
            ],
          }),

          // Conclusion
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'এক নজরে মূল পয়েন্ট: ',
                bold: true,
                color: '059669',
              }),
              new TextRun({
                text: 'সাধারণ আত্মীয়দের পেমেন্ট নিয়ে ভাবতে হবে না। পরিবারের ওনার একবার আপগ্রেড করলেই পুরো পরিবার ৫০ জিবি বা ৫০০ জিবির ক্লাউড স্টোরেজ একসাথে উপভোগ করতে পারে।',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const backendDocxPath = path.resolve('..', 'family-together-backend', 'Subscription_Lifecycle_Bangla_Explanation_Guide.docx');
  const frontendDocxPath = path.resolve('.', 'Subscription_Lifecycle_Bangla_Explanation_Guide.docx');

  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);

  // Write markdown .doc file
  const docContent = `# 💳 ফ্যামিলিরুটস সাবস্ক্রিপশন ও বিলিং সিস্টেমের বিস্তারিত ব্যাখ্যা

> **মূল বিষয়:** ইউজার কখন এবং কেন সাবস্ক্রিপশন কিনবেন ও পুরো প্রক্রিয়া কীভাবে কাজ করে।  
> **সিস্টেম মডেল:** স্যাঙ্কচুয়ারি লেভেল আর্কিটেকচার (পরিবারের ওনার পেমেন্ট করবেন, পুরো পরিবার ফ্রি ব্যবহার করবে)।  
> **প্ল্যানসমূহ:** Free Sanctuary (500MB), Heritage Pro (50GB), Dynasty Unlimited (500GB)।  

---

## 📌 ১. একজন ইউজার কখন সাবস্ক্রিপশন নিবেন? (৪টি মূল কারণ)

প্রতিটি নতুন পরিবার একাউন্ট খোলার পর একদম বিনামূল্যে **Free Sanctuary প্ল্যান** পায় (৫০০ মেগাবাইট স্টোরেজ এবং সর্বোচ্চ ২৫ জন সদস্য)। একজন ইউজার নিচের ৪টি পরিস্থিতিতে সাবস্ক্রিপশন আপগ্রেড করেন:

### ১️⃣ ক্লাউড স্টোরেজ ৫০০ এমবি শেষ হয়ে গেলে:
* পরিবারের সদস্যরা যখন হাই-কোয়ালিটি ছবি, পুরনো দিনের স্মৃতি, ভিডিও বা দলিল আপলোড করতে থাকেন, তখন ফ্রি ৫০০ মেগাবাইট পূর্ণ হয়ে যায়।
* স্টোরেজ ৮০% বা ১০০% এ পৌঁছালে ওনার ড্যাশবোর্ডে সতর্কবার্তা দেখতে পান এবং ৫০ জিবি স্টোরেজের জন্য **Heritage Pro ($9.99/মাস)** প্ল্যানে আপগ্রেড করেন।

### ২️⃣ পরিবারের সদস্য সংখ্যা ২৫ জনের বেশি হয়ে গেলে:
* ফ্রি প্ল্যানে সর্বোচ্চ ২৫ জন আত্মীয়কে যুক্ত করা যায়।
* কিন্তু পরিবার বড় হলে (চাচা, মামা, খালা, কাজিন, নাতি-নাতনি) যখন ২৬ তম সদস্যকে ইনভাইট করতে যান, সিস্টেম বলে মেম্বার লিমিট শেষ। তখন ১৫০ জন মেম্বারের জন্য **Heritage Pro** বা আনলিমিটেড মেম্বারের জন্য **Dynasty Unlimited** নিতে হয়।

### ৩️⃣ প্রফেশনাল বংশলতিকা ফিচার (GEDCOM Import ও Poster Print):
* অনেকেই আগে Ancestry.com বা FamilySearch-এ বংশলতিকা বানিয়ে রেখেছেন। তারা সেই পুরো বংশলতিকা এক ক্লিকে \`.ged\` ফাইলের মাধ্যমে ইমপোর্ট করতে চান এবং দেয়ালে টানানোর মতো বড় পোস্টার (SVG/PDF) প্রিন্ট করতে চান। এটি **Dynasty Unlimited ($24.99/মাস)** প্ল্যানের বিশেষ ফিচার।

### ৪️⃣ বার্ষিক ১৭% ছাড় পেয়ে আগেভাগেই প্রো মেম্বার হওয়া:
* পরিবারের প্রধান (Family Owner) নিশ্চিন্তে হাই-ডেফিনিশন স্মৃতি আজীবনের জন্য সংরক্ষণ করতে শুরুতেই বাৎসরিক প্ল্যান ($99/বছর) নিয়ে নেন, যাতে বারবার রিনিউ করার ঝামেলা না থাকে।

---

## 🔄 ২. সাবস্ক্রিপশন নেওয়ার সময় ধাপে ধাপে কী ঘটে? (টেকনিক্যাল ফ্লো)

1. **ধাপ ১: ওনার প্ল্যান পছন্দ করেন**  
   পরিবারের ওনার তার ড্যাশবোর্ডের "Billing & Plans" পেজে যান (\`/owner-dashboard/billing\`)। মাসিক বা বাৎসরিক টগল সিলেক্ট করে "Upgrade to Heritage Pro" বাটনে ক্লিক করেন।
2. **ধাপ ২: ফ্রন্টএন্ড ব্যাকএন্ডে রিকোয়েস্ট পাঠায়**  
   Next.js ফ্রন্টএন্ড RTK Query-এর মাধ্যমে \`POST /billing/checkout\` এপিআই কল করে। সাথে ওনারের ইউজার আইডি ও ফ্যামিলি আইডি পাঠানো হয়।
3. **ধাপ ৩: ব্যাকএন্ড ও স্ট্রাইপ (Stripe) গেটওয়ে যোগাযোগ**  
   NestJS ব্যাকএন্ড ভেরিফাই করে যে ইউজার সত্যিই ওনার। এরপর অফিসিয়াল Stripe SDK দিয়ে একটি নিরাপদ চেকআউট লিংক তৈরি করে ফ্রন্টএন্ডে পাঠিয়ে দেয়।
4. **ধাপ ৪: ব্যবহারকারী কার্ড দিয়ে পেমেন্ট করেন**  
   ইউজারের ব্রাউজার সরাসরি Stripe-এর নিরাপদ পেমেন্ট পেজে চলে যায়। সেখানে ক্রেডিট কার্ড বা অ্যাপল পে দিয়ে পেমেন্ট সম্পন্ন করেন। আমাদের সার্ভারে কোনো কার্ডের গোপন তথ্য আসে না।
5. **ধাপ ৫: ডাটাবেসে তাৎক্ষণিক কোটা বৃদ্ধি**  
   পেমেন্ট সফল হলে স্ট্রাইপ ওয়েবহুক ব্যাকএন্ডকে জানায়। ব্যাকএন্ড Neon PostgreSQL ডাটাবেসের subscriptions টেবিলে tier পরিবর্তন করে \`HERITAGE_PRO\` করে দেয় এবং স্টোরেজ লিমিট বাড়িয়ে ৫১,২০০ এমবি (৫০ জিবি) করে দেয়।
6. **ধাপ ৬: পুরো পরিবার সাথে সাথে ৫০ জিবি ব্যবহার করতে পারে**  
   পেমেন্ট শেষ করে ওনার ড্যাশবোর্ডে ফিরে আসেন এবং দেখতে পান স্টোরেজ বার সাথে সাথে ৫০ জিবি হয়ে গেছে। পরিবারের বাকি সব মেম্বাররা কোনো টাকা না দিয়েই সাথে সাথে বড় বড় ফাইল ও ছবি আপলোড করতে পারেন।

---

## 📊 ৩. প্ল্যানসমূহের তুলনা (Pricing & Feature Table)

| প্ল্যানের নাম | মূল্য (মাসিক / বাৎসরিক) | স্টোরেজ লিমিট | সর্বোচ্চ সদস্য | বিশেষ ফিচার |
| :--- | :--- | :--- | :--- | :--- |
| **Free Sanctuary** | একদম ফ্রি ($০) | ৫০০ মেগাবাইট | ২৫ জন | বেসিক ফ্যামিলি ট্রি ও মেমোরিজ |
| **Heritage Pro** *(জনপ্রিয়)* | **$9.99/মাস** ($99/বছর) | **৫০ জিবি (51,200 MB)** | **১৫০ জন** | ৪K মিডিয়া গ্যালারি, ব্যাচ ফাইল আপলোড |
| **Dynasty Unlimited** | **$24.99/মাস** ($249/বছর) | **৫০০ জিবি (512,000 MB)** | **আনলিমিটেড** | GEDCOM ইমপোর্ট, বড় প্রিন্ট পোস্টার |

---

## 🛡️ ৪. ইউজার সাবস্ক্রিপশন বাতিল (Cancel) করলে কী হবে?

* **গ্রেস পিরিয়ড:** ওনার যদি Stripe Portal থেকে সাবস্ক্রিপশন বাতিল করেন, তবে চলতি মাসের শেষ দিন পর্যন্ত তার পরিবার পুরো ৫০ জিবি সুবিধা ভোগ করতে পারবে।
* **ডেটা নিরাপত্তা:** মাস শেষ হলে ফ্রি প্ল্যানে ফিরে গেলেও **পরিবারের কোনো পুরনো ছবি বা স্মৃতি মুছে ফেলা হবে না**! শুধুমাত্র নতুন ফাইল আপলোড সাময়িক বিরতি থাকবে যতক্ষণ না আবার আপগ্রেড করা হয়।

---
*Generated by Antigravity IDE • FamilyRoots Bangla System Architecture Guide*
`;

  const backendDocPath = path.resolve('..', 'family-together-backend', 'Subscription_Lifecycle_Bangla_Explanation_Guide.doc');
  const frontendDocPath = path.resolve('.', 'Subscription_Lifecycle_Bangla_Explanation_Guide.doc');

  fs.writeFileSync(backendDocPath, docContent, 'utf-8');
  fs.writeFileSync(frontendDocPath, docContent, 'utf-8');

  console.log('✅ Generated Bangla Subscription Explanation Documents successfully:');
  console.log(' -', backendDocxPath);
  console.log(' -', backendDocPath);
  console.log(' -', frontendDocxPath);
  console.log(' -', frontendDocPath);
}

generateBanglaDocument().catch(console.error);
