import { useEffect, useState } from "react";
import i18next from "i18next";

export function useLanguage() {
  const getLanguage = () =>
    localStorage.getItem("userLanguagePreference") ||
    localStorage.getItem("i18nextLng") ||
    i18next.language || // fallback to i18next current language
    "en";

  const [lang, setLang] = useState(getLanguage);

  useEffect(() => {
    // Listener for i18next language changes
    const handleLanguageChange = (lng) => {
      setLang(lng);
    };

    i18next.on("languageChanged", handleLanguageChange);

    return () => {
      i18next.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return lang;
}
