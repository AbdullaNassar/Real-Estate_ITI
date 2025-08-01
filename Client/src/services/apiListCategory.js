import { axiosInstance } from "./axiosInstance";

export const getListCategory = async () => {
  try {
    const res = await axiosInstance.get("/categories");
    return res.data;
  } catch (err) {
    console.log(err);
    if (err?.response?.status === 403) {
      throw new Error("you don't have access, you must be owner");
    }
    throw new Error("error happen while get categories list");
  }
};
