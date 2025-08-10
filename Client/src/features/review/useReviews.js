import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../../services/apiReview";

export function useReviews(listingId) {
  return useQuery({
    queryKey: ["reviews", listingId],
    queryFn: () => getReviews(listingId),
  });
}