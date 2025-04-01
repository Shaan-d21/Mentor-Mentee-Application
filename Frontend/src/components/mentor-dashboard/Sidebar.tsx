import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  BarChart2, 
  FolderOpen, 
  Calendar, 
  MessageSquare, 
  Settings,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface NotificationCount {
  reports: number;
  messages: number;
  requests: number;
}

interface SidebarProps {
  userRole: 'mentor' | 'mentee';
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const mentorNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/mentor/dashboard', icon: <LayoutDashboard size={20} /> },
  // { name: 'Profile', path: '/mentor/profile', icon: <User size={20} /> },
  { name: 'Mentee Requests', path: '/mentor/requests', icon: <UserCheck size={20} /> },
  { name: 'My Mentees', path: '/mentor/mentees', icon: <Users size={20} /> },
  // { name: 'Assignments', path: '/mentor/assignments', icon: <FileText size={20} /> },
  // { name: 'Reports', path: '/mentor/reports', icon: <BarChart2 size={20} /> },
  // { name: 'Documents', path: '/mentor/documents', icon: <FolderOpen size={20} /> },
  // { name: 'Calendar', path: '/mentor/calendar', icon: <Calendar size={20} /> },
  // { name: 'Messages', path: '/mentor/messages', icon: <MessageSquare size={20} /> },
  // { name: 'Settings', path: '/mentor/settings', icon: <Settings size={20} /> },
];

const menteeNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/mentee/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Profile', path: '/mentee/profile', icon: <User size={20} /> },
  { name: 'Find Mentors', path: '/mentee/dashboard/find-mentors', icon: <Users size={20} /> },
  { name: 'My Requests', path: '/mentee/dashboard/requests', icon: <FileText size={20} /> },
  { name: 'My Mentor', path: '/mentee/mentor', icon: <User size={20} /> },
  { name: 'Assignments', path: '/mentee/assignments', icon: <FileText size={20} /> },
  { name: 'Progress', path: '/mentee/progress', icon: <BarChart2 size={20} /> },
  { name: 'Documents', path: '/mentee/documents', icon: <FolderOpen size={20} /> },
  { name: 'Calendar', path: '/mentee/calendar', icon: <Calendar size={20} /> },
  { name: 'Messages', path: '/mentee/messages', icon: <MessageSquare size={20} /> },
  { name: 'Settings', path: '/mentee/settings', icon: <Settings size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  const { data: notifications = { reports: 0, messages: 0, requests: 0 } } = useQuery<NotificationCount>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/v1/${userRole}/notifications`);
        return response.data;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return { reports: 0, messages: 0, requests: 0 };
      }
    },
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const isMentor = userInfo?.role?.toLowerCase() === 'mentor';
  const navItems = isMentor ? mentorNavItems : menteeNavItems;

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const hasNotification = item.name === 'Mentee Requests' && notifications.requests > 0;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : ''
              }`}
            >
              {Icon}
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{item.name}</span>
                  {hasNotification && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications.requests}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 