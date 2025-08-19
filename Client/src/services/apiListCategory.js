// import { lang } from "../utils/constants";
import { getCurrentLanguage } from "../utils/constants";
import { axiosInstance } from "./axiosInstance";

import i18next from "i18next";
const lang = i18next.language || localStorage.getItem("i18nextLng") || "en";
export const getListCategory = async () => {
  try {
    const res = await axiosInstance.get("/categories");
    return res.data;
  } catch (err) {
    console.log(err);
    const currentLang = getCurrentLanguage();
    const message = err?.response?.data?.message?.[currentLang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("error happen while get categories list");
  }
};
