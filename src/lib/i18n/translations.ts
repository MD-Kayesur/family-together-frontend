import { translations, TranslationKey } from "./locales";

export type Language =
  | "en"
  | "bn"
  | "es"
  | "fr"
  | "de"
  | "ar"
  | "hi"
  | "zh"
  | "pt"
  | "ja"
  | "ru"
  | "it"
  | "ko"
  | "tr"
  | "ur"
  | "id"
  | "ms"
  | "vi"
  | "th"
  | "nl"
  | "pl"
  | "sv"
  | "el"
  | "fa"
  | "tl";

export interface SupportedLanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  direction?: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: SupportedLanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", direction: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", direction: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", direction: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", direction: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", direction: "rtl" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", direction: "ltr" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳", direction: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", direction: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", direction: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", direction: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", direction: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", direction: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", direction: "ltr" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", direction: "rtl" },
  // 10 Additional World Languages
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", direction: "ltr" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾", direction: "ltr" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", direction: "ltr" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", direction: "ltr" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", direction: "ltr" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", direction: "ltr" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", direction: "ltr" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", direction: "ltr" },
  { code: "fa", name: "Persian (Farsi)", nativeName: "فارسی", flag: "🇮🇷", direction: "rtl" },
  { code: "tl", name: "Filipino (Tagalog)", nativeName: "Tagalog", flag: "🇵🇭", direction: "ltr" },
];

/**
 * Mapping ISO 3166-1 alpha-2 country codes to default languages
 */
export const COUNTRY_TO_LANGUAGE_MAP: Record<string, Language> = {
  BD: "bn", // Bangladesh
  IN: "hi", // India
  US: "en", // United States
  GB: "en", // United Kingdom
  CA: "en", // Canada
  AU: "en", // Australia
  NZ: "en", // New Zealand
  ES: "es", // Spain
  MX: "es", // Mexico
  AR: "es", // Argentina
  CO: "es", // Colombia
  FR: "fr", // France
  BE: "fr", // Belgium
  DE: "de", // Germany
  AT: "de", // Austria
  CH: "de", // Switzerland
  SA: "ar", // Saudi Arabia
  AE: "ar", // UAE
  EG: "ar", // Egypt
  KW: "ar", // Kuwait
  QA: "ar", // Qatar
  OM: "ar", // Oman
  CN: "zh", // China
  TW: "zh", // Taiwan
  BR: "pt", // Brazil
  PT: "pt", // Portugal
  JP: "ja", // Japan
  RU: "ru", // Russia
  IT: "it", // Italy
  KR: "ko", // South Korea
  TR: "tr", // Turkey
  PK: "ur", // Pakistan
  ID: "id", // Indonesia
  MY: "ms", // Malaysia
  VN: "vi", // Vietnam
  TH: "th", // Thailand
  NL: "nl", // Netherlands
  PL: "pl", // Poland
  SE: "sv", // Sweden
  GR: "el", // Greece
  IR: "fa", // Iran
  PH: "tl", // Philippines
};

export { translations };
export type { TranslationKey };

export function getTranslation(
  lang: Language,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dictionary = (translations as unknown as Record<string, Record<string, string>>)[lang] || translations.en;
  let text: string = String(dictionary?.[key] || translations.en[key] || key);

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(value));
    });
  }

  return text;
}
