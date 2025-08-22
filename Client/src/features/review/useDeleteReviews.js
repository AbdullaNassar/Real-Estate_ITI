import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../../services/apiReview";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useDeleteReview() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: (res) => {
      const msg = res?.message?.[lang] || "Deleted successfully";
      toast.success(msg);
      queryClient.invalidateQueries(["reviews"]);
    },
    onError: (err) => {
      const msg = err?.message?.[lang] || "failed to delete review";
      toast.error(msg);
    },
  });
}
