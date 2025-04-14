import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ChevronLeft,
  ChevronRight,
  Menu,
  Map
} from 'lucide-react';

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
  { name: 'Generate Roadmap', path: '/mentor/dashboard/generate-roadmap', icon: <Map size={20} /> },
];

const menteeNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/mentee/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Find Mentors', path: '/mentee/dashboard/find-mentors', icon: <Users size={20} /> },
  { name: 'My Requests', path: '/mentee/dashboard/requests', icon: <UserCheck size={20} /> },
  { name: 'My Mentors', path: '/mentee/dashboard/my-mentors', icon: <Users size={20} /> },
  { name: 'My Roadmaps', path: '/mentee/dashboard/roadmaps', icon: <Map size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  // const { data: notifications = { reports: 0, messages: 0, requests: 0 } } = useQuery<NotificationCount>({
  //   queryKey: ['notifications'],
  //   queryFn: fetchNotifications,
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  // });

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
          <h1 className="text-lg font-bold text-white">{isMentor ? "Mentor Dashboard" : "Mentee Dashboard"}</h1>
        )}
      </div>

      <nav className="mt-4">
        {navItems.map((item) => {
          // Check if current path starts with item.path (for nested routes)
          const isActive = location.pathname === item.path || 
                          (item.path !== `/${userRole}/dashboard` && location.pathname.startsWith(item.path));
          
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
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle button at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 flex justify-center">
        <button
          onClick={toggleSidebar}
          className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-slate-600 hover:bg-slate-600 focus:outline-none"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 