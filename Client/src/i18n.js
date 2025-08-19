// src/i18n.js
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationAR from "./locales/ar/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR },
    },

    // REMOVED: lng: "en" - This was forcing English every time!
    // lng: "en", // Remove this line to allow detection

    fallbackLng: "en", // Keep as fallback only
    debug: process.env.NODE_ENV === "development", // Enable debug in development

    interpolation: {
      escapeValue: false,
    },

    // Language detection configuration
    detection: {
      // Priority order: stored preference > browser language > fallback
      order: [
        "localStorage", // Check localStorage first (user preference)
        "navigator", // Then check browser language
        "htmlTag", // Then HTML lang attribute
      ],

      // Cache the detected/selected language
      caches: ["localStorage"],

      // Key for localStorage
      lookupLocalStorage: "i18nextLng",

      // Only detect supported languages
      checkWhitelist: true,
    },

    // Define supported languages
    supportedLngs: ["en", "ar"],

    // Clean language codes (e.g., 'en-US' becomes 'en')
    cleanCode: true,

    // Load strategy
    load: "languageOnly",
  });

export default i18n;
