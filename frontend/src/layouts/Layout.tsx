import React from 'react';
import NavBar from '../components/NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
        <main className="flex flex-col justify-center items-center">
          <NavBar />
          {children}
        </main>
    </>
  );
};

export default Layout;
