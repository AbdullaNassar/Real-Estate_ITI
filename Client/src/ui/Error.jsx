import React from "react";
import { useTranslation } from "react-i18next";

export default function Error({ message = "" }) {
  const { t } = useTranslation();
  return (
    <h1 className="text-center mt-8 text-3xl">
      ❌ {t("errors.Something Wrong happened...")}
      {message}
    </h1>
  );
}
