import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useLanguageStyles() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.lang = "ar";
      document.documentElement.style.setProperty(
        "--main-font",
        "'Cairo', sans-serif"
      );
      document.documentElement.style.setProperty("--dir", "rtl");
    } else {
      document.documentElement.lang = "en";
      document.documentElement.style.setProperty(
        "--main-font",
        "'Poppins', sans-serif"
      );
      document.documentElement.style.setProperty("--dir", "ltr");
    }
  }, [i18n.language]);
}
