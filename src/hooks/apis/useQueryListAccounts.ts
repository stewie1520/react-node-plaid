import { useQuery } from "@tanstack/react-query";
import { AccountBase } from "plaid";

export const useQueryListAccounts = () => {
  return useQuery({
    queryKey: ['list-accounts'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/accounts`);
      const ret = await response.json() as { items: AccountBase[] };
      return ret.items;
    }
  })
};
