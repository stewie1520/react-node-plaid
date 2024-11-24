import { useQuery, useQueryClient } from "@tanstack/react-query"

export const isLinkedQuery = () => ({
  queryKey: ["check_linked"],
  queryFn: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/check_linked`)
      const data = await response.json()
      return data.linked as boolean;
    } catch (error) {
      console.error("Error checking linked status:", error)
      return false;
    }
  }
});

export const useQueryIsLinked = () => {
  return useQuery(isLinkedQuery());
}

export const useInvalidateIsLinked = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({
    queryKey: ["check_linked"]
  });
}
