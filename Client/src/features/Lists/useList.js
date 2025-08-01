import { useQuery } from "@tanstack/react-query";
import { getListById } from "../../services/apiLists";
import { useParams } from "react-router-dom";

export function useList() {
  const { id } = useParams();
  const {
    data: list,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listDetails"],
    queryFn: () => getListById(id),
  });

  return { list, isLoading, error };
}
