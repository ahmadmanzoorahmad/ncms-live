// Language Context for Internationalization (i18n)

import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation Dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'gov.header.pakistan': 'Government of Pakistan',
    'gov.header.title': 'National Complaint Center',
    'gov.header.signIn': 'Sign In',
    'gov.header.signOut': 'Sign Out',
    'gov.header.notifications': 'Notifications',
    'gov.header.demo': 'Demo',
    'gov.header.live': 'Live',
    'gov.header.demoEnv': 'Demo Environment',
    'gov.header.liveEnv': 'Live Environment',
    
    // Navigation
    'nav.citizen': 'Citizen Portal',
    'nav.callCenter': 'Call Center',
    'nav.agent': 'Agent Dashboard',
    'nav.supervisor': 'Supervisor',
    'nav.executive': 'Executive',
    'nav.audit': 'Audit Trail',
    'nav.admin': 'System Admin',
    'nav.mobile.citizen': 'Citizen Mobile App',
    'nav.mobile.officer': 'Officer Mobile App',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to PDA Complaint Center',
    'dashboard.citizenPortal': 'Citizen Portal',
    'dashboard.totalComplaints': 'Total Complaints',
    'dashboard.pending': 'Pending',
    'dashboard.resolved': 'Resolved',
    'dashboard.critical': 'Critical',
    'dashboard.submitNew': 'Submit New Complaint',
    'dashboard.myComplaints': 'My Complaints',
    'dashboard.searchPlaceholder': 'Search complaints...',
    'dashboard.noResults': 'No complaints found',
    'dashboard.allComplaints': 'All Complaints',
    'dashboard.openComplaints': 'Open',
    'dashboard.resolvedComplaints': 'Resolved',
    
    // Ticket Status
    'status.new': 'New',
    'status.aiAnalysis': 'AI Analysis',
    'status.assigned': 'Assigned',
    'status.inProgress': 'In Progress',
    'status.pending': 'Pending',
    'status.escalated': 'Escalated',
    'status.resolved': 'Resolved',
    'status.closed': 'Closed',
    'status.onHold': 'On Hold',
    'status.autoResolved': 'Auto-Resolved',
    'status.reopened': 'Reopened',
    'status.clientConfirmation': 'Client Confirmation',
    
    // Priority
    'priority.critical': 'Critical',
    'priority.high': 'High',
    'priority.medium': 'Medium',
    'priority.low': 'Low',
    
    // Categories
    'category.technical': 'Technical Issue',
    'category.billing': 'Billing',
    'category.feature': 'Feature Request',
    'category.bug': 'Bug Report',
    'category.account': 'Account Issue',
    'category.inquiry': 'General Inquiry',
    'category.service': 'Service Request',
    'category.infrastructure': 'Infrastructure',
    'category.socialMedia': 'Social Media Complaint',
    'category.harassment': 'Harassment',
    'category.cybercrime': 'Cybercrime',
    'category.publicSafety': 'Public Safety',
    'category.environmental': 'Environmental Issue',
    'category.corruption': 'Corruption Report',
    'category.other': 'Other',
    
    // Login
    'login.title': 'Secure Sign In',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.emailPlaceholder': 'your.email@gov.pk',
    'login.passwordPlaceholder': 'Enter your password',
    'login.signInButton': 'Sign In',
    'login.signingIn': 'Signing in...',
    'login.demoPassword': 'Demo Password',
    'login.quickLogin': 'Demo Mode: Click any role to quick login',
    'login.govPortal': 'Government of Pakistan Portal',
    'login.secure': 'Secure',
    'login.protected': 'Protected',
    'login.verified': 'Government Verified',
    'login.error': 'Invalid email or password. Use demo credentials.',
    
    // Footer
    'footer.about': 'About System',
    'footer.aboutText': 'National Complaint Center enables citizens to register, track, and resolve complaints efficiently through AI-powered automation and transparent processes.',
    'footer.quickLinks': 'Quick Links',
    'footer.howTo': 'How to Register Complaint',
    'footer.track': 'Track Your Complaint',
    'footer.faq': 'FAQs',
    'footer.contact': 'Contact Support',
    'footer.contactUs': 'Contact Us',
    'footer.support247': '24/7 Support Available',
    'footer.secureConfidential': 'Secure & Confidential',
    'footer.copyright': '© 2026 Government of Pakistan. All Rights Reserved.',
    'footer.poweredBy': 'Powered by AI • Blockchain-Ready Architecture • ISO 27001 Certified',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.accessibility': 'Accessibility',
    
    // Common Actions
    'action.view': 'View',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.submit': 'Submit',
    'action.cancel': 'Cancel',
    'action.save': 'Save',
    'action.close': 'Close',
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.export': 'Export',
    'action.print': 'Print',
    
    // SLA
    'sla.onTrack': 'On Track',
    'sla.atRisk': 'At Risk',
    'sla.breached': 'Breached',
    'sla.deadline': 'SLA Deadline',
    
    // Roles
    'role.citizen': 'Citizen',
    'role.callCenter': 'Call Center Officer',
    'role.supportAgent': 'Support Agent',
    'role.fieldEngineer': 'Field Engineer',
    'role.supervisor': 'Supervisor',
    'role.deptHead': 'Department Head',
    'role.executive': 'Executive',
    'role.auditor': 'Auditor',
    'role.sysAdmin': 'System Admin',
    
    // Info
    'info.secure': 'Secure',
    'info.transparent': 'Transparent',
    'info.efficient': 'Efficient',
    'info.service247': '24/7 Service',
    'info.securePlatform': 'Secure Platform',
  },
  ur: {
    // Header
    'gov.header.pakistan': 'حکومتِ پاکستان',
    'gov.header.title': 'نیشنل شکایت سینٹر',
    'gov.header.signIn': 'سائن ان',
    'gov.header.signOut': 'سائن آؤٹ',
    'gov.header.notifications': 'اطلاعات',
    'gov.header.demo': 'ڈیمو',
    'gov.header.live': 'لائیو',
    'gov.header.demoEnv': 'ڈیمو ماحول',
    'gov.header.liveEnv': 'لائیو ماحول',
    
    // Navigation
    'nav.citizen': 'شہری پورٹل',
    'nav.callCenter': 'کال سینٹر',
    'nav.agent': 'ایجنٹ ڈیش بورڈ',
    'nav.supervisor': 'نگران',
    'nav.executive': 'ایگزیکٹو',
    'nav.audit': 'آڈٹ ٹریل',
    'nav.admin': 'سسٹم ایڈمن',
    'nav.mobile.citizen': 'شہری موبائل ایپ',
    'nav.mobile.officer': 'افسر موبائل ایپ',
    
    // Dashboard
    'dashboard.welcome': 'پی ڈی اے شکایت سینٹر میں خوش آمدید',
    'dashboard.citizenPortal': 'شہری پورٹل',
    'dashboard.totalComplaints': 'کُل شکایات',
    'dashboard.pending': 'زیرِ التوا',
    'dashboard.resolved': 'حل شدہ',
    'dashboard.critical': 'نازک',
    'dashboard.submitNew': 'نئی شکایت جمع کروائیں',
    'dashboard.myComplaints': 'میری شکایات',
    'dashboard.searchPlaceholder': 'شکایات تلاش کریں...',
    'dashboard.noResults': 'کوئی شکایات نہیں ملیں',
    'dashboard.allComplaints': 'تمام شکایات',
    'dashboard.openComplaints': 'کھلی ہوئی',
    'dashboard.resolvedComplaints': 'حل شدہ',
    
    // Ticket Status
    'status.new': 'نیا',
    'status.aiAnalysis': 'اے آئی تجزیہ',
    'status.assigned': 'تفویض شدہ',
    'status.inProgress': 'جاری',
    'status.pending': 'زیرِ التوا',
    'status.escalated': 'بڑھایا گیا',
    'status.resolved': 'حل شدہ',
    'status.closed': 'بند',
    'status.onHold': 'رکا ہوا',
    'status.autoResolved': 'خودکار حل',
    'status.reopened': 'دوبارہ کھولا',
    'status.clientConfirmation': 'کلائنٹ کی تصدیق',
    
    // Priority
    'priority.critical': 'انتہائی اہم',
    'priority.high': 'اہم',
    'priority.medium': 'درمیانی',
    'priority.low': 'کم',
    
    // Categories
    'category.technical': 'تکنیکی مسئلہ',
    'category.billing': 'بلنگ',
    'category.feature': 'فیچر کی درخواست',
    'category.bug': 'بگ رپورٹ',
    'category.account': 'اکاؤنٹ کا مسئلہ',
    'category.inquiry': 'عمومی استفسار',
    'category.service': 'سروس کی درخواست',
    'category.infrastructure': 'انفراسٹرکچر',
    'category.socialMedia': 'سوشل میڈیا شکایت',
    'category.harassment': 'مہنکاری',
    'category.cybercrime': 'سائبر کریم',
    'category.publicSafety': 'عمومی ایمنیت',
    'category.environmental': 'بيئی مسئلہ',
    'category.corruption': 'مغرِّزگی رپورٹ',
    'category.other': 'دیگر',
    
    // Login
    'login.title': 'محفوظ سائن ان',
    'login.email': 'ای میل ایڈریس',
    'login.password': 'پاس ورڈ',
    'login.emailPlaceholder': 'your.email@gov.pk',
    'login.passwordPlaceholder': 'اپنا پاس ورڈ درج کریں',
    'login.signInButton': 'سائن ان کریں',
    'login.signingIn': 'سائن ان ہو رہا ہے...',
    'login.demoPassword': 'ڈیمو پاس ورڈ',
    'login.quickLogin': 'ڈیمو موڈ: فوری لاگ ان کے لیے کوئی بھی کردار کلک کریں',
    'login.govPortal': 'حکومتِ پاکستان پورٹل',
    'login.secure': 'محفوظ',
    'login.protected': 'محفوظ شدہ',
    'login.verified': 'سرکاری تصدیق شدہ',
    'login.error': 'غلط ای میل یا پاس ورڈ۔ ڈیمو اسناد استعمال کریں۔',
    
    // Footer
    'footer.about': 'سسٹم کے بارے میں',
    'footer.aboutText': 'پی ڈی اے شکایت سینٹر شہریوں کو اے آئی سے چلنے والے آٹومیشن اور شفاف عمل کے ذریعے شکایات کو رجسٹر، ٹریک اور حل کرنے کی سہولت فراہم کرتا ہے۔',
    'footer.quickLinks': 'فوری لنکس',
    'footer.howTo': 'شکایت رجسٹر کرنے کا طریقہ',
    'footer.track': 'اپنی شکایت ٹریک کریں',
    'footer.faq': 'اکثر پوچھے جانے والے سوالات',
    'footer.contact': 'سپورٹ سے رابطہ کریں',
    'footer.contactUs': 'ہم سے رابطہ کریں',
    'footer.support247': '24/7 سپورٹ دستیاب',
    'footer.secureConfidential': 'محفوظ اور خفیہ',
    'footer.copyright': '© 2026 حکومتِ پاکستان۔ تمام حقوق محفوظ ہیں۔',
    'footer.poweredBy': 'اے آئی سے چلایا • بلاکچین کے لیے تیار • آئی ایس او 27001 تصدیق شدہ',
    'footer.privacy': 'رازداری کی پالیسی',
    'footer.terms': 'استعمال کی شرائط',
    'footer.accessibility': 'رسائی',
    
    // Common Actions
    'action.view': 'دیکھیں',
    'action.edit': 'ترمیم',
    'action.delete': 'حذف کریں',
    'action.submit': 'جمع کرائیں',
    'action.cancel': 'منسوخ کریں',
    'action.save': 'محفوظ کریں',
    'action.close': 'بند کریں',
    'action.search': 'تلاش کریں',
    'action.filter': 'فلٹر',
    'action.export': 'ایکسپورٹ',
    'action.print': 'پرنٹ',
    
    // SLA
    'sla.onTrack': 'ٹریک پر',
    'sla.atRisk': 'خطرے میں',
    'sla.breached': 'خلاف ورزی',
    'sla.deadline': 'ایس ایل اے ڈیڈ لائن',
    
    // Roles
    'role.citizen': 'شہری',
    'role.callCenter': 'کال سینٹر افسر',
    'role.supportAgent': 'سپورٹ ایجنٹ',
    'role.fieldEngineer': 'فیلڈ انجینئر',
    'role.supervisor': 'نگران',
    'role.deptHead': 'ڈپارٹمنٹ کا سربراہ',
    'role.executive': 'ایگزیکٹو',
    'role.auditor': 'آڈیٹر',
    'role.sysAdmin': 'سسٹم ایڈمن',
    
    // Info
    'info.secure': 'محفوظ',
    'info.transparent': 'شفاف',
    'info.efficient': 'موثر',
    'info.service247': '24/7 سروس',
    'info.securePlatform': 'محفوظ پلیٹ فارم',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}