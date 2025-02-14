export const scholarMenu = [
    { name: 'Dashboard', link: '/dashboard',roles:["User","Student"] },
    { name: 'Courses', link: '/courses',roles:["Student"]  },
    { name: 'Assignments', link: '/assignments',roles:["Student"]  },
    { name: 'Events', link: '/events',roles:["User","Student"]  },
    { name: 'Schedule', link: '/schedule',roles:["User","Student"]  },
    // { name: 'Lectures', link: '/lectures',roles:["Student"]  },
    { name: 'Leaderboard', link: '/leaderboard',roles:["Student"]  },
    // { name: 'Notifications', link: '/notifications',roles:["Student"]  },
    // { name: 'Challenges', link: '/challenges' },
  ];

export const facultyMenu = [
  { name: 'Dashboard', link: '/dashboard',roles:["faculty","HOD"]  },
  { name: 'Courses', link: '/courses',roles:["faculty","HOD"]  },
  { name: 'Assignments', link: '/assignments',roles:["faculty"]  },
  { name: 'Events', link: '/events',roles:["faculty","HOD"]  },
  { name: 'Schedule', link: '/schedule',roles:["faculty","HOD"]  },
  { name: 'Attendance', link: '/attendance',roles:["faculty"]  },
  { name: 'Submissions', link: '/submissions',roles:["faculty"]  },
  { name: 'Approvals', link: '/approvals',roles:["HOD","faculty"]  },
  // { name: 'Notifications', link: '/notifications',roles:["faculty","HOD"]  },
];


export const adminMenu = [
  { name: 'Dashboard', link: '/dashboard' },
  { name: 'Departments', link: '/Departments' },
  { name: 'Faculty', link: '/faculty' },
  { name: 'Scholars', link: '/scholars' },
  { name: 'Events', link: '/events' },
  { name: 'Schedule', link: '/schedule' },
  { name: 'Approvals', link: '/approvals' },
  // { name: 'Notifications', link: '/notifications' },
];