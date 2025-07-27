import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, //  sends HTTP-only cookies
});
