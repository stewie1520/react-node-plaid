import { useMutation } from "@tanstack/react-query";
import { useInvalidateIsLinked } from "./useQueryIsLinked";

export const useCommandExchangePublicToken = () => {
  const invalidateIsLink = useInvalidateIsLinked();

  return useMutation({
    mutationFn: async (publicToken: string) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/exchange_public_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicToken }),
        });

        return response.ok;
      } catch (err) {
        console.error("Error exchanging public token:", err);
        return false;
      }
    },
    onSuccess: async () => {
      await invalidateIsLink();
    }
  });
}
