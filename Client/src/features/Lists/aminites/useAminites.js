import { useQuery } from "@tanstack/react-query";
import { getAminites } from "../../../services/apiAmities";

export function useAminites() {
  const {
    data: amenities,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["aminites"],
    queryFn: getAminites,
  });

  return { amenities, error, isLoading };
}
