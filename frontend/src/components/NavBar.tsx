import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  Dashboard,
  AccountBalance,
  Payment,
  Person,
  Menu,
  Close,
  Logout,
  PersonOutline
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Bankys-Logo-removebg-preview.png";
import { authService } from '../services/auth/auth.service';

const NavBar = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: "Home", path: "/", icon: <Home />, needAuth: false },
    { title: "Login", path: "/login", icon: <Person />, needAuth: false },
    { title: "Register", path: "/register", icon: <PersonOutline />, needAuth: false },
    { title: "Tableau de board", path: "/dashboard", icon: <Dashboard />, needAuth: true },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop NavBar */}
      <div className="hidden md:flex fixed top-0 w-full h-16 bg-[#1a1f2e] text-white z-50">
        <div className="flex items-center justify-between w-full px-6">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Bankys" className="h-8 w-8" />
            <span className="text-xl font-bold">BANKYS</span>
          </div>

          <nav className="flex-1 flex justify-center">
            <ul className="flex space-x-2">
              {menuItems.map((item) => (
                ((item.needAuth && isAuthenticated) || !item.needAuth) && (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg
                        transition-colors duration-200
                        ${isActiveRoute(item.path)
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                      `}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </nav>

          {isAuthenticated && (
            <button
              onClick={() => authService.logout()}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <Logout />
              <span>Déconnexion</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-[#1a1f2e] text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Bankys" className="h-8 w-8" />
            <span className="text-xl font-bold">BANKYS</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <Close /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`
          fixed inset-0 bg-black bg-opacity-50 transition-opacity
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div className={`
            fixed inset-y-0 right-0 w-64 bg-[#1a1f2e] transform transition-transform
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <div className="p-4">
              <nav className="mt-8">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    ((item.needAuth && isAuthenticated) || !item.needAuth) && (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg
                            transition-colors duration-200
                            ${isActiveRoute(item.path)
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                          `}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    )
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content Spacer */}
      <div className="h-16" />
    </>
  );
};

export default NavBar;
