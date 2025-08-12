import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../../services/apiReview";
import toast from "react-hot-toast";

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
  onSuccess: () => {
    toast.success("Review deleted successfully");
    queryClient.invalidateQueries(["reviews"]); 
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete review";
      toast.error(message);
    },
  });
}