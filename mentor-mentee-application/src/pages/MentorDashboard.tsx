import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AssignmentTable from "../components/AssignmentTable";
import Attendance from "../components/Attendance";
import Books from "../components/Books";
import Documents from "../components/Documents";
import MessageBox from "../components/MessageBox";
import SessionCard from "../components/SessionCard";

const MentorDashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="p-4 grid grid-cols-2 gap-4">
          <AssignmentTable />
          <Attendance />
          <Books />
          <Documents />
          <MessageBox />
          <SessionCard />
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
