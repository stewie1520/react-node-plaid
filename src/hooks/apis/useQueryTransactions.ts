import { useInfiniteQuery } from "@tanstack/react-query";
import { Transaction } from "plaid";

export const useQueryTransactions = ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["transactions", { page, perPage }],
    queryFn: async ({ pageParam = page }) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/api/transactions?page=${pageParam}&per_page=${perPage}`
      );
      return await response.json() as { items: Transaction[], has_more: boolean, page: number };
    },
    initialPageParam: page,
    getNextPageParam: (lastPage) => {
      return lastPage.has_more ? lastPage.page + 1 : undefined;
    },
  });
};
