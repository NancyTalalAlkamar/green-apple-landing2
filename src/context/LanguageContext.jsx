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
        { label: 'Treatments', href: '#services' },
        { label: 'Program', href: '#journey' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact Us', href: '#contact' },
      ],
      login: 'Login',
      cta: 'Book Consultation',
    },
    hero: {
      badge: 'Devices & Technology',
      title: 'Non-surgical devices chosen for your plan',
      subtitle: 'We choose the device and the number of sessions after your assessment, and track progress with consistent measurements.',
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