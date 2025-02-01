import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuItem } from '../type/common.types';
import { authService } from '../services/auth/auth.service';
import { constants } from '../utils/constants';
import Logo from '../assets/Bankys-Logo-removebg-preview.png';
import { FaUserFriends } from 'react-icons/fa';
import {
  Home,
  Dashboard,
  AccountBalance,
  Person,
  Menu,
  Logout,
  Payment
} from '@mui/icons-material';

type SideBarProps = {
  setIsSidebarOpen: (isOpen: boolean) => void;
};

const SideBar = ({ setIsSidebarOpen }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { 
      title: "Page d'accueil", 
      icon: <Home />, 
      path: constants.ROUTES.HOME 
    },
    { 
      title: 'Dashboard', 
      icon: <Dashboard />, 
      path: constants.ROUTES.DASHBOARD 
    },
    { 
      title: 'Transactions', 
      icon: <Payment />, 
      path: constants.ROUTES.TRANSACTIONS 
    },
    { 
      title: 'Mes comptes', 
      icon: <AccountBalance />, 
      path: constants.ROUTES.ACCOUNTS 
    },
    {
      title: 'Beneficiaires',
      icon: <FaUserFriends />,
      path: constants.ROUTES.BENEFICIAIRES
    },
    { 
      title: 'Profile', 
      icon: <Person />, 
      path: constants.ROUTES.PROFILE 
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsSidebarOpen(!isOpen);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen">
      <div
        className={`
          fixed inset-y-0 left-0
          flex flex-col
          ${isOpen ? 'w-64' : 'w-20'}
          bg-[#1a1f2e]
          transition-all duration-300
          z-50
        `}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800"
          >
            <img src={Logo} alt="Bankys" className="h-8 w-8" />
          </button>
          {isOpen && (
            <div className="flex items-center ml-4 space-x-3">
              {/* <img src={Logo} alt="Bankys" className="h-8 w-8" /> */}
              <span className="text-white text-2xl font-bold">BANKYS</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-3 py-2 rounded-lg
                transition-colors duration-200
                ${isActiveRoute(item.path)
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="ml-4">{item.title}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2">
          <button
            onClick={() => {
              authService.logout();
              navigate(constants.ROUTES.LOGIN);
            }}
            className="
              flex items-center w-full px-3 py-2 rounded-lg
              text-gray-400 hover:bg-gray-800 hover:text-white
              transition-colors duration-200
            "
          >
            <Logout />
            {isOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Spacer */}
      <div className={`flex-1 ${isOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default SideBar;