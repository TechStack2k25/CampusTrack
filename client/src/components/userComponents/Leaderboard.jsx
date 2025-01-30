import React from "react";

const Leaderboard = () => {
  // Sample student data
  const students = [
    { id: 1, name: "John Doe", score: 98, rank: 1 },
    { id: 2, name: "Jane Smith", score: 94, rank: 2 },
    { id: 3, name: "Michael Lee", score: 90, rank: 3 },
    { id: 4, name: "Emily Davis", score: 85, rank: 4 },
    { id: 5, name: "Chris Brown", score: 82, rank: 5 },
  ];

  const rankClasses = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400 text-black hover:bg-gray-100";
      case 2:
        return "bg-orange-400 text-black hover:bg-gray-100";
      case 3:
        return "bg-amber-400 text-white hover:text-black hover:bg-gray-100";
      default:
        return "bg-blue-100 text-black hover:bg-gray-100";
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 text-gray-800">

      {/* Leaderboard Header */}
      <header className="text-center py-10">
        <h2 className="text-4xl font-bold">Student Leaderboard</h2>
        <p className="text-gray-600">Recognizing the top performers in our campus</p>
      </header>

      {/* Leaderboard Table */}
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={`border-b ${rankClasses(
                    student.rank
                  )}`}
                >
                  <td className="py-3 px-4 text-center font-bold">{student.rank}</td>
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
