import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteList as apiDeleteList } from "../../services/apiLists";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useDeleteList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate: deleteList, isPending } = useMutation({
    mutationFn: apiDeleteList,
    onSuccess: () => {
      toast.success(t("toast.List deleted succssfully"));
      queryClient.invalidateQueries({ queryKey: ["host-lists"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { deleteList, isPending };
}
