import { useQuery } from "@tanstack/react-query";
import { getFavsList } from "../../services/apiUser";

export function useFavsList() {
  return useQuery({
    queryKey: ["favs"],
    queryFn: getFavsList,
  });
}
