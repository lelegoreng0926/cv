"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { en, id } from "./dictionary";
import type { Dictionary, Language } from "./dictionary";

type LanguageContextValue = {
  lang: Language;
  setLang: (language: Language) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "dimas-cv-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLanguage] = useState<Language>("en");

  const setLang = useCallback((language: Language) => {
    const scrollY = window.scrollY;
    setLanguage(language);
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The language remains usable for this visit when storage is unavailable.
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- Load the saved language after hydration to keep server and client markup identical. */
  useEffect(() => {
    let savedLanguage: string | null = null;
    try {
      savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Continue with the default language when storage is unavailable.
    }

    if (savedLanguage === "en" || savedLanguage === "id") {
      setLanguage(savedLanguage);
    } else if (navigator.language.toLowerCase().startsWith("id")) {
      setLanguage("id");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: (lang === "en" ? en : id) as Dictionary }),
    [lang, setLang],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
