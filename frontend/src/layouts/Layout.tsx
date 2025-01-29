import React from 'react';
import Navbar from '../components/NavBar';
// import Sidebar from '../components/SideBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="">
      {/* <Sidebar /> */}
      <div className="justify-center flex flex-col items-center">
        <Navbar />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
