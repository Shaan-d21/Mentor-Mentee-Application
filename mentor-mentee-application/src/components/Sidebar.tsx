import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 h-screen">
      <ul>
        <li className="mb-4"><a href="#" className="hover:underline">Dashboard</a></li>
        <li className="mb-4"><a href="#" className="hover:underline">Assignments</a></li>
        <li className="mb-4"><a href="#" className="hover:underline">Attendance</a></li>
        <li className="mb-4"><a href="#" className="hover:underline">Books</a></li>
        <li className="mb-4"><a href="#" className="hover:underline">Documents</a></li>
        <li className="mb-4"><a href="#" className="hover:underline">Messages</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
