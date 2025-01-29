import { useState } from 'react';
import { 
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineMessage,
  AiOutlineLogout,
  AiOutlineMenu
} from 'react-icons/ai';

interface MenuItem {
  title: string;
  icon: JSX.Element;
  path: string;
}

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Home');

  const menuItems: MenuItem[] = [ // TODO: mettre les items dans le fichier constants.ts
    { title: 'Home', icon: <AiOutlineHome size={24} />, path: '/' },
    { title: 'Profile', icon: <AiOutlineUser size={24} />, path: '/profile' },
    { title: 'Messages', icon: <AiOutlineMessage size={24} />, path: '/messages' },
    { title: 'Settings', icon: <AiOutlineSetting size={24} />, path: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-gray-800 text-white"
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
          <h1 className={`text-white font-bold ${!isOpen && 'hidden'}`}>
            LOGO
          </h1>
        </div>

        {/* Menu Items */}
        <div className="flex-grow px-4 py-6">
          {menuItems.map((item, index) => (
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
                <span className="ml-3 text-gray-300">
                  {item.title}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Logout Section */}
        <div className="px-4 pb-6">
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
