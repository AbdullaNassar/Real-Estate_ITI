import { Star, Users } from "lucide-react";
import React from "react";
import Animation from "../../ui/animated/Animation";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <Animation>
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t("testimonials.title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("testimonials.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-primarry fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-800 mb-6 leading-relaxed">
                {t("testimonials.review1.text")}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primarry rounded-full flex items-center justify-center">
                  <img
                    src="/imgs/face2.jpg"
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">
                    {t("testimonials.review1.name")}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {t("testimonials.review1.role")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-primarry fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t("testimonials.review2.text")}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primarry rounded-full flex items-center justify-center">
                  <img
                    src="/imgs/face3.jpg"
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">
                    {" "}
                    {t("testimonials.review2.name")}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {" "}
                    {t("testimonials.review2.role")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-primarry fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t("testimonials.review3.text")}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primarry rounded-full flex items-center justify-center">
                  <img
                    src="/imgs/face1.jpg"
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">
                    {" "}
                    {t("testimonials.review3.name")}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {" "}
                    {t("testimonials.review3.role")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Animation>
  );
}
