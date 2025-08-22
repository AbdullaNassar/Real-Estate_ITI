import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SEO from "../component/SEO";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000 }); // 1000ms animation
  }, []);

  return (
    <div className="text-gray-800 bg-gray-50">
      <SEO
        title="About Maskn | Your Partner in Renting Homes Across Egypt"
        description="Learn more about Maskn and how we help you find the best homes for rent in Egypt."
      />
      {/* Hero Section */}
      <div
        data-aos="fade-down"
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#C69963] via-[#d4a574] to-[#b8935a]"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl opacity-20"></div>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-16 h-16 border-2 border-white/20 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-16 w-12 h-12 border-2 border-white/30 rotate-12"></div>
          <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/10 rounded-full animate-bounce"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t("about.title")}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>
          <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 sm:px-8 lg:px-20 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {/* Our Story - Text Left, Image Right */}
            <section
              data-aos="fade-left"
              className="bg-gray-50 shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 order-1">
                  <h2 className="text-xl font-semibold text-[#C69963] mb-4">
                    {t("about.ourStoryTitle")}
                  </h2>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">{t("about.maskan")}</span>{" "}
                    {t("about.ourStoryText")}
                  </p>
                </div>
                <div className="w-full md:w-1/2 order-2">
                  <img
                    src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Our Story"
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
              </div>
            </section>

            {/* What We Do - Image Left, Text Right */}
            <section
              data-aos="fade-right"
              className="bg-gray-50 shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                  <img
                    // src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    // src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="What We Do"
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2">
                  <h2 className="text-xl font-semibold text-[#C69963] mb-4">
                    {t("about.whatWeDoTitle")}
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                    <li>{t("about.whatWeDoList.item1")}</li>
                    <li>{t("about.whatWeDoList.item2")}</li>
                    <li>{t("about.whatWeDoList.item3")}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Why Choose Us - Text Left, Image Right */}
            <section
              data-aos="fade-left"
              className="bg-gray-50 shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 order-1">
                  <h2 className="text-xl font-semibold text-[#C69963] mb-4">
                    {t("about.whyChooseTitle")}
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
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
                </div>
                <div className="w-full md:w-1/2 order-2">
                  <img
                    src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Why Choose Us"
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
              </div>
            </section>

            {/* Our Vision - Image Left, Text Right */}
            <section
              data-aos="fade-right"
              className="bg-gray-50 shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Our Vision"
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2">
                  <h2 className="text-xl font-semibold text-[#C69963] mb-4">
                    {t("about.visionTitle")}
                  </h2>
                  <p className="text-sm leading-relaxed">
                    {t("about.visionText")}
                  </p>
                </div>
              </div>
            </section>

            {/* Contact - Text Left, Image Right */}
            <section
              data-aos="fade-left"
              className="bg-gray-50 shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 order-1">
                  <h2 className="text-xl font-semibold text-[#C69963] mb-4">
                    {t("about.contactTitle")}
                  </h2>
                  <p className="text-sm leading-relaxed">
                    {t("about.contactText")}
                    <a
                      href="#"
                      className="underline font-semibold ml-2 mr-2 text-[#C69963] hover:text-[#b8935a] transition-colors"
                    >
                      {t("header.contact")}
                    </a>
                  </p>
                </div>
                <div className="w-full md:w-1/2 order-2">
                  <img
                    src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Contact Us"
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
