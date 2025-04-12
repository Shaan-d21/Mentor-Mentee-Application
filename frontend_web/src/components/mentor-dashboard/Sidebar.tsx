import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

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
  { name: 'Mentee Requests', path: '/mentor/dashboard/requests', icon: <UserCheck size={20} /> },
  { name: 'My Mentees', path: '/mentor/dashboard/my-mentees', icon: <Users size={20} /> },
];

const menteeNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/mentee/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Find Mentors', path: '/mentee/dashboard/find-mentors', icon: <Users size={20} /> },
  { name: 'My Requests', path: '/mentee/dashboard/requests', icon: <UserCheck size={20} /> },
  { name: 'My Mentors', path: '/mentee/dashboard/my-mentors', icon: <Users size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  const { data: notifications = { reports: 0, messages: 0, requests: 0 } } = useQuery<NotificationCount>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        // This is a mock endpoint - in production replace with actual endpoint
        // const response = await axios.get(`/api/v1/${userRole}/notifications`);
        return { reports: 0, messages: 0, requests: 0 };
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return { reports: 0, messages: 0, requests: 0 };
      }
    },
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  // Get role directly from props instead of localStorage
  const isMentor = userRole === 'mentor';
  const navItems = isMentor ? mentorNavItems : menteeNavItems;

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`bg-slate-800 text-white shadow-lg transition-all duration-300 relative ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo or brand area */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-center h-16">
        {isCollapsed ? (
          <Menu size={24} className="text-white cursor-pointer" onClick={toggleSidebar} />
        ) : (
          <h1 className="text-lg font-bold text-white">Mentorship Platform</h1>
        )}
      </div>

      <nav className="mt-4">
        {navItems.map((item) => {
          // Check if current path starts with item.path (for nested routes)
          const isActive = location.pathname === item.path || 
                          (item.path !== `/${userRole}/dashboard` && location.pathname.startsWith(item.path));
          
          const hasNotification = item.name === 'Mentee Requests' && notifications.requests > 0;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 my-1 mx-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between ml-3 overflow-hidden">
                  <span className="truncate">{item.name}</span>
                  {hasNotification && (
                    <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ml-2">
                      {notifications.requests}
                    </span>
                  )}
                </div>
              )}
              
              {isCollapsed && hasNotification && (
                <span className="absolute right-1 top-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications.requests}
                </span>
              )}
            </Link>
          );
        })}
        
        {/* Toggle button after the navigation items */}
        <div className="flex justify-center mt-4 mb-2">
          <button
            onClick={toggleSidebar}
            className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-slate-600 hover:bg-slate-600 focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 