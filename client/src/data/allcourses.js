import { useQuery } from "@tanstack/react-query";
import { courseService } from "../api/courseService";

export const useAllCourses = (data) => {
  return useQuery({
    queryKey: ["allcourses","department",data], 
    queryFn: ()=>courseService.getCourses(data),
    staleTime: 60000, // Keep data fresh for 60 sec
    cacheTime: 300000, // Cache for 5 mins
    refetchOnWindowFocus: false, // Prevent auto refetching on tab switch
    enabled: !!data,// may use Boolean(data?._id),
  });
};
