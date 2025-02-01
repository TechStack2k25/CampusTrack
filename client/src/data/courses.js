import { useQuery } from "@tanstack/react-query";
import { courseService } from "../api/courseService";

export const useCourses = () => {
  return useQuery({
    queryKey: ["allcourses"], 
    queryFn: courseService.getUserCourses,
    staleTime: 60000, // Keep data fresh for 60 sec
    cacheTime: 300000, // Cache for 5 mins
    refetchOnWindowFocus: false, // Prevent auto refetching on tab switch
  });
};


// export const courses = [
//     {
//       id: 1,
//       name: "Data Structures and Algorithms",
//       instructor: "Dr. John Doe",
//       credits: 3,
//       schedule: "Mon, Wed, Fri - 10:00 AM to 11:30 AM",
//     },
//     {
//       id: 2,
//       name: "Operating Systems",
//       instructor: "Dr. Jane Smith",
//       credits: 4,
//       schedule: "Tue, Thu - 2:00 PM to 3:30 PM",
//     },
//     {
//       id: 3,
//       name: "Database Management Systems",
//       instructor: "Dr. Emily Brown",
//       credits: 3,
//       schedule: "Mon, Wed, Fri - 12:00 PM to 1:30 PM",
//     },
//   ];
  