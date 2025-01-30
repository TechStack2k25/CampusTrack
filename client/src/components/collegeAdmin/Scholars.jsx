import React from "react";
import { DataList } from "../Utils/index.js";

const Scholars = () => {
  const scholarData = [
    { id: 1, name: "Jane Smith", role: "Scholar", department: "CS", semester: "5" },
    { id: 2, name: "Tom Wilson", role: "Scholar", department: "EE", semester: "3" },
    { id: 3, name: "Sarah Johnson", role: "Scholar", department: "CS", semester: "7" },
    { id: 4, name: "Chris Brown", role: "Scholar", department: "ME", semester: "5" },
    { id: 5, name: "Emily Davis", role: "Scholar", department: "EE", semester: "7" },
  ];

  const scholarFilters = [
    {
      key: "department",
      label: "Filter by Department",
      options: ["CS", "ME", "EE"],
    },
    {
      key: "semester",
      label: "Filter by Semester",
      options: ["3", "5", "7"],
    },
  ];

  return (
    <DataList title="Scholars"
      data={scholarData}
      filters={scholarFilters}
      itemsPerPage={4} // Customize items per page
    />
  );
};

export default Scholars;
