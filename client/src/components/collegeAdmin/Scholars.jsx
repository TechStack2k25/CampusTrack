import React, { useState } from "react";
import {DataList} from "../Utils/index.js";
import { useDepartments } from "../../data/departments.js";
import { useAllCourses } from "../../data/allcourses.js";
import { useUsers } from "../../data/allUsers.js";
import { useSelector } from "react-redux";


const Scholars = () => {
  
  const { college }=useSelector((state)=>state.user?.user);
  // Fetching department, courses, and roles
  const [query, setQuery] = useState({
    college: college,
    department: "",
    role: "Student",
    course: "",
    name: "",
  });
  
  const { data: departments } = useDepartments(college);
  const { data: allCourses } = useAllCourses(query?.department?{_id:query?.department}: null);
  const { data:ScholarsData }= useUsers(query);

  // Defining Filters
  const ScholarsFilters = [
    { key: "college", label: "College", value: college?.id || "NIT_UP", enable: false },
    { key: "department", label: "Department", placeholder: "Search by department", options: departments, enable: true },
    { key: "course", label: "Course", placeholder: "Search by course", parent: "department", options: allCourses, enable: true },
  ];

  // Creating Options Object
  const options = ScholarsFilters.reduce((acc, filter) => {
    if (filter?.options) {
      acc[filter.key] = filter.options;
    }
    return acc;
  }, {});





  return (
    <DataList
      title="All Scholars"
      data={ScholarsData}
      filters={ScholarsFilters}
      options={options}
      query={query}
      setQuery={setQuery}
      itemsPerPage={3} // Customizable-> items per page
    />
  );
};

export default Scholars;
