import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { constants } from "../utils/constants";
import Logo from "../assets/Bankys-Logo-removebg-preview.png";

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const handleShadow = () => {
      setShadow(window.scrollY >= 90);
    };
    window.addEventListener("scroll", handleShadow);
    return () => window.removeEventListener("scroll", handleShadow);
  }, []);

  const menuItems = constants.MENU_ITEMS;

  return (
    <nav
      className={`w-full h-20 z-50 fixed bg-white ${shadow ? "shadow-xl" : ""}`}
    >
      <div className="flex justify-between items-center w-full h-full px-6 2xl:px-16">
        {/* Logo cliquable vers l'accueil */}
        <Link to="/">
          <img
            src={Logo}
            alt="Bankys Logo"
            className="h-12 w-12 cursor-pointer"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="text-sm uppercase font-medium text-gray-700 hover:text-indigo-600 transition"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Icon */}
        <div onClick={handleNav} className="md:hidden cursor-pointer">
          <AiOutlineMenu size={25} />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {nav && (
        <div
          className="md:hidden fixed left-0 top-0 w-full h-screen bg-black/70"
          onClick={handleNav}
        />
      )}

      {/* Mobile Menu Content */}
      <div
        className={`fixed left-0 top-0 w-3/4 sm:w-1/2 md:w-1/3 h-screen bg-white p-10 transform ${
          nav ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Bankys</h1>
          <AiOutlineClose
            size={25}
            className="cursor-pointer"
            onClick={handleNav}
          />
        </div>
        <ul className="mt-6 space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="block text-lg text-gray-800 hover:text-indigo-600 transition"
                onClick={handleNav}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
