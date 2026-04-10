import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import your JSON files
import enTranslation from "./locales/en.json";
import mmTranslation from "./locales/mm.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  mm: {
    translation: mmTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    // This helps detect 'mm' vs 'mm-MM'
    supportedLngs: ["en", "mm"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;