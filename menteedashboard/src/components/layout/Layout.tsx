import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <Sidebar />
      <Header />
      <main className="ml-[240px]">
        {children}
      </main>
    </div>
  );
};

export default Layout;