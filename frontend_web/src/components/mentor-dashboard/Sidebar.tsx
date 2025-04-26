import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ChevronLeft,
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
  const [isMobileView, setIsMobileView] = useState(false);
  
  const isMentor = userRole === 'mentor';
  const navItems = isMentor ? mentorNavItems : menteeNavItems;

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // Common breakpoint for mobile
      setIsMobileView(mobile);
      
      // Auto-collapse on mobile view
      if (mobile) {
        setIsCollapsed(true);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    // In mobile view, don't allow expanding the sidebar
    if (!isMobileView) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div 
      className={`
        bg-slate-800 text-white shadow-lg transition-all duration-300 h-screen
        ${isMobileView ? 'w-16' : isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo or brand area */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between h-16">
        {(isCollapsed || isMobileView) ? (
          <Menu size={24} className="text-white cursor-pointer mx-auto" onClick={toggleSidebar} />
        ) : (
          <>
            <h1 className="text-lg font-bold text-white truncate">
              {isMentor ? "Mentor Dashboard" : "Mentee Dashboard"}
            </h1>
            
            <button
              onClick={toggleSidebar}
              className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-slate-600 hover:bg-slate-600 focus:outline-none"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
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
              } ${isMobileView && 'justify-center'}`} // Center icons in mobile view
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              
              {!isCollapsed && !isMobileView && (
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