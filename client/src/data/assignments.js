import { useQuery } from "@tanstack/react-query";
import { taskService } from "../api/taskService";

export const useAssignments = (id="all") => {
  return useQuery({
    queryKey: ["allassignments",id], 
    queryFn: ()=>taskService.getAll({id}),
    staleTime: 60000, // Keep data fresh for 60 sec
    cacheTime: 300000, // Cache for 5 mins
    refetchOnWindowFocus: false, // Prevent auto refetching on tab switch
    enabled:!!id,
  });
};