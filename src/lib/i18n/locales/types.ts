export interface TranslationDictionary {
  [key: string]: string | undefined;

  // Navigation
  "nav.about": string;
  "nav.features": string;
  "nav.pricing": string;
  "nav.faq": string;
  "nav.support": string;
  "nav.signin": string;
  "nav.getStarted": string;
  "nav.createAccount": string;
  "nav.dashboard": string;
  "nav.logout": string;

  // Home Hero
  "home.badge": string;
  "home.title": string;
  "home.titleHighlight": string;
  "home.subtitle": string;
  "home.createFamily": string;
  "home.exploreDemo": string;
  "home.exploreFeatures": string;

  // Features Section
  "features.badge": string;
  "features.title": string;
  "features.titleHighlight": string;
  "features.subtitle": string;

  // Pricing Section
  "pricing.badge": string;
  "pricing.title": string;
  "pricing.titleHighlight": string;
  "pricing.subtitle": string;

  // About Section
  "about.badge": string;
  "about.title": string;
  "about.titleHighlight": string;
  "about.subtitle": string;

  // FAQ Section
  "faq.badge": string;
  "faq.title": string;
  "faq.titleHighlight": string;
  "faq.subtitle": string;

  // Footer
  "footer.tagline": string;
  "footer.product": string;
  "footer.company": string;
  "footer.security": string;
  "footer.rights": string;
  "footer.secure": string;

  // Geolocation / Language Switcher
  "geo.detectedLocation": string;
  "geo.autoSwitched": string;
  "geo.switchLanguage": string;
  "geo.selectLanguage": string;

  // Profile Language Section
  "profile.langTitle"?: string;
  "profile.langDesc"?: string;
  "profile.langActive"?: string;
  "profile.langSearch"?: string;
  "profile.langChangedToast"?: string;
}

export type TranslationKey = keyof TranslationDictionary;
