import { CreditCard, Heart, Search } from "lucide-react";
import Animation from "../../ui/animated/Animation";
import { useTranslation } from "react-i18next";

export default function HowItWork() {
   const { t } = useTranslation();
  return (
    <Animation>
      <section className="py-20 bg-gray-50 text-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("howItWorks.title")}</h2>
            <p className="text-xl ">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Search className="w-10 h-10 text-amber-700" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {t("howItWorks.searchTitle")}
              </h3>
              <p className=" leading-relaxed">
                {t("howItWorks.searchText")}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <CreditCard className="w-10 h-10 text-amber-700" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                 {t("howItWorks.bookTitle")}
              </h3>
              <p className=" leading-relaxed">
                 {t("howItWorks.bookText")}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Heart className="w-10 h-10 text-amber-700" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {t("howItWorks.enjoyTitle")}
              </h3>
              <p className=" leading-relaxed">
                {t("howItWorks.enjoyText")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Animation>
  );
}
