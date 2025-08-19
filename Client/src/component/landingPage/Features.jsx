import { Globe, Heart, Home, Leaf, Shield, Users } from "lucide-react";
import React from "react";
import Animation from "../../ui/animated/Animation";
import { useTranslation } from "react-i18next";

export default function Features() {
 const {t} =  useTranslation()
  return (
    <Animation>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t("features.title")}
            </h2>
            <p className="text-xl text-gray-600">
             {t("features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
            <div className="text-center group">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Users className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {t("features.list.community.title")}
              </h3>
              <p className="text-gray-600">
                 {t("features.list.community.description")}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Heart className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                     {t("features.list.authenticity.title")}
              </h3>
              <p className="text-gray-600">
                      {t("features.list.authenticity.description")}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Shield className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
               {t("features.list.trust.title")}
              </h3>
              <p className="text-gray-600">
                 {t("features.list.trust.description")}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Globe className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {t("features.list.inclusivity.title")}
              </h3>
              <p className="text-gray-600">
                 {t("features.list.inclusivity.description")}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Leaf className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {t("features.list.sustainability.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.list.sustainability.description")}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Home className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {t("features.list.comfort.title")}
              </h3>
              <p className="text-gray-600">
               {t("features.list.comfort.description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Animation>
  );
}
