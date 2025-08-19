import React, { useState } from "react";
import hero from "/imgs/hero.jpg";
import TextType from "../../ui/TextType";
import AnimatedContent from "../../ui/AnimatedContent";
import FadeContent from "../../ui/FadeContent";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  function handleClickSearch() {
    if (!query) {
      toast.error(t("hero.toastError"));
      return;
    }
    navigate(`/listings?query=${query}`);
  }
  return (
    <div className="shadow-2xl relative bg-[url('/imgs/hero.jpg')] bg-center bg-cover min-h-[80vh] w-full text-center">
      <div className="absolute inset-0 bg-black/50 bg-opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center z-10 flex-col gap-6 md:p-8  p-4 lg:p-36">
        <TextType
          text={[t("hero.title")]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className="text-stone-100 text-2xl md:text-4xl lg:text-5xl font-bold"
        />
        <h2 className=" scale-up-left text-stone-300 text-lg  md:text-xl lg:text-2xl ">
          {t("hero.subtitle")}
        </h2>
        <FadeContent
          blur={true}
          duration={1000}
          easing="ease-out"
          initialOpacity={0}
          delay={4000}
        >
          {/* Anything placed inside this container will be fade into view */}
          {/* <div className="flex w-full flex-col sm:flex-row max-w-md gap-1  ">
            <input
              type="text"
              placeholder={t("hero.placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 w-[90%] self-center sm:w-auto px-4 py-2 rounded-md sm:rounded-r-none border bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primarry"
            />
            <button
              onClick={handleClickSearch}
              className="bg-primarry self-center sm:self-auto text-white px-4 py-2 rounded-sm sm:rounded-none sm:rounded-r-md hover:bg-primarry-hover hover:cursor-pointer transition-all"
            >
              {t("hero.searchBtn")}
            </button>
          </div> */}
          <div className="flex w-full flex-col sm:flex-row max-w-md gap-1">
            <input
              type="text"
              placeholder={t("hero.placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 w-[90%] self-center sm:w-auto px-4 py-2 rounded-md 
               sm:ltr:rounded-r-none sm:rtl:rounded-l-none 
               border bg-gray-100 border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-primarry"
            />
            <button
              onClick={handleClickSearch}
              className="bg-primarry self-center sm:self-auto text-white px-4 py-2 rounded-sm 
               sm:ltr:rounded-r-md sm:rtl:rounded-l-md 
               hover:bg-primarry-hover hover:cursor-pointer transition-all"
            >
              {t("hero.searchBtn")}
            </button>
          </div>
        </FadeContent>
      </div>
    </div>
  );
}
