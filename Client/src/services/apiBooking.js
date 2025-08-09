import bookingModel from "../../../Server/src/models/bookingModel";
import { axiosInstance } from "./axiosInstance";

export async function getCheckoutSession({ listId, checkIn, checkOut }) {
  try {
    const response = await axiosInstance.post(
      `/bookings/checkout-session/${listId}`,
      { checkIn, checkOut }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    const message =
      error.response?.data?.message || "Failed to get checkout session";
    throw new Error(message);
  }
}

export async function getAllGuestBookings() {
  try {
    const res = await axiosInstance.get("/bookings/guest");
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err.response?.data?.message;
    if (message) throw new Error(message);
    throw new Error("Error while get guest bookings");
  }
}

export async function getListBookings({ listId }) {
  try {
    const res = await axiosInstance.get(`/bookings/host/${listId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    const message = err.response?.data?.message;
    if (message) throw new Error(message);
    throw new Error("Error while get list bookings");
  }
}
