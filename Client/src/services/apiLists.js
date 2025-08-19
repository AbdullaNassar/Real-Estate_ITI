import { GrCatalog } from "react-icons/gr";
import { getCurrentLanguage, PAGE_SIZE } from "../utils/constants";
import { axiosInstance } from "./axiosInstance";
import i18next from "i18next";
const lang = i18next.language || localStorage.getItem("i18nextLng") || "en";
export async function createList(newList) {
  try {
    const {
      title,
      descrption,
      pricePerNight,
      categoryId,
      address,
      longitude,
      latitude,
      governorate,
      amenitiesId,
      maxGustes,
      photos, // array of File objects
      arDescrption,
      arTitle,
    } = newList;
    const data = new FormData();
    data.append("title", title);
    data.append("descrption", descrption);
    data.append("pricePerNight", pricePerNight);
    data.append("categoryId", categoryId);
    data.append("address", address);
    data.append("longitude", longitude);
    data.append("latitude", latitude);
    data.append("governorate", governorate);
    data.append("maxGustes", maxGustes);
    data.append("arTitle", arTitle);
    data.append("arDescrption", arDescrption);
    amenitiesId.forEach((id) => data.append("amenitiesId[]", id));
    photos.forEach((file) => data.append("photos", file)); // multiple files with same key

    const res = await axiosInstance.post("/lists", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err?.response?.data?.message[lang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("error add list");
  }
}

export async function getAllLists({ page = 1, filter = {} }) {
  try {
    const res = await axiosInstance.get("/lists", {
      params: {
        page,
        limit: PAGE_SIZE,
        ...filter,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err?.response?.data?.message[lang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while get lists");
  }
}

export async function getListById(id) {
  try {
    const res = await axiosInstance.get(`/lists/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err?.response?.data?.message[lang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("error while fetch list by id ");
  }
}

export async function getListsByGovern() {
  try {
    const res = await axiosInstance.get("lists/governorate");
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err?.response?.data?.message[lang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error in load lists ");
  }
}

export async function searchLists(query) {
  try {
    const res = await axiosInstance.get(`/lists/search/?query=${query}`);
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err?.response?.data?.message[lang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while searching lists...");
  }
}

export async function getHostLists() {
  try {
    const res = await axiosInstance.get("/lists/hostLists");
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err?.response?.data?.message[lang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("error while get host lists");
  }
}

export async function deleteList(id) {
  try {
    const res = await axiosInstance.delete(`/lists/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err?.response?.data?.message[lang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while deleting List");
  }
}

export async function updateList({ id, data }) {
  try {
    const formData = new FormData();

    // Append fields to formData
    for (const key in data) {
      if (key === "photos") {
        // photos is an array of File objects
        data.photos.forEach((file) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(data[key])) {
        // If array (like amenitiesId), append each separately or stringify
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    }
    const response = await axiosInstance.patch(`lists/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    const currentLang = getCurrentLanguage();
    const message = err?.response?.data?.message?.[currentLang];
    if (message) {
      throw new Error(message);
    }
    throw new Error("Error while updating LIst");
  }
}
