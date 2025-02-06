import { useQuery } from "@tanstack/react-query";
import { userService } from "../api/userService";

// use infiniteQueryHook

export const useUsers = (data) => {
    return useQuery({
        queryKey: ["allusers",data], 
        queryFn: ()=>userService.getUsers(data),
        staleTime: 60000, // Keep data fresh for 60 sec
        cacheTime: 300000, // Cache for 5 mins
        refetchOnWindowFocus: false, // Prevent auto refetching on tab switch
        enabled: !!data,
      });
};