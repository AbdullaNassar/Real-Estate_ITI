import { useQuery } from "@tanstack/react-query";
import { getPublicUserInfo } from "../../services/apiUser";
import { useParams } from "react-router-dom";

export function useUserPublic() {
  const { id } = useParams();
  return useQuery({
    queryKey: ["user-public"],
    queryFn: () => getPublicUserInfo(id),
  });
}
