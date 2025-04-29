import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ChevronLeft,
  ChevronRight,
  UserSearch,
  Menu,
  Map,
  FileText,
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
  { name: 'Find Mentors', path: '/mentee/dashboard/find-mentors', icon: <UserSearch size={20} /> },
  { name: 'My Requests', path: '/mentee/dashboard/requests', icon: <UserCheck size={20} /> },
  { name: 'My Mentors', path: '/mentee/dashboard/my-mentors', icon: <Users size={20} /> },
  { name: 'My Roadmaps', path: '/mentee/dashboard/roadmaps', icon: <Map size={20} /> },
  { name: 'View Feedback', path: '/mentee/dashboard/view-feedback', icon: <FileText size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMentor = userRole === 'mentor';
  const navItems = isMentor ? mentorNavItems : menteeNavItems;

  // Function to check if the screen is mobile
  const isMobile = () => window.innerWidth <= 768;

  // Set initial collapsed state based on screen size and update on resize
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(isMobile());
    };

    // Set initial state
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    // Only allow toggling if not in mobile view
    if (!isMobile()) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className={`bg-slate-800 text-white shadow-lg transition-all duration-300 relative ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo or brand area */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between h-16">
        {isCollapsed ? (
          // Only show hamburger icon if not in mobile view
          !isMobile() && (
            <Menu size={24} className="text-white cursor-pointer" onClick={toggleSidebar} />
          )
        ) : (
          <>
            <h1 className="text-lg font-bold text-white">{isMentor ? "Mentor Dashboard" : "Mentee Dashboard"}</h1>
            {/* Only show toggle button if not in mobile view */}
            {!isMobile() && (
              <button
                style={{cursor: "pointer"}}
                onClick={toggleSidebar}
                className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-slate-600 hover:bg-slate-600 focus:outline-none"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            )}
          </>
        )}
      </div>

      <nav className="mt-4">
        {navItems.map((item) => {
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
    </div>
  );
};

export default Sidebar;