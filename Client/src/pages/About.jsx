import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className=" text-gray-800 px-4 sm:px-8 lg:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#C69963] mb-2">
          {t("about.title")}
        </h1>
        <p className="text-xs text-gray-500 mb-8">{t("about.subtitle")}</p>

        <div className="space-y-6 text-sm leading-relaxed">
          {/* Our Story */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              {t("about.ourStoryTitle")}
            </h2>
            <p>
              <span className="font-semibold">{t("about.maskan")}</span>{" "}
              {t("about.ourStoryText")}
            </p>
          </section>

          {/* What We Do */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              {t("about.whatWeDoTitle")}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("about.whatWeDoList.item1")}</li>
              <li>{t("about.whatWeDoList.item2")}</li>
              <li>{t("about.whatWeDoList.item3")}</li>
            </ul>
          </section>

          {/* Why Choose Us */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              {t("about.whyChooseTitle")}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-medium">
                  {t("about.whyChooseList.item1title")}
                </span>{" "}
                {t("about.whyChooseList.item1")}
              </li>
              <li>
                <span className="font-medium">
                  {t("about.whyChooseList.item2title")}
                </span>{" "}
                {t("about.whyChooseList.item2")}
              </li>
              <li>
                <span className="font-medium">
                  {t("about.whyChooseList.item3title")}
                </span>{" "}
                {t("about.whyChooseList.item3")}
              </li>
            </ul>
          </section>

          {/* Our Vision */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              {t("about.visionTitle")}
            </h2>
            <p>{t("about.visionText")}</p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#C69963] mb-3">
              {t("about.contactTitle")}
            </h2>
            <p>
              {t("about.contactText")}
              <Link to="/contact" className="underline font-semibold ml-2 mr-2">
                {t("header.contact")}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
