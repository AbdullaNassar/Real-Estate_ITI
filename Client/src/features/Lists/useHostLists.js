import { useQuery } from "@tanstack/react-query";
import { getHostLists } from "../../services/apiLists";

export function useHostLists() {
  return useQuery({
    queryKey: ["host-lists"],
    queryFn: getHostLists,
  });
}
