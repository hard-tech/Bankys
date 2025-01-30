import { useState } from 'react';
import { 
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineMessage,
  AiOutlineLogout,
  AiOutlineMenu,
  AiFillDollarCircle,
  AiOutlineBank,
  AiTwotoneBank
} from 'react-icons/ai';
import { IoStatsChart } from "react-icons/io5";
import { MenuItem } from '../type/common.types';
import { authService } from '../services/auth/auth.service';
import { Link, useNavigate } from 'react-router-dom';
import { constants } from '../utils/constants';
import Logo from '../assets/Bankys-Logo-removebg-preview.png';


type SideBarProps = {
  setIsSidebarOpen: (isOpen: boolean) => void;
};

const SideBar = ({ setIsSidebarOpen }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Home');
  const navigate = useNavigate();
  const menuItems: MenuItem[] = [
    { title: "Page d'acceuil", icon: <AiOutlineHome size={24} />, path: constants.ROUTES.HOME },
    { title: 'Dashboard', icon: <IoStatsChart size={24} />, path: constants.ROUTES.DASHBOARD },
    { title: 'Transactions', icon: <AiFillDollarCircle size={24} />, path: constants.ROUTES.TRANSACTIONS },
    { title: 'Mes comptes', icon: <AiTwotoneBank size={24} />, path: constants.ROUTES.ACCOUNTS },
    { title: 'Profile', icon: <AiOutlineUser size={24} />, path: constants.ROUTES.PROFILE },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsSidebarOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50  p-2 rounded-md bg-gray-800 text-white"
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`flex flex-col flex-shrink-0 h-screen 
        ${isOpen ? 'w-64' : 'w-20'} 
        bg-gray-900 text-white transition-all duration-300`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 border-b border-gray-800">
          <span className={`text-white font-bold ${!isOpen && 'hidden'} flex items-center space-x-4 text-2xl font-bold ms-12 mb-2`}>
            <span>BANKYS</span>
            <img src={Logo} alt="Logo" className="h-12" />
          </span>
        </div>

        {/* Menu Items */}
        <div className="flex-grow px-4 py-6">
          {menuItems.map((item, index) => (
            <Link to={item.path} className="ml-3 text-gray-300 ">
            <div
              key={index}
              className={`flex items-center cursor-pointer
                ${!isOpen ? 'justify-center' : 'justify-start'}
                p-3 mb-4 rounded-lg hover:bg-gray-800
                ${activeItem === item.title ? 'bg-gray-800' : ''}
                transition-all duration-200`}
              onClick={() => setActiveItem(item.title)}
            >
              <div className="text-gray-300">
                {item.icon}
              </div>
              {isOpen && (
                  <span className="ml-3">{item.title}</span>
                )}
            </div>
                </Link>
          ))}
        </div>

        {/* Logout Section */}
        <div className="px-4 pb-6" onClick={() => {authService.logout(); navigate(constants.ROUTES.LOGIN)}}>
          <div
            className={`flex items-center cursor-pointer
              ${!isOpen ? 'justify-center' : 'justify-start'}
              p-3 rounded-lg hover:bg-gray-800
              transition-all duration-200`}
          >
            <div className="text-gray-300">
              <AiOutlineLogout size={24} />
            </div>
            {isOpen && (
              <span className="ml-3 text-gray-300">
                Logout
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {/* Votre contenu principal ici */}
      </div>
    </div>
  );
};

export default SideBar;
