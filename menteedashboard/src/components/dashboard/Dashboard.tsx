import React from 'react';
import CourseCard from './CourseCard';
import StudyHoursChart from './StudyHoursChart';
import PerformanceGauge from './PerformanceGauge';
import Calendar from './Calendar';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const courses = [
  {
    title: 'Basic: HTML and CSS',
    icon: '💻',
    lessons: 24,
    files: 8,
    students: 99,
    bgColor: 'bg-[#EEF2FF]',
  },
  {
    title: 'Branding Design',
    icon: '🎨',
    lessons: 24,
    files: 8,
    students: 99,
    bgColor: 'bg-[#FFF7ED]',
  },
  {
    title: 'Motion Design',
    icon: '🎥',
    lessons: 24,
    files: 8,
    students: 99,
    bgColor: 'bg-[#ECFDF5]',
  },
];

const tasks = [
  {
    id: 1,
    title: 'Task 1',
    details: 'Details Lorem ipsum',
    time: '08:00 AM',
    subtasks: ['Subtask Task 1', 'Subtask Task 2'],
  },
  {
    id: 2,
    title: 'Task 2',
    details: 'Details Lorem ipsum',
    time: '08:00 AM',
  },
  {
    id: 3,
    title: 'Finished Task goes down',
    details: 'Details',
    time: '04:50 PM',
    completed: true,
  },
];

const Dashboard = () => {
  return (
    <div className="p-8 pt-28">
      <div className="grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-9 space-y-8">
          {/* Course Cards */}
          <div className="grid grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>

          {/* Hours Spent Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-[#1C1C1C]">Hours Spent</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-600">Study</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-200 rounded-full"></div>
                  <span className="text-gray-600">Tests</span>
                </div>
              </div>
            </div>
            <StudyHoursChart />
          </div>

          {/* Performance Section */}
          <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-[#1C1C1C]">Performance</h3>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-100">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
            <div className="flex justify-center">
              <PerformanceGauge value={8966} />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-8">
          {/* Calendar */}
          <Calendar />

          {/* To Do List */}
          <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <h3 className="font-semibold mb-6 text-[#1C1C1C]">To Do List</h3>
            <div className="space-y-6">
              {tasks.map((task) => (
                <div key={task.id} className={`${task.completed ? 'opacity-50' : ''}`}>
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      readOnly
                      className="mt-1 w-5 h-5 border-2 border-gray-300 rounded-md appearance-none cursor-pointer checked:bg-[#4ECCA7] checked:border-[#4ECCA7]" 
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-[#1C1C1C]">{task.title}</h4>
                        <span className="text-[#FB923C] text-sm">{task.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{task.details}</p>
                      {task.subtasks && (
                        <div className="mt-3 space-y-2">
                          {task.subtasks.map((subtask, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 border-2 border-gray-300 rounded appearance-none cursor-pointer checked:bg-[#4ECCA7] checked:border-[#4ECCA7]" 
                              />
                              <span className="text-sm text-gray-600">{subtask}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chatbot Button */}
          <button className="w-full bg-[#1C1C1C] hover:bg-[#1C1C1C]/90 text-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-colors duration-200">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span className="font-medium">AI Chatbot</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;