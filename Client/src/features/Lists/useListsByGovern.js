import { useQuery } from "@tanstack/react-query";
import { getListsByGovern } from "../../services/apiLists";

export function useListsByGovern() {
  return useQuery({
    queryKey: ["listsByGovern"],
    queryFn: getListsByGovern,
    staleTime: 1000 * 60 * 5, // optional: cache for 5 mins
  });
}
