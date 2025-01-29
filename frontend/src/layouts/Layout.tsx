import React from 'react';
// import Sidebar from '../components/SideBar';
import NavBar from '../components/NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="">
      <NavBar />
      <div className="justify-center flex flex-col items-center">
        {/* <Navbar /> */}
        <main className="p-4 w-full text-center lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
