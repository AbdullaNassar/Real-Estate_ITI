import { GrCatalog } from "react-icons/gr";
import { PAGE_SIZE } from "../utils/constants";
import { axiosInstance } from "./axiosInstance";

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
    const message = err?.response?.data?.error;
    if (message) throw new Error(message);
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
    throw new Error("Error while get lists");
  }
}

export async function getListById(id) {
  try {
    const res = await axiosInstance.get(`/lists/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("error while fetch list by id ");
  }
}

export async function getListsByGovern() {
  try {
    const res = await axiosInstance.get("lists/governorate");
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.error;
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
    const message = err.response?.data?.message;
    if (message) throw new Error(message);
    throw new Error("Error while searching lists...");
  }
}

export async function getHostLists() {
  try {
    const res = await axiosInstance.get("/lists/hostLists");
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message;
    if (message) throw new Error(message);
    console.log(err);
    throw new Error("error while get host lists");
  }
}

export async function deleteList(id) {
  try {
    const res = await axiosInstance.delete(`/lists/${id}`);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message;
    if (message) throw new Error(message);
    throw new Error("Error while deleting List");
  }
}
