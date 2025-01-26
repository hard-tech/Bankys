import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener('scroll', handleShadow);
    return () => window.removeEventListener('scroll', handleShadow);
  }, []);

  const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Services', path: '/services' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <div className={`fixed w-full h-20 z-[100] ${
      shadow ? 'shadow-xl' : ''
    } bg-white`}>
      <div className="flex justify-between items-center w-full h-full px-6 2xl:px-16">
        <h1 className="font-bold text-2xl">LOGO</h1>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex">
          <ul className="hidden md:flex">
            {menuItems.map((item, index) => (
              <li key={index} className="ml-10 text-sm uppercase hover:text-gray-600">
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Icon */}
        <div onClick={handleNav} className="md:hidden cursor-pointer">
          <AiOutlineMenu size={25} />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={
        nav 
          ? 'md:hidden fixed left-0 top-0 w-full h-screen bg-black/70' 
          : ''
      }>
        <div className={
          nav
            ? 'fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-white p-10 ease-in duration-500'
            : 'fixed left-[-100%] top-0 p-10 ease-in duration-500'
        }>
          <div className="flex w-full items-center justify-between">
            <h1 className="font-bold text-2xl">LOGO</h1>
            <div onClick={handleNav} className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer">
              <AiOutlineClose />
            </div>
          </div>
          <div className="py-4 flex flex-col">
            <ul className="uppercase">
              {menuItems.map((item, index) => (
                <li key={index} className="py-4 text-sm hover:text-gray-600">
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;