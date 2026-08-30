export type AppLang = 'hi' | 'en';

export type TranslationDict = Record<string, string>;

/** Shell login + marketing chrome. Hindi is the default language. */
export const TRANSLATIONS: Record<AppLang, TranslationDict> = {
  hi: {
    'common.language': 'भाषा',
    'common.lang.hi': 'हिंदी',
    'common.lang.en': 'EN',
    'common.close': 'बंद करें',
    'common.free': 'मुफ़्त',
    'common.perYear': '/वर्ष',
    'common.loading': 'लोड हो रहा है…',

    'login.brandHome': 'Junction होम',
    'login.plans': 'प्लान',
    'login.eyebrow': 'आपका मोहल्ला, जुड़ा हुआ',
    'login.headline': 'अपना व्यवसाय एक शांत जगह से चलाएँ।',
    'login.story':
      'दुकान, ऑर्डर और ग्राहकों को उन उपकरणों से प्रबंधित करें जो स्थानीय व्यवसायों के काम करने के तरीके के लिए बने हैं।',
    'login.trusted': 'सुरक्षित, पासवर्ड-मुक्त पहुँच',
    'login.progress': 'लॉगिन प्रगति',

    'login.welcome': 'Junction में आपका स्वागत है',
    'login.setupTitle': 'आइए सेटअप करें',
    'login.setupSub': 'कुछ विवरण, फिर हम आपका मोबाइल नंबर सत्यापित करेंगे।',
    'login.fullName': 'पूरा नाम',
    'login.fullNamePh': 'जैसे आरव कुमार',
    'login.nameRequired': 'कृपया अपना नाम दर्ज करें।',
    'login.mobile': 'मोबाइल नंबर',
    'login.mobileInvalid': 'मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।',
    'login.termsAccept': 'मैंने',
    'login.termsLink': 'नियम और शर्तें',
    'login.termsAcceptEnd': 'पढ़ ली हैं।',
    'login.termsHint': 'स्वीकार करने के लिए लिंक खोलें।',
    'login.sending': 'भेजा जा रहा है…',
    'login.sendOtp': 'OTP भेजें',

    'login.editDetails': '← विवरण संपादित करें',
    'login.otpKicker': 'एक त्वरित जाँच',
    'login.otpTitle': 'अपना OTP दर्ज करें',
    'login.otpSub': 'हमने +91 {{phone}} पर 6-अंकीय कोड भेजा है।',
    'login.otpLabel': 'सत्यापन कोड',
    'login.verifying': 'सत्यापित हो रहा है…',
    'login.verifyContinue': 'सत्यापित करें और आगे बढ़ें',

    'login.choosePlan': 'अपना प्लान चुनें',
    'login.plansTitle': 'प्लान और फ़्री ट्रायल',
    'login.trialRunning':
      'आपका {{days}}-दिन का फ़्री ट्रायल पहले से चल रहा है',
    'login.daysLeft': '({{n}} दिन बचे)',
    'login.trialRunningEnd': '। जारी रखें, या स्टार्टर / ग्रोथ / प्रीमियम चुनें।',
    'login.pickPlans':
      'स्टार्टर, ग्रोथ या प्रीमियम चुनें। नए खाते स्वतः {{days}}-दिन के फ़्री ट्रायल पर शुरू होते हैं।',
    'login.freeTrial': 'फ़्री ट्रायल',
    'login.continueTrial': 'फ़्री ट्रायल जारी रखें',
    'login.trialRemaining': '{{n}} दिन बचे · स्वतः बंद',
    'login.manageLater': 'बाद में प्लान पेज पर प्रबंधित करें →',

    'login.pricing': 'मूल्य',
    'login.plansModalTitle': 'प्लान',
    'login.plansModalSub':
      'मोहल्ले की दुकानों के लिए साधारण वार्षिक मूल्य। नए खातों को {{days}}-दिन का फ़्री ट्रायल मिलता है।',
    'login.closePlans': 'प्लान बंद करें',
    'login.trial': 'ट्रायल',
    'login.modalFoot': 'वेटलिस्ट में शामिल होने या फ़्री ट्रायल जारी रखने के लिए लॉग इन करें।',

    'login.legal': 'कानूनी · v{{version}}',
    'login.termsTitle': 'नियम और शर्तें',
    'login.closeTerms': 'शर्तें बंद करें',
    'login.loadingTerms': 'शर्तें लोड हो रही हैं…',
    'login.termsDone': 'मैंने ये शर्तें पढ़ ली हैं',
  },
  en: {
    'common.language': 'Language',
    'common.lang.hi': 'हिंदी',
    'common.lang.en': 'EN',
    'common.close': 'Close',
    'common.free': 'Free',
    'common.perYear': '/year',
    'common.loading': 'Loading…',

    'login.brandHome': 'Junction home',
    'login.plans': 'Plans',
    'login.eyebrow': 'Your neighbourhood, connected',
    'login.headline': 'Run your business from one calm place.',
    'login.story':
      'Manage your storefront, orders and customers with tools designed for the way local businesses work.',
    'login.trusted': 'Secure, password-free access',
    'login.progress': 'Login progress',

    'login.welcome': 'Welcome to Junction',
    'login.setupTitle': 'Let’s get you set up',
    'login.setupSub': 'A few details, then we’ll verify your mobile number.',
    'login.fullName': 'Full name',
    'login.fullNamePh': 'e.g. Aarav Kumar',
    'login.nameRequired': 'Please enter your name.',
    'login.mobile': 'Mobile number',
    'login.mobileInvalid': 'Enter a valid 10-digit Indian mobile number.',
    'login.termsAccept': 'I have read the',
    'login.termsLink': 'Terms and Conditions',
    'login.termsAcceptEnd': '.',
    'login.termsHint': 'Open the link to accept the terms.',
    'login.sending': 'Sending…',
    'login.sendOtp': 'Send OTP',

    'login.editDetails': '← Edit details',
    'login.otpKicker': 'One quick check',
    'login.otpTitle': 'Enter your OTP',
    'login.otpSub': 'We sent a 6-digit code to +91 {{phone}}.',
    'login.otpLabel': 'Verification code',
    'login.verifying': 'Verifying…',
    'login.verifyContinue': 'Verify & continue',

    'login.choosePlan': 'Choose your plan',
    'login.plansTitle': 'Plans & free trial',
    'login.trialRunning': 'Your {{days}}-day free trial is already running',
    'login.daysLeft': '({{n}} days left)',
    'login.trialRunningEnd': '. Continue, or pick Starter / Growth / Premium.',
    'login.pickPlans':
      'Pick Starter, Growth, or Premium. New accounts start on a {{days}}-day free trial automatically.',
    'login.freeTrial': 'Free trial',
    'login.continueTrial': 'Continue with free trial',
    'login.trialRemaining': '{{n}} days remaining · closes automatically',
    'login.manageLater': 'Manage later on Plans page →',

    'login.pricing': 'PRICING',
    'login.plansModalTitle': 'Plans',
    'login.plansModalSub':
      'Simple yearly pricing for neighbourhood shops. New accounts get a {{days}}-day free trial.',
    'login.closePlans': 'Close plans',
    'login.trial': 'TRIAL',
    'login.modalFoot': 'Log in to join a plan waitlist or continue your free trial.',

    'login.legal': 'LEGAL · v{{version}}',
    'login.termsTitle': 'Terms and Conditions',
    'login.closeTerms': 'Close terms',
    'login.loadingTerms': 'Loading terms…',
    'login.termsDone': 'I have read these terms',
  },
};
