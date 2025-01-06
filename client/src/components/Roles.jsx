import React from "react";

function Roles() {
  return (
    <section id="roles" className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Who Can Use CampusTrack?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-indigo-100 p-6 rounded">
            <h3 className="text-2xl font-semibold mb-2">Students</h3>
            <p>Keep track of assignments, deadlines, and grades in one seamless interface.</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded">
            <h3 className="text-2xl font-semibold mb-2">Faculty</h3>
            <p>Create and manage assignments, release announcements, and monitor student progress.</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded">
            <h3 className="text-2xl font-semibold mb-2">Admins</h3>
            <p>Oversee platform usage, manage users, and ensure seamless operations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Roles;
