import React from 'react';
import type { Mentee } from '../types';

export default function Dashboard() {
  const [mentees] = React.useState<Mentee[]>([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      domain: ["Web Development", "Frontend"],
      status: "in_progress",
      progress: 0,
      comments: "Starting the course"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@example.com",
      domain: ["Backend Development", "API Design"],
      status: "in_progress",
      progress: 0,
      comments: "Beginning the journey"
    }
  ]);

  return (
    <div className="bg-[#CAF0F8] rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#07193E] mb-6">Approved Mentee List</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0077B6] text-white">
              <th className="px-6 py-3 text-left">Mentee Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Domain</th>
              <th className="px-6 py-3 text-left">Progress</th>
              <th className="px-6 py-3 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee) => (
              <tr key={mentee.id} className="border-b border-[#0077B6]/20 hover:bg-white/50">
                <td className="px-6 py-4">{mentee.name}</td>
                <td className="px-6 py-4">{mentee.email}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {mentee.domain.map((domain, index) => (
                      <span
                        key={index}
                        className="bg-[#0077B6] text-white px-2 py-1 rounded-full text-sm"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-[#E8B712]"
                        style={{ width: `${mentee.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-[#07193E]">{mentee.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">{mentee.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}