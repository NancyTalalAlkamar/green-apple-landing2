import React, { createContext, useState, useContext, useEffect } from 'react';

export const translations = {
  ar: {
    dir: 'rtl',
    langName: 'العربية',
    // النصوص العربية فارغة هنا لكي تبقى نصوصك الأصلية في الموقع كما هي بدون أي تغيير
  },
  en: {
    dir: 'ltr',
    langName: 'English',
    nav: {
      links: [
        { label: 'Treatments', href: '#treatments' },
        { label: 'Program', href: '#program' },
        { label: 'Results', href: '#results' },
        { label: 'Offers', href: '#offers' },
        { label: 'Contact Us', href: '#contact' },
      ],
      login: 'Login',
      cta: 'Book Consultation',
    },
    hero: {
      badge: 'Latest Global Technologies',
      title: 'Advanced & Custom Devices Fast & Safe Results',
      subtitle: 'We use the best globally certified technologies for body sculpting and skincare without surgery.',
      primaryBtn: 'Book Your Session',
      secondaryBtn: 'View Treatments',
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);