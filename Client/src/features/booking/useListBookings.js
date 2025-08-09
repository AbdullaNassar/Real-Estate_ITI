import { useQuery } from "@tanstack/react-query";
import { getListBookings } from "../../services/apiBooking";

export function useListBookings(id) {
  return useQuery({
    queryKey: ["listBookings"],
    queryFn: () => getListBookings({ listId: id }),
  });
}
