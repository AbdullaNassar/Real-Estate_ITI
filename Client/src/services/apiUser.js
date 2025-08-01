import { axiosInstance } from "./axiosInstance";

export async function getCurrentUser() {
  try {
    const response = await axiosInstance.get("/users/me"); // or "/users/me"
    return response.data;
  } catch (error) {
    if (
      error.response?.status === 401 ||
      error.response?.status === 404 || // Not authorized
      error.response?.data?.message?.includes("not authorized")
    ) {
      return null;
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function logout() {
  const res = await axiosInstance.post("/users/logout"); // or /auth/logout
  return res.data;
}
