import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg">
        <h1 className="text-7xl font-extrabold text-indigo-600 drop-shadow-lg">
          404
        </h1>
        <p className="text-2xl text-gray-900 mt-4 font-semibold">
          Oops! Page introuvable
        </p>
        <p className="text-gray-600 mt-2">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <Link
          className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md"
          to="/"
        >
          <AiOutlineHome className="mr-2 text-xl" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
