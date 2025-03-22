import React from 'react';
import { MagnifyingGlassIcon, BellIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="h-24 bg-white fixed top-0 right-0 left-[240px] z-10 border-b border-gray-100">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left section with greeting */}
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Hello Mentee <span className="text-2xl">👋</span></h1>
          <p className="text-sm text-gray-500 mt-1">Let's learn something new today!</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="w-[320px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search from courses..."
                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 bg-white text-sm"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2">
            <BellIcon className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
              Profile
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;