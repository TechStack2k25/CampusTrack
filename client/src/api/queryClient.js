import { QueryClient } from "@tanstack/react-query";


//react query client instance set-up
const queryClient=new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // Data stays fresh for 60 seconds
        cacheTime: 300000, // Cache data for 5 minutes
        refetchOnWindowFocus: false, // Prevent refetching on tab switch
        retry: 2, // Retry failed requests twice
        },
    },
});

export default queryClient;