import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateList } from "../../services/apiLists";

export function useUpdateList() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateList,
    onSuccess: () => {
      // queryClient.invalidateQueries(["listDetails", "lists"]);
    },
    onError: (error) => {
      console.error("Update list failed:", error.message);
    },
  });
  return { mutate, isPending };
}
