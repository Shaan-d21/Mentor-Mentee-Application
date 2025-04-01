import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import MentorProfileComponent from './MentorProfile';
import CheckRequests from './CheckRequests';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', path: '/mentee-dashboard', component: Dashboard },
    { name: 'Mentor Profile', path: '/mentee-dashboard/mentor-profile', component: MentorProfileComponent },
    { name: 'Check Requests', path: '/mentee-dashboard/requests', component: CheckRequests },
  ];

  const CurrentComponent = navigation.find(item => item.path === location.pathname)?.component;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Mentee Dashboard</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-5 px-2">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                location.pathname === item.path
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ease-in-out ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <main className="p-4">
          {CurrentComponent && <CurrentComponent />}
        </main>
      </div>
    </div>
  );
};

export default Layout; 