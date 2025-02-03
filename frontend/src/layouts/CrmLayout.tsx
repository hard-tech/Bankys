import React, { useState } from 'react';
import SideBar from '../components/SideBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`min-h-screen transition-all fixed duration-300`}>
        <SideBar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} overflow-y-auto`}>
        <div className="w-full flex flex-col items-center p-8">
          <div className="w-full max-w-6xl">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Layout;