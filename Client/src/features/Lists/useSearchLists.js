import { useQuery } from "@tanstack/react-query";
import { searchLists } from "../../services/apiLists"; // Adjust path as needed

export function useSearchLists(query, enabled = true) {
  return useQuery({
    queryKey: ["search-lists", query],
    queryFn: () => searchLists(query),
    enabled: !!query && enabled, // avoid running on empty query
  });
}
