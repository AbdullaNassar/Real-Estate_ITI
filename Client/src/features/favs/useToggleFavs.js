import { useMutation } from "@tanstack/react-query";
import { toggleFavList } from "../../services/apiUser";
import { toast } from "sonner";

export function useToggleFavs() {
  return useMutation({
    mutationFn: toggleFavList,
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
