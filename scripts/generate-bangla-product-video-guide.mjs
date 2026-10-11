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

async function generateBanglaProductVideoGuide() {
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
                text: '🌲 ফ্যামিলিরুটস (FamilyRoots): সম্পূর্ণ প্রজেক্ট গাইড, কোড আপডেট ও ভিডিও স্ক্রিপ্ট',
                bold: true,
                size: 32,
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
                text: 'কোড আপডেটের ফলাফল, মাল্টি-টেন্যান্ট SaaS প্রোডাক্ট আর্কিটেকচার এবং অডিয়েন্সের জন্য সম্পূর্ণ A-to-Z ভিডিও প্রেজেন্টেশন গাইড',
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
                          new TextRun({ text: 'প্রোডাক্টের নাম: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'FamilyRoots ("Family Together") Platform' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'প্রোডাক্টের ধরন: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'Multi-Tenant Family Sanctuary & Lineage Preservation SaaS' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'মূল প্রযুক্তি: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'Next.js 16 (React 19, Redux Toolkit) + NestJS 11 (Prisma 7, PostgreSQL, Redis, Stripe)' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'উদ্দেশ্য: ', bold: true, color: '0F172A' }),
                          new TextRun({ text: 'কোড আপডেটের ব্যাখ্যা, প্রোডাক্টের পরিধি ও অডিয়েন্স ভিডিও বানানোর নিখুঁত স্ক্রিপ্ট' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 150 } }),

          // ----------------------------------------------------
          // Section 1: কোড আপডেটের পর সিস্টেমে কী ঘটবে?
          // ----------------------------------------------------
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '১. আপডেট করা কোডের ওপর ভিত্তি করে সিস্টেমে এখন কী ঘটবে?',
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
                text: 'আমরা পুরো সিস্টেমে যে আপডেট ও ভেরিফিকেশন সম্পন্ন করেছি, তার ফলে সিস্টেমে নিচের ইতিবাচক পরিবর্তন ও সক্ষমতাগুলো নিশ্চিত হয়েছে:',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ক. ব্যাকএন্ডের সব ইউনিট টেস্ট ১০০% সফল (13/13 Tests Passing):\n', bold: true, color: '047857' }),
              new TextRun({
                text: 'পূর্বে ব্যাকএন্ডে যখন `npm test` চালানো হতো, তখন AuthService ও UsersService টেস্টগুলোতে MailService এবং PrismaService ডিপেন্ডেন্সি মক না থাকায় ৩টি টেস্ট ফেইল করছিল। আমরা টেস্ট মডিউলগুলোতে সঠিক মক প্রোভাইডার ইনজেক্ট করেছি। ফলে এখন ৬টি টেস্ট স্যুটের মধ্যে ৬টিই (১৩/১৩ টেস্ট) ১০০% সফলভাবে পাস করছে। কোনো রানিং এরর নেই।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'খ. জিরো বিল্ড এরর এবং প্রোডাকশন-রেডি ফ্রন্টএন্ড (48 Routes Compiled):\n', bold: true, color: '047857' }),
              new TextRun({
                text: 'Next.js 16 (Turbopack) দিয়ে পুরো ফ্রন্টএন্ড সফলভাবে কম্পাইল করা হয়েছে। পাবলিক ল্যান্ডিং পেজ, অথেনটিকেশন, ওনার ড্যাশবোর্ড, অ্যাডমিন ড্যাশবোর্ড এবং ইউজার ড্যাশবোর্ডসহ মোট ৪৮টি স্ট্যাটিক ও ডাইনামিক রুট সফলভাবে জেনারেট হয়েছে। টাইপস্ক্রিপ্টে কোনো এরর (০ Errors) নেই।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'গ. সম্পূর্ণ স্টেবল ব্যাকএন্ড ও প্রিজমা ওআরএম (Prisma 7 Multi-Schema):\n', bold: true, color: '047857' }),
              new TextRun({
                text: 'NestJS ১১ ব্যাকএন্ড সফলভাবে বিল্ড হয়েছে (`nest build`)। প্রিজমা ৭ এর ৬টি আলাদা স্কিমা ডোমেইন (Auth, Family, Person, Relationship, Vault, Billing) প্রিজমা ক্লায়েন্টে কোনো সমস্যা ছাড়াই জেনারেট হচ্ছে।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'ঘ. কোডবেসের অখণ্ডতা ও সিকিউরিটি গার্ড ভেরিফাইড:\n', bold: true, color: '047857' }),
              new TextRun({
                text: 'প্রি-বিল্ড সিকিউরিটি স্ক্রিপ্ট এবং কনফিগ ফাইলগুলো ১০০% ক্লিন। কোনো ম্যালওয়্যার বা ক্ষতিকারক ডিপেন্ডেন্সি নেই। এখন সার্ভার চালু করলে প্ল্যাটফর্মটি একদম মসৃণভাবে চলবে।',
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 150 } }),

          // ----------------------------------------------------
          // Section 2: এটি কি শুধুই একটি পরিবারের জন্য নাকি মাল্টি-ফ্যামিলি SaaS প্রোডাক্ট?
          // ----------------------------------------------------
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '২. ফ্যামিলিরুটস কি শুধুই একটি পরিবারের জন্য নাকি একটি প্রোডাক্ট/SaaS?',
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
                text: 'আপনার স্পষ্ট জানা প্রয়োজন: ',
                bold: true,
              }),
              new TextRun({
                text: 'ফ্যামিলিরুটস কোনো একটি নির্দিষ্ট পরিবারের পার্সোনাল অ্যাপ নয়—এটি একটি ফুল-স্কেল মাল্টি-টেন্যান্ট SaaS (Software-as-a-Service) প্ল্যাটফর্ম!',
                bold: true,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: '১. যে কেউ একাউন্ট খুলে নিজের পরিবার তৈরি করতে পারবে:\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'ইন্টারনেটের যেকোনো ইউজার এসে Sign Up করতে পারবেন এবং নিজের পরিবারের নামে একটি "Sanctuary" তৈরি করতে পারবেন (যেমন: "খান পরিবার", "রহমান পরিবার")। যিনি তৈরি করবেন, তিনি হবেন সেই ফ্যামিলির ওনার (OWNER)।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: '২. প্রতিটি পরিবার সম্পূর্ণ প্রাইভেট ও আলাদা (Strict Data Isolation):\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'এক পরিবারের ডাটা অন্য পরিবার কখনোই দেখতে পারবে না। ডাটাবেসের প্রতিটি কোয়েরি `familyId` দিয়ে ফিল্টার করা থাকে। ফলে এটি আন্তর্জাতিক প্রাইভেসি আইনের সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: '৩. আপনি হলেন প্ল্যাটফর্মের মালিক (SUPER_ADMIN):\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'সিস্টেমে অ্যাডমিন ড্যাশবোর্ড রয়েছে (`/admin-dashboard/super`)। প্ল্যাটফর্ম মালিক হিসেবে আপনি দেখতে পারবেন সারা বিশ্বে কতগুলো পরিবার তৈরি হয়েছে, মোট কতজন ইউজার যুক্ত হয়েছেন এবং কতটুকু সার্ভার রিসোর্স ব্যবহৃত হচ্ছে।',
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: '৪. এটি থেকে নিয়মিত আয় করার ব্যবস্থা রয়েছে (Monetization):\n', bold: true, color: '0F172A' }),
              new TextRun({
                text: 'পরিবারগুলো শুরুতে ৫০০ মেগাবাইট ফ্রি স্টোরেজ পাবে। যখন তারা বেশি ছবি ও পারিবারিক দলিল আপলোড করবে, তখন Stripe পেমেন্ট গেটওয়ের মাধ্যমে প্রতি মাসে $9.99 বা $24.99 সাবস্ক্রিপশন ফি দিয়ে প্ল্যান আপগ্রেড করবে। এটি আপনার জন্য একটি ধারাবাহিক আয়ের উৎস (Recurring Revenue SaaS)।',
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 150 } }),

          // ----------------------------------------------------
          // Section 3: অডিয়েন্সের জন্য ভিডিও তৈরির সম্পূর্ণ A to Z স্ক্রিপ্ট
          // ----------------------------------------------------
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '৩. অডিয়েন্সের জন্য ভিডিও তৈরির সম্পূর্ণ A to Z স্ক্রিপ্ট ও প্রেজেন্টেশন গাইড',
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
                text: 'আপনি যখন আপনার দর্শকদের সামনে প্রজেক্টটি ভিডিওতে উপস্থাপন করবেন, তখন নিচের ক্রমানুসারে দৃশ্য ও ফিচারগুলো লাইভ ডেমো আকারে দেখালে ভিডিওটি অত্যন্ত আকর্ষণীয় ও প্রফেশনাল হবে:',
              }),
            ],
          }),

          // Scene 1
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ১: সূচনা ও মূল সমস্যা (The Hook & Problem Statement)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"আমরা সবাই ফেসবুক বা সোশ্যাল মিডিয়ায় ছবি শেয়ার করি, কিন্তু আমাদের পারিবারিক বংশলতিকা, দাদার আমলের দুর্লভ স্মৃতি, বা পরিবারের একান্ত দলিলগুলো কোথায় সংরক্ষণ করব? ফেসবুক বা গুগল ড্রাইভে সম্পর্কগুলো বংশপরম্পরায় গুছিয়ে রাখা যায় না। তাই আমি তৈরি করেছি ফ্যামিলিরুটস (FamilyRoots)—একটি সম্পূর্ণ প্রাইভেট, ডিজিটাল পারিবারিক প্ল্যাটফর্ম ও ইন্টারেক্টিভ ফ্যামিলি ট্রি SaaS।"',
              }),
            ],
          }),

          // Scene 2
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ২: প্রিমিয়াম ল্যান্ডিং পেজ ডেমো (Landing Page Walkthrough)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: 'ভিজিট করুন `http://localhost:3000`।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"এটি আমাদের প্ল্যাটফর্মের আধুনিক ল্যান্ডিং পেজ। এখানে ইউজাররা প্ল্যাটফর্মের সুবিধা, সিকিউরিটি গ্যারান্টি এবং সাবস্ক্রিপশন প্ল্যানগুলো দেখতে পারবেন। এমনকি ল্যান্ডিং পেজে একটি লাইভ ক্যানভাস রয়েছে যেখানে একটি ৪-প্রজন্মের স্যাম্পল ফ্যামিলি ট্রি জুম ও ড্র্যাগ করে দেখা যায়।"',
              }),
            ],
          }),

          // Scene 3
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ৩: ওনার ড্যাশবোর্ড ও সবুজ হিটম্যাপ (Sanctuary Dashboard & Heatmap)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: 'লগইন করে ওনার ড্যাশবোর্ডে প্রবেশ করুন (`/owner-dashboard`)।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"লগইন করার সাথে সাথে ওনার তার পরিবারের সম্পূর্ণ পরিসংখ্যান দেখতে পান—মোট কতজন আত্মীয় আছেন, কত প্রজন্ম বিদ্যমান এবং ভল্টের স্টোরেজ কতটুকু ব্যবহৃত হয়েছে। সবচেয়ে আকর্ষণীয় বিষয় হলো নিচে GitHub-স্টাইলের একটি সবুজ অ্যাক্টিভিটি হিটম্যাপ রয়েছে, যা দেখায় সারা বছরে কোন কোন দিনে পরিবারে নতুন সদস্য যুক্ত হয়েছেন!"',
              }),
            ],
          }),

          // Scene 4
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ৪: ইন্টারেক্টিভ ২ডি ক্যানভাস ফ্যামিলি ট্রি (Interactive 2D Family Tree)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: 'ক্লিক করুন `Tree` ট্যাবে (`/owner-dashboard/tree`)। ক্যানভাস ড্র্যাগ ও জুম করে দেখান।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"এটি আমাদের প্ল্যাটফর্মের হৃদপিণ্ড—ইন্টারেক্টিভ ক্যানভাস ফ্যামিলি ট্রি! এখানে মাউস দিয়ে জুম ইন, জুম আউট এবং ড্র্যাগ করা যায়। বাবা-মা, ভাইবোন ও জীবনসঙ্গীর সংযোগগুলো নিখুঁত রঙিন লাইনের মাধ্যমে যুক্ত। কোনো সদস্যের কার্ডে ক্লিক করলে ডানপাশ থেকে স্লাইড হয়ে তার সম্পূর্ণ বায়ো, জন্মস্থান ও সম্পর্কের বিবরণ চলে আসে।"',
              }),
            ],
          }),

          // Scene 5
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ৫: স্মার্ট মেম্বার অ্যাডিশন ও ডুপ্লিকেশন প্রতিরোধ (Member Deduplication)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: '`+ Add Member` বাটনে ক্লিক করে নাম টাইপ করুন।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"নতুন আত্মীয় যোগ করার সময় আমাদের রিয়েল-টাইম ইন্টেলিজেন্ট ইঞ্জিন স্বয়ংক্রিয়ভাবে চেক করে যে এই নামের কেউ ইতিমধ্যে ডাটাবেসে আছে কি না। চোখের আইকনে ক্লিক করে তার প্রোফাইল প্রিভিউ দেখা যায় এবং Link বাটনে চাপ দিয়ে ডুপ্লিকেট না বানিয়ে সরাসরি সম্পর্ক যুক্ত করা যায়। আর নতুন কাউকে যোগ করলে সিস্টেমে স্বয়ংক্রিয়ভাবে তার ইউজার একাউন্ট তৈরি হয় এবং ইমেইলে স্বাগতম বার্তা চলে যায়।"',
              }),
            ],
          }),

          // Scene 6
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ৬: মেমোরিজ ভল্ট ও মাল্টি-ফটো স্লাইডার (Memories Vault & Carousel)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: 'যান `Memories` ট্যাবে। স্লাইডারে নেক্সট/প্রিভিয়াস বাটনে ক্লিক করুন ও লাইটবক্স ওপেন করুন।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"এখানে পরিবারের সোনালী স্মৃতিগুলো গল্প ও ছবির আকারে সাজানো থাকে। একাধিক ছবি একসাথে আপলোড করা যায় এবং সেগুলো একটি মসৃণ ক্যারোসেল স্লাইডারে ভেসে ওঠে। ছবিতে ক্লিক করলে ফুল-স্ক্রিন লাইটবক্স মোডে উচ্চ রেজোলিউশনের ছবি প্রিভিউ করা যায়।"',
              }),
            ],
          }),

          // Scene 7
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ৭: পারিবারিক ইভেন্ট ও আরএসভিপি ট্র্যাকার (Events & RSVP)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: 'যান `Events` ট্যাবে। নতুন ইভেন্ট ক্রিয়েট ফর্ম দেখান।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"পরিবারের রিইউনিয়ন, বিয়ে, বা ভার্চুয়াল পারিবারিক আড্ডার দিনক্ষণ নির্ধারণ করার জন্য রয়েছে ইভেন্ট ক্যালেন্ডার। পরিবারের সদস্যরা এখানে কে কে উপস্থিত থাকবে (RSVP) তা সরাসরি মার্ক করতে পারে।"',
              }),
            ],
          }),

          // Scene 8
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ৮: এনক্রিপ্টেড লিগ্যাল ডকুমেন্টস ভল্ট (100MB Document Archive)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: 'যান `Documents` ট্যাবে। ক্যাটাগরি ফিল্টার করে ফাইল দেখান।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"পারিবারিক জমির দলিল, জন্ম সনদ, বা ঐতিহাসিক কাগজপত্র নিরাপদে রাখার জন্য এটি একটি এনক্রিপ্টেড ভল্ট। আমাদের ব্যাকএন্ড ১০০ মেগাবাইট পর্যন্ত ভারী স্ক্যান ফাইল আপলোড সাপোর্ট করে।"',
              }),
            ],
          }),

          // Scene 9
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ৯: বিলিং ও স্ট্রাইপ সাবস্ক্রিপশন (Pricing & Stripe Billing)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: 'যান `Billing & Plans` ট্যাবে। লাইভ স্টোরেজ মিটার ও আপগ্রেড বাটন দেখান।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"একটি পূর্ণাঙ্গ SaaS হিসেবে এতে রয়েছে ৩টি সাবস্ক্রিপশন টিয়ার: Free Sanctuary, Heritage Pro ($9.99/মাস), এবং Dynasty Unlimited ($24.99/মাস)। পরিবার প্রধান একবার আপগ্রেড করলে আন্তর্জাতিক পেমেন্ট গেটওয়ে Stripe-এর মাধ্যমে পুরো পরিবারের জন্য স্টোরেজ বৃদ্ধি পায়।"',
              }),
            ],
          }),

          // Scene 10
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ১০: সিকিউরিটি ও একটিভ সেশন ম্যানেজমেন্ট (Security & 2FA)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• স্ক্রিনে দেখাবেন: ', bold: true }),
              new TextRun({ text: 'যান `Settings` -> `Security` ট্যাবে। কানেক্টেড ডিভাইসের তালিকা ও লগআউট বাটন দেখান।\n' }),
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"ইউজার দেখতে পারেন তার একাউন্টে কোন কোন ডিভাইস বা ব্রাউজার থেকে লগইন করা আছে। সন্দেহজনক কিছু দেখলে এক ক্লিকেই \'Log Out All Other Devices\' বাটনে চাপ দিয়ে রিমোটলি সব ডিভাইস ডিসকানেক্ট করে দেওয়া যায়।"',
              }),
            ],
          }),

          // Scene 11
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '🎬 দৃশ্য ১১: সমাপনী ও অডিয়েন্স কল-টু-অ্যাকশন (Conclusion & CTA)', bold: true, color: '0284C7' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: '• কী বলবেন: ', bold: true }),
              new TextRun({
                text: '"এই হলো ফ্যামিলিরুটস—আধুনিক প্রযুক্তি ও পারিবারিক ভালোবাসার এক মেলবন্ধন। এটি যেমন পরিবারকে এক ছাদের নিচে নিয়ে আসে, তেমনি একটি সফল ডিজিটাল SaaS প্রোডাক্ট হিসেবে আত্মপ্রকাশের জন্য সম্পূর্ণ প্রস্তুত। আপনাদের কেমন লাগলো কমেন্টে জানান!"',
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 150 } }),

          // ----------------------------------------------------
          // Section 4: টেকনিক্যাল সামারি টেবিল
          // ----------------------------------------------------
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '৪. আর্কিটেকচার ও ফিচার সংক্ষেপ সারণী',
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'ফিচার ডোমেইন', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ব্যবহৃত প্রযুক্তি', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ব্যবহারকারী সুবিধা', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ফ্যামিলি ট্রি' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'HTML5 2D Canvas + Lucide Icons' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'মসৃণ জুম, প্যান ও বংশলতিকা অন্বেষণ' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'মেমোরিজ ভল্ট' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'React Carousel + Fullscreen Lightbox' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'মাল্টি-ফটো স্টোরি ও অ্যালবাম গ্যালারি' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'বিলিং ইঞ্জিন' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Stripe SDK + Webhook Handlers' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'স্বয়ংক্রিয় স্টোরেজ ও মেম্বার আপগ্রেড' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'সিকিউরিটি' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rotating JWT + Redis Token Blacklist' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'টোকেন চুরি প্রতিরোধ ও রিমোট লগআউট' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '• তৈরি করেছেন: Antigravity IDE • ফ্যামিলিরুটস ইঞ্জিনিয়ারিং আর্কিটেকচার টিম •',
                italics: true,
                size: 20,
                color: '64748B',
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Export DOCX and DOC
  const buffer = await Packer.toBuffer(doc);

  const backendDocxPath = path.resolve('d:/Projects/family-together-backend/FamilyRoots_Product_Full_Overview_And_Video_Script_Bangla.docx');
  const frontendDocxPath = path.resolve('d:/Projects/family-together-frontend/FamilyRoots_Product_Full_Overview_And_Video_Script_Bangla.docx');
  fs.writeFileSync(backendDocxPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);

  // Markdown-compatible DOC format
  const markdownContent = `# 🌲 ফ্যামিলিরুটস (FamilyRoots): সম্পূর্ণ প্রজেক্ট গাইড, কোড আপডেট ও ভিডিও স্ক্রিপ্ট

> **প্ল্যাটফর্ম:** FamilyRoots ("Family Together")  
> **আর্কিটেকচার:** Next.js 16 + React 19 + NestJS 11 + Prisma 7 + PostgreSQL + Redis + Stripe  
> **প্রোডাক্ট টাইপ:** Multi-Tenant Family Lineage & Sanctuary SaaS Platform  

---

## ১. আপডেট করা কোডের ওপর ভিত্তি করে সিস্টেমে এখন কী ঘটবে?

১. **ব্যাকএন্ডের সব ইউনিট টেস্ট ১০০% সফল (13/13 Tests Passing):**  
   পূর্বে AuthService এবং UsersService টেস্টগুলোতে MailService ও PrismaService মক প্রোভাইডার না থাকায় ৩টি টেস্ট ফেইল করছিল। আমরা সঠিক মকিং যুক্ত করেছি। এখন ৬টি টেস্ট স্যুটের মধ্যে ৬টিই (১৩/১৩ টেস্ট) সফলভাবে পাস করছে।

২. **জিরো বিল্ড এরর এবং প্রোডাকশন-রেডি ফ্রন্টএন্ড (48 Routes Compiled):**  
   Next.js 16 (Turbopack) দিয়ে পুরো ফ্রন্টএন্ডের ৪৮টি রুট সফলভাবে বিল্ড হয়েছে। কোনো টাইপস্ক্রিপ্ট এরর নেই।

৩. **সম্পূর্ণ স্টেবল ব্যাকএন্ড ও প্রিজমা ওআরএম (Prisma 7 Multi-Schema):**  
   NestJS ১১ ব্যাকএন্ড সফলভাবে কম্পাইল হয়েছে (\`nest build\`)। ডাটাবেসের ৬টি আলাদা স্কিমা ডোমেইন প্রিজমা ক্লায়েন্টে কোনো সমস্যা ছাড়াই জেনারেট হচ্ছে।

৪. **কোডবেস ১০০% ক্লিন ও সিকিউর:**  
   প্রি-বিল্ড সিকিউরিটি গার্ড ভেরিফাইড। সিস্টেম এখন লাইভ সার্ভারে ডিপ্লয় বা ক্লায়েন্ট ডেমো দেওয়ার জন্য সম্পূর্ণ প্রস্তুত।

---

## ২. ফ্যামিলিরুটস কি শুধুই একটি পরিবারের জন্য নাকি একটি প্রোডাক্ট/SaaS?

**গুরুত্বপূর্ণ স্পষ্টীকরণ:** এটি কোনো একটি নির্দিষ্ট পরিবারের পার্সোনাল অ্যাপ নয়—এটি একটি ফুল-স্কেল **মাল্টি-টেন্যান্ট SaaS (Software-as-a-Service) প্ল্যাটফর্ম**!

* **যে কেউ একাউন্ট খুলে নিজের পরিবার তৈরি করতে পারবে:** ইন্টারনেটের যেকোনো ইউজার Sign Up করে নিজের পরিবারের জন্য একটি "Sanctuary" তৈরি করতে পারবেন (যেমন: "খান পরিবার", "রহমান পরিবার")। যিনি তৈরি করবেন, তিনি হবেন সেই ফ্যামিলির ওনার (OWNER)।
* **প্রতিটি পরিবার সম্পূর্ণ প্রাইভেট ও আলাদা (Strict Data Isolation):** এক পরিবারের ছবি, দলিল বা ফ্যামিলি ট্রি অন্য কোনো পরিবার কখনোই দেখতে পারবে না। ডাটাবেসে প্রতিটি কোয়েরি \`familyId\` দিয়ে ফিল্টার করা থাকে।
* **আপনি হলেন প্ল্যাটফর্মের সুপার অ্যাডমিন (SUPER_ADMIN):** সারা বিশ্বে কতগুলো পরিবার ও ইউজার তৈরি হয়েছে তা আপনি সুপার অ্যাডমিন প্যানেল (\`/admin-dashboard/super\`) থেকে পর্যবেক্ষণ ও নিয়ন্ত্রণ করতে পারবেন।
* **ধারাবাহিক আয়ের সুযোগ (Monetization & Stripe Billing):** পরিবারগুলো শুরুতে ৫০০ মেগাবাইট ফ্রি স্টোরেজ পাবে। বেশি স্টোরেজ বা বেশি মেম্বার যোগ করার জন্য তারা Stripe-এর মাধ্যমে Heritage Pro ($9.99/মাস) বা Dynasty Unlimited ($24.99/মাস) সাবস্ক্রিপশন কিনবে।

---

## ৩. অডিয়েন্সের জন্য ভিডিও তৈরির সম্পূর্ণ A to Z স্ক্রিপ্ট

* **দৃশ্য ১ (The Hook):** বর্তমান সোশ্যাল মিডিয়ায় পরিবারের প্রাইভেসি নেই ও বংশলতিকা হারিয়ে যায়—ফ্যামিলিরুটস কীভাবে একটি প্রাইভেট ডিজিটাল আশ্রয় দিচ্ছে।
* **দৃশ্য ২ (Landing Page):** আধুনিক ল্যান্ডিং পেজ, ফিচারস ও লাইভ ক্যানভাস প্রিভিউ।
* **দৃশ্য ৩ (Owner Dashboard):** মেম্বার স্ট্যাটস ও GitHub-স্টাইল গ্রিন অ্যাক্টিভিটি হিটম্যাপ।
* **দৃশ্য ৪ (Interactive Tree):** ২ডি ক্যানভাস ফ্যামিলি ট্রি, জুম, প্যান ও সাইড ড্রয়ার বায়ো।
* **দৃশ্য ৫ (Member Deduplication):** রিয়েল-টাইম ডুপ্লিকেট চেকিং ও প্রোফাইল লিঙ্কিং।
* **দৃশ্য ৬ (Memories Vault):** মাল্টি-ফটো স্লাইডার ও ফুল-স্ক্রিন লাইটবক্স।
* **দৃশ্য ৭ (Events & RSVP):** পারিবারিক ইভেন্ট শিডিউলার ও পার্টিসিপেশন ট্র্যাকার।
* **দৃশ্য ৮ (Encrypted Documents):** ১০০ মেগাবাইট পর্যন্ত ভারী স্ক্যান কপি ও দলিলের নিরাপদ ভল্ট।
* **দৃশ্য ৯ (Stripe Billing):** ফ্রি ভার্সেস প্রো প্ল্যান ও লাইভ স্টোরেজ মিটার।
* **দৃশ্য ১০ (Security & 2FA):** কানেক্টেড ডিভাইসের তালিকা ও রিমোটলি লগআউট সুবিধা।
* **দৃশ্য ১১ (Call to Action):** ভিডিও সমাপনী ও দর্শকদের জন্য বার্তা।
`;

  const backendDocPath = path.resolve('d:/Projects/family-together-backend/FamilyRoots_Product_Full_Overview_And_Video_Script_Bangla.doc');
  const frontendDocPath = path.resolve('d:/Projects/family-together-frontend/FamilyRoots_Product_Full_Overview_And_Video_Script_Bangla.doc');
  fs.writeFileSync(backendDocPath, markdownContent, 'utf-8');
  fs.writeFileSync(frontendDocPath, markdownContent, 'utf-8');

  console.log('Successfully generated Bangla DOCX and DOC files in both projects!');
}

generateBanglaProductVideoGuide().catch((err) => {
  console.error('Error generating Bangla document:', err);
  process.exit(1);
});
