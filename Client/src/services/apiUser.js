// import { lang } from "../utils/constants";
import { getCurrentLanguage } from "../utils/constants";
import { axiosInstance } from "./axiosInstance";
import i18next from "i18next";
const lang = i18next.language || localStorage.getItem("i18nextLng") || "en";
export async function getCurrentUser() {
  try {
    const response = await axiosInstance.get("/users/me"); // or "/users/me"
    return response.data;
  } catch (error) {
    if (
      error.response?.status === 401 ||
      error.response?.status === 404 || // Not authorized
      error.response?.data?.message.en?.includes("not authorized")
    ) {
      return null;
    } else {
      console.log(error);
      const currentLang = getCurrentLanguage();
      const message = error?.response?.data?.message?.[currentLang];
      if (message) {
        throw new Error(message);
      }
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function logout() {
  const res = await axiosInstance.post("/users/logout"); // or /auth/logout
  return res.data;
}

export async function getFavsList() {
  try {
    const res = await axiosInstance.get("/users/favorites");
    return res.data;
  } catch (err) {
    console.log(err);
    const currentLang = getCurrentLanguage();
    const message = err?.response?.data?.message?.[currentLang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while get Favs Lists");
  }
}

export async function toggleFavList(id) {
  try {
    const res = await axiosInstance.post(`/users/toggle/${id}`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) throw new Error("Please Login First!");
    console.log(err);
    const currentLang = getCurrentLanguage();
    const message = err?.response?.data?.message?.[currentLang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while get Fav List");
  }
}
