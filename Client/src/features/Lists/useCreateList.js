import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createList as createListApi } from "../../services/apiLists";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useCreateList() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { mutate: createList, isPending } = useMutation({
    mutationFn: createListApi,
    onSuccess: () => {
      toast.success(t("toast.New List added succssfully"));
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createList, isPending };
}
