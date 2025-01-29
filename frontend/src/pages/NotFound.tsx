import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="text-center bg-white p-10 rounded-2xl shadow-lg animate-fade-in">
      <h1 className="text-7xl font-extrabold text-blue-600 drop-shadow-md">
        404
      </h1>
      <p className="text-2xl text-gray-900 mt-4 font-semibold">
        Oops! Page introuvable
      </p>
      <p className="text-gray-700 mt-2">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        className="text-white-100 mt-6 inline-block px-6 py-3 bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
        to="/"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
