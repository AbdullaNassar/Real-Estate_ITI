// export const BASE_URL = "http://localhost:8000/api/v1/";
export const BASE_URL = "https://maskan.up.railway.app/api/v1/";
export const PAGE_SIZE = 10;
import i18next from "i18next";
export const lang =
  localStorage.getItem("userLanguagePreference") ||
  localStorage.getItem("i18nextLng") ||
  "en";

export const getCurrentLanguage = () => {
  return i18next.language || localStorage.getItem("i18nextLng") || "en";
};

export const governmentList = [
  { name: "Cairo", arName: "القاهرة", _id: "Cairo" },
  { name: "Giza", arName: "الجيزة", _id: "Giza" },
  { name: "Alexandria", arName: "الإسكندرية", _id: "Alexandria" },
  { name: "Qalyubia", arName: "القليوبية", _id: "Qalyubia" },
  { name: "Port Said", arName: "بورسعيد", _id: "PortSaid" },
  { name: "Suez", arName: "السويس", _id: "Suez" },
  { name: "Dakahlia", arName: "الدقهلية", _id: "Dakahlia" },
  { name: "Sharqia", arName: "الشرقية", _id: "Sharqia" },
  { name: "Gharbia", arName: "الغربية", _id: "Gharbia" },
  { name: "Monufia", arName: "المنوفية", _id: "Monufia" },
  { name: "Beheira", arName: "البحيرة", _id: "Beheira" },
  { name: "Kafr El Sheikh", arName: "كفر الشيخ", _id: "KafrElSheikh" },
  { name: "Fayoum", arName: "الفيوم", _id: "Fayoum" },
  { name: "Beni Suef", arName: "بني سويف", _id: "BeniSuef" },
  { name: "Minya", arName: "المنيا", _id: "Minya" },
  { name: "Assiut", arName: "أسيوط", _id: "Assiut" },
  { name: "Sohag", arName: "سوهاج", _id: "Sohag" },
  { name: "Qena", arName: "قنا", _id: "Qena" },
  { name: "Luxor", arName: "الأقصر", _id: "Luxor" },
  { name: "Aswan", arName: "أسوان", _id: "Aswan" },
  { name: "Red Sea", arName: "البحر الأحمر", _id: "RedSea" },
  { name: "New Valley", arName: "الوادي الجديد", _id: "NewValley" },
  { name: "Matrouh", arName: "مطروح", _id: "Matrouh" },
  { name: "North Sinai", arName: "شمال سيناء", _id: "NorthSinai" },
  { name: "South Sinai", arName: "جنوب سيناء", _id: "SouthSinai" },
];

export const governments = {
  Cairo: { name: "Cairo", arName: "القاهرة" },
  Giza: { name: "Giza", arName: "الجيزة" },
  Alexandria: { name: "Alexandria", arName: "الإسكندرية" },
  Qalyubia: { name: "Qalyubia", arName: "القليوبية" },
  PortSaid: { name: "Port Said", arName: "بورسعيد" },
  Suez: { name: "Suez", arName: "السويس" },
  Dakahlia: { name: "Dakahlia", arName: "الدقهلية" },
  Sharqia: { name: "Sharqia", arName: "الشرقية" },
  Gharbia: { name: "Gharbia", arName: "الغربية" },
  Monufia: { name: "Monufia", arName: "المنوفية" },
  Beheira: { name: "Beheira", arName: "البحيرة" },
  KafrElSheikh: { name: "Kafr El Sheikh", arName: "كفر الشيخ" },
  Fayoum: { name: "Fayoum", arName: "الفيوم" },
  BeniSuef: { name: "Beni Suef", arName: "بني سويف" },
  Minya: { name: "Minya", arName: "المنيا" },
  Assiut: { name: "Assiut", arName: "أسيوط" },
  Sohag: { name: "Sohag", arName: "سوهاج" },
  Qena: { name: "Qena", arName: "قنا" },
  Luxor: { name: "Luxor", arName: "الأقصر" },
  Aswan: { name: "Aswan", arName: "أسوان" },
  RedSea: { name: "Red Sea", arName: "البحر الأحمر" },
  NewValley: { name: "New Valley", arName: "الوادي الجديد" },
  Matrouh: { name: "Matrouh", arName: "مطروح" },
  NorthSinai: { name: "North Sinai", arName: "شمال سيناء" },
  SouthSinai: { name: "South Sinai", arName: "جنوب سيناء" },
};
