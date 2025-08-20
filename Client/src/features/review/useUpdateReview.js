import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReview } from "../../services/apiReview";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useUpdateReview(listingId) {
  const queryClient = useQueryClient();
    const { i18n } = useTranslation();
    const lang = i18n.language || "en"; 

  return useMutation({
    mutationFn: ({ reviewId, updatedData }) => updateReview(reviewId, updatedData),
    onSuccess: (res) => {
      const msg = res?.message?.[lang] || "Review updated successfully";
      toast.success(msg);
      if (listingId) {
        queryClient.invalidateQueries({ queryKey: ["reviews", listingId] });
      }
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err) => {
      const msg = err?.message?.[lang] || "Failed to update review";
      toast.error(msg);
    },
  });
}