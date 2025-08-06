import { useQuery } from "@tanstack/react-query";
import { getAllGuestBookings } from "../../services/apiBooking";

export function useGuestBookings() {
  return useQuery({
    queryKey: ["guestBookings"],
    queryFn: getAllGuestBookings,
  });
}