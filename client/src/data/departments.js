import { useQuery } from "@tanstack/react-query";
import { departmentService } from "../api/departmentService";

export const useDepartments = (college_id) => {
  return useQuery({
    queryKey: ["alldepartments",college_id || ""], 
    queryFn: ()=>departmentService.getAllDepartments({id:college_id}),
    staleTime: 60000, // Keep data fresh for 60 sec
    cacheTime: 300000, // Cache for 5 mins
    refetchOnWindowFocus: false, // Prevent auto refetching on tab switch
    enabled: !!college_id, // Run only if college_id is present
  });
};