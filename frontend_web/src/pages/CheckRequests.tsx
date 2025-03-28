import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { Mentee } from '../types';

export default function CheckRequests() {
  const [requests] = React.useState<Mentee[]>([
    {
      id: 1,
      name: "Amit Patel",
      email: "amit@example.com",
      domain: ["Web Development"],
      status: "pending",
      progress: 0,
      comments: "Interested in learning web development"
    },
    {
      id: 2,
      name: "Neha Gupta",
      email: "neha@example.com",
      domain: ["Full Stack Development"],
      status: "pending",
      progress: 0,
      comments: "Looking for guidance in full stack development"
    }
  ]);

  const handleApprove = (id: number) => {
    console.log('Approved request:', id);
  };

  const handleReject = (id: number) => {
    console.log('Rejected request:', id);
  };

  return (
    <div className="bg-[#CAF0F8] rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#07193E] mb-6">Mentee Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0077B6] text-white">
              <th className="px-6 py-3 text-left">Mentee Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Domain</th>
              <th className="px-6 py-3 text-left">Comments</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-[#0077B6]/20 hover:bg-white/50">
                <td className="px-6 py-4">{request.name}</td>
                <td className="px-6 py-4">{request.email}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {request.domain.map((domain, index) => (
                      <span
                        key={index}
                        className="bg-[#0077B6] text-white px-2 py-1 rounded-full text-sm"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">{request.comments}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="p-2 text-[#0077B6] hover:text-[#07193E] transition-colors"
                      title="Approve"
                    >
                      <CheckCircle2 size={24} />
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Reject"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}