export type Language = "en" | "bn";

export interface SupportedLanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
];

/**
 * Mapping ISO 3166-1 alpha-2 country codes to default languages
 */
export const COUNTRY_TO_LANGUAGE_MAP: Record<string, Language> = {
  BD: "bn", // Bangladesh
  IN: "en", // India (fallback to en, can be customized)
  US: "en", // United States
  GB: "en", // United Kingdom
  CA: "en", // Canada
  AU: "en", // Australia
  NZ: "en", // New Zealand
  SG: "en", // Singapore
  MY: "en", // Malaysia
  AE: "en", // UAE
  SA: "en", // Saudi Arabia
  KW: "en", // Kuwait
  QA: "en", // Qatar
  OM: "en", // Oman
};

export const translations = {
  en: {
    // Navigation
    "nav.about": "About",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.support": "Support",
    "nav.signin": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.createAccount": "Create Account",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Logout",

    // Home Hero
    "home.badge": "Next-Gen Family Sanctuary",
    "home.title": "Your family,",
    "home.titleHighlight": "connected.",
    "home.subtitle":
      "Build your private family network, preserve memories, and understand every relationship across generations in a beautiful, modern space.",
    "home.createFamily": "Create Your Family",
    "home.exploreDemo": "Explore Demo",
    "home.exploreFeatures": "Explore Features",

    // Features Section
    "features.badge": "Platform Capabilities",
    "features.title": "Everything your family needs,",
    "features.titleHighlight": "in one private sanctuary.",
    "features.subtitle":
      "Explore the engineering and architecture behind FamilyRoots: from dynamic 2D genealogical mapping and intelligent deduplication to encrypted 100MB document preservation.",

    // Pricing Section
    "pricing.badge": "Transparent Sanctuary Pricing",
    "pricing.title": "Simple, honest pricing",
    "pricing.titleHighlight": "for every family clan.",
    "pricing.subtitle":
      "Start with our Free Forever tier or choose an expanded capacity plan for high-resolution document scans, lifelong photo vaults, and historical exports.",

    // About Section
    "about.badge": "Dedicated Family Sanctuary",
    "about.title": "Preserving your heritage,",
    "about.titleHighlight": "connected forever.",
    "about.subtitle":
      "FamilyRoots is an invite-only private digital sanctuary for multi-generational families. We replace scattered messaging chats and public social feeds with an interactive 2D family tree, encrypted photo and document vaults, and generational preservation.",

    // FAQ Section
    "faq.badge": "Knowledge Base & FAQ",
    "faq.title": "Frequently asked questions,",
    "faq.titleHighlight": "clearly answered.",
    "faq.subtitle":
      "Find answers to common questions about tree mapping, ancestor accounts, real-time deduplication, security boundaries, and subscription plans.",

    // Footer
    "footer.tagline":
      "Your private sanctuary for preserving family history and connecting generations in a secure, modern space.",
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.security": "Security & Privacy",
    "footer.rights": "All rights reserved.",
    "footer.secure": "Secure & Private Sanctuary",

    // Geolocation / Language Switcher
    "geo.detectedLocation": "Location detected: {city}, {country}",
    "geo.autoSwitched": "Language automatically set based on your location ({country}).",
    "geo.switchLanguage": "Language",
    "geo.selectLanguage": "Select Language",
  },

  bn: {
    // Navigation
    "nav.about": "পরিচিতি",
    "nav.features": "ফিচারসমূহ",
    "nav.pricing": "মূল্যতালিকা",
    "nav.faq": "প্রশ্নোত্তর",
    "nav.support": "সহায়তা কেন্দ্র",
    "nav.signin": "লগইন করুন",
    "nav.getStarted": "শুরু করুন",
    "nav.createAccount": "একাউন্ট খুলুন",
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.logout": "লগআউট",

    // Home Hero
    "home.badge": "আধুনিক ডিজিটাল ফ্যামিলি স্যাংকচুয়ারি",
    "home.title": "আপনার পরিবার,",
    "home.titleHighlight": "সবসময় একসাথে।",
    "home.subtitle":
      "বংশপরম্পরার শিকড় সংরক্ষণ করুন, অমূল্য স্মৃতিগুলো আজীবন সাজিয়ে রাখুন এবং পারিবারিক সম্পর্কগুলো জানুন একটি সুরক্ষিত, আধুনিক ডিজিটাল প্ল্যাটফর্মে।",
    "home.createFamily": "আপনার ফ্যামিলি শুরু করুন",
    "home.exploreDemo": "ডেমো দেখুন",
    "home.exploreFeatures": "ফিচারসমূহ দেখুন",

    // Features Section
    "features.badge": "প্ল্যাটফর্মের সক্ষমতা",
    "features.title": "পরিবারের প্রতিটি প্রয়োজনীয় সুবিধা,",
    "features.titleHighlight": "একটিমাত্র সুরক্ষিত ভল্টে।",
    "features.subtitle":
      "ফ্যামিলিরুটসের মূল প্রযুক্তি জানুন: ইন্টারেক্টিভ ২ডি ফ্যামিলি ট্রি, রিয়েল-টাইম ডিডুপ্লিকেশন ইঞ্জিন এবং ১০০ মেগাবাইট পর্যন্ত সুরক্ষিত দলিল সংরক্ষণ।",

    // Pricing Section
    "pricing.badge": "স্বচ্ছ ও সহজ মূল্যতালিকা",
    "pricing.title": "স্বচ্ছ ও সাশ্রয়ী প্ল্যান,",
    "pricing.titleHighlight": "প্রতিটি বংশের জন্য।",
    "pricing.subtitle":
      "আমাদের আজীবন ফ্রি প্ল্যানে তাৎক্ষণিক শুরু করুন, অথবা হাই-রেজ্যুলুশন ঐতিহাসিক দলিল ও আজীবন আনলিমিটেড মেম্বারদের জন্য প্রিমিয়াম বেছে নিন।",

    // About Section
    "about.badge": "নিবেদিত ফ্যামিলি স্যাংকচুয়ারি",
    "about.title": "আপনার পারিবারিক ঐতিহ্য,",
    "about.titleHighlight": "সুরক্ষিত থাকবে প্রজন্মান্তরে।",
    "about.subtitle":
      "ফ্যামিলিরুটস হলো মাল্টি-জেনারেশন পরিবারের জন্য একটি প্রাইভেট ডিজিটাল আশ্রয়স্থল। বিশৃঙ্খল চ্যাট গ্রুপ ও পাবলিক সোশ্যাল ফিডের বদলে আমরা দিচ্ছি সম্পূর্ণ নিরাপদ পারিবারিক ভল্ট।",

    // FAQ Section
    "faq.badge": "সহায়তা ও প্রশ্নোত্তর",
    "faq.title": "সাধারণ জিজ্ঞাসাসমূহ,",
    "faq.titleHighlight": "সহজ ও স্পষ্ট উত্তর।",
    "faq.subtitle":
      "ফ্যামিলি ট্রি তৈরি, পূর্বপুরুষদের প্রোফাইল যোগ করা, ডুপ্লিকেট রোধ এবং নিরাপত্তা ও প্ল্যান সংক্রান্ত সমস্ত প্রশ্নের উত্তর একনজরে দেখুন।",

    // Footer
    "footer.tagline":
      "আপনার পারিবারিক ইতিহাস রক্ষা এবং প্রজন্মগুলোকে সংযুক্ত করার জন্য এক নিভৃত, সুরক্ষিত ডিজিটাল আশ্রয়স্থল।",
    "footer.product": "প্রোডাক্ট",
    "footer.company": "কোম্পানি",
    "footer.security": "নিরাপত্তা ও গোপনীয়তা",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    "footer.secure": "সুরক্ষিত ও সম্পূর্ণ ব্যক্তিগত প্ল্যাটফর্ম",

    // Geolocation / Language Switcher
    "geo.detectedLocation": "শনাক্তকৃত লোকেশন: {city}, {country}",
    "geo.autoSwitched": "আপনার ভৌগোলিক অবস্থান ({country}) অনুযায়ী ভাষা স্বয়ংক্রিয়ভাবে নির্ধারণ করা হয়েছে।",
    "geo.switchLanguage": "ভাষা পরিবর্তন",
    "geo.selectLanguage": "ভাষা নির্বাচন করুন",
  },
};

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(
  lang: Language,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dictionary = translations[lang] || translations.en;
  let text = dictionary[key] || translations.en[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(value));
    });
  }

  return text;
}
