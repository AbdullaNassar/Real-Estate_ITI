import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useLanguageStyles() {
  const { i18n } = useTranslation();

  // Function to detect browser language
  const detectBrowserLanguage = () => {
    const browserLang = navigator.language || navigator.userLanguage;
    // Check if browser language starts with 'ar'
    if (browserLang.startsWith("ar")) {
      return "ar";
    }
    // Default to English for other languages
    return "en";
  };

  // Function to get preferred language with priority order
  const getPreferredLanguage = () => {
    // Priority 1: User's explicit choice
    const userPreference = localStorage.getItem("userLanguagePreference");
    if (
      userPreference &&
      (userPreference === "ar" || userPreference === "en")
    ) {
      return userPreference;
    }

    // Priority 2: i18next stored language
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang && (storedLang === "ar" || storedLang === "en")) {
      return storedLang;
    }

    // Priority 3: Browser language detection
    return detectBrowserLanguage();
  };

  useEffect(() => {
    // Get the preferred language based on priority
    const preferredLang = getPreferredLanguage();

    // Only change language if it's different from current
    if (i18n.language !== preferredLang) {
      i18n.changeLanguage(preferredLang);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    // Apply styles based on current language
    if (i18n.language === "ar") {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
      document.documentElement.style.setProperty(
        "--main-font",
        "'Cairo', sans-serif"
      );
      document.documentElement.style.setProperty("--dir", "rtl");
    } else {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
      document.documentElement.style.setProperty(
        "--main-font",
        "'Poppins', sans-serif"
      );
      document.documentElement.style.setProperty("--dir", "ltr");
    }
  }, [i18n.language]);

  // Return current language info for debugging (optional)
  return {
    currentLanguage: i18n.language,
    browserLanguage: detectBrowserLanguage(),
    hasUserPreference: !!localStorage.getItem("userLanguagePreference"),
  };
}
