import { useQuery } from "@tanstack/react-query";
import { eventService } from "../api/eventService"

export const useEvents = () => {
  return useQuery({
    queryKey: ["allevents"], 
    queryFn: eventService.getAll,
    staleTime: 60000, // Keep data fresh for 60 sec
    cacheTime: 300000, // Cache for 5 mins
    refetchOnWindowFocus: false, // Prevent auto refetching on tab switch
  });
};