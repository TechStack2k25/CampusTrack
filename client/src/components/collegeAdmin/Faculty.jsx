import React, { useState } from "react";
import {DataList} from "../Utils/index.js";
import { useDepartments } from "../../data/departments.js";
import { useAllCourses } from "../../data/allcourses.js";
import { useUsers } from "../../data/allUsers.js";
import { useDispatch, useSelector } from "react-redux";


const Faculty = () => {
  
  const { college }=useSelector((state)=>state.user?.user);
  const dispatch=useDispatch();
  // Fetching department, courses, and roles
  const [query, setQuery] = useState({
    college: college,
    department: "",
    role: "faculty",
    course: "",
    name: "",
  });
  
  const { data: departments } = useDepartments(college);
  const { data: allCourses } = useAllCourses(query?.department?{_id:query?.department}: null);
  const { data:facultyData }= useUsers(query);

  // Defining Filters
  const facultyFilters = [
    { key: "college", label: "College", value: college?.id || "NIT_UP", enable: false },
    { key: "department", label: "Department", placeholder: "Search by department", options: departments, enable: true },
    { key: "course", label: "Course", placeholder: "Search by course", parent: "department", options: allCourses, enable: true },
  ];

  // Creating Options Object
  const options = facultyFilters.reduce((acc, filter) => {
    if (filter?.options) {
      acc[filter.key] = filter.options;
    }
    return acc;
  }, {});


  const removeFaculty=async(student_id)=>{
   //todo
  }



  return (
    <DataList
      title="Faculty Members"
      data={facultyData}
      filters={facultyFilters}
      options={options}
      query={query}
      setQuery={setQuery}
      itemsPerPage={3} // Customizable-> items per page
      handleRemove={removeFaculty}
    />
  );
};

export default Faculty;
