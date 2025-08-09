import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteList as apiDeleteList } from "../../services/apiLists";
import toast from "react-hot-toast";

export function useDeleteList() {
  const queryClient = useQueryClient();
  const { mutate: deleteList, isPending } = useMutation({
    mutationFn: apiDeleteList,
    onSuccess: () => {
      toast.success(" List deleted succssfully");
      queryClient.invalidateQueries({ queryKey: ["host-lists"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { deleteList, isPending };
}
