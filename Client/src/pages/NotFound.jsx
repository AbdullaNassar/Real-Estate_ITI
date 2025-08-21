import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SEO from "../component/SEO";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <section className="py-10 bg-white h-screen">
      <SEO
        title={`Page Not Found | Maskn`}
        description={`Oops! The page you're looking for does not exist on Maskn.`}
      />
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-[80px] text-gray-700 font-bold">404</h1>
          <div
            className="h-[30vh] bg-center bg-no-repeat flex items-center justify-center"
            style={{
              backgroundImage:
                "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
            }}
          ></div>
          <div className="mt-6">
            <h3 className="text-[40px] font-semibold text-gray-800">
              {t("notFound.title")}
            </h3>
            <p className="text-gray-600 mt-2">{t("notFound.subtitle")}</p>
            <Link
              to="/"
              className="inline-block mt-6 px-6 py-3 bg-primarry text-white text-lg rounded hover:bg-primarry-hover transition"
            >
              {t("notFound.button")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
