import { axiosInstance } from "./axiosInstance";

export const getAminites = async () => {
  try {
    const res = await axiosInstance.get("/amenities");
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("Unexpected error occurred");
  }
};
