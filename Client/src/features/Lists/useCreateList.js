import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createList as createListApi } from "../../services/apiLists";
import toast from "react-hot-toast";

export function useCreateList() {
  const queryClient = useQueryClient();
  const { mutate: createList, isPending } = useMutation({
    mutationFn: createListApi,
    onSuccess: () => {
      toast.success("New List added succssfully");
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createList, isPending };
}
