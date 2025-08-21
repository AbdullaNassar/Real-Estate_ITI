import React from "react";
import { useTranslation } from "react-i18next";
import SEO from "../component/SEO";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <div className=" text-gray-800 px-4 sm:px-8 lg:px-20 py-10">
      <SEO
        title="Privacy Policy | Maskn"
        description="Understand how Maskn protects your data and privacy when you book or list a property in Egypt."
      />
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#C69963] mb-2">
          {t("privacy.title")}
        </h1>
        <p className="text-xs text-gray-500 mb-8">
          {t("privacy.lastUpdated")} {new Date().toLocaleDateString()}
        </p>

        {/* Card Wrapper for Each Section */}
        <div className="space-y-6 text-sm leading-relaxed">
          {/* Intro */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <p>{t("privacy.intro")}</p>
          </section>

          {/* Info We Collect */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              1. {t("privacy.info.title")}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("privacy.info.item1")}</li>
              <li>{t("privacy.info.item2")}</li>
              <li>{t("privacy.info.item3")}</li>
            </ul>
          </section>

          {/* How We Use */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              2. {t("privacy.usage.title")}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li> {t("privacy.usage.item1")}</li>
              <li> {t("privacy.usage.item2")}</li>
              <li> {t("privacy.usage.item3")}</li>
              <li> {t("privacy.usage.item4")}</li>
            </ul>
          </section>

          {/* Sharing */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              3. {t("privacy.sharing.title")}
            </h2>
            <p>{t("privacy.sharing.text")}</p>
          </section>

          {/* Security */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              4. {t("privacy.security.title")}
            </h2>
            <p>{t("privacy.security.text")}</p>
          </section>

          {/* Your Rights */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              5. {t("privacy.rights.title")}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("privacy.rights.item1")}</li>
              <li>{t("privacy.rights.item2")}</li>
              <li>{t("privacy.rights.item3")}</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              6. {t("privacy.contact.title")}
            </h2>
            <p>{t("privacy.contact.text")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
