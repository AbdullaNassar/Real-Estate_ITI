// import { lang } from "../utils/constants";
import { getCurrentLanguage } from "../utils/constants";
import { axiosInstance } from "./axiosInstance";
import i18next from "i18next";
const lang = i18next.language || localStorage.getItem("i18nextLng") || "en";
export const getAminites = async () => {
  try {
    const res = await axiosInstance.get("/amenities");
    return res.data;
  } catch (err) {
    console.log(err);
    const currentLang = getCurrentLanguage();
    const message = err?.response?.data?.message?.[currentLang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
};
