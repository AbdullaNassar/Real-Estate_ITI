import { useQuery } from "@tanstack/react-query";
import { getAllLists } from "../../services/apiLists";
export function useLists({ page = 1, filter = {} }) {
  console.log("filter", filter);
  const {
    data: lists,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lists", page, filter],
    queryFn: () => getAllLists({ page, filter }),
  });
  return { lists, isLoading, error, refetch };
}
