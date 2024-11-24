import { useMutation } from "@tanstack/react-query";
import { useInvalidateIsLinked } from "./useQueryIsLinked";

export const useCommandDeleteLink = () => {
  const invalidateIsLink = useInvalidateIsLinked();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/clear_link`, {
          method: "DELETE",
        });

        const { isSuccess } = await response.json();
        return isSuccess as boolean;
      } catch (err) {
        console.error("Error deleting link:", err);
        return false;
      }
    },
    onSuccess: async () => {
      await invalidateIsLink();
    }
  });
}
