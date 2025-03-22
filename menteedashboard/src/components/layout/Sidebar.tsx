import React from 'react';
import { ViewColumnsIcon, ClipboardDocumentListIcon, ClockIcon, InboxIcon, Cog6ToothIcon, DocumentIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Overview', icon: ViewColumnsIcon, current: true, badge: null },
  { name: 'Assignment', icon: ClipboardDocumentListIcon, current: false, badge: null },
  { name: 'Reports', icon: ClockIcon, current: false, badge: '12' },
  { name: 'File Storage', icon: DocumentIcon, current: false, badge: null },
  { name: 'Inbox', icon: InboxIcon, current: false, badge: '7' },
  { name: 'Settings', icon: Cog6ToothIcon, current: false, badge: null },
];

const Sidebar = () => {
  return (
    <div className="h-screen w-[240px] bg-[#F8F9FC] fixed left-0 top-0 border-r border-gray-100">
      <div className="px-6 py-8">
        <div className="flex items-center gap-2">
          <img src="/cube-logo.svg" alt="Promact" className="w-8 h-8" />
          <h1 className="text-xl font-semibold text-[#1C1C1C]">Promact</h1>
          <span className="text-orange-500 text-2xl">.</span>
        </div>
      </div>
      <nav className="px-4">
        {navigation.map((item) => (
          <button
            key={item.name}
            className={`flex items-center justify-between w-full px-4 py-3 my-1 text-sm font-medium rounded-lg transition-colors duration-150 ${
              item.current
                ? 'bg-[#1C1C1C] text-white'
                : 'text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.name}
            </div>
            {item.badge && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                item.name === 'Reports' ? 'bg-pink-100 text-pink-600' : 'bg-pink-500 text-white'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;