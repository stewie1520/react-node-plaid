import { useMutation } from "@tanstack/react-query";

export const useCommandCreateLinkToken = () => {
  return useMutation(
    {
      mutationFn: async () => {
        try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/create_link_token`, {
          method: "POST",
        });
        
          const { link_token } = await response.json();
          return link_token;
        } catch (err) {
          console.error('Error fetching link token:', err);
          throw new Error('Failed to fetch link token');
        }
      }
    }
  );
};
