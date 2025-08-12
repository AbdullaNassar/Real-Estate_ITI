import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReview } from "../../services/apiReview";
import toast from "react-hot-toast";

export function useUpdateReview(listingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, updatedData }) => updateReview(reviewId, updatedData),
    onSuccess: () => {
      toast.success("Review updated");
      if (listingId) {
        queryClient.invalidateQueries({ queryKey: ["reviews", listingId] });
      }
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update review");
    },
  });
}