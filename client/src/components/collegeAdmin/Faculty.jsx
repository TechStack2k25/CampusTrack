import React from "react";
import {DataList} from "../Utils/index.js";

const Faculty = () => {
  const facultyData = [
    { id: 1, name: "Dr. John Doe", role: "Faculty", department: "CS" },
    { id: 2, name: "Dr. Alice Brown", role: "Faculty", department: "ME" },
    { id: 3, name: "Dr. Mark Lee", role: "Faculty", department: "EE" },
    { id: 4, name: "Dr. Emma Green", role: "Faculty", department: "CS" },
    { id: 5, name: "Dr. James White", role: "Faculty", department: "ME" },
    { id: 6, name: "Dr. Sophia Black", role: "Faculty", department: "EE" },
  ];

  const facultyFilters = [
    {
      key: "department",
      label: "Filter by Department",
      options: ["CS", "ME", "EE"],
    },
  ];


  return (
    <DataList
      title="Faculty Members"
      data={facultyData}
      filters={facultyFilters}
      itemsPerPage={3} // Customizable-> items per page
    />
  );
};

export default Faculty;
