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
