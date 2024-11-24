import { QueryClient } from "@tanstack/react-query";
import { isLinkedQuery } from "../../hooks/apis";

export const loader =
  (queryClient: QueryClient) =>
  async () => {
    const query = isLinkedQuery()

    return await queryClient.ensureQueryData<boolean>(query);
  }