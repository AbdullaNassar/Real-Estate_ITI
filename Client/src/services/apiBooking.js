import bookingModel from "../../../Server/src/models/bookingModel";

import i18next from "i18next";
const lang = i18next.language || localStorage.getItem("i18nextLng") || "en";
// import { lang } from "../utils/constants";
import { axiosInstance } from "./axiosInstance";
import { getCurrentLanguage } from "../utils/constants";
export async function getCheckoutSession({ listId, checkIn, checkOut }) {
  try {
    const response = await axiosInstance.post(
      `/bookings/checkout-session/${listId}`,
      { checkIn, checkOut }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    const currentLang = getCurrentLanguage();
    const message = err?.response?.data?.message?.[currentLang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while checkout ");
  }
}

export async function getAllGuestBookings() {
  try {
    const res = await axiosInstance.get("/bookings/guest");
    return res.data;
  } catch (err) {
    console.log(err);
    const currentLang = getCurrentLanguage();
    const message = err?.response?.data?.message?.[currentLang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while get guest bookings");
  }
}

export async function getListBookings({ listId }) {
  try {
    const res = await axiosInstance.get(`/bookings/host/${listId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    const currentLang = getCurrentLanguage();
    const message = err?.response?.data?.message?.[currentLang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while get list bookings");
  }
}
