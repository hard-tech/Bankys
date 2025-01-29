import React from "react";
import Navbar from "../components/NavBar";
// import Sidebar from '../components/SideBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="">
      {/* <Sidebar /> */}
      <div className="">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
