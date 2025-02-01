import { useQuery } from "@tanstack/react-query";
import { requestService } from "../api/requestService"

export const useApprovals = () => {
  return useQuery({
    queryKey: ["allapprovals"], 
    queryFn: requestService.getAll,
    staleTime: 60000, // Keep data fresh for 60 sec
    cacheTime: 300000, // Cache for 5 mins
    refetchOnWindowFocus: false, // Prevent auto refetching on tab switch
  });
};