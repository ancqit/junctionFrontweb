export type AppLang = 'hi' | 'en';

export type TranslationDict = Record<string, string>;

export const TRANSLATIONS: Record<AppLang, TranslationDict> = {
  hi: {
    'plans.eyebrow': 'सदस्यता',
    'plans.title': 'प्लान',
    'plans.sub':
      'वेटलिस्ट में शामिल होने के लिए प्लान चुनें, या देखें कि आप पहले से सूची में हैं या नहीं।',
    'plans.refresh': 'रिफ्रेश',
    'plans.tab.plans': 'प्लान',
    'plans.tab.waitlist': 'वेटलिस्ट',
    'plans.lang.hi': 'हिंदी',
    'plans.lang.en': 'EN',
    'plans.loading': 'प्लान लोड हो रहे हैं…',
  },
  en: {
    'plans.eyebrow': 'SUBSCRIPTION',
    'plans.title': 'Plans',
    'plans.sub':
      'Choose a plan to join the waitlist, or check whether you’re already on it. Toggle between catalog and waitlist status anytime.',
    'plans.refresh': 'Refresh',
    'plans.tab.plans': 'Plans',
    'plans.tab.waitlist': 'Waitlist',
    'plans.lang.hi': 'हिंदी',
    'plans.lang.en': 'EN',
    'plans.loading': 'Loading plans…',
  },
};
