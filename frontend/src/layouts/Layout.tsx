import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
        <main className="flex flex-col justify-between items-center min-h-screen">
          <NavBar />
          <div className="m-8">
          {children}
          </div>
          <Footer />
        </main>
    </>
  );
};

export default Layout;
