import { useQuery } from "@tanstack/react-query";
import { getListCategory } from "../../../services/apiListCategory";

export function useCategories() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listCategories"],
    queryFn: getListCategory,
  });
  return { categories, error, isLoading };
}
